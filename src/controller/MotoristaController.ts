import { Motorista } from "../model/Motorista.js";
import type { MotoristaDTO } from "../interface/MotoristaDTO.js";
import type { Request, Response } from "express";

class MotoristaController extends Motorista {
  static async listar(req: Request, res: Response): Promise<Response> {
    try {
      const listarMotoristas: Array<Motorista> | null =
        await Motorista.listarMotoristas();

      return res.status(200).json(listarMotoristas);
    } catch (error) {
      console.error(`Erro ao consultar modelo. ${error}`);

      return res
        .status(500)
        .json({ mensagem: "Não foi possivel acessar a lista de motoristas." });
    }
  }
  static async cadastro(req: Request, res: Response): Promise<Response> {
    try {
      const dadosMotorista = req.body;

      const respostaModelo = await Motorista.cadastrarMotorista(dadosMotorista);
      if (respostaModelo) {
        return res
          .status(201)
          .json({ mensagem: "Motorista cadastrado com sucesso." });
      } else {
        return res
          .status(400)
          .json({ mensagem: "Erro ao cadastrar motorista." });
      }
    } catch (error) {
      console.error(`Erro no modelo. ${error}`);

      return res
        .status(500)
        .json({ mensagem: "Não foi possível inserir o motorista" });
    }
  }
}
export { MotoristaController };
