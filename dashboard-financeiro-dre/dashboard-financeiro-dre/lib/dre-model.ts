export const MONTHS = [
  { key: '01', short: 'Jan', label: 'Janeiro' },
  { key: '02', short: 'Fev', label: 'Fevereiro' },
  { key: '03', short: 'Mar', label: 'Março' },
  { key: '04', short: 'Abr', label: 'Abril' },
  { key: '05', short: 'Mai', label: 'Maio' },
  { key: '06', short: 'Jun', label: 'Junho' },
  { key: '07', short: 'Jul', label: 'Julho' },
  { key: '08', short: 'Ago', label: 'Agosto' },
  { key: '09', short: 'Set', label: 'Setembro' },
  { key: '10', short: 'Out', label: 'Outubro' },
  { key: '11', short: 'Nov', label: 'Novembro' },
  { key: '12', short: 'Dez', label: 'Dezembro' },
] as const

export const MONTH_COUNT = MONTHS.length

export const YEARS = ['2027', '2026', '2025', '2024']

/** Conta lançável: o usuário digita os 12 valores e pode renomear ou excluir. */
export type Account = {
  id: string
  label: string
}

/** Grupo de contas somadas em uma linha totalizadora. */
export type Group = {
  id: string
  label: string
  /** entrada soma no resultado, saída subtrai */
  sign: 'in' | 'out'
  /** custo/despesa variável: entra no cálculo da margem de contribuição */
  variable?: boolean
  accounts: Account[]
}

/** Valores digitáveis: 12 posições por conta (Jan..Dez). */
export type DreValues = Record<string, number[]>

/** Documento completo de um exercício: estrutura + lançamentos. */
export type DreDoc = {
  groups: Group[]
  values: DreValues
}

/** Ordem e papel de cada bloco no cálculo — a estrutura do DRE em si. */
const GROUP_IDS = {
  revenue: 'receita-bruta',
  taxes: 'impostos',
  cogs: 'cpv',
  sales: 'desp-vendas',
  marketing: 'desp-marketing',
  admin: 'desp-admin',
  finance: 'desp-financeiras',
} as const

function baseGroups(): Group[] {
  return [
    {
      id: GROUP_IDS.revenue,
      label: 'Receita Operacional Bruta',
      sign: 'in',
      accounts: [
        { id: 'rec-produtos', label: 'Venda de produtos' },
        { id: 'rec-servicos', label: 'Prestação de serviços' },
        { id: 'rec-recorrente', label: 'Contratos recorrentes' },
        { id: 'rec-outras', label: 'Outras receitas operacionais' },
      ],
    },
    {
      id: GROUP_IDS.taxes,
      label: 'Impostos e Deduções',
      sign: 'out',
      variable: true,
      accounts: [
        { id: 'imp-icms', label: 'ICMS / ISS' },
        { id: 'imp-pis-cofins', label: 'PIS / COFINS' },
        { id: 'imp-devolucoes', label: 'Devoluções e abatimentos' },
      ],
    },
    {
      id: GROUP_IDS.cogs,
      label: 'Custos dos Produtos Vendidos (CPV)',
      sign: 'out',
      variable: true,
      accounts: [
        { id: 'cpv-materia', label: 'Matéria-prima e insumos' },
        { id: 'cpv-mao-obra', label: 'Mão de obra direta' },
        { id: 'cpv-frete', label: 'Frete e logística de entrada' },
      ],
    },
    {
      id: GROUP_IDS.sales,
      label: 'Despesas com Vendas',
      sign: 'out',
      accounts: [
        { id: 'ven-comissoes', label: 'Comissões de vendas' },
        { id: 'ven-logistica', label: 'Logística de saída' },
      ],
    },
    {
      id: GROUP_IDS.marketing,
      label: 'Despesas com Marketing',
      sign: 'out',
      accounts: [
        { id: 'mkt-midia', label: 'Mídia paga' },
        { id: 'mkt-conteudo', label: 'Eventos e conteúdo' },
      ],
    },
    {
      id: GROUP_IDS.admin,
      label: 'Despesas Administrativas',
      sign: 'out',
      accounts: [
        { id: 'adm-pessoal', label: 'Pessoal e encargos' },
        { id: 'adm-ocupacao', label: 'Ocupação e utilidades' },
        { id: 'adm-terceiros', label: 'Serviços de terceiros' },
      ],
    },
    {
      id: GROUP_IDS.finance,
      label: 'Despesas Financeiras',
      sign: 'out',
      accounts: [
        { id: 'fin-juros', label: 'Juros e taxas bancárias' },
        { id: 'fin-emprestimos', label: 'Amortização e encargos de empréstimos' },
      ],
    },
  ]
}

