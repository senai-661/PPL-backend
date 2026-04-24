import type { NextFunction, Request, Response } from "express";

function getMensagemCampoDuplicado(error: any): string {
  const detail = typeof error?.detail === "string" ? error.detail : "";
  const constraint = typeof error?.constraint === "string" ? error.constraint : "";

  const campoMatch = detail.match(/Key \(([^)]+)\)=/);
  const campo = campoMatch?.[1]?.toLowerCase();

  const mensagensPorCampo: Record<string, string> = {
    email: "Este e-mail já está cadastrado.",
    cpf: "Este CPF já está cadastrado.",
    celular: "Este telefone já está cadastrado.",
    cnh: "Esta CNH já está cadastrada.",
    placa: "Esta placa já está cadastrada.",
  };

  if (campo && mensagensPorCampo[campo]) {
    return mensagensPorCampo[campo];
  }

  const mensagensPorConstraint: Record<string, string> = {
    usuario_email_key: "Este e-mail já está cadastrado.",
    passageiro_cpf_key: "Este CPF já está cadastrado.",
    motorista_cpf_key: "Este CPF já está cadastrado.",
    motorista_cnh_key: "Esta CNH já está cadastrada.",
    veiculo_placa_key: "Esta placa já está cadastrada.",
  };

  if (constraint && mensagensPorConstraint[constraint]) {
    return mensagensPorConstraint[constraint];
  }

  return "Este registro já está cadastrado.";
}

export function errorMiddleware(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
): Response {
  console.error(`[${req.method}] ${req.path} ->`, error);

  if (error.code === "23505") {
    return res.status(409).json({
      mensagem: getMensagemCampoDuplicado(error),
    });
  }

  if (error.code === "23503") {
    return res.status(400).json({
      mensagem: "Referência inválida. O registro relacionado não existe.",
    });
  }

  if (error.code === "23502") {
    return res.status(400).json({
      mensagem: `Campo obrigatório faltando: ${error.column}`,
    });
  }

  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ mensagem: "Token inválido." });
  }

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({ mensagem: "Sessão expirada. Faça login novamente." });
  }

  if (error.status === 403) {
    return res.status(403).json({
      mensagem: error.message || "Você não tem permissão para acessar esta área.",
    });
  }

  if (error.status === 404) {
    return res.status(404).json({
      mensagem: error.message || "Recurso não encontrado.",
    });
  }

  return res.status(500).json({ mensagem: "Erro interno no servidor." });
}
