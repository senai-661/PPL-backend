import type { CorridaDTO } from "../interface/CorridaDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

class Corrida {
  private idCorrida: number = 0;
  private idPassageiro: number;
  private idMotorista: number | null;
  private idVeiculo: number | null;
  private origemCorrida: string;
  private destinoCorrida: string;
  private tipoCorrida: string;
  private preco: number;
  private dataCorrida: Date;
  private duracaoCorrida: number;
  private motivoCancelamento: string | null;
  private statusCorrida: string;

  constructor(
    _idCorrida: number,
    _idPassageiro: number,
    _idMotorista: number | null,
    _idVeiculo: number | null,
    _origemCorrida: string,
    _destinoCorrida: string,
    _tipoCorrida: string,
    _preco: number,
    _dataCorrida: Date,
    _duracaoCorrida: number,
    _motivoCancelamento: string | null,
    _statusCorrida: string,
  ) {
    this.idCorrida = _idCorrida;
    this.idPassageiro = _idPassageiro;
    this.idMotorista = _idMotorista;
    this.idVeiculo = _idVeiculo;
    this.origemCorrida = _origemCorrida;
    this.destinoCorrida = _destinoCorrida;
    this.tipoCorrida = _tipoCorrida;
    this.preco = _preco;
    this.dataCorrida = _dataCorrida;
    this.duracaoCorrida = _duracaoCorrida;
    this.motivoCancelamento = _motivoCancelamento;
    this.statusCorrida = _statusCorrida;
  }

  public getIdCorrida(): number {
    return this.idCorrida;
  }
  public getIdPassageiro(): number {
    return this.idPassageiro;
  }
  public getIdMotorista(): number | null {
    return this.idMotorista;
  }
  public getIdVeiculo(): number | null {
    return this.idVeiculo;
  }
  public getOrigemCorrida(): string {
    return this.origemCorrida;
  }
  public getDestinoCorrida(): string {
    return this.destinoCorrida;
  }
  public getTipoCorrida(): string {
    return this.tipoCorrida;
  }
  public getPreco(): number {
    return this.preco;
  }
  public getDataCorrida(): Date {
    return this.dataCorrida;
  }
  public getDuracaoCorrida(): number {
    return this.duracaoCorrida;
  }
  public getMotivoCancelamento(): string | null {
    return this.motivoCancelamento;
  }
  public getStatusCorrida(): string {
    return this.statusCorrida;
  }

  public setIdCorrida(v: number): void {
    this.idCorrida = v;
  }
  public setIdPassageiro(v: number): void {
    this.idPassageiro = v;
  }
  public setIdMotorista(v: number | null): void {
    this.idMotorista = v;
  }
  public setIdVeiculo(v: number | null): void {
    this.idVeiculo = v;
  }
  public setOrigemCorrida(v: string): void {
    this.origemCorrida = v;
  }
  public setDestinoCorrida(v: string): void {
    this.destinoCorrida = v;
  }
  public setTipoCorrida(v: string): void {
    this.tipoCorrida = v;
  }
  public setPreco(v: number): void {
    this.preco = v;
  }
  public setDataCorrida(v: Date): void {
    this.dataCorrida = v;
  }
  public setDuracaoCorrida(v: number): void {
    this.duracaoCorrida = v;
  }
  public setMotivoCancelamento(v: string | null): void {
    this.motivoCancelamento = v;
  }
  public setStatusCorrida(v: string): void {
    this.statusCorrida = v;
  }

