# Stored Procedures / Functions

Este arquivo descreve as functions/sp_* criadas para centralizar operações que envolvem múltiplas tabelas.

- `sp_cadastrar_passageiro`
  - Parâmetros: `p_nome, p_sobrenome, p_email, p_senha, p_cpf, p_celular, p_data_nascimento, p_necessidades, p_rua, p_numero, p_bairro, p_cidade, p_estado, p_cep, p_complemento`
  - Regra de negócio: Cria `usuario` + `passageiro` e cria `endereco` vinculado se fornecido.
  - Finalidade: Padronizar cadastro do passageiro em uma única operação atômica.

- `sp_cadastrar_motorista`
  - Parâmetros: `p_nome, p_sobrenome, p_email, p_senha, p_cpf, p_cnh, p_celular, p_data_nascimento, p_antecedentes_criminais, p_especializacao, p_rua, p_numero, p_bairro, p_cidade, p_estado, p_cep, p_complemento, p_placa, p_tipo_veiculo, p_modelo_veiculo`
  - Regra de negócio: Cria `usuario` + `motorista`, cria `endereco` se fornecido e cria `veiculo` opcional.
  - Finalidade: Centralizar cadastro do motorista e validar dados básicos.

- `sp_criar_corrida`
  - Parâmetros: `p_id_passageiro, p_id_motorista (opcional), p_id_veiculo (opcional), p_origem, p_destino, p_tipo_corrida, p_preco, p_duracao, p_num_passageiros, p_observacoes`
  - Regra de negócio: Cria registro em `corrida` e, se um motorista for atribuído, marca-o como indisponível.
  - Finalidade: Padronizar criação de corridas e manter consistência de disponibilidade.

- `sp_cancelar_corrida`
  - Parâmetros: `p_id_corrida, p_motivo (opcional)`
  - Regra de negócio: Atualiza status para `Cancelada` e libera o motorista vinculado, se existir.
  - Finalidade: Cancelamento atômico com manutenção de disponibilidade.

- `sp_finalizar_corrida`
  - Parâmetros: `p_id_corrida`
  - Regra de negócio: Marca corrida como `Finalizada` e libera o motorista vinculado, se existir.
  - Finalidade: Finalizar corrida e ajustar disponibilidade.

Arquivo com as funções:
- `PPL-backend/infra/sql/stored_procedures.sql`

Como aplicar no banco:
Execute o script com psql ou através da ferramenta de sua preferência:

```bash
psql -U <usuario> -d <database> -f infra/sql/stored_procedures.sql
```

Observação: as funções esperam que a tabela esteja criada conforme `infra/sql/init.sql`.
