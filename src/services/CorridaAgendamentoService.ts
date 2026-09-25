import { CorridaAgendamentoRepository } from "../repository/CorridaAgendamentoRepository.js";
import type { CorridaAgendamentoDTO } from "../interface/CorridaAgendamentoDTO.js";

export class CorridaAgendamentoService {
  static async criarAgendamento(data: CorridaAgendamentoDTO): Promise<any> {
    if (!data.idPassageiro) {
      const err: any = new Error("Usuário não autenticado");
      err.status = 401;
      throw err;
    }

    if (!data.origemCorrida || !data.destinoCorrida || !data.dataAgendada) {
      const err: any = new Error("Origem, destino e data agendada são obrigatórios");
      err.status = 400;
      throw err;
    }

    return await CorridaAgendamentoRepository.criarAgendamento({
      idPassageiro: data.idPassageiro,
      origemCorrida: data.origemCorrida,
      destinoCorrida: data.destinoCorrida,
      tipoCorrida: data.tipoCorrida || 'NORMAL',
      dataAgendada: data.dataAgendada,
      statusAgendamento: 'PENDENTE',
      preco: data.preco || 28,
    });
  }

  static async listarAgendamentos(usuario: { id: number; tipo: string }): Promise<any[]> {
    if (!usuario || !usuario.id) {
      const err: any = new Error("Usuário não autenticado");
      err.status = 401;
      throw err;
    }

    if (usuario.tipo === "passageiro") {
      return await CorridaAgendamentoRepository.listarAgendamentosPorPassageiro(usuario.id);
    } else {
      return await CorridaAgendamentoRepository.listarTodosAgendamentos();
    }
  }
}
