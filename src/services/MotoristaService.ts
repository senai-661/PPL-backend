import bcrypt from "bcrypt";
import { MotoristaRepository } from "../repositories/MotoristaRepository.js";
import type { MotoristaDTO } from "../interface/MotoristaDTO.js";

export class MotoristaService {
  static async listar(idMotoristaQuery?: string): Promise<{ statusCode: number; data: any }> {
    if (idMotoristaQuery) {
      const id = Number(idMotoristaQuery);
      if (!isNaN(id)) {
        const motorista = await MotoristaRepository.buscarPorId(id);
        if (!motorista) {
          return { statusCode: 404, data: { mensagem: "Motorista não encontrado." } };
        }
        return {
          statusCode: 200,
          data: {
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
          },
        };
      }
    }

    const motoristas = await MotoristaRepository.listarMotoristas();

    if (!motoristas || motoristas.length === 0) {
      return { statusCode: 200, data: [] };
    }

    return { statusCode: 200, data: motoristas };
  }

  static async buscarPorId(idMotorista: number): Promise<{ statusCode: number; data: any }> {
    if (isNaN(idMotorista)) {
      return { statusCode: 400, data: { mensagem: "ID do motorista inválido." } };
    }

    const motorista = await MotoristaRepository.buscarPorId(idMotorista);

    if (!motorista) {
      return {
        statusCode: 404,
        data: { mensagem: "Motorista não encontrado." },
      };
    }

    return {
      statusCode: 200,
      data: {
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
      },
    };
  }

  static async perfil(idMotorista: number): Promise<{ statusCode: number; data: any }> {
    const motorista = await MotoristaRepository.buscarPorId(idMotorista);

    if (!motorista) {
      return {
        statusCode: 404,
        data: { mensagem: "Motorista não encontrado." },
      };
    }

    return {
      statusCode: 200,
      data: {
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
      },
    };
  }

  static async editarPerfil(
    idMotorista: number,
    dados: Partial<MotoristaDTO>
  ): Promise<{ statusCode: number; data: any }> {
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

    return {
      statusCode: 200,
      data: { mensagem: "Perfil atualizado com sucesso!" },
    };
  }

  static async alterarDisponibilidade(
    idMotorista: number,
    disponivel: any
  ): Promise<{ statusCode: number; data: any }> {
    if (typeof disponivel !== "boolean") {
      return {
        statusCode: 400,
        data: { mensagem: "Campo 'disponivel' deve ser true ou false." },
      };
    }

    const sucesso = await MotoristaRepository.alterarDisponibilidade(idMotorista, disponivel);

    if (!sucesso) {
      return {
        statusCode: 400,
        data: { mensagem: "Erro ao alterar disponibilidade." },
      };
    }

    return {
      statusCode: 200,
      data: {
        mensagem: disponivel ? "Você está online!" : "Você está offline!",
      },
    };
  }

  static async remover(idMotorista: number): Promise<{ statusCode: number; data: any }> {
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

    return {
      statusCode: 200,
      data: { mensagem: "Motorista excluído com sucesso." },
    };
  }
}
