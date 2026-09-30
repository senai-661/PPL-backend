import bcrypt from "bcrypt";
import { AdminRepository } from "../repositories/AdminRepository.js";
import { PassageiroRepository } from "../repositories/PassageiroRepository.js";
import { MotoristaRepository } from "../repositories/MotoristaRepository.js";

export class AdminService {
  static async listar(): Promise<{ statusCode: number; data: any }> {
    const admins = await AdminRepository.listarAdmins();

    if (!admins || admins.length === 0) {
      return { statusCode: 200, data: [] };
    }

    const dadosTratados = admins.map((a) => ({
      id: a.getIdAdmin(),
      nome: a.getNome(),
      sobrenome: a.getSobrenome(),
      email: a.getEmail(),
    }));

    return { statusCode: 200, data: dadosTratados };
  }

  static async dashboard(): Promise<{ statusCode: number; data: any }> {
    const dados = await AdminRepository.dashboard();
    if (!dados) {
      return {
        statusCode: 500,
        data: { mensagem: "Erro ao buscar dados do dashboard." },
      };
    }
    return { statusCode: 200, data: dados };
  }

  static async atualizarPassageiro(
    idPassageiro: number,
    dados: any
  ): Promise<{ statusCode: number; data: any }> {
    if (isNaN(idPassageiro)) {
      return { statusCode: 400, data: { mensagem: "ID do passageiro inválido." } };
    }

    const passageiro = await PassageiroRepository.buscarPorId(idPassageiro);
    if (!passageiro) {
      return { statusCode: 404, data: { mensagem: "Passageiro não encontrado." } };
    }

    if (dados.senha) {
      const salt = await bcrypt.genSalt(10);
      dados.senha = await bcrypt.hash(dados.senha, salt);
    }

    const sucesso = await PassageiroRepository.editarPerfil(idPassageiro, dados);
    if (!sucesso) {
      return {
        statusCode: 400,
        data: { mensagem: "Nenhum campo válido para atualizar." },
      };
    }

    return { statusCode: 200, data: { mensagem: "Passageiro atualizado com sucesso!" } };
  }

  static async atualizarMotorista(
    idMotorista: number,
    dados: any
  ): Promise<{ statusCode: number; data: any }> {
    if (isNaN(idMotorista)) {
      return { statusCode: 400, data: { mensagem: "ID do motorista inválido." } };
    }

    const motorista = await MotoristaRepository.buscarPorId(idMotorista);
    if (!motorista) {
      return { statusCode: 404, data: { mensagem: "Motorista não encontrado." } };
    }

    if (dados.senha) {
      const salt = await bcrypt.genSalt(10);
      dados.senha = await bcrypt.hash(dados.senha, salt);
    }

    const sucesso = await MotoristaRepository.editarPerfil(idMotorista, dados);
    if (!sucesso) {
      return {
        statusCode: 400,
        data: { mensagem: "Nenhum campo válido para atualizar." },
      };
    }

    return { statusCode: 200, data: { mensagem: "Motorista atualizado com sucesso!" } };
  }

  static async removerPassageiro(idPassageiro: number): Promise<{ statusCode: number; data: any }> {
    if (isNaN(idPassageiro)) {
      return { statusCode: 400, data: { mensagem: "ID do passageiro inválido." } };
    }

    const sucesso = await PassageiroRepository.deletarPassageiro(idPassageiro);
    if (!sucesso) {
      return {
        statusCode: 404,
        data: { mensagem: "Passageiro não encontrado ou não pôde ser excluído." },
      };
    }

    return { statusCode: 200, data: { mensagem: "Passageiro excluído com sucesso!" } };
  }

  static async removerMotorista(idMotorista: number): Promise<{ statusCode: number; data: any }> {
    if (isNaN(idMotorista)) {
      return { statusCode: 400, data: { mensagem: "ID do motorista inválido." } };
    }

    const sucesso = await MotoristaRepository.deletarMotorista(idMotorista);
    if (!sucesso) {
      return {
        statusCode: 404,
        data: { mensagem: "Motorista não encontrado ou não pôde ser excluído." },
      };
    }

    return { statusCode: 200, data: { mensagem: "Motorista excluído com sucesso!" } };
  }
}
