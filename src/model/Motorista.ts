import { Usuario } from "./Usuario.js";
import { DatabaseModel } from "./DatabaseModel.js";
import type { MotoristaDTO } from "../interface/MotoristaDTO.js";

const database = new DatabaseModel().pool;

export class Motorista extends Usuario {
  private idMotorista: number;
  private cpf: string;
  private cnh: string;
  private celular: string;
  private dataNascimento: Date;
  private antecedentesCriminais: string;
  private especializacao: string;
  private disponivel: boolean;

  constructor(
    idUsuario: number,
    nome: string,
    sobrenome: string,
    email: string,
    senha: string,
    criadoEm: Date,
    idMotorista: number,
    cpf: string,
    cnh: string,
    celular: string,
    dataNascimento: Date,
    antecedentesCriminais: string,
    especializacao: string,
    disponivel: boolean = false,
  ) {
    super(idUsuario, nome, sobrenome, email, "motorista", senha, criadoEm);
    this.idMotorista = idMotorista;
    this.cpf = cpf;
    this.cnh = cnh;
    this.celular = celular;
    this.dataNascimento = dataNascimento;
    this.antecedentesCriminais = antecedentesCriminais;
    this.especializacao = especializacao;
    this.disponivel = disponivel; 
  }

  public getIdMotorista(): number { return this.idMotorista; }
  public getCpf(): string { return this.cpf; }
  public getCnh(): string { return this.cnh; }
  public getCelular(): string { return this.celular; }
  public getDataNascimento(): Date { return this.dataNascimento; }
  public getAntecedentesCriminais(): string { return this.antecedentesCriminais; }
  public getEspecializacao(): string { return this.especializacao; }
  public getDisponivel(): boolean {return this.disponivel;}
  

  public setIdMotorista(v: number): void { this.idMotorista = v; }
  public setCpf(v: string): void { this.cpf = v; }
  public setCnh(v: string): void { this.cnh = v; }
  public setCelular(v: string): void { this.celular = v; }
  public setDataNascimento(v: Date): void { this.dataNascimento = v; }
  public setAntecedentesCriminais(v: string): void { this.antecedentesCriminais = v; }
  public setEspecializacao(v: string): void { this.especializacao = v; }
  public setDisponivel(v: boolean): void {this.disponivel = v;}

  static async cadastrarMotorista(motorista: MotoristaDTO): Promise<number | null> {
  try {
    const idUsuario = await Usuario.criarUsuario(
      motorista.nome,      
      motorista.sobrenome, 
      motorista.email,
      motorista.senha,
      "motorista"
    );
    if (!idUsuario) return null;
    const res = await database.query(
      `INSERT INTO motorista
        (id_usuario, cpf, cnh, celular, data_nascimento, antecedentes_criminais, especializacao)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id_motorista;`,
      [
        idUsuario,
        motorista.cpf,
        motorista.cnh,
        motorista.celular,
        motorista.dataNascimento,
        motorista.antecedentesCriminais.toUpperCase(),
        (motorista.especializacao ?? "Nenhuma").toUpperCase(),
      ]
    );
    return res.rows[0].id_motorista;
  } catch (error) {
    console.error(`Erro ao cadastrar motorista: ${error}`);
    throw error;
  }
}
  static async buscarPorEmail(email: string): Promise<Motorista | null> {
    try {
      const res = await database.query(
        `SELECT u.*, m.id_motorista, m.cpf, m.cnh, m.celular,
                m.data_nascimento, m.antecedentes_criminais, m.especializacao
         FROM usuario u
         JOIN motorista m ON m.id_usuario = u.id_usuario
         WHERE u.email = $1;`,
        [email]
      );
      if (res.rows.length === 0) return null;
      const r = res.rows[0];
      return new Motorista(
        r.id_usuario, r.nome, r.sobrenome, r.email, r.senha, r.criado_em,
        r.id_motorista, r.cpf, r.cnh, r.celular,
        r.data_nascimento, r.antecedentes_criminais, r.especializacao,
      );
    } catch (error) {
      console.error(`Erro ao buscar motorista: ${error}`);
      return null;
    }
  }

static async buscarPorId(idMotorista: number): Promise<Motorista | null> {
  try {
    const res = await database.query(
      `SELECT u.*, m.id_motorista, m.cpf, m.cnh, m.celular,
              m.data_nascimento, m.antecedentes_criminais, m.especializacao,
              m.disponivel
       FROM usuario u
       JOIN motorista m ON m.id_usuario = u.id_usuario
       WHERE m.id_motorista = $1;`,
      [idMotorista]
    );
    if (res.rows.length === 0) return null;
    const r = res.rows[0];
    return new Motorista(
      r.id_usuario, r.nome, r.sobrenome, r.email, r.senha, r.criado_em,
      r.id_motorista, r.cpf, r.cnh, r.celular,
      r.data_nascimento, r.antecedentes_criminais, r.especializacao,
      r.disponivel,
    );
  } catch (error) {
    console.error(`Erro ao buscar motorista por id: ${error}`);
    return null;
  }
}

