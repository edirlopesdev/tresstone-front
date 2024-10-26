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
import { HistoricoColoracao } from '../types/supabase-types';

const historicoColoracaoSchema = z.object({
  cliente_id: z.string().uuid(),
  usuario_id: z.string().uuid(),
  cor_base: z.string().min(1, "A cor base é obrigatória"),
  cor_alvo: z.string().min(1, "A cor alvo é obrigatória"),
  produtos_usados: z.string().optional().transform(val => val ? JSON.parse(val) : null),
  tecnicas_usadas: z.string().optional().transform(val => val ? val.split(',').map(item => item.trim()) : null),
  observacoes: z.string().optional(),
});

type HistoricoColoracaoFormValues = Omit<HistoricoColoracao, 'id' | 'data'>;

export function HistoricoColoracaoForm() {
  const { toast } = useToast();
  const form = useForm<HistoricoColoracaoFormValues>({
    resolver: zodResolver(historicoColoracaoSchema),
  });

  const onSubmit = async (data: HistoricoColoracaoFormValues) => {
    try {
      const { data: historicoColoracao, error } = await supabase
        .from('historico_coloracao')
        .insert(data)
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Novo Histórico de Coloração</CardTitle>
        <CardDescription>Registre um novo histórico de coloração para um cliente.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cliente_id">Cliente</Label>
              <Input id="cliente_id" {...form.register("cliente_id")} />
            </div>
            <div>
              <Label htmlFor="usuario_id">Usuário</Label>
              <Input id="usuario_id" {...form.register("usuario_id")} />
            </div>
            <div>
              <Label htmlFor="cor_base">Cor Base</Label>
              <Input id="cor_base" {...form.register("cor_base")} />
            </div>
            <div>
              <Label htmlFor="cor_alvo">Cor Alvo</Label>
              <Input id="cor_alvo" {...form.register("cor_alvo")} />
            </div>
            <div>
              <Label htmlFor="produtos_usados">Produtos Usados (JSON)</Label>
              <Textarea id="produtos_usados" {...form.register("produtos_usados")} />
            </div>
            <div>
              <Label htmlFor="tecnicas_usadas">Técnicas Usadas (separadas por vírgula)</Label>
              <Input id="tecnicas_usadas" {...form.register("tecnicas_usadas")} />
            </div>
          </div>
          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea id="observacoes" {...form.register("observacoes")} />
          </div>
          <Button type="submit" className="w-full">Registrar Histórico de Coloração</Button>
        </form>
      </CardContent>
    </Card>
  );
}
