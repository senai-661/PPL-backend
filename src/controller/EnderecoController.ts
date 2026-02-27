import type { Request, Response } from "express";
import { Endereco } from "../model/Endereco.js";
import type { EnderecoDTO } from "../interface/EnderecoDTO.js";

export class EnderecoController {

    static async listar(req: Request, res: Response): Promise<Response> {
        try {
            const enderecos = await Endereco.listarTodos();
            if (!enderecos) {
                return res.status(200).json([]); // Retorna lista vazia em vez de erro 500 se não houver nada
            }
            return res.status(200).json(enderecos);
        } catch (error) {
            console.error("Erro ao listar:", error);
            return res.status(500).json({ mensagem: "Erro ao buscar endereços." });
        }
    }

   static async cadastrarParaUsuario(
    idUsuario: number, 
    tipo: 'motorista' | 'passageiro', 
    dados: any
): Promise<boolean> {
    try {
        const enderecoDTO: EnderecoDTO = {
            rua: dados.rua,
            numero: dados.numero,
            bairro: dados.bairro,
            cidade: dados.cidade,
            estado: dados.estado,
            cep: dados.cep,
            complemento: dados.complemento || null,
            // Se for motorista, passa o ID, senão passa null
            id_motorista: tipo === 'motorista' ? idUsuario : null,
            // Se for passageiro, passa o ID, senão passa null
            id_passageiro: tipo === 'passageiro' ? idUsuario : null
        };

        const novoEndereco = new Endereco(enderecoDTO);
        return await Endereco.cadastro(novoEndereco);
    } catch (error) {
        console.error("Falha no cadastro de endereço:", error);
        return false;
    }
}
}