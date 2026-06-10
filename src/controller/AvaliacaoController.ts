import { Avaliacao } from "../model/Avaliacao.js";
import type { Request, Response, NextFunction } from "express";
import { DatabaseModel } from "../model/DatabaseModel.js";
 
const database = new DatabaseModel().pool;
 
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
 
      // Todas as validações e o insert estão na SP
      await database.query(
        `CALL sp_avaliar_corrida($1, $2, $3, $4, NULL)`,
        [idCorrida, idPassageiro, nota, comentario ?? null],
      );
 
      return res.status(201).json({ mensagem: "Avaliação registrada com sucesso!" });
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ mensagem: error.message });
      }
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