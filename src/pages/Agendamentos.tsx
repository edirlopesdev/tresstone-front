import React, { useState } from 'react';
import { AgendamentoForm } from '../components/AgendamentoForm';
import { AgendamentoList } from '../components/AgendamentoList';
import { Agendamento } from '../types/supabase-types';

export function AgendamentosPage() {
  const [agendamentoParaEditar, setAgendamentoParaEditar] = useState<Agendamento | undefined>(undefined);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const handleEditAgendamento = (agendamento: Agendamento) => {
    setAgendamentoParaEditar(agendamento);
  };

  const handleAgendamentoSalvo = () => {
    setAgendamentoParaEditar(undefined);
    setTriggerRefetch(!triggerRefetch);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Agendamentos</h1>
      <div className="space-y-6">
        <AgendamentoForm 
          agendamentoParaEditar={agendamentoParaEditar} 
          onAgendamentoSalvo={handleAgendamentoSalvo} 
        />
        <AgendamentoList 
          onEditAgendamento={handleEditAgendamento}
          triggerRefetch={triggerRefetch}
        />
      </div>
    </div>
  );
}
