import { Usuario } from "./Usuario.js";

export class Passageiro extends Usuario {
  private idPassageiro: number;
  private cpf: string;
  private celular: string;
  private dataNascimento: Date;
  private necessidades: string[];

  constructor(
    idUsuario: number,
    nome: string,
    sobrenome: string,
    email: string,
    senha: string,
    criadoEm: Date,
    idPassageiro: number,
    cpf: string,
    celular: string,
    dataNascimento: Date,
    necessidades: string[],
  ) {
    super(idUsuario, nome, sobrenome, email, "passageiro", senha, criadoEm);
    this.idPassageiro = idPassageiro;
    this.cpf = cpf;
    this.celular = celular;
    this.dataNascimento = dataNascimento;
    this.necessidades = necessidades;
  }

  public getIdPassageiro(): number { return this.idPassageiro; }
  public getCpf(): string { return this.cpf; }
  public getCelular(): string { return this.celular; }
  public getDataNascimento(): Date { return this.dataNascimento; }
  public getNecessidades(): string[] { return this.necessidades; }

  public setIdPassageiro(v: number): void { this.idPassageiro = v; }
  public setCpf(v: string): void { this.cpf = v; }
  public setCelular(v: string): void { this.celular = v; }
  public setDataNascimento(v: Date): void { this.dataNascimento = v; }
  public setNecessidades(v: string[]): void { this.necessidades = v; }
}
