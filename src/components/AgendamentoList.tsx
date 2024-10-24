import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

interface Agendamento {
  id: string;
  empresa_id: string;
  usuario_id: string;
  cliente_id: string;
  data_agendamento: string;
  tipo_servico: string;
  status: string;
  observacoes: string;
}

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Agendamentos</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Carregando agendamentos...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Tipo de Serviço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Observações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agendamentos.map((agendamento) => (
                <TableRow key={agendamento.id}>
                  <TableCell>{new Date(agendamento.data_agendamento).toLocaleString()}</TableCell>
                  <TableCell>{agendamento.tipo_servico}</TableCell>
                  <TableCell>{agendamento.status}</TableCell>
                  <TableCell>{agendamento.observacoes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
