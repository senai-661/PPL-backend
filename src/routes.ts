import { Router } from "express";
import type { Request, Response } from "express";

import { PassageiroController } from "./controller/PassageiroController.js";

const router = Router();

router.get("/api", (req: Request, res: Response) => {
  res.status(200).json({ mensagem: "Olá, boas-vindas a API do PPT." });
});

router.get("/api/passageiros", PassageiroController.listar);
router.post("/api/cadastro/passageiros", PassageiroController.cadastro);

export { router };
