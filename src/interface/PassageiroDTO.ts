export interface PassageiroDTO {
  idPassageiro?: number;
  cpf: string;
  nome: string;        
  sobrenome: string;   
  dataNascimento: Date;
  email: string;
  celular: string;
  necessidades?: string[];
  senha: string;
  criadoEm?: Date;
}