  static async listarMotoristas(): Promise<Array<any> | null> {
    try {
      const res = await database.query(
        `SELECT u.*, m.id_motorista, m.cpf, m.cnh, m.celular,
                m.data_nascimento, m.antecedentes_criminais, m.especializacao,
                ROUND(AVG(ac.nota), 1) as media_avaliacao,
                COUNT(ac.id_avaliacao) as total_avaliacoes
         FROM usuario u
         JOIN motorista m ON m.id_usuario = u.id_usuario
         LEFT JOIN corrida c ON c.id_motorista = m.id_motorista
         LEFT JOIN avaliacao_corrida ac ON ac.id_corrida = c.id_corrida
         GROUP BY u.id_usuario, m.id_motorista;`
      );
      return res.rows.map((r) => ({
        idMotorista: r.id_motorista,
        nome: r.nome,
        sobrenome: r.sobrenome,
        email: r.email,
        cpf: r.cpf,
        cnh: r.cnh,
        celular: r.celular,
        dataNascimento: r.data_nascimento,
        especializacao: r.especializacao,
        mediaAvaliacao: r.media_avaliacao ? parseFloat(r.media_avaliacao) : null,
        totalAvaliacoes: parseInt(r.total_avaliacoes),
      }));
    } catch (error) {
      console.error(`Erro ao listar motoristas: ${error}`);
      return null;
    }
  }

  static async editarPerfil(
    idMotorista: number,
    dados: Partial<MotoristaDTO>
  ): Promise<boolean> {
    try {
      if (dados.email || dados.senha) {
        const camposU: string[] = [];
        const valoresU: any[] = [];
        let i = 1;
        if (dados.email) { camposU.push(`email = $${i++}`); valoresU.push(dados.email); }
        if (dados.senha) { camposU.push(`senha = $${i++}`); valoresU.push(dados.senha); }
        valoresU.push(idMotorista);
        await database.query(
          `UPDATE usuario SET ${camposU.join(", ")}
           WHERE id_usuario = (SELECT id_usuario FROM motorista WHERE id_motorista = $${i});`,
          valoresU
        );
      }

      const camposM: string[] = [];
      const valoresM: any[] = [];
      let j = 1;
      if (dados.celular)        { camposM.push(`celular = $${j++}`);        valoresM.push(dados.celular); }
      if (dados.especializacao) { camposM.push(`especializacao = $${j++}`); valoresM.push(dados.especializacao); }

      if (camposM.length > 0) {
        valoresM.push(idMotorista);
        await database.query(
          `UPDATE motorista SET ${camposM.join(", ")} WHERE id_motorista = $${j};`,
          valoresM
        );
      }

      return true;
    } catch (error) {
      console.error(`Erro ao editar perfil do motorista: ${error}`);
      return false;
    }
  }
  static async alterarDisponibilidade(
  idMotorista: number,
  disponivel: boolean
): Promise<boolean> {
  try {
    const res = await database.query(
      `UPDATE motorista SET disponivel = $1 WHERE id_motorista = $2 RETURNING id_motorista;`,
      [disponivel, idMotorista]
    );
    return res.rowCount !== null && res.rowCount > 0;
  } catch (error) {
    console.error(`Erro ao alterar disponibilidade: ${error}`);
    return false;
    }
  }
}
