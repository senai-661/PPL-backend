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
    tipo_veiculo VARCHAR (30) NOT NULL,
    modelo_veiculo VARCHAR (50) NOT NULL
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
    nota INT NOT NULL,
    comentario VARCHAR (500)
);



--- INSERTS

-- Inserindo Passageiro
INSERT INTO passageiro 
(cpf, nome_passageiro, sobrenome_passageiro, data_nascimento, endereco, email, celular)
VALUES
('123.456.789-01', 'Ana', 'Silva', '1998-05-12', 'Rua das Flores, 123', 'ana@gmail.com', '(11) 99999-1111'),
('987.654.321-02', 'Carlos', 'Souza', '1990-08-22', 'Av. Paulista, 500', 'carlos@gmail.com', '(11) 98888-2222'),
('456.789.123-03', 'Mariana', 'Oliveira', '2001-02-03', 'Rua Central, 45', 'mariana@gmail.com', '(11) 97777-3333'),
('321.654.987-04', 'Lucas', 'Pereira', '1995-11-18', 'Rua do Sol, 89', 'lucas@gmail.com', '(11) 96666-4444');



-- Inserindo Motorista
INSERT INTO motorista 
(cpf, cnh, nome_motorista, sobrenome_motorista, data_nascimento, celular, endereco, antecedentes_criminais)
VALUES
('111.222.333-44', '12345678901', 'João', 'Santos', '1985-06-10', '(11) 95555-1111', 'Rua Alfa, 10', 'Nada consta'),
('222.333.444-55', '23456789012', 'Fernanda', 'Lima', '1992-03-25', '(11) 94444-2222', 'Rua Beta, 20', 'Nada consta'),
('333.444.555-66', '34567890123', 'Rafael', 'Costa', '1988-09-14', '(11) 93333-3333', 'Rua Gama, 30', 'Nada consta'),
('444.555.666-77', '45678901234', 'Patricia', 'Mendes', '1996-12-01', '(11) 92222-4444', 'Rua Delta, 40', 'Nada consta');

-- Inserindo Veículos 
INSERT INTO veiculo 
(id_motorista, placa, tipo_veiculo, modelo_veiculo)
VALUES
(1, 'ABC1234', 'Sedan', 'Toyota Corolla'),
(2, 'DEF5678', 'SUV', 'Honda CR-V'),
(3, 'GHI9012', 'Adaptado', 'Ford Transit'),
(4, 'JKL3456', 'Hatch', 'Volkswagen Golf');


INSERT INTO corrida 
(id_passageiro, id_motorista, id_veiculo, origem_corrida, destino_corrida, preco, avaliacao, data_corrida, duracao_corrida, status_corrida)
VALUES
(1, 1, 1, 'Rua das Flores, 123', 'Shopping Central', 25.50, 5, '2026-02-01', 18, 'Finalizada'),
(2, 2, 2, 'Av. Paulista, 500', 'Aeroporto', 65.00, 4, '2026-02-02', 40, 'Finalizada'),
(3, 3, 3, 'Rua Central, 45', 'Hospital Municipal', 18.90, 5, '2026-02-03', 12, 'Finalizada'),
(4, 4, 4, 'Rua do Sol, 89', 'Universidade', 22.00, 4, '2026-02-04', 15, 'Finalizada');

INSERT INTO avaliacao_motorista 
(id_motorista, id_passageiro, nota, comentario)
VALUES
(1, 1, 5, 'Motorista muito educado e pontual.'),
(2, 2, 4, 'Boa corrida, mas demorou um pouco.'),
(3, 3, 5, 'Atendimento excelente e respeitoso.'),
(4, 4, 4, 'Veículo confortável e limpo.');


