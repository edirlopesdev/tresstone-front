import React, { useEffect } from "react";
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
import { SaveIcon } from "lucide-react";

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

interface HistoricoColoracaoFormProps {
  historicoParaEditar?: HistoricoColoracao;
  onHistoricoSalvo: () => void;
}

export function HistoricoColoracaoForm({ historicoParaEditar, onHistoricoSalvo }: HistoricoColoracaoFormProps) {
  const { toast } = useToast();
  const form = useForm<HistoricoColoracaoFormValues>({
    resolver: zodResolver(historicoColoracaoSchema),
    defaultValues: {
      cliente_id: "",
      usuario_id: "",
      cor_base: "",
      cor_alvo: "",
      produtos_usados: "",
      tecnicas_usadas: "",
      observacoes: "",
    },
  });

  useEffect(() => {
    if (historicoParaEditar) {
      form.reset({
        cliente_id: historicoParaEditar.cliente_id,
        usuario_id: historicoParaEditar.usuario_id,
        cor_base: historicoParaEditar.cor_base,
        cor_alvo: historicoParaEditar.cor_alvo,
        produtos_usados: historicoParaEditar.produtos_usados || "",
        tecnicas_usadas: historicoParaEditar.tecnicas_usadas || "",
        observacoes: historicoParaEditar.observacoes || "",
      });
    } else {
      form.reset({
        cliente_id: "",
        usuario_id: "",
        cor_base: "",
        cor_alvo: "",
        produtos_usados: "",
        tecnicas_usadas: "",
        observacoes: "",
      });
    }
  }, [historicoParaEditar, form]);

  const onSubmit = async (data: HistoricoColoracaoFormValues) => {
    console.log("Dados do formulário:", data);
    try {
      let result;
      if (historicoParaEditar) {
        result = await supabase
          .from('historico_coloracao')
          .update(data)
          .eq('id', historicoParaEditar.id)
          .single();
      } else {
        result = await supabase
          .from('historico_coloracao')
          .insert(data)
          .single();
      }

      if (result.error) throw result.error;

      console.log("Resposta do Supabase:", result);

      toast({
        title: historicoParaEditar ? "Histórico atualizado" : "Histórico registrado",
        description: historicoParaEditar ? "O histórico de coloração foi atualizado com sucesso." : "O histórico de coloração foi registrado com sucesso.",
      });

      form.reset(); // Resetar o formulário após o sucesso
      onHistoricoSalvo();
    } catch (error) {
      console.error('Erro ao salvar histórico de coloração:', error);
      toast({
        title: "Erro",
        description: `Ocorreu um erro ao ${historicoParaEditar ? 'atualizar' : 'registrar'} o histórico de coloração: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{historicoParaEditar ? 'Editar Histórico de Coloração' : 'Novo Histórico de Coloração'}</CardTitle>
        <CardDescription>{historicoParaEditar ? 'Edite os dados do histórico de coloração.' : 'Registre um novo histórico de coloração para um cliente.'}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cliente_id">Cliente ID</Label>
              <Input id="cliente_id" {...form.register("cliente_id")} />
              {form.formState.errors.cliente_id && (
                <p className="text-red-500">{form.formState.errors.cliente_id.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="usuario_id">Usuário ID</Label>
              <Input id="usuario_id" {...form.register("usuario_id")} />
              {form.formState.errors.usuario_id && (
                <p className="text-red-500">{form.formState.errors.usuario_id.message}</p>
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
          <div className="flex justify-end">
            <Button type="submit">
              <SaveIcon className="w-4 h-4 mr-2" />
              {historicoParaEditar ? 'Atualizar Histórico' : 'Cadastrar Histórico'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
