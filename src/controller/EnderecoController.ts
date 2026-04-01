import type { Request, Response, NextFunction } from "express";
import { Endereco } from "../model/Endereco.js";
import type { EnderecoDTO } from "../interface/EnderecoDTO.js";

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