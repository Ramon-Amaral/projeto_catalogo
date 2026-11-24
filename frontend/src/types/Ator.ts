export interface Ator {
  id: number;
  nome: string;
  data_nascimento: string | null;
  genero_atuacao?: string | null;
  premio?: string | null;
  foto_url?: string | null;
}