import type { Request, Response } from "express";
import { Admin } from "../model/Admin.js";
import { AuthService } from "../services/AuthService.js";

export class AdminController {
  static async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, senha } = req.body;
      const admin = await Admin.buscarPorEmail(email);

      if (!admin || !(await AuthService.compararSenha(senha, admin.getSenha()))) {
        return res.status(401).json({ mensagem: "Credenciais de administrador inválidas." });
      }

      const token = AuthService.gerarToken({
        id: admin.getIdAdmin(), // ✅ was a.getId()
        email: admin.getEmail(),
        tipo: "admin",
      });

      return res.status(200).json({
        mensagem: "Bem-vindo, Administrador!",
        token,
        admin: {
          nome: admin.getNome(),     // ✅ inherited from Usuario
          email: admin.getEmail(),
        },
      });
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro no login do admin." });
    }
  }

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