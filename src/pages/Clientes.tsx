import React from 'react';
import { ClienteForm } from '../components/ClienteForm';
import { ClienteList } from '../components/ClienteList';

export function ClientesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Clientes</h1>
      <div className="space-y-6">
        <ClienteForm />
        <ClienteList />
      </div>
    </div>
  );
}
