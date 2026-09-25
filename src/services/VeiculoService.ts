import { VeiculoRepository } from "../repository/VeiculoRepository.js";
import { Veiculo } from "../model/Veiculo.js";
import type { VeiculoDTO } from "../interface/VeiculoDTO.js";

export class VeiculoService {
  static async listarVeiculos(): Promise<Array<Veiculo> | null> {
    return await VeiculoRepository.listarVeiculos();
  }

  static async cadastrarVeiculo(dados: VeiculoDTO): Promise<boolean> {
    if (!dados.placa || !dados.tipoVeiculo || !dados.modeloVeiculo) {
      throw new Error("Placa, tipo e modelo do veículo são obrigatórios.");
    }
    return await VeiculoRepository.cadastrarVeiculo(dados);
  }

  static async buscarPorId(idVeiculo: number): Promise<Veiculo | null> {
    if (isNaN(idVeiculo)) {
      throw new Error("ID do veículo inválido.");
    }
    return await VeiculoRepository.buscarPorId(idVeiculo);
  }

  static async buscarPorMotorista(idMotorista: number): Promise<Veiculo | null> {
    return await VeiculoRepository.buscarPorMotorista(idMotorista);
  }

  static async atualizarVeiculo(idVeiculo: number, dados: Partial<VeiculoDTO>): Promise<boolean> {
    if (isNaN(idVeiculo)) {
      throw new Error("ID do veículo inválido.");
    }
    return await VeiculoRepository.atualizarVeiculo(idVeiculo, dados);
  }

  static async removerVeiculo(idVeiculo: number): Promise<boolean> {
    if (isNaN(idVeiculo)) {
      throw new Error("ID do veículo inválido.");
    }
    return await VeiculoRepository.deletarVeiculo(idVeiculo);
  }
}
