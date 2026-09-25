import type { Request, Response, NextFunction } from "express";
import { PassageiroService } from "../services/PassageiroService.js";

class PassageiroController {
  static async listar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { idPassageiro } = req.query;
      const id = idPassageiro ? parseInt(idPassageiro as string, 10) : undefined;
      const resultado = await PassageiroService.listar(id);

      if (id && !resultado) {
        return res.status(404).json({ mensagem: "Passageiro não encontrado." });
      }

      return res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  static async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = parseInt(req.params.id as string, 10);
      if (isNaN(idPassageiro)) {
        return res.status(400).json({ mensagem: "ID do passageiro inválido." });
      }

      const passageiro = await PassageiroService.buscarPorId(idPassageiro);
      if (!passageiro) {
        return res.status(404).json({ mensagem: "Passageiro não encontrado." });
      }

      return res.status(200).json(passageiro);
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ mensagem: error.message });
      }
      next(error);
    }
  }

  static async remover(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = parseInt(req.params.id as string, 10);
      if (isNaN(idPassageiro)) {
        return res.status(400).json({ mensagem: "ID do passageiro inválido." });
      }

      const sucesso = await PassageiroService.remover(idPassageiro);
      if (!sucesso) {
        return res.status(404).json({ mensagem: "Passageiro não encontrado ou não pôde ser excluído." });
      }

      return res.status(200).json({ mensagem: "Passageiro excluído com sucesso." });
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ mensagem: error.message });
      }
      next(error);
    }
  }

  static async perfil(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = (req as any).usuario.id;
      const passageiro = await PassageiroService.obterPerfil(idPassageiro);

      if (!passageiro) {
        return res.status(404).json({ mensagem: "Passageiro não encontrado." });
      }

      return res.status(200).json(passageiro);
    } catch (error) {
      next(error);
    }
  }

  static async editarPerfil(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = (req as any).usuario.id;
      const sucesso = await PassageiroService.editarPerfil(idPassageiro, req.body);

      if (!sucesso) {
        return res.status(400).json({ mensagem: "Nenhum campo válido para atualizar." });
      }

      return res.status(200).json({ mensagem: "Perfil atualizado com sucesso!" });
    } catch (error) {
      next(error);
    }
  }

  static async relatorio(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = (req as any).usuario.id;
      const dados = await PassageiroService.relatorio(idPassageiro);

      if (!dados) {
        return res.status(500).json({ mensagem: "Erro ao gerar relatório." });
      }

      return res.status(200).json(dados);
    } catch (error) {
      next(error);
    }
  }
}

export { PassageiroController };