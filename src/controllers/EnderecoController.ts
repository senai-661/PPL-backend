import type { Request, Response, NextFunction } from "express";
import { EnderecoService } from "../services/EnderecoService.js";

export class EnderecoController {
  static async listar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const enderecos = await EnderecoService.listarTodos();
      if (!enderecos) {
        return res.status(200).json([]);
      }
      return res.status(200).json(enderecos);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Busca sugestões de endereços com autocomplete
   * Query params: q (obrigatório), limit (opcional, padrão: 5)
   */
  static async buscarSugestoes(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { q, limit } = req.query;

      if (!q || typeof q !== "string") {
        return res.status(400).json({
          erro: 'Parâmetro "q" é obrigatório e deve ser uma string',
        });
      }

      const query = q.trim();

      if (query.length < 2) {
        return res.status(400).json({
          erro: "A busca deve ter pelo menos 2 caracteres",
        });
      }

      const limitNum = Math.min(parseInt(limit as string) || 5, 10);
      const sugestoes = await EnderecoService.buscarSugestoes(query, limitNum);

      return res.status(200).json({
        query,
        total: sugestoes.length,
        sugestoes,
      });
    } catch (error) {
      next(error);
    }
  }

  static async cadastrarParaUsuario(
    idUsuario: number,
    tipo: "motorista" | "passageiro",
    dados: any,
  ): Promise<boolean> {
    return await EnderecoService.cadastrarParaUsuario(idUsuario, tipo, dados);
  }

  static async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idEndereco = parseInt(req.params.id as string, 10);
      if (isNaN(idEndereco)) {
        return res.status(400).json({ mensagem: "ID do endereço inválido." });
      }

      const endereco = await EnderecoService.buscarPorId(idEndereco);
      if (!endereco) {
        return res.status(404).json({ mensagem: "Endereço não encontrado." });
      }

      return res.status(200).json(endereco);
    } catch (error) {
      next(error);
    }
  }

  static async criar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { rua, numero, bairro, cidade, estado, cep, complemento, idMotorista, idPassageiro } = req.body;

      const resultado = await EnderecoService.criar({
        rua,
        numero,
        bairro,
        cidade,
        estado,
        cep,
        complemento,
        idMotorista,
        idPassageiro,
      });

      if (!resultado.sucesso) {
        return res.status(400).json({ mensagem: resultado.erro });
      }

      return res.status(201).json({ mensagem: "Endereço cadastrado com sucesso." });
    } catch (error) {
      next(error);
    }
  }

  static async atualizar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idEndereco = parseInt(req.params.id as string, 10);
      if (isNaN(idEndereco)) {
        return res.status(400).json({ mensagem: "ID do endereço inválido." });
      }

      const sucesso = await EnderecoService.atualizar(idEndereco, req.body);
      if (!sucesso) {
        return res.status(400).json({ mensagem: "Não foi possível atualizar o endereço." });
      }

      return res.status(200).json({ mensagem: "Endereço atualizado com sucesso." });
    } catch (error) {
      next(error);
    }
  }

  static async remover(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idEndereco = parseInt(req.params.id as string, 10);
      if (isNaN(idEndereco)) {
        return res.status(400).json({ mensagem: "ID do endereço inválido." });
      }

      const sucesso = await EnderecoService.remover(idEndereco);
      if (!sucesso) {
        return res.status(404).json({ mensagem: "Endereço não encontrado ou não pôde ser excluído." });
      }

      return res.status(200).json({ mensagem: "Endereço excluído com sucesso." });
    } catch (error) {
      next(error);
    }
  }
}