  private static fromRow(c: any): Corrida {
    return new Corrida(
      c.id_corrida,
      c.id_passageiro,
      c.id_motorista,
      c.id_veiculo,
      c.origem_corrida,
      c.destino_corrida,
      c.tipo_corrida,
      c.preco,
      c.data_corrida,
      c.duracao_corrida,
      c.motivo_cancelamento,
      c.status_corrida,
    );
  }
  static async buscarPorId(idCorrida: number): Promise<any | null> {
    try {
      const res = await database.query(
        `SELECT
        c.*,
        -- Passenger info
        u_p.nome       AS passageiro_nome,
        u_p.sobrenome  AS passageiro_sobrenome,
        p.celular      AS passageiro_celular,
        p.necessidades AS passageiro_necessidades,
        -- Driver info
        u_m.nome       AS motorista_nome,
        u_m.sobrenome  AS motorista_sobrenome,
        m.celular      AS motorista_celular,
        m.especializacao,
        -- Vehicle info
        v.modelo_veiculo,
        v.placa,
        v.tipo_veiculo
       FROM corrida c
       JOIN passageiro p     ON p.id_passageiro = c.id_passageiro
       JOIN usuario u_p      ON u_p.id_usuario = p.id_usuario
       LEFT JOIN motorista m ON m.id_motorista = c.id_motorista
       LEFT JOIN usuario u_m ON u_m.id_usuario = m.id_usuario
       LEFT JOIN veiculo v   ON v.id_veiculo = c.id_veiculo
       WHERE c.id_corrida = $1;`,
        [idCorrida],
      );

      if (res.rows.length === 0) return null;
      const c = res.rows[0];

      return {
        idCorrida: c.id_corrida,
        origemCorrida: c.origem_corrida,
        destinoCorrida: c.destino_corrida,
        tipoCorrida: c.tipo_corrida,
        preco: c.preco,
        dataCorrida: c.data_corrida,
        duracaoCorrida: c.duracao_corrida,
        motivoCancelamento: c.motivo_cancelamento,
        statusCorrida: c.status_corrida,
        passageiro: {
          id: c.id_passageiro,
          nome: c.passageiro_nome,
          sobrenome: c.passageiro_sobrenome,
          celular: c.passageiro_celular,
          necessidades: c.passageiro_necessidades,
        },
        motorista: c.id_motorista
          ? {
              id: c.id_motorista,
              nome: c.motorista_nome,
              sobrenome: c.motorista_sobrenome,
              celular: c.motorista_celular,
              especializacao: c.especializacao,
            }
          : null,
        veiculo: c.id_veiculo
          ? {
              modelo: c.modelo_veiculo,
              placa: c.placa,
              tipo: c.tipo_veiculo,
            }
          : null,
      };
    } catch (error) {
      console.error(`Erro ao buscar corrida por id: ${error}`);
      return null;
    }
  }
static async solicitarCorrida(corrida: CorridaDTO): Promise<number | null> {
  const res = await database.query(
    `INSERT INTO corrida 
      (id_passageiro, origem_corrida, destino_corrida, tipo_corrida, preco, 
       duracao_corrida, status_corrida, num_passageiros, observacoes)
     VALUES ($1, $2, $3, $4, $5, 0, 'Pendente', $6, $7)
     RETURNING id_corrida;`,
    [
      corrida.idPassageiro,
      corrida.origemCorrida,
      corrida.destinoCorrida,
      corrida.tipoCorrida ?? "Convencional",
      corrida.preco,
      corrida.numPassageiros ?? 1,
      corrida.observacoes ?? null,
    ],
  );
  return res.rows[0].id_corrida;
}

  static async aceitarCorrida(
    idCorrida: number,
    idMotorista: number,
    idVeiculo: number,
  ): Promise<boolean> {
    try {
      const res = await database.query(
        `UPDATE corrida
       SET id_motorista = $1, id_veiculo = $2, status_corrida = 'Aceito'
       WHERE id_corrida = $3 AND status_corrida = 'Pendente'
       RETURNING id_corrida;`,
        [idMotorista, idVeiculo, idCorrida],
      );

      if (res.rowCount === null || res.rowCount === 0) return false;

      // Driver goes offline automatically after accepting
      await database.query(
        `UPDATE motorista SET disponivel = false WHERE id_motorista = $1;`,
        [idMotorista],
      );

      return true;
    } catch (error) {
      console.error(`Erro ao aceitar corrida: ${error}`);
      return false;
    }
  }

  static async iniciarCorrida(idCorrida: number): Promise<boolean> {
    try {
      const res = await database.query(
        `UPDATE corrida
         SET status_corrida = 'Em andamento'
         WHERE id_corrida = $1 AND status_corrida = 'Aceito'
         RETURNING id_corrida;`,
        [idCorrida],
      );
      return res.rowCount !== null && res.rowCount > 0;
    } catch (error) {
      console.error(`Erro ao iniciar corrida: ${error}`);
      return false;
    }
  }