export const zeros = () => Array.from({ length: MONTH_COUNT }, () => 0)

/** Documento inicial totalmente zerado para o usuário preencher do zero. */
export function defaultDoc(year: string): DreDoc {
  const groups = baseGroups()
  const values: DreValues = {}
  for (const group of groups) {
    for (const account of group.accounts) {
      values[account.id] = zeros()
    }
  }
  return { groups, values }
}

let sequence = 0

/** Id único gerado no cliente, no momento da ação do usuário. */
export function newAccountId(groupId: string) {
  sequence += 1
  return `${groupId}-n${Date.now().toString(36)}${sequence}`
}

const mapGroups = (doc: DreDoc, fn: (group: Group) => Group): DreDoc => ({
  ...doc,
  groups: doc.groups.map(fn),
})

export function renameGroup(doc: DreDoc, groupId: string, label: string) {
  return mapGroups(doc, (group) =>
    group.id === groupId ? { ...group, label } : group,
  )
}

export function renameAccount(doc: DreDoc, accountId: string, label: string) {
  return mapGroups(doc, (group) => ({
    ...group,
    accounts: group.accounts.map((account) =>
      account.id === accountId ? { ...account, label } : account,
    ),
  }))
}

export function addAccount(doc: DreDoc, groupId: string, label: string) {
  const id = newAccountId(groupId)
  return {
    groups: doc.groups.map((group) =>
      group.id === groupId
        ? { ...group, accounts: [...group.accounts, { id, label }] }
        : group,
    ),
    values: { ...doc.values, [id]: zeros() },
  }
}

export function removeAccount(doc: DreDoc, accountId: string) {
  const values = { ...doc.values }
  delete values[accountId]
  return {
    groups: doc.groups.map((group) => ({
      ...group,
      accounts: group.accounts.filter((account) => account.id !== accountId),
    })),
    values,
  }
}

export function setValue(
  doc: DreDoc,
  accountId: string,
  monthIndex: number,
  value: number,
) {
  const row = [...(doc.values[accountId] ?? zeros())]
  row[monthIndex] = value
  return { ...doc, values: { ...doc.values, [accountId]: row } }
}

export type RowKind = 'group' | 'account' | 'result'

export type DreRow = {
  id: string
  label: string
  kind: RowKind
  /** 'in' soma, 'out' subtrai, 'result' é linha calculada */
  sign: 'in' | 'out' | 'result'
  /** 0 = grupo ou resultado, 1 = conta lançável */
  level: number
  groupId?: string
  /** subtotal calculado a partir de outros grupos: não aceita contas */
  synthetic?: boolean
  /** true nas linhas de resultado que fecham um bloco */
  emphasis?: boolean
  values: number[]
  total: number
}

const add = (a: number[], b: number[]) => a.map((value, i) => value + b[i])
const sub = (a: number[], b: number[]) => a.map((value, i) => value - b[i])
const sum = (a: number[]) => a.reduce((acc, value) => acc + value, 0)

export type DreComputed = {
  rows: DreRow[]
  grossRevenue: number[]
  netRevenue: number[]
  grossProfit: number[]
  contributionMargin: number[]
  ebitda: number[]
  operatingExpenses: number[]
}

