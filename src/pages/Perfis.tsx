import React from 'react';
import { PerfilForm } from '../components/PerfilForm';
import { PerfilList } from '../components/PerfilList';

export function PerfisPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Perfis</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PerfilForm />
        <PerfilList />
      </div>
    </div>
  );
}
