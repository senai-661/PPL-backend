---- CREATES

-- Create Passageiro
CREATE TABLE Passageiro (
    id_passageiro INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cpf VARCHAR (15) UNIQUE NOT NULL,
    nome VARCHAR (80) NOT NULL,
    sobrenome VARCHAR (80) NOT NULL,
    data_nascimento DATE NOT NULL,
    endereco VARCHAR NOT NULL (200),
    email VARCHAR (80),
    celular VARCHAR (20) NOT NULL
);

-- Create Motorista
CREATE TABLE Motorista (
    id_motorista INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cpf VARCHAR (15) UNIQUE NOT NULL,
    cnh VARCHAR (11) UNIQUE NOT NULL,
    nome VARCHAR (150) NOT NULL,
    sobrenome VARCHAR (100) NOT NULL,
    data_nascimento DATE NOT NULL,
    celular VARCHAR (20) NOT NULL,
    endereco VARCHAR (200) NOT NULL,
    antecedentes_criminais VARCHAR (40) NOT NULL,
);

-- Create Corrida
CREATE TABLE Corrida (
    id_corrida INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_passageiro INT REFERENCES Passageiro(id_passageiro),
    id_motorista INT REFERENCES Motorista(id_motorista),
    origem_corrida VARCHAR (200) NOT NULL,
    destino_corrida VARCHAR (200) NOT NULL,
    preco DECIMAL (10,2) NOT NULL,
    avaliacao INT NOT NULL, 
    data_corrida DATE NOT NULL,
    duracao_corrida TIME NOT NULL, 
    status_corrida VARCHAR (20) NOT NULL
);



--- INSERTS

-- Passageiro
INSERT INTO Passageiro (cpf, nome, sobrenome, data_nascimento, endereco, email, celular) 
VALUES 


-- Motorista
INSERT INTO Motorista (cpf, cnh, nome, sobrenome, data_nascimento, celular, endereco, antecedentes_criminais) 
VALUES 

-- Inserindo Corrida
INSERT INTO Corrida (id_passageiro, id_motorista, origem_corrida, destino_corrida, preco, avaliacao, data_corrida, duracao_corrida, status_corrida) 
VALUES 



