import { Router } from "express";
import type { Request, Response } from "express";

import { usuarioRoutes } from "./usuarioRoutes.js";
import { passageiroRoutes } from "./passageiroRoutes.js";
import { motoristaRoutes } from "./motoristaRoutes.js";
import { corridaRoutes } from "./corridaRoutes.js";
import { corridaAgendamentoRoutes } from "./corridaAgendamentoRoutes.js";
import { avaliacaoRoutes } from "./avaliacaoRoutes.js";
import { veiculoRoutes } from "./veiculoRoutes.js";
import { adminRoutes } from "./adminRoutes.js";
import { enderecoRoutes } from "./enderecoRoutes.js";

const router = Router();

// ROTA INICIAL
router.get("/api", (req: Request, res: Response) => {
  res.status(200).json({ mensagem: "Olá, boas-vindas a API do OpenLine." });
});

// SUB-ROTAS MODULARIZADAS
router.use(usuarioRoutes);
router.use(passageiroRoutes);
router.use(motoristaRoutes);
router.use(corridaRoutes);
router.use(corridaAgendamentoRoutes);
router.use(avaliacaoRoutes);
router.use(veiculoRoutes);
router.use(adminRoutes);
router.use(enderecoRoutes);

export { router };
