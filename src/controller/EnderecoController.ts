import type { Request, Response, NextFunction } from "express";
import { Endereco } from "../model/Endereco.js";
import type { EnderecoDTO } from "../interface/EnderecoDTO.js";
import { EnderecoService } from "../services/EnderecoService.js";

export class EnderecoController {
  static async listar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const enderecos = await Endereco.listarTodos();
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

      // Validar query parameter obrigatório
      if (!q || typeof q !== 'string') {
        return res.status(400).json({
          erro: 'Parâmetro "q" é obrigatório e deve ser uma string',
        });
      }

      // Limpar espaços em branco
      const query = q.trim();

      // Validar comprimento mínimo
      if (query.length < 2) {
        return res.status(400).json({
          erro: 'A busca deve ter pelo menos 2 caracteres',
        });
      }

      // Parse do limit (padrão: 5, máximo: 10)
      const limitNum = Math.min(parseInt(limit as string) || 5, 10);

      // Buscar sugestões
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

  // Internal method — keeps try/catch since it has no next()
  static async cadastrarParaUsuario(
    idUsuario: number,
    tipo: "motorista" | "passageiro",
    dados: any,
  ): Promise<boolean> {
    try {
      const enderecoDTO: EnderecoDTO = {
        rua: dados.rua,
        numero: dados.numero,
        bairro: dados.bairro,
        cidade: dados.cidade,
        estado: dados.estado,
        cep: dados.cep,
        complemento: dados.complemento,
        id_motorista: tipo === "motorista" ? idUsuario : null,
        id_passageiro: tipo === "passageiro" ? idUsuario : null,
      };

      const novoEndereco = new Endereco(enderecoDTO);
      return await Endereco.cadastro(novoEndereco);
    } catch (error) {
      console.error("Falha no cadastro de endereço:", error);
      return false;
    }
  }
}