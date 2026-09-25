export abstract class Usuario {
  protected idUsuario: number;
  protected nome: string;
  protected sobrenome: string;
  protected email: string;
  protected tipoUsuario: string;
  protected senha: string;
  protected criadoEm: Date;

  constructor(
    idUsuario: number,
    nome: string,
    sobrenome: string,
    email: string,
    tipoUsuario: string,
    senha: string,
    criadoEm: Date,
  ) {
    this.idUsuario = idUsuario;
    this.nome = nome;
    this.sobrenome = sobrenome;
    this.email = email;
    this.tipoUsuario = tipoUsuario;
    this.senha = senha;
    this.criadoEm = criadoEm;
  }

  public getIdUsuario(): number { return this.idUsuario; }
  public getNome(): string { return this.nome; }
  public getSobrenome(): string { return this.sobrenome; }
  public getEmail(): string { return this.email; }
  public getTipoUsuario(): string { return this.tipoUsuario; }
  public getSenha(): string { return this.senha; }
  public getCriadoEm(): Date { return this.criadoEm; }

  public setIdUsuario(v: number): void { this.idUsuario = v; }
  public setNome(v: string): void { this.nome = v; }
  public setSobrenome(v: string): void { this.sobrenome = v; }
  public setEmail(v: string): void { this.email = v; }
  public setTipoUsuario(v: string): void { this.tipoUsuario = v; }
  public setSenha(v: string): void { this.senha = v; }
  public setCriadoEm(v: Date): void { this.criadoEm = v; }
}
