export interface CorridaDTO {
  idCorrida?: number;
  idPassageiro: number;
  idMotorista?: number | null;
  idVeiculo?: number | null;
  origemCorrida: string;
  destinoCorrida: string;
  preco: number;
  dataCorrida?: Date;
  duracaoCorrida: number;
  statusCorrida: "Pendente" | "Aceito" | "Em andamento" | "Finalizada" | "Cancelada";
}