export interface MotoristaDTO {
  idMotorista?: number;
  cpf: string;
  cnh: string;
  nomeMotorista: string;
  sobrenomeMotorista: string;
  dataNascimento: Date;
  celular: string;
  email: string;
  antecedentesCriminais: string;
  especializacao?: string;
  senha: string;
  criadoEm?: Date;
}
