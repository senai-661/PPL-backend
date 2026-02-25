export interface CorridaDTO {
  idCorrida?: number;
  idPassageiro: number;
  idMotorista?: number;
  idVeiculo?: number;
  origemCorrida: string;
  destinoCorrida: string;
  preco: number;
  dataCorrida?: Date;
  duracaoCorrida: number;
  statusCorrida: "Em andamento" | "Finalizada" | "Cancelada";
}