import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController.js";

const usuarioRoutes = Router();

usuarioRoutes.post("/api/registrar", UsuarioController.registrar);
usuarioRoutes.post("/api/login", UsuarioController.login);

export { usuarioRoutes };
