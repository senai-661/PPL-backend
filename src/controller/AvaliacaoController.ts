
import { Avaliacao } from "../model/Avaliacao.js";
import type { Request, Response } from "express";

class AvaliacaoController {
  static async listar(req: Request, res: Response): Promise<Response> {
    try {
      const avaliacoes = await Avaliacao.listarAvaliacoes();
      return res.status(200).json(avaliacoes);
    } catch (error) {
      return res.status(500).json({ mensagem: "Não foi possível acessar a lista de avaliações." });
    }
  }

  static async avaliar(req: Request, res: Response): Promise<Response> {
    try {
      const { idCorrida, nota, comentario } = req.body;

      // 👇 Passenger id comes from the token
      const idPassageiro = (req as any).usuario.id;

      // 1. Validate note range
      if (!nota || nota < 1 || nota > 5) {
        return res.status(400).json({ mensagem: "Nota deve ser entre 1 e 5." });
      }

      // 2. Validate corrida exists, is Finalizada and belongs to this passenger
      const validacao = await Avaliacao.validarCorrida(idCorrida, idPassageiro);
      if (validacao === "not_found") {
        return res.status(404).json({ mensagem: "Corrida não encontrada." });
      }
      if (validacao === "not_finished") {
        return res.status(400).json({ mensagem: "A corrida ainda não foi finalizada." });
      }
      if (validacao === "not_owner") {
        return res.status(403).json({ mensagem: "Você não pode avaliar uma corrida que não é sua." });
      }

      // 3. Check if already rated
      const jaAvaliada = await Avaliacao.jaAvaliada(idCorrida);
      if (jaAvaliada) {
        return res.status(400).json({ mensagem: "Essa corrida já foi avaliada." });
      }

      // 4. Save the rating
      const sucesso = await Avaliacao.criarAvaliacao({ idCorrida, nota, comentario });
      if (!sucesso) {
        return res.status(400).json({ mensagem: "Erro ao cadastrar avaliação." });
      }

      return res.status(201).json({ mensagem: "Avaliação registrada com sucesso!" });
    } catch (error) {
      console.error(`Erro ao avaliar: ${error}`);
      return res.status(500).json({ mensagem: "Não foi possível inserir a avaliação." });
    }
  }
}

export { AvaliacaoController }; 
