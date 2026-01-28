import { Router } from "express";
import type { Request, Response } from "express";

import PassageiroController from "./controller/PassageiroController.js";
import CorridaController from "./controller/CorridaController.js";
import MotoristaController from "./controller/MotoristaController.js";

const router = Router();

router.get("/api", (req: Request, res: Response) => {
  res.status(200).json({ mensagem: "Olá, boas-vindas a API." });
});

export { router };
