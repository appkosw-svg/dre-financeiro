'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { DreGrid } from '@/components/dre-grid'
import { DreHeader } from '@/components/dre-header'
import { KpiCards, type Kpi } from '@/components/kpi-cards'
import { exportCsv, exportPdf } from '@/lib/dre-export'
import {
  MONTHS,
  addAccount,
  computeDre,
  defaultDoc,
  pick,
  ratio,
  removeAccount,
  renameAccount,
  renameGroup,
  setValue,
  type DreDoc,
} from '@/lib/dre-model'
import { loadStore, saveStore, clearStore, type DreStore } from '@/lib/dre-storage'
import { formatPercent, variation } from '@/lib/format'

/** Linha destacada na tabela quando um KPI é selecionado. */
const kpiToRow: Record<string, string> = {
  'receita-bruta': 'receita-bruta',
  'lucro-bruto': 'lucro-bruto',
  'margem-contribuicao': 'receita-liquida',
  ebitda: 'ebitda',
}

export function DreDashboard() {
  const [year, setYear] = useState('2026')
  const [reference, setReference] = useState('')
  const [store, setStore] = useState<DreStore>({})
  const [snapshot, setSnapshot] = useState('{}')
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [activeKpi, setActiveKpi] = useState<string | null>('ebitda')

  /** Restaura o que estiver no LocalStorage só depois da hidratação. */
  useEffect(() => {
    const loaded = loadStore()
    if (Object.keys(loaded.docs).length === 0) return
    setStore(loaded.docs)
    setSnapshot(JSON.stringify(loaded.docs))
    setSavedAt(loaded.savedAt)
  }, [])

  const docFor = useCallback(
    (target: string) => store[target] ?? defaultDoc(target),
    [store],
  )

  const doc = docFor(year)
  const previousYear = String(Number(year) - 1)
  const previousDoc = docFor(previousYear)

  const current = useMemo(() => computeDre(doc), [doc])
  const previous = useMemo(() => computeDre(previousDoc), [previousDoc])

  const refIndex = reference === '' ? null : Number(reference)
  const dirty = JSON.stringify(store) !== snapshot

  /** Toda edição escreve o documento do ano corrente no store. */
  const edit = useCallback(
    (mutate: (input: DreDoc) => DreDoc) => {
      setStore((currentStore) => ({
        ...currentStore,
        [year]: mutate(currentStore[year] ?? defaultDoc(year)),
      }))
    },
    [year],
  )

  const handleSave = useCallback(() => {
    const stamp = saveStore(store)
    if (!stamp) return
    setSnapshot(JSON.stringify(store))
    setSavedAt(stamp)
  }, [store])

  const handleReset = useCallback(() => {
    const confirmed = window.confirm(
      `Restaurar a base de exemplo de ${year}? As contas e valores deste ano serão descartados.`,
    )
    if (!confirmed) return
    setStore((currentStore) => {
      const next = { ...currentStore }
      delete next[year]
      if (Object.keys(next).length === 0) clearStore()
      return next
    })
  }, [year])

  const handleRemoveAccount = useCallback(
    (accountId: string, label: string) => {
      const confirmed = window.confirm(
        `Excluir a conta "${label}" e os valores dos 12 meses?`,
      )
      if (!confirmed) return
      edit((input) => removeAccount(input, accountId))
    },
    [edit],
  )

  const kpis = useMemo<Kpi[]>(() => {
    /** Valor do comparativo: mês anterior ou mesmo período do ano anterior. */
    const before = (monthly: number[], prevMonthly: number[]) => {
      if (refIndex === null) return prevMonthly.reduce((a, b) => a + b, 0)
      if (refIndex === 0) return prevMonthly[11] ?? 0
      return monthly[refIndex - 1] ?? 0
    }

    const previousLabel =
      refIndex === null
        ? `acumulado ${previousYear}`
        : refIndex === 0
          ? `dez/${previousYear}`
          : `${MONTHS[refIndex - 1].short}/${year}`

    const grossRevenue = pick(current.grossRevenue, refIndex)
    const netRevenue = pick(current.netRevenue, refIndex)
    const grossProfit = pick(current.grossProfit, refIndex)
    const contribution = pick(current.contributionMargin, refIndex)
    const ebitda = pick(current.ebitda, refIndex)

    const prevGross = before(current.grossRevenue, previous.grossRevenue)
    const prevNet = before(current.netRevenue, previous.netRevenue)
    const prevProfit = before(current.grossProfit, previous.grossProfit)
    const prevContribution = before(
      current.contributionMargin,
      previous.contributionMargin,
    )
    const prevEbitda = before(current.ebitda, previous.ebitda)

    const contributionPct = ratio(contribution, netRevenue)
    const prevContributionPct = ratio(prevContribution, prevNet)

    return [
      {
        id: 'receita-bruta',
        label: 'Receita Bruta',
        value: grossRevenue,
        format: 'currency',
        delta: variation(grossRevenue, prevGross),
        previousLabel,
        hint: `Receita líquida equivale a ${formatPercent(
          ratio(netRevenue, grossRevenue),
        )} da receita bruta.`,
      },
      {
        id: 'lucro-bruto',
        label: 'Lucro Bruto',
        value: grossProfit,
        format: 'currency',
        delta: variation(grossProfit, prevProfit),
        previousLabel,
        share: ratio(grossProfit, netRevenue),
        hint: 'Margem bruta',
      },
      {
        id: 'margem-contribuicao',
        label: 'Margem de Contribuição',
        value: contributionPct,
        format: 'percent',
        delta: contributionPct - prevContributionPct,
        previousLabel,
        hint: 'Receita líquida menos CPV e despesas variáveis de vendas.',
      },
      {
        id: 'ebitda',
        label: 'EBITDA',
        value: ebitda,
        format: 'currency',
        delta: variation(ebitda, prevEbitda),
        previousLabel,
        share: ratio(ebitda, netRevenue),
        hint: 'Margem EBITDA',
      },
    ]
  }, [current, previous, refIndex, previousYear, year])

  const netRevenueTotal = current.netRevenue.reduce((a, b) => a + b, 0)

  return (
    <div className="mx-auto flex w-full max-w-[100rem] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <DreHeader
        year={year}
        onYearChange={setYear}
        reference={reference}
        onReferenceChange={setReference}
        dirty={dirty}
        savedAt={savedAt}
        onSave={handleSave}
        onExportCsv={() => exportCsv(current.rows, year)}
        onExportPdf={exportPdf}
        onReset={handleReset}
      />

      <KpiCards
        kpis={kpis}
        activeId={activeKpi}
        onSelect={(id) =>
          setActiveKpi((active) => (active === id ? null : id))
        }
      />

      <DreGrid
        rows={current.rows}
        netRevenueTotal={netRevenueTotal}
        reference={refIndex}
        highlightId={activeKpi ? kpiToRow[activeKpi] : null}
        onChange={(accountId, monthIndex, value) =>
          edit((input) => setValue(input, accountId, monthIndex, value))
        }
        onRenameAccount={(accountId, label) =>
          edit((input) => renameAccount(input, accountId, label))
        }
        onRenameGroup={(groupId, label) =>
          edit((input) => renameGroup(input, groupId, label))
        }
        onAddAccount={(groupId) =>
          edit((input) => addAccount(input, groupId, 'Nova conta'))
        }
        onRemoveAccount={handleRemoveAccount}
      />

      <footer className="flex flex-col gap-1 pb-4 text-xs text-muted-foreground">
        <p>
          Exercício {year} · Valores em reais · AV % calculada sobre a receita
          líquida acumulada do ano · Deduções digitadas em valor positivo e
          apresentadas como redutoras.
        </p>
        <p className="print:hidden">
          “Salvar DRE” grava a estrutura e os lançamentos no armazenamento local
          deste navegador. Use “Exportar Excel” ou “Salvar em PDF” para levar os
          dados para fora, ou conecte um banco de dados para acessar de vários
          dispositivos.
        </p>
      </footer>
    </div>
  )
}
