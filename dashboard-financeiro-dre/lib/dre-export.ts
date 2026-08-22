import { MONTHS, type DreRow } from '@/lib/dre-model'

function signed(row: DreRow, value: number) {
  return row.sign === 'out' ? -value : value
}

function brNumber(value: number) {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * CSV com BOM, separador ponto e vírgula e decimal com vírgula:
 * abre direto no Excel em português sem passo de importação.
 */
export function exportCsv(rows: DreRow[], year: string) {
  const header = [
    'Conta',
    'Nível',
    ...MONTHS.map((month) => month.label),
    'Total Acumulado Ano',
  ]

  const body = rows.map((row) => [
    row.label,
    String(row.level + 1),
    ...row.values.map((value) => brNumber(signed(row, value))),
    brNumber(signed(row, row.total)),
  ])

  const csv = [header, ...body]
    .map((line) =>
      line.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(';'),
    )
    .join('\r\n')

  const blob = new Blob([`\ufeff${csv}`], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `dre-${year}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/** Usa a caixa de impressão do navegador: "Salvar como PDF". */
export function exportPdf() {
  window.print()
}
