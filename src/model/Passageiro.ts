import type { PassageiroDTO } from "../interface/PassageiroDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";
import { AuthService } from "../services/AuthService.js"; 

const database = new DatabaseModel().pool;

class Passageiro {
  // 1. DECLARAÇÃO DOS ATRIBUTOS (O erro costuma ser aqui!)
  private idPassageiro: number = 0;
  private cpf: number;
  private nomePassageiro: string;
  private sobrenomePassageiro: string;
  private dataNascimento: Date;
  private endereco: string;
  private email: string;
  private celular: number;
  private senha: string; // <-- ESSA LINHA PRECISA ESTAR AQUI

  constructor(
    _idPassageiro: number = 0,
    _cpf: number,
    _nomePassageiro: string,
    _sobrenomePassageiro: string,
    _dataNascimento: Date,
    _endereco: string,
    _email: string,
    _celular: number,
    _senha?: string // E o parâmetro aqui
  ) {
    this.idPassageiro = _idPassageiro;
    this.cpf = _cpf;
    this.nomePassageiro = _nomePassageiro;
    this.sobrenomePassageiro = _sobrenomePassageiro;
    this.dataNascimento = _dataNascimento;
    this.endereco = _endereco;
    this.email = _email;
    this.celular = _celular;
    this.senha = _senha; // Agora o TS reconhece o 'this.senha'
  }

  // --- Getters e Setters ---
  public getIdPassageiro(): number { return this.idPassageiro; }
  public setIdPassageiro(idPassageiro: number): void { this.idPassageiro = idPassageiro; }
  public getCpf(): number { return this.cpf; }
  public setCpf(cpf: number): void { this.cpf = cpf; }
  public getNomePassageiro(): string { return this.nomePassageiro; }
  public setNomePassageiro(nomePassageiro: string): void { this.nomePassageiro = nomePassageiro; }
  public getSobrenomePassageiro(): string { return this.sobrenomePassageiro; }
  public setSobrenomePassageiro(sobrenomePassageiro: string): void { this.sobrenomePassageiro = sobrenomePassageiro; }
  public getDataNascimento(): Date { return this.dataNascimento; }
  public setDataNascimento(dataNascimento: Date): void { this.dataNascimento = dataNascimento; }
  public getEndereco(): string { return this.endereco; }
  public setEndereco(endereco: string): void { this.endereco = endereco; }
  public getEmail(): string { return this.email; }
  public setEmail(email: string): void { this.email = email; }
  public getCelular(): number { return this.celular; }
  public setCelular(celular: number): void { this.celular = celular; }
  
  // Getter e Setter da Senha (RNF001)
  public getSenha(): string | undefined { return this.senha; }
  public setSenha(senha: string): void { this.senha = senha; }

  // --- Métodos Estáticos ---

  static async cadastrarPassageiro(passageiro: PassageiroDTO): Promise<boolean> {
    try {
      // Verificando se a senha veio no DTO (Segurança de tipagem)
      if (!passageiro.senha) {
        throw new Error("Senha não fornecida.");
      }

      const senhaHash = await AuthService.gerarHash(passageiro.senha);

      const queryInsertPassageiro = `
        INSERT INTO passageiro (cpf, nome_passageiro, sobrenome_passageiro, data_nascimento, endereco, email, celular, senha)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id_passageiro;`;

      const respostaBD = await database.query(queryInsertPassageiro, [
        passageiro.cpf,
        passageiro.nomePassageiro.toUpperCase(),
        passageiro.sobrenomePassageiro.toUpperCase(),
        passageiro.dataNascimento,
        passageiro.endereco,
        passageiro.email,
        passageiro.celular,
        senhaHash
      ]);

      return respostaBD.rows.length > 0;
    } catch (error) {
      console.error("Erro ao cadastrar passageiro:", error);
      return false;
    }
  }

  static async buscarPorEmail(email: string): Promise<any | null> {
    try {
      const query = `SELECT * FROM passageiro WHERE email = $1`;
      const resultado = await database.query(query, [email]);
      return resultado.rows[0] || null;
    } catch (error) {
      return null;
    }
  }

  static async listarPassageiros(): Promise<Array<Passageiro> | null> {
    try {
      let listaDePassageiros: Array<Passageiro> = [];
      const querySelectPassageiros = `SELECT * FROM passageiro;`;
      const respostaBD = await database.query(querySelectPassageiros);
      
      respostaBD.rows.forEach((p) => {
        listaDePassageiros.push(new Passageiro(
          p.id_passageiro, p.cpf, p.nome_passageiro, p.sobrenome_passageiro, 
          p.data_nascimento, p.endereco, p.email, p.celular, p.senha
        ));
      });
      return listaDePassageiros;
    } catch (error) {
      console.error(`Erro ao consultar passageiros. ${error}`);
      return null;
    }
  }
}

export { Passageiro };