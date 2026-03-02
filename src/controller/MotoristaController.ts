import { Motorista } from "../model/Motorista.js";
import { EnderecoController } from "./EnderecoController.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class MotoristaController extends Motorista {
  // LISTAR: Retorna os dados usando os Getters, sem expor a senha
  static async listar(req: Request, res: Response): Promise<Response> {
    try {
      const motoristas = await Motorista.listarMotoristas();

      if (!motoristas || motoristas.length === 0) {
        return res.status(200).json([]);
      }

      const dadosTratados = motoristas.map((m) => ({
        id: m.getIdMotorista(),
        nome: m.getNomeMotorista(),
        sobrenome: m.getSobrenomeMotorista(),
        cpf: m.getCpf(),
        cnh: m.getCnh(),
        dataNascimento: m.getDataNascimento(),
        celular: m.getCelular(),
        email: m.getEmail(),
        antecedentes: m.getAntecedentesCriminais(),
      }));

      return res.status(200).json(dadosTratados);
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro ao buscar lista de motoristas." });
    }
  }

  // LOGIN: Verifica email e senha (bcrypt)
  static async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, senha } = req.body;
      const motorista = await Motorista.buscarPorEmail(email);

      if (!motorista) {
        return res.status(401).json({ mensagem: "E-mail ou senha inválidos." });
      }

      const senhaValida = await bcrypt.compare(senha, motorista.getSenha());
      if (!senhaValida) {
        return res.status(401).json({ mensagem: "E-mail ou senha inválidos." });
      }

      // -- O JWT --
      const segredo = "PPL_ladygagasenha"; // No futuro, use .env
      const token = jwt.sign(
        {
          id: motorista.getIdMotorista(),
          email: motorista.getEmail(),
          tipo: "motorista",
        },
        segredo,
        { expiresIn: "1h" }, // O "acesso" expira em 1 hora
      );

      return res.status(200).json({
        mensagem: "Login realizado com sucesso!",
        token: token, // O motorista guarda esse token no celular/browser
        motorista: {
          id: motorista.getIdMotorista(),
          nome: motorista.getNomeMotorista(),
          sobrenome: motorista.getSobrenomeMotorista(),
        },
      });
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro interno." });
    }
  }

  // CADASTRO: Criptografa a senha antes de salvar
  static async cadastro(req: Request, res: Response): Promise<Response> {
    try {
      const { endereco, ...dadosMotorista } = req.body; // Separa os dados do endereço

      const salt = await bcrypt.genSalt(10);
      dadosMotorista.senha = await bcrypt.hash(dadosMotorista.senha, salt);

      // 1. Cadastra o motorista e pega o ID
      const idGerado = await Motorista.cadastrarMotorista(dadosMotorista);

      if (idGerado) {
        // 2. Cadastra o endereço usando o ID gerado
        const enderecoSucesso = await EnderecoController.cadastrarParaUsuario(
          idGerado,
          "motorista",
          endereco,
        );

        if (enderecoSucesso) {
          return res
            .status(201)
            .json({
              mensagem: "Motorista e Endereço cadastrados com sucesso!",
            });
        }
        return res
          .status(201)
          .json({ mensagem: "Motorista cadastrado, mas erro no endereço." });
      }
      return res.status(400).json({ mensagem: "Erro ao cadastrar motorista." });
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro ao processar cadastro." });
    }
  }
}

export { MotoristaController };
