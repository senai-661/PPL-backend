import { Router } from "express";
import { AdminController } from "../controllers/AdminController.js";
import { CorridaController } from "../controllers/CorridaController.js";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";

const adminRoutes = Router();

adminRoutes.get(
  "/api/admin/listar",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteAdmin,
  AdminController.listar
);

adminRoutes.get(
  "/api/admin/dashboard",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteAdmin,
  AdminController.dashboard
);

adminRoutes.patch(
  "/api/admin/passageiros/:id",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteAdmin,
  AdminController.atualizarPassageiro
);

adminRoutes.delete(
  "/api/admin/passageiros/:id",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteAdmin,
  AdminController.removerPassageiro
);

adminRoutes.patch(
  "/api/admin/motoristas/:id",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteAdmin,
  AdminController.atualizarMotorista
);

adminRoutes.delete(
  "/api/admin/motoristas/:id",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteAdmin,
  AdminController.removerMotorista
);

adminRoutes.delete(
  "/api/admin/corridas/:id",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteAdmin,
  CorridaController.remover
);

export { adminRoutes };
