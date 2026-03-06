import type { AvaliacaoDTO } from "../interface/AvaliacaoDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

class Avaliacao {
  private idAvaliacao: number = 0;
  private idCorrida: number;
  private nota: number;
  private comentario: string;

  constructor(
    _idAvaliacao: number = 0,
    _idCorrida: number,
    _nota: number,
    _comentario: string,
  ) {
    this.idAvaliacao = _idAvaliacao;
    this.idCorrida = _idCorrida;
    this.nota = _nota;
    this.comentario = _comentario;
  }

  public getIdAvaliacao(): number { return this.idAvaliacao; }
  public setIdAvaliacao(idAvaliacao: number): void { this.idAvaliacao = idAvaliacao; }
  public getIdCorrida(): number { return this.idCorrida; }
  public setIdCorrida(idCorrida: number): void { this.idCorrida = idCorrida; }
  public getNota(): number { return this.nota; }
  public setNota(nota: number): void { this.nota = nota; }
  public getComentario(): string { return this.comentario; }
  public setComentario(comentario: string): void { this.comentario = comentario; }

  static async listarAvaliacoes(): Promise<Array<Avaliacao> | null> {
    try {
      const res = await database.query(`SELECT * FROM avaliacao_corrida;`);
      return res.rows.map(
        (a) => new Avaliacao(a.id_avaliacao, a.id_corrida, a.nota, a.comentario)
      );
    } catch (error) {
      console.error(`Erro ao consultar avaliações: ${error}`);
      return null;
    }
  }

  // Checks if the corrida is Finalizada AND belongs to the passenger
  static async validarCorrida(
    idCorrida: number,
    idPassageiro: number
  ): Promise<"ok" | "not_found" | "not_finished" | "not_owner"> {
    try {
      const res = await database.query(
        `SELECT id_passageiro, status_corrida FROM corrida WHERE id_corrida = $1;`,
        [idCorrida]
      );

      if (res.rows.length === 0) return "not_found";
      const corrida = res.rows[0];
      if (corrida.status_corrida !== "Finalizada") return "not_finished";
      if (corrida.id_passageiro !== idPassageiro) return "not_owner";
      return "ok";
    } catch (error) {
      console.error(`Erro ao validar corrida: ${error}`);
      return "not_found";
    }
  }

  // Checks if the corrida was already rated
  static async jaAvaliada(idCorrida: number): Promise<boolean> {
    try {
      const res = await database.query(
        `SELECT id_avaliacao FROM avaliacao_corrida WHERE id_corrida = $1;`,
        [idCorrida]
      );
      return res.rows.length > 0;
    } catch (error) {
      console.error(`Erro ao verificar avaliação: ${error}`);
      return false;
    }
  }

  static async criarAvaliacao(avaliacao: AvaliacaoDTO): Promise<boolean> {
    try {
      const query = `
        INSERT INTO avaliacao_corrida (id_corrida, nota, comentario)
        VALUES ($1, $2, $3);
      `;
      await database.query(query, [
        avaliacao.idCorrida,
        avaliacao.nota,
        avaliacao.comentario ?? null,
      ]);
      return true;
    } catch (error) {
      console.error(`Erro ao criar avaliação: ${error}`);
      return false;
    }
  }

  // Returns average rating for a specific driver
  static async mediaMotorista(idMotorista: number): Promise<number | null> {
    try {
      const res = await database.query(
        `SELECT ROUND(AVG(ac.nota), 1) as media
         FROM avaliacao_corrida ac
         JOIN corrida c ON c.id_corrida = ac.id_corrida
         WHERE c.id_motorista = $1;`,
        [idMotorista]
      );
      return res.rows[0].media ? parseFloat(res.rows[0].media) : null;
    } catch (error) {
      console.error(`Erro ao calcular média: ${error}`);
      return null;
    }
  }
}

export { Avaliacao };