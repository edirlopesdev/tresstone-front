import React, { useState } from 'react';
import { PerfilForm } from '../components/PerfilForm';
import { PerfilList } from '../components/PerfilList';
import { Perfil } from '../types/supabase-types';

export function PerfisPage() {
  const [perfilParaEditar, setPerfilParaEditar] = useState<Perfil | undefined>(undefined);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const handleEditPerfil = (perfil: Perfil) => {
    setPerfilParaEditar(perfil);
  };

  const handlePerfilSalvo = () => {
    setPerfilParaEditar(undefined);
    setTriggerRefetch(!triggerRefetch);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Perfis</h1>
      <div className="space-y-6">
        <PerfilForm 
          perfilParaEditar={perfilParaEditar} 
          onPerfilSalvo={handlePerfilSalvo} 
        />
        <PerfilList 
          onEditPerfil={handleEditPerfil}
          triggerRefetch={triggerRefetch}
        />
      </div>
    </div>
  );
}
