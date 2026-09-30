import { CorridaRepository } from "../repositories/CorridaRepository.js";
import { VeiculoRepository } from "../repositories/VeiculoRepository.js";
import { calcularPreco } from "./CalcularPreco.js";

export class CorridaService {
  static async listar(status?: string, usuario?: any): Promise<{ statusCode: number; data: any }> {
    if (status) {
      const idMotorista = usuario?.tipo === "motorista" ? usuario.id : undefined;
      const corridas = await CorridaRepository.listarPorStatus(status, idMotorista);
      return { statusCode: 200, data: corridas ?? [] };
    }

    const corridas = await CorridaRepository.listarCorridas();
    return { statusCode: 200, data: corridas ?? [] };
  }

  static async precoEstimado(dados: {
    latOrigem?: number;
    lngOrigem?: number;
    latDestino?: number;
    lngDestino?: number;
    tipoCorrida?: any;
  }): Promise<{ statusCode: number; data: any }> {
    const { latOrigem, lngOrigem, latDestino, lngDestino, tipoCorrida } = dados;

    if (!latOrigem || !lngOrigem || !latDestino || !lngDestino) {
      return {
        statusCode: 400,
        data: { mensagem: "Coordenadas de origem e destino são obrigatórias." },
      };
    }

    const { preco, distanciaKm, duracaoEstimadaMin } = calcularPreco(
      latOrigem,
      lngOrigem,
      latDestino,
      lngDestino,
      tipoCorrida ?? "Convencional"
    );

    return {
      statusCode: 200,
      data: { preco, distanciaKm, duracaoEstimadaMin },
    };
  }

  static async solicitar(
    idPassageiro: number,
    dados: {
      origemCorrida: string;
      destinoCorrida: string;
      latOrigem: number;
      lngOrigem: number;
      latDestino: number;
      lngDestino: number;
      tipoCorrida?: string;
      numPassageiros?: number;
      observacoes?: string;
    }
  ): Promise<{ statusCode: number; data: any }> {
    const temCorridaAtiva = await CorridaRepository.passageiroTemCorridaAtiva(idPassageiro);
    if (temCorridaAtiva) {
      return {
        statusCode: 400,
        data: {
          mensagem: "Você já possui uma corrida em andamento. Aguarde ou cancele antes de solicitar outra.",
        },
      };
    }

    const {
      origemCorrida,
      destinoCorrida,
      latOrigem,
      lngOrigem,
      latDestino,
      lngDestino,
      tipoCorrida,
      numPassageiros,
      observacoes,
    } = dados;

    const { preco, distanciaKm, duracaoEstimadaMin } = calcularPreco(
      latOrigem,
      lngOrigem,
      latDestino,
      lngDestino,
      (tipoCorrida ?? "Convencional") as any
    );

    const idGerado = await CorridaRepository.solicitarCorrida({
      idPassageiro,
      origemCorrida,
      destinoCorrida,
      tipoCorrida: tipoCorrida ?? "Convencional",
      preco,
      idMotorista: null,
      idVeiculo: null,
      dataCorrida: new Date(),
      duracaoCorrida: 0,
      statusCorrida: "Pendente",
      numPassageiros: numPassageiros ?? 1,
      ...(observacoes ? { observacoes } : {}),
    });

    if (!idGerado) {
      return {
        statusCode: 400,
        data: { mensagem: "Erro ao solicitar corrida." },
      };
    }

    return {
      statusCode: 201,
      data: {
        mensagem: "Corrida solicitada com sucesso! Aguardando motorista.",
        idCorrida: idGerado,
        tipoCorrida: tipoCorrida ?? "Convencional",
        preco,
        distanciaKm,
        duracaoEstimadaMin,
      },
    };
  }

