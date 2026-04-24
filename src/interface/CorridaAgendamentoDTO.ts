export interface CorridaAgendamentoDTO {
  idCorrida?: number;

  idPassageiro: number;
  idMotorista?: number | null;
  idVeiculo?: number | null;

  origemCorrida: string;
  destinoCorrida: string;

  tipoCorrida?: string;

  preco: number;

  dataAgendada: string; // <- ESSENCIAL
  statusAgendamento?: string; // ex: PENDENTE, CONFIRMADA, CANCELADA

  duracao?: number;
}