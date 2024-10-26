import React from 'react';
import { PerfilForm } from '../components/PerfilForm';
import { PerfilList } from '../components/PerfilList';

export function PerfisPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Perfis</h1>
      <div className="space-y-6">
        <PerfilForm />
        <PerfilList />
      </div>
    </div>
  );
}
