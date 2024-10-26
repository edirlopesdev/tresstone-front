import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Edit, Trash2 } from 'lucide-react';
import { Button } from "./ui/button";
import { Cliente } from '../types/supabase-types';
import { useToast } from "./ui/use-toast";

interface ClienteListProps {
  onEditCliente: (cliente: Cliente) => void;
  triggerRefetch: boolean;
}

export function ClienteList({ onEditCliente, triggerRefetch }: ClienteListProps) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchClientes();
  }, [triggerRefetch]);

  async function fetchClientes() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clientes')
        .select('*');

      if (error) throw error;
      setClientes(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao buscar os clientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Cliente excluído",
        description: "O cliente foi excluído com sucesso.",
      });

      fetchClientes();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o cliente.",
        variant: "destructive",
      });
    }
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
                    <TableCell>{cliente.tipo_cabelo || '-'}</TableCell>
                    <TableCell>{cliente.condicao_cabelo || '-'}</TableCell>
                    <TableCell className="text-right pr-2">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditCliente(cliente)}
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
