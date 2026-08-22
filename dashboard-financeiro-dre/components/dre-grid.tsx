'use client';

import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { MONTHS, ratio, type DreRow } from '@/lib/dre-model';
import { formatCurrency, formatPercent } from '@/lib/format';
import { cn } from '@/lib/utils';

type Props = {
  rows: DreRow[];
  netRevenueTotal: number;
  /** índice do mês destacado, null = acumulado */
  reference: number | null;
  highlightId: string | null;
  onChange: (accountId: string, monthIndex: number, value: number) => void;
  onRenameAccount: (accountId: string, label: string) => void;
  onRenameGroup: (groupId: string, label: string) => void;
  onAddAccount: (groupId: string) => void;
  onRemoveAccount: (accountId: string, label: string) => void;
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function parseInput(raw: string) {
  // Remove tudo exceto números, vírgula e sinal de negativo
  const cleaned = raw.replace(/[^\d,-]/g, '').replace(/\./g, '').replace(',', '.');
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : 0; // Armazena em centavos internamente
}

function ValueInput({
  value,
  tone,
  label,
  onCommit,
}: {
  value: number;
  tone: 'in' | 'out';
  label: string;
  onCommit: (next: number) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <input
      inputMode="decimal"
      aria-label={label}
      value={draft ?? (value === 0 ? '' : currencyFormatter.format(value / 100))}
      placeholder="0"
      onChange={(event) => setDraft(event.target.value)}
      onFocus={(event) => {
        setDraft(value === 0 ? '' : String(value));
        event.currentTarget.select();
      }}
      onBlur={() => {
        if (draft !== null) onCommit(parseInput(draft));
        setDraft(null);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.currentTarget.blur();
        if (event.key === 'Escape') {
          setDraft(null);
          event.currentTarget.blur();
        }
      }}
      className={cn(
        'w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-right font-mono text-[0.8125rem] tabular-nums transition-colors',
        'hover:border-border hover:bg-card focus:border-primary focus:bg-card focus-visible:outline-none',
        'print:border-none print:bg-transparent',
        tone === 'out' ? 'text-negative' : 'text-foreground'
      )}
    />
  );
}

/** Nome da conta ou do grupo, editável no próprio lugar. */
function LabelInput({
  value,
  ariaLabel,
  strong,
  onCommit,
}: {
  value: string;
  ariaLabel: string;
  strong?: boolean;
  onCommit: (next: string) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <input
      aria-label={ariaLabel}
      value={draft ?? value}
      placeholder="Nome da conta"
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => {
        if (draft !== null) {
          const trimmed = draft.trim();
          if (trimmed && trimmed !== value) onCommit(trimmed);
        }
        setDraft(null);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.currentTarget.blur();
        if (event.key === 'Escape') {
          setDraft(null);
          event.currentTarget.blur();
        }
      }}
      className={cn(
        'w-full min-w-0 rounded-md border border-transparent bg-transparent px-1.5 py-1 text-left text-sm transition-colors',
        'hover:border-border hover:bg-card focus:border-primary focus:bg-card focus-visible:outline-none',
        'print:border-none print:bg-transparent',
        strong ? 'font-medium text-foreground' : 'text-muted-foreground'
      )}
    />
  );
}

/** Formatador monetário completo no padrão brasileiro */
const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Exibe sempre com símbolo e 2 casas decimais */
function signedLabel(row: DreRow, value: number, withSymbol = false) {
  if (value === 0) return 'R$ 0,00';
  const signedValue = row.sign === 'out' ? -value : value;
  return brlFormatter.format(signedValue);
}

function toneClass(row: DreRow, value: number) {
  if (row.sign === 'out') return 'text-negative';
  if (row.kind === 'result') {
    return value < 0 ? 'text-negative' : 'text-positive';
  }
  return 'text-foreground';
}