  static async aceitar(idCorrida: number, idMotorista: number): Promise<{ statusCode: number; data: any }> {
    const temCorridaAtiva = await CorridaRepository.motoristaTemCorridaAtiva(idMotorista);
    if (temCorridaAtiva) {
      return {
        statusCode: 400,
        data: { mensagem: "Você já está em uma corrida. Finalize ou cancele antes de aceitar outra." },
      };
    }

    const veiculo = await VeiculoRepository.buscarPorMotorista(idMotorista);
    if (!veiculo) {
      return {
        statusCode: 400,
        data: { mensagem: "Motorista não possui veículo cadastrado.", semVeiculo: true },
      };
    }

    const idVeiculo = veiculo.getIdVeiculo();
    const sucesso = await CorridaRepository.aceitarCorrida(idCorrida, idMotorista, idVeiculo);

    if (!sucesso) {
      return {
        statusCode: 400,
        data: { mensagem: "Corrida não encontrada ou não está pendente." },
      };
    }

    return {
      statusCode: 200,
      data: { mensagem: "Corrida aceita! Aguardando início." },
    };
  }

  static async iniciar(idCorrida: number, idMotorista: number): Promise<{ statusCode: number; data: any }> {
    const sucesso = await CorridaRepository.iniciarCorrida(idCorrida, idMotorista);

    if (!sucesso) {
      return {
        statusCode: 400,
        data: { mensagem: "Corrida não encontrada ou não foi aceita ainda." },
      };
    }

    return {
      statusCode: 200,
      data: { mensagem: "Corrida iniciada!" },
    };
  }

  static async finalizar(idCorrida: number, idMotorista: number): Promise<{ statusCode: number; data: any }> {
    const dataInicio = await CorridaRepository.buscarDataInicioCorrida(idCorrida, idMotorista);

    if (!dataInicio) {
      return {
        statusCode: 404,
        data: { mensagem: "Corrida não encontrada." },
      };
    }

    const duracaoCorrida = Math.ceil(
      (new Date().getTime() - new Date(dataInicio).getTime()) / 60000
    );

    const sucesso = await CorridaRepository.finalizarCorrida(idCorrida, duracaoCorrida, idMotorista);
    if (!sucesso) {
      return {
        statusCode: 400,
        data: { mensagem: "Corrida não está em andamento." },
      };
    }

    return {
      statusCode: 200,
      data: {
        mensagem: "Corrida finalizada com sucesso!",
        duracaoCorrida: `${duracaoCorrida} minutos`,
      },
    };
  }

  static async cancelar(
    idCorrida: number,
    usuario: { id: number; tipo: string },
    motivoCancelamento?: string | null
  ): Promise<{ statusCode: number; data: any }> {
    if (isNaN(idCorrida)) {
      return {
        statusCode: 400,
        data: { mensagem: "ID da corrida inválido." },
      };
    }

    const corrida = await CorridaRepository.buscarPorId(idCorrida);

    const ehPassageiroDaCorrida =
      usuario.tipo === "passageiro" && corrida?.passageiro?.id === usuario.id;
    const ehMotoristaDaCorrida =
      usuario.tipo === "motorista" && corrida?.motorista?.id === usuario.id;

    if (!ehPassageiroDaCorrida && !ehMotoristaDaCorrida) {
      return {
        statusCode: 403,
        data: { mensagem: "Você não tem permissão para cancelar esta corrida." },
      };
    }

    const sucesso = await CorridaRepository.cancelarCorrida(idCorrida, motivoCancelamento ?? null);
    if (!sucesso) {
      return {
        statusCode: 400,
        data: { mensagem: "Corrida não pode ser cancelada." },
      };
    }

    return {
      statusCode: 200,
      data: { mensagem: "Corrida cancelada." },
    };
  }

  static async cancelarAtual(idPassageiro: number): Promise<{ statusCode: number; data: any }> {
    const corrida = await CorridaRepository.corridaAtualPassageiro(idPassageiro);

    if (!corrida) {
      return {
        statusCode: 404,
        data: { mensagem: "Nenhuma corrida pendente encontrada." },
      };
    }

    const sucesso = await CorridaRepository.cancelarCorrida(corrida.idCorrida, "Cancelada pelo passageiro");

    if (!sucesso) {
      return {
        statusCode: 400,
        data: { mensagem: "Não foi possível cancelar a corrida." },
      };
    }

    return {
      statusCode: 200,
      data: { mensagem: "Corrida cancelada com sucesso." },
    };
  }

