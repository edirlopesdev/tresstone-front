import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "./ui/use-toast";
import { supabase } from '../supabaseClient';

const perfilSchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório"),
  descricao: z.string().optional(),
  permissoes: z.array(z.string()).optional(),
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Novo Perfil</CardTitle>
        <CardDescription>Crie um novo perfil de usuário.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome do Perfil</Label>
              <Input id="nome" {...form.register("nome")} />
            </div>
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Input id="descricao" {...form.register("descricao")} />
            </div>
          </div>
          <div>
            <Label htmlFor="permissoes">Permissões (separadas por vírgula)</Label>
            <Input 
              id="permissoes" 
              {...form.register("permissoes")} 
              onChange={(e) => {
                const permissoes = e.target.value.split(',').map(p => p.trim());
                form.setValue("permissoes", permissoes);
              }}
            />
          </div>
          <Button type="submit" className="w-full">Criar Perfil</Button>
        </form>
      </CardContent>
    </Card>
  );
}
