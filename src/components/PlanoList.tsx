import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Edit, Trash2 } from 'lucide-react';
import { Button } from "./ui/button";
import { Plano } from '../types/supabase-types';

interface PlanoListProps {
  onEditPlano: (plano: Plano) => void;
  triggerRefetch: boolean;
}

export function PlanoList({ onEditPlano, triggerRefetch }: PlanoListProps) {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlanos();
  }, [triggerRefetch]);

  async function fetchPlanos() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('planos')
        .select('*');

      if (error) throw error;
      setPlanos(data || []);
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = (id: string) => {
    console.log('Excluir plano', id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Planos</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Carregando planos...</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Nome</TableHead>
                  <TableHead className="font-semibold">Máx. Usuários</TableHead>
                  <TableHead className="font-semibold">Preço</TableHead>
                  <TableHead className="font-semibold">Recursos</TableHead>
                  <TableHead className="font-semibold text-right pr-9">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {planos.map((plano) => (
                  <TableRow key={plano.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{plano.nome}</TableCell>
                    <TableCell>{plano.max_usuarios}</TableCell>
                    <TableCell>R$ {plano.preco.toFixed(2)}</TableCell>
                    <TableCell>{JSON.stringify(plano.recursos)}</TableCell>
                    <TableCell className="text-right pr-2">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditPlano(plano)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(plano.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {planos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      Nenhum plano cadastrado
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
