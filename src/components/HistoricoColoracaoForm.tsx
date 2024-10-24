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

const historicoColoracaoSchema = z.object({
  cliente_id: z.string().uuid(),
  usuario_id: z.string().uuid(),
  cor_base: z.string().min(1, "A cor base é obrigatória"),
  cor_alvo: z.string().min(1, "A cor alvo é obrigatória"),
  produtos_usados: z.string().optional(),
  tecnicas_usadas: z.string().optional(),
  observacoes: z.string().optional(),
});

type HistoricoColoracaoFormValues = z.infer<typeof historicoColoracaoSchema>;

export function HistoricoColoracaoForm() {
  const { toast } = useToast();
  const form = useForm<HistoricoColoracaoFormValues>({
    resolver: zodResolver(historicoColoracaoSchema),
  });

  const onSubmit = async (data: HistoricoColoracaoFormValues) => {
    try {
      const formattedData = {
        ...data,
        produtos_usados: data.produtos_usados ? JSON.parse(data.produtos_usados) : null,
        tecnicas_usadas: data.tecnicas_usadas ? data.tecnicas_usadas.split(',').map(t => t.trim()) : null,
      };

      const { data: historico, error } = await supabase
        .from('historico_coloracao')
        .insert(formattedData)
        .single();

      if (error) throw error;

      toast({
        title: "Histórico de coloração registrado",
        description: "O histórico de coloração foi registrado com sucesso.",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao registrar o histórico de coloração.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Novo Histórico de Coloração</CardTitle>
        <CardDescription>Registre um novo histórico de coloração para um cliente.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cliente_id">Cliente</Label>
            <Input id="cliente_id" {...form.register("cliente_id")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="usuario_id">Usuário</Label>
            <Input id="usuario_id" {...form.register("usuario_id")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cor_base">Cor Base</Label>
            <Input id="cor_base" {...form.register("cor_base")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cor_alvo">Cor Alvo</Label>
            <Input id="cor_alvo" {...form.register("cor_alvo")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="produtos_usados">Produtos Usados (JSON)</Label>
            <Textarea id="produtos_usados" {...form.register("produtos_usados")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tecnicas_usadas">Técnicas Usadas (separadas por vírgula)</Label>
            <Input id="tecnicas_usadas" {...form.register("tecnicas_usadas")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea id="observacoes" {...form.register("observacoes")} />
          </div>
          <Button type="submit" className="w-full">Registrar Histórico</Button>
        </form>
      </CardContent>
    </Card>
  );
}
