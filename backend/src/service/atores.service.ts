import pool from "../config/database.js";

export async function listarAtoresService(){
  const resultado = await pool.query('SELECT * FROM ATORES')
  return resultado.rows

}

export async function buscarAtoresPorIdService(id: string){
  const resultado = await pool.query ('SELECT * FROM ATORES WHERE id = $1', [id])
  return resultado.rows[0] || null

}

export async function inserirNovoAtorService(nome: string, data_nascimento: string, genero_atuacao?: string, premio?: string){

  const queryText = `INSERT INTO atores (nome, data_nascimento, genero_atuacao, premio) VALUES ($1, $2, $3, $4) RETURNING *`

  const valores = [nome, data_nascimento, genero_atuacao, premio]
  const resultado = await pool.query(queryText, valores);

  return resultado.rows[0]
}

export async function atualizarAtorService(nome: string, data_nascimento: string, id: string, genero_atuacao?: string, premio?: string, ) {

  const queryText = `UPDATE atores SET nome = $1, data_nascimento = $2, genero_atuacao = $3, premio = $4 WHERE id = $5 RETURNING *`
  const valores = [nome, data_nascimento, genero_atuacao || null, premio || null, id]

  const resultado = await pool.query(queryText,valores)
  return resultado.rows[0] || null
  
}

export async function atualizarColunaAtoresService(campos: string[], valores: any[], id: string){
  const setClause = campos.map((campo, index) => `${campo} = $${index + 1}`)
  const parametros = [...valores, id]
  const posicaoId = parametros.length

  const queryText = `UPDATE atores SET ${setClause.join(', ')} WHERE id = $${posicaoId} RETURNING *`;

  const resultado = await pool.query(queryText,parametros)

  return resultado.rows[0] || null

}

export async function deletarAtorService(id: string) {
  const queryText = `DELETE FROM atores WHERE id = $1 RETURNING *`

  const resultado = await pool.query(queryText, [id])
  
  return resultado.rows[0] || null

}