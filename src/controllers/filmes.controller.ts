import { Request, Response } from 'express';
import { listarFilmesService } from '../service/filmes.service.js';
import { listarFilmePorIdService } from '../service/filmes.service.js';
import { inserirFilmeNovoService } from '../service/filmes.service.js';

export async function buscarFilmes(req: Request, res: Response) {
  try {
    const filmes = await listarFilmesService()
    res.json(filmes);
  } catch (erro) {
    console.error('Erro ao consultar o banco de dados:', erro);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
};

export async function buscarFilmesporID (req: Request, res: Response) {
  try {
    const {id} = req.params
    const filme = await listarFilmePorIdService(id as string);

    if(!filme){
      res.status(404).json({erro:'Filme não encontrado'})
      return;
    }

    res.json(filme)

  } catch (erro) {
    console.error('Erro ao consultar o banco de dados:', erro);
    res.status(500).json({erro: 'Erro interno no servidor'});
  }
}
export async function inserirNovoFilme (req: Request, res: Response) {
 try {
    const { titulo, genero, diretor, ano_lancamento, roteirista, sinopse, nota } = req.body;

    if (!titulo || !genero || !diretor || !ano_lancamento || !roteirista || !sinopse || nota === undefined){
      res.status(400).json({erro:'Preencha os campos obrigatórios'})
      return
    }
    const resultado = await inserirFilmeNovoService(titulo,genero,diretor,ano_lancamento,roteirista, sinopse,nota)

    res.status(201).json(resultado)
  } catch (erro) {
    console.log('Erro ao tentar inserir informações ao banco error:', erro);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  } }

  export async function atualizarFilme(req:Request, res:Response){
  try {
      const {id} = req.params
      const {titulo, genero, diretor, ano_lancamento, roteirista, sinopse, nota} = req.body
      
      const resultado = await pool.query('UPDATE filmes  SET titulo = $1, genero = $2, diretor = $3, ano_lancamento = $4, roteirista = $5, sinopse = $6, nota=$7 WHERE id = $8', [titulo, genero, diretor, ano_lancamento, roteirista, sinopse, nota, id])
    
    if(resultado.rowCount === 0) {
       res.status(404).json({erro: 'Filme não encontrado'})
       return
    }

    res.json({mensagem:'Filme atualizado com sucesso!'})

  } catch(erro){
    console.error('Erro ao atualizar o filme:', erro);
    res.status(500).json({erro:'Erro interno no servidor'})
  }}

  export async function atualizarColunas(req: Request, res: Response) {
  try{
      const {id} = req.params;
      const campos = Object.keys(req.body)
      const valores = Object.values(req.body)

      if (campos.length === 0) {
        res.status(400).json({erro: 'Nenhum campo fornecido para atualização'})
        return
      }

      const setClauses = campos.map((campo, index) => `${campo} = $${index + 1}`)
      valores.push(id)
      const posicaoId = valores.length

      const queryText = `UPDATE filmes SET ${setClauses.join(', ')} WHERE id = $${posicaoId} RETURNING *`;

      const resultado = await pool.query(queryText, valores);

      if (resultado.rowCount === 0) {
        res.status(404).json({erro: 'Filme não encontrado'})
        return
      }

      res.json(resultado.rows[0])

    } catch(erro){
      console.error('Erro ao atualizar o filme:', erro);
      res.status(500).json({erro: 'Erro interno no servidor'})
    }}

  export async function deletarFilme (req: Request, res: Response) {
     try {
      const {id} = req.params
      const resultado = await pool.query('DELETE FROM filmes WHERE id = $1', [id])

      if(resultado.rowCount ===0){
        res.status(404).json({erro:'Filme não encontrado'})
        return
      }

      res.json({mensagem:'Filme deletado!'})
    } catch(erro){
      console.error('Erro ao deletar o filme', erro)
      res.status(500).json({erro:'Erro interno do servidor'})
    }
  }