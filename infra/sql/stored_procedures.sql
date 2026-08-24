-- Stored procedures / functions to centralize multi-table operations
-- sp_cadastrar_passageiro: cria usuario + passageiro + endereco (opcional)
CREATE OR REPLACE FUNCTION sp_cadastrar_passageiro(
    p_nome VARCHAR,
    p_sobrenome VARCHAR,
    p_email VARCHAR,
    p_senha TEXT,
    p_cpf CHAR(11),
    p_celular VARCHAR,
    p_data_nascimento DATE,
    p_necessidades TEXT[],
    p_rua VARCHAR DEFAULT NULL,
    p_numero VARCHAR DEFAULT NULL,
    p_bairro VARCHAR DEFAULT NULL,
    p_cidade VARCHAR DEFAULT NULL,
    p_estado CHAR(2) DEFAULT NULL,
    p_cep CHAR(8) DEFAULT NULL,
    p_complemento VARCHAR DEFAULT NULL
) RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_usuario INTEGER;
    v_id_passageiro INTEGER;
BEGIN
    -- Validações básicas
    IF p_email IS NULL OR p_senha IS NULL THEN
        RAISE EXCEPTION 'Email e senha são obrigatórios';
    END IF;
    -- Cria usuário
    INSERT INTO usuario (nome, sobrenome, email, senha, tipo_usuario)
    VALUES (p_nome, p_sobrenome, p_email, p_senha, 'passageiro')
    RETURNING id_usuario INTO v_id_usuario;

    -- Cria passageiro
    INSERT INTO passageiro (id_usuario, cpf, celular, data_nascimento, necessidades)
    VALUES (v_id_usuario, p_cpf, p_celular, p_data_nascimento, COALESCE(p_necessidades, '{}'))
    RETURNING id_passageiro INTO v_id_passageiro;

    -- Se dados de endereço foram fornecidos, cria o endereço vinculado
    IF p_rua IS NOT NULL THEN
        INSERT INTO endereco (rua, numero, bairro, cidade, estado, cep, complemento, id_passageiro)
        VALUES (p_rua, p_numero, p_bairro, p_cidade, p_estado, p_cep, p_complemento, v_id_passageiro);
    END IF;

    RETURN v_id_passageiro;
END;
$$;

-- sp_cadastrar_motorista: cria usuario + motorista + endereco (opcional) + veiculo (opcional)
CREATE OR REPLACE FUNCTION sp_cadastrar_motorista(
    p_nome VARCHAR,
    p_sobrenome VARCHAR,
    p_email VARCHAR,
    p_senha TEXT,
    p_cpf CHAR(11),
    p_cnh VARCHAR,
    p_celular VARCHAR,
    p_data_nascimento DATE,
    p_antecedentes_criminais VARCHAR,
    p_especializacao VARCHAR,
    p_rua VARCHAR DEFAULT NULL,
    p_numero VARCHAR DEFAULT NULL,
    p_bairro VARCHAR DEFAULT NULL,
    p_cidade VARCHAR DEFAULT NULL,
    p_estado CHAR(2) DEFAULT NULL,
    p_cep CHAR(8) DEFAULT NULL,
    p_complemento VARCHAR DEFAULT NULL,
    p_placa VARCHAR DEFAULT NULL,
    p_tipo_veiculo VARCHAR DEFAULT NULL,
    p_modelo_veiculo VARCHAR DEFAULT NULL
) RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_usuario INTEGER;
    v_id_motorista INTEGER;
    v_id_veiculo INTEGER;
