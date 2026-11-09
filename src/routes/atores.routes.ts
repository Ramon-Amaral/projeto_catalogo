import { Router } from "express";
import { listarAtores, buscarAtoresPorId, inserirNovoAtor, atualizarAtor, atualizarColunaAtores, deletarAtor  } from "../controllers/atores.controller.js";

const router = Router()

router.post('/atores', inserirNovoAtor)
router.get('/atores', listarAtores)
router.get('/atores/:id', buscarAtoresPorId)
router.put('/atores/:id', atualizarAtor)
router.patch('/atores/:id', atualizarColunaAtores)
router.delete('/atores/:id', deletarAtor)

export default router