import type { Request, Response, NextFunction } from "express";
import { CorridaService } from "../services/CorridaService.js";

class CorridaController {
  static async listar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const status = Array.isArray(req.query.status)
        ? req.query.status[0] as string
        : req.query.status as string | undefined;
      const usuario = (req as any).usuario;

      const idMotorista = usuario?.tipo === "motorista" ? usuario.id : undefined;
      const corridas = await CorridaService.listar(status, idMotorista);
      return res.status(200).json(corridas);
    } catch (error) {
      next(error);
    }
  }

  static async precoEstimado(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const resultado = await CorridaService.precoEstimado(req.body);
      return res.status(200).json(resultado);
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ mensagem: error.message });
      }
      next(error);
    }
  }

  static async solicitar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = (req as any).usuario.id;
      const resultado = await CorridaService.solicitar(idPassageiro, req.body);
      return res.status(201).json(resultado);
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ mensagem: error.message });
      }
      next(error);
    }
  }

  static async aceitar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idCorrida = parseInt(req.params.id as string, 10);
      const idMotorista = (req as any).usuario.id;

      const resultado = await CorridaService.aceitar(idCorrida, idMotorista);
      if (!resultado.sucesso) {
        if (resultado.semVeiculo) {
          return res.status(400).json({ mensagem: resultado.mensagem, semVeiculo: true });
        }
        return res.status(400).json({ mensagem: resultado.mensagem });
      }

      return res.status(200).json({ mensagem: resultado.mensagem });
    } catch (error) {
      next(error);
    }
  }

  static async iniciar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idCorrida = parseInt(req.params.id as string, 10);
      const idMotorista = (req as any).usuario.id;
      const sucesso = await CorridaService.iniciar(idCorrida, idMotorista);

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
      const idMotorista = (req as any).usuario.id;

      const resultado = await CorridaService.finalizar(idCorrida, idMotorista);
      if (!resultado.sucesso) {
        return res.status(resultado.statusHttp || 400).json({ mensagem: resultado.mensagem });
      }

      return res.status(200).json({
        mensagem: resultado.mensagem,
        duracaoCorrida: resultado.duracaoCorrida,
      });
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ mensagem: error.message });
      }
      next(error);
    }
  }

  static async cancelar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idCorrida = parseInt(req.params.id as string, 10);
      const usuario = (req as any).usuario;
      const { motivoCancelamento } = req.body;

      const resultado = await CorridaService.cancelar(idCorrida, usuario, motivoCancelamento);
      if (!resultado.sucesso) {
        return res.status(resultado.statusHttp || 400).json({ mensagem: resultado.mensagem });
      }

      return res.status(200).json({ mensagem: resultado.mensagem });
    } catch (error) {
      next(error);
    }
  }

  static async cancelarAtual(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = (req as any).usuario.id;
      const sucesso = await CorridaService.cancelarAtual(idPassageiro);

      if (!sucesso) {
        return res.status(404).json({ mensagem: "Nenhuma corrida pendente encontrada." });
      }

      return res.status(200).json({ mensagem: "Corrida cancelada com sucesso." });
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ mensagem: error.message });
      }
      next(error);
    }
  }

  static async historico(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const usuario = (req as any).usuario;
      if (usuario.tipo !== "passageiro" && usuario.tipo !== "motorista") {
        return res.status(403).json({ mensagem: "Você não tem permissão para acessar essa área." });
      }

      const corridas = await CorridaService.historico(usuario);
      return res.status(200).json(corridas);
    } catch (error) {
      next(error);
    }
  }

  static async relatorio(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idMotorista = (req as any).usuario.id;
      const dados = await CorridaService.relatorioMotorista(idMotorista);

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
      const usuario = (req as any).usuario;

      const corrida = await CorridaService.buscarPorId(idCorrida, usuario);
      if (!corrida) {
        return res.status(404).json({ mensagem: "Corrida não encontrada." });
      }

      return res.status(200).json(corrida);
    } catch (error: any) {
      if (error.status === 403) {
        return res.status(403).json({ mensagem: error.message });
      }
      if (error.message) {
        return res.status(400).json({ mensagem: error.message });
      }
      next(error);
    }
  }

  static async corridaAtual(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = (req as any).usuario.id;
      const corrida = await CorridaService.corridaAtualPassageiro(idPassageiro);

      if (!corrida) {
        return res.status(200).json({ mensagem: "Nenhuma corrida ativa no momento." });
      }

      return res.status(200).json(corrida);
    } catch (error) {
      next(error);
    }
  }

  static async corridaAtualMotorista(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idMotorista = (req as any).usuario.id;
      const corrida = await CorridaService.corridaAtualMotorista(idMotorista);

      if (!corrida) {
        return res.status(200).json({ mensagem: "Nenhuma corrida ativa no momento." });
      }

      return res.status(200).json(corrida);
    } catch (error) {
      next(error);
    }
  }

  static async resumoDiaMotorista(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idMotorista = (req as any).usuario.id;
      const resumo = await CorridaService.resumoDiaMotorista(idMotorista);

      if (!resumo) {
        return res.status(500).json({ mensagem: "Erro ao buscar resumo do dia." });
      }

      return res.status(200).json(resumo);
    } catch (error) {
      next(error);
    }
  }

  static async remover(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idCorrida = parseInt(req.params.id as string, 10);
      const sucesso = await CorridaService.remover(idCorrida);

      if (!sucesso) {
        return res.status(404).json({ mensagem: "Corrida não encontrada ou não pôde ser excluída." });
      }

      return res.status(200).json({ mensagem: "Corrida excluída com sucesso." });
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ mensagem: error.message });
      }
      next(error);
    }
  }
}

export { CorridaController };
