import { listarAtoresService, buscarAtoresPorIdService, inserirNovoAtorService, atualizarAtorService, atualizarColunaAtoresService, deletarAtorService, } from "../service/atores.service.js";
export async function listarAtores(req, res) {
    try {
        const resultado = await listarAtoresService();
        res.json(resultado);
    }
    catch (erro) {
        console.error("Erro ao consultar o banco de dados", erro);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
}
export async function buscarAtoresPorId(req, res) {
    try {
        const { id } = req.params;
        const resultado = await buscarAtoresPorIdService(id);
        if (!resultado) {
            res.status(404).json({ erro: "Ator não encontrado!" });
            return;
        }
        res.json(resultado);
    }
    catch (erro) {
        console.error("Erro ao consultar o banco de dados", erro);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
}
export async function inserirNovoAtor(req, res) {
    try {
        const { nome, data_nascimento, genero_atuacao, premio } = req.body;
        if (!nome) {
            res.status(400).json({ erro: "O nome do ator é obrigatório" });
            return;
        }
        const resultado = await inserirNovoAtorService(nome, data_nascimento, genero_atuacao, premio);
        res.status(201).json(resultado);
    }
    catch (erro) {
        console.error("Erro ao consultar o banco de dados", erro);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
}
export async function atualizarAtor(req, res) {
    try {
        const { id } = req.params;
        const { nome, data_nascimento, genero_atuacao, premio } = req.body;
        if (!nome) {
            res.status(400).json({ erro: "O nome do ator é obrigatório" });
            return;
        }
        const resultado = await atualizarAtorService(nome, data_nascimento || "", id, genero_atuacao, premio);
        if (!resultado) {
            res.status(404).json({ erro: "Ator não encontrado" });
            return;
        }
        res.status(200).json(resultado);
    }
    catch (erro) {
        console.error("Erro ao consultar o banco de dados:", erro);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
}
export async function atualizarColunaAtores(req, res) {
    try {
        const { id } = req.params;
        const campos = Object.keys(req.body);
        const valores = Object.values(req.body);
        if (campos.length === 0) {
            res.status(400).json({ erro: "Nenhum campo fornecido para atualização" });
            return;
        }
        const resultado = await atualizarColunaAtoresService(campos, valores, id);
        if (!resultado) {
            res.status(404).json({ erro: "Ator não encontrado" });
            return;
        }
        res.status(200).json(resultado);
    }
    catch (erro) {
        console.error("Erro ao consultar o banco de dados", erro);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
}
export async function deletarAtor(req, res) {
    try {
        const { id } = req.params;
        const resultado = await deletarAtorService(id);
        if (!resultado) {
            res.status(404).json({ erro: "Ator não encontrado" });
            return;
        }
        res.status(200).json(resultado);
    }
    catch (erro) {
        console.error("Erro ao consultar o banco de dados", erro);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
}
