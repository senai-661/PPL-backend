export interface PassageiroDTO {
  idPassageiro?: number;
  cpf: string;
  nomePassageiro: string;
  sobrenomePassageiro: string;
  dataNascimento: Date;
  email: string;
  celular: string;
  necessidades?: string[];
  tipoViagem?: string;
  preferenciaClima?: string;
  senha: string;
  criadoEm?: Date;
}