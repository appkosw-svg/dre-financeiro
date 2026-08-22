"use client"

import React, { useState } from "react"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Calendar,
  Save
} from "lucide-react"

export default function DREDashboard() {
  const [selectedYear, setSelectedYear] = useState("2026")
  const [selectedPeriod, setSelectedPeriod] = useState("acumulado")
  const [expandedSections, setExpandedSections] = useState({
    receitaBruta: true,
    impostos: true,
    cpv: true,
    despesasOp: true,
    despesasFin: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // Meses do ano
  const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"]

  // Mock de dados financeiros estruturados com casas decimais (formato pt-BR)
  const dadosDRE = {
    "2027": {
      receitaBruta: [4500000.00, 4700000.00, 5100000.00, 4900000.00, 5200000.00, 5400000.00, 5600000.00, 5500000.00, 5800000.00, 6000000.00, 6200000.00, 7000000.00],
      vendaProdutos: [3000000.00, 3150000.00, 3400000.00, 3250000.00, 3450000.00, 3600000.00, 3700000.00, 3650000.00, 3850000.00, 4000000.00, 4150000.00, 4700000.00],
      prestacaoServicos: [1150000.00, 1200000.00, 1300000.00, 1250000.00, 1330000.00, 1380000.00, 1430000.00, 1400000.00, 1480000.00, 1530000.00, 1580000.00, 1780000.00],
      impostosDeducoes: [720000.00, 752000.00, 816000.00, 784000.00, 832000.00, 864000.00, 896000.00, 880000.00, 928000.00, 960000.00, 992000.00, 1120000.00],
      cpv: [2100000.00, 2190000.00, 2380000.00, 2280000.00, 2420000.00, 2520000.00, 2610000.00, 2560000.00, 2700000.00, 2800000.00, 2900000.00, 3270000.00],
      despesasOperacionais: [850000.00, 870000.00, 900000.00, 890000.00, 910000.00, 930000.00, 950000.00, 940000.00, 970000.00, 990000.00, 1010000.00, 1050000.00],
      despesasFinanceiras: [120000.00, 115000.00, 110000.00, 105000.00, 100000.00, 95000.00, 90000.00, 85000.00, 80000.00, 75000.00, 70000.00, 65000.00],
    },
    "2026": {
      receitaBruta: [4004000.00, 4197000.00, 4639000.00, 4540000.00, 4785000.00, 4882000.00, 4950000.00, 5100000.00, 5250000.00, 5400000.00, 5600000.00, 6200000.00],
      vendaProdutos: [2680000.00, 2810000.00, 3105000.00, 3039000.00, 3203000.00, 3268000.00, 3315000.00, 3415000.00, 3515000.00, 3615000.00, 3750000.00, 4150000.00],
      prestacaoServicos: [1053000.00, 1104000.00, 1220000.00, 1194000.00, 1258000.00, 1284000.00, 1302000.00, 1342000.00, 1381000.00, 1421000.00, 1473000.00, 1630000.00],
      impostosDeducoes: [640640.00, 671520.00, 742240.00, 726400.00, 765600.00, 781120.00, 792000.00, 816000.00, 840000.00, 864000.00, 896000.00, 992000.00],
      cpv: [1862000.00, 1950000.00, 2150000.00, 2100000.00, 2210000.00, 2260000.00, 2290000.00, 2360000.00, 2430000.00, 2500000.00, 2590000.00, 2870000.00],
      despesasOperacionais: [800000.00, 820000.00, 850000.00, 840000.00, 860000.00, 880000.00, 890000.00, 910000.00, 920000.00, 940000.00, 960000.00, 1000000.00],
      despesasFinanceiras: [150000.00, 145000.00, 140000.00, 135000.00, 130000.00, 125000.00, 120000.00, 115000.00, 110000.00, 105000.00, 100000.00, 95000.00],
    },
    "2025": {
      receitaBruta: [3500000.00, 3600000.00, 3900000.00, 3800000.00, 4000000.00, 4100000.00, 4200000.00, 4150000.00, 4300000.00, 4400000.00, 4500000.00, 5000000.00],
      vendaProdutos: [2300000.00, 2380000.00, 2580000.00, 2500000.00, 2650000.00, 2720000.00, 2780000.00, 2750000.00, 2850000.00, 2920000.00, 2980000.00, 3300000.00],
      prestacaoServicos: [950000.00, 970000.00, 1050000.00, 1020000.00, 1080000.00, 1100000.00, 1130000.00, 1110000.00, 1150000.00, 1180000.00, 1210000.00, 1350000.00],
      impostosDeducoes: [560000.00, 576000.00, 624000.00, 608000.00, 640000.00, 656000.00, 672000.00, 664000.00, 688000.00, 704000.00, 720000.00, 800000.00],
      cpv: [1600000.00, 1650000.00, 1780000.00, 1740000.00, 1820000.00, 1870000.00, 1910000.00, 1890000.00, 1950000.00, 2000000.00, 2050000.00, 2280000.00],
      despesasOperacionais: [750000.00, 760000.00, 790000.00, 780000.00, 800000.00, 810000.00, 830000.00, 820000.00, 840000.00, 860000.00, 880000.00, 920000.00],
      despesasFinanceiras: [180000.00, 175000.00, 170000.00, 165000.00, 160000.00, 155000.00, 150000.00, 145000.00, 140000.00, 135000.00, 130000.00, 125000.00],
    },
    "2024": {
      receitaBruta: [3000000.00, 3100000.00, 3300000.00, 3200000.00, 3400000.00, 3500000.00, 3600000.00, 3550000.00, 3700000.00, 3800000.00, 3900000.00, 4200000.00],
      vendaProdutos: [1900000.00, 1980000.00, 2120000.00, 2050000.00, 2180000.00, 2250000.00, 2300000.00, 2270000.00, 2360000.00, 2430000.00, 2490000.00, 2700000.00],
      prestacaoServicos: [850000.00, 870000.00, 930000.00, 900000.00, 960000.00, 980000.00, 1010000.00, 990000.00, 1030000.00, 1060000.00, 1090000.00, 1180000.00],
      impostosDeducoes: [480000.00, 496000.00, 528000.00, 512000.00, 544000.00, 560000.00, 576000.00, 568000.00, 592000.00, 608000.00, 624000.00, 672000.00],
      cpv: [1380000.00, 1420000.00, 1520000.00, 1480000.00, 1560000.00, 1600000.00, 1650000.00, 1620000.00, 1690000.00, 1740000.00, 1790000.00, 1930000.00],
      despesasOperacionais: [700000.00, 710000.00, 730000.00, 720000.00, 740000.00, 750000.00, 770000.00, 760000.00, 780000.00, 800000.00, 820000.00, 850000.00],
      despesasFinanceiras: [200000.00, 195000.00, 190000.00, 185000.00, 180000.00, 175000.00, 170000.00, 165000.00, 160000.00, 155000.00, 150000.00, 145000.00],
    }
  }

  // Dados correntes com base no ano selecionado
  const currentData = dadosDRE[selectedYear as keyof typeof dadosDRE] || dadosDRE["2026"]

  // Função formatadora monetária com casas decimais exatas (R$ X.XXX,XX)
  const formatMoney = (val: number) => {
    return val.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  // Cálculos consolidados
  const totalReceitaBruta = currentData.receitaBruta.reduce((acc, curr) => acc + curr, 0)
  const totalImpostos = currentData.impostosDeducoes.reduce((acc, curr) => acc + curr, 0)
  const receitaLiquida = totalReceitaBruta - totalImpostos
  const totalCpv = currentData.cpv.reduce((acc, curr) => acc + curr, 0)
  const lucroBruto = receitaLiquida - totalCpv
  const totalDespesasOp = currentData.despesasOperacionais.reduce((acc, curr) => acc + curr, 0)
  const resultadoOperacional = lucroBruto - totalDespesasOp
  const totalDespesasFin = currentData.despesasFinanceiras.reduce((acc, curr) => acc + curr, 0)
  const resultadoLiquido = resultadoOperacional - totalDespesasFin

  const margemBruta = totalReceitaBruta > 0 ? (lucroBruto / totalReceitaBruta) * 100 : 0
  const margemEbitda = totalReceitaBruta > 0 ? (resultadoOperacional / totalReceitaBruta) * 100 : 0

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 md:p-8">
      {/* Top Header & Controls */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          {/* Seletor de Anos */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="appearance-none bg-slate-100 border border-slate-300 text-slate-800 font-semibold py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="2027">2027</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>

          {/* Seletor de Período */}
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="appearance-none bg-slate-100 border border-slate-300 text-slate-800 font-medium py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="acumulado">Acumulado do ano</option>
              <option value="mensal">Mensal detalhado</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Save className="w-3.5 h-3.5" /> Salvo no navegador
          </span>
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Nova conta
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Receita Bruta</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-slate-900">R$ {formatMoney(totalReceitaBruta)}</h3>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +19,0%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2"> vs. acumulado ano anterior</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Lucro Bruto</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-slate-900">R$ {formatMoney(lucroBruto)}</h3>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +19,0%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Margem bruta: {margemBruta.toFixed(1)}%</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Margem de Contribuição</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-slate-900">{margemBruta.toFixed(1)}%</h3>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              Estável
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Receita líquida menos CPV e variáveis.</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">EBITDA / Operacional</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-slate-900">R$ {formatMoney(resultadoOperacional)}</h3>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +18,9%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Margem EBITDA: {margemEbitda.toFixed(1)}%</p>
        </div>
      </div>

      {/* Tabela Principal DRE */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 text-xs font-semibold tracking-wider bg-slate-50/50">
              <th className="py-4 px-6 uppercase w-80">Conta</th>
              {meses.map((mes) => (
                <th key={mes} className="py-4 px-3 text-right">{mes}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {/* Receita Operacional Bruta */}
            <tr className="bg-slate-50/80 font-semibold text-slate-800 cursor-pointer" onClick={() => toggleSection('receitaBruta')}>
              <td className="py-3 px-6 flex items-center gap-2">
                {expandedSections.receitaBruta ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                Receita Operacional Bruta
              </td>
              {currentData.receitaBruta.map((val, idx) => (
                <td key={idx} className="py-3 px-3 text-right">R$ {formatMoney(val)}</td>
              ))}
            </tr>
            {expandedSections.receitaBruta && (
              <>
                <tr className="text-slate-600 text-xs bg-white">
                  <td className="py-2.5 px-6 pl-12">Venda de produtos</td>
                  {currentData.vendaProdutos.map((val, idx) => (
                    <td key={idx} className="py-2.5 px-3 text-right">{formatMoney(val)}</td>
                  ))}
                </tr>
                <tr className="text-slate-600 text-xs bg-white">
                  <td className="py-2.5 px-6 pl-12">Prestação de serviços</td>
                  {currentData.prestacaoServicos.map((val, idx) => (
                    <td key={idx} className="py-2.5 px-3 text-right">{formatMoney(val)}</td>
                  ))}
                </tr>
              </>
            )}

            {/* Impostos e Deduções */}
            <tr className="text-rose-600 font-medium cursor-pointer bg-slate-50/30" onClick={() => toggleSection('impostos')}>
              <td className="py-3 px-6 flex items-center gap-2">
                {expandedSections.impostos ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                (-) Impostos e Deduções
              </td>
              {currentData.impostosDeducoes.map((val, idx) => (
                <td key={idx} className="py-3 px-3 text-right text-rose-600">({formatMoney(val)})</td>
              ))}
            </tr>

            {/* CPV */}
            <tr className="text-slate-700 font-medium cursor-pointer bg-slate-50/30" onClick={() => toggleSection('cpv')}>
              <td className="py-3 px-6 flex items-center gap-2">
                {expandedSections.cpv ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                (-) CPV (Custo dos Produtos Vendidos)
              </td>
              {currentData.cpv.map((val, idx) => (
                <td key={idx} className="py-3 px-3 text-right text-slate-600">({formatMoney(val)})</td>
              ))}
            </tr>

            {/* LUCRO BRUTO */}
            <tr className="bg-emerald-50/50 font-bold text-slate-900 border-t border-b border-emerald-100">
              <td className="py-3.5 px-6">(=) Lucro Bruto</td>
              {currentData.receitaBruta.map((_, idx) => {
                const lb = (currentData.receitaBruta[idx] - currentData.impostosDeducoes[idx]) - currentData.cpv[idx]
                return (
                  <td key={idx} className="py-3.5 px-3 text-right text-emerald-700">R$ {formatMoney(lb)}</td>
                )
              })}
            </tr>

            {/* Despesas Operacionais */}
            <tr className="text-slate-800 font-semibold cursor-pointer bg-slate-50/80" onClick={() => toggleSection('despesasOp')}>
              <td className="py-3 px-6 flex items-center gap-2">
                {expandedSections.despesasOp ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                (-) Despesas Operacionais (Despesas com Vendas, Adm, etc.)
              </td>
              {currentData.despesasOperacionais.map((val, idx) => (
                <td key={idx} className="py-3 px-3 text-right text-rose-600">({formatMoney(val)})</td>
              ))}
            </tr>

            {/* RESULTADO OPERACIONAL (EBITDA) */}
            <tr className="bg-blue-50/50 font-bold text-slate-900 border-t border-b border-blue-100">
              <td className="py-3.5 px-6">(=) Resultado Operacional (EBITDA)</td>
              {currentData.receitaBruta.map((_, idx) => {
                const lb = (currentData.receitaBruta[idx] - currentData.impostosDeducoes[idx]) - currentData.cpv[idx]
                const ebitda = lb - currentData.despesasOperacionais[idx]
                return (
                  <td key={idx} className="py-3.5 px-3 text-right text-blue-700">R$ {formatMoney(ebitda)}</td>
                )
              })}
            </tr>

            {/* Despesas Financeiras */}
            <tr className="text-slate-800 font-semibold cursor-pointer bg-slate-50/80" onClick={() => toggleSection('despesasFin')}>
              <td className="py-3 px-6 flex items-center gap-2">
                {expandedSections.despesasFin ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                (-) Despesas Financeiras e Juros
              </td>
              {currentData.despesasFinanceiras.map((val, idx) => (
                <td key={idx} className="py-3 px-3 text-right text-rose-600">({formatMoney(val)})</td>
              ))}
            </tr>

            {/* RESULTADO LÍQUIDO FINAL */}
            <tr className="bg-slate-900 font-bold text-white">
              <td className="py-4 px-6 text-base">(=) Resultado Líquido do Exercício</td>
              {currentData.receitaBruta.map((_, idx) => {
                const lb = (currentData.receitaBruta[idx] - currentData.impostosDeducoes[idx]) - currentData.cpv[idx]
                const ebitda = lb - currentData.despesasOperacionais[idx]
                const liquido = ebitda - currentData.despesasFinanceiras[idx]
                return (
                  <td key={idx} className="py-4 px-3 text-right text-emerald-400">R$ {formatMoney(liquido)}</td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
