import type { Request, Response, NextFunction } from "express";
import { VeiculoService } from "../services/VeiculoService.js";

class VeiculoController {
  static async listar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const listarVeiculos = await VeiculoService.listarVeiculos();
      return res.status(200).json(listarVeiculos);
    } catch (error) {
      next(error);
    }
  }

  static async cadastro(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idMotorista = (req as any).usuario.id;
      const { placa, tipoVeiculo, modeloVeiculo } = req.body;

      if (!placa || !tipoVeiculo || !modeloVeiculo) {
        return res.status(400).json({ mensagem: "Placa, tipo e modelo do veículo são obrigatórios." });
      }

      const respostaModelo = await VeiculoService.cadastrarVeiculo({
        idMotorista,
        placa,
        tipoVeiculo,
        modeloVeiculo,
      });

      if (respostaModelo) {
        return res.status(201).json({ mensagem: "Veículo cadastrado com sucesso." });
      } else {
        return res.status(400).json({ mensagem: "Erro ao cadastrar veículo." });
      }
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ mensagem: error.message });
      }
      next(error);
    }
  }

  static async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idVeiculo = parseInt(req.params.id as string, 10);
      if (isNaN(idVeiculo)) {
        return res.status(400).json({ mensagem: "ID do veículo inválido." });
      }

      const veiculo = await VeiculoService.buscarPorId(idVeiculo);
      if (!veiculo) {
        return res.status(404).json({ mensagem: "Veículo não encontrado." });
      }

      return res.status(200).json(veiculo);
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ mensagem: error.message });
      }
      next(error);
    }
  }

  static async veiculoDoMotorista(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idMotorista = (req as any).usuario.id;
      const veiculo = await VeiculoService.buscarPorMotorista(idMotorista);
      if (!veiculo) {
        return res.status(404).json({ mensagem: "Nenhum veículo encontrado para este motorista." });
      }

      return res.status(200).json(veiculo);
    } catch (error) {
      next(error);
    }
  }

  static async atualizar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idVeiculo = parseInt(req.params.id as string, 10);
      if (isNaN(idVeiculo)) {
        return res.status(400).json({ mensagem: "ID do veículo inválido." });
      }

      const { placa, tipoVeiculo, modeloVeiculo } = req.body;
      const sucesso = await VeiculoService.atualizarVeiculo(idVeiculo, {
        placa,
        tipoVeiculo,
        modeloVeiculo,
      });

      if (!sucesso) {
        return res.status(400).json({ mensagem: "Não foi possível atualizar o veículo." });
      }

      return res.status(200).json({ mensagem: "Veículo atualizado com sucesso." });
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ mensagem: error.message });
      }
      next(error);
    }
  }

  static async remover(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idVeiculo = parseInt(req.params.id as string, 10);
      if (isNaN(idVeiculo)) {
        return res.status(400).json({ mensagem: "ID do veículo inválido." });
      }

      const sucesso = await VeiculoService.removerVeiculo(idVeiculo);
      if (!sucesso) {
        return res.status(404).json({ mensagem: "Veículo não encontrado ou não pôde ser removido." });
      }

      return res.status(200).json({ mensagem: "Veículo excluído com sucesso." });
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ mensagem: error.message });
      }
      next(error);
    }
  }
}

export { VeiculoController };
