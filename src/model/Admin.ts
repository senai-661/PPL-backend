import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

export class Admin {
  private id: number;
  private nome: string;
  private email: string;
  private senha: string;

  constructor(_id: number, _nome: string, _email: string, _senha: string) {
    this.id = _id;
    this.nome = _nome;
    this.email = _email;
    this.senha = _senha;
  }

  public getId(): number {
    return this.id;
  }
  public getNome(): string {
    return this.nome;
  }
  public getEmail(): string {
    return this.email;
  }
  public getSenha(): string {
    return this.senha;
  }
  public setId(id: number): void {
    this.id = id;
  }
  public setNome(nome: string): void {
    this.nome = nome;
  }
  public setEmail(email: string): void {
    this.email = email;
  }
  public setSenha(senha: string): void {
    this.senha = senha;
  }

  static async buscarPorEmail(email: string): Promise<Admin | null> {
    try {
      const res = await database.query(
        `SELECT * FROM administrador WHERE email = $1`,
        [email],
      );
      if (res.rows.length > 0) {
        const a = res.rows[0];
        return new Admin(a.id_admin, a.nome, a.email, a.senha);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  static async listarAdmins(): Promise<Array<Admin> | null> {
    try {
      const res = await database.query(
        `SELECT id_admin, nome, email, senha FROM administrador;`,
      );

      // Retorna um array de objetos Admin
      return res.rows.map(
        (a) => new Admin(a.id_admin, a.nome, a.email, a.senha),
      );
    } catch (error) {
      console.error("Erro ao listar admins:", error);
      return null;
    }
  }
  static async dashboard(): Promise<any | null> {
    try {
      // General stats
      const statsRes = await database.query(`
      SELECT
        COUNT(*) FILTER (WHERE status_corrida = 'Finalizada')  AS total_finalizadas,
        COUNT(*) FILTER (WHERE status_corrida = 'Cancelada')   AS total_canceladas,
        COUNT(*) FILTER (WHERE status_corrida = 'Pendente')    AS total_pendentes,
        COUNT(*) FILTER (WHERE status_corrida = 'Em andamento') AS total_em_andamento,
        COUNT(*)                                                AS total_corridas,
        COALESCE(SUM(preco) FILTER (WHERE status_corrida = 'Finalizada'), 0) AS receita_total,
        ROUND(AVG(preco) FILTER (WHERE status_corrida = 'Finalizada'), 2)    AS ticket_medio
      FROM corrida;
    `);

      // Average rating per driver
      const motoristasRes = await database.query(`
      SELECT
        m.id_motorista,
        m.nome_motorista,
        m.sobrenome_motorista,
        m.especializacao,
        COUNT(c.id_corrida) FILTER (WHERE c.status_corrida = 'Finalizada') AS corridas_finalizadas,
        ROUND(AVG(ac.nota), 1) AS media_avaliacao,
        COUNT(ac.id_avaliacao) AS total_avaliacoes
      FROM motorista m
      LEFT JOIN corrida c ON c.id_motorista = m.id_motorista
      LEFT JOIN avaliacao_corrida ac ON ac.id_corrida = c.id_corrida
      GROUP BY m.id_motorista
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
          receitaTotal: parseFloat(stats.receita_total),
          ticketMedio: parseFloat(stats.ticket_medio) || 0,
        },
        motoristas: motoristasRes.rows.map((m) => ({
          id: m.id_motorista,
          nome: `${m.nome_motorista} ${m.sobrenome_motorista}`,
          especializacao: m.especializacao,
          corridasFinalizadas: parseInt(m.corridas_finalizadas),
          mediaAvaliacao: m.media_avaliacao
            ? parseFloat(m.media_avaliacao)
            : null,
          totalAvaliacoes: parseInt(m.total_avaliacoes),
        })),
      };
    } catch (error) {
      console.error(`Erro ao buscar dashboard: ${error}`);
      return null;
    }
  }
}
