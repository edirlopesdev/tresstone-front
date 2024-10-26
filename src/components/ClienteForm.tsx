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
import { Cliente } from '../types/supabase-types';

const clienteSchema = z.object({
  empresa_id: z.string().uuid(),
  nome: z.string().min(1, "O nome é obrigatório"),
  tipo_cabelo: z.string().nullable(),
  condicao_cabelo: z.string().nullable(),
});

type ClienteFormValues = Omit<Cliente, 'id' | 'criado_em'>;

export function ClienteForm() {
  const { toast } = useToast();
  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
  });

  const onSubmit = async (data: ClienteFormValues) => {
    try {
      const { data: cliente, error } = await supabase
        .from('clientes')
        .insert(data)
        .single();

      if (error) throw error;

      toast({
        title: "Cliente cadastrado",
        description: "O cliente foi cadastrado com sucesso.",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao cadastrar o cliente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Novo Cliente</CardTitle>
        <CardDescription>Cadastre um novo cliente.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="empresa_id">Empresa</Label>
              <Input id="empresa_id" {...form.register("empresa_id")} />
            </div>
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" {...form.register("nome")} />
            </div>
            <div>
              <Label htmlFor="tipo_cabelo">Tipo de Cabelo</Label>
              <Input id="tipo_cabelo" {...form.register("tipo_cabelo")} />
            </div>
            <div>
              <Label htmlFor="condicao_cabelo">Condição do Cabelo</Label>
              <Input id="condicao_cabelo" {...form.register("condicao_cabelo")} />
            </div>
          </div>
          <Button type="submit" className="w-full">Cadastrar Cliente</Button>
        </form>
      </CardContent>
    </Card>
  );
}
