import { Passageiro } from "../model/Passageiro.js";
import { EnderecoController } from "./EnderecoController.js";
import { AuthService } from "../services/AuthService.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";

class PassageiroController {
  static async listar(req: Request, res: Response): Promise<Response> {
    try {
      const passageiros = await Passageiro.listarPassageiros();

      if (!passageiros || passageiros.length === 0) {
        return res.status(200).json([]);
      }

      const dadosTratados = passageiros.map((p) => ({
        id: p.getIdPassageiro(),
        nome: p.getNome(),           // ✅ from Usuario
        sobrenome: p.getSobrenome(), // ✅ from Usuario
        cpf: p.getCpf(),
        dataNascimento: p.getDataNascimento(),
        celular: p.getCelular(),
        email: p.getEmail(),
        necessidades: p.getNecessidades(),
        tipoViagem: p.getTipoViagem(),
        preferenciaClima: p.getPreferenciaClima(),
      }));

      return res.status(200).json(dadosTratados);
    } catch (error) {
      console.error(`Erro ao consultar modelo: ${error}`);
      return res.status(500).json({ mensagem: "Não foi possível acessar a lista de passageiros." });
    }
  }

  static async perfil(req: Request, res: Response): Promise<Response> {
    try {
      const idPassageiro = (req as any).usuario.id;
      const passageiro = await Passageiro.buscarPorId(idPassageiro);

      if (!passageiro) {
        return res.status(404).json({ mensagem: "Passageiro não encontrado." });
      }

      return res.status(200).json({
        id: passageiro.getIdPassageiro(),
        nome: passageiro.getNome(),           // ✅
        sobrenome: passageiro.getSobrenome(), // ✅
        cpf: passageiro.getCpf(),
        dataNascimento: passageiro.getDataNascimento(),
        celular: passageiro.getCelular(),
        email: passageiro.getEmail(),
        necessidades: passageiro.getNecessidades(),
        tipoViagem: passageiro.getTipoViagem(),
        preferenciaClima: passageiro.getPreferenciaClima(),
      });
    } catch (error) {
      console.error(`Erro ao buscar perfil: ${error}`);
      return res.status(500).json({ mensagem: "Erro ao buscar perfil." });
    }
  }

  static async editarPerfil(req: Request, res: Response): Promise<Response> {
    try {
      const idPassageiro = (req as any).usuario.id;
      const dados = req.body;

      if (dados.senha) {
        const salt = await bcrypt.genSalt(10);
        dados.senha = await bcrypt.hash(dados.senha, salt);
      }

      const sucesso = await Passageiro.editarPerfil(idPassageiro, dados);
      if (!sucesso) {
        return res.status(400).json({ mensagem: "Nenhum campo válido para atualizar." });
      }

      return res.status(200).json({ mensagem: "Perfil atualizado com sucesso!" });
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro ao atualizar perfil." });
    }
  }
}

export { PassageiroController };