export interface PassageiroDTO {
  idPassageiro?: number;
  cpf: number;
  nomePassageiro: string;
  sobrenomePassageiro: string;
  dataNascimento: Date;
  endereco: string;
  email: string;
  celular: number;
  senha: string; // Adicionando a senha ao DTO
}
