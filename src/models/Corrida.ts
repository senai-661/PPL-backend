export class Corrida {
  private idCorrida: number = 0;
  private idPassageiro: number;
  private idMotorista: number | null;
  private idVeiculo: number | null;
  private origemCorrida: string;
  private destinoCorrida: string;
  private tipoCorrida: string;
  private preco: number;
  private dataCorrida: Date;
  private duracaoCorrida: number;
  private motivoCancelamento: string | null;
  private statusCorrida: string;

  constructor(
    _idCorrida: number,
    _idPassageiro: number,
    _idMotorista: number | null,
    _idVeiculo: number | null,
    _origemCorrida: string,
    _destinoCorrida: string,
    _tipoCorrida: string,
    _preco: number,
    _dataCorrida: Date,
    _duracaoCorrida: number,
    _motivoCancelamento: string | null,
    _statusCorrida: string,
  ) {
    this.idCorrida = _idCorrida;
    this.idPassageiro = _idPassageiro;
    this.idMotorista = _idMotorista;
    this.idVeiculo = _idVeiculo;
    this.origemCorrida = _origemCorrida;
    this.destinoCorrida = _destinoCorrida;
    this.tipoCorrida = _tipoCorrida;
    this.preco = _preco;
    this.dataCorrida = _dataCorrida;
    this.duracaoCorrida = _duracaoCorrida;
    this.motivoCancelamento = _motivoCancelamento;
    this.statusCorrida = _statusCorrida;
  }

  public getIdCorrida(): number { return this.idCorrida; }
  public getIdPassageiro(): number { return this.idPassageiro; }
  public getIdMotorista(): number | null { return this.idMotorista; }
  public getIdVeiculo(): number | null { return this.idVeiculo; }
  public getOrigemCorrida(): string { return this.origemCorrida; }
  public getDestinoCorrida(): string { return this.destinoCorrida; }
  public getTipoCorrida(): string { return this.tipoCorrida; }
  public getPreco(): number { return this.preco; }
  public getDataCorrida(): Date { return this.dataCorrida; }
  public getDuracaoCorrida(): number { return this.duracaoCorrida; }
  public getMotivoCancelamento(): string | null { return this.motivoCancelamento; }
  public getStatusCorrida(): string { return this.statusCorrida; }

  public setIdCorrida(v: number): void { this.idCorrida = v; }
  public setIdPassageiro(v: number): void { this.idPassageiro = v; }
  public setIdMotorista(v: number | null): void { this.idMotorista = v; }
  public setIdVeiculo(v: number | null): void { this.idVeiculo = v; }
  public setOrigemCorrida(v: string): void { this.origemCorrida = v; }
  public setDestinoCorrida(v: string): void { this.destinoCorrida = v; }
  public setTipoCorrida(v: string): void { this.tipoCorrida = v; }
  public setPreco(v: number): void { this.preco = v; }
  public setDataCorrida(v: Date): void { this.dataCorrida = v; }
  public setDuracaoCorrida(v: number): void { this.duracaoCorrida = v; }
  public setMotivoCancelamento(v: string | null): void { this.motivoCancelamento = v; }
  public setStatusCorrida(v: string): void { this.statusCorrida = v; }
}