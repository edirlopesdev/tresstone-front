import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useToast } from './ui/use-toast';
import { Loader2 } from "lucide-react";

interface PhotoUploadProps {
  clienteId?: string;
  onUpload: (localUrl: string, file: File) => void;
}

export function PhotoUpload({ onUpload, clienteId }: PhotoUploadProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file: File) => {
    if (!clienteId) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um cliente antes de fazer upload de fotos.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Criar URL local para análise
      const localUrl = URL.createObjectURL(file);
      // Passar a URL local junto com a função de upload
      onUpload(localUrl, file);
      
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : 'Erro ao fazer upload da foto',
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="sr-only">Escolher foto</span>
        <div className="relative">
          <input
            type="file"
            className={`block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100
              disabled:opacity-50 disabled:cursor-not-allowed`}
            accept="image/*"
            disabled={isUploading || !clienteId}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
        </div>
      </label>
      {!clienteId && (
        <p className="text-sm text-red-500">
          Selecione um cliente antes de fazer upload de fotos
        </p>
      )}
    </div>
  );
} 