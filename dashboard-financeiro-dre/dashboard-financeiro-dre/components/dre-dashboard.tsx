'use client';

import { useState, useEffect } from 'react';
import { DreHeader } from './dre-header';
import { DreGrid } from './dre-grid';
import { type DreRow } from '@/lib/dre-model';

export function DreDashboard() {
  const [rows, setRows] = useState<DreRow[]>([]);
  const [netRevenueTotal, setNetRevenueTotal] = useState<number>(0);

  // Carregar dados salvos no navegador ao abrir
  useEffect(() => {
    const saved = localStorage.getItem('dre_data_2026');
    if (saved) {
      try {
        setRows(JSON.parse(saved));
      } catch (e) {
        console.error('Erro ao carregar dados salvos', e);
      }
    }
  }, []);

  // Salvar automaticamente sempre que houver mudança
  const handleUpdate = (updatedRows: DreRow[]) => {
    setRows(updatedRows);
    localStorage.setItem('dre_data_2026', JSON.stringify(updatedRows));
  };

  // Função para Baixar o Backup (JSON)
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(rows, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `backup_dre_2026_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Função para Carregar o Backup (JSON)
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsedData = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsedData)) {
            setRows(parsedData);
            localStorage.setItem('dre_data_2026', JSON.stringify(parsedData));
            alert('Backup carregado com sucesso!');
          } else {
            alert('Arquivo inválido.');
          }
        } catch (error) {
          alert('Erro ao ler o arquivo de backup.');
        }
      };
    }
  };

  // Funções de manipulação das linhas da DRE
  const handleChange = (accountId: string, monthIndex: number, value: number) => {
    const updated = rows.map(row => {
      if (row.id === accountId) {
        const newValues = [...row.values];
        newValues[monthIndex] = value;
        return { ...row, values: newValues };
      }
      return row;
    });
    handleUpdate(updated);
  };

  const handleRenameAccount = (accountId: string, label: string) => {
    const updated = rows.map(row => row.id === accountId ? { ...row, label } : row);
    handleUpdate(updated);
  };

  const handleRenameGroup = (groupId: string, label: string) => {
    // Implementação de grupo se necessário
  };

  const handleAddAccount = (groupId: string) => {
    // Adicionar nova conta
  };

  const handleRemoveAccount = (accountId: string, label: string) => {
    const updated = rows.filter(row => row.id !== accountId);
    handleUpdate(updated);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <DreHeader onExport={handleExport} onImport={handleImport} />
      <DreGrid 
        rows={rows}
        netRevenueTotal={netRevenueTotal}
        reference={null}
        highlightId=""
        onChange={handleChange}
        onRenameAccount={handleRenameAccount}
        onRenameGroup={handleRenameGroup}
        onAddAccount={handleAddAccount}
        onRemoveAccount={handleRemoveAccount}
      />
    </div>
  );
}