import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Edit, Trash2 } from 'lucide-react';
import { Button } from "./ui/button";
import { HistoricoColoracao } from '../types/supabase-types';
import { useToast } from "./ui/use-toast";

interface HistoricoColoracaoListProps {
  onEditHistorico: (historico: HistoricoColoracao) => void;
  triggerRefetch: boolean;
}

export function HistoricoColoracaoList({ onEditHistorico, triggerRefetch }: HistoricoColoracaoListProps) {
  const [historicoColoracao, setHistoricoColoracao] = useState<HistoricoColoracao[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchHistoricoColoracao();
  }, [triggerRefetch]);

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
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao buscar o histórico de coloração.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('historico_coloracao')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Histórico excluído",
        description: "O histórico de coloração foi excluído com sucesso.",
      });

      fetchHistoricoColoracao();
    } catch (error) {
      console.error('Erro ao excluir histórico de coloração:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o histórico de coloração.",
        variant: "destructive",
      });
    }
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
                    <TableCell>{typeof historico.produtos_usados === 'object' ? JSON.stringify(historico.produtos_usados) : (historico.produtos_usados || '-')}</TableCell>
                    <TableCell>{Array.isArray(historico.tecnicas_usadas) ? historico.tecnicas_usadas.join(', ') : (historico.tecnicas_usadas || '-')}</TableCell>
                    <TableCell className="text-right pr-2">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditHistorico(historico)}
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
