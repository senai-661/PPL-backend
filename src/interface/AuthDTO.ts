export interface RegisterPassageiroDTO {
    cpf: string;
    nome_passageiro: string;
    sobrenome_passageiro: string;
    data_nascimento: Date;
    endereco: string;
    email: string;
    celular: string;
    senha: string; // Senha em texto plano que virá do Postman
}

export interface LoginDTO {
    email: string;
    senha: string;
}