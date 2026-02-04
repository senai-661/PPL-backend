import { Router } from "express";
import type { Request, Response } from "express";

import { PassageiroController } from "./controller/PassageiroController.js";
import { CorridaController } from "./controller/CorridaController.js";
import { MotoristaController } from "./controller/MotoristaController.js";
import { AvaliacaoController } from "./controller/AvaliacaoController.js";
import { VeiculoController } from "./controller/VeiculoController.js";

const router = Router();

router.get("/api", (req: Request, res: Response) => {
  res.status(200).json({ mensagem: "Olá, boas-vindas a API do PPT." });
});

// Passageiros
router.get("/api/passageiros", PassageiroController.listar);
router.post("/api/cadastro/passageiros", PassageiroController.cadastro);

// Motoristas
router.get("/api/motoristas", MotoristaController.listar);
router.post("/api/cadastro/motoristas", MotoristaController.cadastro);

// Corridas
router.get("/api/corridas", CorridaController.listar);
router.post("/api/cadastro/corridas", CorridaController.solicitar);

// Avaliacoes
router.get("/api/avaliacoes", AvaliacaoController.listar);
router.post("/api/cadastro/avaliacoes", AvaliacaoController.avaliar);

// Veiculos
router.get("/api/veiculos", VeiculoController.listar);
router.post("/api/cadastro/veiculos", VeiculoController.cadastro);

export { router };
