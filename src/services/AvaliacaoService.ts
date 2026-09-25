import { AvaliacaoRepository } from "../repositories/AvaliacaoRepository.js";
import { Avaliacao } from "../models/Avaliacao.js";
import type { AvaliacaoDTO } from "../interface/AvaliacaoDTO.js";

export class AvaliacaoService {
  static async listar(): Promise<Array<Avaliacao> | null> {
    return await AvaliacaoRepository.listarAvaliacoes();
  }

  static async avaliar(
    idPassageiro: number,
    dados: { idCorrida: number; nota: number; comentario?: string }
  ): Promise<{ statusCode: number; data: any }> {
    const { idCorrida, nota, comentario } = dados;

    if (!nota || nota < 1 || nota > 5) {
      return { statusCode: 400, data: { mensagem: "Nota deve ser entre 1 e 5." } };
    }

    const validacao = await AvaliacaoRepository.validarCorrida(idCorrida, idPassageiro);
    if (validacao === "not_found") {
      return { statusCode: 404, data: { mensagem: "Corrida não encontrada." } };
    }
    if (validacao === "not_finished") {
      return { statusCode: 400, data: { mensagem: "A corrida ainda não foi finalizada." } };
    }
    if (validacao === "not_owner") {
      return {
        statusCode: 403,
        data: {
          mensagem: "Você não tem permissão para avaliar uma corrida que não é sua.",
        },
      };
    }

    const jaAvaliada = await AvaliacaoRepository.jaAvaliada(idCorrida);
    if (jaAvaliada) {
      return { statusCode: 400, data: { mensagem: "Essa corrida já foi avaliada." } };
    }

    const avaliacaoDTO: AvaliacaoDTO = {
      idCorrida,
      nota,
      ...(comentario !== undefined ? { comentario } : {}),
    };
    const sucesso = await AvaliacaoRepository.criarAvaliacao(avaliacaoDTO);
    if (!sucesso) {
      return { statusCode: 400, data: { mensagem: "Erro ao cadastrar avaliação." } };
    }

    return { statusCode: 201, data: { mensagem: "Avaliação registrada com sucesso!" } };
  }

  static async obterMinhasAvaliacoes(idMotorista: number): Promise<any> {
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
        passageiro: `${a.nome_passageiro} ${a.sobrenome_passageiro}`,
      })),
    };
  }

  static async buscarPorId(idAvaliacao: number): Promise<{ statusCode: number; data: any }> {
    if (isNaN(idAvaliacao)) {
      return { statusCode: 400, data: { mensagem: "ID da avaliação inválido." } };
    }

    const avaliacao = await AvaliacaoRepository.buscarPorId(idAvaliacao);
    if (!avaliacao) {
      return { statusCode: 404, data: { mensagem: "Avaliação não encontrada." } };
    }

    return { statusCode: 200, data: avaliacao };
  }

  static async atualizar(
    idAvaliacao: number,
    dados: { nota: number; comentario?: string }
  ): Promise<{ statusCode: number; data: any }> {
    if (isNaN(idAvaliacao)) {
      return { statusCode: 400, data: { mensagem: "ID da avaliação inválido." } };
    }

    const { nota, comentario } = dados;
    if (!nota || nota < 1 || nota > 5) {
      return { statusCode: 400, data: { mensagem: "Nota deve ser entre 1 e 5." } };
    }

    const sucesso = await AvaliacaoRepository.atualizarAvaliacao(idAvaliacao, nota, comentario);
    if (!sucesso) {
      return { statusCode: 400, data: { mensagem: "Não foi possível atualizar a avaliação." } };
    }

    return { statusCode: 200, data: { mensagem: "Avaliação atualizada com sucesso!" } };
  }

  static async remover(idAvaliacao: number): Promise<{ statusCode: number; data: any }> {
    if (isNaN(idAvaliacao)) {
      return { statusCode: 400, data: { mensagem: "ID da avaliação inválido." } };
    }

    const sucesso = await AvaliacaoRepository.deletarAvaliacao(idAvaliacao);
    if (!sucesso) {
      return {
        statusCode: 404,
        data: { mensagem: "Avaliação não encontrada ou não pôde ser excluída." },
      };
    }

    return { statusCode: 200, data: { mensagem: "Avaliação excluída com sucesso!" } };
  }
}
