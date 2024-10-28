import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { supabase } from '../supabaseClient';
import { HistoricoColoracao } from '../types/supabase-types';
import { SaveIcon, ArrowLeft } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';

const historicoSchema = z.object({
  cliente_id: z.string().uuid("ID do cliente inválido"),
  usuario_id: z.string().uuid("ID do usuário inválido"),
  cor_base: z.string().min(1, "A cor base é obrigatória"),
  cor_alvo: z.string().min(1, "A cor alvo é obrigatória"),
  produtos_usados: z.string().nullable(),
  tecnicas_usadas: z.string().nullable(),
  observacoes: z.string().nullable(),
  data: z.string().min(1, "A data é obrigatória"),
});

type HistoricoFormValues = z.infer<typeof historicoSchema>;

interface HistoricoColoracaoFormProps {
  historicoParaEditar?: HistoricoColoracao;
  onHistoricoSalvo: () => void;
  onVoltar: () => void;
}

export function HistoricoColoracaoForm({ historicoParaEditar, onHistoricoSalvo, onVoltar }: HistoricoColoracaoFormProps) {
  const { toast } = useToast();
  const { empresaId, user } = useAuth();
  
  const form = useForm<HistoricoFormValues>({
    resolver: zodResolver(historicoSchema),
    defaultValues: {
      usuario_id: user?.id || "",
      cliente_id: "",
      cor_base: "",
      cor_alvo: "",
      produtos_usados: "",
      tecnicas_usadas: "",
      observacoes: "",
      data: new Date().toISOString().slice(0, 10),
    },
  });

  useEffect(() => {
    if (user?.id) {
      form.setValue('usuario_id', user.id);
    }
  }, [user, form]);

  useEffect(() => {
    if (historicoParaEditar) {
      const dataFormatada = new Date(historicoParaEditar.data).toISOString().slice(0, 10);
      
      form.reset({
        usuario_id: user?.id || "",
        cliente_id: historicoParaEditar.cliente_id,
        cor_base: historicoParaEditar.cor_base,
        cor_alvo: historicoParaEditar.cor_alvo,
        produtos_usados: historicoParaEditar.produtos_usados || "",
        tecnicas_usadas: historicoParaEditar.tecnicas_usadas || "",
        observacoes: historicoParaEditar.observacoes || "",
        data: dataFormatada,
      });
    }
  }, [historicoParaEditar, user, form]);

  const onSubmit = async (data: HistoricoFormValues) => {
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não identificado",
        variant: "destructive",
      });
      return;
    }

    try {
      // Primeiro, verifica se o cliente pertence à empresa correta
      const { data: clienteData, error: clienteError } = await supabase
        .from('clientes')
        .select('empresa_id')
        .eq('id', data.cliente_id)
        .single();

      if (clienteError) throw clienteError;

      if (clienteData.empresa_id !== empresaId) {
        toast({
          title: "Erro",
          description: "Cliente não pertence a esta empresa",
          variant: "destructive",
        });
        return;
      }

      const historicoData = {
        ...data,
        usuario_id: user.id,
      };

      let result;
      if (historicoParaEditar) {
        result = await supabase
          .from('historico_coloracao')
          .update(historicoData)
          .eq('id', historicoParaEditar.id)
          .single();
      } else {
        result = await supabase
          .from('historico_coloracao')
          .insert(historicoData)
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: historicoParaEditar ? "Histórico atualizado" : "Histórico registrado",
        description: historicoParaEditar ? "O histórico foi atualizado com sucesso." : "O histórico foi registrado com sucesso.",
      });

      form.reset({
        usuario_id: user.id,
        cliente_id: "",
        cor_base: "",
        cor_alvo: "",
        produtos_usados: "",
        tecnicas_usadas: "",
        observacoes: "",
        data: new Date().toISOString().slice(0, 10),
      });
      
      onHistoricoSalvo();
    } catch (error) {
      console.error('Erro ao salvar histórico:', error);
      toast({
        title: "Erro",
        description: `Ocorreu um erro ao ${historicoParaEditar ? 'atualizar' : 'registrar'} o histórico: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{historicoParaEditar ? 'Editar Histórico' : 'Novo Histórico'}</CardTitle>
          <CardDescription>
            {historicoParaEditar ? 'Edite os dados do histórico de coloração.' : 'Registre um novo histórico de coloração.'}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input type="hidden" {...form.register("usuario_id")} />
            
            <div>
              <Label htmlFor="cliente_id">Cliente</Label>
              <Input id="cliente_id" {...form.register("cliente_id")} />
              {form.formState.errors.cliente_id && (
                <p className="text-red-500">{form.formState.errors.cliente_id.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="data">Data</Label>
              <Input type="date" id="data" {...form.register("data")} />
              {form.formState.errors.data && (
                <p className="text-red-500">{form.formState.errors.data.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="cor_base">Cor Base</Label>
              <Input id="cor_base" {...form.register("cor_base")} />
              {form.formState.errors.cor_base && (
                <p className="text-red-500">{form.formState.errors.cor_base.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="cor_alvo">Cor Alvo</Label>
              <Input id="cor_alvo" {...form.register("cor_alvo")} />
              {form.formState.errors.cor_alvo && (
                <p className="text-red-500">{form.formState.errors.cor_alvo.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="produtos_usados">Produtos Usados</Label>
              <Input id="produtos_usados" {...form.register("produtos_usados")} />
            </div>

            <div>
              <Label htmlFor="tecnicas_usadas">Técnicas Usadas</Label>
              <Input id="tecnicas_usadas" {...form.register("tecnicas_usadas")} />
            </div>
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea id="observacoes" {...form.register("observacoes")} />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="destructive" onClick={onVoltar}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button type="submit">
              <SaveIcon className="w-4 h-4 mr-2" />
              {historicoParaEditar ? 'Atualizar Histórico' : 'Registrar Histórico'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
