import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "./ui/use-toast";
import { supabase } from '../supabaseClient';
import { Cliente } from '../types/supabase-types';
import { SaveIcon, ArrowLeft } from "lucide-react";

const clienteSchema = z.object({
  empresa_id: z.string().uuid(),
  nome: z.string().min(1, "O nome é obrigatório"),
  tipo_cabelo: z.string().nullable(),
  condicao_cabelo: z.string().nullable(),
});

type ClienteFormValues = Omit<Cliente, 'id' | 'criado_em'>;

interface ClienteFormProps {
  clienteParaEditar?: Cliente;
  onClienteSalvo: () => void;
  onVoltar: () => void;
}

export function ClienteForm({ clienteParaEditar, onClienteSalvo, onVoltar }: ClienteFormProps) {
  const { toast } = useToast();
  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      empresa_id: "",
      nome: "",
      tipo_cabelo: "",
      condicao_cabelo: "",
    },
  });

  useEffect(() => {
    if (clienteParaEditar) {
      form.reset({
        empresa_id: clienteParaEditar.empresa_id,
        nome: clienteParaEditar.nome,
        tipo_cabelo: clienteParaEditar.tipo_cabelo || "",
        condicao_cabelo: clienteParaEditar.condicao_cabelo || "",
      });
    } else {
      form.reset({
        empresa_id: "",
        nome: "",
        tipo_cabelo: "",
        condicao_cabelo: "",
      });
    }
  }, [clienteParaEditar, form]);

  const onSubmit = async (data: ClienteFormValues) => {
    try {
      let result;
      if (clienteParaEditar) {
        result = await supabase
          .from('clientes')
          .update(data)
          .eq('id', clienteParaEditar.id)
          .single();
      } else {
        result = await supabase
          .from('clientes')
          .insert(data)
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: clienteParaEditar ? "Cliente atualizado" : "Cliente cadastrado",
        description: clienteParaEditar ? "O cliente foi atualizado com sucesso." : "O cliente foi cadastrado com sucesso.",
      });

      form.reset();
      onClienteSalvo();
    } catch (error) {
      toast({
        title: "Erro",
        description: `Ocorreu um erro ao ${clienteParaEditar ? 'atualizar' : 'cadastrar'} o cliente.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{clienteParaEditar ? 'Editar Cliente' : 'Novo Cliente'}</CardTitle>
          <CardDescription>{clienteParaEditar ? 'Edite os dados do cliente.' : 'Cadastre um novo cliente.'}</CardDescription>
        </div>
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
          <div className="flex justify-end gap-2">
            <Button type="button" variant="destructive" onClick={onVoltar}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button type="submit">
              <SaveIcon className="w-4 h-4 mr-2" />
              {clienteParaEditar ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
