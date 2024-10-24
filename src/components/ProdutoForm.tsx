import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "./ui/use-toast";
import { supabase } from '../supabaseClient';

const produtoSchema = z.object({
  empresa_id: z.string().uuid(),
  nome: z.string().min(1, "O nome é obrigatório"),
  marca: z.string().min(1, "A marca é obrigatória"),
  tipo: z.string().min(1, "O tipo é obrigatório"),
  codigo_cor: z.string().optional(),
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
        title: "Produto cadastrado",
        description: "O produto foi cadastrado com sucesso.",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao cadastrar o produto.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Novo Produto</CardTitle>
        <CardDescription>Cadastre um novo produto.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="empresa_id">Empresa</Label>
            <Input id="empresa_id" {...form.register("empresa_id")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Produto</Label>
            <Input id="nome" {...form.register("nome")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="marca">Marca</Label>
            <Input id="marca" {...form.register("marca")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo</Label>
            <Input id="tipo" {...form.register("tipo")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="codigo_cor">Código da Cor</Label>
            <Input id="codigo_cor" {...form.register("codigo_cor")} />
          </div>
          <Button type="submit" className="w-full">Cadastrar Produto</Button>
        </form>
      </CardContent>
    </Card>
  );
}
