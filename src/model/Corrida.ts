import type { CorridaDTO } from "../interface/CorridaDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

class Corrida {
  private idCorrida: number = 0;
  private idPassageiro: number;
  private idMotorista: number | null;
  private idVeiculo: number | null;
  private origemCorrida: string;
  private destinoCorrida: string;
  private preco: number;
  private dataCorrida: Date;
  private duracaoCorrida: number;
  private statusCorrida: string;

  constructor(
    _idCorrida: number,
    _idPassageiro: number,
    _idMotorista: number | null,
    _idVeiculo: number | null,
    _origemCorrida: string,
    _destinoCorrida: string,
    _preco: number,
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
    this.dataCorrida = _dataCorrida;
    this.duracaoCorrida = _duracaoCorrida;
    this.statusCorrida = _statusCorrida;
  }

  public getIdCorrida(): number { return this.idCorrida; }
  public getIdPassageiro(): number { return this.idPassageiro; }
  public getIdMotorista(): number | null { return this.idMotorista; }
  public getIdVeiculo(): number | null { return this.idVeiculo; }
  public getOrigemCorrida(): string { return this.origemCorrida; }
  public getDestinoCorrida(): string { return this.destinoCorrida; }
  public getPreco(): number { return this.preco; }
  public getDataCorrida(): Date { return this.dataCorrida; }
  public getDuracaoCorrida(): number { return this.duracaoCorrida; }
  public getStatusCorrida(): string { return this.statusCorrida; }

  public setIdCorrida(v: number): void { this.idCorrida = v; }
  public setIdPassageiro(v: number): void { this.idPassageiro = v; }
  public setIdMotorista(v: number | null): void { this.idMotorista = v; }
  public setIdVeiculo(v: number | null): void { this.idVeiculo = v; }
  public setOrigemCorrida(v: string): void { this.origemCorrida = v; }
  public setDestinoCorrida(v: string): void { this.destinoCorrida = v; }
  public setPreco(v: number): void { this.preco = v; }
  public setDataCorrida(v: Date): void { this.dataCorrida = v; }
  public setDuracaoCorrida(v: number): void { this.duracaoCorrida = v; }
  public setStatusCorrida(v: string): void { this.statusCorrida = v; }

  // Passageiro abre a solicitação — motorista/veiculo ainda não existem
  static async solicitarCorrida(corrida: CorridaDTO): Promise<number | null> {
    try {
      const query = `
        INSERT INTO corrida 
          (id_passageiro, origem_corrida, destino_corrida, preco, duracao_corrida, status_corrida)
        VALUES ($1, $2, $3, $4, 0, 'Pendente')
        RETURNING id_corrida;
      `;
      const res = await database.query(query, [
        corrida.idPassageiro,
        corrida.origemCorrida,
        corrida.destinoCorrida,
        corrida.preco,
      ]);
      return res.rows[0].id_corrida;
    } catch (error) {
      console.error(`Erro ao solicitar corrida: ${error}`);
      return null;
    }
  }

  // Motorista aceita — vincula motorista e veículo, status → Aceito
  static async aceitarCorrida(
    idCorrida: number,
    idMotorista: number,
    idVeiculo: number
  ): Promise<boolean> {
    try {
      const query = `
        UPDATE corrida
        SET id_motorista = $1, id_veiculo = $2, status_corrida = 'Aceito'
        WHERE id_corrida = $3 AND status_corrida = 'Pendente'
        RETURNING id_corrida;
      `;
      const res = await database.query(query, [idMotorista, idVeiculo, idCorrida]);
      return res.rowCount !== null && res.rowCount > 0;
    } catch (error) {
      console.error(`Erro ao aceitar corrida: ${error}`);
      return false;
    }
  }

  // Inicia a corrida — status → Em andamento
  static async iniciarCorrida(idCorrida: number): Promise<boolean> {
    try {
      const query = `
        UPDATE corrida
        SET status_corrida = 'Em andamento'
        WHERE id_corrida = $1 AND status_corrida = 'Aceito'
        RETURNING id_corrida;
      `;
      const res = await database.query(query, [idCorrida]);
      return res.rowCount !== null && res.rowCount > 0;
    } catch (error) {
      console.error(`Erro ao iniciar corrida: ${error}`);
      return false;
    }
  }

  // Finaliza a corrida — salva duração real, status → Finalizada
  static async finalizarCorrida(
    idCorrida: number,
    duracaoCorrida: number
  ): Promise<boolean> {
    try {
      const query = `
        UPDATE corrida
        SET status_corrida = 'Finalizada', duracao_corrida = $1
        WHERE id_corrida = $2 AND status_corrida = 'Em andamento'
        RETURNING id_corrida;
      `;
      const res = await database.query(query, [duracaoCorrida, idCorrida]);
      return res.rowCount !== null && res.rowCount > 0;
    } catch (error) {
      console.error(`Erro ao finalizar corrida: ${error}`);
      return false;
    }
  }

  // Cancela em qualquer status antes de Finalizada
  static async cancelarCorrida(idCorrida: number): Promise<boolean> {
    try {
      const query = `
        UPDATE corrida
        SET status_corrida = 'Cancelada'
        WHERE id_corrida = $1 AND status_corrida IN ('Pendente', 'Aceito')
        RETURNING id_corrida;
      `;
      const res = await database.query(query, [idCorrida]);
      return res.rowCount !== null && res.rowCount > 0;
    } catch (error) {
      console.error(`Erro ao cancelar corrida: ${error}`);
      return false;
    }
  }

  static async listarCorridas(): Promise<Array<Corrida> | null> {
    try {
      const res = await database.query(`SELECT * FROM corrida;`);
      return res.rows.map(
        (c) => new Corrida(
          c.id_corrida, c.id_passageiro, c.id_motorista,
          c.id_veiculo, c.origem_corrida, c.destino_corrida,
          c.preco, c.data_corrida, c.duracao_corrida, c.status_corrida,
        )
      );
    } catch (error) {
      console.error(`Erro ao listar corridas: ${error}`);
      return null;
    }
  }

  // Lista só as corridas pendentes — para motoristas verem o que está disponível
  static async listarPendentes(): Promise<Array<Corrida> | null> {
    try {
      const res = await database.query(
        `SELECT * FROM corrida WHERE status_corrida = 'Pendente';`
      );
      return res.rows.map(
        (c) => new Corrida(
          c.id_corrida, c.id_passageiro, c.id_motorista,
          c.id_veiculo, c.origem_corrida, c.destino_corrida,
          c.preco, c.data_corrida, c.duracao_corrida, c.status_corrida,
        )
      );
    } catch (error) {
      console.error(`Erro ao listar corridas pendentes: ${error}`);
      return null;
    }
  }
}

export { Corrida };