import { Passageiro } from "../model/Passageiro.js";
import type { PassageiroDTO } from "../interface/PassageiroDTO.js";
import type { Request, Response } from "express";

class PassageiroController extends Passageiro {
  static async listar(req: Request, res: Response): Promise<Response> {
    try {
      const listarPassageiros: Array<Passageiro> | null =
        await Passageiro.listarPassageiros();

      return res.status(200).json(listarPassageiros);
    } catch (error) {
      console.error(`Erro ao consultar modelo. ${error}`);

      return res
        .status(500)
        .json({ mensagem: "Não foi possivel acessar a lista de passageiros." });
    }
  }
  static async cadastro(req: Request, res: Response): Promise<Response> {
    try {
      const dadosPassageiro = req.body;

      const respostaModelo =
        await Passageiro.cadastrarPassageiro(dadosPassageiro);
      if (respostaModelo) {
        return res
          .status(201)
          .json({ mensagem: "Passageiro cadastrado com sucesso." });
      } else {
        return res
          .status(400)
          .json({ mensagem: "Erro ao cadastrar passageiro." });
      }
    } catch (error) {
      console.error(`Erro no modelo. ${error}`);

      return res
        .status(500)
        .json({ mensagem: "Não foi possível inserir o passageiro" });
    }
  }
}
export { PassageiroController };
