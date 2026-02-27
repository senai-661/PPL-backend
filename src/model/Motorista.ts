import type { MotoristaDTO } from "../interface/MotoristaDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

export class Motorista {
    private idMotorista: number;
    private nomeMotorista: string;
    private sobrenomeMotorista: string;
    private cpf: string; 
    private cnh: string;
    private dataNascimento: Date;
    private celular: string;
    private endereco: string;
    private email: string;
    private antecedentesCriminais: string;
    private senha: string;

    constructor(
        _idMotorista: number = 0,
        _nomeMotorista: string = "",
        _sobrenomeMotorista: string = "",
        _cpf: string = "",
        _cnh: string = "",
        _dataNascimento: Date = new Date(),
        _celular: string = "",
        _endereco: string = "",
        _email: string = "", 
        _antecedentesCriminais: string = "",
        _senha: string = ""
    ) {
        this.idMotorista = _idMotorista;
        this.nomeMotorista = _nomeMotorista;
        this.sobrenomeMotorista = _sobrenomeMotorista;
        this.cpf = _cpf;
        this.cnh = _cnh;
        this.dataNascimento = _dataNascimento;
        this.celular = _celular;
        this.endereco = _endereco;
        this.email = _email;
        this.antecedentesCriminais = _antecedentesCriminais;
        this.senha = _senha;  
    }

    // --- GETTERS (Essenciais para o Controller ler os dados) ---
    public getIdMotorista(): number { return this.idMotorista; }
    public getNomeMotorista(): string { return this.nomeMotorista; }
    public getSobrenomeMotorista(): string { return this.sobrenomeMotorista; }
    public getCpf(): string { return this.cpf; }
    public getCnh(): string { return this.cnh; }
    public getDataNascimento(): Date { return this.dataNascimento; }
    public getCelular(): string { return this.celular; }
    public getEndereco(): string { return this.endereco; }
    public getEmail(): string { return this.email; }
    public getAntecedentesCriminais(): string { return this.antecedentesCriminais; }
    public getSenha(): string { return this.senha; }

    // --- MÉTODOS ESTÁTICOS (Persistência) ---

    static async cadastrarMotorista(motorista: MotoristaDTO): Promise<boolean> {
        try {
            const queryInsert = `
                INSERT INTO motorista (cpf, cnh, nome_motorista, sobrenome_motorista, data_nascimento, celular, endereco, email, antecedentes_criminais, senha)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id_motorista;`;
            
            const values = [
                motorista.cpf, 
                motorista.cnh, 
                motorista.nomeMotorista.toUpperCase(),
                motorista.sobrenomeMotorista.toUpperCase(), 
                motorista.dataNascimento,
                motorista.celular, 
                motorista.endereco, 
                motorista.email,
                motorista.antecedentesCriminais.toUpperCase(), 
                motorista.senha
            ];

            const respostaBD = await database.query(queryInsert, values);
            return respostaBD.rows.length > 0;
        } catch (error) {
            console.error(`Erro ao cadastrar motorista: ${error}`);
            return false;
        }
    }

    static async buscarPorEmail(email: string): Promise<Motorista | null> {
        try {
            const querySelect = `SELECT * FROM motorista WHERE email = $1;`;
            const res = await database.query(querySelect, [email]);
            if (res.rows.length > 0) {
                const m = res.rows[0];
                return new Motorista(
                    m.id_motorista, m.nome_motorista, m.sobrenome_motorista, 
                    m.cpf, m.cnh, m.data_nascimento, m.celular, 
                    m.endereco, m.email, m.antecedentes_criminais, m.senha
                );
            }
            return null;
        } catch (error) {
            console.error("Erro ao buscar por email:", error);
            return null;
        }
    }

    static async listarMotoristas(): Promise<Array<Motorista> | null> {
        try {
            const res = await database.query(`SELECT * FROM motorista;`);
            return res.rows.map(m => new Motorista(
                m.id_motorista, m.nome_motorista, m.sobrenome_motorista, 
                m.cpf, m.cnh, m.data_nascimento, m.celular, 
                m.endereco, m.email, m.antecedentes_criminais, m.senha
            ));
        } catch (error) {
            console.error("Erro ao listar motoristas:", error);
            return null;
        }
    }
}