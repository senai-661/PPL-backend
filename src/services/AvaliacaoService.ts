import { AvaliacaoRepository } from "../repository/AvaliacaoRepository.js";
import { Avaliacao } from "../model/Avaliacao.js";

export class AvaliacaoService {
  static async listarAvaliacoes(): Promise<Array<Avaliacao> | null> {
    return await AvaliacaoRepository.listarAvaliacoes();
  }

  static async avaliar(
    idPassageiro: number,
    dados: { idCorrida: number; nota: number; comentario?: string }
  ): Promise<{ status: number; mensagem: string }> {
    const { idCorrida, nota, comentario } = dados;

    if (!nota || nota < 1 || nota > 5) {
      return { status: 400, mensagem: "Nota deve ser entre 1 e 5." };
    }

    const validacao = await AvaliacaoRepository.validarCorrida(idCorrida, idPassageiro);
    if (validacao === "not_found") {
      return { status: 404, mensagem: "Corrida não encontrada." };
    }
    if (validacao === "not_finished") {
      return { status: 400, mensagem: "A corrida ainda não foi finalizada." };
    }
    if (validacao === "not_owner") {
      return {
        status: 403,
        mensagem: "Você não tem permissão para avaliar uma corrida que não é sua.",
      };
    }

    const jaAvaliada = await AvaliacaoRepository.jaAvaliada(idCorrida);
    if (jaAvaliada) {
      return { status: 400, mensagem: "Essa corrida já foi avaliada." };
    }

    const sucesso = await AvaliacaoRepository.criarAvaliacao({ idCorrida, nota, comentario });
    if (!sucesso) {
      return { status: 400, mensagem: "Erro ao cadastrar avaliação." };
    }

    return { status: 201, mensagem: "Avaliação registrada com sucesso!" };
  }

  static async minhasAvaliacoes(idMotorista: number): Promise<any> {
    const avaliacoes = await AvaliacaoRepository.historicoPorMotorista(idMotorista);

    if (!avaliacoes || avaliacoes.length === 0) {
      return {
        mediaGeral: null,
        totalAvaliacoes: 0,
        avaliacoes: [],
      };
    }

    const media = avaliacoes.reduce((sum: number, a: any) => sum + a.nota, 0) / avaliacoes.length;

    return {
      mediaGeral: parseFloat(media.toFixed(1)),
      totalAvaliacoes: avaliacoes.length,
      avaliacoes: avaliacoes.map((a: any) => ({
        id: a.id_avaliacao,
        nota: a.nota,
        comentario: a.comentario,
        criadoEm: a.criado_em,
        corrida: {
          origem: a.origem_corrida,
          destino: a.destino_corrida,
          data: a.data_corrida,
        },
        passageiro: `${a.nome_passageiro ?? a.passageiro_nome ?? ""} ${a.sobrenome_passageiro ?? a.passageiro_sobrenome ?? ""}`.trim(),
      })),
    };
  }

  static async buscarPorId(idAvaliacao: number): Promise<any | null> {
    if (isNaN(idAvaliacao)) {
      throw new Error("ID da avaliação inválido.");
    }
    return await AvaliacaoRepository.buscarPorId(idAvaliacao);
  }

  static async atualizarAvaliacao(
    idAvaliacao: number,
    nota: number,
    comentario?: string
  ): Promise<boolean> {
    if (isNaN(idAvaliacao)) {
      throw new Error("ID da avaliação inválido.");
    }
    if (!nota || nota < 1 || nota > 5) {
      throw new Error("Nota deve ser entre 1 e 5.");
    }
    return await AvaliacaoRepository.atualizarAvaliacao(idAvaliacao, nota, comentario);
  }

  static async removerAvaliacao(idAvaliacao: number): Promise<boolean> {
    if (isNaN(idAvaliacao)) {
      throw new Error("ID da avaliação inválido.");
    }
    return await AvaliacaoRepository.deletarAvaliacao(idAvaliacao);
  }
}
