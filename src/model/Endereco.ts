import type { EnderecoDTO } from "../interface/EnderecoDTO.js";

export class Endereco {
  private id_endereco?: number | null | undefined;
  private rua: string;
  private numero: string;
  private bairro: string;
  private cidade: string;
  private estado: string;
  private cep: string;
  private complemento: string | null;
  private id_motorista: number | null;
  private id_passageiro: number | null;

  constructor(dados: EnderecoDTO) {
    this.id_endereco = dados.id_endereco ?? null;
    this.rua = dados.rua;
    this.numero = dados.numero;
    this.bairro = dados.bairro;
    this.cidade = dados.cidade;
    this.estado = dados.estado;
    this.cep = dados.cep;
    this.complemento = dados.complemento ?? null;
    this.id_motorista = dados.id_motorista ?? null;
    this.id_passageiro = dados.id_passageiro ?? null;
  }

  public getIdEndereco(): number | null | undefined {
    return this.id_endereco;
  }
  public setIdEndereco(value: number | null | undefined) {
    this.id_endereco = value;
  }

  public getRua(): string {
    return this.rua;
  }
  public setRua(value: string) {
    this.rua = value;
  }

  public getNumero(): string {
    return this.numero;
  }
  public setNumero(value: string) {
    this.numero = value;
  }

  public getBairro(): string {
    return this.bairro;
  }
  public setBairro(value: string) {
    this.bairro = value;
  }

  public getCidade(): string {
    return this.cidade;
  }
  public setCidade(value: string) {
    this.cidade = value;
  }

  public getEstado(): string {
    return this.estado;
  }
  public setEstado(value: string) {
    this.estado = value;
  }

  public getCep(): string {
    return this.cep;
  }
  public setCep(value: string) {
    this.cep = value;
  }

  public getComplemento(): string | null {
    return this.complemento;
  }
  public setComplemento(value: string | null) {
    this.complemento = value;
  }

  public getIdMotorista(): number | null {
    return this.id_motorista;
  }
  public setIdMotorista(value: number | null) {
    this.id_motorista = value;
  }

  public getIdPassageiro(): number | null {
    return this.id_passageiro;
  }
  public setIdPassageiro(value: number | null) {
    this.id_passageiro = value;
  }
}
