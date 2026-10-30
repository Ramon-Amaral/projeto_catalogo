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

app.listen(PORT, () => {
  console.log(`Servidor TS rodando com sucesso na porta ${PORT}`);
});