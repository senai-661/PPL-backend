import { Router } from "express";
import type { Request, Response } from "express";

import { UsuarioController } from "./controller/UsuarioController.js";
import { PassageiroController } from "./controller/PassageiroController.js";
import { CorridaController } from "./controller/CorridaController.js";
import { MotoristaController } from "./controller/MotoristaController.js";
import { AvaliacaoController } from "./controller/AvaliacaoController.js";
import { VeiculoController } from "./controller/VeiculoController.js";
import { AdminController } from "./controller/AdminController.js";
import { EnderecoController } from "./controller/EnderecoController.js";
import { AuthMiddleware } from "./middlewares/AuthMiddleware.js";

// ✅ ADICIONADO (AGENDAMENTO)
import { CorridaAgendamentoController } from "./controller/CorridaAgendamentoController.js";
import { DatabaseModel } from "./model/DatabaseModel.js";
import { CorridaModel } from "./model/CorridaAgendamento.js";

const router = Router();

// ============================================
// INSTÂNCIAS (ADICIONADO SEM MEXER NO RESTO)
// ============================================
const db = new DatabaseModel();
const corridaModel = new CorridaModel(db);
const corridaAgendamentoController = new CorridaAgendamentoController(corridaModel);

// ============================================
// ROTA INICIAL
// ============================================
router.get("/api", (req: Request, res: Response) => {
  res.status(200).json({ mensagem: "Olá, boas-vindas a API do OpenLine." });
});

// ============================================
// ROTAS PÚBLICAS (sem token)
// ============================================
router.post("/api/registrar", UsuarioController.registrar);
router.post("/api/login", UsuarioController.login);
router.post("/api/preco-estimado", CorridaController.precoEstimado);
router.get("/api/autocomplete/enderecos", EnderecoController.buscarSugestoes);

// ============================================
// PERFIL (GET + PATCH)
// ============================================
router.get(
  "/api/passageiro/perfil",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somentePassageiro,
  PassageiroController.perfil,
);

router.patch(
  "/api/passageiro/perfil",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somentePassageiro,
  PassageiroController.editarPerfil,
);

router.get(
  "/api/motorista/perfil",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteMotorista,
  MotoristaController.perfil,
);

router.patch(
  "/api/motorista/perfil",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteMotorista,
  MotoristaController.editarPerfil,
);

// ============================================
// MOTORISTA
// ============================================
router.get(
  "/api/motoristas",
  AuthMiddleware.verificarToken,
  MotoristaController.listar,
);

router.get(
  "/api/motorista/relatorio",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteMotorista,
  CorridaController.relatorio,
);

router.patch(
  "/api/motorista/disponibilidade",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteMotorista,
  MotoristaController.alterarDisponibilidade,
);

router.get(
  "/api/motorista/corrida-atual",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteMotorista,
  CorridaController.corridaAtualMotorista
);

router.get(
  "/api/motorista/resumo-dia",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteMotorista,
  CorridaController.resumoDiaMotorista
);

// ============================================
// PASSAGEIRO
// ============================================
router.get(
  "/api/passageiros",
  AuthMiddleware.verificarToken,
  PassageiroController.listar,
);

// ============================================
// CORRIDAS
// ============================================
router.get(
  "/api/corridas/historico",
  AuthMiddleware.verificarToken,
  CorridaController.historico,
);

router.get(
  "/api/corridas",
  AuthMiddleware.verificarToken,
  CorridaController.listar,
);

router.get(
  "/api/corridas/:id",
  AuthMiddleware.verificarToken,
  CorridaController.buscarPorId,
);

router.post(
  "/api/corridas",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somentePassageiro,
  CorridaController.solicitar,
);

// ============================================
// ✅ ADICIONADO: CORRIDAS AGENDADAS
// ============================================
router.post(
  "/api/corridas-agendadas",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somentePassageiro,
  (req: Request, res: Response) =>
    corridaAgendamentoController.criar(req, res)
);

router.patch(
  "/api/corridas/:id/aceitar",
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
// AVALIAÇÕES
// ============================================
router.get(
  "/api/avaliacoes/minhas",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteMotorista,
  AvaliacaoController.minhas,
);

router.get(
  "/api/avaliacoes",
  AuthMiddleware.verificarToken,
  AvaliacaoController.listar,
);

router.post(
  "/api/avaliacoes",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somentePassageiro,
  AvaliacaoController.avaliar,
);

// ============================================
// VEÍCULOS
// ============================================
router.get(
  "/api/veiculos",
  AuthMiddleware.verificarToken,
  VeiculoController.listar,
);

router.post(
  "/api/cadastro/veiculos",
  AuthMiddleware.verificarToken,
  VeiculoController.cadastro,
);

// ============================================
// ADMIN
// ============================================
router.get(
  "/api/admin/listar",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteAdmin,
  AdminController.listar,
);

router.get(
  "/api/admin/dashboard",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteAdmin,
  AdminController.dashboard,
);

router.get(
  "/api/enderecos",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somenteAdmin,
  EnderecoController.listar,
);

// autocomplete público
router.get(
  "/api/enderecos/sugestoes",
  EnderecoController.buscarSugestoes,
);

// ============================================
// PASSAGEIRO
// ============================================
router.get(
  "/api/passageiros",
  AuthMiddleware.verificarToken,
  PassageiroController.listar,
);

router.get(
  "/api/passageiro/corrida-atual",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somentePassageiro,
  CorridaController.corridaAtual,
);

router.get(
  "/api/passageiro/relatorio",
  AuthMiddleware.verificarToken,
  AuthMiddleware.somentePassageiro,
  PassageiroController.relatorio,
);

export { router };