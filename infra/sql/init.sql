-- ============================
-- PASSAGEIRO
-- ============================
CREATE TABLE passageiro (
    id_passageiro INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    nome_passageiro VARCHAR(80) NOT NULL,
    sobrenome_passageiro VARCHAR(80) NOT NULL,
    data_nascimento DATE NOT NULL,
    endereco VARCHAR(200) NOT NULL,
    email VARCHAR(80) UNIQUE NOT NULL,
    celular VARCHAR(20) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- MOTORISTA
-- ============================
CREATE TABLE motorista (
    id_motorista INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    cnh VARCHAR(11) UNIQUE NOT NULL,
    nome_motorista VARCHAR(150) NOT NULL,
    sobrenome_motorista VARCHAR(100) NOT NULL,
    data_nascimento DATE NOT NULL,
    celular VARCHAR(20) NOT NULL,
    endereco VARCHAR(200) NOT NULL,
    email VARCHAR(80) UNIQUE NOT NULL,
    antecedentes_criminais VARCHAR(40) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- VEICULO
-- ============================
CREATE TABLE veiculo ( 
    id_veiculo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_motorista INT NOT NULL REFERENCES motorista(id_motorista) ON DELETE CASCADE,
    placa VARCHAR(7) UNIQUE NOT NULL,
    tipo_veiculo VARCHAR(30) NOT NULL,
    modelo_veiculo VARCHAR(50) NOT NULL
);

-- ============================
-- CORRIDA
-- ============================
CREATE TABLE corrida (
    id_corrida INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_passageiro INT NOT NULL REFERENCES passageiro(id_passageiro) ON DELETE CASCADE,
    id_motorista INT REFERENCES motorista(id_motorista),
    id_veiculo INT REFERENCES veiculo(id_veiculo),
    origem_corrida VARCHAR(200) NOT NULL,
    destino_corrida VARCHAR(200) NOT NULL,
    preco DECIMAL(10,2) NOT NULL CHECK (preco >= 0),
    data_corrida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duracao_corrida INT NOT NULL CHECK (duracao_corrida >= 0),
    status_corrida VARCHAR(20) NOT NULL CHECK (status_corrida IN ('Em andamento', 'Finalizada', 'Cancelada'))
);

-- ============================
-- AVALIACAO MOTORISTA
-- ============================
CREATE TABLE avaliacao_motorista (
    id_avaliacao INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_motorista INT NOT NULL REFERENCES motorista(id_motorista) ON DELETE CASCADE,
    id_passageiro INT NOT NULL REFERENCES passageiro(id_passageiro) ON DELETE CASCADE,
    nota INT NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario VARCHAR(500),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
