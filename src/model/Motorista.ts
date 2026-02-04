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

  static async listarMotoristas(): Promise<Array<Motorista> | null> {
    try {
      let listaDeMotoristas: Array<Motorista> = [];
      const querySelectMotoristas = `SELECT * FROM motorista;`;
      const respostaBD = await database.query(querySelectMotoristas);
      respostaBD.rows.forEach((motoristaBD) => {
        const novoMotorista: Motorista = new Motorista(
          motoristaBD.id_motorista,
          motoristaBD.nome_motorista,
          motoristaBD.sobrenome_motorista,
          motoristaBD.cpf,
          motoristaBD.cnh,
          motoristaBD.data_nascimento,
          motoristaBD.celular,
          motoristaBD.endereco,
          motoristaBD.antecedentes_criminais,
        );
        novoMotorista.setIdMotorista(motoristaBD.id_motorista);
        listaDeMotoristas.push(novoMotorista);
      });
      return listaDeMotoristas;
    } catch (error) {
      console.error(`Erro ao consultar motoristas. ${error}`);
      return null;
    }
  }
  static async cadastrarMotorista(motorista: MotoristaDTO): Promise<boolean> {
    try {
      const queryInsertMotorista = `INSERT INTO motorista (cpf, cnh, nome_motorista, sobrenome_motorista, data_nascimento, celular, endereco, antecedentes_criminais)
                                      VALUES
                                      ($1, $2, $3, $4, $5, $6, $7, $8)
                                      RETURNING id_motorista;`;

      const respostaBD = await database.query(queryInsertMotorista, [
        motorista.cpf,
        motorista.cnh,
        motorista.nomeMotorista.toUpperCase(),
        motorista.sobrenomeMotorista.toUpperCase(),
        motorista.dataNascimento,
        motorista.celular,
        motorista.endereco,
        motorista.antecedentesCriminais.toUpperCase(),
      ]);

      return respostaBD.rows.length > 0;
    } catch (error) {
      console.error(`Erro ao cadastrar motorista. ${error}`);
      return false;
    }
  }
}

export { Motorista };