/** Recalcula todas as linhas de resultado a partir dos valores digitados. */
export function computeDre(doc: DreDoc): DreComputed {
  const byId = new Map(doc.groups.map((group) => [group.id, group]))

  const groupTotal = (id: string) => {
    const group = byId.get(id)
    if (!group) return zeros()
    return group.accounts.reduce((acc, account) => {
      const row = doc.values[account.id] ?? zeros()
      return acc.map((value, index) => value + Math.abs(row[index] ?? 0))
    }, zeros())
  }

  const totals = Object.fromEntries(
    doc.groups.map((group) => [group.id, groupTotal(group.id)]),
  ) as Record<string, number[]>

  const total = (id: string) => totals[id] ?? zeros()

  const grossRevenue = total(GROUP_IDS.revenue)
  const netRevenue = sub(grossRevenue, total(GROUP_IDS.taxes))
  const grossProfit = sub(netRevenue, total(GROUP_IDS.cogs))
  const operatingExpenses = add(
    add(
      add(total(GROUP_IDS.sales), total(GROUP_IDS.marketing)),
      total(GROUP_IDS.admin),
    ),
    total(GROUP_IDS.finance),
  )
  const ebitda = sub(grossProfit, operatingExpenses)
  const variableCosts = doc.groups
    .filter((group) => group.variable)
    .reduce((acc, group) => add(acc, total(group.id)), zeros())
  const contributionMargin = sub(grossRevenue, variableCosts)

  const groupRows = (id: string, level = 0): DreRow[] => {
    const group = byId.get(id)
    if (!group) return []
    const prefix = group.sign === 'out' && level === 0 ? '(-) ' : ''
    return [
      {
        id: group.id,
        label: `${prefix}${group.label}`,
        kind: 'group',
        sign: group.sign,
        level,
        groupId: group.id,
        values: total(id),
        total: sum(total(id)),
      },
      ...group.accounts.map((account) => {
        const row = (doc.values[account.id] ?? zeros()).map(Math.abs)
        return {
          id: account.id,
          label: account.label,
          kind: 'account' as const,
          sign: group.sign,
          level: level + 1,
          groupId: group.id,
          values: row,
          total: sum(row),
        }
      }),
    ]
  }

  const result = (
    id: string,
    label: string,
    monthly: number[],
    emphasis = false,
  ): DreRow => ({
    id,
    label,
    kind: 'result',
    sign: 'result',
    level: 0,
    emphasis,
    values: monthly,
    total: sum(monthly),
  })

  const rows: DreRow[] = [
    ...groupRows(GROUP_IDS.revenue),
    ...groupRows(GROUP_IDS.taxes),
    result('receita-liquida', '(=) Receita Líquida', netRevenue),
    ...groupRows(GROUP_IDS.cogs),
    result('lucro-bruto', '(=) Lucro Bruto', grossProfit, true),
    {
      id: 'despesas-operacionais',
      label: '(-) Despesas Operacionais',
      kind: 'group',
      sign: 'out',
      level: 0,
      synthetic: true,
      values: operatingExpenses,
      total: sum(operatingExpenses),
    },
    ...groupRows(GROUP_IDS.sales, 1),
    ...groupRows(GROUP_IDS.marketing, 1),
    ...groupRows(GROUP_IDS.admin, 1),
    ...groupRows(GROUP_IDS.finance, 1),
    result('ebitda', '(=) EBITDA / Lucro Operacional', ebitda, true),
  ]

  return {
    rows,
    grossRevenue,
    netRevenue,
    grossProfit,
    contributionMargin,
    ebitda,
    operatingExpenses,
  }
}

/** Índice do mês (0..11) ou null para o acumulado do ano. */
export type Reference = number | null

export function pick(monthly: number[], reference: Reference) {
  return reference === null ? sum(monthly) : (monthly[reference] ?? 0)
}

export function ratio(part: number, whole: number) {
  if (!whole) return 0
  return (part / whole) * 100
}
