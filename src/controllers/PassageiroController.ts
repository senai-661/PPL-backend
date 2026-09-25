import type { Request, Response, NextFunction } from "express";
import { PassageiroService } from "../services/PassageiroService.js";

export class PassageiroController {
  static async listar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { idPassageiro } = req.query;
      const resultado = await PassageiroService.listar(idPassageiro as string | undefined);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = parseInt(req.params.id as string, 10);
      const resultado = await PassageiroService.buscarPorId(idPassageiro);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async remover(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = parseInt(req.params.id as string, 10);
      const resultado = await PassageiroService.remover(idPassageiro);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async perfil(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = (req as any).usuario.id;
      const resultado = await PassageiroService.perfil(idPassageiro);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async editarPerfil(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = (req as any).usuario.id;
      const resultado = await PassageiroService.editarPerfil(idPassageiro, req.body);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async relatorio(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = (req as any).usuario.id;
      const resultado = await PassageiroService.relatorio(idPassageiro);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }
}
