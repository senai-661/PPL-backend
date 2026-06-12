-- ============================================
-- VIEWS DO PROJETO
-- ============================================

-- VIEW 1: Corridas com dados do passageiro, motorista e veículo
CREATE VIEW vw_corridas_detalhadas AS
SELECT
    c.id_corrida,
    c.id_passageiro,
    c.id_motorista,
    c.id_veiculo,
    u_pass.nome        AS passageiro_nome,
    u_pass.sobrenome   AS passageiro_sobrenome,
    u_mot.nome         AS motorista_nome,
    u_mot.sobrenome    AS motorista_sobrenome,
    v.modelo_veiculo,
    v.tipo_veiculo,
    v.placa,
    c.origem_corrida,
    c.destino_corrida,
    c.tipo_corrida,
    c.preco,
    c.data_corrida,
    c.duracao_corrida,
    c.status_corrida,
    c.num_passageiros,
    c.observacoes,
    c.motivo_cancelamento
FROM corrida c
INNER JOIN passageiro p   ON c.id_passageiro = p.id_passageiro
INNER JOIN usuario u_pass ON p.id_usuario    = u_pass.id_usuario
LEFT JOIN  motorista m    ON c.id_motorista  = m.id_motorista
LEFT JOIN  usuario u_mot  ON m.id_usuario    = u_mot.id_usuario
LEFT JOIN  veiculo v      ON c.id_veiculo    = v.id_veiculo;

-- ============================================

-- VIEW 2: Avaliações com dados da corrida, passageiro e motorista
CREATE VIEW vw_avaliacoes_detalhadas AS
SELECT
    a.id_avaliacao,
    a.nota,
    a.comentario,
    a.criado_em,
    c.id_corrida,
    c.id_motorista,
    c.origem_corrida,
    c.destino_corrida,
    c.tipo_corrida,
    c.status_corrida,
    u_pass.nome        AS passageiro_nome,
    u_pass.sobrenome   AS passageiro_sobrenome,
    u_mot.nome         AS motorista_nome,
    u_mot.sobrenome    AS motorista_sobrenome
FROM avaliacao_corrida a
INNER JOIN corrida c      ON a.id_corrida    = c.id_corrida
INNER JOIN passageiro p   ON c.id_passageiro = p.id_passageiro
INNER JOIN usuario u_pass ON p.id_usuario    = u_pass.id_usuario
LEFT JOIN  motorista m    ON c.id_motorista  = m.id_motorista
LEFT JOIN  usuario u_mot  ON m.id_usuario    = u_mot.id_usuario;

-- ============================================

-- VIEW 3: Motoristas com dados do usuário, veículo e endereço
CREATE VIEW vw_motoristas_detalhados AS
SELECT
    m.id_motorista,
    u.id_usuario,
    u.nome,
    u.sobrenome,
    u.email,
    u.senha,
    u.criado_em,
    m.cpf,
    m.cnh,
    m.celular,
    m.data_nascimento,
    m.antecedentes_criminais,
    m.especializacao,
    m.disponivel,
    v.placa,
    v.tipo_veiculo,
    v.modelo_veiculo,
    e.rua,
    e.numero,
    e.bairro,
    e.cidade,
    e.estado
FROM motorista m
INNER JOIN usuario u  ON m.id_usuario   = u.id_usuario
LEFT JOIN  veiculo v  ON v.id_motorista = m.id_motorista
LEFT JOIN  endereco e ON e.id_motorista = m.id_motorista;

-- ============================================

-- VIEW 4: Passageiros com dados do usuário
CREATE VIEW vw_passageiros_detalhados AS
SELECT
    p.id_passageiro,
    u.id_usuario,
    u.nome,
    u.sobrenome,
    u.email,
    u.senha,
    u.criado_em,
    p.cpf,
    p.celular,
    p.data_nascimento,
    p.necessidades
FROM passageiro p
INNER JOIN usuario u ON p.id_usuario = u.id_usuario;