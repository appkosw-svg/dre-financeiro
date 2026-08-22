'use client'

import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { formatCurrency, formatDelta, formatPercent } from '@/lib/format'
import { cn } from '@/lib/utils'

export type Kpi = {
  id: string
  label: string
  value: number
  format: 'currency' | 'percent'
  delta: number
  previousLabel: string
  /** Participação sobre a receita líquida, quando aplicável */
  share?: number
  /** Boa direção: alta é positiva para todos os KPIs deste painel */
  hint: string
}

type Props = {
  kpis: Kpi[]
  activeId: string | null
  onSelect: (id: string) => void
}

export function KpiCards({ kpis, activeId, onSelect }: Props) {
  return (
    <section aria-label="Indicadores do período">
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const positive = kpi.delta > 0
          const neutral = kpi.delta === 0
          const Icon = neutral
            ? Minus
            : positive
              ? ArrowUpRight
              : ArrowDownRight
          const active = activeId === kpi.id

          return (
            <li key={kpi.id}>
              <button
                type="button"
                onClick={() => onSelect(kpi.id)}
                aria-pressed={active}
                className={cn(
                  'group flex h-full w-full flex-col gap-4 rounded-xl border bg-card p-5 text-left transition-all',
                  'hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                  active
                    ? 'border-primary/60 shadow-lg shadow-primary/10'
                    : 'border-border',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    {kpi.label}
                  </span>
                  <span
                    className={cn(
                      'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums',
                      neutral
                        ? 'bg-muted text-muted-foreground'
                        : positive
                          ? 'bg-positive-soft text-positive'
                          : 'bg-negative-soft text-negative',
                    )}
                  >
                    <Icon aria-hidden="true" className="size-3" />
                    {formatDelta(kpi.delta)}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-mono text-2xl font-semibold tracking-tight tabular-nums xl:text-[1.75rem]">
                    {kpi.format === 'currency'
                      ? formatCurrency(kpi.value)
                      : formatPercent(kpi.value)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    vs. {kpi.previousLabel}
                  </span>
                </div>

                {typeof kpi.share === 'number' ? (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-muted-foreground">{kpi.hint}</span>
                      <span className="font-mono font-medium tabular-nums">
                        {formatPercent(kpi.share)}
                      </span>
                    </div>
                    <div
                      className="h-1.5 overflow-hidden rounded-full bg-muted"
                      role="presentation"
                    >
                      <div
                        className="h-full rounded-full bg-primary transition-[width] duration-500"
                        style={{
                          width: `${Math.min(Math.max(kpi.share, 0), 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {kpi.hint}
                  </p>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
