import React, { useState } from 'react';
import { ClienteForm } from '../components/ClienteForm';
import { ClienteList } from '../components/ClienteList';
import { Cliente } from '../types/supabase-types';

type ModoFormulario = 'lista' | 'novo' | 'edicao';

export function ClientesPage() {
  const [clienteParaEditar, setClienteParaEditar] = useState<Cliente | undefined>(undefined);
  const [triggerRefetch, setTriggerRefetch] = useState(false);
  const [modo, setModo] = useState<ModoFormulario>('lista');

  const handleEditCliente = (cliente: Cliente) => {
    setClienteParaEditar(cliente);
    setModo('edicao');
  };

  const handleNovoCliente = () => {
    setClienteParaEditar(undefined);
    setModo('novo');
  };

  const handleClienteSalvo = () => {
    setClienteParaEditar(undefined);
    setTriggerRefetch(!triggerRefetch);
    setModo('lista');
  };

  const handleVoltar = () => {
    setClienteParaEditar(undefined);
    setModo('lista');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Clientes</h1>
      <div className="space-y-6">
        {modo === 'lista' ? (
          <ClienteList 
            onEditCliente={handleEditCliente}
            onNovoCliente={handleNovoCliente}
            triggerRefetch={triggerRefetch}
          />
        ) : (
          <ClienteForm 
            clienteParaEditar={clienteParaEditar} 
            onClienteSalvo={handleClienteSalvo}
            onVoltar={handleVoltar}
          />
        )}
      </div>
    </div>
  );
}
