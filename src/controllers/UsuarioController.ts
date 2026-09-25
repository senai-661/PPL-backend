import type { Request, Response, NextFunction } from "express";
import { UsuarioService } from "../services/UsuarioService.js";

export class UsuarioController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { email, senha } = req.body;
      const resultado = await UsuarioService.login(email, senha);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async registrar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const resultado = await UsuarioService.registrar(req.body);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }
}
