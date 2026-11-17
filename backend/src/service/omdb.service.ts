import axios from "axios";

export interface OmdbRating{
  Source: string
  Value: string
}

export interface OmdbResponse {
  Title?: string;
  Year?: string;
  Genre?: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  Awards?: string;
  Ratings?: OmdbRating[];
  Response: 'True' | 'False';
  Error?: string;
}

export async function buscarFilmeNaOmdb(titulo:string): Promise<OmdbResponse | null> {
  const response = await axios.get<OmdbResponse>('https://www.omdbapi.com/', {
    params: {
      apikey: process.env.OMDB_API_KEY,
      t: titulo,
    },
    timeout: 5000,
  });

  if (response.data.Response === 'False') {
    return null
  }

  return response.data  
}

export function extrairNotaRotten(ratings?: OmdbRating[]): string {
  const rotten = ratings?.find((item) => item.Source === 'Rotten Tomatoes');
  return rotten ? rotten.Value : 'N/A'
}