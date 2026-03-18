import type { Request, Response, NextFunction } from "express";
import { Admin } from "../model/Admin.js";

export class AdminController {
  static async listar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const admins = await Admin.listarAdmins();

      if (!admins || admins.length === 0) {
        return res.status(200).json([]);
      }

      const dadosTratados = admins.map((a) => ({
        id: a.getIdAdmin(),
        nome: a.getNome(),
        sobrenome: a.getSobrenome(),
        email: a.getEmail(),
      }));

      return res.status(200).json(dadosTratados);
    } catch (error) {
      next(error);
    }
  }

  static async dashboard(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const dados = await Admin.dashboard();
      if (!dados) {
        return res.status(500).json({ mensagem: "Erro ao buscar dados do dashboard." });
      }
      return res.status(200).json(dados);
    } catch (error) {
      next(error);
    }
  }
}