import { Router } from "express";
import {
  buscarFilmes,
  buscarFilmesporID,
  inserirNovoFilme,
  atualizarFilme,
  atualizarColunas,
  deletarFilme,
} from "../controllers/filmes.controller.js";

const router = Router();

router.get("/filmes", buscarFilmes);
router.get("/filmes/:id", buscarFilmesporID);
router.post("/filmes", inserirNovoFilme);
router.put("/filmes/:id", atualizarFilme);
router.patch("/filmes/:id", atualizarColunas);
router.delete("/filmes/:id", deletarFilme);

export default router;
