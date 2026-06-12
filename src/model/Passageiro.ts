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
  ) {
    super(idUsuario, nome, sobrenome, email, "passageiro", senha, criadoEm);
    this.idPassageiro = idPassageiro;
    this.cpf = cpf;
    this.celular = celular;
    this.dataNascimento = dataNascimento;
    this.necessidades = necessidades;
  }

  public getIdPassageiro(): number { return this.idPassageiro; }
  public getCpf(): string { return this.cpf; }
  public getCelular(): string { return this.celular; }
  public getDataNascimento(): Date { return this.dataNascimento; }
  public getNecessidades(): string[] { return this.necessidades; }

  public setIdPassageiro(v: number): void { this.idPassageiro = v; }
  public setCpf(v: string): void { this.cpf = v; }
  public setCelular(v: string): void { this.celular = v; }
  public setDataNascimento(v: Date): void { this.dataNascimento = v; }
  public setNecessidades(v: string[]): void { this.necessidades = v; }

 static async cadastrarPassageiro(passageiro: PassageiroDTO, endereco?: any): Promise<number | null> {
  try {
    const res = await database.query(
      `SELECT sp_cadastrar_passageiro(
         $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
       ) AS id;`,
      [
        passageiro.nome,
        passageiro.sobrenome,
        passageiro.email,
        passageiro.senha,
        passageiro.cpf,
        passageiro.celular,
        passageiro.dataNascimento,
        passageiro.necessidades ?? [],
        endereco?.rua ?? null,
        endereco?.numero ?? null,
        endereco?.bairro ?? null,
        endereco?.cidade ?? null,
        endereco?.estado ?? null,
        endereco?.cep ?? null,
      ]
    );
    return res.rows[0]?.id ?? null;
  } catch (error) {
    console.error(`Erro ao cadastrar passageiro: ${error}`);
    throw error;
  }
 }
  static async buscarPorEmail(email: string): Promise<Passageiro | null> {
    try {
      const res = await database.query(
        `SELECT * FROM vw_passageiros_detalhados
         WHERE email = $1;`,
        [email]
      );
      if (res.rows.length === 0) return null;
      const r = res.rows[0];
      return new Passageiro(
        r.id_usuario, r.nome, r.sobrenome, r.email, r.senha, r.criado_em,
        r.id_passageiro, r.cpf, r.celular, r.data_nascimento, r.necessidades ?? [],
      );
    } catch (error) {
      console.error(`Erro ao buscar passageiro: ${error}`);
      return null;
    }
  }

  static async buscarPorId(idPassageiro: number): Promise<Passageiro | null> {
    try {
      const res = await database.query(
        `SELECT * FROM vw_passageiros_detalhados
         WHERE id_passageiro = $1;`,
        [idPassageiro]
      );
      if (res.rows.length === 0) return null;
      const r = res.rows[0];
      return new Passageiro(
        r.id_usuario, r.nome, r.sobrenome, r.email, r.senha, r.criado_em,
        r.id_passageiro, r.cpf, r.celular, r.data_nascimento, r.necessidades ?? [],
      );
    } catch (error) {
      console.error(`Erro ao buscar passageiro por id: ${error}`);
      return null;
    }
  }

  static async listarPassageiros(): Promise<Array<Passageiro> | null> {
    try {
      const res = await database.query(
        `SELECT * FROM vw_passageiros_detalhados;`
      );
      return res.rows.map((r) => new Passageiro(
        r.id_usuario, r.nome, r.sobrenome, r.email, r.senha, r.criado_em,
        r.id_passageiro, r.cpf, r.celular, r.data_nascimento, r.necessidades ?? [],
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
      const temCamposU = dados.nome || dados.sobrenome || dados.email || dados.senha;
      const temCamposP = dados.cpf || dados.celular || dados.dataNascimento || dados.necessidades;

      if (!temCamposU && !temCamposP) {
        return false;
      }

      if (temCamposU) {
        const camposU: string[] = [];
        const valoresU: any[] = [];
        let i = 1;
        if (dados.nome)      { camposU.push(`nome = $${i++}`);      valoresU.push(dados.nome.toUpperCase()); }
        if (dados.sobrenome) { camposU.push(`sobrenome = $${i++}`); valoresU.push(dados.sobrenome.toUpperCase()); }
        if (dados.email)     { camposU.push(`email = $${i++}`);     valoresU.push(dados.email); }
        if (dados.senha)     { camposU.push(`senha = $${i++}`);     valoresU.push(dados.senha); }
        valoresU.push(idPassageiro);
        await database.query(
          `UPDATE usuario SET ${camposU.join(", ")}
           WHERE id_usuario = (SELECT id_usuario FROM passageiro WHERE id_passageiro = $${i});`,
          valoresU
        );
      }

      if (temCamposP) {
        const camposP: string[] = [];
        const valoresP: any[] = [];
        let j = 1;
        if (dados.cpf)            { camposP.push(`cpf = $${j++}`);            valoresP.push(dados.cpf); }
        if (dados.celular)        { camposP.push(`celular = $${j++}`);        valoresP.push(dados.celular); }
        if (dados.dataNascimento) { camposP.push(`data_nascimento = $${j++}`); valoresP.push(dados.dataNascimento); }
        if (dados.necessidades)   { camposP.push(`necessidades = $${j++}`);   valoresP.push(dados.necessidades); }

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

  static async relatorioPassageiro(idPassageiro: number): Promise<any | null> {
    try {
      // Stats de corridas
      const statsRes = await database.query(
        `SELECT
          COUNT(*) FILTER (WHERE status_corrida = 'Finalizada') AS total_finalizadas,
          COUNT(*) AS total_corridas,
          COALESCE(SUM(preco) FILTER (WHERE status_corrida = 'Finalizada'), 0) AS total_gasto
         FROM corrida
         WHERE id_passageiro = $1;`,
        [idPassageiro],
      );
      // Destino mais frequente
      const destinoRes = await database.query(
        `SELECT destino_corrida, COUNT(*) as total
         FROM corrida
         WHERE id_passageiro = $1 AND status_corrida = 'Finalizada'
         GROUP BY destino_corrida
         ORDER BY total DESC
         LIMIT 1;`,
        [idPassageiro],
      );
      // Data de cadastro (desde)
      const usuarioRes = await database.query(
        `SELECT criado_em FROM vw_passageiros_detalhados
         WHERE id_passageiro = $1;`,
        [idPassageiro],
      );
      const stats = statsRes.rows[0];
      const destinoFavorito = destinoRes.rows[0]?.destino_corrida || null;
      const desde = usuarioRes.rows[0]?.criado_em || new Date();
      return {
        totalViagens: parseInt(stats.total_finalizadas) || 0,
        totalGasto: parseFloat(stats.total_gasto) || 0,
        destinoFavorito: destinoFavorito,
        desde: desde,
      };
    } catch (error) {
      console.error(`Erro ao gerar relatório do passageiro: ${error}`);
      return null;
    }
  }
}

