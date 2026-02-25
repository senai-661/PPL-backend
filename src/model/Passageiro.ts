import type { PassageiroDTO } from "../interface/PassageiroDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

class Passageiro {
  private idPassageiro: number = 0;
  private cpf: number;
  private nomePassageiro: string;
  private sobrenomePassageiro: string;
  private cnh: number;
  private dataNascimento: Date;
  private endereco: string;
  private email: string;
  private celular: number;
 

  constructor(
    _idPassageiro: number = 0,
    _nomePassageiro: string,
    _sobrenomePassageiro: string,
    _cpf: number,
    _cnh: number,
    _dataNascimento: Date,
    _celular: number,
    _endereco: string,
    _email: string, 
  ) {
    this.idPassageiro = _idPassageiro;
    this.nomePassageiro = _nomePassageiro;
    this.sobrenomePassageiro = _sobrenomePassageiro;
    this.cpf = _cpf;
    this.cnh = _cnh;
    this.dataNascimento = _dataNascimento;
    this.celular = _celular;
    this.endereco = _endereco;
    this.email = _email;
  }
  public getIdPassageiro(): number {
    return this.idPassageiro;
  }
  public setIdPassageiro(idPassageiro: number): void {
    this.idPassageiro = idPassageiro;
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
  public getEmail(): string {
    return this.email;
  }
  public setEmail(email: string): void {
    this.email = email;
  }

  static async listarPassageiros(): Promise<Array<Passageiro> | null> {
    try {
      let listaDePassageiros: Array<Passageiro> = [];
      const querySelectPassageiros = `SELECT * FROM passageiro;`;
      const respostaBD = await database.query(querySelectPassageiros);
      respostaBD.rows.forEach((passageiroBD) => {
        const novoPassageiro: Passageiro = new Passageiro(
          passageiroBD.id_passageiro,
          passageiroBD.nome_passageiro,
          passageiroBD.sobrenome_passageiro,
          passageiroBD.cpf,
          passageiroBD.cnh,
          passageiroBD.data_nascimento,
          passageiroBD.celular,
          passageiroBD.endereco,
          passageiroBD.email,
        );
        novoPassageiro.setIdPassageiro(passageiroBD.id_passageiro);
        listaDePassageiros.push(novoPassageiro);
      });
      return listaDePassageiros;
    } catch (error) {
      console.error(`Erro ao consultar passageiros. ${error}`);
      return null;
    }
  }
  static async cadastrarPassageiro(passageiro: PassageiroDTO): Promise<boolean> {
    try {
      const queryInsertPassageiro = `INSERT INTO passageiro (cpf, cnh, nome_passageiro, sobrenome_passageiro, data_nascimento, celular, endereco, email)
                                      VALUES
                                      ($1, $2, $3, $4, $5, $6, $7, $8)
                                      RETURNING id_passageiro;`;

      const respostaBD = await database.query(queryInsertPassageiro, [
        passageiro.cpf,
        passageiro.nomePassageiro.toUpperCase(),
        passageiro.sobrenomePassageiro.toUpperCase(),
        passageiro.dataNascimento,
        passageiro.celular,
        passageiro.endereco,
        passageiro.email,
      ]);

      return respostaBD.rows.length > 0;
    } catch (error) {
      console.error(`Erro ao cadastrar passageiro. ${error}`);
      return false;
    }
  }
}

export { Passageiro };
