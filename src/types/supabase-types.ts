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
  cor_base: string;
  cor_alvo: string;
  produtos_usados: Record<string, any> | null; // jsonb
  tecnicas_usadas: string[] | null;
  observacoes: string | null;
  data: string; // timestamp with time zone
}

// Adicione outras interfaces para as demais tabelas do seu banco de dados