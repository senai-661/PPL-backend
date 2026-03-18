-- ============================================
-- DROP TABLES (Ordem correta para evitar erros de FK)
-- ============================================
DROP TABLE IF EXISTS avaliacao_corrida CASCADE;
DROP TABLE IF EXISTS corrida CASCADE;
DROP TABLE IF EXISTS veiculo CASCADE;
DROP TABLE IF EXISTS endereco CASCADE;
DROP TABLE IF EXISTS motorista CASCADE;
DROP TABLE IF EXISTS passageiro CASCADE;
DROP TABLE IF EXISTS administrador CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;

-- ============================================
-- USUARIO (base table)
-- ============================================
CREATE TABLE usuario (
    id_usuario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(80) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    tipo_usuario VARCHAR(20) NOT NULL
        CHECK (tipo_usuario IN ('passageiro', 'motorista', 'admin')),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ADMINISTRADOR
-- ============================================
CREATE TABLE administrador (
    id_admin INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INTEGER UNIQUE NOT NULL
        REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- ============================================
-- PASSAGEIRO
-- ============================================
CREATE TABLE passageiro (
    id_passageiro INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INTEGER UNIQUE NOT NULL
        REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    cpf CHAR(11) UNIQUE NOT NULL CHECK (length(cpf) = 11),
    celular VARCHAR(20) NOT NULL,
    data_nascimento DATE NOT NULL,
    necessidades TEXT[] DEFAULT '{}'
);

-- ============================================
-- MOTORISTA
-- ============================================
CREATE TABLE motorista (
    id_motorista INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INTEGER UNIQUE NOT NULL
        REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    cpf CHAR(11) UNIQUE NOT NULL CHECK (length(cpf) = 11),
    cnh VARCHAR(11) UNIQUE NOT NULL,
    celular VARCHAR(20) NOT NULL,
    data_nascimento DATE NOT NULL,
    antecedentes_criminais VARCHAR(40) NOT NULL,
    especializacao VARCHAR(50) NOT NULL DEFAULT 'Nenhuma'
);

-- ============================================
-- ENDERECO
-- ============================================
CREATE TABLE endereco (
    id_endereco INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rua VARCHAR(150) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL,
    cep CHAR(8) NOT NULL,
    complemento VARCHAR(50),
    id_motorista INTEGER UNIQUE,
    id_passageiro INTEGER UNIQUE,
    CONSTRAINT fk_motorista FOREIGN KEY (id_motorista)
        REFERENCES motorista(id_motorista) ON DELETE CASCADE,
    CONSTRAINT fk_passageiro FOREIGN KEY (id_passageiro)
        REFERENCES passageiro(id_passageiro) ON DELETE CASCADE,
    CONSTRAINT chk_owner CHECK (
        id_motorista IS NOT NULL OR id_passageiro IS NOT NULL
    )
);

-- ============================================
-- VEICULO
-- ============================================
CREATE TABLE veiculo (
    id_veiculo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_motorista INT NOT NULL
        REFERENCES motorista(id_motorista) ON DELETE CASCADE,
    placa VARCHAR(7) UNIQUE NOT NULL,
    tipo_veiculo VARCHAR(30) NOT NULL,
    modelo_veiculo VARCHAR(50) NOT NULL
);

-- ============================================
-- CORRIDA
-- ============================================
CREATE TABLE corrida (
    id_corrida INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_passageiro INT NOT NULL REFERENCES passageiro(id_passageiro) ON DELETE CASCADE,
    id_motorista INT REFERENCES motorista(id_motorista),
    id_veiculo INT REFERENCES veiculo(id_veiculo),
    origem_corrida VARCHAR(200) NOT NULL,
    destino_corrida VARCHAR(200) NOT NULL,
    tipo_corrida VARCHAR(20) NOT NULL DEFAULT 'Convencional'
        CHECK (tipo_corrida IN ('Convencional', 'EconoComigo', 'Premium')),
    preco DECIMAL(10,2) NOT NULL CHECK (preco >= 0),
    data_corrida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duracao_corrida INT NOT NULL DEFAULT 0 CHECK (duracao_corrida >= 0),
    motivo_cancelamento VARCHAR(200),
    status_corrida VARCHAR(20) NOT NULL DEFAULT 'Pendente'
        CHECK (status_corrida IN ('Pendente', 'Aceito', 'Em andamento', 'Finalizada', 'Cancelada'))
);

-- ============================================
-- AVALIACAO_CORRIDA
-- ============================================
CREATE TABLE avaliacao_corrida (
    id_avaliacao INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_corrida INT NOT NULL
        REFERENCES corrida(id_corrida) ON DELETE CASCADE,
    nota INT NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario VARCHAR(500),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INSERTS
-- ============================================

-- ADMINS
INSERT INTO usuario (nome, sobrenome, email, senha, tipo_usuario) VALUES
('Pedro',  'Roque',      'roquelindo@gmail.com',    '$2b$10$7pkXvcT6WnwzH6O1FSC6hOgXwSFudlmw9XqWt9Sbi/nCodfaBIYDK', 'admin'),
('Pablo',  'Sponchiado', 'irmaodasarah@gmail.com',  '$2b$10$6Ykpx8J/F/4bDoljPhNE0eOue7F2LMfJCUBCgpeUpOW82DHQEjjye', 'admin');

INSERT INTO administrador (id_usuario) VALUES
((SELECT id_usuario FROM usuario WHERE email = 'roquelindo@gmail.com')),
((SELECT id_usuario FROM usuario WHERE email = 'irmaodasarah@gmail.com'));

-- PASSAGEIROS
INSERT INTO usuario (nome, sobrenome, email, senha, tipo_usuario) VALUES
('Carlos',   'Silva',    'carlos@email.com',           '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.', 'passageiro'),
('Mariana',  'Souza',    'mariana@email.com',          '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.', 'passageiro'),
('João',     'Oliveira', 'joao@email.com',             '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.', 'passageiro'),
('Lucas',    'Martins',  'lucas.martins@email.com',    '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.', 'passageiro'),
('Fernanda', 'Costa',    'fernanda.costa@email.com',   '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.', 'passageiro'),
('Roberto',  'Alves',    'roberto.alves@email.com',    '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.', 'passageiro'),
('Juliana',  'Rocha',    'juliana.rocha@email.com',    '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.', 'passageiro');

INSERT INTO passageiro (id_usuario, cpf, celular, data_nascimento, necessidades) VALUES
((SELECT id_usuario FROM usuario WHERE email = 'carlos@email.com'),          '52998224725', '11999990001', '1995-04-10', '{"Cadeirante"}'),
((SELECT id_usuario FROM usuario WHERE email = 'mariana@email.com'),         '12345678909', '11999990002', '1998-09-21', '{"Cadeirante","Deficiência Visual"}'),
((SELECT id_usuario FROM usuario WHERE email = 'joao@email.com'),            '11144477735', '11999990003', '1992-12-05', '{}'),
((SELECT id_usuario FROM usuario WHERE email = 'lucas.martins@email.com'),   '55566677788', '11988881111', '2000-01-15', '{"Cadeirante"}'),
((SELECT id_usuario FROM usuario WHERE email = 'fernanda.costa@email.com'),  '66677788899', '11988882222', '1995-08-30', '{"Deficiência Auditiva"}'),
((SELECT id_usuario FROM usuario WHERE email = 'roberto.alves@email.com'),   '77788899900', '11988883333', '1980-12-20', '{"Deficiência Visual"}'),
((SELECT id_usuario FROM usuario WHERE email = 'juliana.rocha@email.com'),   '88899900011', '11988884444', '2002-06-10', '{}');

-- ENDERECOS DOS PASSAGEIROS
INSERT INTO endereco (rua, numero, bairro, cidade, estado, cep, id_passageiro) VALUES
('Rua A',                     '123', 'Centro',          'Sertãozinho', 'SP', '14160000', 1),
('Av. Brasil',                '456', 'Zona Sul',        'Sertãozinho', 'SP', '14160000', 2),
('Rua das Flores',            '789', 'Norte',           'Sertãozinho', 'SP', '14160000', 3),
('Rua Vergueiro',             '500', 'Liberdade',       'São Paulo',   'SP', '01504000', 4),
('Av. Brigadeiro Faria Lima', '600', 'Itaim Bibi',      'São Paulo',   'SP', '01452000', 5),
('Rua Oscar Freire',          '700', 'Jardins',         'São Paulo',   'SP', '01426000', 6),
('Rua Haddock Lobo',          '800', 'Cerqueira César', 'São Paulo',   'SP', '01414000', 7);

-- MOTORISTAS
INSERT INTO usuario (nome, sobrenome, email, senha, tipo_usuario) VALUES
('Ricardo', 'Almeida', 'ricardo@email.com',         '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.', 'motorista'),
('Fernanda','Costa',   'fernanda@email.com',        '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.', 'motorista'),
('Bruno',   'Lima',    'bruno@email.com',           '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.', 'motorista'),
('Ana',     'Ferreira','ana.ferreira@email.com',    '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.', 'motorista'),
('Carlos',  'Mendes',  'carlos.mendes@email.com',   '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.', 'motorista'),
('Beatriz', 'Santos',  'beatriz.santos@email.com',  '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.', 'motorista'),
('Diego',   'Lima',    'diego.lima@email.com',      '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.', 'motorista');

INSERT INTO motorista (id_usuario, cpf, cnh, celular, data_nascimento, antecedentes_criminais, especializacao) VALUES
((SELECT id_usuario FROM usuario WHERE email = 'ricardo@email.com'),        '98765432100', '12345678901', '11988880001', '1985-06-15', 'NADA CONSTA', 'MOBILIDADE REDUZIDA'),
((SELECT id_usuario FROM usuario WHERE email = 'fernanda@email.com'),       '74185296300', '23456789012', '11988880002', '1990-03-12', 'NADA CONSTA', 'LIBRAS'),
((SELECT id_usuario FROM usuario WHERE email = 'bruno@email.com'),          '36925814706', '34567890123', '11988880003', '1982-11-30', 'NADA CONSTA', 'NENHUMA'),
((SELECT id_usuario FROM usuario WHERE email = 'ana.ferreira@email.com'),   '11122233344', '11122233344', '11977771111', '1990-03-22', 'NADA CONSTA', 'MOBILIDADE REDUZIDA'),
((SELECT id_usuario FROM usuario WHERE email = 'carlos.mendes@email.com'),  '22233344455', '22233344455', '11977772222', '1985-07-10', 'NADA CONSTA', 'LIBRAS'),
((SELECT id_usuario FROM usuario WHERE email = 'beatriz.santos@email.com'), '33344455566', '33344455566', '11977773333', '1992-11-05', 'NADA CONSTA', 'DEFICIÊNCIA VISUAL'),
((SELECT id_usuario FROM usuario WHERE email = 'diego.lima@email.com'),     '44455566677', '44455566677', '11977774444', '1988-04-18', 'NADA CONSTA', 'NENHUMA');

-- ENDERECOS DOS MOTORISTAS
INSERT INTO endereco (rua, numero, bairro, cidade, estado, cep, id_motorista) VALUES
('Rua B',            '321',  'Centro',       'Sertãozinho', 'SP', '14160000', 1),
('Av. Paulista',     '1000', 'Bela Vista',   'São Paulo',   'SP', '01310100', 2),
('Rua C',            '654',  'Leste',        'Sertãozinho', 'SP', '14160000', 3),
('Rua das Palmeiras','100',  'Centro',       'São Paulo',   'SP', '01310100', 4),
('Av. Paulista',     '200',  'Bela Vista',   'São Paulo',   'SP', '01310200', 5),
('Rua Augusta',      '300',  'Consolação',   'São Paulo',   'SP', '01310300', 6),
('Rua da Consolação','400',  'Higienópolis', 'São Paulo',   'SP', '01310400', 7);

-- VEICULOS
INSERT INTO veiculo (id_motorista, placa, tipo_veiculo, modelo_veiculo) VALUES
(1, 'ABC1234', 'Carro',          'Toyota Corolla'),
(2, 'DEF5678', 'Carro',          'Honda Civic'),
(3, 'GHI9012', 'Moto',           'Honda CG 160'),
(4, 'ANA1234', 'Carro Adaptado', 'Renault Kangoo'),
(5, 'CAR5678', 'Van',            'Mercedes Sprinter'),
(6, 'BEA9012', 'Carro',          'Honda Fit'),
(7, 'DIE3456', 'Carro',          'Toyota Corolla');

-- CORRIDAS
INSERT INTO corrida
(id_passageiro, id_motorista, id_veiculo, origem_corrida, destino_corrida, tipo_corrida, preco, duracao_corrida, status_corrida)
VALUES
(1, 1, 1, 'Shopping Center',       'Aeroporto',                'Premium',      45.50, 35, 'Finalizada'),
(2, 2, 2, 'Rodoviária',            'Centro Empresarial',       'Convencional', 32.00, 25, 'Finalizada'),
(3, 3, 3, 'Universidade',          'Estação de Metrô',         'EconoComigo',  18.75, 15, 'Cancelada'),
(4, 4, 4, 'Terminal Barra Funda',  'Hospital das Clínicas',    'Convencional', 28.50, 22, 'Finalizada'),
(5, 5, 5, 'Aeroporto de Congonhas','Shopping Ibirapuera',      'Premium',      52.00, 40, 'Finalizada'),
(6, 6, 6, 'Metrô Consolação',      'USP Cidade Universitária', 'EconoComigo',  19.75, 18, 'Finalizada'),
(7, 7, 7, 'Rua Haddock Lobo',      'Parque Ibirapuera',        'Convencional', 14.00, 12, 'Finalizada'),
(4, NULL, NULL, 'Terminal Santana',    'AACD',                 'Convencional', 22.00, 0,  'Pendente'),
(5, NULL, NULL, 'Metrô Brigadeiro',    'Teatro Municipal',     'EconoComigo',  18.50, 0,  'Pendente'),
(6, NULL, NULL, 'Av. Paulista',        'Pinacoteca do Estado', 'Convencional', 15.00, 0,  'Pendente');

-- AVALIACOES
INSERT INTO avaliacao_corrida (id_corrida, nota, comentario) VALUES
(1, 5, 'Excelente motorista, muito educado.'),
(2, 4, 'Boa corrida, mas demorou um pouco.'),
(4, 5, 'Ana foi incrível, veículo totalmente adaptado!'),
(5, 5, 'Carlos sabe LIBRAS perfeitamente, me senti muito segura.'),
(6, 4, 'Beatriz muito atenciosa, recomendo!'),
(7, 3, 'Corrida ok, nada especial.');