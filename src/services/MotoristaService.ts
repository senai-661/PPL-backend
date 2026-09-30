import { MotoristaRepository } from "../repository/MotoristaRepository.js";
import { AuthService } from "./AuthService.js";
import type { MotoristaDTO } from "../interface/MotoristaDTO.js";

export class MotoristaService {
  static async listar(idMotorista?: number): Promise<any> {
    if (idMotorista && !isNaN(idMotorista)) {
      const motorista = await MotoristaRepository.buscarPorId(idMotorista);
      if (!motorista) return null;
      return {
        idMotorista: motorista.getIdMotorista(),
        nome: motorista.getNome(),
        sobrenome: motorista.getSobrenome(),
        cpf: motorista.getCpf(),
        cnh: motorista.getCnh(),
        dataNascimento: motorista.getDataNascimento(),
        celular: motorista.getCelular(),
        email: motorista.getEmail(),
        antecedentesCriminais: motorista.getAntecedentesCriminais(),
        especializacao: motorista.getEspecializacao(),
        disponivel: motorista.getDisponivel(),
      };
    }

    const motoristas = await MotoristaRepository.listarMotoristas();
    return motoristas ?? [];
  }

  static async buscarPorId(idMotorista: number): Promise<any | null> {
    if (isNaN(idMotorista)) {
      throw new Error("ID do motorista inválido.");
    }

    const motorista = await MotoristaRepository.buscarPorId(idMotorista);
    if (!motorista) return null;

    return {
      idMotorista: motorista.getIdMotorista(),
      id: motorista.getIdMotorista(),
      nome: motorista.getNome(),
      sobrenome: motorista.getSobrenome(),
      cpf: motorista.getCpf(),
      cnh: motorista.getCnh(),
      dataNascimento: motorista.getDataNascimento(),
      celular: motorista.getCelular(),
      email: motorista.getEmail(),
      antecedentesCriminais: motorista.getAntecedentesCriminais(),
      especializacao: motorista.getEspecializacao(),
      disponivel: motorista.getDisponivel(),
    };
  }

  static async obterPerfil(idMotorista: number): Promise<any | null> {
    const motorista = await MotoristaRepository.buscarPorId(idMotorista);
    if (!motorista) return null;

    return {
      id: motorista.getIdMotorista(),
      nome: motorista.getNome(),
      sobrenome: motorista.getSobrenome(),
      cpf: motorista.getCpf(),
      cnh: motorista.getCnh(),
      dataNascimento: motorista.getDataNascimento(),
      celular: motorista.getCelular(),
      email: motorista.getEmail(),
      especializacao: motorista.getEspecializacao(),
      disponivel: motorista.getDisponivel(),
    };
  }

  static async editarPerfil(idMotorista: number, dados: Partial<MotoristaDTO>): Promise<boolean> {
    if (dados.senha) {
      dados.senha = await AuthService.hashSenha(dados.senha);
    }
    return await MotoristaRepository.editarPerfil(idMotorista, dados);
  }

  static async alterarDisponibilidade(idMotorista: number, disponivel: boolean): Promise<boolean> {
    if (typeof disponivel !== "boolean") {
      throw new Error("Campo 'disponivel' deve ser true ou false.");
    }
    return await MotoristaRepository.alterarDisponibilidade(idMotorista, disponivel);
  }

  static async remover(idMotorista: number): Promise<boolean> {
    if (isNaN(idMotorista)) {
      throw new Error("ID do motorista inválido.");
    }
    return await MotoristaRepository.deletarMotorista(idMotorista);
  }
}
