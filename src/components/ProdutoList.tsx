import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Edit, Trash2 } from 'lucide-react';
import { Button } from "./ui/button";

interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  quantidade_estoque: number;
  categoria: string;
}

// JSON de produtos de exemplo
const produtosExemplo: Produto[] = [
  {
    id: '1',
    nome: 'Shampoo Hidratante',
    descricao: 'Shampoo para cabelos secos',
    preco: 29.99,
    quantidade_estoque: 50,
    categoria: 'Cuidados com o Cabelo'
  },
  {
    id: '2',
    nome: 'Condicionador Reparador',
    descricao: 'Condicionador para cabelos danificados',
    preco: 34.99,
    quantidade_estoque: 40,
    categoria: 'Cuidados com o Cabelo'
  },
  {
    id: '3',
    nome: 'Máscara Capilar',
    descricao: 'Máscara de tratamento intensivo',
    preco: 45.99,
    quantidade_estoque: 30,
    categoria: 'Tratamentos'
  },
];

export function ProdutoList() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProdutos();
  }, []);

  async function fetchProdutos() {
    try {
      setLoading(true);
      // Simula uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProdutos(produtosExemplo);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (id: string) => {
    console.log('Editar produto', id);
  };

  const handleDelete = (id: string) => {
    console.log('Excluir produto', id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Produtos</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Carregando produtos...</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Nome</TableHead>
                  <TableHead className="font-semibold">Preço</TableHead>
                  <TableHead className="font-semibold">Estoque</TableHead>
                  <TableHead className="font-semibold">Categoria</TableHead>
                  <TableHead className="font-semibold text-right pr-9">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtos.map((produto) => (
                  <TableRow key={produto.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{produto.nome}</TableCell>
                    <TableCell>R$ {produto.preco.toFixed(2)}</TableCell>
                    <TableCell>{produto.quantidade_estoque}</TableCell>
                    <TableCell>{produto.categoria}</TableCell>
                    <TableCell className="text-right pr-2">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(produto.id)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(produto.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {produtos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      Nenhum produto cadastrado
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
