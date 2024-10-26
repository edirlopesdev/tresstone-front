import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Edit, Trash2 } from 'lucide-react';
import { Button } from "./ui/button";
import { Agendamento } from '../types/supabase-types';

export function AgendamentoList() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  async function fetchAgendamentos() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('agendamentos')
        .select('*');

      if (error) throw error;
      setAgendamentos(data || []);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (id: string) => {
    console.log('Editar agendamento', id);
  };

  const handleDelete = (id: string) => {
    console.log('Excluir agendamento', id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Agendamentos</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Carregando agendamentos...</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Data</TableHead>
                  <TableHead className="font-semibold">Tipo de Serviço</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Observações</TableHead>
                  <TableHead className="font-semibold text-right pr-9">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agendamentos.map((agendamento) => (
                  <TableRow key={agendamento.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{new Date(agendamento.data_agendamento).toLocaleString()}</TableCell>
                    <TableCell>{agendamento.tipo_servico}</TableCell>
                    <TableCell>{agendamento.status}</TableCell>
                    <TableCell>{agendamento.observacoes || '-'}</TableCell>
                    <TableCell className="text-right pr-2">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(agendamento.id)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(agendamento.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {agendamentos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      Nenhum agendamento cadastrado
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
