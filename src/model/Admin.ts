import { Usuario } from "./Usuario.js";

export class Admin extends Usuario {
  private idAdmin: number;

  constructor(
    idUsuario: number,
    nome: string,
    sobrenome: string,
    email: string,
    senha: string,
    criadoEm: Date,
    idAdmin: number,
  ) {
    super(idUsuario, nome, sobrenome, email, "admin", senha, criadoEm);
    this.idAdmin = idAdmin;
  }

  public getIdAdmin(): number { return this.idAdmin; }
  public setIdAdmin(v: number): void { this.idAdmin = v; }
}