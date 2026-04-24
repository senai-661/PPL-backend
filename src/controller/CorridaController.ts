import { Corrida } from "../model/Corrida.js";
import { calcularPreco } from "../services/CalcularPreco.js";
import type { Request, Response, NextFunction } from "express";
import { DatabaseModel } from "../model/DatabaseModel.js";

const database = new DatabaseModel().pool;

class CorridaController {
  static async listar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const status = Array.isArray(req.query.status)
        ? req.query.status[0] as string
        : req.query.status as string | undefined;
      const usuario = (req as any).usuario;
      console.log("usuario do token:", usuario); 
      console.log("status:", status);            
      if (status) {
        const idMotorista = usuario.tipo === "motorista" ? usuario.id : undefined;
        
        console.log("idMotorista:", idMotorista);

        const corridas = await Corrida.listarPorStatus(status, idMotorista);
        
        console.log("corridas:", corridas);      
        
        return res.status(200).json(corridas ?? []);
      }
    } catch (error) {
      next(error);
    }
  }

  static async precoEstimado(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const {
        latOrigem, lngOrigem,
        latDestino, lngDestino,
        tipoCorrida,
      } = req.body;

      if (!latOrigem || !lngOrigem || !latDestino || !lngDestino) {
        return res.status(400).json({ mensagem: "Coordenadas de origem e destino são obrigatórias." });
      }

      const { preco, distanciaKm, duracaoEstimadaMin } = calcularPreco(
        latOrigem, lngOrigem, latDestino, lngDestino,
        tipoCorrida ?? "Convencional"
      );

      return res.status(200).json({
        preco,
        distanciaKm,
        duracaoEstimadaMin,
      });
    } catch (error) {
      next(error);
    }
  }

  static async solicitar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = (req as any).usuario.id;
      const {
        origemCorrida, destinoCorrida,
        latOrigem, lngOrigem,
        latDestino, lngDestino,
        tipoCorrida,
        numPassageiros,
        observacoes,
      } = req.body;

      const { preco, distanciaKm, duracaoEstimadaMin } = calcularPreco(
        latOrigem, lngOrigem, latDestino, lngDestino,
        tipoCorrida ?? "Convencional",
      );

      const idGerado = await Corrida.solicitarCorrida({
        idPassageiro,
        origemCorrida,
        destinoCorrida,
        tipoCorrida: tipoCorrida ?? "Convencional",
        preco,
        idMotorista: null,
        idVeiculo: null,
        dataCorrida: new Date(),
        duracaoCorrida: 0,
        motivoCancelamento: null,
        statusCorrida: "Pendente",
        numPassageiros: numPassageiros ?? 1,
        observacoes: observacoes ?? null,
      });

      if (!idGerado) {
        return res.status(400).json({ mensagem: "Erro ao solicitar corrida." });
      }

      return res.status(201).json({
        mensagem: "Corrida solicitada com sucesso! Aguardando motorista.",
        idCorrida: idGerado,
        tipoCorrida: tipoCorrida ?? "Convencional",
        preco,
        distanciaKm,
        duracaoEstimadaMin,
      });
    } catch (error) {
      next(error);
    }
  }

  static async aceitar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const idCorrida = parseInt(req.params.id as string, 10);
    const idMotorista = (req as any).usuario.id;

    const temCorridaAtiva = await Corrida.motoristaTemCorridaAtiva(idMotorista);
    if (temCorridaAtiva) {
      return res.status(400).json({ mensagem: "Você já está em uma corrida. Finalize ou cancele antes de aceitar outra." });
    }

    const veiculo = await database.query(
      `SELECT id_veiculo FROM veiculo WHERE id_motorista = $1 LIMIT 1;`,
      [idMotorista],
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
    next(error);
  }
}

  static async iniciar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idCorrida = parseInt(req.params.id as string, 10);
      const sucesso = await Corrida.iniciarCorrida(idCorrida);

      if (!sucesso) {
        return res.status(400).json({ mensagem: "Corrida não encontrada ou não foi aceita ainda." });
      }

      return res.status(200).json({ mensagem: "Corrida iniciada!" });
    } catch (error) {
      next(error);
    }
  }

  static async finalizar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
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
        return res.status(400).json({ mensagem: "Corrida não está em andamento." });
      }

      return res.status(200).json({
        mensagem: "Corrida finalizada com sucesso!",
        duracaoCorrida: `${duracaoCorrida} minutos`,
      });
    } catch (error) {
      next(error);
    }
  }

static async cancelar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const idCorrida = parseInt(req.params.id as string, 10);

    if (isNaN(idCorrida)) {
      return res.status(400).json({ mensagem: "ID da corrida inválido." });
    }

    const { motivoCancelamento } = req.body;

    const sucesso = await Corrida.cancelarCorrida(idCorrida, motivoCancelamento ?? null);
    if (!sucesso) {
      return res.status(400).json({ mensagem: "Corrida não pode ser cancelada." });
    }

    return res.status(200).json({ mensagem: "Corrida cancelada." });
  } catch (error) {
    next(error);
  }
}

  static async historico(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const usuario = (req as any).usuario;

      if (usuario.tipo === "passageiro") {
        const corridas = await Corrida.historicoPorPassageiro(usuario.id);
        return res.status(200).json(corridas ?? []);
      } else if (usuario.tipo === "motorista") {
        const corridas = await Corrida.historicoPorMotorista(usuario.id);
        return res.status(200).json(corridas ?? []);
      } else {
        return res.status(403).json({ mensagem: "Você não tem permissão para acessar essa área." });
      }
    } catch (error) {
      next(error);
    }
  }

  static async relatorio(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idMotorista = (req as any).usuario.id;
      const dados = await Corrida.relatorioMotorista(idMotorista);

      if (!dados) {
        return res.status(500).json({ mensagem: "Erro ao gerar relatório." });
      }

      return res.status(200).json(dados);
    } catch (error) {
      next(error);
    }
  }

  static async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
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
      next(error);
    }
  }

  static async corridaAtual(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = (req as any).usuario.id;
      const corrida = await Corrida.corridaAtualPassageiro(idPassageiro);

      if (!corrida) {
        return res.status(200).json({ mensagem: "Nenhuma corrida ativa no momento." });
      }

      return res.status(200).json(corrida);
    } catch (error) {
      next(error);
    }
  }

  static async corridaAtualMotorista(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const idMotorista = (req as any).usuario.id;
      const corrida = await Corrida.corridaAtualMotorista(idMotorista);

      if (!corrida) {
        return res.status(200).json({ mensagem: "Nenhuma corrida ativa no momento." });
      }

      return res.status(200).json(corrida);
    } catch (error) {
      next(error);
    }
  }

  static async resumoDiaMotorista(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const idMotorista = (req as any).usuario.id;
      const resumo = await Corrida.resumoDiaMotorista(idMotorista);

      if (!resumo) {
        return res.status(500).json({ mensagem: "Erro ao buscar resumo do dia." });
      }

      return res.status(200).json(resumo);
    } catch (error) {
      next(error);
    }
  }
}

export { CorridaController };