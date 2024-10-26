import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Edit, Trash2 } from 'lucide-react';
import { Button } from "./ui/button";
import { HistoricoColoracao } from '../types/supabase-types';

export function HistoricoColoracaoList() {
  const [historicoColoracao, setHistoricoColoracao] = useState<HistoricoColoracao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistoricoColoracao();
  }, []);

  async function fetchHistoricoColoracao() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('historico_coloracao')
        .select('*');

      if (error) throw error;
      setHistoricoColoracao(data || []);
    } catch (error) {
      console.error('Erro ao buscar histórico de coloração:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (id: string) => {
    console.log('Editar histórico de coloração', id);
  };

  const handleDelete = (id: string) => {
    console.log('Excluir histórico de coloração', id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Coloração</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Carregando histórico de coloração...</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Data</TableHead>
                  <TableHead className="font-semibold">Cor Base</TableHead>
                  <TableHead className="font-semibold">Cor Alvo</TableHead>
                  <TableHead className="font-semibold">Técnicas Usadas</TableHead>
                  <TableHead className="font-semibold text-right pr-9">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historicoColoracao.map((historico) => (
                  <TableRow key={historico.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{new Date(historico.data).toLocaleString()}</TableCell>
                    <TableCell>{historico.cor_base}</TableCell>
                    <TableCell>{historico.cor_alvo}</TableCell>
                    <TableCell>{historico.tecnicas_usadas?.join(', ') || '-'}</TableCell>
                    <TableCell className="text-right pr-2">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(historico.id)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(historico.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {historicoColoracao.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      Nenhum histórico de coloração registrado
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
