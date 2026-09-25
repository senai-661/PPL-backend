import { UsuarioRepository } from "../repository/UsuarioRepository.js";
import { AuthService } from "./AuthService.js";
import { PassageiroRepository } from "../repository/PassageiroRepository.js";
import { MotoristaRepository } from "../repository/MotoristaRepository.js";

export class UsuarioService {
  static async login(email: string, senha: string): Promise<{ token: string; usuario: any }> {
    if (!email || !senha) {
      throw new Error("E-mail e senha são obrigatórios.");
    }

    const usuario = await UsuarioRepository.buscarParaLogin(email);

    if (!usuario || !(await AuthService.compararSenha(senha, usuario.senha))) {
      const err: any = new Error("E-mail ou senha inválidos.");
      err.status = 401;
      throw err;
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
      default: {
        const err: any = new Error("Tipo de usuário inválido.");
        err.status = 400;
        throw err;
      }
    }

    const token = AuthService.gerarToken({
      id,
      email: usuario.email,
      tipo: usuario.tipo_usuario,
    });

    return {
      token,
      usuario: dadosRetorno,
    };
  }

  static async registrar(dadosCompletos: any): Promise<number | null> {
    const { tipo, endereco, ...dados } = dadosCompletos;

    if (!tipo || !["passageiro", "motorista"].includes(tipo)) {
      throw new Error("Tipo inválido. Use 'passageiro' ou 'motorista'.");
    }

    const camposObrigatorios = [
      "nome", "sobrenome", "cpf", "dataNascimento", "celular", "email", "senha",
    ];
    if (tipo === "motorista") {
      camposObrigatorios.push("cnh", "antecedentesCriminais");
    }

    if (camposObrigatorios.some((campo) => !dados[campo]?.toString().trim())) {
      throw new Error("Preencha todos os campos obrigatórios.");
    }

    if (!/^\d{11}$/.test(dados.cpf)) {
      throw new Error("CPF deve conter 11 dígitos.");
    }

    if (tipo === "motorista" && !/^\d{11}$/.test(dados.cnh)) {
      throw new Error("CNH deve conter 11 dígitos.");
    }

    if (dados.senha.length < 6) {
      throw new Error("A senha deve ter ao menos 6 caracteres.");
    }

    const necessidadesValidas = ["Cadeirante", "Deficiência Auditiva", "Deficiência Visual"];
    if (
      dados.necessidades !== undefined &&
      (!Array.isArray(dados.necessidades) ||
        dados.necessidades.some((necessidade: string) => !necessidadesValidas.includes(necessidade)))
    ) {
      throw new Error("Necessidade de acessibilidade inválida.");
    }

    const especializacoesValidas = ["NENHUMA", "MOBILIDADE REDUZIDA", "LIBRAS", "DEFICIÊNCIA VISUAL"];
    if (tipo === "motorista") {
      dados.especializacao = (dados.especializacao || "NENHUMA").toUpperCase();
      if (!especializacoesValidas.includes(dados.especializacao)) {
        throw new Error("Especialização inválida.");
      }
    }

    dados.senha = await AuthService.hashSenha(dados.senha);

    let idGerado: number | null = null;
    if (tipo === "passageiro") {
      idGerado = await PassageiroRepository.cadastrarPassageiro(dados, endereco);
    } else {
      idGerado = await MotoristaRepository.cadastrarMotorista(dados, endereco);
    }

    if (!idGerado) {
      throw new Error(`Erro ao cadastrar ${tipo}.`);
    }

    return idGerado;
  }
}
