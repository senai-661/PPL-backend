import { Passageiro } from "../model/Passageiro.js";
import { Corrida } from "../model/Corrida.js";
import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { DatabaseModel } from "../model/DatabaseModel.js";

const database = new DatabaseModel().pool;

class PassageiroController {
  static async listar(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { idPassageiro } = req.query;
      if (idPassageiro) {
        const id = parseInt(idPassageiro as string, 10);
        if (!isNaN(id)) {
          const passageiro = await Passageiro.buscarPorId(id);
          if (!passageiro) return res.status(404).json({ mensagem: "Passageiro não encontrado." });
          return res.status(200).json({
            id: passageiro.getIdPassageiro(),
            nome: passageiro.getNome(),
            sobrenome: passageiro.getSobrenome(),
            cpf: passageiro.getCpf(),
            dataNascimento: passageiro.getDataNascimento(),
            celular: passageiro.getCelular(),
            email: passageiro.getEmail(),
            necessidades: passageiro.getNecessidades(),
          });
        }
      }

      const passageiros = await Passageiro.listarPassageiros();

      if (!passageiros || passageiros.length === 0) {
        return res.status(200).json([]);
      }

      const dadosTratados = passageiros.map((p) => ({
        id: p.getIdPassageiro(),
        nome: p.getNome(),
        sobrenome: p.getSobrenome(),
        cpf: p.getCpf(),
        dataNascimento: p.getDataNascimento(),
        celular: p.getCelular(),
        email: p.getEmail(),
        necessidades: p.getNecessidades(),
      }));

      return res.status(200).json(dadosTratados);
    } catch (error) {
      next(error);
    }
  }

  static async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = parseInt(req.params.id as string, 10);
      if (isNaN(idPassageiro)) {
        return res.status(400).json({ mensagem: "ID do passageiro inválido." });
      }

      const passageiro = await Passageiro.buscarPorId(idPassageiro);
      if (!passageiro) {
        return res.status(404).json({ mensagem: "Passageiro não encontrado." });
      }

      const enderecoRes = await database.query(
        `SELECT rua, numero, bairro, cidade, estado, cep, complemento
         FROM endereco 
         WHERE id_passageiro = $1
         LIMIT 1;`,
        [idPassageiro]
      );

      let enderecoCompleto = null;
      if (enderecoRes.rows.length > 0) {
        const e = enderecoRes.rows[0];
        enderecoCompleto = `${e.rua}, ${e.numero} - ${e.bairro}, ${e.cidade} - ${e.estado}, CEP: ${e.cep}`;
        if (e.complemento) enderecoCompleto += ` (${e.complemento})`;
      }

      return res.status(200).json({
        id: passageiro.getIdPassageiro(),
        idPassageiro: passageiro.getIdPassageiro(),
        nome: passageiro.getNome(),
        sobrenome: passageiro.getSobrenome(),
        cpf: passageiro.getCpf(),
        dataNascimento: passageiro.getDataNascimento(),
        celular: passageiro.getCelular(),
        email: passageiro.getEmail(),
        necessidades: passageiro.getNecessidades(),
        endereco: enderecoCompleto,
      });
    } catch (error) {
      next(error);
    }
  }

  static async remover(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = parseInt(req.params.id as string, 10);
      if (isNaN(idPassageiro)) {
        return res.status(400).json({ mensagem: "ID do passageiro inválido." });
      }

      const sucesso = await Passageiro.deletarPassageiro(idPassageiro);
      if (!sucesso) {
        return res.status(404).json({ mensagem: "Passageiro não encontrado ou não pôde ser excluído." });
      }

      return res.status(200).json({ mensagem: "Passageiro excluído com sucesso." });
    } catch (error) {
      next(error);
    }
  }


 static async perfil(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const idPassageiro = (req as any).usuario.id;
    const passageiro = await Passageiro.buscarPorId(idPassageiro);

    if (!passageiro) {
      return res.status(404).json({ mensagem: "Passageiro não encontrado." });
    }

   
    const enderecoRes = await database.query(
      `SELECT rua, numero, bairro, cidade, estado, cep, complemento
       FROM endereco 
       WHERE id_passageiro = $1
       LIMIT 1;`,
      [idPassageiro]
    );

    let enderecoCompleto = null;
    if (enderecoRes.rows.length > 0) {
      const e = enderecoRes.rows[0];
      enderecoCompleto = `${e.rua}, ${e.numero} - ${e.bairro}, ${e.cidade} - ${e.estado}, CEP: ${e.cep}`;
      if (e.complemento) enderecoCompleto += ` (${e.complemento})`;
    }

    return res.status(200).json({
      id: passageiro.getIdPassageiro(),
      nome: passageiro.getNome(),
      sobrenome: passageiro.getSobrenome(),
      cpf: passageiro.getCpf(),
      dataNascimento: passageiro.getDataNascimento(),
      celular: passageiro.getCelular(),
      email: passageiro.getEmail(),
      necessidades: passageiro.getNecessidades(),
      endereco: enderecoCompleto,  
    });
  } catch (error) {
    next(error);
  }
}

  static async editarPerfil(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idPassageiro = (req as any).usuario.id;
      const dados = req.body;

      if (dados.senha) {
        const salt = await bcrypt.genSalt(10);
        dados.senha = await bcrypt.hash(dados.senha, salt);
      }

      const sucesso = await Passageiro.editarPerfil(idPassageiro, dados);
      if (!sucesso) {
        return res.status(400).json({ mensagem: "Nenhum campo válido para atualizar." });
      }

      return res.status(200).json({ mensagem: "Perfil atualizado com sucesso!" });
    } catch (error) {
      next(error);
    }
  }
  
static async relatorio(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const idPassageiro = (req as any).usuario.id;
    const dados = await Corrida.relatorioPassageiro(idPassageiro);

    if (!dados) {
      return res.status(500).json({ mensagem: "Erro ao gerar relatório." });
    }

    return res.status(200).json(dados);
  } catch (error) {
    next(error);
  }
}
}

export { PassageiroController };