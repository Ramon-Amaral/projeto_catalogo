import pool from "../config/database.js";

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
  genero: string,
  diretor: string,
  ano_lancamento: number,
  roteirista: string,
  sinopse: string,
  nota_pessoal: number,
) {
  const filmeInserido = `
      INSERT INTO filmes (titulo, genero, diretor, ano_lancamento, roteirista, sinopse, nota_pessoal)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`;

  const valores = [
    titulo,
    genero,
    diretor,
    ano_lancamento,
    roteirista,
    sinopse,
    nota_pessoal,
  ];
  const resultado = await pool.query(filmeInserido, valores);

  return resultado.rows[0];
}

export async function atualizarFilmeService(
  titulo: string,
  genero: string,
  diretor: string,
  ano_lancamento: number,
  roteirista: string,
  sinopse: string,
  nota_pessoal: number,
  id: string,
) {
  const filmeAtualizado = await pool.query(
    "UPDATE filmes  SET titulo = $1, genero = $2, diretor = $3, ano_lancamento = $4, roteirista = $5, sinopse = $6, nota_pessoal=$7 WHERE id = $8 RETURNING *",
    [
      titulo,
      genero,
      diretor,
      ano_lancamento,
      roteirista,
      sinopse,
      nota_pessoal,
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
