import type { Request, Response, NextFunction } from "express";
import { Veiculo } from "../model/Veiculo.js";

class VeiculoController extends Veiculo {
  static async listar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const listarVeiculos: Array<Veiculo> | null = await Veiculo.listarVeiculos();
      return res.status(200).json(listarVeiculos);
    } catch (error) {
      next(error);
    }
  }

  static async cadastro(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const dadosVeiculo = req.body;
      const respostaModelo = await Veiculo.cadastrarVeiculo(dadosVeiculo);

      if (respostaModelo) {
        return res.status(201).json({ mensagem: "Veículo cadastrado com sucesso." });
      } else {
        return res.status(400).json({ mensagem: "Erro ao cadastrar veículo." });
      }
    } catch (error) {
      next(error);
    }
  }
}

export { VeiculoController };