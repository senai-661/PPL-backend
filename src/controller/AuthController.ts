import type { Request, Response } from 'express';
import { Passageiro } from '../model/Passageiro.js';
import { AuthService } from '../services/AuthService.js';

export class AuthController {
    /**
     * Método de Login para Passageiros
     * Atende ao RNF001: Processamento de autenticação segura
     */
    public async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, senha } = req.body;

            // Validação básica de entrada
            if (!email || !senha) {
                return res.status(400).json({ 
                    error: "Dados insuficientes. Informe e-mail e senha." 
                });
            }

            // 1. Busca o usuário no banco pelo e-mail
            // Usamos o método que criamos no Model Passageiro
            const passageiroBD = await Passageiro.buscarPorEmail(email);

            // Se o usuário não existir
            if (!passageiroBD) {
                return res.status(401).json({ error: "E-mail ou senha inválidos." });
            }

            // 2. Comparação de Hash (RNF001 - Segurança)
            // O AuthService.compararSenha usa o bcrypt para ver se a senha bate
            const senhaValida = await AuthService.compararSenha(senha, passageiroBD.senha);

            if (!senhaValida) {
                return res.status(401).json({ error: "E-mail ou senha inválidos." });
            }

            // 3. Geração do Token JWT
            // Aqui ele já pega o seu "sao_paulo_futebol_clube" do .env automaticamente
            const token = AuthService.gerarToken({
                id: passageiroBD.id_passageiro,
                email: passageiroBD.email,
                perfil: 'PASSAGEIRO'
            });

            // 4. Resposta de Sucesso
            return res.status(200).json({
                auth: true,
                mensagem: "Login efetuado com sucesso!",
                token: token,
                user: {
                    id: passageiroBD.id_passageiro,
                    nome: passageiroBD.nome_passageiro,
                    email: passageiroBD.email
                }
            });

        } catch (error) {
            console.error("Erro no processamento do login:", error);
            return res.status(500).json({ error: "Erro interno no servidor." });
        }
    }
}