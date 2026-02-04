export interface CorridaDTO {
  idCorrida?: number;
  idPassageiro: number;
  idMotorista: number;
  idVeiculo: number;
  origemCorrida: string;
  destinoCorrida: string;
  preco: number;
  avaliacao: string;
  dataCorrida: Date;
  duracaoCorrida: number;
  statusCorrida: string;
}
