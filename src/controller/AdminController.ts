import type { Request, Response, NextFunction } from "express";
import { AdminService } from "../services/AdminService.js";

export class AdminController {
  static async listar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const dados = await AdminService.listar();
      return res.status(200).json(dados);
    } catch (error) {
      next(error);
    }
  }

  static async dashboard(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const dados = await AdminService.dashboard();
      if (!dados) {
        return res.status(500).json({ mensagem: "Erro ao buscar dados do dashboard." });
      }
      return res.status(200).json(dados);
    } catch (error) {
      next(error);
    }
  }

  static async atualizarPassageiro(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = parseInt(req.params.id as string, 10);
      if (isNaN(idPassageiro)) {
        return res.status(400).json({ mensagem: "ID do passageiro inválido." });
      }

      const sucesso = await AdminService.atualizarPassageiro(idPassageiro, req.body);
      if (!sucesso) {
        return res.status(400).json({ mensagem: "Nenhum campo válido para atualizar." });
      }

      return res.status(200).json({ mensagem: "Passageiro atualizado com sucesso!" });
    } catch (error: any) {
      if (error.status === 404) {
        return res.status(404).json({ mensagem: error.message });
      }
      if (error.message) {
        return res.status(400).json({ mensagem: error.message });
      }
      next(error);
    }
  }

  static async atualizarMotorista(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idMotorista = parseInt(req.params.id as string, 10);
      if (isNaN(idMotorista)) {
        return res.status(400).json({ mensagem: "ID do motorista inválido." });
      }

      const sucesso = await AdminService.atualizarMotorista(idMotorista, req.body);
      if (!sucesso) {
        return res.status(400).json({ mensagem: "Nenhum campo válido para atualizar." });
      }

      return res.status(200).json({ mensagem: "Motorista atualizado com sucesso!" });
    } catch (error: any) {
      if (error.status === 404) {
        return res.status(404).json({ mensagem: error.message });
      }
      if (error.message) {
        return res.status(400).json({ mensagem: error.message });
      }
      next(error);
    }
  }

  static async removerPassageiro(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = parseInt(req.params.id as string, 10);
      if (isNaN(idPassageiro)) {
        return res.status(400).json({ mensagem: "ID do passageiro inválido." });
      }

      const sucesso = await AdminService.removerPassageiro(idPassageiro);
      if (!sucesso) {
        return res.status(404).json({ mensagem: "Passageiro não encontrado ou não pôde ser excluído." });
      }

      return res.status(200).json({ mensagem: "Passageiro excluído com sucesso!" });
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ mensagem: error.message });
      }
      next(error);
    }
  }

  static async removerMotorista(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idMotorista = parseInt(req.params.id as string, 10);
      if (isNaN(idMotorista)) {
        return res.status(400).json({ mensagem: "ID do motorista inválido." });
      }

      const sucesso = await AdminService.removerMotorista(idMotorista);
      if (!sucesso) {
        return res.status(404).json({ mensagem: "Motorista não encontrado ou não pôde ser excluído." });
      }

      return res.status(200).json({ mensagem: "Motorista excluído com sucesso!" });
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ mensagem: error.message });
      }
      next(error);
    }
  }
}