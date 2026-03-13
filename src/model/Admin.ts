import { Usuario } from "./Usuario.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

export class Admin extends Usuario {
  private idAdmin: number;

  constructor(
    idUsuario: number,
    nome: string,
    sobrenome: string,
    email: string,
    senha: string,
    criadoEm: Date,
    idAdmin: number,
  ) {
    super(idUsuario, nome, sobrenome, email, "admin", senha, criadoEm);
    this.idAdmin = idAdmin;
  }

  public getIdAdmin(): number { return this.idAdmin; }
  public setIdAdmin(v: number): void { this.idAdmin = v; }

  static async buscarPorEmail(email: string): Promise<Admin | null> {
    try {
      const res = await database.query(
        `SELECT u.*, a.id_admin
         FROM usuario u
         JOIN administrador a ON a.id_usuario = u.id_usuario
         WHERE u.email = $1;`,
        [email]
      );
      if (res.rows.length === 0) return null;
      const r = res.rows[0];
      return new Admin(
        r.id_usuario, r.nome, r.sobrenome, r.email, r.senha, r.criado_em, r.id_admin
      );
    } catch (error) {
      console.error(`Erro ao buscar admin: ${error}`);
      return null;
    }
  }

  static async listarAdmins(): Promise<Array<Admin> | null> {
    try {
      const res = await database.query(
        `SELECT u.*, a.id_admin
         FROM usuario u
         JOIN administrador a ON a.id_usuario = u.id_usuario;`
      );
      return res.rows.map((r) =>
        new Admin(r.id_usuario, r.nome, r.sobrenome, r.email, r.senha, r.criado_em, r.id_admin)
      );
    } catch (error) {
      console.error(`Erro ao listar admins: ${error}`);
      return null;
    }
  }

  static async dashboard(): Promise<any | null> {
    try {
      const statsRes = await database.query(`
        SELECT
          COUNT(*) FILTER (WHERE status_corrida = 'Finalizada')   AS total_finalizadas,
          COUNT(*) FILTER (WHERE status_corrida = 'Cancelada')    AS total_canceladas,
          COUNT(*) FILTER (WHERE status_corrida = 'Pendente')     AS total_pendentes,
          COUNT(*) FILTER (WHERE status_corrida = 'Em andamento') AS total_em_andamento,
          COUNT(*)                                                 AS total_corridas,
          COALESCE(SUM(preco) FILTER (WHERE status_corrida = 'Finalizada'), 0) AS receita_total,
          ROUND(AVG(preco) FILTER (WHERE status_corrida = 'Finalizada'), 2)    AS ticket_medio
        FROM corrida;
      `);

      const motoristasRes = await database.query(`
        SELECT
          m.id_motorista,
          u.nome, u.sobrenome,
          m.especializacao,
          COUNT(c.id_corrida) FILTER (WHERE c.status_corrida = 'Finalizada') AS corridas_finalizadas,
          ROUND(AVG(ac.nota), 1) AS media_avaliacao,
          COUNT(ac.id_avaliacao) AS total_avaliacoes
        FROM motorista m
        JOIN usuario u ON u.id_usuario = m.id_usuario
        LEFT JOIN corrida c ON c.id_motorista = m.id_motorista
        LEFT JOIN avaliacao_corrida ac ON ac.id_corrida = c.id_corrida
        GROUP BY m.id_motorista, u.nome, u.sobrenome
        ORDER BY media_avaliacao DESC NULLS LAST;
      `);

      const stats = statsRes.rows[0];
      return {
        corridas: {
          total: parseInt(stats.total_corridas),
          finalizadas: parseInt(stats.total_finalizadas),
          canceladas: parseInt(stats.total_canceladas),
          pendentes: parseInt(stats.total_pendentes),
          emAndamento: parseInt(stats.total_em_andamento),
          taxaCancelamento: stats.total_corridas > 0
            ? parseFloat(((stats.total_canceladas / stats.total_corridas) * 100).toFixed(1))
            : 0,
        },
        financeiro: {
          receitaTotal: parseFloat(stats.receita_total),
          ticketMedio: parseFloat(stats.ticket_medio) || 0,
        },
        motoristas: motoristasRes.rows.map((m) => ({
          id: m.id_motorista,
          nome: `${m.nome} ${m.sobrenome}`,
          especializacao: m.especializacao,
          corridasFinalizadas: parseInt(m.corridas_finalizadas),
          mediaAvaliacao: m.media_avaliacao ? parseFloat(m.media_avaliacao) : null,
          totalAvaliacoes: parseInt(m.total_avaliacoes),
        })),
      };
    } catch (error) {
      console.error(`Erro ao buscar dashboard: ${error}`);
      return null;
    }
  }
}