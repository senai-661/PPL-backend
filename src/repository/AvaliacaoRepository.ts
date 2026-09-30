import { DatabaseModel } from "../model/DatabaseModel.js";
import { Avaliacao } from "../model/Avaliacao.js";
import type { AvaliacaoDTO } from "../interface/AvaliacaoDTO.js";

const database = new DatabaseModel().pool;

export class AvaliacaoRepository {
  static async listarAvaliacoes(): Promise<Array<Avaliacao> | null> {
    try {
      const res = await database.query(`SELECT * FROM avaliacao_corrida;`);
      return res.rows.map(
        (a) => new Avaliacao(a.id_avaliacao, a.id_corrida, a.nota, a.comentario),
      );
    } catch (error) {
      console.error(`Erro ao consultar avaliações: ${error}`);
      return null;
    }
  }

  static async validarCorrida(
    idCorrida: number,
    idPassageiro: number,
  ): Promise<"ok" | "not_found" | "not_finished" | "not_owner"> {
    try {
      const res = await database.query(
        `SELECT id_passageiro, status_corrida FROM corrida WHERE id_corrida = $1;`,
        [idCorrida],
      );

      if (res.rows.length === 0) return "not_found";
      const corrida = res.rows[0];
      if (corrida.status_corrida !== "Finalizada") return "not_finished";
      if (corrida.id_passageiro !== idPassageiro) return "not_owner";
      return "ok";
    } catch (error) {
      console.error(`Erro ao validar corrida: ${error}`);
      return "not_found";
    }
  }

  static async jaAvaliada(idCorrida: number): Promise<boolean> {
    try {
      const res = await database.query(
        `SELECT id_avaliacao FROM avaliacao_corrida WHERE id_corrida = $1;`,
        [idCorrida],
      );
      return res.rows.length > 0;
    } catch (error) {
      console.error(`Erro ao verificar avaliação: ${error}`);
      return false;
    }
  }

  static async criarAvaliacao(avaliacao: AvaliacaoDTO): Promise<boolean> {
    try {
      const query = `
        INSERT INTO avaliacao_corrida (id_corrida, nota, comentario)
        VALUES ($1, $2, $3);
      `;
      await database.query(query, [
        avaliacao.idCorrida,
        avaliacao.nota,
        avaliacao.comentario ?? null,
      ]);
      return true;
    } catch (error) {
      console.error(`Erro ao criar avaliação: ${error}`);
      return false;
    }
  }

  static async mediaMotorista(idMotorista: number): Promise<number | null> {
    try {
      const res = await database.query(
        `SELECT ROUND(AVG(nota), 1) AS media
         FROM vw_avaliacoes_detalhadas
         WHERE id_motorista = $1;`,
        [idMotorista],
      );
      return res.rows[0]?.media ? parseFloat(res.rows[0].media) : null;
    } catch (error) {
      console.error(`Erro ao calcular média: ${error}`);
      return null;
    }
  }

  static async historicoPorMotorista(
    idMotorista: number,
  ): Promise<Array<any> | null> {
    try {
      const res = await database.query(
        `SELECT
          id_avaliacao,
          nota,
          comentario,
          criado_em,
          origem_corrida,
          destino_corrida,
          passageiro_nome,
          passageiro_sobrenome
         FROM vw_avaliacoes_detalhadas
         WHERE id_motorista = $1
         ORDER BY criado_em DESC;`,
        [idMotorista],
      );
      return res.rows;
    } catch (error) {
      console.error(`Erro ao buscar histórico de avaliações: ${error}`);
      return null;
    }
  }

  static async buscarPorId(idAvaliacao: number): Promise<any | null> {
    try {
      const res = await database.query(
        `SELECT * FROM vw_avaliacoes_detalhadas WHERE id_avaliacao = $1;`,
        [idAvaliacao]
      );
      if (res.rows.length === 0) return null;
      return res.rows[0];
    } catch (error) {
      console.error(`Erro ao buscar avaliação por ID: ${error}`);
      return null;
    }
  }

  static async atualizarAvaliacao(
    idAvaliacao: number,
    nota: number,
    comentario?: string
  ): Promise<boolean> {
    try {
      const res = await database.query(
        `UPDATE avaliacao_corrida SET nota = $1, comentario = $2 WHERE id_avaliacao = $3;`,
        [nota, comentario ?? null, idAvaliacao]
      );
      return res.rowCount !== null && res.rowCount > 0;
    } catch (error) {
      console.error(`Erro ao atualizar avaliação: ${error}`);
      return false;
    }
  }

  static async deletarAvaliacao(idAvaliacao: number): Promise<boolean> {
    try {
      const res = await database.query(
        `DELETE FROM avaliacao_corrida WHERE id_avaliacao = $1;`,
        [idAvaliacao]
      );
      return res.rowCount !== null && res.rowCount > 0;
    } catch (error) {
      console.error(`Erro ao deletar avaliação: ${error}`);
      return false;
    }
  }
}
