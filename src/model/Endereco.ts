import { DatabaseModel } from "./DatabaseModel.js";
import type { EnderecoDTO } from "../interface/EnderecoDTO.js";

const database = new DatabaseModel().pool;

export class Endereco {
  private id_endereco?: number;
  private rua: string;
  private numero: string;
  private bairro: string;
  private cidade: string;
  private estado: string;
  private cep: string;
  private complemento: string | null;
  private id_motorista: number | null;
  private id_passageiro: number | null;

  constructor(dados: EnderecoDTO) {
    this.rua = dados.rua;
    this.numero = dados.numero;
    this.bairro = dados.bairro;
    this.cidade = dados.cidade;
    this.estado = dados.estado;
    this.cep = dados.cep;
    this.complemento =
      dados.complemento !== undefined ? dados.complemento : null;
    this.id_motorista = dados.id_motorista || null;
    this.id_passageiro = dados.id_passageiro || null;
  }

  // --- Getters e Setters ---
  public getRua(): string {
    return this.rua;
  }
  public setRua(value: string) {
    this.rua = value;
  }

  public getNumero(): string {
    return this.numero;
  }
  public setNumero(value: string) {
    this.numero = value;
  }

  public getBairro(): string {
    return this.bairro;
  }
  public setBairro(value: string) {
    this.bairro = value;
  }

  public getCidade(): string {
    return this.cidade;
  }
  public setCidade(value: string) {
    this.cidade = value;
  }

  public getEstado(): string {
    return this.estado;
  }
  public setEstado(value: string) {
    this.estado = value;
  }

  public getCep(): string {
    return this.cep;
  }
  public setCep(value: string) {
    this.cep = value;
  }

  // --- Métodos de Banco ---
  static async cadastro(endereco: Endereco): Promise<boolean> {
    try {
      const query = `
                INSERT INTO endereco (rua, numero, bairro, cidade, estado, cep, complemento, id_motorista, id_passageiro)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `;
      const valores = [
        endereco.rua,
        endereco.numero,
        endereco.bairro,
        endereco.cidade,
        endereco.estado,
        endereco.cep,
        endereco.complemento,
        endereco.id_motorista,
        endereco.id_passageiro,
      ];
      await database.query(query, valores);
      return true;
    } catch (error) {
      console.error("Erro ao salvar endereço:", error);
      return false;
    }
  }
  static async listarTodos(): Promise<any[] | null> {
    try {
      const query = `
            SELECT 
                e.*, 
                m.nome_motorista as dono_motorista, 
                p.nome_passageiro as dono_passageiro
            FROM endereco e
            LEFT JOIN motorista m ON e.id_motorista = m.id_motorista
            LEFT JOIN passageiro p ON e.id_passageiro = p.id_passageiro
            ORDER BY e.id_endereco ASC;
        `;
      const res = await database.query(query);

      // Tratamos os dados para facilitar a leitura no Front-end
      return res.rows.map((row) => ({
        id: row.id_endereco,
        rua: row.rua,
        numero: row.numero,
        bairro: row.bairro,
        cidade: row.cidade,
        estado: row.estado,
        cep: row.cep,
        complemento: row.complemento,
        // Lógica para definir quem é o dono
        proprietario:
          row.dono_motorista || row.dono_passageiro || "Não identificado",
        tipo_usuario: row.id_motorista ? "Motorista" : "Passageiro",
      }));
    } catch (error) {
      console.error("Erro ao listar endereços com JOIN:", error);
      return null;
    }
  }
}
