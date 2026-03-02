import { Passageiro } from "../model/Passageiro.js";
import { EnderecoController } from "./EnderecoController.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class PassageiroController extends Passageiro {
  // LISTAR: Usa os getters para retornar um JSON limpo
  static async listar(req: Request, res: Response): Promise<Response> {
    try {
      const passageiros = await Passageiro.listarPassageiros();

      if (!passageiros || passageiros.length === 0) {
        return res.status(200).json([]);
      }

      // Mapeamos para não expor a senha e usar nomes bonitos no JSON
      const dadosTratados = passageiros.map((p) => ({
        id: p.getIdPassageiro(),
        nome: p.getNomePassageiro(),
        sobrenome: p.getSobrenomePassageiro(),
        cpf: p.getCpf(),
        dataNascimento: p.getDataNascimento(),
        celular: p.getCelular(),
        email: p.getEmail(),
      }));

      return res.status(200).json(dadosTratados);
    } catch (error) {
      console.error(`Erro ao consultar modelo: ${error}`);
      return res
        .status(500)
        .json({ mensagem: "Não foi possível acessar a lista de passageiros." });
    }
  }

  // CADASTRO: Criptografa senha e salva endereço "casado"
  static async register(req: Request, res: Response): Promise<Response> {
    try {
      // Desestruturamos para separar o endereço do resto dos dados
      const { endereco, ...dadosPassageiro } = req.body;

      // 1. Criptografia da senha
      const salt = await bcrypt.genSalt(10);
      dadosPassageiro.senha = await bcrypt.hash(dadosPassageiro.senha, salt);

      // 2. Salva o passageiro e recupera o ID gerado (RETURNING id_passageiro)
      const idGerado = await Passageiro.cadastrarPassageiro(dadosPassageiro);

      if (idGerado) {
        // 3. Salva o endereço vinculado ao ID do passageiro
        const enderecoSucesso = await EnderecoController.cadastrarParaUsuario(
          idGerado,
          "passageiro",
          endereco,
        );

        if (enderecoSucesso) {
          return res.status(201).json({
            mensagem: "Passageiro e endereço cadastrados com sucesso!",
          });
        }

        // Caso o passageiro grave mas o endereço falhe (raro, mas possível)
        return res.status(201).json({
          mensagem:
            "Passageiro cadastrado, mas houve um erro ao salvar o endereço.",
        });
      }

      return res
        .status(400)
        .json({ mensagem: "Erro ao cadastrar passageiro no banco." });
    } catch (error) {
      console.error(`Erro no processo de cadastro: ${error}`);
      return res
        .status(500)
        .json({ mensagem: "Não foi possível inserir o passageiro." });
    }
  }

  static async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, senha } = req.body;
      const passageiro = await Passageiro.buscarPorEmail(email);

      if (!passageiro) {
        return res.status(404).json({ mensagem: "E-mail ou senha inválidos." });
      }

      const senhaValida = await bcrypt.compare(senha, passageiro.getSenha());

      if (!senhaValida) {
        return res.status(401).json({ mensagem: "E-mail ou senha inválidos." });
      }
      const segredo = "PPL_ladygagasenha";
      const token = jwt.sign(
        {
          id: passageiro.getIdPassageiro(),
          email: passageiro.getEmail(),
          tipo: "passageiro",
        },
        segredo,
        { expiresIn: "1h" },
      );
      return res.status(200).json({
        mensagem: "Login realizado com sucesso!",
        token: token,
        passageiro: {
          id: passageiro.getIdPassageiro(),
          nome: passageiro.getNomePassageiro(),
          sobrenome: passageiro.getSobrenomePassageiro(),
        },
      });
    } catch (error) {
      console.error(`Erro no login: ${error}`);
      return res
        .status(500)
        .json({ mensagem: "Erro interno ao tentar fazer login." });
    }
  }
}

export { PassageiroController };
