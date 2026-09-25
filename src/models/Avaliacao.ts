export class Avaliacao {
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
}