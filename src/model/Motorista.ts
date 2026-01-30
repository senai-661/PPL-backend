import type { MotoristaDTO } from "../interface/MotoristaDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

class Motorista {
  private idMotorista: number = 0;
  private nomeMotorista: string;
  private sobrenomeMotorista: string;
  private cpf: number;
  private cnh: number;
  private dataNascimento: Date;
  private celular: number;
  private endereco: string;
  private antecedentesCriminais: string;

  constructor(
    _idMotorista: number = 0,
    _nomeMotorista: string,
    _sobrenomeMotorista: string,
    _cpf: number,
    _cnh: number,
    _dataNascimento: Date,
    _celular: number,
    _endereco: string,
    _antecedentesCriminais: string,
  ) {
    this.idMotorista = _idMotorista;
    this.nomeMotorista = _nomeMotorista;
    this.sobrenomeMotorista = _sobrenomeMotorista;
    this.cpf = _cpf;
    this.cnh = _cnh;
    this.dataNascimento = _dataNascimento;
    this.celular = _celular;
    this.endereco = _endereco;
    this.antecedentesCriminais = _antecedentesCriminais;
  }
  public getIdMotorista(): number {
    return this.idMotorista;
  }
  public setIdMotorista(idMotorista: number): void {
    this.idMotorista = idMotorista;
  }
  public getNomeMotorista(): string {
    return this.nomeMotorista;
  }
  public setNomeMotorista(nomeMotorista: string): void {
    this.nomeMotorista = nomeMotorista;
  }
  public getSobrenomeMotorista(): string {
    return this.sobrenomeMotorista;
  }
  public setSobrenomeMotorista(sobrenomeMotorista: string): void {
    this.sobrenomeMotorista = sobrenomeMotorista;
  }
  public getCpf(): number {
    return this.cpf;
  }
  public setCpf(cpf: number): void {
    this.cpf = cpf;
  }
  public getCnh(): number {
    return this.cnh;
  }
  public setCnh(cnh: number): void {
    this.cnh = cnh;
  }
  public getDataNascimento(): Date {
    return this.dataNascimento;
  }
  public setDataNascimento(dataNascimento: Date): void {
    this.dataNascimento = dataNascimento;
  }
  public getCelular(): number {
    return this.celular;
  }
  public setCelular(celular: number): void {
    this.celular = celular;
  }
  public getEndereco(): string {
    return this.endereco;
  }
  public setEndereco(endereco: string): void {
    this.endereco = endereco;
  }
  public getAntecedentesCriminais(): string {
    return this.antecedentesCriminais;
  }
  public setAntecedentesCriminais(antecedentesCriminais: string): void {
    this.antecedentesCriminais = antecedentesCriminais;
  }
}

export { Motorista };
