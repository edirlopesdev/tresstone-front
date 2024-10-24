import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea"
import { useToast } from "./ui/use-toast";
import { supabase } from '../supabaseClient';

const agendamentoSchema = z.object({
  empresa_id: z.string().uuid(),
  usuario_id: z.string().uuid(),
  cliente_id: z.string().uuid(),
  data_agendamento: z.string().datetime(),
  tipo_servico: z.string().optional(),
  status: z.enum(["pendente", "confirmado", "cancelado"]).default("pendente"),
  observacoes: z.string().optional(),
});

type AgendamentoFormValues = z.infer<typeof agendamentoSchema>;

export function AgendamentoForm() {
  const { toast } = useToast();
  const form = useForm<AgendamentoFormValues>({
    resolver: zodResolver(agendamentoSchema),
    defaultValues: {
      status: "pendente",
    },
  });

  const onSubmit = async (data: AgendamentoFormValues) => {
    try {
      const { data: agendamento, error } = await supabase
        .from('agendamentos')
        .insert(data)
        .single();

      if (error) throw error;

      toast({
        title: "Agendamento criado",
        description: "O agendamento foi criado com sucesso.",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o agendamento.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Novo Agendamento</CardTitle>
        <CardDescription>Crie um novo agendamento para um cliente.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="empresa_id">Empresa</Label>
            <Input id="empresa_id" {...form.register("empresa_id")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="usuario_id">Usuário</Label>
            <Input id="usuario_id" {...form.register("usuario_id")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cliente_id">Cliente</Label>
            <Input id="cliente_id" {...form.register("cliente_id")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="data_agendamento">Data do Agendamento</Label>
            <Input id="data_agendamento" type="datetime-local" {...form.register("data_agendamento")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipo_servico">Tipo de Serviço</Label>
            <Input id="tipo_servico" {...form.register("tipo_servico")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={(value: string) => form.setValue("status", value as AgendamentoFormValues["status"])}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea id="observacoes" {...form.register("observacoes")} />
          </div>
          <Button type="submit" className="w-full">Criar Agendamento</Button>
        </form>
      </CardContent>
    </Card>
  );
}
