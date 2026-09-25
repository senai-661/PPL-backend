import type { Request, Response, NextFunction } from "express";
import { AvaliacaoService } from "../services/AvaliacaoService.js";

export class AvaliacaoController {
  static async listar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const avaliacoes = await AvaliacaoService.listar();
      return res.status(200).json(avaliacoes);
    } catch (error) {
      next(error);
    }
  }

  static async avaliar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { idCorrida, nota, comentario } = req.body;
      const idPassageiro = (req as any).usuario.id;

      const resultado = await AvaliacaoService.avaliar(idPassageiro, {
        idCorrida,
        nota,
        comentario,
      });

      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async minhas(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idMotorista = (req as any).usuario.id;
      const resultado = await AvaliacaoService.obterMinhasAvaliacoes(idMotorista);
      return res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  static async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idAvaliacao = parseInt(req.params.id as string, 10);
      const resultado = await AvaliacaoService.buscarPorId(idAvaliacao);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async atualizar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idAvaliacao = parseInt(req.params.id as string, 10);
      const { nota, comentario } = req.body;
      const resultado = await AvaliacaoService.atualizar(idAvaliacao, { nota, comentario });
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }

  static async remover(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idAvaliacao = parseInt(req.params.id as string, 10);
      const resultado = await AvaliacaoService.remover(idAvaliacao);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      next(error);
    }
  }
}
