import { Request, Response } from "express";
import { listarAtoresService, buscarAtoresPorIdService, inserirNovoAtorService, atualizarAtorService, atualizarColunaAtoresService, deletarAtorService} from "../service/atores.service.js";

export async function listarAtores(req: Request, res: Response) {
  try {
    const resultado = await listarAtoresService()
    res.json(resultado)
  } catch(erro){
    console.error('Erro ao consultar o banco de dados', erro)
    res.status(500).json({erro: 'Erro interno do servidor'})
  }
}

export async function buscarAtoresPorId (req: Request, res: Response){
  try {
  const {id} = req.params;
  const resultado = await buscarAtoresPorIdService(id as string)

  if(!resultado){
    res.status(404).json({erro:'Ator não encontrado!'})
    return;
  }

  res.json(resultado)
} catch(erro){
  console.error('Erro ao consultar o banco de dados', erro)
  res.status(500).json({erro: 'Erro interno do servidor'})
}}

export async function inserirNovoAtor(req: Request, res: Response) {
  try {
  const {nome, data_nascimento, genero_atuacao, premio} = req.body;

  if (!nome || !data_nascimento){
    res.status(400).json({erro: 'Nome e data são obrigatórios'})
    return
  }
  const resultado = await inserirNovoAtorService(nome as string, data_nascimento as string, genero_atuacao as string, premio as string)

  res.status(201).json(resultado)
  
} catch (erro){
  console.error('Erro ao consultar o banco de dados', erro)
  res.status(500).json({erro: 'Erro interno do servidor'})

 }
}


export async function atualizarAtor(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { nome, data_nascimento, genero_atuacao, premio } = req.body as {
      nome: string;
      data_nascimento: string;
      genero_atuacao?: string;
      premio?: string;
    };

    if (!nome || !data_nascimento) {
      res.status(400).json({ erro: 'Nome e data de nascimento são obrigatórios' });
      return;
    }

    const resultado = await atualizarAtorService(
      nome,
      data_nascimento,
      id as string,
      genero_atuacao,
      premio
    );

    if (!resultado) {
      res.status(404).json({ erro: 'Ator não encontrado' });
      return;
    }

    res.status(200).json(resultado);
  } catch (erro) {
    console.error('Erro ao consultar o banco de dados:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

export async function atualizarColunaAtores(req: Request, res: Response){
  try {
    const {id} = req.params
    const campos = Object.keys(req.body);
    const valores = Object.values(req.body)

    if (campos.length === 0){
      res.status(400).json({erro: 'Nenhum campo fornecido para atualização'})
      return
    }

    const resultado = await atualizarColunaAtoresService(campos, valores, id as string)
    if (!resultado){
      res.status(404).json({erro: 'Ator não encontrado'})
      return
    }

    res.status(200).json(resultado)
  } catch(erro){
    console.error('Erro ao consultar o banco de dados', erro)
    res.status(500).json({erro: 'Erro interno do servidor'})
  }
}

export async function deletarAtor(req: Request, res: Response) {
  try {
    const {id} = req.params;
    const resultado = await deletarAtorService(id as string);
    
    if (!resultado){
      res.status(404).json({erro: 'Ator não encontrado'})
      return
    }

    res.status(200).json(resultado)
  } catch (erro){
    console.error('Erro ao consultar o banco de dados', erro)
    res.status(500).json({erro: 'Erro interno do servidor'})
  }
}