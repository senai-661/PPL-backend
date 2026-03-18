import { Avaliacao } from "../model/Avaliacao.js";
import type { Request, Response, NextFunction } from "express";

class AvaliacaoController {
  static async listar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const avaliacoes = await Avaliacao.listarAvaliacoes();
      return res.status(200).json(avaliacoes);
    } catch (error) {
      next(error);
    }
  }

  static async avaliar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { idCorrida, nota, comentario } = req.body;
      const idPassageiro = (req as any).usuario.id;

      if (!nota || nota < 1 || nota > 5) {
        return res.status(400).json({ mensagem: "Nota deve ser entre 1 e 5." });
      }

      const validacao = await Avaliacao.validarCorrida(idCorrida, idPassageiro);
      if (validacao === "not_found") {
        return res.status(404).json({ mensagem: "Corrida não encontrada." });
      }
      if (validacao === "not_finished") {
        return res.status(400).json({ mensagem: "A corrida ainda não foi finalizada." });
      }
      if (validacao === "not_owner") {
        return res.status(403).json({
          mensagem: "Você não tem permissão para avaliar uma corrida que não é sua.",
        });
      }

      const jaAvaliada = await Avaliacao.jaAvaliada(idCorrida);
      if (jaAvaliada) {
        return res.status(400).json({ mensagem: "Essa corrida já foi avaliada." });
      }

      const sucesso = await Avaliacao.criarAvaliacao({ idCorrida, nota, comentario });
      if (!sucesso) {
        return res.status(400).json({ mensagem: "Erro ao cadastrar avaliação." });
      }

      return res.status(201).json({ mensagem: "Avaliação registrada com sucesso!" });
    } catch (error) {
      next(error);
    }
  }

  static async minhas(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idMotorista = (req as any).usuario.id;
      const avaliacoes = await Avaliacao.historicoPorMotorista(idMotorista);

      if (!avaliacoes || avaliacoes.length === 0) {
        return res.status(200).json({
          mediaGeral: null,
          totalAvaliacoes: 0,
          avaliacoes: [],
        });
      }

      const media = avaliacoes.reduce((sum: number, a: any) => sum + a.nota, 0) / avaliacoes.length;

      return res.status(200).json({
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
      });
    } catch (error) {
      next(error);
    }
  }
}

export { AvaliacaoController };