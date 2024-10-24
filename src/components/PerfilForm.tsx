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

const perfilSchema = z.object({
  id: z.string().uuid(),
  empresa_id: z.string().uuid(),
  nome: z.string().min(1, "O nome é obrigatório"),
  cargo: z.string().min(1, "O cargo é obrigatório"),
});

type PerfilFormValues = z.infer<typeof perfilSchema>;

export function PerfilForm() {
  const { toast } = useToast();
  const form = useForm<PerfilFormValues>({
    resolver: zodResolver(perfilSchema),
  });

  const onSubmit = async (data: PerfilFormValues) => {
    try {
      const { data: perfil, error } = await supabase
        .from('perfis')
        .insert(data)
        .single();

      if (error) throw error;

      toast({
        title: "Perfil criado",
        description: "O perfil foi criado com sucesso.",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o perfil.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Novo Perfil</CardTitle>
        <CardDescription>Crie um novo perfil de usuário.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id">ID do Usuário</Label>
            <Input id="id" {...form.register("id")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="empresa_id">Empresa</Label>
            <Input id="empresa_id" {...form.register("empresa_id")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" {...form.register("nome")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cargo">Cargo</Label>
            <Input id="cargo" {...form.register("cargo")} />
          </div>
          <Button type="submit" className="w-full">Criar Perfil</Button>
        </form>
      </CardContent>
    </Card>
  );
}
