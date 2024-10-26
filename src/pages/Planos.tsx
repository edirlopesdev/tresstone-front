import React from 'react';
import { PlanoForm } from '../components/PlanoForm';
import { PlanoList } from '../components/PlanoList';

export function PlanosPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Planos</h1>
      <div className="space-y-6">
        <PlanoForm />
        <PlanoList />
      </div>
    </div>
  );
}
