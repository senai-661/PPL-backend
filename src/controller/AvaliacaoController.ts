import { Avaliacao } from "../model/Avaliacao.js";
import type { Request, Response } from "express";

class AvaliacaoController extends Avaliacao {
  static async listar(req: Request, res: Response): Promise<Response> {
    try {
      const listarAvaliacoes: Array<Avaliacao> | null =
        await Avaliacao.listarAvaliacoes();
      return res.status(200).json(listarAvaliacoes);
    } catch (error) {
      console.error(`Erro ao consultar avaliacoes. ${error}`);

      return res
        .status(500)
        .json({ mensagem: "Não foi possivel acessar a lista de avaliacoes." });
    }
  }
  static async avaliar(req: Request, res: Response): Promise<Response> {
    try {
      const dadosAvaliacao = req.body;

      const respostaModelo = await Avaliacao.criarAvaliacao(dadosAvaliacao);
      if (respostaModelo) {
        return res
          .status(201)
          .json({ mensagem: "Avaliação cadastrada com sucesso." });
      } else {
        return res
          .status(400)
          .json({ mensagem: "Erro ao cadastrar avaliação." });
      }
    } catch (error) {
      console.error(`Erro no modelo. ${error}`);

      return res
        .status(500)
        .json({ mensagem: "Não foi possível inserir a avaliação" });
    }
  }
}
export { AvaliacaoController };