  static async historico(usuario: { id: number; tipo: string }): Promise<{ statusCode: number; data: any }> {
    if (usuario.tipo === "passageiro") {
      const corridas = await CorridaRepository.historicoPorPassageiro(usuario.id);
      return { statusCode: 200, data: corridas ?? [] };
    } else if (usuario.tipo === "motorista") {
      const corridas = await CorridaRepository.historicoPorMotorista(usuario.id);
      return { statusCode: 200, data: corridas ?? [] };
    } else {
      return {
        statusCode: 403,
        data: { mensagem: "Você não tem permissão para acessar essa área." },
      };
    }
  }

  static async relatorio(idMotorista: number): Promise<{ statusCode: number; data: any }> {
    const dados = await CorridaRepository.relatorioMotorista(idMotorista);

    if (!dados) {
      return {
        statusCode: 500,
        data: { mensagem: "Erro ao gerar relatório." },
      };
    }

    return { statusCode: 200, data: dados };
  }

  static async buscarPorId(
    idCorrida: number,
    usuario: { id: number; tipo: string }
  ): Promise<{ statusCode: number; data: any }> {
    if (isNaN(idCorrida)) {
      return {
        statusCode: 400,
        data: { mensagem: "ID inválido." },
      };
    }

    const corrida = await CorridaRepository.buscarPorId(idCorrida);

    if (!corrida) {
      return {
        statusCode: 404,
        data: { mensagem: "Corrida não encontrada." },
      };
    }

    const ehPassageiroDaCorrida =
      usuario.tipo === "passageiro" && corrida.passageiro?.id === usuario.id;
    const ehMotoristaDaCorrida =
      usuario.tipo === "motorista" && corrida.motorista?.id === usuario.id;

    if (!ehPassageiroDaCorrida && !ehMotoristaDaCorrida) {
      return {
        statusCode: 403,
        data: { mensagem: "Você não tem permissão para acessar esta corrida." },
      };
    }

    return { statusCode: 200, data: corrida };
  }

  static async corridaAtual(idPassageiro: number): Promise<{ statusCode: number; data: any }> {
    const corrida = await CorridaRepository.corridaAtualPassageiro(idPassageiro);

    if (!corrida) {
      return {
        statusCode: 200,
        data: { mensagem: "Nenhuma corrida ativa no momento." },
      };
    }

    return { statusCode: 200, data: corrida };
  }

  static async corridaAtualMotorista(idMotorista: number): Promise<{ statusCode: number; data: any }> {
    const corrida = await CorridaRepository.corridaAtualMotorista(idMotorista);

    if (!corrida) {
      return {
        statusCode: 200,
        data: { mensagem: "Nenhuma corrida ativa no momento." },
      };
    }

    return { statusCode: 200, data: corrida };
  }

  static async resumoDiaMotorista(idMotorista: number): Promise<{ statusCode: number; data: any }> {
    const resumo = await CorridaRepository.resumoDiaMotorista(idMotorista);

    if (!resumo) {
      return {
        statusCode: 500,
        data: { mensagem: "Erro ao buscar resumo do dia." },
      };
    }

    return { statusCode: 200, data: resumo };
  }

  static async remover(idCorrida: number): Promise<{ statusCode: number; data: any }> {
    if (isNaN(idCorrida)) {
      return {
        statusCode: 400,
        data: { mensagem: "ID da corrida inválido." },
      };
    }

    const sucesso = await CorridaRepository.deletarCorrida(idCorrida);
    if (!sucesso) {
      return {
        statusCode: 404,
        data: { mensagem: "Corrida não encontrada ou não pôde ser excluída." },
      };
    }

    return {
      statusCode: 200,
      data: { mensagem: "Corrida excluída com sucesso." },
    };
  }
}
