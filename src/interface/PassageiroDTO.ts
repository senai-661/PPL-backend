export interface PassageiroDTO {
  idPassageiro?: number;
  cpf: string;
  nomePassageiro: string;
  sobrenomePassageiro: string;
  dataNascimento: Date;
  endereco: string;
  email: string;
  celular: string;
  senha: string;
  criadoEm?: Date;
}