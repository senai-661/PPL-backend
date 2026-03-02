import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

export class Admin {
  private id: number;
  private nome: string;
  private email: string;
  private senha: string;

  constructor(_id: number, _nome: string, _email: string, _senha: string) {
    this.id = _id;
    this.nome = _nome;
    this.email = _email;
    this.senha = _senha;
  }

  public getId(): number {
    return this.id;
  }
  public getNome(): string {
    return this.nome;
  }
  public getEmail(): string {
    return this.email;
  }
  public getSenha(): string {
    return this.senha;
  }
  public setId(id: number): void {
    this.id = id;
  }
  public setNome(nome: string): void {
    this.nome = nome;
  }
  public setEmail(email: string): void {
    this.email = email;
  }
  public setSenha(senha: string): void {
    this.senha = senha;
  }

  static async buscarPorEmail(email: string): Promise<Admin | null> {
    try {
      const res = await database.query(
        `SELECT * FROM administrador WHERE email = $1`,
        [email],
      );
      if (res.rows.length > 0) {
        const a = res.rows[0];
        return new Admin(a.id_admin, a.nome, a.email, a.senha);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  static async listarAdmins(): Promise<Array<Admin> | null> {
    try {
      const res = await database.query(
        `SELECT id_admin, nome, email, senha FROM administrador;`,
      );

      // Retorna um array de objetos Admin
      return res.rows.map(
        (a) => new Admin(a.id_admin, a.nome, a.email, a.senha),
      );
    } catch (error) {
      console.error("Erro ao listar admins:", error);
      return null;
    }
  }
}
