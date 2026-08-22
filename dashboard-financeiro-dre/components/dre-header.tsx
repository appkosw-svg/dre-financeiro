"use client"

import React from "react"
import { Calendar, RotateCcw, Download, Plus } from "lucide-react"

interface DREHeaderProps {
  selectedYear: string
  onYearChange: (year: string) => void
  selectedPeriod: string
  onPeriodChange: (period: string) => void
  onReset: () => void
  onExport: () => void
  onNewAccount: () => void
}

export function DREHeader({
  selectedYear,
  onYearChange,
  selectedPeriod,
  onPeriodChange,
  onReset,
  onExport,
  onNewAccount,
}: DREHeaderProps) {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4 mb-6 rounded-xl shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* Lado Esquerdo: Filtros e Anos */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Seletor de Anos */}
        <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span className="text-xs text-slate-400 font-semibold uppercase">Ano:</span>
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="2027">2027</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>

        {/* Seletor de Período */}
        <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700">
          <span className="text-xs text-slate-400 font-semibold uppercase">Visão:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => onPeriodChange(e.target.value)}
            className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="acumulado">Acumulado</option>
            <option value="mensal">Mensal Detalhado</option>
          </select>
        </div>
      </div>

      {/* Lado Direito: Ações (Reset, Exportar, Nova Conta) */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-medium h-9 px-3 rounded-md transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restaurar Padrão
        </button>

        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-medium h-9 px-3 rounded-md transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Exportar Excel
        </button>

        <button
          type="button"
          onClick={onNewAccount}
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium h-9 px-3 rounded-md shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Nova Conta
        </button>
      </div>
    </div>
  )
}
