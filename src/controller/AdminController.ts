import type { Request, Response } from "express";
import { Admin } from "../model/Admin.js";

export class AdminController {

  static async listar(req: Request, res: Response): Promise<Response> {
    try {
      const admins = await Admin.listarAdmins();

      if (!admins || admins.length === 0) {
        return res.status(200).json([]);
      }

      const dadosTratados = admins.map((a) => ({
        id: a.getIdAdmin(),      // ✅ was a.getId()
        nome: a.getNome(),       // ✅ inherited
        sobrenome: a.getSobrenome(), // ✅ inherited
        email: a.getEmail(),
      }));

      return res.status(200).json(dadosTratados);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ mensagem: "Erro ao buscar lista de administradores." });
    }
  }

  static async dashboard(req: Request, res: Response): Promise<Response> {
    try {
      const dados = await Admin.dashboard();
      if (!dados) {
        return res.status(500).json({ mensagem: "Erro ao buscar dados do dashboard." });
      }
      return res.status(200).json(dados);
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro interno no dashboard." });
    }
  }
}