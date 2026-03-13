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

  static async register(req: Request, res: Response): Promise<Response> {
    try {
      const { endereco, ...dadosPassageiro } = req.body;

      const salt = await bcrypt.genSalt(10);
      dadosPassageiro.senha = await bcrypt.hash(dadosPassageiro.senha, salt);

      const idGerado = await Passageiro.cadastrarPassageiro(dadosPassageiro);

      if (idGerado) {
        const enderecoSucesso = await EnderecoController.cadastrarParaUsuario(
          idGerado, "passageiro", endereco,
        );

        if (enderecoSucesso) {
          return res.status(201).json({ mensagem: "Passageiro e endereço cadastrados com sucesso!" });
        }
        return res.status(201).json({ mensagem: "Passageiro cadastrado, mas houve um erro ao salvar o endereço." });
      }

      return res.status(400).json({ mensagem: "Erro ao cadastrar passageiro no banco." });
    } catch (error) {
      console.error(`Erro no processo de cadastro: ${error}`);
      return res.status(500).json({ mensagem: "Não foi possível inserir o passageiro." });
    }
  }

  static async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, senha } = req.body;
      const passageiro = await Passageiro.buscarPorEmail(email);

      if (!passageiro || !(await AuthService.compararSenha(senha, passageiro.getSenha()))) {
        return res.status(401).json({ mensagem: "E-mail ou senha inválidos." });
      }

      const token = AuthService.gerarToken({
        id: passageiro.getIdPassageiro(),
        email: passageiro.getEmail(),
        tipo: "passageiro",
      });

      return res.status(200).json({
        mensagem: "Login realizado com sucesso!",
        token,
        passageiro: {
          id: passageiro.getIdPassageiro(),
          nome: passageiro.getNome(),           // ✅
          sobrenome: passageiro.getSobrenome(), // ✅
        },
      });
    } catch (error) {
      console.error(`Erro no login: ${error}`);
      return res.status(500).json({ mensagem: "Erro interno ao tentar fazer login." });
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