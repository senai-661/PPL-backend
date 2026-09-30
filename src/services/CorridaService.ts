import { CorridaRepository } from "../repository/CorridaRepository.js";
import { calcularPreco } from "./CalcularPreco.js";

type TipoViagem = "Convencional" | "EconoComigo" | "Premium";

function normalizarTipoViagem(tipo?: string): TipoViagem {
  if (tipo === "EconoComigo" || tipo === "Premium") {
    return tipo;
  }
  return "Convencional";
}

export class CorridaService {
  static async listar(status?: string, idMotorista?: number): Promise<any[]> {
    if (status) {
      const corridas = await CorridaRepository.listarPorStatus(status, idMotorista);
      return corridas ?? [];
    }
    const todas = await CorridaRepository.listarCorridas();
    return todas ?? [];
  }

  static async precoEstimado(dados: {
    latOrigem: number;
    lngOrigem: number;
    latDestino: number;
    lngDestino: number;
    tipoCorrida?: string;
  }): Promise<{ preco: number; distanciaKm: number; duracaoEstimadaMin: number }> {
    const { latOrigem, lngOrigem, latDestino, lngDestino, tipoCorrida } = dados;

    if (!latOrigem || !lngOrigem || !latDestino || !lngDestino) {
      throw new Error("Coordenadas de origem e destino são obrigatórias.");
    }

    return calcularPreco(
      latOrigem,
      lngOrigem,
      latDestino,
      lngDestino,
      normalizarTipoViagem(tipoCorrida),
    );
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
  ): Promise<{
    mensagem: string;
    idCorrida: number | null;
    tipoCorrida: string;
    preco: number;
    distanciaKm: number;
    duracaoEstimadaMin: number;
  }> {
    const tipoValido = normalizarTipoViagem(dados.tipoCorrida);
    const { preco, distanciaKm, duracaoEstimadaMin } = calcularPreco(
      dados.latOrigem,
      dados.lngOrigem,
      dados.latDestino,
      dados.lngDestino,
      tipoValido,
    );

    const idCorrida = await CorridaRepository.solicitarCorridaSP(idPassageiro, dados, preco);

    return {
      mensagem: "Corrida solicitada com sucesso! Aguardando motorista.",
      idCorrida,
      tipoCorrida: tipoValido,
      preco,
      distanciaKm,
      duracaoEstimadaMin,
    };
  }

  static async aceitar(
    idCorrida: number,
    idMotorista: number
  ): Promise<{ sucesso: boolean; semVeiculo?: boolean; mensagem: string }> {
    const idVeiculo = await CorridaRepository.buscarVeiculoMotorista(idMotorista);

    if (!idVeiculo) {
      return {
        sucesso: false,
        semVeiculo: true,
        mensagem: "Motorista não possui veículo cadastrado.",
      };
    }

    const sucesso = await CorridaRepository.aceitarCorrida(idCorrida, idMotorista, idVeiculo);
    if (!sucesso) {
      return {
        sucesso: false,
        mensagem: "Corrida não encontrada ou não está pendente.",
      };
    }

    return {
      sucesso: true,
      mensagem: "Corrida aceita! Aguardando início.",
    };
  }

  static async iniciar(idCorrida: number, idMotorista: number): Promise<boolean> {
    return await CorridaRepository.iniciarCorrida(idCorrida, idMotorista);
  }

  static async finalizar(
    idCorrida: number,
    idMotorista: number
  ): Promise<{ sucesso: boolean; duracaoCorrida?: string; mensagem: string; statusHttp?: number }> {
    const dataInicioCorrida = await CorridaRepository.buscarDataInicio(idCorrida, idMotorista);
    if (!dataInicioCorrida) {
      return {
        sucesso: false,
        statusHttp: 404,
        mensagem: "Corrida não encontrada.",
      };
    }

    const dataInicio: Date = new Date(dataInicioCorrida);
    const duracaoCorrida = Math.ceil(
      (new Date().getTime() - dataInicio.getTime()) / 60000,
    );

    const sucesso = await CorridaRepository.finalizarCorrida(idCorrida, duracaoCorrida, idMotorista);
    if (!sucesso) {
      return {
        sucesso: false,
        statusHttp: 400,
        mensagem: "Corrida não está em andamento.",
      };
    }

    return {
      sucesso: true,
      mensagem: "Corrida finalizada com sucesso!",
      duracaoCorrida: `${duracaoCorrida} minutos`,
    };
  }

