import { DatabaseModel } from "../model/DatabaseModel.js";

const database = new DatabaseModel().pool;

export class UsuarioRepository {
  static async criarUsuario(
    nome: string,
    sobrenome: string,
    email: string,
    senha: string,
    tipoUsuario: string,
  ): Promise<number | null> {
    try {
      const res = await database.query(
        `INSERT INTO usuario (nome, sobrenome, email, senha, tipo_usuario)
         VALUES ($1, $2, $3, $4, $5) RETURNING id_usuario;`,
        [
          nome?.toUpperCase() ?? nome,
          sobrenome?.toUpperCase() ?? sobrenome,
          email,
          senha,
          tipoUsuario,
        ],
      );
      return res.rows[0].id_usuario;
    } catch (error) {
      console.error(`Erro ao criar usuario: ${error}`);
      throw error;
    }
  }

  static async buscarPorEmail(email: string): Promise<any | null> {
    try {
      const res = await database.query(
        `SELECT * FROM usuario WHERE email = $1;`,
        [email],
      );
      return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
      console.error(`Erro ao buscar usuario: ${error}`);
      return null;
    }
  }

  static async buscarParaLogin(email: string): Promise<any | null> {
    try {
      const res = await database.query(
        `SELECT u.*,
          p.id_passageiro, p.cpf AS p_cpf, p.celular AS p_celular,
          p.data_nascimento AS p_data_nascimento, p.necessidades,
          m.id_motorista, m.cpf AS m_cpf, m.cnh, m.celular AS m_celular,
          m.data_nascimento AS m_data_nascimento, m.antecedentes_criminais,
          m.especializacao, m.disponivel,
          a.id_admin
         FROM usuario u
         LEFT JOIN passageiro p ON p.id_usuario = u.id_usuario
         LEFT JOIN motorista m ON m.id_usuario = u.id_usuario
         LEFT JOIN administrador a ON a.id_usuario = u.id_usuario
         WHERE u.email = $1;`,
        [email],
      );
      return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
      console.error(`Erro ao buscar usuario para login: ${error}`);
      return null;
    }
  }
}
