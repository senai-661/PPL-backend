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

-- ============================================
-- ADMINISTRADOR
-- ============================================
CREATE TABLE administrador (
    id_admin INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(80) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PASSAGEIRO
-- ============================================
CREATE TABLE passageiro (
    id_passageiro INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cpf CHAR(11) UNIQUE NOT NULL CHECK (length(cpf) = 11),
    nome_passageiro VARCHAR(80) NOT NULL,
    sobrenome_passageiro VARCHAR(80) NOT NULL,
    data_nascimento DATE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    celular VARCHAR(20) NOT NULL,
    necessidades TEXT[] DEFAULT '{}',
    tipo_viagem VARCHAR(20) NOT NULL DEFAULT 'Convencional'
        CHECK (tipo_viagem IN ('Convencional', 'EconoComigo', 'Premium')),
    preferencia_clima VARCHAR(20) NOT NULL DEFAULT 'Não Importa'
        CHECK (preferencia_clima IN ('Silencioso', 'Com Música', 'Não Importa')),
    senha TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MOTORISTA
-- ============================================
CREATE TABLE motorista (
    id_motorista INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cpf CHAR(11) UNIQUE NOT NULL CHECK (length(cpf) = 11),
    cnh VARCHAR(11) UNIQUE NOT NULL,
    nome_motorista VARCHAR(150) NOT NULL,
    sobrenome_motorista VARCHAR(100) NOT NULL,
    data_nascimento DATE NOT NULL,
    celular VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    antecedentes_criminais VARCHAR(40) NOT NULL,
    especializacao VARCHAR(50) NOT NULL DEFAULT 'Nenhuma',
    senha TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    CONSTRAINT fk_motorista FOREIGN KEY (id_motorista) REFERENCES motorista(id_motorista) ON DELETE CASCADE,
    CONSTRAINT fk_passageiro FOREIGN KEY (id_passageiro) REFERENCES passageiro(id_passageiro) ON DELETE CASCADE,
    CONSTRAINT chk_owner CHECK (id_motorista IS NOT NULL OR id_passageiro IS NOT NULL)
);

-- ============================================
-- VEICULO
-- ============================================
CREATE TABLE veiculo (
    id_veiculo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_motorista INT NOT NULL REFERENCES motorista(id_motorista) ON DELETE CASCADE,
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
    id_corrida INT NOT NULL REFERENCES corrida(id_corrida) ON DELETE CASCADE,
    nota INT NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario VARCHAR(500),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ADMINISTRADORES
-- ============================================
INSERT INTO administrador (nome, email, senha) VALUES
('Pedro Roque',     'roquelindo@gmail.com',      '$2b$10$7pkXvcT6WnwzH6O1FSC6hOgXwSFudlmw9XqWt9Sbi/nCodfaBIYDK'), -- Senha = roque
('Pablo Sponchiado', 'irmaodasarah@gmail.com',   '$2b$10$6Ykpx8J/F/4bDoljPhNE0eOue7F2LMfJCUBCgpeUpOW82DHQEjjye'); -- Senha = pablo

-- ============================================
-- PASSAGEIROS
-- senha: 123456
-- ============================================
INSERT INTO passageiro
(cpf, nome_passageiro, sobrenome_passageiro, data_nascimento, email, celular, necessidades, tipo_viagem, preferencia_clima, senha)
VALUES
('52998224725', 'Carlos',   'Silva',    '1995-04-10', 'carlos@email.com',         '11999990001', '{"Cadeirante"}',                     'Convencional', 'Não Importa', '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.'),
('12345678909', 'Mariana',  'Souza',    '1998-09-21', 'mariana@email.com',        '11999990002', '{"Cadeirante","Deficiência Visual"}', 'Premium',      'Silencioso',  '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.'),
('11144477735', 'João',     'Oliveira', '1992-12-05', 'joao@email.com',           '11999990003', '{}',                                 'EconoComigo',  'Com Música',  '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.'),
('55566677788', 'Lucas',    'Martins',  '2000-01-15', 'lucas.martins@email.com',  '11988881111', '{"Cadeirante"}',                     'Convencional', 'Silencioso',  '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.'),
('66677788899', 'Fernanda', 'Costa',    '1995-08-30', 'fernanda.costa@email.com', '11988882222', '{"Deficiência Auditiva"}',           'Premium',      'Silencioso',  '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.'),
('77788899900', 'Roberto',  'Alves',    '1980-12-20', 'roberto.alves@email.com',  '11988883333', '{"Deficiência Visual"}',             'EconoComigo',  'Com Música',  '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.'),
('88899900011', 'Juliana',  'Rocha',    '2002-06-10', 'juliana.rocha@email.com',  '11988884444', '{}',                                 'Convencional', 'Não Importa', '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.');

-- ============================================
-- ENDERECOS DOS PASSAGEIROS
-- ============================================
INSERT INTO endereco (rua, numero, bairro, cidade, estado, cep, id_passageiro) VALUES
('Rua A',                     '123',  'Centro',          'Sertãozinho', 'SP', '14160000', 1),
('Av. Brasil',                '456',  'Zona Sul',         'Sertãozinho', 'SP', '14160000', 2),
('Rua das Flores',            '789',  'Norte',            'Sertãozinho', 'SP', '14160000', 3),
('Rua Vergueiro',             '500',  'Liberdade',        'São Paulo',   'SP', '01504000', 4),
('Av. Brigadeiro Faria Lima', '600',  'Itaim Bibi',       'São Paulo',   'SP', '01452000', 5),
('Rua Oscar Freire',          '700',  'Jardins',          'São Paulo',   'SP', '01426000', 6),
('Rua Haddock Lobo',          '800',  'Cerqueira César',  'São Paulo',   'SP', '01414000', 7);

-- ============================================
-- MOTORISTAS
-- senha: 123456
-- ============================================
INSERT INTO motorista
(cpf, cnh, nome_motorista, sobrenome_motorista, data_nascimento, celular, email, antecedentes_criminais, especializacao, senha)
VALUES
('98765432100', '12345678901', 'Ricardo', 'Almeida', '1985-06-15', '11988880001', 'ricardo@email.com',          'Nada consta', 'Mobilidade Reduzida', '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.'),
('74185296300', '23456789012', 'Fernanda', 'Costa',  '1990-03-12', '11988880002', 'fernanda@email.com',         'Nada consta', 'LIBRAS',              '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.'),
('36925814706', '34567890123', 'Bruno',    'Lima',   '1982-11-30', '11988880003', 'bruno@email.com',            'Nada consta', 'Nenhuma',             '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.'),
('11122233344', '11122233344', 'Ana',      'Ferreira','1990-03-22', '11977771111', 'ana.ferreira@email.com',     'Nada consta', 'Mobilidade Reduzida', '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.'),
('22233344455', '22233344455', 'Carlos', 'Mendes', '1985-07-10', '11977772222', 'carlos.mendes@email.com', 'Nada consta', 'LIBRAS', '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.'),
('33344455566', '33344455566', 'Beatriz',  'Santos', '1992-11-05', '11977773333', 'beatriz.santos@email.com',   'Nada consta', 'Deficiência Visual',  '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.'),
('44455566677', '44455566677', 'Diego',    'Lima',   '1988-04-18', '11977774444', 'diego.lima@email.com',       'Nada consta', 'Nenhuma',             '$2b$10$i3q/gcEKZjsJPyZchgOLoOEiRrrUvmPkHRS0iWUn01FZLU9.HRPr.');

-- ============================================
-- ENDERECOS DOS MOTORISTAS
-- ============================================
INSERT INTO endereco (rua, numero, bairro, cidade, estado, cep, id_motorista) VALUES
('Rua B',            '321',  'Centro',       'Sertãozinho', 'SP', '14160000', 1),
('Av. Paulista',     '1000', 'Bela Vista',   'São Paulo',   'SP', '01310100', 2),
('Rua C',            '654',  'Leste',        'Sertãozinho', 'SP', '14160000', 3),
('Rua das Palmeiras','100',  'Centro',       'São Paulo',   'SP', '01310100', 4),
('Av. Paulista',     '200',  'Bela Vista',   'São Paulo',   'SP', '01310200', 5),
('Rua Augusta',      '300',  'Consolação',   'São Paulo',   'SP', '01310300', 6),
('Rua da Consolação','400',  'Higienópolis', 'São Paulo',   'SP', '01310400', 7);

-- ============================================
-- VEICULOS
-- ============================================
INSERT INTO veiculo (id_motorista, placa, tipo_veiculo, modelo_veiculo) VALUES
(1, 'ABC1234', 'Carro',          'Toyota Corolla'),
(2, 'DEF5678', 'Carro',          'Honda Civic'),
(3, 'GHI9012', 'Moto',           'Honda CG 160'),
(4, 'ANA1234', 'Carro Adaptado', 'Renault Kangoo'),
(5, 'CAR5678', 'Van',            'Mercedes Sprinter'),
(6, 'BEA9012', 'Carro',          'Honda Fit'),
(7, 'DIE3456', 'Carro',          'Toyota Corolla');

-- ============================================
-- CORRIDAS
-- ============================================
INSERT INTO corrida
(id_passageiro, id_motorista, id_veiculo, origem_corrida, destino_corrida, preco, duracao_corrida, status_corrida)
VALUES
-- Corridas finalizadas (dados originais)
(1, 1, 1, 'Shopping Center',     'Aeroporto',          45.50, 35, 'Finalizada'),
(2, 2, 2, 'Rodoviária',          'Centro Empresarial', 32.00, 25, 'Finalizada'),
(3, 3, 3, 'Universidade',        'Estação de Metrô',   18.75, 15, 'Cancelada'),
-- Corridas finalizadas (novos dados — matches perfeitos)
(4, 4, 4, 'Terminal Barra Funda',   'Hospital das Clínicas', 28.50, 22, 'Finalizada'), -- Lucas (Cadeirante) → Ana (Mobilidade Reduzida)
(5, 5, 5, 'Aeroporto de Congonhas', 'Shopping Ibirapuera',   52.00, 40, 'Finalizada'), -- Fernanda (Def. Auditiva) → Carlos (LIBRAS)
(6, 6, 6, 'Metrô Consolação',       'USP Cidade Universitária', 19.75, 18, 'Finalizada'), -- Roberto (Def. Visual) → Beatriz (Def. Visual)
(7, 7, 7, 'Rua Haddock Lobo',       'Parque Ibirapuera',     14.00, 12, 'Finalizada'), -- Juliana (sem necessidade) → Diego (Nenhuma)
-- Corridas pendentes (para testar o matching)
(4, NULL, NULL, 'Terminal Santana',  'AACD',              22.00, 0, 'Pendente'), -- Lucas (Cadeirante) → deve ver só Mobilidade Reduzida
(5, NULL, NULL, 'Metrô Brigadeiro',  'Teatro Municipal',  18.50, 0, 'Pendente'), -- Fernanda (Def. Auditiva) → deve ver só LIBRAS
(6, NULL, NULL, 'Av. Paulista',      'Pinacoteca do Estado', 15.00, 0, 'Pendente'); -- Roberto (Def. Visual) → deve ver só Def. Visual

-- ============================================
-- AVALIACOES
-- ============================================
INSERT INTO avaliacao_corrida (id_corrida, nota, comentario) VALUES
(1, 5, 'Excelente motorista, muito educado.'),
(2, 4, 'Boa corrida, mas demorou um pouco.'),
(4, 5, 'Ana foi incrível, veículo totalmente adaptado!'),
(5, 5, 'Carlos sabe LIBRAS perfeitamente, me senti muito segura.'),
(6, 4, 'Beatriz muito atenciosa, recomendo!'),
(7, 3, 'Corrida ok, nada especial.');