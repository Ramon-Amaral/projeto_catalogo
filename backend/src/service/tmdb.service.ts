import axios from "axios";

interface TmdbSearchPersonResult {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department?: string;
}

interface TmdbSearchResponse {
  results: TmdbSearchPersonResult[];
}

export interface TmdbCastCredit {
  id: number;
  title?: string;
  original_title?: string;
  character?: string;
  order?: number;
  genre_ids?: number[];
}

interface TmdbPersonDetails {
  birthday: string | null;
  known_for_department?: string;
  profile_path: string | null;
  movie_credits?: {
    cast: TmdbCastCredit[];
  };
}

export interface DadosAtorTmdb {
  foto_url: string | null;
  data_nascimento: string | null;
  genero_atuacao: string | null;
  creditos: TmdbCastCredit[];
}

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const GENEROS_TMDB: Record<number, string> = {
  28: "Ação",
  12: "Aventura",
  16: "Animação",
  35: "Comédia",
  80: "Crime",
  18: "Drama",
  10751: "Família",
  14: "Fantasia",
  36: "História",
  27: "Terror",
  10402: "Música",
  9648: "Mistério",
  10749: "Romance",
  878: "Ficção Científica",
  53: "Suspense",
  10752: "Guerra",
  37: "Faroeste",
};

function calcularGenerosPrincipais(creditos: TmdbCastCredit[]): string | null {
  const contagem: Record<number, number> = {};

  for (const filme of creditos) {
    if (!filme.genre_ids) continue;
    for (const id of filme.genre_ids) {
      if (GENEROS_TMDB[id]) {
        contagem[id] = (contagem[id] || 0) + 1;
      }
    }
  }

  const principais = Object.entries(contagem)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([id]) => GENEROS_TMDB[Number(id)]);

  return principais.length > 0 ? principais.join(", ") : null;
}

export async function buscarDadosAtorNaTmdb(nome: string): Promise<DadosAtorTmdb | null> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return null;

  try {
    const searchResponse = await axios.get<TmdbSearchResponse>(`${TMDB_BASE_URL}/search/person`, {
      params: {
        api_key: apiKey,
        query: nome,
        language: "pt-BR",
      },
      timeout: 5000,
    });

    const primeiroResultado = searchResponse.data.results?.[0];
    if (!primeiroResultado) {
      return null;
    }

    const detailsResponse = await axios.get<TmdbPersonDetails>(
      `${TMDB_BASE_URL}/person/${primeiroResultado.id}`,
      {
        params: {
          api_key: apiKey,
          language: "pt-BR",
          append_to_response: "movie_credits",
        },
        timeout: 5000,
      }
    );

    const detalhes = detailsResponse.data;
    const caminhoFoto = detalhes.profile_path || primeiroResultado.profile_path;
    const creditos = detalhes.movie_credits?.cast || [];

    return {
      foto_url: caminhoFoto ? `${TMDB_IMAGE_BASE_URL}${caminhoFoto}` : null,
      data_nascimento: detalhes.birthday || null,
      genero_atuacao: calcularGenerosPrincipais(creditos),
      creditos,
    };
  } catch (error) {
    console.error("Erro ao consultar TMDB API:", error);
    return null;
  }
}