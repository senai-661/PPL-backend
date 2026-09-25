import type { Request, Response, NextFunction } from "express";
import { CorridaAgendamentoService } from "../services/CorridaAgendamentoService.js";

export class CorridaAgendamentoController {
  public static async criar(req: Request, res: Response, next?: NextFunction): Promise<Response | void> {
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
        preco
      } = req.body;

      if (!origemCorrida || !destinoCorrida || !dataAgendada) {
        return res.status(400).json({ 
          error: "Origem, destino e data agendada são obrigatórios" 
        });
      }

      const result = await CorridaAgendamentoService.criarAgendamento({
        idPassageiro,
        origemCorrida,
        destinoCorrida,
        tipoCorrida: tipoCorrida || 'NORMAL',
        dataAgendada,
        statusAgendamento: 'PENDENTE',
        preco: preco || 28,
      });

      return res.status(201).json({
        mensagem: "Corrida agendada com sucesso!",
        agendamento: result
      });
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      console.error("Erro ao agendar corrida:", error);
      return res.status(500).json({ error: "Erro ao agendar corrida" });
    }
  }

  public static async listar(req: Request, res: Response, next?: NextFunction): Promise<Response | void> {
    try {
      const usuario = (req as any).usuario;

      if (!usuario || !usuario.id) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const agendamentos = await CorridaAgendamentoService.listarAgendamentos(usuario);
      return res.status(200).json(agendamentos);
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      console.error("Erro ao listar agendamentos:", error);
      return res.status(500).json({ error: "Erro ao listar agendamentos" });
    }
  }
}