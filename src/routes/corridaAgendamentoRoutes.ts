import { Router } from "express";
import type { Request, Response } from "express";
import { CorridaAgendamentoController } from "../controllers/CorridaAgendamentoController.js";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";

const corridaAgendamentoRoutes = Router();
const corridaAgendamentoController = new CorridaAgendamentoController();

corridaAgendamentoRoutes.post(
  "/api/corridas-agendadas",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somentePassageiro,
  (req: Request, res: Response) => corridaAgendamentoController.criar(req, res)
);

corridaAgendamentoRoutes.get(
  "/api/corridas-agendadas",
  AuthMiddleware.verificarToken,
  (req: Request, res: Response) => corridaAgendamentoController.listar(req, res)
);

export { corridaAgendamentoRoutes };
