import React, { useState } from 'react';
import { PlanoForm } from '../components/PlanoForm';
import { PlanoList } from '../components/PlanoList';
import { Plano } from '../types/supabase-types';

export function PlanosPage() {
  const [planoParaEditar, setPlanoParaEditar] = useState<Plano | undefined>(undefined);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const handleEditPlano = (plano: Plano) => {
    setPlanoParaEditar(plano);
  };

  const handlePlanoSalvo = () => {
    setPlanoParaEditar(undefined);
    setTriggerRefetch(!triggerRefetch);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Planos</h1>
      <div className="space-y-6">
        <PlanoForm 
          planoParaEditar={planoParaEditar} 
          onPlanoSalvo={handlePlanoSalvo} 
        />
        <PlanoList 
          onEditPlano={handleEditPlano}
          triggerRefetch={triggerRefetch}
        />
      </div>
    </div>
  );
}
