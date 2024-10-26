import React from 'react';
import { AgendamentoForm } from '../components/AgendamentoForm';
import { AgendamentoList } from '../components/AgendamentoList';

export function AgendamentosPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Agendamentos</h1>
      <div className="space-y-6">
        <AgendamentoForm />
        <AgendamentoList />
      </div>
    </div>
  );
}