  static async finalizarCorrida(
  idCorrida: number,
  duracaoCorrida: number,
): Promise<boolean> {
  try {
    const res = await database.query(
      `UPDATE corrida
       SET status_corrida = 'Finalizada', duracao_corrida = $1
       WHERE id_corrida = $2 AND status_corrida = 'Em andamento'
       RETURNING id_corrida, id_motorista;`,  
      [duracaoCorrida, idCorrida]
    );

    if (res.rowCount === null || res.rowCount === 0) return false;
    const idMotorista = res.rows[0].id_motorista;
    if (idMotorista) {
      await database.query(
        `UPDATE motorista SET disponivel = true WHERE id_motorista = $1;`,
        [idMotorista]
      );
    }

    return true;
  } catch (error) {
    console.error(`Erro ao finalizar corrida: ${error}`);
    return false;
  }
}
  static async cancelarCorrida(
    idCorrida: number,
    motivoCancelamento: string | null,
  ): Promise<boolean> {
    try {
      const res = await database.query(
        `UPDATE corrida
       SET status_corrida = 'Cancelada', motivo_cancelamento = $1
       WHERE id_corrida = $2 AND status_corrida IN ('Pendente', 'Aceito')
       RETURNING id_corrida, id_motorista;`,
        [motivoCancelamento ?? null, idCorrida],
      );

      if (res.rowCount === null || res.rowCount === 0) return false;

      // Driver goes back online if ride was already accepted
      const idMotorista = res.rows[0].id_motorista;
      if (idMotorista) {
        await database.query(
          `UPDATE motorista SET disponivel = true WHERE id_motorista = $1;`,
          [idMotorista],
        );
      }

      return true;
    } catch (error) {
      console.error(`Erro ao cancelar corrida: ${error}`);
      return false;
    }
  }

  static async listarCorridas(): Promise<Array<Corrida> | null> {
    try {
      const res = await database.query(`SELECT * FROM corrida;`);
      return res.rows.map(Corrida.fromRow);
    } catch (error) {
      console.error(`Erro ao listar corridas: ${error}`);
      return null;
    }
  }

static async listarPorStatus(
  status: string,
  idMotorista?: number,
): Promise<Array<any> | null> {
  try {
    if (status === "Pendente" && idMotorista) {
      const res = await database.query(
        `SELECT 
          c.*,
          u_p.nome       AS passageiro_nome,
          u_p.sobrenome  AS passageiro_sobrenome,
          p.celular      AS passageiro_celular,
          p.necessidades AS passageiro_necessidades
         FROM corrida c
         JOIN passageiro p ON p.id_passageiro = c.id_passageiro
         JOIN usuario u_p  ON u_p.id_usuario = p.id_usuario
         JOIN motorista m  ON m.id_motorista = $1
         WHERE c.status_corrida = 'Pendente'
         AND m.disponivel = true
         AND (
           array_length(p.necessidades, 1) IS NULL
           OR (
             ('Cadeirante' = ANY(p.necessidades) AND m.especializacao ILIKE 'mobilidade reduzida')
             OR ('Deficiência Auditiva' = ANY(p.necessidades) AND m.especializacao ILIKE 'libras')
             OR ('Deficiência Visual' = ANY(p.necessidades) AND m.especializacao ILIKE 'deficiência visual')
           )
         )
         ORDER BY c.data_corrida ASC;`,
        [idMotorista],  
      );              
      return res.rows.map((c) => ({
        idCorrida: c.id_corrida,
        origemCorrida: c.origem_corrida,
        destinoCorrida: c.destino_corrida,
        tipoCorrida: c.tipo_corrida,
        preco: c.preco,
        dataCorrida: c.data_corrida,
        statusCorrida: c.status_corrida,
        passageiro: {
          id: c.id_passageiro,
          nome: c.passageiro_nome,
          sobrenome: c.passageiro_sobrenome,
          celular: c.passageiro_celular,
          necessidades: c.passageiro_necessidades,
        },
      }));
    }
    const res = await database.query(
      `SELECT 
        c.*,
        u_m.nome       AS motorista_nome,
        u_m.sobrenome  AS motorista_sobrenome,
        m.celular      AS motorista_celular,
        m.especializacao,
        v.modelo_veiculo,
        v.placa,
        v.tipo_veiculo
       FROM corrida c
       LEFT JOIN motorista m  ON m.id_motorista = c.id_motorista
       LEFT JOIN usuario u_m  ON u_m.id_usuario = m.id_usuario
       LEFT JOIN veiculo v    ON v.id_veiculo = c.id_veiculo
       WHERE c.status_corrida = $1
       ORDER BY c.data_corrida DESC;`,
      [status],
    );
    return res.rows.map((c) => ({
      idCorrida: c.id_corrida,
      origemCorrida: c.origem_corrida,
      destinoCorrida: c.destino_corrida,
      tipoCorrida: c.tipo_corrida,
      preco: c.preco,
      dataCorrida: c.data_corrida,
      duracaoCorrida: c.duracao_corrida,
      motivoCancelamento: c.motivo_cancelamento,
      statusCorrida: c.status_corrida,
      motorista: c.id_motorista ? {
        id: c.id_motorista,
        nome: c.motorista_nome,
        sobrenome: c.motorista_sobrenome,
        celular: c.motorista_celular,
        especializacao: c.especializacao,
      } : null,
      veiculo: c.id_veiculo ? {
        modelo: c.modelo_veiculo,
        placa: c.placa,
        tipo: c.tipo_veiculo,
      } : null,
    }));
  } catch (error) {
    console.error(`Erro ao listar corridas por status: ${error}`);
    return null;
  }
}

