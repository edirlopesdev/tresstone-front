import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Edit, Trash2 } from 'lucide-react';
import { Button } from "./ui/button";

interface Cliente {
  id: string;
  empresa_id: string;
  nome: string;
  tipo_cabelo: string;
  condicao_cabelo: string;
}

// JSON de clientes de exemplo
const clientesExemplo: Cliente[] = [
  {
    id: '1',
    empresa_id: 'empresa1',
    nome: 'Maria Silva',
    tipo_cabelo: 'Cacheado',
    condicao_cabelo: 'Seco'
  },
  {
    id: '2',
    empresa_id: 'empresa1',
    nome: 'João Santos',
    tipo_cabelo: 'Liso',
    condicao_cabelo: 'Normal'
  },
  {
    id: '3',
    empresa_id: 'empresa1',
    nome: 'Ana Oliveira',
    tipo_cabelo: 'Ondulado',
    condicao_cabelo: 'Oleoso'
  },
  {
    id: '4',
    empresa_id: 'empresa1',
    nome: 'Carlos Ferreira',
    tipo_cabelo: 'Crespo',
    condicao_cabelo: 'Misto'
  },
  {
    id: '5',
    empresa_id: 'empresa1',
    nome: 'Beatriz Costa',
    tipo_cabelo: 'Liso',
    condicao_cabelo: 'Danificado'
  }
];

export function ClienteList() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientes();
  }, []);

  async function fetchClientes() {
    try {
      setLoading(true);
      // Simula uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setClientes(clientesExemplo);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (id: string) => {
    console.log('Editar cliente', id);
  };

  const handleDelete = (id: string) => {
    console.log('Excluir cliente', id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Carregando clientes...</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Nome</TableHead>
                  <TableHead className="font-semibold">Tipo de Cabelo</TableHead>
                  <TableHead className="font-semibold">Condição do Cabelo</TableHead>
                  <TableHead className="font-semibold text-right pr-9">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((cliente) => (
                  <TableRow key={cliente.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{cliente.nome}</TableCell>
                    <TableCell>{cliente.tipo_cabelo}</TableCell>
                    <TableCell>{cliente.condicao_cabelo}</TableCell>
                    <TableCell className="text-right pr-2">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(cliente.id)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(cliente.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {clientes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                      Nenhum cliente cadastrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
