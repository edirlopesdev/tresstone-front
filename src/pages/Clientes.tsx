import React from 'react';
import { ClienteForm } from '../components/ClienteForm';
import { ClienteList } from '../components/ClienteList';

export function ClientesPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Clientes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ClienteForm />
        <ClienteList />
      </div>
    </div>
  );
}
