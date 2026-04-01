export interface MotoristaDTO {
  idMotorista?: number;
  cpf: string;
  cnh: string;
  nome: string;        
  sobrenome: string;   
  dataNascimento: Date;
  email: string;
  celular: string;
  antecedentesCriminais: string;
  especializacao?: string;
  senha: string;
  criadoEm?: Date;
}