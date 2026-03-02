/* Basicamente o service funciona como um meio de centralizar e deixar as funções principais do AuthController 
mais limpas e evitar ficar repetindo funções igual a senha em todo santo controller */

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const SENHAMAX = "PPL_ladygagasenha"; // O coração da segurança

export class AuthService {
  // Gera o Token (Centralizado)
  static gerarToken(payload: object): string {
    return jwt.sign(payload, SENHAMAX, { expiresIn: "1h" });
  }

  // Compara a senha digitada com o Hash do banco
  static async compararSenha(
    senhaDigitada: string,
    senhaHash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(senhaDigitada, senhaHash);
  }

  // Cria um Hash seguro para salvar no banco
  static async hashSenha(senhaPlana: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(senhaPlana, salt);
  }
}
