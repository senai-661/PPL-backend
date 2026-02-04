import { Corrida } from "../model/Corrida.js";
import type { CorridaDTO } from "../interface/CorridaDTO.js";
import type { Request, Response } from "express";

class CorridaController extends Corrida {
  static async listar(req: Request, res: Response): Promise<Response> {
    try {
      const listarCorridas: Array<Corrida> | null =
        await Corrida.listarCorridas();
      return res.status(200).json(listarCorridas);
    } catch (error) {
      console.error(`Erro ao consultar corridas. ${error}`);

      return res
        .status(500)
        .json({ mensagem: "Não foi possivel acessar a lista de corridas." });
    }
  }
  static async solicitar(req: Request, res: Response): Promise<Response> {
    try {
      const dadosCorrida = req.body;

      const respostaModelo = await Corrida.criarCorrida(dadosCorrida);
      if (respostaModelo) {
        return res
          .status(201)
          .json({ mensagem: "Corrida cadastrada com sucesso." });
      } else {
        return res.status(400).json({ mensagem: "Erro ao cadastrar corrida." });
      }
    } catch (error) {
      console.error(`Erro no modelo. ${error}`);

      return res
        .status(500)
        .json({ mensagem: "Não foi possível inserir a corrida" });
    }
  }
}
export { CorridaController };
