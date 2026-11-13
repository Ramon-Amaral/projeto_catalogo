import cron from 'node-cron';
import pool from '../config/database.js';
import { buscarFilmeNaOmdb, extrairNotaRotten } from '../service/omdb.service.js';

export async function sincronizarNotasRotten(): Promise<void> {
  console.log('[CRON] Iniciando sincronização de notas do Rotten Tomatoes...');

  try {
    const resultado = await pool.query('SELECT id, titulo FROM filmes');

    for (const filme of resultado.rows) {
      try {
        const dadosOmdb = await buscarFilmeNaOmdb(filme.titulo);

        if (!dadosOmdb) {
          console.log(`[CRON] Filme não encontrado na OMDb: ${filme.titulo}`);
          continue;
        }

        const novaNota = extrairNotaRotten(dadosOmdb.Ratings);

        await pool.query(
          'UPDATE filmes SET nota_rotten = $1 WHERE id = $2',
          [novaNota, filme.id]
        );

        console.log(`[CRON] "${filme.titulo}" atualizado para: ${novaNota}`);
      } catch (erroFilme) {
        console.error(`[CRON] Falha ao atualizar "${filme.titulo}":`, erroFilme);
      }
    }

    console.log('[CRON] Sincronização finalizada.');
  } catch (erroBanco) {
    console.error('[CRON] Erro ao consultar filmes no banco:', erroBanco);
  }
}