import type { VeiculoDTO } from "../interface/VeiculoDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

class Veiculo {
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

  static async listarVeiculos(): Promise<Array<Veiculo> | null> {
    try {
      let listaDeVeiculos: Array<Veiculo> = [];
      const querySelectVeiculos = `SELECT * FROM veiculo;`;
      const respostaBD = await database.query(querySelectVeiculos);
      respostaBD.rows.forEach((veiculoBD) => {
        const novoVeiculo: Veiculo = new Veiculo(
          veiculoBD.id_veiculo,
          veiculoBD.id_motorista,
          veiculoBD.placa,
          veiculoBD.tipo_veiculo,
          veiculoBD.modelo_veiculo,
        );
        novoVeiculo.setIdVeiculo(veiculoBD.id_veiculo);
        novoVeiculo.setModeloVeiculo(veiculoBD.modelo_veiculo);
        listaDeVeiculos.push(novoVeiculo);
      });
      return listaDeVeiculos;
    } catch (error) {
      console.error(`Erro ao consultar veículos. ${error}`);
      return null;
    }
  }

  static async cadastrarVeiculo(veiculo: VeiculoDTO): Promise<boolean> {
    try {
      const queryInsertVeiculo = `INSERT INTO veiculo (id_motorista, placa, tipo_veiculo, modelo_veiculo)
                                  VALUES
                                  ($1, $2, $3, $4)
                                  RETURNING id_veiculo;`;

      const respostaBD = await database.query(queryInsertVeiculo, [
        veiculo.idMotorista,
        veiculo.placa.toUpperCase(),
        veiculo.tipoVeiculo.toUpperCase(),
        veiculo.modeloVeiculo.toUpperCase(),
      ]);

      return respostaBD.rows.length > 0;
    } catch (error) {
      console.error(`Erro ao cadastrar veículo: ${error}`);
      return false;
    }
  }
}

export { Veiculo };
