import type { Request, Response, NextFunction } from "express";
import { MotoristaService } from "../services/MotoristaService.js";

export class MotoristaController {
  static async listar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { idMotorista } = req.query;
      const resultado = await MotoristaService.listar(idMotorista as string | undefined);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async buscarPorId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const idMotorista = Number(req.params.id);
      const resultado = await MotoristaService.buscarPorId(idMotorista);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async perfil(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const idMotorista = (req as any).usuario.id;
      const resultado = await MotoristaService.perfil(idMotorista);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async editarPerfil(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const idMotorista = (req as any).usuario.id;
      const resultado = await MotoristaService.editarPerfil(idMotorista, req.body);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async alterarDisponibilidade(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const idMotorista = (req as any).usuario.id;
      const { disponivel } = req.body;
      const resultado = await MotoristaService.alterarDisponibilidade(idMotorista, disponivel);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async remover(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const idMotorista = Number(req.params.id);
      const resultado = await MotoristaService.remover(idMotorista);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }
}
