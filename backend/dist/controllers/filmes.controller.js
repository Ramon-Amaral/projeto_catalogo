import { atualizarFilmeService, deletarFilmesService, listarFilmesService, listarFilmePorIdService, inserirFilmeNovoService, atualizarColunasService, } from "../service/filmes.service.js";
export async function buscarFilmes(req, res) {
    try {
        const filmes = await listarFilmesService();
        res.json(filmes);
    }
    catch (erro) {
        console.error("Erro ao consultar o banco de dados:", erro);
        res.status(500).json({ erro: "Erro interno no servidor" });
    }
}
export async function buscarFilmesporID(req, res) {
    try {
        const { id } = req.params;
        const filme = await listarFilmePorIdService(id);
        if (!filme) {
            res.status(404).json({ erro: "Filme não encontrado" });
            return;
        }
        res.json(filme);
    }
    catch (erro) {
        console.error("Erro ao consultar o banco de dados:", erro);
        res.status(500).json({ erro: "Erro interno no servidor" });
    }
}
export async function inserirNovoFilme(req, res) {
    try {
        const { titulo, sinopse, nota_pessoal } = req.body;
        if (!titulo || !sinopse || nota_pessoal === undefined) {
            res.status(400).json({ erro: "Preencha os campos obrigatórios" });
            return;
        }
        const resultado = await inserirFilmeNovoService(titulo, sinopse, nota_pessoal);
        res.status(201).json(resultado);
    }
    catch (erro) {
        if (erro.message === "Filme não encontrado no OMDb") {
            res.status(404).json({ erro: erro.message });
            return;
        }
        console.log("Erro ao tentar inserir informações ao banco error:", erro);
        res.status(500).json({ erro: "Erro interno no servidor" });
    }
}
export async function atualizarFilme(req, res) {
    try {
        const { id } = req.params;
        const { titulo, sinopse, nota_pessoal } = req.body;
        if (!titulo || !sinopse || nota_pessoal === undefined || !id) {
            res.status(400).json({ erro: "Preencha todos os campos obrigatórios" });
            return;
        }
        const resultado = await atualizarFilmeService(titulo, sinopse, nota_pessoal, id);
        if (!resultado) {
            res.status(404).json({ erro: "Filme não encontrado" });
            return;
        }
        res.json(resultado);
    }
    catch (erro) {
        if (erro.message === "Filme não encontrado no OMDb") {
            res.status(404).json({ erro: erro.message });
        }
        console.error("Erro ao atualizar o filme:", erro);
        res.status(500).json({ erro: "Erro interno no servidor" });
    }
}
export async function atualizarColunas(req, res) {
    try {
        const { id } = req.params;
        const campos = Object.keys(req.body);
        const valores = Object.values(req.body);
        if (campos.length === 0) {
            res.status(400).json({ erro: "Nenhum campo fornecido para atualização" });
            return;
        }
        const resultado = await atualizarColunasService(campos, valores, id);
        if (!resultado) {
            res.status(404).json({ erro: "Filme não encontrado" });
            return;
        }
        res.json(resultado);
    }
    catch (erro) {
        console.error("Erro ao atualizar o filme:", erro);
        res.status(500).json({ erro: "Erro interno no servidor" });
    }
}
export async function deletarFilme(req, res) {
    try {
        const { id } = req.params;
        const resultado = await deletarFilmesService(id);
        if (!resultado) {
            res.status(404).json({ erro: "Filme não encontrado" });
            return;
        }
        res.json({ mensagem: "Filme deletado!" });
    }
    catch (erro) {
        console.error("Erro ao deletar o filme", erro);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
}
