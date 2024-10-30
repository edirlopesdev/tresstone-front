import React, { useEffect, useState } from "react";
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
import { HistoricoColoracao, ResultadoClareamento } from '../types/supabase-types';
import { SaveIcon, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';
import { PhotoUpload } from './PhotoUpload';
import { ColorReferenceSystem } from './ColorReferenceSystem';

const historicoSchema = z.object({
  cliente_id: z.string().uuid("ID do cliente inválido"),
  usuario_id: z.string().uuid("ID do usuário inválido"),
  cor_base_nivel: z.string().min(1, "Selecione a cor base"),
  cor_alvo_nivel: z.string().min(1, "Selecione a cor desejada"),
  produtos_usados: z.string().nullable(),
  tecnicas_usadas: z.string().nullable(),
  observacoes: z.string().nullable(),
  data: z.string().min(1, "A data é obrigatória"),
  foto_antes: z.string().optional(),
  foto_depois: z.string().optional(),
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
      cor_base_nivel: "",
      cor_alvo_nivel: "",
      produtos_usados: "",
      tecnicas_usadas: "",
      observacoes: "",
      data: new Date().toISOString().slice(0, 10),
      foto_antes: "",
      foto_depois: "",
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
        cor_base_nivel: historicoParaEditar.cor_base_nivel,
        cor_alvo_nivel: historicoParaEditar.cor_alvo_nivel,
        produtos_usados: historicoParaEditar.produtos_usados || "",
        tecnicas_usadas: historicoParaEditar.tecnicas_usadas || "",
        observacoes: historicoParaEditar.observacoes || "",
        data: dataFormatada,
      });
    }
  }, [historicoParaEditar, user, form]);

  const [isSaving, setIsSaving] = useState(false);
  const [localFotoAntes, setLocalFotoAntes] = useState<string | null>(null);

  const onSubmit = async (data: HistoricoFormValues) => {
    if (!user?.id) return;

    try {
      setIsSaving(true);
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

      // Preparar dados do histórico
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
          .select()
          .single();
      } else {
        result = await supabase
          .from('historico_coloracao')
          .insert(historicoData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: historicoParaEditar ? "Histórico atualizado" : "Histórico registrado",
        description: historicoParaEditar ? "O histórico foi atualizado com sucesso." : "O histórico foi registrado com sucesso.",
      });

      onHistoricoSalvo();
    } catch (error) {
      console.error('Erro ao salvar histórico:', error);
      toast({
        title: "Erro",
        description: `Ocorreu um erro ao ${historicoParaEditar ? 'atualizar' : 'registrar'} o histórico: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleColorSelection = (baseColor: string, targetColor: string) => {
    form.setValue("cor_base_nivel", baseColor, { shouldValidate: true });
    form.setValue("cor_alvo_nivel", targetColor, { shouldValidate: true });
  };

  const handleColorCalculation = (resultado: ResultadoClareamento) => {
    form.setValue("produtos_usados", resultado.produtos_recomendados.join(", "));
    form.setValue("observacoes", 
      `Níveis necessários: ${resultado.niveis_necessarios}
       Volume oxidante: ${resultado.volume_oxidante}
       Tempo estimado: ${resultado.tempo_estimado} minutos
       Fundo de revelação: ${resultado.fundo_revelacao}`
    );
  };

  const handlePhotoUpload = async (localUrl: string, file: File, type: 'antes' | 'depois') => {
    try {
      if (type === 'antes') {
        setLocalFotoAntes(localUrl);
      }

      // Validações do arquivo
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Arquivo muito grande. O tamanho máximo é 5MB.');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('Apenas arquivos de imagem são permitidos.');
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const fileName = `${form.watch("cliente_id")}/${year}/${month}/${Date.now()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from('client-photos')
        .upload(fileName, file, {
          upsert: false,
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('client-photos')
        .getPublicUrl(fileName);

      if (!urlData.publicUrl) {
        throw new Error('Erro ao obter URL da imagem');
      }

      form.setValue(type === 'antes' ? 'foto_antes' : 'foto_depois', urlData.publicUrl);
      
      toast({
        title: "Sucesso",
        description: "Foto enviada com sucesso!",
      });

    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : 'Erro ao fazer upload da foto',
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input type="hidden" {...form.register("usuario_id")} />
            
            <div>
              <Label htmlFor="cliente_id">Cliente</Label>
              <Input 
                id="cliente_id" 
                {...form.register("cliente_id")}
                onChange={(e) => {
                  form.setValue("cliente_id", e.target.value);
                  console.log("Cliente ID:", e.target.value); // Debug
                }}
              />
              {form.formState.errors.cliente_id && (
                <p className="text-red-500">{form.formState.errors.cliente_id.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="data">Data</Label>
              <Input 
                type="date" 
                id="data" 
                {...form.register("data")}
              />
              {form.formState.errors.data && (
                <p className="text-red-500">{form.formState.errors.data.message}</p>
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

          {/* Sistema de Referência de Cores */}
          <div className="col-span-2 border rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-medium mb-4">Análise de Cor</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Foto Antes</Label>
                <PhotoUpload
                  clienteId={form.watch("cliente_id")}
                  onUpload={(localUrl, file) => handlePhotoUpload(localUrl, file, 'antes')}
                />
                {form.watch("foto_antes") && (
                  <img 
                    src={form.watch("foto_antes")} 
                    alt="Antes" 
                    className="mt-2 w-full max-w-[200px] rounded"
                  />
                )}
              </div>
              
              <div>
                <Label>Foto Depois</Label>
                <PhotoUpload
                  clienteId={form.watch("cliente_id")}
                  onUpload={(localUrl, file) => handlePhotoUpload(localUrl, file, 'depois')}
                />
                {form.watch("foto_depois") && (
                  <img 
                    src={form.watch("foto_depois")} 
                    alt="Depois" 
                    className="mt-2 w-full max-w-[200px] rounded"
                  />
                )}
              </div>
            </div>

            <ColorReferenceSystem
              corBase={form.watch("cor_base_nivel")}
              corDesejada={form.watch("cor_alvo_nivel")}
              onColorSelect={handleColorSelection}
              onCalculate={handleColorCalculation}
              fotoAntesUrl={localFotoAntes || form.watch("foto_antes")}
            />

            {/* Mostrar erros de validação */}
            {form.formState.errors.cor_base_nivel && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.cor_base_nivel.message}
              </p>
            )}
            {form.formState.errors.cor_alvo_nivel && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.cor_alvo_nivel.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onVoltar}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button 
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {historicoParaEditar ? 'Atualizando...' : 'Registrando...'}
                </>
              ) : (
                <>
                  <SaveIcon className="w-4 h-4 mr-2" />
                  {historicoParaEditar ? 'Atualizar Histórico' : 'Registrar Histórico'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
