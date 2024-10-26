import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "../components/ui/textarea"
import { useToast } from "./ui/use-toast";
import { supabase } from '../supabaseClient';

const produtoSchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório"),
  descricao: z.string().optional(),
  preco: z.number().min(0, "O preço deve ser maior ou igual a zero"),
  quantidade_estoque: z.number().int().min(0, "A quantidade em estoque deve ser maior ou igual a zero"),
  categoria: z.string().optional(),
});

type ProdutoFormValues = z.infer<typeof produtoSchema>;

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="nome">Nome do Produto</Label>
              <Input id="nome" {...form.register("nome")} />
            </div>
            <div>
              <Label htmlFor="preco">Preço</Label>
              <Input id="preco" type="number" step="0.01" {...form.register("preco", { valueAsNumber: true })} />
            </div>
            <div>
              <Label htmlFor="quantidade_estoque">Quantidade em Estoque</Label>
              <Input id="quantidade_estoque" type="number" {...form.register("quantidade_estoque", { valueAsNumber: true })} />
            </div>
          </div>
          <div>
            <Label htmlFor="categoria">Categoria</Label>
            <Input id="categoria" {...form.register("categoria")} />
          </div>
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" {...form.register("descricao")} />
          </div>
          <Button type="submit" className="w-full">Criar Produto</Button>
        </form>
      </CardContent>
    </Card>
  );
}
