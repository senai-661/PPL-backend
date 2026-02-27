export interface PassageiroDTO {
  idPassageiro?: number;
  cpf: string;
  nomePassageiro: string;
  sobrenomePassageiro: string;
  dataNascimento: Date;
  // endereco foi removido daqui!
  email: string;
  celular: string;
  senha: string;
  criadoEm?: Date;
}