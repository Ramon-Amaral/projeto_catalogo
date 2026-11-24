import pool from "../config/database.js";
import { buscarDadosAtorNaTmdb, type TmdbCastCredit } from "./tmdb.service.js";

function normalizarTitulo(texto?: string): string {
  return (texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function tituloCorresponde(tituloBanco: string, credito: TmdbCastCredit): boolean {
  const banco = normalizarTitulo(tituloBanco);
  const pt = normalizarTitulo(credito.title);
  const original = normalizarTitulo(credito.original_title);

  if (!banco) return false;
  if (banco === pt || banco === original) return true;
  if (original.startsWith("the ") && original.slice(4) === banco) return true;

  return false;
}

async function vincularAtorAosFilmesExistentes(atorId: number, creditos: TmdbCastCredit[]) {
  if (creditos.length === 0) return;

  const filmesResult = await pool.query<{ id: number; titulo: string }>(
    "SELECT id, titulo FROM filmes"
  );

  for (const filme of filmesResult.rows) {
    const participacao = creditos.find((credito) =>
      tituloCorresponde(filme.titulo, credito)
    );

    if (!participacao) continue;

    const jaVinculado = await pool.query(
      "SELECT id FROM elenco WHERE filme_id = $1 AND ator_id = $2",
      [filme.id, atorId]
    );

    if (jaVinculado.rows.length > 0) continue;

    const personagem = participacao.character?.trim() || "Não informado";
    const eProtagonista = (participacao.order ?? 99) <= 2;

    await pool.query(
      `INSERT INTO elenco (filme_id, ator_id, nome_personagem, e_protagonista)
       VALUES ($1, $2, $3, $4)`,
      [filme.id, atorId, personagem, eProtagonista]
    );
  }
}

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
  const novoAtor = resultado.rows[0];

  if (novoAtor && dadosTmdb?.creditos) {
    await vincularAtorAosFilmesExistentes(novoAtor.id, dadosTmdb.creditos);
  }

  return novoAtor;
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
  const atorAtualizado = resultado.rows[0] || null;

  if (atorAtualizado && dadosTmdb?.creditos) {
    await vincularAtorAosFilmesExistentes(atorAtualizado.id, dadosTmdb.creditos);
  }

  return atorAtualizado;
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