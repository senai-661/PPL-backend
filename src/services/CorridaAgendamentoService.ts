import { CorridaAgendamentoRepository } from "../repositories/CorridaAgendamentoRepository.js";
import type { CorridaAgendamentoDTO } from "../interface/CorridaAgendamentoDTO.js";

export class CorridaAgendamentoService {
  static async criar(
    idPassageiro: number,
    dados: {
      origemCorrida: string;
      destinoCorrida: string;
      tipoCorrida?: string;
      dataAgendada: string;
      preco?: number;
    }
  ): Promise<{ statusCode: number; data: any }> {
    const { origemCorrida, destinoCorrida, tipoCorrida, dataAgendada, preco } = dados;

    if (!origemCorrida || !destinoCorrida || !dataAgendada) {
      return {
        statusCode: 400,
        data: { error: "Origem, destino e data agendada são obrigatórios" },
      };
    }

    const payload: CorridaAgendamentoDTO = {
      idPassageiro,
      origemCorrida,
      destinoCorrida,
      tipoCorrida: tipoCorrida || "NORMAL",
      dataAgendada: new Date(dataAgendada),
      statusAgendamento: "PENDENTE",
      preco: preco || 28,
    };

    const result = await CorridaAgendamentoRepository.criarAgendamento(payload);

    return {
      statusCode: 201,
      data: {
        mensagem: "Corrida agendada com sucesso!",
        agendamento: result,
      },
    };
  }

  static async listar(usuario: { id: number; tipo: string }): Promise<{ statusCode: number; data: any }> {
    let agendamentos;
    if (usuario.tipo === "passageiro") {
      agendamentos = await CorridaAgendamentoRepository.listarAgendamentosPorPassageiro(usuario.id);
    } else {
      agendamentos = await CorridaAgendamentoRepository.listarTodosAgendamentos();
    }

    return { statusCode: 200, data: agendamentos };
  }
}
