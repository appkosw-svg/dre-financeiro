const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

const compact = new Intl.NumberFormat('pt-BR', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function formatCurrency(value: number) {
  return currency.format(value)
}

export function formatCompact(value: number) {
  return `R$ ${compact.format(value)}`
}

export function formatPercent(value: number, fractionDigits = 1) {
  return `${value.toLocaleString('pt-BR', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}%`
}

export function formatDelta(value: number, fractionDigits = 1) {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${Math.abs(value).toLocaleString('pt-BR', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}%`
}

export function variation(current: number, previous: number) {
  if (previous === 0) return 0
  return ((current - previous) / Math.abs(previous)) * 100
}
