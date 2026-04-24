import { CorridaAgendamentoDTO } from "../interface/CorridaAgendamentoDTO.js";

export class CorridaModel {
  constructor(private db: any) {}

  public async criarAgendamento(data: CorridaAgendamentoDTO) {
    const query = `
      INSERT INTO corridas_agendadas 
      (id_passageiro, origem_corrida, destino_corrida, tipo_corrida, data_agendada, status_agendamento, preco)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      data.idPassageiro,
      data.origemCorrida,
      data.destinoCorrida,
      data.tipoCorrida || 'NORMAL',
      data.dataAgendada,
      data.statusAgendamento || 'PENDENTE',
      data.preco || 28,
    ];

    const result = await this.db.pool.query(query, values);
    return result.rows[0];
  }

  public async listarAgendamentosPorPassageiro(idPassageiro: number) {
    const query = `
      SELECT * FROM corridas_agendadas 
      WHERE id_passageiro = $1 
      ORDER BY data_agendada DESC;
    `;
    const result = await this.db.pool.query(query, [idPassageiro]);
    return result.rows;
  }
}