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
import { Plano } from '../types/supabase-types';

const planoSchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório"),
  max_usuarios: z.number().int().positive("O número máximo de usuários deve ser positivo"),
  recursos: z.string().transform((val) => JSON.parse(val)),
  preco: z.number().positive("O preço deve ser positivo"),
});

type PlanoFormValues = Omit<Plano, 'id' | 'criado_em'>;

export function PlanoForm() {
  const { toast } = useToast();
  const form = useForm<PlanoFormValues>({
    resolver: zodResolver(planoSchema),
  });

  const onSubmit = async (data: PlanoFormValues) => {
    try {
      const { data: plano, error } = await supabase
        .from('planos')
        .insert(data)
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Novo Plano</CardTitle>
        <CardDescription>Crie um novo plano de assinatura.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome do Plano</Label>
              <Input id="nome" {...form.register("nome")} />
            </div>
            <div>
              <Label htmlFor="max_usuarios">Máximo de Usuários</Label>
              <Input id="max_usuarios" type="number" {...form.register("max_usuarios", { valueAsNumber: true })} />
            </div>
            <div>
              <Label htmlFor="preco">Preço</Label>
              <Input id="preco" type="number" step="0.01" {...form.register("preco", { valueAsNumber: true })} />
            </div>
          </div>
          <div>
            <Label htmlFor="recursos">Recursos (JSON)</Label>
            <Textarea id="recursos" {...form.register("recursos")} />
          </div>
          <Button type="submit" className="w-full">Criar Plano</Button>
        </form>
      </CardContent>
    </Card>
  );
}
