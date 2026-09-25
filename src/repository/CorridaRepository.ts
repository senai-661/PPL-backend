import { DatabaseModel } from "../model/DatabaseModel.js";
import { Corrida } from "../model/Corrida.js";
import type { CorridaDTO } from "../interface/CorridaDTO.js";

const database = new DatabaseModel().pool;

export class CorridaRepository {
  static async buscarPorId(idCorrida: number): Promise<any | null> {
    try {
      const res = await database.query(
        `SELECT * FROM vw_corridas_detalhadas WHERE id_corrida = $1;`,
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
        dataInicioCorrida: c.data_inicio_corrida,
        passageiro: {
          id: c.id_passageiro,
          nome: c.passageiro_nome,
          sobrenome: c.passageiro_sobrenome,
        },
        motorista: c.id_motorista
          ? {
              id: c.id_motorista,
              nome: c.motorista_nome,
              sobrenome: c.motorista_sobrenome,
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

  static async solicitarCorridaSP(
    idPassageiro: number,
    dados: {
      origemCorrida: string;
      destinoCorrida: string;
      tipoCorrida?: string;
      numPassageiros?: number;
      observacoes?: string;
    },
    preco: number
  ): Promise<number | null> {
    const resultado = await database.query(
      `CALL sp_solicitar_corrida($1, $2, $3, $4, $5, $6, $7, NULL)`,
      [
        idPassageiro,
        dados.origemCorrida,
        dados.destinoCorrida,
        dados.tipoCorrida ?? "Convencional",
        preco,
        dados.numPassageiros ?? 1,
        dados.observacoes ?? null,
      ],
    );
    return resultado.rows[0]?.p_id_corrida ?? null;
  }

  static async buscarVeiculoMotorista(idMotorista: number): Promise<number | null> {
    const res = await database.query(
      `SELECT id_veiculo FROM veiculo WHERE id_motorista = $1 LIMIT 1;`,
      [idMotorista],
    );
    return res.rows.length > 0 ? res.rows[0].id_veiculo : null;
  }

  static async aceitarCorrida(
    idCorrida: number,
    idMotorista: number,
    idVeiculo: number,
  ): Promise<boolean> {
    try {
      const res = await database.query(
        `UPDATE corrida c
         SET id_motorista = $1, id_veiculo = $2, status_corrida = 'Aceito'
         FROM motorista m, passageiro p
         WHERE c.id_corrida = $3
           AND c.status_corrida = 'Pendente'
           AND m.id_motorista = $1
           AND m.disponivel = true
           AND p.id_passageiro = c.id_passageiro
           AND (
             cardinality(p.necessidades) = 0
             OR ('Cadeirante' = ANY(p.necessidades) AND m.especializacao = 'MOBILIDADE REDUZIDA')
             OR ('Deficiência Auditiva' = ANY(p.necessidades) AND m.especializacao = 'LIBRAS')
             OR ('Deficiência Visual' = ANY(p.necessidades) AND m.especializacao = 'DEFICIÊNCIA VISUAL')
           )
         RETURNING c.id_corrida;`,
        [idMotorista, idVeiculo, idCorrida],
      );

      if (res.rowCount === null || res.rowCount === 0) return false;

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

  static async iniciarCorrida(
    idCorrida: number,
    idMotorista: number,
  ): Promise<boolean> {
    try {
      const res = await database.query(
        `UPDATE corrida
         SET status_corrida = 'Em andamento', data_inicio_corrida = CURRENT_TIMESTAMP
         WHERE id_corrida = $1
           AND id_motorista = $2
           AND status_corrida = 'Aceito'
         RETURNING id_corrida;`,
        [idCorrida, idMotorista],
      );
      return res.rowCount !== null && res.rowCount > 0;
    } catch (error) {
      console.error(`Erro ao iniciar corrida: ${error}`);
      return false;
    }
  }

  static async buscarDataInicio(idCorrida: number, idMotorista: number): Promise<Date | null> {
    const res = await database.query(
      `SELECT COALESCE(data_inicio_corrida, data_corrida) AS data_inicio_corrida
       FROM corrida
       WHERE id_corrida = $1 AND id_motorista = $2;`,
      [idCorrida, idMotorista],
    );
    return res.rows.length > 0 ? res.rows[0].data_inicio_corrida : null;
  }

  static async finalizarCorrida(
    idCorrida: number,
    duracaoCorrida: number,
    idMotorista: number,
  ): Promise<boolean> {
    try {
      const res = await database.query(
        `UPDATE corrida
         SET status_corrida = 'Finalizada', duracao_corrida = $1
         WHERE id_corrida = $2
           AND id_motorista = $3
           AND status_corrida = 'Em andamento'
         RETURNING id_corrida, id_motorista;`,  
        [duracaoCorrida, idCorrida, idMotorista]
      );

      if (res.rowCount === null || res.rowCount === 0) return false;
      const motoristaFinalizadoId = res.rows[0].id_motorista;
      if (motoristaFinalizadoId) {
        await database.query(
          `UPDATE motorista SET disponivel = true WHERE id_motorista = $1;`,
          [motoristaFinalizadoId]
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
      const r = await database.query(`SELECT sp_cancelar_corrida($1, $2) AS ok;`, [idCorrida, motivoCancelamento ?? null]);
      return !!(r.rows[0] && r.rows[0].ok);
    } catch (error) {
      console.error(`Erro ao cancelar corrida: ${error}`);
      return false;
    }
  }

  static async cancelarCorridaSP(idCorrida: number, motivo: string | null): Promise<void> {
    await database.query(
      `CALL sp_cancelar_corrida($1, $2)`,
      [idCorrida, motivo],
    );
  }

  static async listarCorridas(): Promise<Array<Corrida> | null> {
    try {
      const res = await database.query(`SELECT * FROM vw_corridas_detalhadas;`);
      return res.rows.map(
        (c) => new Corrida(
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
        )
      );
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
            vw.*
           FROM vw_corridas_detalhadas vw
           JOIN motorista m ON m.id_motorista = $1
           JOIN passageiro p ON p.id_passageiro = vw.id_passageiro
           WHERE vw.status_corrida = 'Pendente'
           AND m.disponivel = true
           AND (
             array_length(p.necessidades, 1) IS NULL
             OR (
               ('Cadeirante' = ANY(p.necessidades) AND m.especializacao ILIKE 'mobilidade reduzida')
               OR ('Deficiência Auditiva' = ANY(p.necessidades) AND m.especializacao ILIKE 'libras')
               OR ('Deficiência Visual' = ANY(p.necessidades) AND m.especializacao ILIKE 'deficiência visual')
             )
           )
           ORDER BY vw.data_corrida ASC;`,
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
          },
        }));
      }

      const res = await database.query(
        `SELECT * FROM vw_corridas_detalhadas
         WHERE status_corrida = $1
         ORDER BY data_corrida DESC;`,
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

  static async historicoPorPassageiro(idPassageiro: number): Promise<Array<any> | null> {
    try {
      const res = await database.query(
        `SELECT * FROM vw_corridas_detalhadas
         WHERE id_passageiro = $1
         ORDER BY data_corrida DESC;`,
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

  static async historicoPorMotorista(idMotorista: number): Promise<Array<any> | null> {
    try {
      const res = await database.query(
        `SELECT * FROM vw_corridas_detalhadas
         WHERE id_motorista = $1
         ORDER BY data_corrida DESC;`,
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
          ROUND(AVG(nota), 1) AS media_avaliacao,
          COUNT(id_avaliacao) AS total_avaliacoes
         FROM vw_avaliacoes_detalhadas
         WHERE id_motorista = $1;`,
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
    try {
      const res = await database.query(
        `SELECT * FROM vw_corridas_detalhadas
         WHERE id_passageiro = $1
           AND status_corrida IN ('Pendente', 'Aceito', 'Em andamento')
         ORDER BY data_corrida DESC
         LIMIT 1;`,
        [idPassageiro],
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
        statusCorrida: c.status_corrida,
        dataInicioCorrida: c.data_inicio_corrida,
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
    try {
      const res = await database.query(
        `SELECT * FROM vw_corridas_detalhadas
         WHERE id_motorista = $1
           AND status_corrida IN ('Aceito', 'Em andamento')
         ORDER BY data_corrida DESC
         LIMIT 1;`,
        [idMotorista],
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
        statusCorrida: c.status_corrida,
        passageiro: {
          id: c.id_passageiro,
          nome: c.passageiro_nome,
          sobrenome: c.passageiro_sobrenome,
        },
      };
    } catch (error) {
      console.error(`Erro ao buscar corrida atual do motorista ${idMotorista}:`, error);
      return null;
    }
  }

  static async resumoDiaMotorista(idMotorista: number): Promise<any | null> {
    try {
      const { rows } = await database.query(
        `SELECT
          COUNT(*) FILTER (WHERE status_corrida = 'Aceito')                    AS corridas_aceitas,
          COUNT(*) FILTER (WHERE status_corrida = 'Finalizada')                AS corridas_finalizadas,
          COALESCE(SUM(preco) FILTER (WHERE status_corrida = 'Finalizada'), 0) AS total_ganho
         FROM corrida
         WHERE id_motorista = $1
           AND DATE(data_corrida) = CURRENT_DATE;`,
        [idMotorista],
      );

      const r = rows[0];
      return {
        corridasAceitas: parseInt(r.corridas_aceitas),
        corridasFinalizadas: parseInt(r.corridas_finalizadas),
        totalGanho: parseFloat(r.total_ganho),
      };
    } catch (error) {
      console.error(`Erro ao buscar resumo do dia do motorista ${idMotorista}:`, error);
      return null;
    }
  }

  static async deletarCorrida(idCorrida: number): Promise<boolean> {
    try {
      const res = await database.query(
        `DELETE FROM corrida WHERE id_corrida = $1;`,
        [idCorrida]
      );
      return res.rowCount !== null && res.rowCount > 0;
    } catch (error) {
      console.error(`Erro ao deletar corrida: ${error}`);
      return false;
    }
  }
}
