import 'dotenv/config';
import express, { Request, Response } from 'express';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/filmes', async (req: Request, res: Response): Promise<void> => {
  try {
    const resultado = await pool.query('SELECT * FROM filmes');
    res.json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao consultar o banco de dados:', erro);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

app.get ('/filmes/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const {id} = req.params
    const resultado = await pool.query('SELECT * FROM filmes WHERE id = $1', [id]);

    if(resultado.rows.length === 0){
      res.status(404).json({erro:'Filme não encontrado'})
      return;
    }

    res.json(resultado.rows[0])

  } catch (erro) {
    console.error('Erro ao consultar o banco de dados:', erro);
    res.status(500).json({erro: 'Erro interno no servidor'});
  }
} );

app.listen(PORT, () => {
  console.log(`Servidor TS rodando com sucesso na porta ${PORT}`);
});

app.post('/filmes', async (req, res) => {
  try {
    const { titulo, genero, diretor, ano_lancamento, roteirista, sinopse, nota } = req.body;

    const textoQuery = `
      INSERT INTO filmes (titulo, genero, diretor, ano_lancamento, roteirista, sinopse, nota)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const valores = [titulo, genero, diretor, ano_lancamento, roteirista, sinopse, nota];
    const resultado = await pool.query(textoQuery, valores);

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    console.log('Erro ao tentar inserir informações ao banco error:', erro);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

  app.put('/filmes/:id', async (req, res) => {
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
  }

  })

  app.patch('/filmes/:id', async (req,res) => {
    try{
      const {id} = req.params;
      const campos = Object.keys(req.body)
      const valores = Object.values(req.body)

      if (campos.length === 0) {
        res.status(400).json({erro: 'Nnehum campo fornecido para atualização'})
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
    }
  })

  app.delete('/filmes/:id', async (req,res) => {
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

  })
