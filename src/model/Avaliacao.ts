export class Avaliacao {
  private idAvaliacao: number;
  private idCorrida: number;
  private nota: number;
  private comentario: string;

  constructor(
    idAvaliacao: number = 0,
    idCorrida: number,
    nota: number,
    comentario: string,
  ) {
    this.idAvaliacao = idAvaliacao;
    this.idCorrida = idCorrida;
    this.nota = nota;
    this.comentario = comentario;
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
}