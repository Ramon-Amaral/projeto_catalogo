export interface ElencoItem {
  id: number;
  filme_id: number;
  ator_id: number;
  filme: string;
  ator: string;
  ator_foto?: string | null;
  nome_personagem: string;
  e_protagonista: boolean;
}