import axios from "axios";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
export async function buscarDadosAtorNaTmdb(nome) {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey)
        return null;
    try {
        const searchResponse = await axios.get(`${TMDB_BASE_URL}/search/person`, {
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
        const detailsResponse = await axios.get(`${TMDB_BASE_URL}/person/${primeiroResultado.id}`, {
            params: {
                api_key: apiKey,
                language: "pt-BR",
            },
            timeout: 5000,
        });
        const detalhes = detailsResponse.data;
        const caminhoFoto = detalhes.profile_path || primeiroResultado.profile_path;
        const departamento = detalhes.known_for_department || primeiroResultado.known_for_department;
        return {
            foto_url: caminhoFoto ? `${TMDB_IMAGE_BASE_URL}${caminhoFoto}` : null,
            data_nascimento: detalhes.birthday || null,
            genero_atuacao: departamento === "Acting" ? "Atuação" : departamento || null,
        };
    }
    catch (error) {
        console.error("Erro ao consultar TMDB API:", error);
        return null;
    }
}
