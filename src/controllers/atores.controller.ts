import { Request, Response } from "express";
import { listarAtoresService, buscarAtoresPorIdService } from "../service/atores.service.js";

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
  res.json(resultado)
} catch(erro){
  console.error('Erro ao consultar o banco de dados', erro)
  res.status(500).json({erro: 'Erro interno do servidor'})
}}