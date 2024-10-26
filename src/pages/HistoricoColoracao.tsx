import React, { useState } from 'react';
import { HistoricoColoracaoForm } from '../components/HistoricoColoracaoForm';
import { HistoricoColoracaoList } from '../components/HistoricoColoracaoList';
import { HistoricoColoracao } from '../types/supabase-types';

export function HistoricoColoracaoPage() {
  const [historicoParaEditar, setHistoricoParaEditar] = useState<HistoricoColoracao | undefined>(undefined);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const handleEditHistorico = (historico: HistoricoColoracao) => {
    setHistoricoParaEditar(historico);
  };

  const handleHistoricoSalvo = () => {
    setHistoricoParaEditar(undefined);
    setTriggerRefetch(!triggerRefetch);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Histórico de Coloração</h1>
      <div className="space-y-6">
        <HistoricoColoracaoForm 
          historicoParaEditar={historicoParaEditar} 
          onHistoricoSalvo={handleHistoricoSalvo} 
        />
        <HistoricoColoracaoList 
          onEditHistorico={handleEditHistorico}
          triggerRefetch={triggerRefetch}
        />
      </div>
    </div>
  );
}