  static async historicoPorPassageiro(
    idPassageiro: number,
  ): Promise<Array<any> | null> {
    try {
      const res = await database.query(
        `SELECT 
        c.*,
        u_m.nome      AS motorista_nome,
        u_m.sobrenome AS motorista_sobrenome,
        m.celular     AS motorista_celular,
        m.especializacao,
        v.modelo_veiculo,
        v.placa,
        v.tipo_veiculo
       FROM corrida c
       LEFT JOIN motorista m ON m.id_motorista = c.id_motorista
       LEFT JOIN usuario u_m ON u_m.id_usuario = m.id_usuario
       LEFT JOIN veiculo v   ON v.id_veiculo = c.id_veiculo
       WHERE c.id_passageiro = $1
       ORDER BY c.data_corrida DESC;`,
        [idPassageiro],
      );

      return res.rows.map((c) => ({
        idCorrida: c.id_corrida,
        origemCorrida: c.origem_corrida,
        destinoCorrida: c.destino_corrida,
        tipoCorrida: c.tipo_corrida,
        preco: c.preco,
        dataCorrida: c.data_corrida,
        duracaoCorrida: c.duracao_corrida,
        motivoCancelamento: c.motivo_cancelamento,
        statusCorrida: c.status_corrida,
        motorista: c.id_motorista
          ? {
              id: c.id_motorista,
              nome: c.motorista_nome,
              sobrenome: c.motorista_sobrenome,
              celular: c.motorista_celular,
              especializacao: c.especializacao,
            }
          : null,
        veiculo: c.id_veiculo
          ? {
              modelo: c.modelo_veiculo,
              placa: c.placa,
              tipo: c.tipo_veiculo,
            }
          : null,
      }));
    } catch (error) {
      console.error(`Erro ao buscar histórico do passageiro: ${error}`);
      return null;
    }
  }

