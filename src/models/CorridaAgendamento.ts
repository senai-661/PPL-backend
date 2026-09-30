export class CorridaAgendamento {
  public idAgendamento?: number | undefined;
  public idPassageiro: number;
  public origemCorrida: string;
  public destinoCorrida: string;
  public tipoCorrida: string;
  public dataAgendada: string;
  public statusAgendamento: string;
  public preco: number;

  constructor(
    idPassageiro: number,
    origemCorrida: string,
    destinoCorrida: string,
    tipoCorrida: string = "NORMAL",
    dataAgendada: string = "",
    statusAgendamento: string = "PENDENTE",
    preco: number = 28,
    idAgendamento?: number,
  ) {
    this.idPassageiro = idPassageiro;
    this.origemCorrida = origemCorrida;
    this.destinoCorrida = destinoCorrida;
    this.tipoCorrida = tipoCorrida;
    this.dataAgendada = dataAgendada;
    this.statusAgendamento = statusAgendamento;
    this.preco = preco;
    this.idAgendamento = idAgendamento;
  }
}

export { CorridaAgendamentoRepository as CorridaModel } from "../repositories/CorridaAgendamentoRepository.js";