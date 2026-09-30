import type { Request, Response, NextFunction } from "express";
import { UsuarioService } from "../services/UsuarioService.js";

export class UsuarioController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { email, senha } = req.body;
      const resultado = await UsuarioService.login(email, senha);

      return res.status(200).json({
        mensagem: "Login realizado com sucesso!",
        token: resultado.token,
        usuario: resultado.usuario,
      });
    } catch (error: any) {
      if (error.status === 401) {
        return res.status(401).json({ mensagem: error.message });
      }
      if (error.status === 400) {
        return res.status(400).json({ mensagem: error.message });
      }
      next(error);
    }
  }

  static async registrar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { tipo } = req.body;
      await UsuarioService.registrar(req.body);

      return res.status(201).json({ mensagem: `${tipo} cadastrado com sucesso!` });
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ mensagem: error.message });
      }
      next(error);
    }
  }
}