  static async historicoPorMotorista(
    idMotorista: number,
  ): Promise<Array<any> | null> {
    try {
      const res = await database.query(
        `SELECT 
        c.*,
        u_p.nome       AS passageiro_nome,
        u_p.sobrenome  AS passageiro_sobrenome,
        p.celular      AS passageiro_celular,
        p.necessidades AS passageiro_necessidades
       FROM corrida c
       JOIN passageiro p ON p.id_passageiro = c.id_passageiro
       JOIN usuario u_p  ON u_p.id_usuario = p.id_usuario
       WHERE c.id_motorista = $1
       ORDER BY c.data_corrida DESC;`,
        [idMotorista],
      );

      return res.rows.map((c) => ({
        idCorrida: c.id_corrida,
        origemCorrida: c.origem_corrida,
        destinoCorrida: c.destino_corrida,
        tipoCorrida: c.tipo_corrida,
        preco: c.preco,
        dataCorrida: c.data_corrida,
        duracaoCorrida: c.duracao_corrida,
        motivoCancelamento: c.motivo_cancelamento,
        statusCorrida: c.status_corrida,
        passageiro: {
          id: c.id_passageiro,
          nome: c.passageiro_nome,
          sobrenome: c.passageiro_sobrenome,
          celular: c.passageiro_celular,
          necessidades: c.passageiro_necessidades,
        },
      }));
    } catch (error) {
      console.error(`Erro ao buscar histórico do motorista: ${error}`);
      return null;
    }
  }
  static async relatorioMotorista(idMotorista: number): Promise<any | null> {
    try {
      const statsRes = await database.query(
        `SELECT
          COUNT(*) FILTER (WHERE status_corrida = 'Finalizada')    AS total_finalizadas,
          COUNT(*) FILTER (WHERE status_corrida = 'Cancelada')     AS total_canceladas,
          COUNT(*)                                                  AS total_corridas,
          COALESCE(SUM(preco) FILTER (WHERE status_corrida = 'Finalizada'), 0) AS total_ganho,
          ROUND(AVG(preco) FILTER (WHERE status_corrida = 'Finalizada'), 2)    AS ticket_medio,
          ROUND(AVG(duracao_corrida) FILTER (WHERE status_corrida = 'Finalizada'), 1) AS duracao_media
         FROM corrida WHERE id_motorista = $1;`,
        [idMotorista],
      );

      const avaliacaoRes = await database.query(
        `SELECT
          ROUND(AVG(ac.nota), 1) AS media_avaliacao,
          COUNT(ac.id_avaliacao) AS total_avaliacoes
         FROM avaliacao_corrida ac
         JOIN corrida c ON c.id_corrida = ac.id_corrida
         WHERE c.id_motorista = $1;`,
        [idMotorista],
      );

      const stats = statsRes.rows[0];
      const avaliacao = avaliacaoRes.rows[0];

      return {
        corridas: {
          total: parseInt(stats.total_corridas),
          finalizadas: parseInt(stats.total_finalizadas),
          canceladas: parseInt(stats.total_canceladas),
          taxaCancelamento:
            stats.total_corridas > 0
              ? parseFloat(
                  (
                    (stats.total_canceladas / stats.total_corridas) *
                    100
                  ).toFixed(1),
                )
              : 0,
        },
        financeiro: {
          totalGanho: parseFloat(stats.total_ganho),
          ticketMedio: parseFloat(stats.ticket_medio) || 0,
          duracaoMedia: parseFloat(stats.duracao_media) || 0,
        },
        avaliacao: {
          media: avaliacao.media_avaliacao
            ? parseFloat(avaliacao.media_avaliacao)
            : null,
          total: parseInt(avaliacao.total_avaliacoes),
        },
      };
    } catch (error) {
      console.error(`Erro ao gerar relatório do motorista: ${error}`);
      return null;
    }
  }

