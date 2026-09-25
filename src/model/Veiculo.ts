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
        veiculo.placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(),
        veiculo.tipoVeiculo.toUpperCase(),
        veiculo.modeloVeiculo.toUpperCase(),
      ]);

      return respostaBD.rows.length > 0;
    } catch (error) {
      console.error(`Erro ao cadastrar veículo: ${error}`);
      return false;
    }
  }

  static async buscarPorId(idVeiculo: number): Promise<Veiculo | null> {
    try {
      const res = await database.query(`SELECT * FROM veiculo WHERE id_veiculo = $1;`, [idVeiculo]);
      if (res.rows.length === 0) return null;
      const v = res.rows[0];
      return new Veiculo(v.id_veiculo, v.id_motorista, v.placa, v.tipo_veiculo, v.modelo_veiculo);
    } catch (error) {
      console.error(`Erro ao buscar veículo por id: ${error}`);
      return null;
    }
  }

  static async buscarPorMotorista(idMotorista: number): Promise<Veiculo | null> {
    try {
      const res = await database.query(
        `SELECT * FROM veiculo WHERE id_motorista = $1 ORDER BY id_veiculo DESC LIMIT 1;`,
        [idMotorista]
      );
      if (res.rows.length === 0) return null;
      const v = res.rows[0];
      return new Veiculo(v.id_veiculo, v.id_motorista, v.placa, v.tipo_veiculo, v.modelo_veiculo);
    } catch (error) {
      console.error(`Erro ao buscar veículo do motorista: ${error}`);
      return null;
    }
  }

  static async atualizarVeiculo(
    idVeiculo: number,
    dados: Partial<VeiculoDTO>
  ): Promise<boolean> {
    try {
      const campos: string[] = [];
      const valores: any[] = [];
      let i = 1;

      if (dados.placa) {
        campos.push(`placa = $${i++}`);
        valores.push(dados.placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase());
      }
      if (dados.tipoVeiculo) {
        campos.push(`tipo_veiculo = $${i++}`);
        valores.push(dados.tipoVeiculo.toUpperCase());
      }
      if (dados.modeloVeiculo) {
        campos.push(`modelo_veiculo = $${i++}`);
        valores.push(dados.modeloVeiculo.toUpperCase());
      }

      if (campos.length === 0) return false;

      valores.push(idVeiculo);
      const res = await database.query(
        `UPDATE veiculo SET ${campos.join(", ")} WHERE id_veiculo = $${i};`,
        valores
      );
      return res.rowCount !== null && res.rowCount > 0;
    } catch (error) {
      console.error(`Erro ao atualizar veículo: ${error}`);
      return false;
    }
  }

  static async deletarVeiculo(idVeiculo: number): Promise<boolean> {
    try {
      const res = await database.query(`DELETE FROM veiculo WHERE id_veiculo = $1;`, [idVeiculo]);
      return res.rowCount !== null && res.rowCount > 0;
    } catch (error) {
      console.error(`Erro ao deletar veículo: ${error}`);
      return false;
    }
  }
}

export { Veiculo };

