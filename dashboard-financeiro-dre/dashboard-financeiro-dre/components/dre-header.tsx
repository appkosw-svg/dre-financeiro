'use client';

import { Download, Upload } from 'lucide-react';

type Props = {
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function DreHeader({ onExport, onImport }: Props) {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Dashboard Financeiro DRE</h1>
        <p className="text-sm text-zinc-500">Gestão e acompanhamento financeiro de 2026</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg shadow-sm hover:bg-zinc-50 transition-colors"
          title="Baixar backup dos dados salvos"
        >
          <Download className="w-4 h-4" />
          Baixar Backup
        </button>
        <label
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-zinc-900 border border-transparent rounded-lg shadow-sm hover:bg-zinc-800 cursor-pointer transition-colors"
          title="Carregar arquivo de backup salvo"
        >
          <Upload className="w-4 h-4" />
          Carregar Backup
          <input
            type="file"
            accept=".json"
            onChange={onImport}
            className="hidden"
          />
        </label>
      </div>
    </header>
  );
}