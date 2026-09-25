import { PassageiroRepository } from "../repository/PassageiroRepository.js";
import { AuthService } from "./AuthService.js";
import type { PassageiroDTO } from "../interface/PassageiroDTO.js";

export class PassageiroService {
  static async listar(idPassageiro?: number): Promise<any> {
    if (idPassageiro && !isNaN(idPassageiro)) {
      const passageiro = await PassageiroRepository.buscarPorId(idPassageiro);
      if (!passageiro) return null;
      return {
        id: passageiro.getIdPassageiro(),
        nome: passageiro.getNome(),
        sobrenome: passageiro.getSobrenome(),
        cpf: passageiro.getCpf(),
        dataNascimento: passageiro.getDataNascimento(),
        celular: passageiro.getCelular(),
        email: passageiro.getEmail(),
        necessidades: passageiro.getNecessidades(),
      };
    }

    const passageiros = await PassageiroRepository.listarPassageiros();
    if (!passageiros || passageiros.length === 0) {
      return [];
    }

    return passageiros.map((p) => ({
      id: p.getIdPassageiro(),
      nome: p.getNome(),
      sobrenome: p.getSobrenome(),
      cpf: p.getCpf(),
      dataNascimento: p.getDataNascimento(),
      celular: p.getCelular(),
      email: p.getEmail(),
      necessidades: p.getNecessidades(),
    }));
  }

  static async buscarPorId(idPassageiro: number): Promise<any | null> {
    if (isNaN(idPassageiro)) {
      throw new Error("ID do passageiro inválido.");
    }

    const passageiro = await PassageiroRepository.buscarPorId(idPassageiro);
    if (!passageiro) return null;

    const e = await PassageiroRepository.buscarEndereco(idPassageiro);
    let enderecoCompleto = null;
    if (e) {
      enderecoCompleto = `${e.rua}, ${e.numero} - ${e.bairro}, ${e.cidade} - ${e.estado}, CEP: ${e.cep}`;
      if (e.complemento) enderecoCompleto += ` (${e.complemento})`;
    }

    return {
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
    };
  }

  static async obterPerfil(idPassageiro: number): Promise<any | null> {
    return await PassageiroService.buscarPorId(idPassageiro);
  }

  static async editarPerfil(idPassageiro: number, dados: Partial<PassageiroDTO>): Promise<boolean> {
    if (dados.senha) {
      dados.senha = await AuthService.hashSenha(dados.senha);
    }
    return await PassageiroRepository.editarPerfil(idPassageiro, dados);
  }

  static async relatorio(idPassageiro: number): Promise<any | null> {
    return await PassageiroRepository.relatorioPassageiro(idPassageiro);
  }

  static async remover(idPassageiro: number): Promise<boolean> {
    if (isNaN(idPassageiro)) {
      throw new Error("ID do passageiro inválido.");
    }
    return await PassageiroRepository.deletarPassageiro(idPassageiro);
  }
}