  static async cancelar(
    idCorrida: number,
    usuario: { id: number; tipo: string },
    motivoCancelamento?: string | null
  ): Promise<{ sucesso: boolean; statusHttp?: number; mensagem: string }> {
    if (isNaN(idCorrida)) {
      return { sucesso: false, statusHttp: 400, mensagem: "ID da corrida inválido." };
    }

    const corrida = await CorridaRepository.buscarPorId(idCorrida);
    if (!corrida) {
      return { sucesso: false, statusHttp: 404, mensagem: "Corrida não encontrada." };
    }

    const ehPassageiroDaCorrida =
      usuario.tipo === "passageiro" && corrida.passageiro?.id === usuario.id;
    const ehMotoristaDaCorrida =
      usuario.tipo === "motorista" && corrida.motorista?.id === usuario.id;

    if (!ehPassageiroDaCorrida && !ehMotoristaDaCorrida && usuario.tipo !== "admin") {
      return {
        sucesso: false,
        statusHttp: 403,
        mensagem: "Você não tem permissão para cancelar esta corrida.",
      };
    }

    const sucesso = await CorridaRepository.cancelarCorrida(idCorrida, motivoCancelamento ?? null);
    if (!sucesso) {
      return { sucesso: false, statusHttp: 400, mensagem: "Corrida não pode ser cancelada." };
    }

    return { sucesso: true, mensagem: "Corrida cancelada." };
  }

  static async cancelarAtual(idPassageiro: number): Promise<boolean> {
    const corrida = await CorridaRepository.corridaAtualPassageiro(idPassageiro);
    if (!corrida) {
      return false;
    }

    await CorridaRepository.cancelarCorridaSP(corrida.idCorrida, "Cancelada pelo passageiro");
    return true;
  }

  static async historico(usuario: { id: number; tipo: string }): Promise<any[]> {
    if (usuario.tipo === "passageiro") {
      return (await CorridaRepository.historicoPorPassageiro(usuario.id)) ?? [];
    } else if (usuario.tipo === "motorista") {
      return (await CorridaRepository.historicoPorMotorista(usuario.id)) ?? [];
    }
    return [];
  }

  static async relatorioMotorista(idMotorista: number): Promise<any | null> {
    return await CorridaRepository.relatorioMotorista(idMotorista);
  }

  static async buscarPorId(
    idCorrida: number,
    usuario: { id: number; tipo: string }
  ): Promise<any | null> {
    if (isNaN(idCorrida)) {
      throw new Error("ID inválido.");
    }

    const corrida = await CorridaRepository.buscarPorId(idCorrida);
    if (!corrida) return null;

    const ehPassageiroDaCorrida =
      usuario.tipo === "passageiro" && corrida.passageiro?.id === usuario.id;
    const ehMotoristaDaCorrida =
      usuario.tipo === "motorista" && corrida.motorista?.id === usuario.id;
    const ehAdmin = usuario.tipo === "admin";

    if (!ehPassageiroDaCorrida && !ehMotoristaDaCorrida && !ehAdmin) {
      const err: any = new Error("Você não tem permissão para acessar esta corrida.");
      err.status = 403;
      throw err;
    }

    return corrida;
  }

  static async corridaAtualPassageiro(idPassageiro: number): Promise<any | null> {
    return await CorridaRepository.corridaAtualPassageiro(idPassageiro);
  }

  static async corridaAtualMotorista(idMotorista: number): Promise<any | null> {
    return await CorridaRepository.corridaAtualMotorista(idMotorista);
  }

  static async resumoDiaMotorista(idMotorista: number): Promise<any | null> {
    return await CorridaRepository.resumoDiaMotorista(idMotorista);
  }

  static async remover(idCorrida: number): Promise<boolean> {
    if (isNaN(idCorrida)) {
      throw new Error("ID da corrida inválido.");
    }
    return await CorridaRepository.deletarCorrida(idCorrida);
  }
}
