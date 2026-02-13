import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'chave_mestra_secreta';

export class AuthService {
    // RNF001: Processamento de Criptografia
    static async gerarHash(senha: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(senha, saltRounds);
    }

    static async compararSenha(senhaDigitada: string, senhaHash: string): Promise<boolean> {
        return await bcrypt.compare(senhaDigitada, senhaHash);
    }

    static gerarToken(payload: object): string {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
    }
}