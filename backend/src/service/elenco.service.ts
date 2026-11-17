import { Result } from "pg";
import pool from "../config/database.js";

export async function listarElencoService() {
  const queryText = `
    SELECT 
      e.id,
      f.titulo AS filme,
      a.nome AS ator,
      e.nome_personagem,
      e.e_protagonista
    FROM elenco e
    JOIN filmes f ON e.filme_id = f.id
    JOIN atores a ON e.ator_id = a.id
    ORDER BY e.id ASC
  `;

  const resultado = await pool.query(queryText);
  return resultado.rows;
}

export async function listarElencoporIdService(id: string){

  const queryText = `SELECT
  e.id,
  f.titulo AS filme,
  a.nome AS ator,
  e.nome_personagem,
  e.e_protagonista
  FROM elenco e
  JOIN filmes f ON e.filme_id = f.id 
  JOIN atores a ON e.ator_id = a.id WHERE e.id = $1
  ORDER BY e.id ASC`

  const resultado = await pool.query(queryText, [id])

  return resultado.rows[0] || null
}

export async function inserirNovoElencoService(filme_id: number | string, ator_id: number |string, nome_personagem: string, e_protagonista: boolean) {
  const queryText = `INSERT INTO elenco (filme_id, ator_id, nome_personagem, e_protagonista) VALUES ($1, $2, $3, $4) RETURNING *`

  const valores = [filme_id, ator_id, nome_personagem, e_protagonista]
  const resultado = await pool.query(queryText,valores)

  return resultado.rows[0]
}

export async function atualizarElencoService(filme_id: number| string, ator_id: number | string, nome_personagem: string, e_protagonista: boolean, id: string){
  const queryText = `UPDATE elenco SET filme_id = $1, ator_id = $2, nome_personagem = $3, e_protagonista = $4 WHERE id = $5 RETURNING *`

  const valores = [filme_id, ator_id, nome_personagem, e_protagonista, id]

  const resultado = await pool.query(queryText, valores)

  return resultado.rows[0] || null
}

export async function atualizarColunasElencoService (campos: string[], valores: any[], id: string){
  const setClause = campos.map((campo,index) => `${campo} = $${index + 1}`)
  const parametros = [...valores, id]
  const posicaoId = parametros.length

  const queryText = `UPDATE elenco SET ${setClause.join(', ')} WHERE id=$${posicaoId} RETURNING *`
  const resultado = await pool.query(queryText,parametros)

  return resultado.rows[0] || null
}

export async function deletarElencoService(id: string){
  const queryText = `DELETE FROM elenco WHERE id = $1 RETURNING *`
  const resultado = await pool.query(queryText,[id])

  return resultado.rows[0] || null
}