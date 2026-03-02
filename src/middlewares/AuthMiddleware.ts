import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SEGREDO = "PPL_ladygagasenha"; // Use a mesma do Controller!

export class AuthMiddleware {
  // 1º Nível: Apenas verifica se o token é válido
  static verificarToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Formato: "Bearer TOKEN"

    if (!token) {
      return res
        .status(401)
        .json({ mensagem: "Acesso negado. Faça login para continuar." });
    }

    try {
      const decodificado = jwt.verify(token, SEGREDO);
      // Salva os dados do token dentro da requisição para os próximos passos usarem
      (req as any).usuario = decodificado;
      next();
    } catch (error) {
      return res.status(403).json({ mensagem: "Token inválido ou expirado." });
    }
  }

  // 2º Nível: Verifica se o tipo de usuário tem permissão
  static somenteAdmin(req: Request, res: Response, next: NextFunction) {
    const usuario = (req as any).usuario;

    if (usuario && usuario.tipo === "admin") {
      next();
    } else {
      return res
        .status(403)
        .json({ mensagem: "Acesso restrito apenas para administradores." });
    }
  }

  // somenteMotorista...

  static somenteMotorista(req: Request, res: Response, next: NextFunction) {
    const usuario = (req as any).usuario;

    if (usuario && usuario.tipo === "motorista") {
      next();
    } else {
      return res
        .status(403)
        .json({ mensagem: "Acesso restrito apenas para motoristas." });
    }
  }
}
