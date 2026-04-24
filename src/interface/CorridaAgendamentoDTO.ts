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

  duracao?: number;

  statusAgendamento?: string;

  dataAgendada?: Date | null;
}