import pool from "../config/database.js";

export async function listarAtoresService(){
  const resultado = await pool.query('SELECT * FROM ATORES')
  return resultado.rows

}