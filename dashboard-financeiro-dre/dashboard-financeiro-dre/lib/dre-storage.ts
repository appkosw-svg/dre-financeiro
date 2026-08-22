import { MONTH_COUNT, type DreDoc, type Group, zeros } from '@/lib/dre-model'

const KEY = 'dre-dashboard:v1'

export type DreStore = Record<string, DreDoc>

type Persisted = {
  version: 1
  savedAt: string
  docs: DreStore
}

const isBrowser = () => typeof window !== 'undefined'

/** Normaliza o que veio do LocalStorage: nunca confiar na forma do JSON. */
function sanitizeDoc(input: unknown): DreDoc | null {
  if (!input || typeof input !== 'object') return null
  const raw = input as { groups?: unknown; values?: unknown }
  if (!Array.isArray(raw.groups)) return null

  const groups: Group[] = []
  for (const item of raw.groups) {
    if (!item || typeof item !== 'object') continue
    const group = item as Partial<Group>
    if (typeof group.id !== 'string' || typeof group.label !== 'string') continue
    groups.push({
      id: group.id,
      label: group.label,
      sign: group.sign === 'in' ? 'in' : 'out',
      variable: group.variable === true,
      accounts: Array.isArray(group.accounts)
        ? group.accounts.flatMap((entry) => {
            const account = entry as Partial<{ id: string; label: string }>
            if (typeof account?.id !== 'string') return []
            return [{ id: account.id, label: String(account.label ?? '') }]
          })
        : [],
    })
  }
  if (groups.length === 0) return null

  const values: DreDoc['values'] = {}
  const source = (raw.values ?? {}) as Record<string, unknown>
  for (const group of groups) {
    for (const account of group.accounts) {
      const row = source[account.id]
      const base = zeros()
      if (Array.isArray(row)) {
        for (let index = 0; index < MONTH_COUNT; index += 1) {
          const value = Number(row[index])
          base[index] = Number.isFinite(value) ? value : 0
        }
      }
      values[account.id] = base
    }
  }

  return { groups, values }
}

export function loadStore(): { docs: DreStore; savedAt: string | null } {
  if (!isBrowser()) return { docs: {}, savedAt: null }
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return { docs: {}, savedAt: null }
    const parsed = JSON.parse(raw) as Partial<Persisted>
    const docs: DreStore = {}
    for (const [year, doc] of Object.entries(parsed.docs ?? {})) {
      const clean = sanitizeDoc(doc)
      if (clean) docs[year] = clean
    }
    return { docs, savedAt: parsed.savedAt ?? null }
  } catch (error) {
    console.log('[v0] falha ao ler o DRE salvo:', error)
    return { docs: {}, savedAt: null }
  }
}

export function saveStore(docs: DreStore) {
  if (!isBrowser()) return null
  const savedAt = new Date().toISOString()
  const payload: Persisted = { version: 1, savedAt, docs }
  try {
    window.localStorage.setItem(KEY, JSON.stringify(payload))
    return savedAt
  } catch (error) {
    console.log('[v0] falha ao salvar o DRE:', error)
    return null
  }
}

export function clearStore() {
  if (!isBrowser()) return
  window.localStorage.removeItem(KEY)
}
