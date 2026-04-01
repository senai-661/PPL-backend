import type { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response {
  console.error(`[${req.method}] ${req.path} →`, error);

  // PostgreSQL error codes
  if (error.code === "23505") {
    return res.status(409).json({
      mensagem: "Este e-mail ou CPF já está cadastrado.",
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

  // JWT errors
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ mensagem: "Token inválido." });
  }
  if (error.name === "TokenExpiredError") {
    return res.status(401).json({ mensagem: "Sessão expirada. Faça login novamente." });
  }

  // Auth errors
  if (error.status === 403) {
    return res.status(403).json({
      mensagem: error.message || "Você não tem permissão para acessar essa área.",
    });
  }
  if (error.status === 404) {
    return res.status(404).json({
      mensagem: error.message || "Recurso não encontrado.",
    });
  }

  // Generic fallback
  return res.status(500).json({ mensagem: "Erro interno no servidor." });
}