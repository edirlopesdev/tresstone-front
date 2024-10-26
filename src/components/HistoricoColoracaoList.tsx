import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Edit, Trash2 } from 'lucide-react';
import { Button } from "./ui/button";

interface HistoricoColoracao {
  id: string;
  cliente_id: string;
  data_coloracao: string;
  cor_aplicada: string;
  tecnica_usada: string;
  produtos_usados: string;
  observacoes: string;
}

// JSON de histórico de coloração de exemplo
const historicoColoracaoExemplo: HistoricoColoracao[] = [
  {
    id: '1',
    cliente_id: 'cliente1',
    data_coloracao: '2023-06-01T10:00:00',
    cor_aplicada: 'Loiro Platinado',
    tecnica_usada: 'Mechas',
    produtos_usados: 'Descolorante, Tonalizante',
    observacoes: 'Cliente satisfeita com o resultado'
  },
  {
    id: '2',
    cliente_id: 'cliente2',
    data_coloracao: '2023-06-02T14:00:00',
    cor_aplicada: 'Ruivo Intenso',
    tecnica_usada: 'Coloração Global',
    produtos_usados: 'Coloração permanente',
    observacoes: 'Retocar a cada 4 semanas'
  },
  {
    id: '3',
    cliente_id: 'cliente3',
    data_coloracao: '2023-06-03T11:00:00',
    cor_aplicada: 'Castanho Chocolate',
    tecnica_usada: 'Balayage',
    produtos_usados: 'Coloração semi-permanente',
    observacoes: 'Manutenção com shampoo especial'
  },
];

export function HistoricoColoracaoList() {
  const [historicoColoracao, setHistoricoColoracao] = useState<HistoricoColoracao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistoricoColoracao();
  }, []);

  async function fetchHistoricoColoracao() {
    try {
      setLoading(true);
      // Simula uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHistoricoColoracao(historicoColoracaoExemplo);
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
                  <TableHead className="font-semibold">Cor Aplicada</TableHead>
                  <TableHead className="font-semibold">Técnica Usada</TableHead>
                  <TableHead className="font-semibold">Produtos Usados</TableHead>
                  <TableHead className="font-semibold text-right pr-9">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historicoColoracao.map((historico) => (
                  <TableRow key={historico.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{new Date(historico.data_coloracao).toLocaleString()}</TableCell>
                    <TableCell>{historico.cor_aplicada}</TableCell>
                    <TableCell>{historico.tecnica_usada}</TableCell>
                    <TableCell>{historico.produtos_usados}</TableCell>
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
