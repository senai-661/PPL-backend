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

  static async buscarPorId(idVeiculo: number): Promise<Veiculo | null> {
    try {
      const querySelectVeiculo = `SELECT * FROM veiculo WHERE id_veiculo = $1;`;
      const respostaBD = await database.query(querySelectVeiculo, [idVeiculo]);

      if (respostaBD.rows.length === 0) {
        return null;
      }

      const veiculoBD = respostaBD.rows[0];
      return new Veiculo(
        veiculoBD.id_veiculo,
        veiculoBD.id_motorista,
        veiculoBD.placa,
        veiculoBD.tipo_veiculo,
        veiculoBD.modelo_veiculo,
      );
    } catch (error) {
      console.error(`Erro ao buscar veículo por id: ${error}`);
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

  static async editarVeiculo(idVeiculo: number, dados: Partial<VeiculoDTO>): Promise<boolean> {
    try {
      const campos: string[] = [];
      const valores: any[] = [];
      let indice = 1;

      if (dados.idMotorista !== undefined) {
        campos.push(`id_motorista = $${indice++}`);
        valores.push(dados.idMotorista);
      }

      if (dados.placa) {
        campos.push(`placa = $${indice++}`);
        valores.push(dados.placa.toUpperCase());
      }

      if (dados.tipoVeiculo) {
        campos.push(`tipo_veiculo = $${indice++}`);
        valores.push(dados.tipoVeiculo.toUpperCase());
      }

      if (dados.modeloVeiculo) {
        campos.push(`modelo_veiculo = $${indice++}`);
        valores.push(dados.modeloVeiculo.toUpperCase());
      }

      if (campos.length === 0) {
        return false;
      }

      valores.push(idVeiculo);
      await database.query(
        `UPDATE veiculo SET ${campos.join(', ')} WHERE id_veiculo = $${indice};`,
        valores,
      );

      return true;
    } catch (error) {
      console.error(`Erro ao editar veículo: ${error}`);
      return false;
    }
  }

  static async excluirVeiculo(idVeiculo: number): Promise<boolean> {
    const client = await database.connect();

    try {
      await client.query('BEGIN');

      await client.query(
        `DELETE FROM corrida WHERE id_veiculo = $1;`,
        [idVeiculo],
      );

      const respostaBD = await client.query(
        `DELETE FROM veiculo WHERE id_veiculo = $1 RETURNING id_veiculo;`,
        [idVeiculo],
      );

      await client.query('COMMIT');
      return (respostaBD.rowCount ?? 0) > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`Erro ao excluir veículo: ${error}`);
      return false;
    } finally {
      client.release();
    }
  }
}

export { Veiculo };
