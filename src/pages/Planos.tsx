import React from 'react';
import { PlanoForm } from '../components/PlanoForm';
import { PlanoList } from '../components/PlanoList';

export function PlanosPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Planos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PlanoForm />
        <PlanoList />
      </div>
    </div>
  );
}
