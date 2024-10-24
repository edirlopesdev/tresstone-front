import React from 'react';
import { HistoricoColoracaoForm } from '../components/HistoricoColoracaoForm';
import { HistoricoColoracaoList } from '../components/HistoricoColoracaoList';

export function HistoricoColoracaoPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Histórico de Coloração</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <HistoricoColoracaoForm />
        <HistoricoColoracaoList />
      </div>
    </div>
  );
}
