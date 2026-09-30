export class Veiculo {
  private idVeiculo: number;
  private idMotorista: number;
  private placa: string;
  private tipoVeiculo: string;
  private modeloVeiculo: string;

  constructor(
    idVeiculo: number = 0,
    idMotorista: number,
    placa: string,
    tipoVeiculo: string,
    modeloVeiculo: string,
  ) {
    this.idVeiculo = idVeiculo;
    this.idMotorista = idMotorista;
    this.placa = placa;
    this.tipoVeiculo = tipoVeiculo;
    this.modeloVeiculo = modeloVeiculo;
  }

  public getIdVeiculo(): number {
    return this.idVeiculo;
  }
  public setIdVeiculo(idVeiculo: number): void {
    this.idVeiculo = idVeiculo;
  }
  public getIdMotorista(): number {
    return this.idMotorista;
  }
  public setIdMotorista(idMotorista: number): void {
    this.idMotorista = idMotorista;
  }
  public getPlaca(): string {
    return this.placa;
  }
  public setPlaca(placa: string): void {
    this.placa = placa;
  }
  public getTipoVeiculo(): string {
    return this.tipoVeiculo;
  }
  public setTipoVeiculo(tipoVeiculo: string): void {
    this.tipoVeiculo = tipoVeiculo;
  }
  public getModeloVeiculo(): string {
    return this.modeloVeiculo;
  }
  public setModeloVeiculo(modeloVeiculo: string): void {
    this.modeloVeiculo = modeloVeiculo;
  }
}
