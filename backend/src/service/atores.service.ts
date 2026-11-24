import pool from "../config/database.js";
import { buscarDadosAtorNaTmdb } from "./tmdb.service.js";

export async function listarAtoresService() {
  const resultado = await pool.query("SELECT * FROM atores ORDER BY nome ASC");
  return resultado.rows;
}

export async function buscarAtoresPorIdService(id: string) {
  const resultado = await pool.query("SELECT * FROM atores WHERE id = $1", [id]);
  return resultado.rows[0] || null;
}

export async function inserirNovoAtorService(
  nome: string,
  data_nascimento?: string,
  genero_atuacao?: string,
  premio?: string
) {
  const dadosTmdb = await buscarDadosAtorNaTmdb(nome);

  const dataFinal = data_nascimento || dadosTmdb?.data_nascimento || null;
  const generoFinal = genero_atuacao || dadosTmdb?.genero_atuacao || null;
  const fotoFinal = dadosTmdb?.foto_url || null;

  const queryText = `
    INSERT INTO atores (nome, data_nascimento, genero_atuacao, premio, foto_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const valores = [nome, dataFinal, generoFinal, premio || null, fotoFinal];
  const resultado = await pool.query(queryText, valores);

  return resultado.rows[0];
}

export async function atualizarAtorService(
  nome: string,
  data_nascimento: string,
  id: string,
  genero_atuacao?: string,
  premio?: string
) {
  const dadosTmdb = await buscarDadosAtorNaTmdb(nome);

  const dataFinal = data_nascimento || dadosTmdb?.data_nascimento || null;
  const generoFinal = genero_atuacao || dadosTmdb?.genero_atuacao || null;
  const fotoFinal = dadosTmdb?.foto_url || null;

  const queryText = `
    UPDATE atores
    SET nome = $1,
        data_nascimento = $2,
        genero_atuacao = $3,
        premio = $4,
        foto_url = COALESCE($5, foto_url)
    WHERE id = $6
    RETURNING *
  `;

  const valores = [nome, dataFinal, generoFinal, premio || null, fotoFinal, id];
  const resultado = await pool.query(queryText, valores);

  return resultado.rows[0] || null;
}

export async function atualizarColunaAtoresService(campos: string[], valores: any[], id: string) {
  const setClause = campos.map((campo, index) => `${campo} = $${index + 1}`);
  const parametros = [...valores, id];
  const posicaoId = parametros.length;

  const queryText = `UPDATE atores SET ${setClause.join(", ")} WHERE id = $${posicaoId} RETURNING *`;

  const resultado = await pool.query(queryText, parametros);

  return resultado.rows[0] || null;
}

export async function deletarAtorService(id: string) {
  const queryText = `DELETE FROM atores WHERE id = $1 RETURNING *`;

  const resultado = await pool.query(queryText, [id]);

  return resultado.rows[0] || null;
}