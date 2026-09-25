export class CorridaAgendamento {
  private idAgendamento: number;
  private idPassageiro: number;
  private origemCorrida: string;
  private destinoCorrida: string;
  private tipoCorrida: string;
  private dataAgendada: Date;
  private statusAgendamento: string;
  private preco: number;

  constructor(
    idAgendamento: number = 0,
    idPassageiro: number,
    origemCorrida: string,
    destinoCorrida: string,
    tipoCorrida: string,
    dataAgendada: Date,
    statusAgendamento: string,
    preco: number,
  ) {
    this.idAgendamento = idAgendamento;
    this.idPassageiro = idPassageiro;
    this.origemCorrida = origemCorrida;
    this.destinoCorrida = destinoCorrida;
    this.tipoCorrida = tipoCorrida;
    this.dataAgendada = dataAgendada;
    this.statusAgendamento = statusAgendamento;
    this.preco = preco;
  }

  public getIdAgendamento(): number { return this.idAgendamento; }
  public getIdPassageiro(): number { return this.idPassageiro; }
  public getOrigemCorrida(): string { return this.origemCorrida; }
  public getDestinoCorrida(): string { return this.destinoCorrida; }
  public getTipoCorrida(): string { return this.tipoCorrida; }
  public getDataAgendada(): Date { return this.dataAgendada; }
  public getStatusAgendamento(): string { return this.statusAgendamento; }
  public getPreco(): number { return this.preco; }

  public setIdAgendamento(v: number): void { this.idAgendamento = v; }
  public setIdPassageiro(v: number): void { this.idPassageiro = v; }
  public setOrigemCorrida(v: string): void { this.origemCorrida = v; }
  public setDestinoCorrida(v: string): void { this.destinoCorrida = v; }
  public setTipoCorrida(v: string): void { this.tipoCorrida = v; }
  public setDataAgendada(v: Date): void { this.dataAgendada = v; }
  public setStatusAgendamento(v: string): void { this.statusAgendamento = v; }
  public setPreco(v: number): void { this.preco = v; }
}