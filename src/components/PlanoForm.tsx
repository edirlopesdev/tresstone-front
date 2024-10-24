import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "../components/ui/textarea"
import { useToast } from "./ui/use-toast";
import { supabase } from '../supabaseClient';

const planoSchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório"),
  max_usuarios: z.number().int().positive(),
  recursos: z.string().min(1, "Os recursos são obrigatórios"),
  preco: z.number().positive(),
});

type PlanoFormValues = z.infer<typeof planoSchema>;

export function PlanoForm() {
  const { toast } = useToast();
  const form = useForm<PlanoFormValues>({
    resolver: zodResolver(planoSchema),
  });

  const onSubmit = async (data: PlanoFormValues) => {
    try {
      const formattedData = {
        ...data,
        recursos: JSON.parse(data.recursos),
      };

      const { data: plano, error } = await supabase
        .from('planos')
        .insert(formattedData)
        .single();

      if (error) throw error;

      toast({
        title: "Plano criado",
        description: "O plano foi criado com sucesso.",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o plano.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Novo Plano</CardTitle>
        <CardDescription>Crie um novo plano de assinatura.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Plano</Label>
            <Input id="nome" {...form.register("nome")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max_usuarios">Máximo de Usuários</Label>
            <Input id="max_usuarios" type="number" {...form.register("max_usuarios", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recursos">Recursos (JSON)</Label>
            <Textarea id="recursos" {...form.register("recursos")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preco">Preço</Label>
            <Input id="preco" type="number" step="0.01" {...form.register("preco", { valueAsNumber: true })} />
          </div>
          <Button type="submit" className="w-full">Criar Plano</Button>
        </form>
      </CardContent>
    </Card>
  );
}
