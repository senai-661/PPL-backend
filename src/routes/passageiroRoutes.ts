import { Router } from "express";
import { PassageiroController } from "../controllers/PassageiroController.js";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";

const passageiroRoutes = Router();

passageiroRoutes.get(
  "/api/passageiro/perfil",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somentePassageiro,
  PassageiroController.perfil
);

passageiroRoutes.patch(
  "/api/passageiro/perfil",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somentePassageiro,
  PassageiroController.editarPerfil
);

passageiroRoutes.get(
  "/api/passageiros",
  AuthMiddleware.verificarToken,
  PassageiroController.listar
);

passageiroRoutes.get(
  "/api/passageiros/:id",
  AuthMiddleware.verificarToken,
  PassageiroController.buscarPorId
);

passageiroRoutes.delete(
  "/api/passageiros/:id",
  AuthMiddleware.verificarToken,
  PassageiroController.remover
);

passageiroRoutes.get(
  "/api/passageiro/relatorio",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somentePassageiro,
  PassageiroController.relatorio
);

export { passageiroRoutes };
