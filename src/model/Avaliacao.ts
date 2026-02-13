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
  public getIdAvaliacao(): number {
    return this.idAvaliacao;
  }
  public setIdAvaliacao(idAvaliacao: number): void {
    this.idAvaliacao = idAvaliacao;
  }
  public getIdCorrida(): number {
    return this.idCorrida;
  }
  public setIdCorrida(idCorrida: number): void {
    this.idCorrida = idCorrida;
  }
  public getNota(): number {
    return this.nota;
  }
  public setNota(nota: number): void {
    this.nota = nota;
  }
  public getComentario(): string {
    return this.comentario;
  }
  public setComentario(comentario: string): void {
    this.comentario = comentario;
  }

  static async listarAvaliacoes(): Promise<Array<Avaliacao> | null> {
    try {
      let listaDeAvaliacoes: Array<Avaliacao> = [];
      const querySelectAvaliacoes = `SELECT * FROM avaliacao_corrida;`;
      const respostaBD = await database.query(querySelectAvaliacoes);
      respostaBD.rows.forEach((avaliacaoBD) => {
        const novaAvaliacao: Avaliacao = new Avaliacao(
          avaliacaoBD.id_avaliacao,
          avaliacaoBD.id_corrida,
          avaliacaoBD.nota,
          avaliacaoBD.comentario,
        );
        novaAvaliacao.setIdAvaliacao(avaliacaoBD.id_avaliacao);
        listaDeAvaliacoes.push(novaAvaliacao);
      });
      return listaDeAvaliacoes;
    } catch (error) {
      console.error(`Erro ao consultar avaliações. ${error}`);
      return null;
    }
  }

  static async criarAvaliacao(avaliacao: AvaliacaoDTO): Promise<boolean> {
    try {
      const queryInsertAvaliacao = `
        INSERT INTO avaliacao_corrida
        (id_corrida, nota, comentario) 
        VALUES ($1, $2, $3);
      `;
      await database.query(queryInsertAvaliacao, [
        avaliacao.idCorrida,
        avaliacao.nota,
        avaliacao.comentario,
      ]);
      return true;
    } catch (error) {
      console.error(`Erro ao criar avaliação: ${error}`);
      return false;
    }
  }
}

export { Avaliacao };
