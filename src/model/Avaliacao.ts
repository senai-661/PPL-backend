import type { AvaliacaoDTO } from "../interface/AvaliacaoDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

class Avaliacao {
  private idAvaliacao: number = 0;
  private idMotorista: number;
  private idPassageiro: number;
  private nota: number;
  private comentario: string;
  constructor(
    _idAvaliacao: number = 0,
    _idMotorista: number,
    _idPassageiro: number,
    _nota: number,
    _comentario: string,
  ) {
    this.idAvaliacao = _idAvaliacao;
    this.idMotorista = _idMotorista;
    this.idPassageiro = _idPassageiro;
    this.nota = _nota;
    this.comentario = _comentario;
  }
  public getIdAvaliacao(): number {
    return this.idAvaliacao;
  }
  public setIdAvaliacao(idAvaliacao: number): void {
    this.idAvaliacao = idAvaliacao;
  }
  public getIdMotorista(): number {
    return this.idMotorista;
  }
  public setIdMotorista(idMotorista: number): void {
    this.idMotorista = idMotorista;
  }
  public getIdPassageiro(): number {
    return this.idPassageiro;
  }
  public setIdPassageiro(idPassageiro: number): void {
    this.idPassageiro = idPassageiro;
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
      const querySelectAvaliacoes = `SELECT * FROM avaliacao_motorista;`;
      const respostaBD = await database.query(querySelectAvaliacoes);
      respostaBD.rows.forEach((avaliacaoBD) => {
        const novaAvaliacao: Avaliacao = new Avaliacao(
          avaliacaoBD.id_avaliacao,
          avaliacaoBD.id_motorista,
          avaliacaoBD.id_passageiro,
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
        INSERT INTO avaliacao_motorista 
        (id_motorista, id_passageiro, nota, comentario) 
        VALUES ($1, $2, $3, $4);
      `;
      await database.query(queryInsertAvaliacao, [
        avaliacao.idMotorista,
        avaliacao.idPassageiro,
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