  static async corridaAtualPassageiro(idPassageiro: number): Promise<any | null> {
  const query = `
    SELECT
      c.*,
      u_m.nome       AS motorista_nome,
      u_m.sobrenome  AS motorista_sobrenome,
      m.celular      AS motorista_celular,
      m.especializacao,
      v.modelo_veiculo,
      v.placa,
      v.tipo_veiculo
    FROM corrida c
    LEFT JOIN motorista m  ON m.id_motorista = c.id_motorista
    LEFT JOIN usuario u_m  ON u_m.id_usuario = m.id_usuario
    LEFT JOIN veiculo v    ON v.id_veiculo = c.id_veiculo
    WHERE c.id_passageiro = $1
      AND c.status_corrida IN ('Pendente', 'Aceito', 'Em andamento')
    ORDER BY c.data_corrida DESC
    LIMIT 1;
  `;

  try {
    const { rows } = await database.query(query, [idPassageiro]);

    if (rows.length === 0) return null;

    const c = rows[0];

    return {
      idCorrida: c.id_corrida,
      origemCorrida: c.origem_corrida,
      destinoCorrida: c.destino_corrida,
      tipoCorrida: c.tipo_corrida,
      preco: c.preco,
      dataCorrida: c.data_corrida,
      statusCorrida: c.status_corrida,
      motorista: c.id_motorista
        ? {
            id: c.id_motorista,
            nome: c.motorista_nome,
            sobrenome: c.motorista_sobrenome,
            celular: c.motorista_celular,
            especializacao: c.especializacao,
          }
        : null,
      veiculo: c.id_veiculo
        ? {
            modelo: c.modelo_veiculo,
            placa: c.placa,
            tipo: c.tipo_veiculo,
          }
        : null,
    };
  } catch (error) {
    console.error(`Erro ao buscar corrida atual do passageiro ${idPassageiro}:`, error);
    return null;
  }
 }
 static async corridaAtualMotorista(idMotorista: number): Promise<any | null> {
    const query = `
        SELECT
            c.*,
            u_p.nome       AS passageiro_nome,
            u_p.sobrenome  AS passageiro_sobrenome,
            p.celular      AS passageiro_celular,
            p.necessidades AS passageiro_necessidades
        FROM corrida c
        JOIN passageiro p ON p.id_passageiro = c.id_passageiro
        JOIN usuario u_p  ON u_p.id_usuario = p.id_usuario
        WHERE c.id_motorista = $1
          AND c.status_corrida IN ('Aceito', 'Em andamento')
        ORDER BY c.data_corrida DESC
        LIMIT 1;
    `;

    try {
        const { rows } = await database.query(query, [idMotorista]);

        if (rows.length === 0) return null;

        const c = rows[0];

        return {
            idCorrida:          c.id_corrida,
            origemCorrida:      c.origem_corrida,
            destinoCorrida:     c.destino_corrida,
            tipoCorrida:        c.tipo_corrida,
            preco:              c.preco,
            dataCorrida:        c.data_corrida,
            statusCorrida:      c.status_corrida,
            passageiro: {
                id:           c.id_passageiro,
                nome:         c.passageiro_nome,
                sobrenome:    c.passageiro_sobrenome,
                celular:      c.passageiro_celular,
                necessidades: c.passageiro_necessidades
            }
        };
    } catch (error) {
        console.error(`Erro ao buscar corrida atual do motorista ${idMotorista}:`, error);
        return null;
    }
}

static async resumoDiaMotorista(idMotorista: number): Promise<any | null> {
    const query = `
        SELECT
            COUNT(*) FILTER (WHERE status_corrida = 'Aceito')                           AS corridas_aceitas,
            COUNT(*) FILTER (WHERE status_corrida = 'Finalizada')                       AS corridas_finalizadas,
            COALESCE(SUM(preco) FILTER (WHERE status_corrida = 'Finalizada'), 0)        AS total_ganho
        FROM corrida
        WHERE id_motorista = $1
          AND DATE(data_corrida) = CURRENT_DATE;
    `;

    try {
        const { rows } = await database.query(query, [idMotorista]);

        const r = rows[0];

        return {
            corridasAceitas:     parseInt(r.corridas_aceitas),
            corridasFinalizadas: parseInt(r.corridas_finalizadas),
            totalGanho:          parseFloat(r.total_ganho)
        };
    } catch (error) {
        console.error(`Erro ao buscar resumo do dia do motorista ${idMotorista}:`, error);
        return null;
    }
}

static async relatorioPassageiro(idPassageiro: number): Promise<any | null> {
  try {
    // Stats de corridas finalizadas
    const statsRes = await database.query(
      `SELECT
        COUNT(*) FILTER (WHERE status_corrida = 'Finalizada') AS total_viagens,
        COALESCE(SUM(preco) FILTER (WHERE status_corrida = 'Finalizada'), 0) AS total_gasto
       FROM corrida 
       WHERE id_passageiro = $1;`,
      [idPassageiro],
    );

    // Destino mais frequente (apenas corridas finalizadas)
    const destinoRes = await database.query(
      `SELECT destino_corrida, COUNT(*) as total
       FROM corrida 
       WHERE id_passageiro = $1 AND status_corrida = 'Finalizada'
       GROUP BY destino_corrida
       ORDER BY total DESC
       LIMIT 1;`,
      [idPassageiro],
    );

    // Data de cadastro do passageiro
    const usuarioRes = await database.query(
      `SELECT u.criado_em 
       FROM usuario u
       JOIN passageiro p ON p.id_usuario = u.id_usuario
       WHERE p.id_passageiro = $1;`,
      [idPassageiro],
    );

    const stats = statsRes.rows[0];
    const destinoFavorito = destinoRes.rows[0]?.destino_corrida || null;
    const desde = usuarioRes.rows[0]?.criado_em || new Date();

    return {
      totalViagens: parseInt(stats.total_viagens) || 0,
      totalGasto: parseFloat(stats.total_gasto) || 0,
      destinoFavorito: destinoFavorito,
      desde: desde,
    };
  } catch (error) {
    console.error(`Erro ao gerar relatório do passageiro: ${error}`);
    return null;
  }
}
static async motoristaTemCorridaAtiva(idMotorista: number): Promise<boolean> {
  try {
    const res = await database.query(
      `SELECT id_corrida FROM corrida 
       WHERE id_motorista = $1 
       AND status_corrida IN ('Pendente', 'Aceito', 'Em andamento')
       LIMIT 1;`,
      [idMotorista]
    );
    return res.rows.length > 0;
  } catch (error) {
    console.error(`Erro ao verificar corrida ativa do motorista: ${error}`);
    return false;
  }
}
}

export { Corrida };
