export interface PassageiroDTO {
  idPassageiro?: number;
  cpf: string;
  nomePassageiro: string;
  sobrenomePassageiro: string;
  dataNascimento: Date;
  email: string;
  celular: string;
  necessidades?: string[];
  senha: string;
  criadoEm?: Date;
}