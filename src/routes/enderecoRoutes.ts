import { Router } from "express";
import { EnderecoController } from "../controllers/EnderecoController.js";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";

const enderecoRoutes = Router();

enderecoRoutes.get(
  "/api/autocomplete/enderecos",
  EnderecoController.buscarSugestoes
);

enderecoRoutes.get(
  "/api/enderecos",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteAdmin,
  EnderecoController.listar
);

enderecoRoutes.get(
  "/api/enderecos/:id",
  AuthMiddleware.verificarToken,
  EnderecoController.buscarPorId
);

enderecoRoutes.post(
  "/api/enderecos",
  AuthMiddleware.verificarToken,
  EnderecoController.criar
);

enderecoRoutes.patch(
  "/api/enderecos/:id",
  AuthMiddleware.verificarToken,
  EnderecoController.atualizar
);

enderecoRoutes.delete(
  "/api/enderecos/:id",
  AuthMiddleware.verificarToken,
  EnderecoController.remover
);

enderecoRoutes.get(
  "/api/enderecos/sugestoes",
  EnderecoController.buscarSugestoes
);

export { enderecoRoutes };
