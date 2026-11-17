import { error } from "node:console";
import pool from "../config/database.js";
import { buscarFilmeNaOmdb } from "./omdb.service.js";
import { extrairNotaRotten } from "./omdb.service.js";

export async function listarFilmesService() {
  const resultado = await pool.query("SELECT * FROM filmes");
  return resultado.rows;
}

export async function listarFilmePorIdService(id: string) {
  const resultado = await pool.query("SELECT * FROM filmes WHERE id = $1", [
    id,
  ]);
  return resultado.rows[0] || null;
}

export async function inserirFilmeNovoService(
  titulo: string,
  sinopse: string,
  nota_pessoal: number,
) {
  const dadosOmdb = await buscarFilmeNaOmdb(titulo);
  if (!dadosOmdb) {
    throw new Error("Filme não encontrado no OMDb");
  }

  const genero = dadosOmdb.Genre || "Desconhecido";
  const diretor = dadosOmdb.Director || "Desconhecido";
  const ano_lancamento = parseInt(dadosOmdb.Year || "0", 10);
  const roteirista = dadosOmdb.Writer || "Desconhecido";
  const premios = dadosOmdb.Awards || "N/A";
  const nota_rotten = extrairNotaRotten(dadosOmdb.Ratings);

  const filmeInserido = `
      INSERT INTO filmes (titulo, genero, diretor, ano_lancamento, roteirista, sinopse, nota_pessoal, premios, nota_rotten)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`;

  const valores = [
    titulo,
    genero,
    diretor,
    ano_lancamento,
    roteirista,
    sinopse,
    nota_pessoal,
    premios,
    nota_rotten,
  ];
  const resultado = await pool.query(filmeInserido, valores);

  return resultado.rows[0];
}

export async function atualizarFilmeService(
  titulo: string,
  sinopse: string,
  nota_pessoal: number,
  id: string,
) {
  const dadosOmdb = await buscarFilmeNaOmdb(titulo);

  if (!dadosOmdb) {
    throw new Error("Filme não encontrado no OMDb");
  }

  const genero = dadosOmdb.Genre || "Desconhecido";
  const diretor = dadosOmdb.Director || "Desconhecido";
  const ano_lancamento = parseInt(dadosOmdb.Year || "0", 10);
  const roteirista = dadosOmdb.Writer || "Desconhecido";
  const premios = dadosOmdb.Awards || "N/A";
  const nota_rotten = extrairNotaRotten(dadosOmdb.Ratings);

  const filmeAtualizado = await pool.query(
    "UPDATE filmes  SET titulo = $1, genero = $2, diretor = $3, ano_lancamento = $4, roteirista = $5, sinopse = $6, nota_pessoal=$7, premios = $8, nota_rotten = $9 WHERE id = $10 RETURNING *",
    [
      titulo,
      genero,
      diretor,
      ano_lancamento,
      roteirista,
      sinopse,
      nota_pessoal,
      premios,
      nota_rotten,
      id,
    ],
  );

  return filmeAtualizado.rows[0] || null;
}

export async function atualizarColunasService(
  campos: string[],
  valores: any[],
  id: string,
) {
  const setClauses = campos.map((campo, index) => `${campo} = $${index + 1}`);
  const parametros = [...valores, id];
  const posicaoId = parametros.length;

  const queryText = `UPDATE filmes SET ${setClauses.join(", ")} WHERE id = $${posicaoId} RETURNING *`;
  const resultado = await pool.query(queryText, parametros);

  return resultado.rows[0] || null;
}

export async function deletarFilmesService(id: string) {
  const resultado = await pool.query(
    "DELETE FROM filmes WHERE id = $1 RETURNING *",
    [id],
  );

  return resultado.rows[0] || null;
}
