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
  data_coloracao: z.string().datetime(),
  cor_aplicada: z.string().min(1, "A cor aplicada é obrigatória"),
  tecnica_usada: z.string().optional(),
  produtos_usados: z.string().optional(),
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="cliente_id">Cliente</Label>
              <Input id="cliente_id" {...form.register("cliente_id")} />
            </div>
            <div>
              <Label htmlFor="data_coloracao">Data da Coloração</Label>
              <Input id="data_coloracao" type="datetime-local" {...form.register("data_coloracao")} />
            </div>
            <div>
              <Label htmlFor="cor_aplicada">Cor Aplicada</Label>
              <Input id="cor_aplicada" {...form.register("cor_aplicada")} />
            </div>
            <div>
              <Label htmlFor="tecnica_usada">Técnica Usada</Label>
              <Input id="tecnica_usada" {...form.register("tecnica_usada")} />
            </div>
            <div>
              <Label htmlFor="produtos_usados">Produtos Usados</Label>
              <Input id="produtos_usados" {...form.register("produtos_usados")} />
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
