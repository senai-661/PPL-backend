export interface CorridaDTO {
  idCorrida?: number;
  idPassageiro: number;
  idMotorista?: number | null;
  idVeiculo?: number | null;
  origemCorrida: string;
  destinoCorrida: string;
  tipoCorrida?: string;           
  preco: number;
  dataCorrida?: Date;
  duracaoCorrida: number;
  motivoCancelamento?: string | null;
  statusCorrida: "Pendente" | "Aceito" | "Em andamento" | "Finalizada" | "Cancelada";
}