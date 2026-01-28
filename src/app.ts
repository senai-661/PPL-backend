import { server } from "./server.js";
import { DatabaseModel } from "./model/DatabaseModel.js";

const port = 1285;

new DatabaseModel()
  .testeConexao()
  .then((resbd) => {
    if (resbd) {
      server.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
      });
    } else {
      console.log("Não foi possível conectar ao banco de dados");
    }
  })
  .catch((err: unknown) => {
    console.error("Erro ao testar conexão com o banco de dados:", err);
  });
