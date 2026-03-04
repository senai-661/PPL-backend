import { Corrida } from "../model/Corrida.js";
import { calcularPreco } from "../services/CalcularPreco.js";
import type { Request, Response } from "express";

// ✅ No more "extends Corrida"
class CorridaController {

  static async listar(req: Request, res: Response): Promise<Response> {
    try {
      const corridas = await Corrida.listarCorridas();
      return res.status(200).json(corridas);
    } catch (error) {
      return res.status(500).json({ mensagem: "Não foi possível acessar a lista de corridas." });
    }
  }

  static async listarPendentes(req: Request, res: Response): Promise<Response> {
    try {
      const corridas = await Corrida.listarPendentes();
      return res.status(200).json(corridas);
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro ao listar corridas pendentes." });
    }
  }

  static async solicitar(req: Request, res: Response): Promise<Response> {
    try {
      const { idPassageiro, origemCorrida, destinoCorrida,
              latOrigem, lngOrigem, latDestino, lngDestino, tipoViagem } = req.body;

      const { preco, distanciaKm, duracaoEstimadaMin } = calcularPreco(
        latOrigem, lngOrigem, latDestino, lngDestino, tipoViagem ?? "Convencional"
      );

      const idGerado = await Corrida.solicitarCorrida({
        idPassageiro,
        origemCorrida,
        destinoCorrida,
        preco,
        idMotorista: null,
        idVeiculo: null,
        dataCorrida: new Date(),
        duracaoCorrida: 0,
        statusCorrida: "Pendente",
      });

      if (!idGerado) {
        return res.status(400).json({ mensagem: "Erro ao solicitar corrida." });
      }

      return res.status(201).json({
        mensagem: "Corrida solicitada com sucesso! Aguardando motorista.",
        idCorrida: idGerado,
        preco,
        distanciaKm,
        duracaoEstimadaMin,
      });
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro interno ao solicitar corrida." });
    }
  }

  static async aceitar(req: Request, res: Response): Promise<Response> {
    try {
      // ✅ Parse seguro do id
      const idCorrida = parseInt(req.params.id as string, 10);
      const { idMotorista, idVeiculo } = req.body;

      const sucesso = await Corrida.aceitarCorrida(idCorrida, idMotorista, idVeiculo);
      if (!sucesso) {
        return res.status(400).json({ mensagem: "Corrida não encontrada ou não está pendente." });
      }

      return res.status(200).json({ mensagem: "Corrida aceita! Aguardando início." });
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro ao aceitar corrida." });
    }
  }

  static async iniciar(req: Request, res: Response): Promise<Response> {
    try {
      const idCorrida = parseInt(req.params.id as string, 10);
      const sucesso = await Corrida.iniciarCorrida(idCorrida);

      if (!sucesso) {
        return res.status(400).json({ mensagem: "Corrida não encontrada ou não foi aceita ainda." });
      }

      return res.status(200).json({ mensagem: "Corrida iniciada!" });
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro ao iniciar corrida." });
    }
  }

  static async finalizar(req: Request, res: Response): Promise<Response> {
    try {
      const idCorrida = parseInt(req.params.id as string, 10);
      const { duracaoCorrida } = req.body;

      const sucesso = await Corrida.finalizarCorrida(idCorrida, duracaoCorrida);
      if (!sucesso) {
        return res.status(400).json({ mensagem: "Corrida não encontrada ou não está em andamento." });
      }

      return res.status(200).json({ mensagem: "Corrida finalizada com sucesso!" });
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro ao finalizar corrida." });
    }
  }

  static async cancelar(req: Request, res: Response): Promise<Response> {
    try {
      const idCorrida = parseInt(req.params.id as string, 10);
      const sucesso = await Corrida.cancelarCorrida(idCorrida);

      if (!sucesso) {
        return res.status(400).json({ mensagem: "Corrida não pode ser cancelada." });
      }

      return res.status(200).json({ mensagem: "Corrida cancelada." });
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro ao cancelar corrida." });
    }
  }
}

export { CorridaController };