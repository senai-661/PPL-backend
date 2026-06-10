import type { Request, Response, NextFunction } from "express";
import { Usuario } from "../model/Usuario.js";
import { AuthService } from "../services/AuthService.js";
import bcrypt from "bcrypt";
import { Passageiro } from "../model/Passageiro.js";
import { Motorista } from "../model/Motorista.js";

export class UsuarioController {
 
  static async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { email, senha } = req.body;
 
      const usuario = await Usuario.login(email);
 
      if (!usuario || !(await AuthService.compararSenha(senha, usuario.senha))) {
        return res.status(401).json({ mensagem: "E-mail ou senha inválidos." });
      }
 
      let id: number;
      let dadosRetorno: any;
 
      switch (usuario.tipo_usuario) {
        case "passageiro":
          id = usuario.id_passageiro;
          dadosRetorno = { id, nome: usuario.nome, sobrenome: usuario.sobrenome, tipo: "passageiro" };
          break;
        case "motorista":
          id = usuario.id_motorista;
          dadosRetorno = { id, nome: usuario.nome, sobrenome: usuario.sobrenome, tipo: "motorista" };
          break;
        case "admin":
          id = usuario.id_admin;
          dadosRetorno = { id, nome: usuario.nome, sobrenome: usuario.sobrenome, tipo: "admin" };
          break;
        default:
          return res.status(400).json({ mensagem: "Tipo de usuário inválido." });
      }
 
      const token = AuthService.gerarToken({
        id,
        email: usuario.email,
        tipo: usuario.tipo_usuario,
      });
 
      return res.status(200).json({
        mensagem: "Login realizado com sucesso!",
        token,
        usuario: dadosRetorno,
      });
    } catch (error) {
      next(error);
    }
  }
  static async registrar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { tipo, endereco, ...dados } = req.body;
 
      if (!tipo || !["passageiro", "motorista"].includes(tipo)) {
        return res.status(400).json({ mensagem: "Tipo inválido. Use 'passageiro' ou 'motorista'." });
      }
 
      if (!dados.senha) {
        return res.status(400).json({ mensagem: "Senha é obrigatória." });
      }
 
      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(dados.senha, salt);
      dados.senha = senhaHash;
      let idGerado: number | undefined;
 
      if (tipo === "passageiro") {
        idGerado = await Passageiro.cadastrarPassageiro(dados, endereco);
      } else {
        idGerado = await Motorista.cadastrarMotorista(dados, endereco);
      }

      if (!idGerado) {
        return res.status(400).json({ mensagem: `Erro ao cadastrar ${tipo}.` });
      }
      // O endereço já é tratado pela stored procedure quando fornecido

      return res.status(201).json({ mensagem: `${tipo} cadastrado com sucesso!` });
    } catch (error: any) {
      // Erros de validação lançados pela SP chegam aqui
      if (error.message) {
        return res.status(400).json({ mensagem: error.message });
      }
      next(error);
    }
  }
}