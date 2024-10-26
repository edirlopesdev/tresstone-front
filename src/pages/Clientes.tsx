import React, { useState } from 'react';
import { ClienteForm } from '../components/ClienteForm';
import { ClienteList } from '../components/ClienteList';
import { Cliente } from '../types/supabase-types';

export function ClientesPage() {
  const [clienteParaEditar, setClienteParaEditar] = useState<Cliente | undefined>(undefined);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const handleEditCliente = (cliente: Cliente) => {
    setClienteParaEditar(cliente);
  };

  const handleClienteSalvo = () => {
    setClienteParaEditar(undefined);
    setTriggerRefetch(!triggerRefetch);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Clientes</h1>
      <div className="space-y-6">
        <ClienteForm 
          clienteParaEditar={clienteParaEditar} 
          onClienteSalvo={handleClienteSalvo} 
        />
        <ClienteList 
          onEditCliente={handleEditCliente}
          triggerRefetch={triggerRefetch}
        />
      </div>
    </div>
  );
}
