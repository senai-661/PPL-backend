import { Request, Response } from "express";
import { CorridaModel } from "../model/CorridaAgendamento.js";

export class CorridaAgendamentoController {
  constructor(private model: CorridaModel) {}

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
        preco
      } = req.body;

      if (!origemCorrida || !destinoCorrida || !dataAgendada) {
        return res.status(400).json({ 
          error: "Origem, destino e data agendada são obrigatórios" 
        });
      }

      const result = await this.model.criarAgendamento({
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
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro ao agendar corrida" });
    }
  }

  public async listar(req: Request, res: Response) {
    try {
      const idPassageiro = (req as any).usuario?.id;

      if (!idPassageiro) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const agendamentos = await this.model.listarAgendamentosPorPassageiro(idPassageiro);
      return res.status(200).json(agendamentos);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro ao listar agendamentos" });
    }
  }
}