import { Router } from "express";
import {
  buscarFilmes, 
  buscarFilmesporID,
  inserirNovoFilme,
  atualizarFilme,
  atualizarColunas,
  deletarFilme
} from '../controllers/filmes.controller.js'

const router = Router();

router.get('/', buscarFilmes);
router.get('/:id', buscarFilmesporID)
router.post('/', inserirNovoFilme)
router.put('/:id', atualizarFilme)
router.patch('/:id', atualizarColunas)
router.delete('/:id', deletarFilme)

export default router