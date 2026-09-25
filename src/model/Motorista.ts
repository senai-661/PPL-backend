import { Usuario } from "./Usuario.js";

export class Motorista extends Usuario {
  private idMotorista: number;
  private cpf: string;
  private cnh: string;
  private celular: string;
  private dataNascimento: Date;
  private antecedentesCriminais: string;
  private especializacao: string;
  private disponivel: boolean;

  constructor(
    idUsuario: number,
    nome: string,
    sobrenome: string,
    email: string,
    senha: string,
    criadoEm: Date,
    idMotorista: number,
    cpf: string,
    cnh: string,
    celular: string,
    dataNascimento: Date,
    antecedentesCriminais: string,
    especializacao: string,
    disponivel: boolean = false,
  ) {
    super(idUsuario, nome, sobrenome, email, "motorista", senha, criadoEm);
    this.idMotorista = idMotorista;
    this.cpf = cpf;
    this.cnh = cnh;
    this.celular = celular;
    this.dataNascimento = dataNascimento;
    this.antecedentesCriminais = antecedentesCriminais;
    this.especializacao = especializacao;
    this.disponivel = disponivel;
  }

  public getIdMotorista(): number { return this.idMotorista; }
  public getCpf(): string { return this.cpf; }
  public getCnh(): string { return this.cnh; }
  public getCelular(): string { return this.celular; }
  public getDataNascimento(): Date { return this.dataNascimento; }
  public getAntecedentesCriminais(): string { return this.antecedentesCriminais; }
  public getEspecializacao(): string { return this.especializacao; }
  public getDisponivel(): boolean { return this.disponivel; }

  public setIdMotorista(v: number): void { this.idMotorista = v; }
  public setCpf(v: string): void { this.cpf = v; }
  public setCnh(v: string): void { this.cnh = v; }
  public setCelular(v: string): void { this.celular = v; }
  public setDataNascimento(v: Date): void { this.dataNascimento = v; }
  public setAntecedentesCriminais(v: string): void { this.antecedentesCriminais = v; }
  public setEspecializacao(v: string): void { this.especializacao = v; }
  public setDisponivel(v: boolean): void { this.disponivel = v; }
}
