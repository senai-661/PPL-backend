import type { Request, Response } from "express";
import { CorridaAgendamentoService } from "../services/CorridaAgendamentoService.js";

export class CorridaAgendamentoController {
  constructor(_model?: any) {}

  public async criar(req: Request, res: Response) {
    try {
      const idPassageiro = (req as any).usuario?.id;

      if (!idPassageiro) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const {
        origemCorrida,
        destinoCorrida,
        tipoCorrida,
        dataAgendada,
        preco,
      } = req.body;

      const resultado = await CorridaAgendamentoService.criar(idPassageiro, {
        origemCorrida,
        destinoCorrida,
        tipoCorrida,
        dataAgendada,
        preco,
      });

      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro ao agendar corrida" });
    }
  }

  public async listar(req: Request, res: Response) {
    try {
      const usuario = (req as any).usuario;

      if (!usuario || !usuario.id) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const resultado = await CorridaAgendamentoService.listar(usuario);
      return res.status(resultado.statusCode).json(resultado.data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro ao listar agendamentos" });
    }
  }
}