BEGIN
    IF p_email IS NULL OR p_senha IS NULL THEN
        RAISE EXCEPTION 'Email e senha são obrigatórios';
    END IF;

    INSERT INTO usuario (nome, sobrenome, email, senha, tipo_usuario)
    VALUES (p_nome, p_sobrenome, p_email, p_senha, 'motorista')
    RETURNING id_usuario INTO v_id_usuario;

    INSERT INTO motorista (id_usuario, cpf, cnh, celular, data_nascimento, antecedentes_criminais, especializacao, disponivel)
    VALUES (v_id_usuario, p_cpf, p_cnh, p_celular, p_data_nascimento, p_antecedentes_criminais, COALESCE(p_especializacao, 'Nenhuma'), true)
    RETURNING id_motorista INTO v_id_motorista;

    IF p_rua IS NOT NULL THEN
        INSERT INTO endereco (rua, numero, bairro, cidade, estado, cep, complemento, id_motorista)
        VALUES (p_rua, p_numero, p_bairro, p_cidade, p_estado, p_cep, p_complemento, v_id_motorista);
    END IF;

    IF p_placa IS NOT NULL THEN
        INSERT INTO veiculo (id_motorista, placa, tipo_veiculo, modelo_veiculo)
        VALUES (v_id_motorista, p_placa, p_tipo_veiculo, p_modelo_veiculo)
        RETURNING id_veiculo INTO v_id_veiculo;
    END IF;

    RETURN v_id_motorista;
END;
$$;

-- sp_criar_corrida: cria uma corrida e, opcionalmente, atribui motorista/veiculo e atualiza disponibilidade
CREATE OR REPLACE FUNCTION sp_criar_corrida(
    p_id_passageiro INTEGER,
    p_origem VARCHAR,
    p_destino VARCHAR,
    p_preco NUMERIC,
    p_id_motorista INTEGER DEFAULT NULL,
    p_id_veiculo INTEGER DEFAULT NULL,
    p_tipo_corrida VARCHAR DEFAULT 'Convencional',
    p_duracao INT DEFAULT 0,
    p_num_passageiros INT DEFAULT 1,
    p_observacoes TEXT DEFAULT NULL
) RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_corrida INTEGER;
BEGIN
    IF p_id_passageiro IS NULL THEN
        RAISE EXCEPTION 'Passageiro obrigatório';
    END IF;
    INSERT INTO corrida (id_passageiro, id_motorista, id_veiculo, origem_corrida, destino_corrida, tipo_corrida, preco, duracao_corrida, num_passageiros, observacoes)
    VALUES (p_id_passageiro, p_id_motorista, p_id_veiculo, p_origem, p_destino, p_tipo_corrida, p_preco, p_duracao, p_num_passageiros, p_observacoes)
    RETURNING id_corrida INTO v_id_corrida;

    IF p_id_motorista IS NOT NULL THEN
        UPDATE motorista SET disponivel = false WHERE id_motorista = p_id_motorista;
    END IF;

    RETURN v_id_corrida;
END;
$$;

-- sp_cancelar_corrida: cancela a corrida e, se houver motorista, marca disponível
CREATE OR REPLACE FUNCTION sp_cancelar_corrida(
    p_id_corrida INTEGER,
    p_motivo VARCHAR DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_motorista INTEGER;
BEGIN
    SELECT id_motorista INTO v_id_motorista FROM corrida WHERE id_corrida = p_id_corrida;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Corrida não encontrada';
    END IF;

    UPDATE corrida SET status_corrida = 'Cancelada', motivo_cancelamento = p_motivo WHERE id_corrida = p_id_corrida;

    IF v_id_motorista IS NOT NULL THEN
        UPDATE motorista SET disponivel = true WHERE id_motorista = v_id_motorista;
    END IF;

    RETURN TRUE;
END;
$$;

-- sp_finalizar_corrida: finaliza a corrida e libera o motorista
CREATE OR REPLACE FUNCTION sp_finalizar_corrida(
    p_id_corrida INTEGER
) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_motorista INTEGER;
BEGIN
    SELECT id_motorista INTO v_id_motorista FROM corrida WHERE id_corrida = p_id_corrida;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Corrida não encontrada';
    END IF;

    UPDATE corrida SET status_corrida = 'Finalizada' WHERE id_corrida = p_id_corrida;

    IF v_id_motorista IS NOT NULL THEN
        UPDATE motorista SET disponivel = true WHERE id_motorista = v_id_motorista;
    END IF;

    RETURN TRUE;
END;
$$;
