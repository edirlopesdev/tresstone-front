import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Edit, Trash2 } from 'lucide-react';
import { Button } from "./ui/button";

interface Perfil {
  id: string;
  nome: string;
  descricao: string;
  permissoes?: string[]; // Tornando permissoes opcional
}

export function PerfilList() {
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerfis();
  }, []);

  async function fetchPerfis() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('perfis')
        .select('*');

      if (error) throw error;
      setPerfis(data || []);
    } catch (error) {
      console.error('Erro ao buscar perfis:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (id: string) => {
    console.log('Editar perfil', id);
  };

  const handleDelete = (id: string) => {
    console.log('Excluir perfil', id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Perfis</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Carregando perfis...</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Nome</TableHead>
                  <TableHead className="font-semibold">Descrição</TableHead>
                  <TableHead className="font-semibold">Permissões</TableHead>
                  <TableHead className="font-semibold text-right pr-9">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {perfis.map((perfil) => (
                  <TableRow key={perfil.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{perfil.nome}</TableCell>
                    <TableCell>{perfil.descricao}</TableCell>
                    <TableCell>{perfil.permissoes ? perfil.permissoes.join(', ') : '-'}</TableCell>
                    <TableCell className="text-right pr-2">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(perfil.id)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(perfil.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {perfis.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                      Nenhum perfil cadastrado
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
