import axios from "axios";
export async function buscarFilmeNaOmdb(titulo) {
    const response = await axios.get('https://www.omdbapi.com/', {
        params: {
            apikey: process.env.OMDB_API_KEY,
            t: titulo,
        },
        timeout: 5000,
    });
    if (response.data.Response === 'False') {
        return null;
    }
    return response.data;
}
export function extrairNotaRotten(ratings) {
    const rotten = ratings?.find((item) => item.Source === 'Rotten Tomatoes');
    return rotten ? rotten.Value : 'N/A';
}
