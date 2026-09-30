import type { Request, Response, NextFunction } from "express";
import { CorridaService } from "../services/CorridaService.js";

export class CorridaController {
  static async listar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const status = Array.isArray(req.query.status)
        ? (req.query.status[0] as string)
        : (req.query.status as string | undefined);
      const usuario = (req as any).usuario;

      const resultado = await CorridaService.listar(status, usuario);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async precoEstimado(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const resultado = await CorridaService.precoEstimado(req.body);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async solicitar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = (req as any).usuario.id;
      const resultado = await CorridaService.solicitar(idPassageiro, req.body);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async aceitar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idCorrida = parseInt(req.params.id as string, 10);
      const idMotorista = (req as any).usuario.id;

      const resultado = await CorridaService.aceitar(idCorrida, idMotorista);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async iniciar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idCorrida = parseInt(req.params.id as string, 10);
      const idMotorista = (req as any).usuario.id;

      const resultado = await CorridaService.iniciar(idCorrida, idMotorista);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async finalizar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idCorrida = parseInt(req.params.id as string, 10);
      const idMotorista = (req as any).usuario.id;

      const resultado = await CorridaService.finalizar(idCorrida, idMotorista);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async cancelar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idCorrida = parseInt(req.params.id as string, 10);
      const usuario = (req as any).usuario;
      const { motivoCancelamento } = req.body;

      const resultado = await CorridaService.cancelar(idCorrida, usuario, motivoCancelamento);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async cancelarAtual(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = (req as any).usuario.id;
      const resultado = await CorridaService.cancelarAtual(idPassageiro);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async historico(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const usuario = (req as any).usuario;
      const resultado = await CorridaService.historico(usuario);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async relatorio(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idMotorista = (req as any).usuario.id;
      const resultado = await CorridaService.relatorio(idMotorista);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idCorrida = parseInt(req.params.id as string, 10);
      const usuario = (req as any).usuario;

      const resultado = await CorridaService.buscarPorId(idCorrida, usuario);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async corridaAtual(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = (req as any).usuario.id;
      const resultado = await CorridaService.corridaAtual(idPassageiro);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async corridaAtualMotorista(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const idMotorista = (req as any).usuario.id;
      const resultado = await CorridaService.corridaAtualMotorista(idMotorista);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async resumoDiaMotorista(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const idMotorista = (req as any).usuario.id;
      const resultado = await CorridaService.resumoDiaMotorista(idMotorista);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async remover(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idCorrida = parseInt(req.params.id as string, 10);
      const resultado = await CorridaService.remover(idCorrida);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }
}
