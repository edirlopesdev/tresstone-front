import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "./ui/use-toast";
import { supabase } from '../supabaseClient';
import { Produto } from '../types/supabase-types';

const produtoSchema = z.object({
  empresa_id: z.string().uuid(),
  nome: z.string().min(1, "O nome é obrigatório"),
  marca: z.string().min(1, "A marca é obrigatória"),
  tipo: z.string().min(1, "O tipo é obrigatório"),
  codigo_cor: z.string().nullable(),
});

type ProdutoFormValues = Omit<Produto, 'id' | 'criado_em'>;

export function ProdutoForm() {
  const { toast } = useToast();
  const form = useForm<ProdutoFormValues>({
    resolver: zodResolver(produtoSchema),
  });

  const onSubmit = async (data: ProdutoFormValues) => {
    try {
      const { data: produto, error } = await supabase
        .from('produtos')
        .insert(data)
        .single();

      if (error) throw error;

      toast({
        title: "Produto criado",
        description: "O produto foi criado com sucesso.",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o produto.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Novo Produto</CardTitle>
        <CardDescription>Adicione um novo produto ao catálogo.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="empresa_id">Empresa</Label>
              <Input id="empresa_id" {...form.register("empresa_id")} />
            </div>
            <div>
              <Label htmlFor="nome">Nome do Produto</Label>
              <Input id="nome" {...form.register("nome")} />
            </div>
            <div>
              <Label htmlFor="marca">Marca</Label>
              <Input id="marca" {...form.register("marca")} />
            </div>
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Input id="tipo" {...form.register("tipo")} />
            </div>
            <div>
              <Label htmlFor="codigo_cor">Código da Cor</Label>
              <Input id="codigo_cor" {...form.register("codigo_cor")} />
            </div>
          </div>
          <Button type="submit" className="w-full">Criar Produto</Button>
        </form>
      </CardContent>
    </Card>
  );
}
