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

  static async atualizar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idVeiculo = parseInt(req.params.id as string);
      if (isNaN(idVeiculo)) {
        return res.status(400).json({ mensagem: "ID do veículo inválido." });
      }

      const veiculo = await Veiculo.buscarPorId(idVeiculo);
      if (!veiculo) {
        return res.status(404).json({ mensagem: "Veículo não encontrado." });
      }

      const sucesso = await Veiculo.editarVeiculo(idVeiculo, req.body);
      if (!sucesso) {
        return res.status(400).json({ mensagem: "Nenhum campo válido para atualizar." });
      }

      return res.status(200).json({ mensagem: "Veículo atualizado com sucesso!" });
    } catch (error) {
      next(error);
    }
  }

  static async excluir(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idVeiculo = parseInt(req.params.id as string);
      if (isNaN(idVeiculo)) {
        return res.status(400).json({ mensagem: "ID do veículo inválido." });
      }

      const veiculo = await Veiculo.buscarPorId(idVeiculo);
      if (!veiculo) {
        return res.status(404).json({ mensagem: "Veículo não encontrado." });
      }

      const sucesso = await Veiculo.excluirVeiculo(idVeiculo);
      if (!sucesso) {
        return res.status(400).json({ mensagem: "Não foi possível excluir o veículo." });
      }

      return res.status(200).json({ mensagem: "Veículo excluído com sucesso!" });
    } catch (error) {
      next(error);
    }
  }
}

export { VeiculoController };