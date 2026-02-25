export interface MotoristaDTO {
  idMotorista?: number;
  cpf: string;
  cnh: string;
  nomeMotorista: string;
  sobrenomeMotorista: string;
  dataNascimento: Date;
  celular: string;
  endereco: string;
  email: string;
  antecedentesCriminais: string;
  senha: string;
  criadoEm?: Date;
}