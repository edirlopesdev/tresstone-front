import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import { Button } from "./ui/button";
import { HistoricoColoracao } from '../types/supabase-types';
import { useToast } from "./ui/use-toast";
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface HistoricoColoracaoListProps {
  onEditHistorico: (historico: HistoricoColoracao) => void;
  onNovoHistorico: () => void;
  triggerRefetch: boolean;
}

export function HistoricoColoracaoList({ onEditHistorico, onNovoHistorico, triggerRefetch }: HistoricoColoracaoListProps) {
  const [historicos, setHistoricos] = useState<HistoricoColoracao[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { empresaId, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && empresaId) {
      fetchHistoricos();
    }
  }, [triggerRefetch, empresaId, authLoading]);

  async function fetchHistoricos() {
    if (!empresaId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('historico_coloracao')
        .select(`
          *,
          clientes!inner (
            nome,
            empresa_id
          )
        `)
        .eq('clientes.empresa_id', empresaId) // Filtra por empresa_id através da tabela de clientes
        .order('data', { ascending: false });

      if (error) throw error;
      setHistoricos(data || []);
    } catch (error) {
      console.error('Erro ao buscar históricos:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao buscar os históricos de coloração.",
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
        description: "O histórico foi excluído com sucesso.",
      });

      fetchHistoricos();
    } catch (error) {
      console.error('Erro ao excluir histórico:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o histórico.",
        variant: "destructive",
      });
    }
  };

  const formatarData = (data: string) => {
    return format(new Date(data), "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Histórico de Coloração</CardTitle>
        <Button onClick={onNovoHistorico} disabled={!empresaId}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Incluir
        </Button>
      </CardHeader>
      <CardContent>
        {authLoading ? (
          <p>Carregando autenticação...</p>
        ) : !empresaId ? (
          <p>Empresa não identificada</p>
        ) : loading ? (
          <p>Carregando históricos...</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Data</TableHead>
                  <TableHead className="font-semibold">Cliente</TableHead>
                  <TableHead className="font-semibold">Cor Base</TableHead>
                  <TableHead className="font-semibold">Cor Alvo</TableHead>
                  <TableHead className="font-semibold">Produtos Usados</TableHead>
                  <TableHead className="font-semibold">Técnicas</TableHead>
                  <TableHead className="font-semibold">Observações</TableHead>
                  <TableHead className="font-semibold text-right pr-9">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historicos.map((historico) => (
                  <TableRow key={historico.id} className="hover:bg-gray-50">
                    <TableCell>{formatarData(historico.data)}</TableCell>
                    <TableCell className="font-medium">
                      {(historico as any).clientes?.nome || 'Cliente não encontrado'}
                    </TableCell>
                    <TableCell>{historico.cor_base_nivel}</TableCell>
                    <TableCell>{historico.cor_alvo_nivel}</TableCell>
                    <TableCell>{historico.produtos_usados || '-'}</TableCell>
                    <TableCell>{historico.tecnicas_usadas || '-'}</TableCell>
                    <TableCell>{historico.observacoes || '-'}</TableCell>
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
                {historicos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                      Nenhum histórico de coloração cadastrado
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
