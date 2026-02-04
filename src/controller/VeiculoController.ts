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
  static async cadastro(req: Request, res: Response): Promise<Response> {
    try {
      const dadosVeiculo = req.body;

      const respostaModelo = await Veiculo.cadastrarVeiculo(dadosVeiculo);
      if (respostaModelo) {
        return res
          .status(201)
          .json({ mensagem: "Veículo cadastrado com sucesso." });
      } else {
        return res.status(400).json({ mensagem: "Erro ao cadastrar veículo." });
      }
    } catch (error) {
      console.error(`Erro no modelo. ${error}`);

      return res
        .status(500)
        .json({ mensagem: "Não foi possível inserir o veículo" });
    }
  }
}

export { VeiculoController };
