import pool from '../config/database.js';

export async function listarFilmesService() {
  const resultado = await pool.query('SELECT * FROM filmes');
  return resultado.rows;
}

export async function listarFilmePorIdService(id: string){
  const resultado = await pool.query('SELECT * FROM filmes WHERE id = $1', [id]);
  return resultado.rows[0] || null
}

export async function inserirFilmeNovoService(titulo: string, genero: string, diretor: string, ano_lancamento: number, roteirista: string, sinopse: string, nota: number){

  const filmeInserido =`
      INSERT INTO filmes (titulo, genero, diretor, ano_lancamento, roteirista, sinopse, nota)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`

    const valores = [titulo, genero, diretor, ano_lancamento, roteirista, sinopse, nota];
    const resultado = await pool.query(filmeInserido, valores);

    return resultado.rows[0]

}