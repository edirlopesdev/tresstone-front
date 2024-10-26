import React from 'react';
import { HistoricoColoracaoForm } from '../components/HistoricoColoracaoForm';
import { HistoricoColoracaoList } from '../components/HistoricoColoracaoList';

export function HistoricoColoracaoPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Histórico de Coloração</h1>
      <div className="space-y-6">
        <HistoricoColoracaoForm />
        <HistoricoColoracaoList />
      </div>
    </div>
  );
}
