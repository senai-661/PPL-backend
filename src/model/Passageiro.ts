import type { PassageiroDTO } from "../interface/PassageiroDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

export class Passageiro {
  private idPassageiro: number;
  private cpf: string;
  private nomePassageiro: string;
  private sobrenomePassageiro: string;
  private dataNascimento: Date;
  private email: string;
  private celular: string;
  private necessidadeEspecial: string;
  private senha: string;

  constructor(
    id: number = 0,
    nome: string = "",
    sobrenome: string = "",
    cpf: string = "",
    dataNasc: Date = new Date(),
    celular: string = "",
    email: string = "",
    necessidadeEspecial: string = "",
    senha: string = "",
  ) {
    this.idPassageiro = id;
    this.nomePassageiro = nome;
    this.sobrenomePassageiro = sobrenome;
    this.cpf = cpf;
    this.dataNascimento = dataNasc;
    this.celular = celular;
    this.necessidadeEspecial = necessidadeEspecial;
    this.email = email;
    this.senha = senha;
  }

  // --- Getters completos para o Controller conseguir ler tudo ---
  public getIdPassageiro(): number {
    return this.idPassageiro;
  }
  public getNomePassageiro(): string {
    return this.nomePassageiro;
  }
  public getSobrenomePassageiro(): string {
    return this.sobrenomePassageiro;
  }
  public getCpf(): string {
    return this.cpf;
  }
  public getDataNascimento(): Date {
    return this.dataNascimento;
  }
  public getCelular(): string {
    return this.celular;
  }
  public getEmail(): string {
    return this.email;
  }
  public getNecessidadeEspecial(): string {
    return this.necessidadeEspecial;
  }
  public getSenha(): string {
    return this.senha;
  }
  public setIdPassageiro(id: number): void {
    this.idPassageiro = id;
  }
  public setNomePassageiro(nome: string): void {
    this.nomePassageiro = nome;
  }
  public setSobrenomePassageiro(sobrenome: string): void {
    this.sobrenomePassageiro = sobrenome;
  }
  public setCpf(cpf: string): void {
    this.cpf = cpf;
  }
  public setDataNascimento(data: Date): void {
    this.dataNascimento = data;
  }
  public setCelular(celular: string): void {
    this.celular = celular;
  }
  public setEmail(email: string): void {
    this.email = email;
  }
  public setNecessidadeEspecial(necessidadeEspecial: string): void {
    this.necessidadeEspecial = necessidadeEspecial;
  }
  public setSenha(senha: string): void {
    this.senha = senha;
  }

  static async cadastrarPassageiro(
    passageiro: PassageiroDTO,
  ): Promise<number | null> {
    try {
      const query = `
                INSERT INTO passageiro (cpf, nome_passageiro, sobrenome_passageiro, data_nascimento, email, celular, necessidade_especial, senha)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_passageiro;
            `;
      const res = await database.query(query, [
        passageiro.cpf,
        passageiro.nomePassageiro.toUpperCase(),
        passageiro.sobrenomePassageiro.toUpperCase(),
        passageiro.dataNascimento,
        passageiro.email,
        passageiro.celular,
        passageiro.necessidadeEspecial.toUpperCase(),
        passageiro.senha,
      ]);
      return res.rows[0].id_passageiro;
    } catch (error) {
      console.error("Erro ao cadastrar Passageiro:", error);
      return null;
    }
  }

  static async listarPassageiros(): Promise<Array<Passageiro> | null> {
    try {
      const res = await database.query(`SELECT * FROM passageiro;`);
      // MAPEAMENTO CORRETO: Pegando do banco (snake_case) e jogando no construtor
      return res.rows.map(
        (passageiro) =>
          new Passageiro(
            passageiro.id_passageiro,
            passageiro.nome_passageiro,
            passageiro.sobrenome_passageiro,
            passageiro.cpf,
            passageiro.data_nascimento,
            passageiro.celular,
            passageiro.email,
            passageiro.necessidade_especial,
            passageiro.senha,
          ),
      );
    } catch (error) {
      console.error("Erro ao listar passageiros:", error);
      return null;
    }
  }

  static async buscarPorEmail(email: string): Promise<Passageiro | null> {
    const res = await database.query(
      `SELECT * FROM passageiro WHERE email = $1;`,
      [email],
    );
    if (res.rows.length > 0) {
      const passageiro = res.rows[0];
      return new Passageiro(
        passageiro.id_passageiro,
        passageiro.nome_passageiro,
        passageiro.sobrenome_passageiro,
        passageiro.cpf,
        passageiro.data_nascimento,
        passageiro.celular,
        passageiro.email,
        passageiro.necessidade_especial,
        passageiro.senha,
      );
    }
    return null;
  }
}
