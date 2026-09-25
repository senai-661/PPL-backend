export class Veiculo {
  private idVeiculo: number = 0;
  private idMotorista: number;
  private placa: string;
  private tipoVeiculo: string;
  private modeloVeiculo: string;

  constructor(
    _idVeiculo: number = 0,
    _idMotorista: number,
    _placa: string,
    _tipoVeiculo: string,
    _modeloVeiculo: string,
  ) {
    this.idVeiculo = _idVeiculo;
    this.idMotorista = _idMotorista;
    this.placa = _placa;
    this.tipoVeiculo = _tipoVeiculo;
    this.modeloVeiculo = _modeloVeiculo;
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
