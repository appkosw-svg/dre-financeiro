'use client'

import {
  CalendarRange,
  Check,
  ChevronDown,
  FileSpreadsheet,
  Printer,
  RotateCcw,
  Save,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MONTHS, YEARS } from '@/lib/dre-model'
import { cn } from '@/lib/utils'

type Props = {
  year: string
  onYearChange: (value: string) => void
  /** índice do mês de referência dos KPIs, '' = acumulado do ano */
  reference: string
  onReferenceChange: (value: string) => void
  dirty: boolean
  savedAt: string | null
  onSave: () => void
  onExportCsv: () => void
  onExportPdf: () => void
  onReset: () => void
}

const time = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="relative flex items-center">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-lg border border-border bg-card py-2 pl-3 pr-9 text-sm font-medium text-foreground transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:w-44"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 size-4 text-muted-foreground"
        />
      </span>
    </label>
  )
}

export function DreHeader({
  year,
  onYearChange,
  reference,
  onReferenceChange,
  dirty,
  savedAt,
  onSave,
  onExportCsv,
  onExportPdf,
  onReset,
}: Props) {
  return (
    <header className="flex flex-col gap-6 border-b border-border pb-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <CalendarRange aria-hidden="true" className="size-4" />
            Controladoria · Exercício {year}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            Demonstrativo do Resultado do Exercício
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
            Edite os nomes das contas, inclua ou exclua linhas e digite os
            valores dos 12 meses. Receita líquida, lucro bruto, margem de
            contribuição, EBITDA e o total do ano são recalculados
            automaticamente.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="gap-2"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            Restaurar base
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onExportPdf}
            className="gap-2"
          >
            <Printer aria-hidden="true" className="size-4" />
            Salvar em PDF
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onExportCsv}
            className="gap-2"
          >
            <FileSpreadsheet aria-hidden="true" className="size-4" />
            Exportar Excel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onSave}
            disabled={!dirty}
            className="gap-2"
          >
            {dirty ? (
              <Save aria-hidden="true" className="size-4" />
            ) : (
              <Check aria-hidden="true" className="size-4" />
            )}
            {dirty ? 'Salvar DRE' : 'DRE salvo'}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <Select
          label="Ano"
          value={year}
          options={YEARS.map((item) => ({ value: item, label: item }))}
          onChange={onYearChange}
        />
        <Select
          label="Referência dos indicadores"
          value={reference}
          options={[
            { value: '', label: 'Acumulado do ano' },
            ...MONTHS.map((month, index) => ({
              value: String(index),
              label: month.label,
            })),
          ]}
          onChange={onReferenceChange}
        />

        <div className="flex flex-col gap-1">
          <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground">
            Status de visualização
          </span>
          <div
            aria-live="polite"
            className="flex h-[38px] items-center gap-2 rounded-lg border border-border bg-surface px-3"
          >
            <span
              className={cn(
                'rounded-md px-2 py-0.5 text-xs font-semibold',
                dirty
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-positive-soft text-positive',
              )}
            >
              {dirty ? 'Alterações não salvas' : 'Salvo no navegador'}
            </span>
            <span className="text-xs text-muted-foreground">
              {savedAt
                ? `Último salvamento às ${time.format(new Date(savedAt))}`
                : 'Nenhum salvamento ainda'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
