import React from 'react';
import { AgendamentoForm } from '../components/AgendamentoForm';
import { AgendamentoList } from '../components/AgendamentoList';

export function AgendamentosPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Agendamentos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AgendamentoForm />
        <AgendamentoList />
      </div>
    </div>
  );
}
