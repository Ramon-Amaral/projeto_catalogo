export interface Filme {
  id: number;
  titulo: string;
  genero: string;
  diretor: string;
  ano_lancamento: number;
  roteirista: string;
  sinopse: string;
  nota_pessoal: number;
  premios: string;
  nota_rotten: number | null;
  poster_url?: string | null;
}