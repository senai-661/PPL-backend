import { Corrida } from "../model/Corrida.js";
import { calcularPreco } from "../services/CalcularPreco.js";
import type { Request, Response } from "express";
import { DatabaseModel } from "../model/DatabaseModel.js";

const database = new DatabaseModel().pool;

class CorridaController {
  // GET /api/corridas OR GET /api/corridas?status=Pendente
  static async listar(req: Request, res: Response): Promise<Response> {
    try {
      const status = req.query.status as string | undefined;
      const usuario = (req as any).usuario;

      if (status) {
        const validStatuses = [
          "Pendente",
          "Aceito",
          "Em andamento",
          "Finalizada",
          "Cancelada",
        ];
        if (!validStatuses.includes(status)) {
          return res.status(400).json({ mensagem: "Status inválido." });
        }

        // Pendente with matching only for motoristas
        const idMotorista =
          usuario.tipo === "motorista" ? usuario.id : undefined;
        const corridas = await Corrida.listarPorStatus(status, idMotorista);
        return res.status(200).json(corridas ?? []);
      }

      // No filter — return all
      const corridas = await Corrida.listarCorridas();
      return res.status(200).json(corridas ?? []);
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Não foi possível acessar a lista de corridas." });
    }
  }

  static async solicitar(req: Request, res: Response): Promise<Response> {
    try {
      const idPassageiro = (req as any).usuario.id;
      const {
        origemCorrida,
        destinoCorrida,
        latOrigem,
        lngOrigem,
        latDestino,
        lngDestino,
        tipoViagem,
      } = req.body;

      const { preco, distanciaKm, duracaoEstimadaMin } = calcularPreco(
        latOrigem,
        lngOrigem,
        latDestino,
        lngDestino,
        tipoViagem ?? "Convencional",
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
        motivoCancelamento: null,
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
      return res
        .status(500)
        .json({ mensagem: "Erro interno ao solicitar corrida." });
    }
  }

  static async aceitar(req: Request, res: Response): Promise<Response> {
    try {
      const idCorrida = parseInt(req.params.id as string, 10);
      const idMotorista = (req as any).usuario.id;

      const veiculo = await database.query(
        `SELECT id_veiculo FROM veiculo WHERE id_motorista = $1 LIMIT 1;`,
        [idMotorista],
      );

      if (veiculo.rows.length === 0) {
        return res
          .status(400)
          .json({ mensagem: "Motorista não possui veículo cadastrado." });
      }

      const idVeiculo = veiculo.rows[0].id_veiculo;
      const sucesso = await Corrida.aceitarCorrida(
        idCorrida,
        idMotorista,
        idVeiculo,
      );

      if (!sucesso) {
        return res
          .status(400)
          .json({ mensagem: "Corrida não encontrada ou não está pendente." });
      }

      return res
        .status(200)
        .json({ mensagem: "Corrida aceita! Aguardando início." });
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
        return res.status(400).json({
          mensagem: "Corrida não encontrada ou não foi aceita ainda.",
        });
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
        [idCorrida],
      );

      if (corridaRes.rows.length === 0) {
        return res.status(404).json({ mensagem: "Corrida não encontrada." });
      }

      const dataInicio: Date = corridaRes.rows[0].data_corrida;
      const duracaoCorrida = Math.ceil(
        (new Date().getTime() - dataInicio.getTime()) / 60000,
      );

      const sucesso = await Corrida.finalizarCorrida(idCorrida, duracaoCorrida);
      if (!sucesso) {
        return res
          .status(400)
          .json({ mensagem: "Corrida não está em andamento." });
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

  // Updated — now accepts motivoCancelamento from body
  static async cancelar(req: Request, res: Response): Promise<Response> {
    try {
      const idCorrida = parseInt(req.params.id as string, 10);
      const { motivoCancelamento } = req.body;

      const sucesso = await Corrida.cancelarCorrida(
        idCorrida,
        motivoCancelamento ?? null,
      );
      if (!sucesso) {
        return res
          .status(400)
          .json({ mensagem: "Corrida não pode ser cancelada." });
      }

      return res.status(200).json({ mensagem: "Corrida cancelada." });
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro ao cancelar corrida." });
    }
  }

  static async historico(req: Request, res: Response): Promise<Response> {
    try {
      const usuario = (req as any).usuario;

      if (usuario.tipo === "passageiro") {
        const corridas = await Corrida.historicoPorPassageiro(usuario.id);
        return res.status(200).json(corridas ?? []);
      } else if (usuario.tipo === "motorista") {
        const corridas = await Corrida.historicoPorMotorista(usuario.id);
        return res.status(200).json(corridas ?? []);
      } else {
        return res.status(403).json({ mensagem: "Tipo de usuário inválido." });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro ao buscar histórico de corridas." });
    }
  }

  // New — motorista's own report
  static async relatorio(req: Request, res: Response): Promise<Response> {
    try {
      const idMotorista = (req as any).usuario.id;
      const dados = await Corrida.relatorioMotorista(idMotorista);

      if (!dados) {
        return res.status(500).json({ mensagem: "Erro ao gerar relatório." });
      }

      return res.status(200).json(dados);
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro interno ao gerar relatório." });
    }
  }
  static async buscarPorId(req: Request, res: Response): Promise<Response> {
  try {
    const idCorrida = parseInt(req.params.id as string, 10);

    if (isNaN(idCorrida)) {
      return res.status(400).json({ mensagem: "ID inválido." });
    }

    const corrida = await Corrida.buscarPorId(idCorrida);

    if (!corrida) {
      return res.status(404).json({ mensagem: "Corrida não encontrada." });
    }

    return res.status(200).json(corrida);
  } catch (error) {
    console.error(`Erro ao buscar corrida: ${error}`);
    return res.status(500).json({ mensagem: "Erro ao buscar corrida." });
  }
}
}

export { CorridaController };
