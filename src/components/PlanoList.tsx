import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Edit, Trash2 } from 'lucide-react';
import { Button } from "./ui/button";

interface Plano {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracao: number;
  recursos: string;
}

// JSON de planos de exemplo
const planosExemplo: Plano[] = [
  {
    id: '1',
    nome: 'Básico',
    descricao: 'Plano básico para pequenos salões',
    preco: 49.99,
    duracao: 1,
    recursos: 'Agendamentos, Clientes, Histórico de Coloração'
  },
  {
    id: '2',
    nome: 'Profissional',
    descricao: 'Plano ideal para salões de médio porte',
    preco: 99.99,
    duracao: 1,
    recursos: 'Agendamentos, Clientes, Histórico de Coloração, Relatórios'
  },
  {
    id: '3',
    nome: 'Enterprise',
    descricao: 'Plano completo para grandes redes de salões',
    preco: 199.99,
    duracao: 1,
    recursos: 'Agendamentos, Clientes, Histórico de Coloração, Relatórios, Múltiplas Unidades'
  },
];

export function PlanoList() {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlanos();
  }, []);

  async function fetchPlanos() {
    try {
      setLoading(true);
      // Simula uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPlanos(planosExemplo);
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (id: string) => {
    console.log('Editar plano', id);
  };

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
                  <TableHead className="font-semibold">Preço</TableHead>
                  <TableHead className="font-semibold">Duração</TableHead>
                  <TableHead className="font-semibold">Recursos</TableHead>
                  <TableHead className="font-semibold text-right pr-9">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {planos.map((plano) => (
                  <TableRow key={plano.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{plano.nome}</TableCell>
                    <TableCell>R$ {plano.preco.toFixed(2)}</TableCell>
                    <TableCell>{plano.duracao} {plano.duracao === 1 ? 'mês' : 'meses'}</TableCell>
                    <TableCell>{plano.recursos}</TableCell>
                    <TableCell className="text-right pr-2">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(plano.id)}
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
