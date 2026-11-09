import { Request, Response } from "express";
import { listarElencoService, listarElencoporIdService, inserirNovoElencoService,  atualizarElencoService, atualizarColunasElencoService, deletarElencoService } from "../service/elenco.service.js";

export async function listarElenco(req: Request, res: Response) {
  try {
    const resultado = await listarElencoService()
    return res.status(200).json(resultado)
  } catch(erro){
    console.error('Erro ao consultar o banco de dados', erro)
    res.status(500).json({erro: 'Erro interno do Servidor'})
  }
}

export async function listarElencoPorId(req: Request, res: Response){
  try {
 const {id} = req.params
  const resultado = await listarElencoporIdService(id as string)
  
  if(!resultado){
    res.status(404).json({erro: 'Elenco não encontrado'})
    return
  }

  res.status(200).json(resultado)
  } catch(erro){
    console.error('Erro ao consultar o banco de dados', erro)
    res.status(500).json({erro: 'Erro interno do servidor'})
  }
}

export async function atualizarColunaElenco(req: Request, res: Response) {
  try {
  const {id} = req.params
  const valores = Object.values(req.body)
  const campos = Object.keys(req.body)

  if(campos.length === 0){
    res.status(400).json({erro: 'Nenhum campo fornecido para atualização'})
    return
  }

  const resultado = await atualizarColunasElencoService(campos, valores, id as string)

  if(!resultado){
    res.status(404).json({erro: 'Elenco não encontrado'})
    return
  }

  res.status(200).json(resultado)
  } catch(erro){
    console.error('Erro ao consultar o banco de dados', erro)
    res.status(500).json({erro: 'Erro interno do servidor'})
  }
}

export async function atualizarElenco(req: Request, res: Response){
  try{
  const {filme_id, ator_id, nome_personagem, e_protagonista} = req.body
  const {id} = req.params

  if(!filme_id || !ator_id || !nome_personagem || e_protagonista === undefined){
    res.status(400).json({erro:'Todos os campos devem ser preenchidos'})
    return
  }

  const resultado = await atualizarElencoService(filme_id, ator_id, nome_personagem, e_protagonista, id as string);

  if (!resultado){
    res.status(404).json({erro: 'Não foi possível encontrar o elenco'})
    return
  }

  res.status(200).json(resultado)
  } catch(erro: any){
    if(erro.code === '23503'){
      res.status(400).json({erro: 'O filme_id ou ator_id informado não existe no banco de dados'})
      return
    }

    console.error('Erro ao consultar o banco de dados', erro)
    res.status(500).json({erro: 'Erro interno do servidor'})

}}

export async function  inserirNovoElenco (req: Request, res: Response) {
  try {
    const {filme_id, ator_id, nome_personagem, e_protagonista} = req.body

    if (!filme_id || !ator_id || !nome_personagem || e_protagonista === undefined){
      res.status(400).json({erro: 'Todos os campos devem ser inseridos'})
      return
    }

    const resultado = await inserirNovoElencoService(filme_id, ator_id, nome_personagem, e_protagonista)

    res.status(201).json(resultado)
  } catch(erro:any){

    if(erro.code === '23503'){
      res.status(400).json({erro: 'O filme_id ou ator_id informado não existe'})
      return
    }
    console.error('Erro ao acessar o banco de dados', erro)
    res.status(500).json({erro: 'Erro interno do servidor'})
  }
  
}

export async function deletarElenco(req: Request, res: Response) {
  try {
    const {id} = req.params
    const resultado = await deletarElencoService(id as string);

    if(!resultado){
      res.status(404).json({erro: 'Elenco não encontrado'})
      return
    }

    res.status(200).json(resultado)
  } catch (erro){
    console.error('Erro ao se comunicar com o banco de dados', erro)
    res.status(500).json({erro: 'Erro interno do servidor'})
  }

}