import React, { useState } from 'react';
import { HistoricoColoracaoForm } from '../components/HistoricoColoracaoForm';
import { HistoricoColoracaoList } from '../components/HistoricoColoracaoList';
import { HistoricoColoracao } from '../types/supabase-types';

type ModoFormulario = 'lista' | 'novo' | 'edicao';

export function HistoricoColoracaoPage() {
  const [historicoParaEditar, setHistoricoParaEditar] = useState<HistoricoColoracao | undefined>(undefined);
  const [triggerRefetch, setTriggerRefetch] = useState(false);
  const [modo, setModo] = useState<ModoFormulario>('lista');

  const handleEditHistorico = (historico: HistoricoColoracao) => {
    setHistoricoParaEditar(historico);
    setModo('edicao');
  };

  const handleNovoHistorico = () => {
    setHistoricoParaEditar(undefined);
    setModo('novo');
  };

  const handleHistoricoSalvo = () => {
    setHistoricoParaEditar(undefined);
    setTriggerRefetch(!triggerRefetch);
    setModo('lista');
  };

  const handleVoltar = () => {
    setHistoricoParaEditar(undefined);
    setModo('lista');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Histórico de Coloração</h1>
      <div className="space-y-6">
        {modo === 'lista' ? (
          <HistoricoColoracaoList 
            onEditHistorico={handleEditHistorico}
            onNovoHistorico={handleNovoHistorico}
            triggerRefetch={triggerRefetch}
          />
        ) : (
          <HistoricoColoracaoForm 
            historicoParaEditar={historicoParaEditar} 
            onHistoricoSalvo={handleHistoricoSalvo}
            onVoltar={handleVoltar}
          />
        )}
      </div>
    </div>
  );
}
