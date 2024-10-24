import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

interface Perfil {
  id: string;
  empresa_id: string;
  nome: string;
  cargo: string;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Perfis</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Carregando perfis...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cargo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {perfis.map((perfil) => (
                <TableRow key={perfil.id}>
                  <TableCell>{perfil.nome}</TableCell>
                  <TableCell>{perfil.cargo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
