import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

export abstract class Usuario {
  protected idUsuario: number;
  protected nome: string;
  protected sobrenome: string;
  protected email: string;
  protected tipoUsuario: string;
  protected senha: string;
  protected criadoEm: Date;

  constructor(
    idUsuario: number,
    nome: string,
    sobrenome: string,
    email: string,
    tipoUsuario: string,
    senha: string,
    criadoEm: Date,
  ) {
    this.idUsuario = idUsuario;
    this.nome = nome;
    this.sobrenome = sobrenome;
    this.email = email;
    this.tipoUsuario = tipoUsuario;
    this.senha = senha;
    this.criadoEm = criadoEm;
  }

  public getIdUsuario(): number { return this.idUsuario; }
  public getNome(): string { return this.nome; }
  public getSobrenome(): string { return this.sobrenome; }
  public getEmail(): string { return this.email; }
  public getTipoUsuario(): string { return this.tipoUsuario; }
  public getSenha(): string { return this.senha; }
  public getCriadoEm(): Date { return this.criadoEm; }

  public setIdUsuario(v: number): void { this.idUsuario = v; }
  public setNome(v: string): void { this.nome = v; }
  public setSobrenome(v: string): void { this.sobrenome = v; }
  public setEmail(v: string): void { this.email = v; }
  public setTipoUsuario(v: string): void { this.tipoUsuario = v; }
  public setSenha(v: string): void { this.senha = v; }
  public setCriadoEm(v: Date): void { this.criadoEm = v; }

  // Shared DB method — insert into usuario table, returns id_usuario
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
        [nome.toUpperCase(), sobrenome.toUpperCase(), email, senha, tipoUsuario]
      );
      return res.rows[0].id_usuario;
    } catch (error) {
      console.error(`Erro ao criar usuário: ${error}`);
      return null;
    }
  }

  // Single login — works for all user types
  static async buscarPorEmail(email: string): Promise<any | null> {
    try {
      const res = await database.query(
        `SELECT * FROM usuario WHERE email = $1;`,
        [email]
      );
      return res.rows.length > 0 ? res.rows[0] : null;
    } catch (error) {
      console.error(`Erro ao buscar usuário: ${error}`);
      return null;
    }
  }
}