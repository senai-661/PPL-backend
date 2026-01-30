import type { VeiculoDTO } from "../interface/VeiculoDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

class Veiculo {
  private idVeiculo: number = 0;
  private idMotorista: number;
  private placa: string;
  private tipoVeiculo: string;

  constructor(
    _idVeiculo: number = 0,
    _idMotorista: number,
    _placa: string,
    _tipoVeiculo: string,
  ) {
    this.idVeiculo = _idVeiculo;
    this.idMotorista = _idMotorista;
    this.placa = _placa;
    this.tipoVeiculo = _tipoVeiculo;
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
}

export { Veiculo };
