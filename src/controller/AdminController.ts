import type { Request, Response } from "express";
import { Admin } from "../model/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SEGREDO = "PPL_ladygagasenha";

export class AdminController {
  static async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, senha } = req.body;
      const admin = await Admin.buscarPorEmail(email);

      if (!admin) {
        return res
          .status(401)
          .json({ mensagem: "Credenciais de administrador inválidas." });
      }

      const senhaValida = await bcrypt.compare(senha, admin.getSenha());
      if (!senhaValida) {
        return res
          .status(401)
          .json({ mensagem: "Credenciais de administrador inválidas." });
      }

      // TOKEN COM TIPO ADMIN
      const token = jwt.sign(
        {
          id: admin.getId(),
          email: admin.getEmail(),
          tipo: "admin", // <-- O Middleware vai checar isso!
        },
        SEGREDO,
        { expiresIn: "4h" },
      );

      return res.status(200).json({
        mensagem: "Bem-vindo, Administrador!",
        token: token,
        admin: { nome: admin.getNome(), email: admin.getEmail() },
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

      // Removemos a senha antes de enviar para o Front-end
      const dadosTratados = admins.map((a) => ({
        id: a.getId(),
        nome: a.getNome(),
        email: a.getEmail(),
      }));

      return res.status(200).json(dadosTratados);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ mensagem: "Erro ao buscar lista de administradores." });
    }
  }
  static async dashboard(req: Request, res: Response): Promise<Response> {
    try {
      const dados = await Admin.dashboard();
      if (!dados) {
        return res
          .status(500)
          .json({ mensagem: "Erro ao buscar dados do dashboard." });
      }
      return res.status(200).json(dados);
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro interno no dashboard." });
    }
  }
}
