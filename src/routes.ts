import { Router } from "express";
import type { Request, Response } from "express";

import { PassageiroController } from "./controller/PassageiroController.js";
import { CorridaController } from "./controller/CorridaController.js";
import { MotoristaController } from "./controller/MotoristaController.js";
import { AvaliacaoController } from "./controller/AvaliacaoController.js";
import { VeiculoController } from "./controller/VeiculoController.js";
import { AdminController } from "./controller/AdminController.js";
import { EnderecoController } from "./controller/EnderecoController.js";

// Importando o segurança da API
import { AuthMiddleware } from "./middlewares/AuthMiddleware.js";

const router = Router();

// --- Rota Inicial ---
router.get("/api", (req: Request, res: Response) => {
  res.status(200).json({ mensagem: "Olá, boas-vindas a API do PPT." });
});

// ============================================
// ROTAS PÚBLICAS (Ninguém precisa de Token)
// ============================================

// Motorista
router.post("/api/motorista/registrar", MotoristaController.register);
router.post("/api/motorista/login", MotoristaController.login);

// Passageiro
router.post("/api/passageiro/registrar", PassageiroController.register);
router.post("/api/passageiro/login", PassageiroController.login);

// Admin
router.post("/api/admin/login", AdminController.login);

// ============================================
// ROTAS RESTRITAS (Precisa de Token JWT)
// ============================================

// --- Listagens (GET) ---
// O 'verificarToken' garante que o usuário está logado
router.get(
  "/api/motoristas",
  AuthMiddleware.verificarToken,
  MotoristaController.listar,
);
router.get(
  "/api/passageiros",
  AuthMiddleware.verificarToken,
  PassageiroController.listar,
);
router.get(
  "/api/corridas",
  AuthMiddleware.verificarToken,
  CorridaController.listar,
);
router.get(
  "/api/veiculos",
  AuthMiddleware.verificarToken,
  VeiculoController.listar,
);
router.get(
  "/api/avaliacoes",
  AuthMiddleware.verificarToken,
  AvaliacaoController.listar,
);

// --- Cadastros (POST) ---
router.post(
  "/api/corridas",
  AuthMiddleware.verificarToken,
  CorridaController.solicitar,
);
router.post(
  "/api/avaliacoes",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somentePassageiro,
  AvaliacaoController.avaliar,
);
router.post(
  "/api/cadastro/veiculos",
  AuthMiddleware.verificarToken,
  VeiculoController.cadastro,
);

// ============================================
// ROTAS EXCLUSIVAS PARA ADMINS
// ============================================

// Listar Admins
router.get(
  "/api/admin/listar",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteAdmin,
  AdminController.listar,
);

// Listar todos os Endereços (com o JOIN que fizemos)
router.get(
  "/api/enderecos",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteAdmin,
  EnderecoController.listar,
);

// ============================================
// ROTAS DE CORRIDAS
// ============================================
router.get(
  "/api/corridas/pendentes",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteMotorista,
  CorridaController.listarPendentes,
);
router.patch(
  "/api/corridas/:id/aceitar/",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteMotorista,
  CorridaController.aceitar,
);
router.patch(
  "/api/corridas/:id/iniciar",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteMotorista,  
  CorridaController.iniciar,
);
router.patch(
  "/api/corridas/:id/finalizar",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteMotorista,
  CorridaController.finalizar,
);
router.patch(
  "/api/corridas/:id/cancelar",
  AuthMiddleware.verificarToken,
  CorridaController.cancelar,
);
// ============================================
// ROTAS DE PERFIL (GET)
// ============================================
router.get(
  "/api/passageiro/perfil",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somentePassageiro,
  PassageiroController.perfil,
);
router.get(
  "/api/motorista/perfil",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteMotorista,
  MotoristaController.perfil,
);
export { router };