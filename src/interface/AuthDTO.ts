export interface RegisterDTO {
  nome: string;
  cpf: string;
  email: string;
  senha: string;
}

export interface LoginDTO {
  email: string;
  senha: string;
}