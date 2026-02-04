---- CREATES

-- Create Passageiro
CREATE TABLE passageiro (
    id_passageiro INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cpf VARCHAR (15) UNIQUE NOT NULL,
    nome_passageiro VARCHAR (80) NOT NULL,
    sobrenome_passageiro VARCHAR (80) NOT NULL,
    data_nascimento DATE NOT NULL,
    endereco VARCHAR (200) NOT NULL,
    email VARCHAR (80),
    celular VARCHAR (20) NOT NULL
);

-- Create Motorista
CREATE TABLE motorista (
    id_motorista INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cpf VARCHAR (15) UNIQUE NOT NULL,
    cnh VARCHAR (11) UNIQUE NOT NULL,
    nome_motorista VARCHAR (150) NOT NULL,
    sobrenome_motorista VARCHAR (100) NOT NULL,
    data_nascimento DATE NOT NULL,
    celular VARCHAR (20) NOT NULL,
    endereco VARCHAR (200) NOT NULL,
    antecedentes_criminais VARCHAR (40) NOT NULL
);

-- Create Veículo
CREATE TABLE veiculo ( 
    id_veiculo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_motorista INT REFERENCES motorista(id_motorista),
    placa VARCHAR (7) UNIQUE NOT NULL,
    tipo_veiculo VARCHAR (30) NOT NULL
);

-- Create Corrida
CREATE TABLE corrida (
    id_corrida INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_passageiro INT REFERENCES passageiro(id_passageiro),
    id_motorista INT REFERENCES motorista(id_motorista),
    id_veiculo INT REFERENCES veiculo(id_veiculo),
    origem_corrida VARCHAR (200) NOT NULL,
    destino_corrida VARCHAR (200) NOT NULL,
    preco DECIMAL (10,2) NOT NULL,
    avaliacao INT NOT NULL, 
    data_corrida DATE NOT NULL,
    duracao_corrida INT NOT NULL, 
    status_corrida VARCHAR (20) NOT NULL
);

CREATE TABLE avaliacao_motorista (
    id_avaliacao INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_motorista INT REFERENCES motorista(id_motorista),
    id_passageiro INT REFERENCES passageiro(id_passageiro),
    nome_motorista REFERENCES motorista(nome_motorista),
    nome_passageiro REFERENCES passageiro(nome_passageiro),
    nota INT NOT NULL,
    comentario VARCHAR (500)
);



--- INSERTS

-- Inserindo Passageiro
INSERT INTO passageiro (cpf, nome, sobrenome, data_nascimento, endereco, email, celular) 
VALUES 


-- Inserindo Motorista
INSERT INTO motorista (cpf, cnh, nome, sobrenome, data_nascimento, celular, endereco, antecedentes_criminais) 
VALUES 

-- Inserindo Corrida
INSERT INTO corrida (id_passageiro, id_motorista, id_veiculo, origem_corrida, destino_corrida, preco, avaliacao, data_corrida, duracao_corrida, status_corrida) 
VALUES 

-- Inserindo Veículos 
INSERT INTO veiculo (id_veiculo, id_motorista, placa) 
VALUES 

INSERT INTO avaliacao_motorista (id_motorista, id_passageiro, nota, comentario) 
VALUES


