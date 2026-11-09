import {Router} from "express";
import { listarElenco, listarElencoPorId, atualizarColunaElenco, atualizarElenco, inserirNovoElenco, deletarElenco } from "../controllers/elenco.controller.js";


const router = Router();

router.get('/elencos', listarElenco)
router.get('/elencos/:id', listarElencoPorId)
router.post('/elencos', inserirNovoElenco)
router.put('/elencos/:id', atualizarElenco)
router.patch('/elencos/:id', atualizarColunaElenco)
router.delete('/elencos/:id', deletarElenco)

export default router 