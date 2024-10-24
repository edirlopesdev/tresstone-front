import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

interface HistoricoColoracao {
  id: string;
  cliente_id: string;
  usuario_id: string;
  cor_base: string;
  cor_alvo: string;
  produtos_usados: string;
  tecnicas_usadas: string[];
  observacoes: string;
  data: string;
}

export function HistoricoColoracaoList() {
  const [historicos, setHistoricos] = useState<HistoricoColoracao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistoricos();
  }, []);

  async function fetchHistoricos() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('historico_coloracao')
        .select('*');

      if (error) throw error;
      setHistoricos(data || []);
    } catch (error) {
      console.error('Erro ao buscar históricos de coloração:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Coloração</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Carregando históricos...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Cor Base</TableHead>
                <TableHead>Cor Alvo</TableHead>
                <TableHead>Técnicas Usadas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historicos.map((historico) => (
                <TableRow key={historico.id}>
                  <TableCell>{new Date(historico.data).toLocaleString()}</TableCell>
                  <TableCell>{historico.cor_base}</TableCell>
                  <TableCell>{historico.cor_alvo}</TableCell>
                  <TableCell>{historico.tecnicas_usadas.join(', ')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
