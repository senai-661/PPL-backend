import { Motorista } from "../model/Motorista.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt"; 

class MotoristaController extends Motorista {
    
    // LISTAR: Retorna os dados usando os Getters, sem expor a senha
    static async listar(req: Request, res: Response): Promise<Response> {
        try {
            const motoristas = await Motorista.listarMotoristas();

            if (!motoristas || motoristas.length === 0) {
                return res.status(200).json([]);
            }

            const dadosTratados = motoristas.map(m => ({
                id: m.getIdMotorista(),
                nome: m.getNomeMotorista(),
                sobrenome: m.getSobrenomeMotorista(),
                cpf: m.getCpf(),
                cnh: m.getCnh(),
                dataNascimento: m.getDataNascimento(),
                celular: m.getCelular(),
                email: m.getEmail(),
                antecedentes: m.getAntecedentesCriminais()
            }));

            return res.status(200).json(dadosTratados);
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro ao buscar lista de motoristas." });
        }
    }

    // LOGIN: Verifica email e senha (bcrypt)
    static async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, senha } = req.body;

            const motorista = await Motorista.buscarPorEmail(email);

            if (!motorista) {
                return res.status(401).json({ mensagem: "E-mail ou senha inválidos." });
            }

            const senhaValida = await bcrypt.compare(senha, motorista.getSenha());

            if (!senhaValida) {
                return res.status(401).json({ mensagem: "E-mail ou senha inválidos." });
            }

            return res.status(200).json({
                mensagem: "Login realizado com sucesso!",
                motorista: {
                    id: motorista.getIdMotorista(),
                    nome: motorista.getNomeMotorista(),
                    email: motorista.getEmail()
                }
            });
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }

    // CADASTRO: Criptografa a senha antes de salvar
    static async cadastro(req: Request, res: Response): Promise<Response> {
        try {
            const dadosMotorista = req.body;

            // Validação básica: já existe este email?
            const jaExiste = await Motorista.buscarPorEmail(dadosMotorista.email);
            if (jaExiste) {
                return res.status(400).json({ mensagem: "Este e-mail já está cadastrado." });
            }

            // Gerar Hash da Senha
            const salt = await bcrypt.genSalt(10);
            dadosMotorista.senha = await bcrypt.hash(dadosMotorista.senha, salt);

            const sucesso = await Motorista.cadastrarMotorista(dadosMotorista);
            
            if (sucesso) {
                return res.status(201).json({ mensagem: "Motorista cadastrado com sucesso." });
            } 
            return res.status(400).json({ mensagem: "Erro ao cadastrar motorista." });
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro ao processar cadastro." });
        }
    }
}

export { MotoristaController };