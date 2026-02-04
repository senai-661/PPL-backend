import type { CorridaDTO } from "../interface/CorridaDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

class Corrida {
  private idCorrida: number = 0;
  private idPassageiro: number;
  private idMotorista: number;
  private idVeiculo: number;
  private origemCorrida: string;
  private destinoCorrida: string;
  private preco: number;
  private avaliacao: string;
  private dataCorrida: Date;
  private duracaoCorrida: number;
  private statusCorrida: string;

  constructor(
    _idCorrida: number,
    _idPassageiro: number,
    _idMotorista: number,
    _idVeiculo: number,
    _origemCorrida: string,
    _destinoCorrida: string,
    _preco: number,
    _avaliacao: string,
    _dataCorrida: Date,
    _duracaoCorrida: number,
    _statusCorrida: string,
  ) {
    this.idCorrida = _idCorrida;
    this.idPassageiro = _idPassageiro;
    this.idMotorista = _idMotorista;
    this.idVeiculo = _idVeiculo;
    this.origemCorrida = _origemCorrida;
    this.destinoCorrida = _destinoCorrida;
    this.preco = _preco;
    this.avaliacao = _avaliacao;
    this.dataCorrida = _dataCorrida;
    this.duracaoCorrida = _duracaoCorrida;
    this.statusCorrida = _statusCorrida;
  }
  public getIdCorrida(): number {
    return this.idCorrida;
  }
  public setIdCorrida(idCorrida: number): void {
    this.idCorrida = idCorrida;
  }
  public getIdPassageiro(): number {
    return this.idPassageiro;
  }
  public setIdPassageiro(idPassageiro: number): void {
    this.idPassageiro = idPassageiro;
  }
  public getIdMotorista(): number {
    return this.idMotorista;
  }
  public setIdMotorista(idMotorista: number): void {
    this.idMotorista = idMotorista;
  }
  public getIdVeiculo(): number {
    return this.idVeiculo;
  }
  public setIdVeiculo(idVeiculo: number): void {
    this.idVeiculo = idVeiculo;
  }
  public getOrigemCorrida(): string {
    return this.origemCorrida;
  }
  public setOrigemCorrida(origemCorrida: string): void {
    this.origemCorrida = origemCorrida;
  }
  public getDestinoCorrida(): string {
    return this.destinoCorrida;
  }
  public setDestinoCorrida(destinoCorrida: string): void {
    this.destinoCorrida = destinoCorrida;
  }
  public getPreco(): number {
    return this.preco;
  }
  public setPreco(preco: number): void {
    this.preco = preco;
  }
  public getAvaliacao(): string {
    return this.avaliacao;
  }
  public setAvaliacao(avaliacao: string): void {
    this.avaliacao = avaliacao;
  }
  public getDataCorrida(): Date {
    return this.dataCorrida;
  }
  public setDataCorrida(dataCorrida: Date): void {
    this.dataCorrida = dataCorrida;
  }
  public getDuracaoCorrida(): number {
    return this.duracaoCorrida;
  }
  public setDuracaoCorrida(duracaoCorrida: number): void {
    this.duracaoCorrida = duracaoCorrida;
  }
  public getStatusCorrida(): string {
    return this.statusCorrida;
  }
  public setStatusCorrida(statusCorrida: string): void {
    this.statusCorrida = statusCorrida;
  }

  static async listarCorridas(): Promise<Array<Corrida> | null> {
    try {
      let listaDeCorridas: Array<Corrida> = [];
      const querySelectCorridas = `SELECT * FROM corrida;`;
      const respostaBD = await database.query(querySelectCorridas);

      respostaBD.rows.forEach((corridaBD) => {
        const novaCorrida: Corrida = new Corrida(
          corridaBD.id_corrida,
          corridaBD.id_passageiro,
          corridaBD.id_motorista,
          corridaBD.id_veiculo,
          corridaBD.origem_corrida,
          corridaBD.destino_corrida,
          corridaBD.preco,
          corridaBD.avaliacao,
          corridaBD.data_corrida,
          corridaBD.duracao_corrida,
          corridaBD.status_corrida,
        );
        listaDeCorridas.push(novaCorrida);
      });
      return listaDeCorridas;
    } catch (error) {
      console.error(`Erro ao consultar corridas. ${error}`);
      return null;
    }
  }

  static async criarCorrida(corrida: CorridaDTO): Promise<boolean> {
    try {
      const queryInsertCorrida = `
        INSERT INTO corrida 
        (id_passageiro, id_motorista, id_veiculo, origem_corrida, destino_corrida, preco, avaliacao, data_corrida, duracao_corrida, status_corrida) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id_corrida;
      `;
      await database.query(queryInsertCorrida, [
        corrida.idPassageiro,
        corrida.idMotorista,
        corrida.idVeiculo,
        corrida.origemCorrida,
        corrida.destinoCorrida,
        corrida.preco,
        corrida.avaliacao,
        corrida.dataCorrida,
        corrida.duracaoCorrida,
        corrida.statusCorrida,
      ]);
      return true;
    } catch (error) {
      console.error(`Erro ao criar corrida: ${error}`);
      return false;
    }
  }
}

export { Corrida };
