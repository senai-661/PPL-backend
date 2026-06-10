import type { Request, Response, NextFunction } from "express";
import { Usuario } from "../model/Usuario.js";
import { AuthService } from "../services/AuthService.js";
import { DatabaseModel } from "../model/DatabaseModel.js";
import bcrypt from "bcrypt";
 
const database = new DatabaseModel().pool;
 
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
 
      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(dados.senha, salt);
 
      if (tipo === "passageiro") {
        await database.query(
          `CALL sp_cadastrar_passageiro(
            $1, $2, $3, $4, $5, $6, $7, $8,
            $9, $10, $11, $12, $13, $14, $15, NULL
          )`,
          [
            dados.nome,
            dados.sobrenome,
            dados.email,
            senhaHash,
            dados.cpf,
            dados.celular,
            dados.dataNascimento,
            dados.necessidades ?? [],
            endereco?.rua        ?? null,
            endereco?.numero     ?? null,
            endereco?.bairro     ?? null,
            endereco?.cidade     ?? null,
            endereco?.estado     ?? null,
            endereco?.cep        ?? null,
            endereco?.complemento ?? null,
          ],
        );
      } else {
        await database.query(
          `CALL sp_cadastrar_motorista(
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15, $16, $17, NULL
          )`,
          [
            dados.nome,
            dados.sobrenome,
            dados.email,
            senhaHash,
            dados.cpf,
            dados.cnh,
            dados.celular,
            dados.dataNascimento,
            dados.antecedentesCriminais,
            dados.especializacao ?? "Nenhuma",
            endereco?.rua         ?? null,
            endereco?.numero      ?? null,
            endereco?.bairro      ?? null,
            endereco?.cidade      ?? null,
            endereco?.estado      ?? null,
            endereco?.cep         ?? null,
            endereco?.complemento ?? null,
          ],
        );
      }
 
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