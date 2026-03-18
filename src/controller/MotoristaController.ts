import { Motorista } from "../model/Motorista.js";
import { EnderecoController } from "./EnderecoController.js";
import { AuthService } from "../services/AuthService.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";

class MotoristaController {
  static async listar(req: Request, res: Response): Promise<Response> {
    try {
      const motoristas = await Motorista.listarMotoristas();

      if (!motoristas || motoristas.length === 0) {
        return res.status(200).json([]);
      }

      // listarMotoristas() already returns plain objects, no getters needed
      return res.status(200).json(motoristas);
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro ao buscar lista de motoristas." });
    }
  }

  static async perfil(req: Request, res: Response): Promise<Response> {
    try {
      const idMotorista = (req as any).usuario.id;
      const motorista = await Motorista.buscarPorId(idMotorista);

      if (!motorista) {
        return res.status(404).json({ mensagem: "Motorista não encontrado." });
      }

      return res.status(200).json({
        id: motorista.getIdMotorista(),
        nome: motorista.getNome(),           // ✅
        sobrenome: motorista.getSobrenome(), // ✅
        cpf: motorista.getCpf(),
        cnh: motorista.getCnh(),
        dataNascimento: motorista.getDataNascimento(),
        celular: motorista.getCelular(),
        email: motorista.getEmail(),
        especializacao: motorista.getEspecializacao(),
        disponivel: motorista.getDisponivel(),
      });
    } catch (error) {
      console.error(`Erro ao buscar perfil: ${error}`);
      return res.status(500).json({ mensagem: "Erro ao buscar perfil." });
    }
  }

  static async editarPerfil(req: Request, res: Response): Promise<Response> {
    try {
      const idMotorista = (req as any).usuario.id;
      const dados = req.body;

      if (dados.senha) {
        const salt = await bcrypt.genSalt(10);
        dados.senha = await bcrypt.hash(dados.senha, salt);
      }

      const sucesso = await Motorista.editarPerfil(idMotorista, dados);
      if (!sucesso) {
        return res.status(400).json({ mensagem: "Nenhum campo válido para atualizar." });
      }

      return res.status(200).json({ mensagem: "Perfil atualizado com sucesso!" });
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro ao atualizar perfil." });
    }
  }
  static async alterarDisponibilidade(req: Request, res: Response): Promise<Response> {
  try {
    const idMotorista = (req as any).usuario.id;
    const { disponivel } = req.body;

    if (typeof disponivel !== "boolean") {
      return res.status(400).json({ mensagem: "Campo 'disponivel' deve ser true ou false." });
    }

    const sucesso = await Motorista.alterarDisponibilidade(idMotorista, disponivel);
    if (!sucesso) {
      return res.status(400).json({ mensagem: "Erro ao alterar disponibilidade." });
    }

    return res.status(200).json({
      mensagem: disponivel ? "Você está online! 🟢" : "Você está offline! 🔴"
    });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno." });
  }
}
}

export { MotoristaController };