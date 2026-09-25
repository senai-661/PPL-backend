import bcrypt from "bcrypt";
import { UsuarioRepository } from "../repositories/UsuarioRepository.js";
import { AuthService } from "./AuthService.js";
import { Passageiro } from "../models/Passageiro.js";
import { Motorista } from "../models/Motorista.js";

export interface ServiceResult<T = any> {
  statusCode: number;
  data: {
    mensagem?: string;
    token?: string;
    usuario?: any;
    [key: string]: any;
  };
}

export class UsuarioService {
  static async login(email: string, senha: string): Promise<ServiceResult> {
    const usuario = await UsuarioRepository.login(email);

    if (!usuario || !(await AuthService.compararSenha(senha, usuario.senha))) {
      return {
        statusCode: 401,
        data: { mensagem: "E-mail ou senha inválidos." },
      };
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
        return {
          statusCode: 400,
          data: { mensagem: "Tipo de usuário inválido." },
        };
    }

    const token = AuthService.gerarToken({
      id,
      email: usuario.email,
      tipo: usuario.tipo_usuario,
    });

    return {
      statusCode: 200,
      data: {
        mensagem: "Login realizado com sucesso!",
        token,
        usuario: dadosRetorno,
      },
    };
  }

  static async registrar(dadosBody: any): Promise<ServiceResult> {
    const { tipo, endereco, ...dados } = dadosBody;

    if (!tipo || !["passageiro", "motorista"].includes(tipo)) {
      return {
        statusCode: 400,
        data: { mensagem: "Tipo inválido. Use 'passageiro' ou 'motorista'." },
      };
    }

    const camposObrigatorios = [
      "nome", "sobrenome", "cpf", "dataNascimento", "celular", "email", "senha",
    ];
    if (tipo === "motorista") {
      camposObrigatorios.push("cnh", "antecedentesCriminais");
    }

    if (camposObrigatorios.some((campo) => !dados[campo]?.toString().trim())) {
      return {
        statusCode: 400,
        data: { mensagem: "Preencha todos os campos obrigatórios." },
      };
    }

    if (!/^\d{11}$/.test(dados.cpf)) {
      return {
        statusCode: 400,
        data: { mensagem: "CPF deve conter 11 dígitos." },
      };
    }

    if (tipo === "motorista" && !/^\d{11}$/.test(dados.cnh)) {
      return {
        statusCode: 400,
        data: { mensagem: "CNH deve conter 11 dígitos." },
      };
    }

    if (dados.senha.length < 6) {
      return {
        statusCode: 400,
        data: { mensagem: "A senha deve ter ao menos 6 caracteres." },
      };
    }

    const necessidadesValidas = ["Cadeirante", "Deficiência Auditiva", "Deficiência Visual"];
    if (
      dados.necessidades !== undefined &&
      (!Array.isArray(dados.necessidades) ||
        dados.necessidades.some((necessidade: string) => !necessidadesValidas.includes(necessidade)))
    ) {
      return {
        statusCode: 400,
        data: { mensagem: "Necessidade de acessibilidade inválida." },
      };
    }

    const especializacoesValidas = ["NENHUMA", "MOBILIDADE REDUZIDA", "LIBRAS", "DEFICIÊNCIA VISUAL"];
    if (tipo === "motorista") {
      dados.especializacao = (dados.especializacao || "NENHUMA").toUpperCase();
      if (!especializacoesValidas.includes(dados.especializacao)) {
        return {
          statusCode: 400,
          data: { mensagem: "Especialização inválida." },
        };
      }
    }

    const salt = await bcrypt.genSalt(10);
    dados.senha = await bcrypt.hash(dados.senha, salt);

    let idGerado: number | null = null;

    if (tipo === "passageiro") {
      idGerado = await Passageiro.cadastrarPassageiro(dados, endereco);
    } else {
      idGerado = await Motorista.cadastrarMotorista(dados, endereco);
    }

    if (!idGerado) {
      return {
        statusCode: 400,
        data: { mensagem: `Erro ao cadastrar ${tipo}.` },
      };
    }

    return {
      statusCode: 201,
      data: { mensagem: `${tipo} cadastrado com sucesso!` },
    };
  }
}
