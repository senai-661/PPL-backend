import type { Request, Response, NextFunction } from "express";
import { AvaliacaoService } from "../services/AvaliacaoService.js";

class AvaliacaoController {
  static async listar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const avaliacoes = await AvaliacaoService.listarAvaliacoes();
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

      return res.status(resultado.status).json({ mensagem: resultado.mensagem });
    } catch (error) {
      next(error);
    }
  }

  static async minhas(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idMotorista = (req as any).usuario.id;
      const resultado = await AvaliacaoService.minhasAvaliacoes(idMotorista);
      return res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  static async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idAvaliacao = parseInt(req.params.id as string, 10);
      if (isNaN(idAvaliacao)) {
        return res.status(400).json({ mensagem: "ID da avaliação inválido." });
      }

      const avaliacao = await AvaliacaoService.buscarPorId(idAvaliacao);
      if (!avaliacao) {
        return res.status(404).json({ mensagem: "Avaliação não encontrada." });
      }

      return res.status(200).json(avaliacao);
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ mensagem: error.message });
      }
      next(error);
    }
  }

  static async atualizar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idAvaliacao = parseInt(req.params.id as string, 10);
      if (isNaN(idAvaliacao)) {
        return res.status(400).json({ mensagem: "ID da avaliação inválido." });
      }

      const { nota, comentario } = req.body;
      if (!nota || nota < 1 || nota > 5) {
        return res.status(400).json({ mensagem: "Nota deve ser entre 1 e 5." });
      }

      const sucesso = await AvaliacaoService.atualizarAvaliacao(idAvaliacao, nota, comentario);
      if (!sucesso) {
        return res.status(400).json({ mensagem: "Não foi possível atualizar a avaliação." });
      }

      return res.status(200).json({ mensagem: "Avaliação atualizada com sucesso!" });
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ mensagem: error.message });
      }
      next(error);
    }
  }

  static async remover(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idAvaliacao = parseInt(req.params.id as string, 10);
      if (isNaN(idAvaliacao)) {
        return res.status(400).json({ mensagem: "ID da avaliação inválido." });
      }

      const sucesso = await AvaliacaoService.removerAvaliacao(idAvaliacao);
      if (!sucesso) {
        return res.status(404).json({ mensagem: "Avaliação não encontrada ou não pôde ser excluída." });
      }

      return res.status(200).json({ mensagem: "Avaliação excluída com sucesso!" });
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ mensagem: error.message });
      }
      next(error);
    }
  }
}

export { AvaliacaoController };
