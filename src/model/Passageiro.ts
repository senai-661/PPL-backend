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
    private senha: string;

    constructor(
        id: number = 0, 
        nome: string = "", 
        sobrenome: string = "", 
        cpf: string = "", 
        dataNasc: Date = new Date(), 
        celular: string = "", 
        email: string = "", 
        senha: string = ""
    ) {
        this.idPassageiro = id;
        this.nomePassageiro = nome;
        this.sobrenomePassageiro = sobrenome;
        this.cpf = cpf;
        this.dataNascimento = dataNasc;
        this.celular = celular;
        this.email = email;
        this.senha = senha;
    }

    // --- Getters completos para o Controller conseguir ler tudo ---
    public getIdPassageiro(): number { return this.idPassageiro; }
    public getNomePassageiro(): string { return this.nomePassageiro; }
    public getSobrenomePassageiro(): string { return this.sobrenomePassageiro; }
    public getCpf(): string { return this.cpf; }
    public getDataNascimento(): Date { return this.dataNascimento; }
    public getCelular(): string { return this.celular; }
    public getEmail(): string { return this.email; }
    public getSenha(): string { return this.senha; }

    static async cadastrarPassageiro(passageiro: PassageiroDTO): Promise<number | null> {
        try {
            const query = `
                INSERT INTO passageiro (cpf, nome_passageiro, sobrenome_passageiro, data_nascimento, email, celular, senha)
                VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_passageiro;
            `;
            const res = await database.query(query, [
                passageiro.cpf, 
                passageiro.nomePassageiro.toUpperCase(), 
                passageiro.sobrenomePassageiro.toUpperCase(),
                passageiro.dataNascimento, 
                passageiro.email, 
                passageiro.celular, 
                passageiro.senha
            ]);
            return res.rows[0].id_passageiro;
        } catch (error) {
            console.error("Erro no Model Passageiro:", error);
            return null;
        }
    }

    static async listarPassageiros(): Promise<Array<Passageiro> | null> {
        try {
            const res = await database.query(`SELECT * FROM passageiro;`);
            // MAPEAMENTO CORRETO: Pegando do banco (snake_case) e jogando no construtor
            return res.rows.map(p => new Passageiro(
                p.id_passageiro, 
                p.nome_passageiro, 
                p.sobrenome_passageiro, 
                p.cpf, 
                p.data_nascimento, 
                p.celular, 
                p.email, 
                p.senha
            ));
        } catch (error) {
            console.error("Erro ao listar passageiros:", error);
            return null;
        }
    }
}