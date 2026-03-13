import { Usuario } from "./Usuario.js";
import { DatabaseModel } from "./DatabaseModel.js";
import type { PassageiroDTO } from "../interface/PassageiroDTO.js";

const database = new DatabaseModel().pool;

export class Passageiro extends Usuario {
  private idPassageiro: number;
  private cpf: string;
  private celular: string;
  private dataNascimento: Date;
  private necessidades: string[];
  private tipoViagem: string;
  private preferenciaClima: string;

  constructor(
    idUsuario: number,
    nome: string,
    sobrenome: string,
    email: string,
    senha: string,
    criadoEm: Date,
    idPassageiro: number,
    cpf: string,
    celular: string,
    dataNascimento: Date,
    necessidades: string[],
    tipoViagem: string,
    preferenciaClima: string,
  ) {
    super(idUsuario, nome, sobrenome, email, "passageiro", senha, criadoEm);
    this.idPassageiro = idPassageiro;
    this.cpf = cpf;
    this.celular = celular;
    this.dataNascimento = dataNascimento;
    this.necessidades = necessidades;
    this.tipoViagem = tipoViagem;
    this.preferenciaClima = preferenciaClima;
  }

  public getIdPassageiro(): number { return this.idPassageiro; }
  public getCpf(): string { return this.cpf; }
  public getCelular(): string { return this.celular; }
  public getDataNascimento(): Date { return this.dataNascimento; }
  public getNecessidades(): string[] { return this.necessidades; }
  public getTipoViagem(): string { return this.tipoViagem; }
  public getPreferenciaClima(): string { return this.preferenciaClima; }

  public setIdPassageiro(v: number): void { this.idPassageiro = v; }
  public setCpf(v: string): void { this.cpf = v; }
  public setCelular(v: string): void { this.celular = v; }
  public setDataNascimento(v: Date): void { this.dataNascimento = v; }
  public setNecessidades(v: string[]): void { this.necessidades = v; }
  public setTipoViagem(v: string): void { this.tipoViagem = v; }
  public setPreferenciaClima(v: string): void { this.preferenciaClima = v; }

  static async cadastrarPassageiro(passageiro: PassageiroDTO): Promise<number | null> {
    try {
      // 1. Insert into usuario first
      const idUsuario = await Usuario.criarUsuario(
        passageiro.nomePassageiro,
        passageiro.sobrenomePassageiro,
        passageiro.email,
        passageiro.senha,
        "passageiro"
      );

      if (!idUsuario) return null;

      // 2. Insert into passageiro with the generated id_usuario
      const res = await database.query(
        `INSERT INTO passageiro 
          (id_usuario, cpf, celular, data_nascimento, necessidades, tipo_viagem, preferencia_clima)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id_passageiro;`,
        [
          idUsuario,
          passageiro.cpf,
          passageiro.celular,
          passageiro.dataNascimento,
          passageiro.necessidades ?? [],
          passageiro.tipoViagem ?? "Convencional",
          passageiro.preferenciaClima ?? "Não Importa",
        ]
      );
      return res.rows[0].id_passageiro;
    } catch (error) {
      console.error(`Erro ao cadastrar passageiro: ${error}`);
      return null;
    }
  }

  static async buscarPorEmail(email: string): Promise<Passageiro | null> {
    try {
      const res = await database.query(
        `SELECT u.*, p.id_passageiro, p.cpf, p.celular, p.data_nascimento,
                p.necessidades, p.tipo_viagem, p.preferencia_clima
         FROM usuario u
         JOIN passageiro p ON p.id_usuario = u.id_usuario
         WHERE u.email = $1;`,
        [email]
      );
      if (res.rows.length === 0) return null;
      const r = res.rows[0];
      return new Passageiro(
        r.id_usuario, r.nome, r.sobrenome, r.email, r.senha, r.criado_em,
        r.id_passageiro, r.cpf, r.celular, r.data_nascimento,
        r.necessidades ?? [], r.tipo_viagem, r.preferencia_clima,
      );
    } catch (error) {
      console.error(`Erro ao buscar passageiro: ${error}`);
      return null;
    }
  }

  static async buscarPorId(idPassageiro: number): Promise<Passageiro | null> {
    try {
      const res = await database.query(
        `SELECT u.*, p.id_passageiro, p.cpf, p.celular, p.data_nascimento,
                p.necessidades, p.tipo_viagem, p.preferencia_clima
         FROM usuario u
         JOIN passageiro p ON p.id_usuario = u.id_usuario
         WHERE p.id_passageiro = $1;`,
        [idPassageiro]
      );
      if (res.rows.length === 0) return null;
      const r = res.rows[0];
      return new Passageiro(
        r.id_usuario, r.nome, r.sobrenome, r.email, r.senha, r.criado_em,
        r.id_passageiro, r.cpf, r.celular, r.data_nascimento,
        r.necessidades ?? [], r.tipo_viagem, r.preferencia_clima,
      );
    } catch (error) {
      console.error(`Erro ao buscar passageiro por id: ${error}`);
      return null;
    }
  }

  static async listarPassageiros(): Promise<Array<Passageiro> | null> {
    try {
      const res = await database.query(
        `SELECT u.*, p.id_passageiro, p.cpf, p.celular, p.data_nascimento,
                p.necessidades, p.tipo_viagem, p.preferencia_clima
         FROM usuario u
         JOIN passageiro p ON p.id_usuario = u.id_usuario;`
      );
      return res.rows.map((r) => new Passageiro(
        r.id_usuario, r.nome, r.sobrenome, r.email, r.senha, r.criado_em,
        r.id_passageiro, r.cpf, r.celular, r.data_nascimento,
        r.necessidades ?? [], r.tipo_viagem, r.preferencia_clima,
      ));
    } catch (error) {
      console.error(`Erro ao listar passageiros: ${error}`);
      return null;
    }
  }

  static async editarPerfil(
    idPassageiro: number,
    dados: Partial<PassageiroDTO>
  ): Promise<boolean> {
    try {
      // Update usuario table
      if (dados.email || dados.senha) {
        const camposU: string[] = [];
        const valoresU: any[] = [];
        let i = 1;
        if (dados.email) { camposU.push(`email = $${i++}`); valoresU.push(dados.email); }
        if (dados.senha) { camposU.push(`senha = $${i++}`); valoresU.push(dados.senha); }
        valoresU.push(idPassageiro);
        await database.query(
          `UPDATE usuario SET ${camposU.join(", ")}
           WHERE id_usuario = (SELECT id_usuario FROM passageiro WHERE id_passageiro = $${i});`,
          valoresU
        );
      }

      // Update passageiro table
      const camposP: string[] = [];
      const valoresP: any[] = [];
      let j = 1;
      if (dados.celular)          { camposP.push(`celular = $${j++}`);           valoresP.push(dados.celular); }
      if (dados.necessidades)     { camposP.push(`necessidades = $${j++}`);      valoresP.push(dados.necessidades); }
      if (dados.tipoViagem)       { camposP.push(`tipo_viagem = $${j++}`);       valoresP.push(dados.tipoViagem); }
      if (dados.preferenciaClima) { camposP.push(`preferencia_clima = $${j++}`); valoresP.push(dados.preferenciaClima); }

      if (camposP.length > 0) {
        valoresP.push(idPassageiro);
        await database.query(
          `UPDATE passageiro SET ${camposP.join(", ")} WHERE id_passageiro = $${j};`,
          valoresP
        );
      }

      return true;
    } catch (error) {
      console.error(`Erro ao editar perfil do passageiro: ${error}`);
      return false;
    }
  }
}