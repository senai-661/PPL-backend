import bcrypt from "bcrypt";
import { PassageiroRepository } from "../repositories/PassageiroRepository.js";
import type { PassageiroDTO } from "../interface/PassageiroDTO.js";

export class PassageiroService {
  static async listar(idPassageiroQuery?: string): Promise<{ statusCode: number; data: any }> {
    if (idPassageiroQuery) {
      const id = parseInt(idPassageiroQuery, 10);
      if (!isNaN(id)) {
        const passageiro = await PassageiroRepository.buscarPorId(id);
        if (!passageiro) {
          return { statusCode: 404, data: { mensagem: "Passageiro não encontrado." } };
        }
        return {
          statusCode: 200,
          data: {
            id: passageiro.getIdPassageiro(),
            nome: passageiro.getNome(),
            sobrenome: passageiro.getSobrenome(),
            cpf: passageiro.getCpf(),
            dataNascimento: passageiro.getDataNascimento(),
            celular: passageiro.getCelular(),
            email: passageiro.getEmail(),
            necessidades: passageiro.getNecessidades(),
          },
        };
      }
    }

    const passageiros = await PassageiroRepository.listarPassageiros();

    if (!passageiros || passageiros.length === 0) {
      return { statusCode: 200, data: [] };
    }

    const dadosTratados = passageiros.map((p) => ({
      id: p.getIdPassageiro(),
      nome: p.getNome(),
      sobrenome: p.getSobrenome(),
      cpf: p.getCpf(),
      dataNascimento: p.getDataNascimento(),
      celular: p.getCelular(),
      email: p.getEmail(),
      necessidades: p.getNecessidades(),
    }));

    return { statusCode: 200, data: dadosTratados };
  }

  static async buscarPorId(idPassageiro: number): Promise<{ statusCode: number; data: any }> {
    if (isNaN(idPassageiro)) {
      return { statusCode: 400, data: { mensagem: "ID do passageiro inválido." } };
    }

    const passageiro = await PassageiroRepository.buscarPorId(idPassageiro);
    if (!passageiro) {
      return { statusCode: 404, data: { mensagem: "Passageiro não encontrado." } };
    }

    const enderecoCompleto = await PassageiroRepository.buscarEnderecoPorPassageiro(idPassageiro);

    return {
      statusCode: 200,
      data: {
        id: passageiro.getIdPassageiro(),
        idPassageiro: passageiro.getIdPassageiro(),
        nome: passageiro.getNome(),
        sobrenome: passageiro.getSobrenome(),
        cpf: passageiro.getCpf(),
        dataNascimento: passageiro.getDataNascimento(),
        celular: passageiro.getCelular(),
        email: passageiro.getEmail(),
        necessidades: passageiro.getNecessidades(),
        endereco: enderecoCompleto,
      },
    };
  }

  static async remover(idPassageiro: number): Promise<{ statusCode: number; data: any }> {
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

    return { statusCode: 200, data: { mensagem: "Passageiro excluído com sucesso." } };
  }

  static async perfil(idPassageiro: number): Promise<{ statusCode: number; data: any }> {
    const passageiro = await PassageiroRepository.buscarPorId(idPassageiro);

    if (!passageiro) {
      return { statusCode: 404, data: { mensagem: "Passageiro não encontrado." } };
    }

    const enderecoCompleto = await PassageiroRepository.buscarEnderecoPorPassageiro(idPassageiro);

    return {
      statusCode: 200,
      data: {
        id: passageiro.getIdPassageiro(),
        nome: passageiro.getNome(),
        sobrenome: passageiro.getSobrenome(),
        cpf: passageiro.getCpf(),
        dataNascimento: passageiro.getDataNascimento(),
        celular: passageiro.getCelular(),
        email: passageiro.getEmail(),
        necessidades: passageiro.getNecessidades(),
        endereco: enderecoCompleto,
      },
    };
  }

  static async editarPerfil(
    idPassageiro: number,
    dados: Partial<PassageiroDTO>
  ): Promise<{ statusCode: number; data: any }> {
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

    return { statusCode: 200, data: { mensagem: "Perfil atualizado com sucesso!" } };
  }

  static async relatorio(idPassageiro: number): Promise<{ statusCode: number; data: any }> {
    const dados = await PassageiroRepository.relatorioPassageiro(idPassageiro);

    if (!dados) {
      return { statusCode: 500, data: { mensagem: "Erro ao gerar relatório." } };
    }

    return { statusCode: 200, data: dados };
  }
}
