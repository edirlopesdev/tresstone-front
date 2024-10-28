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
import { Produto } from '../types/supabase-types';
import { SaveIcon } from "lucide-react";

const produtoSchema = z.object({
  empresa_id: z.string().uuid(),
  nome: z.string().min(1, "O nome é obrigatório"),
  marca: z.string().min(1, "A marca é obrigatória"),
  tipo: z.string().min(1, "O tipo é obrigatório"),
  codigo_cor: z.string().nullable(),
});

type ProdutoFormValues = Omit<Produto, 'id' | 'criado_em'>;

interface ProdutoFormProps {
  produtoParaEditar?: Produto;
  onProdutoSalvo: () => void;
}

export function ProdutoForm({ produtoParaEditar, onProdutoSalvo }: ProdutoFormProps) {
  const { toast } = useToast();
  const form = useForm<ProdutoFormValues>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      empresa_id: "",
      nome: "",
      marca: "",
      tipo: "",
      codigo_cor: "",
    },
  });

  useEffect(() => {
    if (produtoParaEditar) {
      form.reset({
        empresa_id: produtoParaEditar.empresa_id,
        nome: produtoParaEditar.nome,
        marca: produtoParaEditar.marca,
        tipo: produtoParaEditar.tipo,
        codigo_cor: produtoParaEditar.codigo_cor || "",
      });
    } else {
      form.reset({
        empresa_id: "",
        nome: "",
        marca: "",
        tipo: "",
        codigo_cor: "",
      });
    }
  }, [produtoParaEditar, form]);

  const onSubmit = async (data: ProdutoFormValues) => {
    try {
      let result;
      if (produtoParaEditar) {
        result = await supabase
          .from('produtos')
          .update(data)
          .eq('id', produtoParaEditar.id)
          .single();
      } else {
        result = await supabase
          .from('produtos')
          .insert(data)
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: produtoParaEditar ? "Produto atualizado" : "Produto criado",
        description: produtoParaEditar ? "O produto foi atualizado com sucesso." : "O produto foi criado com sucesso.",
      });

      form.reset();
      onProdutoSalvo();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast({
        title: "Erro",
        description: `Ocorreu um erro ao ${produtoParaEditar ? 'atualizar' : 'criar'} o produto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{produtoParaEditar ? 'Editar Produto' : 'Novo Produto'}</CardTitle>
        <CardDescription>{produtoParaEditar ? 'Edite os dados do produto.' : 'Adicione um novo produto ao catálogo.'}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="empresa_id">Empresa</Label>
              <Input id="empresa_id" {...form.register("empresa_id")} />
            </div>
            <div>
              <Label htmlFor="nome">Nome do Produto</Label>
              <Input id="nome" {...form.register("nome")} />
            </div>
            <div>
              <Label htmlFor="marca">Marca</Label>
              <Input id="marca" {...form.register("marca")} />
            </div>
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Input id="tipo" {...form.register("tipo")} />
            </div>
            <div>
              <Label htmlFor="codigo_cor">Código da Cor</Label>
              <Input id="codigo_cor" {...form.register("codigo_cor")} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">
              <SaveIcon className="w-4 h-4 mr-2" />
              {produtoParaEditar ? 'Atualizar Produto' : 'Cadastrar Produto'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
