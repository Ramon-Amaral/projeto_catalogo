import axios from "axios";

export interface OmdbRating {
  Source: string;
  Value: string;
}

export interface OmdbResponse {
  Title?: string;
  Year?: string;
  Genre?: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  Awards?: string;
  Poster?: string;
  Ratings?: OmdbRating[];
  tomatoMeter?: string;
  tomatoURL?: string;
  Response: "True" | "False";
  Error?: string;
}

function formatarPercentual(valor?: string | null): string | null {
  if (!valor) return null;

  const limpo = String(valor).replace("%", "").trim();
  if (!/^\d{1,3}$/.test(limpo)) return null;

  const numero = Number(limpo);
  if (numero < 0 || numero > 100) return null;

  return `${numero}%`;
}

export async function buscarFilmeNaOmdb(
  titulo: string,
): Promise<OmdbResponse | null> {
  const response = await axios.get<OmdbResponse>("https://www.omdbapi.com/", {
    params: {
      apikey: process.env.OMDB_API_KEY,
      t: titulo,
      tomatoes: true,
    },
    timeout: 5000,
  });

  if (response.data.Response === "False") {
    return null;
  }

  return response.data;
}

export async function obterNotaRotten(
  dadosOmdb: OmdbResponse,
): Promise<string | null> {
  const ratingRotten = dadosOmdb.Ratings?.find((item) =>
    item.Source.toLowerCase().includes("rotten"),
  );

  const notaApi =
    formatarPercentual(ratingRotten?.Value) ||
    formatarPercentual(dadosOmdb.tomatoMeter);

  if (notaApi) return notaApi;
  if (!dadosOmdb.tomatoURL) return null;

  try {
    const response = await axios.get<string>(dadosOmdb.tomatoURL, {
      timeout: 7000,
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const match = String(response.data).match(
      /<script\s+id="media-scorecard-json"[^>]*>([\s\S]*?)<\/script>/i,
    );

    if (!match) return null;

    const scorecard = JSON.parse(match[1].trim()) as {
      criticsScore?: { scorePercent?: string };
    };

    return formatarPercentual(scorecard.criticsScore?.scorePercent);
  } catch {
    return null;
  }
}