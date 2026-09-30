import { Router } from "express";
import { VeiculoController } from "../controllers/VeiculoController.js";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";

const veiculoRoutes = Router();

veiculoRoutes.get(
  "/api/veiculos",
  AuthMiddleware.verificarToken,
  VeiculoController.listar
);

veiculoRoutes.get(
  "/api/veiculos/:id",
  AuthMiddleware.verificarToken,
  VeiculoController.buscarPorId
);

veiculoRoutes.get(
  "/api/motorista/veiculo",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteMotorista,
  VeiculoController.veiculoDoMotorista
);

veiculoRoutes.post(
  "/api/cadastro/veiculos",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteMotorista,
  VeiculoController.cadastro
);

veiculoRoutes.patch(
  "/api/veiculos/:id",
  AuthMiddleware.verificarToken,
  VeiculoController.atualizar
);

veiculoRoutes.delete(
  "/api/veiculos/:id",
  AuthMiddleware.verificarToken,
  VeiculoController.remover
);

export { veiculoRoutes };