export function DreGrid({
  rows,
  netRevenueTotal,
  reference,
  highlightId,
  onChange,
  onRenameAccount,
  onRenameGroup,
  onAddAccount,
  onRemoveAccount,
}: Props) {
  const [collapsed, setCollapsed] = useState<string[]>([]);

  const isHidden = (row: DreRow) =>
    row.kind === 'account' && collapsed.includes(row.groupId ?? '');

  const toggle = (id: string) =>
    setCollapsed((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );

  /** Último grupo real percorrido, para saber onde cabe "nova conta". */
  const visible = rows.filter((row) => !isHidden(row));
  const lastAccountOfGroup = new Map<string, string>();
  for (const row of rows) {
    if (row.kind === 'account' && row.groupId) {
      lastAccountOfGroup.set(row.groupId, row.id);
    }
  }
  const emptyGroups = new Set(
    rows
      .filter(
        (row) =>
          row.kind === 'group' &&
          !row.synthetic &&
          !lastAccountOfGroup.has(row.id)
      )
      .map((row) => row.id)
  );

  const addRow = (groupId: string, level: number, groupLabel: string) => (
    <tr
      key={`add-${groupId}`}
      className="border-b border-border/60 print:hidden"
    >
      <th
        scope="row"
        className="sticky left-0 z-10 bg-card px-4 py-1.5 text-left"
      >
        <span
          className="flex items-center"
          style={{ paddingLeft: `${level * 0.875}rem` }}
        >
          <button
            type="button"
            onClick={() => onAddAccount(groupId)}
            className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Plus className="size-3.5" aria-hidden />
            <span>Nova conta</span>
            <span className="sr-only">{` em ${groupLabel}`}</span>
          </button>
        </span>
      </th>
      <td colSpan={MONTHS.length + 2} className="bg-card" />
    </tr>
  );

  return (
    <section
      aria-label="Tabela do DRE por mês"
      className="overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1260px] border-collapse text-sm">
          <caption className="sr-only">
            Demonstrativo do resultado do exercício de janeiro a dezembro, com
            total acumulado do ano. Nomes de contas e valores são editáveis.
          </caption>
          <thead>
            <tr className="border-b border-border bg-surface">
              <th
                scope="col"
                className="sticky left-0 z-20 w-[22rem] min-w-[22rem] bg-surface px-4 py-3 text-left text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Conta
              </th>
              {MONTHS.map((month, index) => (
                <th
                  key={month.key}
                  scope="col"
                  className={cn(
                    'w-28 min-w-28 px-2 py-3 text-right text-[0.6875rem] font-semibold uppercase tracking-wider',
                    reference === index
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {month.short}
                </th>
              ))}
              <th
                scope="col"
                className="w-36 min-w-36 border-l border-border bg-accent px-3 py-3 text-right text-[0.6875rem] font-semibold uppercase tracking-wider text-accent-foreground"
              >
                Total ano
              </th>
              <th
                scope="col"
                className="w-20 min-w-20 px-3 py-3 text-right text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                AV %
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.flatMap((row) => {
              const isResult = row.kind === 'result';
              const isGroup = row.kind === 'group';
              const isAccount = row.kind === 'account';
              const highlighted = highlightId === row.id;
              const isCollapsed = collapsed.includes(row.id);

              const tr = (
                <tr
                  key={row.id}
                  className={cn(
                    'border-b border-border/60 transition-colors',
                    isAccount && 'group odd:bg-surface/60 hover:bg-accent/40',
                    isGroup && 'bg-card font-medium',
                    isResult &&
                      'bg-surface font-semibold text-foreground border-y border-border',
                    row.emphasis && 'bg-accent/60',
                    highlighted && 'ring-2 ring-inset ring-primary/50'
                  )}
                >
                  <th
                    scope="row"
                    className={cn(
                      'sticky left-0 z-10 px-4 py-1.5 text-left font-normal',
                      isAccount ? 'bg-card' : 'bg-surface',
                      isResult && 'font-semibold',
                      row.emphasis && 'bg-accent'
                    )}
                  >
                    <span
                      className="flex items-center gap-1"
                      style={{ paddingLeft: `${row.level * 0.875}rem` }}
                    >
                      {isGroup && !row.synthetic ? (
                        <>
                          <button
                            type="button"
                            onClick={() => toggle(row.id)}
                            aria-expanded={!isCollapsed}
                            aria-label={`${
                              isCollapsed ? 'Expandir' : 'Recolher'
                            } ${row.label}`}
                            className="shrink-0 rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring print:hidden"
                          >
                            {isCollapsed ? (
                              <ChevronRight className="size-4" aria-hidden />
                            ) : (
                              <ChevronDown className="size-4" aria-hidden />
                            )}
                          </button>
                          {row.sign === 'out' && row.level === 0 ? (
                            <span
                              aria-hidden
                              className="shrink-0 font-mono text-xs text-muted-foreground"
                            >
                              (-)
                            </span>
                          ) : null}
                          <LabelInput
                            value={row.label.replace(/^\(-\)\s/, '')}
                            ariaLabel={`Nome do grupo ${row.label}`}
                            strong
                            onCommit={(next) => onRenameGroup(row.id, next)}
                          />
                        </>
                      ) : isAccount ? (
                        <>
                          <LabelInput
                            value={row.label}
                            ariaLabel={`Nome da conta ${row.label}`}
                            onCommit={(next) => onRenameAccount(row.id, next)}
                          />
                          <button
                            type="button"
                            onClick={() => onRemoveAccount(row.id, row.label)}
                            aria-label={`Excluir a conta ${row.label}`}
                            title="Excluir conta"
                            className="shrink-0 rounded-md p-1.5 text-muted-foreground opacity-0 transition-colors hover:bg-negative-soft hover:text-negative focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring group-hover:opacity-100 print:hidden"
                          >
                            <Trash2 className="size-3.5" aria-hidden />
                          </button>
                        </>
                      ) : (
                        <span
                          className={cn(
                            'text-pretty px-1.5',
                            isGroup && 'font-medium text-foreground'
                          )}
                        >
                          {row.label}
                        </span>
                      )}
                    </span>
                  </th>

                  {row.values.map((value, index) => (
                    <td
                      key={index}
                      className={cn(
                        'px-1 py-1 text-right',
                        reference === index && !isAccount && 'bg-accent/50'
                      )}
                    >
                      {isAccount ? (
                        <ValueInput
                          value={value}
                          tone={row.sign === 'out' ? 'out' : 'in'}
                          label={`${row.label} em ${MONTHS[index].label}`}
                          onCommit={(next) => onChange(row.id, index, next)}
                        />
                      ) : (
                        <span
                          className={cn(
                            'block whitespace-nowrap px-2 font-mono text-[0.8125rem] tabular-nums',
                            toneClass(row, value)
                          )}
                        >
                          {signedLabel(row, value)}
                        </span>
                      )}
                    </td>
                  ))}

                  <td
                    className={cn(
                      'whitespace-nowrap border-l border-border px-3 py-2 text-right font-mono text-[0.8125rem] tabular-nums',
                      isAccount ? 'bg-accent/20' : 'bg-accent/40',
                      isResult && 'font-semibold',
                      toneClass(row, row.total)
                    )}
                  >
                    {signedLabel(row, row.total, true)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-xs tabular-nums text-muted-foreground">
                    {row.total === 0
                      ? '—'
                      : formatPercent(ratio(row.total, netRevenueTotal), 1)}
                  </td>
                </tr>
              );

              const showAdd =
                isAccount &&
                lastAccountOfGroup.get(row.groupId ?? '') === row.id;
              const showAddForEmpty =
                isGroup && !row.synthetic && emptyGroups.has(row.id);

              if (showAdd && row.groupId) {
                return [tr, addRow(row.groupId, row.level, row.label)];
              }
              if (showAddForEmpty && !isCollapsed) {
                return [tr, addRow(row.id, row.level + 1, row.label)];
              }
              return [tr];
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
