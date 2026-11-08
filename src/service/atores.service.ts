import pool from "../config/database.js";

export async function listarAtoresService(){
  const resultado = await pool.query('SELECT * FROM ATORES')
  return resultado.rows

}

export async function buscarAtoresPorIdService(id: string){
  const resultado = await pool.query ('SELECT * FROM ATORES WHERE id = $1', [id])
  return resultado.rows[0] || null

}