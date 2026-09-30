import { Router } from "express";
import { CorridaController } from "../controllers/CorridaController.js";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";

const corridaRoutes = Router();

corridaRoutes.post("/api/preco-estimado", CorridaController.precoEstimado);

corridaRoutes.get(
  "/api/motorista/relatorio",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteMotorista,
  CorridaController.relatorio
);

corridaRoutes.get(
  "/api/motorista/corrida-atual",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteMotorista,
  CorridaController.corridaAtualMotorista
);

corridaRoutes.get(
  "/api/motorista/resumo-dia",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteMotorista,
  CorridaController.resumoDiaMotorista
);

corridaRoutes.get(
  "/api/passageiro/corrida-atual",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somentePassageiro,
  CorridaController.corridaAtual
);

corridaRoutes.get(
  "/api/corridas/historico",
  AuthMiddleware.verificarToken,
  CorridaController.historico
);

corridaRoutes.get(
  "/api/corridas",
  AuthMiddleware.verificarToken,
  CorridaController.listar
);

corridaRoutes.delete(
  "/api/corridas/atual",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somentePassageiro,
  CorridaController.cancelarAtual
);

corridaRoutes.get(
  "/api/corridas/:id",
  AuthMiddleware.verificarToken,
  CorridaController.buscarPorId
);

corridaRoutes.post(
  "/api/corridas",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somentePassageiro,
  CorridaController.solicitar
);

corridaRoutes.patch(
  "/api/corridas/:id/aceitar",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteMotorista,
  CorridaController.aceitar
);

corridaRoutes.patch(
  "/api/corridas/:id/iniciar",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteMotorista,
  CorridaController.iniciar
);

corridaRoutes.patch(
  "/api/corridas/:id/finalizar",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteMotorista,
  CorridaController.finalizar
);

corridaRoutes.patch(
  "/api/corridas/:id/cancelar",
  AuthMiddleware.verificarToken,
  CorridaController.cancelar
);

corridaRoutes.delete(
  "/api/corridas/:id",
  AuthMiddleware.verificarToken,
  CorridaController.remover
);

export { corridaRoutes };
