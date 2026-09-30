import type { Request, Response, NextFunction } from "express";
import { AdminService } from "../services/AdminService.js";

export class AdminController {
  static async listar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const resultado = await AdminService.listar();
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async dashboard(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const resultado = await AdminService.dashboard();
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async atualizarPassageiro(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = parseInt(req.params.id as string, 10);
      const resultado = await AdminService.atualizarPassageiro(idPassageiro, req.body);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async atualizarMotorista(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idMotorista = parseInt(req.params.id as string, 10);
      const resultado = await AdminService.atualizarMotorista(idMotorista, req.body);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async removerPassageiro(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = parseInt(req.params.id as string, 10);
      const resultado = await AdminService.removerPassageiro(idPassageiro);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async removerMotorista(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idMotorista = parseInt(req.params.id as string, 10);
      const resultado = await AdminService.removerMotorista(idMotorista);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }
}
