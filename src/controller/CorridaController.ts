import { Corrida } from "../model/Corrida.js";
import { calcularPreco } from "../services/CalcularPreco.js";
import type { Request, Response } from "express";
import { DatabaseModel } from "../model/DatabaseModel.js";

const database = new DatabaseModel().pool;

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
    const idCorrida = parseInt(req.params.id as string, 10);
    
    // 👇 Get idMotorista from the token, not from the body
    const idMotorista = (req as any).usuario.id;

    // 👇 Fetch the motorista's vehicle automatically from DB
    const veiculo = await database.query(
      `SELECT id_veiculo FROM veiculo WHERE id_motorista = $1 LIMIT 1;`,
      [idMotorista]
    );

    if (veiculo.rows.length === 0) {
      return res.status(400).json({ mensagem: "Motorista não possui veículo cadastrado." });
    }

    const idVeiculo = veiculo.rows[0].id_veiculo;

    const sucesso = await Corrida.aceitarCorrida(idCorrida, idMotorista, idVeiculo);
    if (!sucesso) {
      return res.status(400).json({ mensagem: "Corrida não encontrada ou não está pendente." });
    }

    return res.status(200).json({ mensagem: "Corrida aceita! Aguardando início." });
  } catch (error) {
    console.error("❌ Erro ao aceitar corrida:", error);
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

    
    const corridaRes = await database.query(
      `SELECT data_corrida FROM corrida WHERE id_corrida = $1;`,
      [idCorrida]
    );

    if (corridaRes.rows.length === 0) {
      return res.status(404).json({ mensagem: "Corrida não encontrada." });
    }

    const dataInicio: Date = corridaRes.rows[0].data_corrida;
    const agora = new Date();
    const duracaoCorrida = Math.ceil(
      (agora.getTime() - dataInicio.getTime()) / 60000 // ms → minutes
    );

    const sucesso = await Corrida.finalizarCorrida(idCorrida, duracaoCorrida);
    if (!sucesso) {
      return res.status(400).json({ mensagem: "Corrida não está em andamento." });
    }

    return res.status(200).json({ 
      mensagem: "Corrida finalizada com sucesso!",
      duracaoCorrida: `${duracaoCorrida} minutos`,  
    });
  } catch (error) {
    console.error("❌ Erro ao finalizar corrida:", error);
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