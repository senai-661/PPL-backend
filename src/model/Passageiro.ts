import type { PassageiroDTO } from "../interface/PassageiroDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

class Passageiro {
  private idPassageiro: number = 0;
  private cpf: number;
  private nomePassageiro: string;
  private sobrenomePassageiro: string;
  private dataNascimento: Date;
  private endereco: string;
  private email: string;
  private celular: number;

  constructor(
    _idPassageiro: number = 0,
    _cpf: number,
    _nomePassageiro: string,
    _sobrenomePassageiro: string,
    _dataNascimento: Date,
    _endereco: string,
    _email: string,
    _celular: number,
  ) {
    this.idPassageiro = _idPassageiro;
    this.cpf = _cpf;
    this.nomePassageiro = _nomePassageiro;
    this.sobrenomePassageiro = _sobrenomePassageiro;
    this.dataNascimento = _dataNascimento;
    this.endereco = _endereco;
    this.email = _email;
    this.celular = _celular;
  }
  public getIdPassageiro(): number {
    return this.idPassageiro;
  }
  public setIdPassageiro(idPassageiro: number): void {
    this.idPassageiro = idPassageiro;
  }
  public getCpf(): number {
    return this.cpf;
  }
  public setCpf(cpf: number): void {
    this.cpf = cpf;
  }
  public getNomePassageiro(): string {
    return this.nomePassageiro;
  }
  public setNomePassageiro(nomePassageiro: string): void {
    this.nomePassageiro = nomePassageiro;
  }
  public getSobrenomePassageiro(): string {
    return this.sobrenomePassageiro;
  }
  public setSobrenomePassageiro(sobrenomePassageiro: string): void {
    this.sobrenomePassageiro = sobrenomePassageiro;
  }
  public getDataNascimento(): Date {
    return this.dataNascimento;
  }
  public setDataNascimento(dataNascimento: Date): void {
    this.dataNascimento = dataNascimento;
  }
  public getEndereco(): string {
    return this.endereco;
  }
  public setEndereco(endereco: string): void {
    this.endereco = endereco;
  }
  public getEmail(): string {
    return this.email;
  }
  public setEmail(email: string): void {
    this.email = email;
  }
  public getCelular(): number {
    return this.celular;
  }
  public setCelular(celular: number): void {
    this.celular = celular;
  }
}

export { Passageiro };
