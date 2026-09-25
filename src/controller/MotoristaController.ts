import type { Request, Response, NextFunction } from "express";
import { MotoristaService } from "../services/MotoristaService.js";

class MotoristaController {
  static async listar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { idMotorista } = req.query;
      const id = idMotorista ? Number(idMotorista) : undefined;
      const resultado = await MotoristaService.listar(id);

      if (id && !resultado) {
        return res.status(404).json({ mensagem: "Motorista não encontrado." });
      }

      return res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  static async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idMotorista = Number(req.params.id);
      if (isNaN(idMotorista)) {
        return res.status(400).json({ mensagem: "ID do motorista inválido." });
      }

      const motorista = await MotoristaService.buscarPorId(idMotorista);
      if (!motorista) {
        return res.status(404).json({ mensagem: "Motorista não encontrado." });
      }

      return res.status(200).json(motorista);
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ mensagem: error.message });
      }
      next(error);
    }
  }

  static async perfil(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idMotorista = (req as any).usuario.id;
      const motorista = await MotoristaService.obterPerfil(idMotorista);

      if (!motorista) {
        return res.status(404).json({ mensagem: "Motorista não encontrado." });
      }

      return res.status(200).json(motorista);
    } catch (error) {
      next(error);
    }
  }

  static async editarPerfil(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idMotorista = (req as any).usuario.id;
      const sucesso = await MotoristaService.editarPerfil(idMotorista, req.body);

      if (!sucesso) {
        return res.status(400).json({ mensagem: "Nenhum campo válido para atualizar." });
      }

      return res.status(200).json({ mensagem: "Perfil atualizado com sucesso!" });
    } catch (error) {
      next(error);
    }
  }

  static async alterarDisponibilidade(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idMotorista = (req as any).usuario.id;
      const { disponivel } = req.body;

      if (typeof disponivel !== "boolean") {
        return res.status(400).json({ mensagem: "Campo 'disponivel' deve ser true ou false." });
      }

      const sucesso = await MotoristaService.alterarDisponibilidade(idMotorista, disponivel);
      if (!sucesso) {
        return res.status(400).json({ mensagem: "Erro ao alterar disponibilidade." });
      }

      return res.status(200).json({
        mensagem: disponivel ? "Você está online!" : "Você está offline!",
      });
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ mensagem: error.message });
      }
      next(error);
    }
  }

  static async remover(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idMotorista = Number(req.params.id);
      if (isNaN(idMotorista)) {
        return res.status(400).json({ mensagem: "ID do motorista inválido." });
      }

      const sucesso = await MotoristaService.remover(idMotorista);
      if (!sucesso) {
        return res.status(404).json({ mensagem: "Motorista não encontrado ou não pôde ser excluído." });
      }

      return res.status(200).json({ mensagem: "Motorista excluído com sucesso." });
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ mensagem: error.message });
      }
      next(error);
    }
  }
}

export { MotoristaController };