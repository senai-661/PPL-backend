import type { VeiculoDTO } from "../interface/VeiculoDTO.js";
import type { Request, Response } from "express";
import { Veiculo } from "../model/Veiculo.js";

class VeiculoController extends Veiculo {
  static async listar(req: Request, res: Response): Promise<Response> {
    try {
      const listarVeiculos: Array<Veiculo> | null =
        await Veiculo.listarVeiculos();
      return res.status(200).json(listarVeiculos);
    } catch (error) {
      console.error(`Erro ao consultar modelo. ${error}`);
      return res
        .status(500)
        .json({ mensagem: "Não foi possivel acessar a lista de veículos." });
    }
  }
}

export { VeiculoController };
