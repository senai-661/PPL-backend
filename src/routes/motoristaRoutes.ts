import { Router } from "express";
import { MotoristaController } from "../controllers/MotoristaController.js";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";

const motoristaRoutes = Router();

motoristaRoutes.get(
  "/api/motorista/perfil",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteMotorista,
  MotoristaController.perfil
);

motoristaRoutes.patch(
  "/api/motorista/perfil",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteMotorista,
  MotoristaController.editarPerfil
);

motoristaRoutes.get(
  "/api/motoristas",
  AuthMiddleware.verificarToken,
  MotoristaController.listar
);

motoristaRoutes.get(
  "/api/motoristas/:id",
  AuthMiddleware.verificarToken,
  MotoristaController.buscarPorId
);

motoristaRoutes.patch(
  "/api/motorista/disponibilidade",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteMotorista,
  MotoristaController.alterarDisponibilidade
);

motoristaRoutes.delete(
  "/api/motoristas/:id",
  AuthMiddleware.verificarToken,
  MotoristaController.remover
);

export { motoristaRoutes };
