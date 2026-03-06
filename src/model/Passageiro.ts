import type { PassageiroDTO } from "../interface/PassageiroDTO.js";
import { DatabaseModel } from "../model/DatabaseModel.js";

const database = new DatabaseModel().pool;

export class Passageiro {
  private idPassageiro: number;
  private cpf: string;
  private nomePassageiro: string;
  private sobrenomePassageiro: string;
  private dataNascimento: Date;
  private email: string;
  private celular: string;
  private necessidades: string[];
  private tipoViagem: string;
  private preferenciaClima: string;
  private senha: string;

  constructor(
    id: number = 0,
    nome: string = "",
    sobrenome: string = "",
    cpf: string = "",
    dataNasc: Date = new Date(),
    celular: string = "",
    email: string = "",
    necessidades: string[] = [],
    tipoViagem: string = "Convencional",
    preferenciaClima: string = "Não Importa",
    senha: string = "",
  ) {
    this.idPassageiro = id;
    this.nomePassageiro = nome;
    this.sobrenomePassageiro = sobrenome;
    this.cpf = cpf;
    this.dataNascimento = dataNasc;
    this.celular = celular;
    this.email = email;
    this.necessidades = necessidades;
    this.tipoViagem = tipoViagem;
    this.preferenciaClima = preferenciaClima;
    this.senha = senha;
  }

  public getIdPassageiro(): number { return this.idPassageiro; }
  public getNomePassageiro(): string { return this.nomePassageiro; }
  public getSobrenomePassageiro(): string { return this.sobrenomePassageiro; }
  public getCpf(): string { return this.cpf; }
  public getDataNascimento(): Date { return this.dataNascimento; }
  public getCelular(): string { return this.celular; }
  public getEmail(): string { return this.email; }
  public getNecessidades(): string[] { return this.necessidades; }
  public getTipoViagem(): string { return this.tipoViagem; }
  public getPreferenciaClima(): string { return this.preferenciaClima; }
  public getSenha(): string { return this.senha; }

  public setIdPassageiro(id: number): void { this.idPassageiro = id; }
  public setNomePassageiro(nome: string): void { this.nomePassageiro = nome; }
  public setSobrenomePassageiro(sobrenome: string): void { this.sobrenomePassageiro = sobrenome; }
  public setCpf(cpf: string): void { this.cpf = cpf; }
  public setDataNascimento(data: Date): void { this.dataNascimento = data; }
  public setCelular(celular: string): void { this.celular = celular; }
  public setEmail(email: string): void { this.email = email; }
  public setNecessidades(necessidades: string[]): void { this.necessidades = necessidades; }
  public setTipoViagem(tipoViagem: string): void { this.tipoViagem = tipoViagem; }
  public setPreferenciaClima(preferenciaClima: string): void { this.preferenciaClima = preferenciaClima; }
  public setSenha(senha: string): void { this.senha = senha; }

  static async cadastrarPassageiro(passageiro: PassageiroDTO): Promise<number | null> {
    try {
      const query = `
        INSERT INTO passageiro 
          (cpf, nome_passageiro, sobrenome_passageiro, data_nascimento, email, celular, necessidades, tipo_viagem, preferencia_clima, senha)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
        RETURNING id_passageiro;
      `;
      const res = await database.query(query, [
        passageiro.cpf,
        passageiro.nomePassageiro.toUpperCase(),
        passageiro.sobrenomePassageiro.toUpperCase(),
        passageiro.dataNascimento,
        passageiro.email,
        passageiro.celular,
        passageiro.necessidades ?? [],
        passageiro.tipoViagem ?? "Convencional",
        passageiro.preferenciaClima ?? "Não Importa",
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
      return res.rows.map(
        (p) => new Passageiro(
        p.id_passageiro,
        p.nome_passageiro,
        p.sobrenome_passageiro,
        p.cpf,
        p.data_nascimento,
        p.celular,
        p.email,       // ✅ até aqui ok
        p.necessidades ?? [],// ← posição 8 = necessidades ✅
        p.tipo_viagem ?? "Convencional", // ← posição 9 = tipoViagem ✅
        p.preferencia_clima ?? "Não Importa", // ← posição 10 = preferenciaClima ✅
        p.senha        // ✅
)
      );
    } catch (error) {
      console.error("Erro ao listar passageiros:", error);
      return null;
    }
  }

  static async buscarPorEmail(email: string): Promise<Passageiro | null> {
    try {
      const res = await database.query(
        `SELECT * FROM passageiro WHERE email = $1;`,
        [email]
      );
      if (res.rows.length === 0) return null;
      const p = res.rows[0];
      return new Passageiro(
        p.id_passageiro,
        p.nome_passageiro,
        p.sobrenome_passageiro,
        p.cpf,
        p.data_nascimento,
        p.celular,
        p.email,
        p.necessidades ?? [],
        p.tipo_viagem,
        p.preferencia_clima,
        p.senha,
      );
    } catch (error) {
      console.error("Erro ao buscar passageiro por email:", error);
      return null;
    }
  }
  static async buscarPorId(id: number): Promise<Passageiro | null> {
  try {
    const res = await database.query(
      `SELECT * FROM passageiro WHERE id_passageiro = $1;`,
      [id]
    );
    if (res.rows.length === 0) return null;
    const p = res.rows[0];
    return new Passageiro(
      p.id_passageiro, p.nome_passageiro, p.sobrenome_passageiro,
      p.cpf, p.data_nascimento, p.celular, p.email,
      p.necessidades ?? [], p.tipo_viagem, p.preferencia_clima, p.senha,
    );
  } catch (error) {
    console.error(`Erro ao buscar passageiro por id: ${error}`);
    return null;
  }
}
}