export interface Cliente {
  id: string; // UUID
  empresa_id: string; // UUID
  nome: string;
  tipo_cabelo: string | null;
  condicao_cabelo: string | null;
  criado_em: string; // timestamp with time zone
}

export interface Agendamento {
  id: string; // UUID
  empresa_id: string; // UUID
  usuario_id: string; // UUID
  cliente_id: string; // UUID
  data_agendamento: string; // timestamp with time zone
  tipo_servico: string | null;
  status: 'pendente' | 'confirmado' | 'cancelado' | string | null; // Assumindo que 'pendente' é o valor padrão
  observacoes: string | null;
  criado_em: string; // timestamp with time zone
}

export interface Perfil {
  id: string; // UUID
  empresa_id: string; // UUID
  nome: string;
  cargo: string;
  criado_em: string | null; // timestamp with time zone
}

export interface HistoricoColoracao {
  id: string; // UUID
  cliente_id: string; // UUID
  usuario_id: string; // UUID
  cor_base_nivel: string;
  cor_alvo_nivel: string;
  produtos_usados: string | null;
  tecnicas_usadas: string | null;
  observacoes: string | null;
  data: string;
  foto_antes: string | null;
  foto_depois: string | null;
}

export interface ResultadoClareamento {
  niveis_necessarios: number;
  volume_oxidante: number;
  tempo_estimado: number;
  fundo_revelacao: string;
  produtos_recomendados: string[];
}

export interface Plano {
  id: string; // UUID
  nome: string;
  max_usuarios: number;
  recursos: Record<string, any>; // jsonb
  preco: number;
  criado_em: string | null; // timestamp with time zone
}

export interface Produto {
  id: string; // UUID
  empresa_id: string; // UUID
  nome: string;
  marca: string;
  tipo: string;
  codigo_cor: string | null;
  criado_em: string | null; // timestamp with time zone
}

// Adicionar novas interfaces
export interface NivelBase {
  id: string;
  nivel: number;
  descricao: string;
  cor_hex: string;
}

// Adicione outras interfaces para as demais tabelas do seu banco de dados
