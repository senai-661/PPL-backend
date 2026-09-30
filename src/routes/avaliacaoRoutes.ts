import { Router } from "express";
import { AvaliacaoController } from "../controllers/AvaliacaoController.js";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";

const avaliacaoRoutes = Router();

avaliacaoRoutes.get(
  "/api/avaliacoes/minhas",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteMotorista,
  AvaliacaoController.minhas
);

avaliacaoRoutes.get(
  "/api/avaliacoes",
  AuthMiddleware.verificarToken,
  AvaliacaoController.listar
);

avaliacaoRoutes.get(
  "/api/avaliacoes/:id",
  AuthMiddleware.verificarToken,
  AvaliacaoController.buscarPorId
);

avaliacaoRoutes.post(
  "/api/avaliacoes",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somentePassageiro,
  AvaliacaoController.avaliar
);

avaliacaoRoutes.patch(
  "/api/avaliacoes/:id",
  AuthMiddleware.verificarToken,
  AvaliacaoController.atualizar
);

avaliacaoRoutes.delete(
  "/api/avaliacoes/:id",
  AuthMiddleware.verificarToken,
  AvaliacaoController.remover
);

export { avaliacaoRoutes };
