import type { Request, Response, NextFunction } from "express";
import { Admin } from "../model/Admin.js";
import { Passageiro } from "../model/Passageiro.js";
import { Motorista } from "../model/Motorista.js";
import { Veiculo } from "../model/Veiculo.js";
import { DatabaseModel } from "../model/DatabaseModel.js";
import bcrypt from "bcrypt";

const database = new DatabaseModel().pool;

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

  static async atualizarPassageiro(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = parseInt(req.params.id as string);
      if (isNaN(idPassageiro)) {
        return res.status(400).json({ mensagem: "ID do passageiro inválido." });
      }

      const passageiro = await Passageiro.buscarPorId(idPassageiro);
      if (!passageiro) {
        return res.status(404).json({ mensagem: "Passageiro não encontrado." });
      }

      const dados = req.body;

      if (dados.senha) {
        const salt = await bcrypt.genSalt(10);
        dados.senha = await bcrypt.hash(dados.senha, salt);
      }

      const sucesso = await Passageiro.editarPerfil(idPassageiro, dados);
      if (!sucesso) {
        return res.status(400).json({ mensagem: "Nenhum campo válido para atualizar." });
      }

      return res.status(200).json({ mensagem: "Passageiro atualizado com sucesso!" });
    } catch (error) {
      next(error);
    }
  }

  static async atualizarMotorista(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idMotorista = parseInt(req.params.id as string);
      if (isNaN(idMotorista)) {
        return res.status(400).json({ mensagem: "ID do motorista inválido." });
      }

      const motorista = await Motorista.buscarPorId(idMotorista);
      if (!motorista) {
        return res.status(404).json({ mensagem: "Motorista não encontrado." });
      }

      const dados = req.body;

      if (dados.senha) {
        const salt = await bcrypt.genSalt(10);
        dados.senha = await bcrypt.hash(dados.senha, salt);
      }

      const sucesso = await Motorista.editarPerfil(idMotorista, dados);
      if (!sucesso) {
        return res.status(400).json({ mensagem: "Nenhum campo válido para atualizar." });
      }

      return res.status(200).json({ mensagem: "Motorista atualizado com sucesso!" });
    } catch (error) {
      next(error);
    }
  }

  static async excluirPassageiro(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = parseInt(req.params.id as string);
      if (isNaN(idPassageiro)) {
        return res.status(400).json({ mensagem: "ID do passageiro inválido." });
      }

      const passageiro = await Passageiro.buscarPorId(idPassageiro);
      if (!passageiro) {
        return res.status(404).json({ mensagem: "Passageiro não encontrado." });
      }

      const resultado = await database.query(
        `DELETE FROM usuario
         WHERE id_usuario = (
           SELECT id_usuario FROM passageiro WHERE id_passageiro = $1
         ) RETURNING id_usuario;`,
        [idPassageiro],
      );

      if (resultado.rowCount === 0) {
        return res.status(400).json({ mensagem: "Não foi possível excluir o passageiro." });
      }

      return res.status(200).json({ mensagem: "Passageiro excluído com sucesso!" });
    } catch (error) {
      next(error);
    }
  }

  static async excluirMotorista(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idMotorista = parseInt(req.params.id as string);
      if (isNaN(idMotorista)) {
        return res.status(400).json({ mensagem: "ID do motorista inválido." });
      }

      const motorista = await Motorista.buscarPorId(idMotorista);
      if (!motorista) {
        return res.status(404).json({ mensagem: "Motorista não encontrado." });
      }

      const resultado = await database.query(
        `DELETE FROM usuario
         WHERE id_usuario = (
           SELECT id_usuario FROM motorista WHERE id_motorista = $1
         ) RETURNING id_usuario;`,
        [idMotorista],
      );

      if (resultado.rowCount === 0) {
        return res.status(400).json({ mensagem: "Não foi possível excluir o motorista." });
      }

      return res.status(200).json({ mensagem: "Motorista excluído com sucesso!" });
    } catch (error) {
      next(error);
    }
  }

  static async atualizarVeiculo(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idVeiculo = parseInt(req.params.id as string);
      if (isNaN(idVeiculo)) {
        return res.status(400).json({ mensagem: "ID do veículo inválido." });
      }

      const veiculo = await Veiculo.buscarPorId(idVeiculo);
      if (!veiculo) {
        return res.status(404).json({ mensagem: "Veículo não encontrado." });
      }

      const sucesso = await Veiculo.editarVeiculo(idVeiculo, req.body);
      if (!sucesso) {
        return res.status(400).json({ mensagem: "Nenhum campo válido para atualizar." });
      }

      return res.status(200).json({ mensagem: "Veículo atualizado com sucesso!" });
    } catch (error) {
      next(error);
    }
  }

  static async excluirVeiculo(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idVeiculo = parseInt(req.params.id as string);
      if (isNaN(idVeiculo)) {
        return res.status(400).json({ mensagem: "ID do veículo inválido." });
      }

      const veiculo = await Veiculo.buscarPorId(idVeiculo);
      if (!veiculo) {
        return res.status(404).json({ mensagem: "Veículo não encontrado." });
      }

      const sucesso = await Veiculo.excluirVeiculo(idVeiculo);
      if (!sucesso) {
        return res.status(400).json({ mensagem: "Não foi possível excluir o veículo." });
      }

      return res.status(200).json({ mensagem: "Veículo excluído com sucesso!" });
    } catch (error) {
      next(error);
    }
  }
}