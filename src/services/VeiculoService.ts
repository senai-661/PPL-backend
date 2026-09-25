import type { VeiculoDTO } from "../interface/VeiculoDTO.js";
import { Veiculo } from "../models/Veiculo.js";
import { VeiculoRepository } from "../repositories/VeiculoRepository.js";

export class VeiculoService {
  static async listar(): Promise<Array<Veiculo> | null> {
    return await VeiculoRepository.listarVeiculos();
  }

  static async cadastrar(dados: {
    idMotorista: number;
    placa: string;
    tipoVeiculo: string;
    modeloVeiculo: string;
  }): Promise<{ sucesso: boolean; erro?: string }> {
    const { idMotorista, placa, tipoVeiculo, modeloVeiculo } = dados;

    if (!placa || !tipoVeiculo || !modeloVeiculo) {
      return { sucesso: false, erro: "Placa, tipo e modelo do veículo são obrigatórios." };
    }

    const sucesso = await VeiculoRepository.cadastrarVeiculo({
      idMotorista,
      placa,
      tipoVeiculo,
      modeloVeiculo,
    });

    if (!sucesso) {
      return { sucesso: false, erro: "Erro ao cadastrar veículo." };
    }

    return { sucesso: true };
  }

  static async buscarPorId(idVeiculo: number): Promise<Veiculo | null> {
    return await VeiculoRepository.buscarPorId(idVeiculo);
  }

  static async buscarPorMotorista(idMotorista: number): Promise<Veiculo | null> {
    return await VeiculoRepository.buscarPorMotorista(idMotorista);
  }

  static async atualizar(
    idVeiculo: number,
    dados: Partial<VeiculoDTO>
  ): Promise<boolean> {
    return await VeiculoRepository.atualizarVeiculo(idVeiculo, dados);
  }

  static async remover(idVeiculo: number): Promise<boolean> {
    return await VeiculoRepository.deletarVeiculo(idVeiculo);
  }
}
