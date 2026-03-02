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
-- PASSAGEIRO (Removida coluna endereco)
-- ============================================
CREATE TABLE passageiro (
    id_passageiro INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cpf CHAR(11) UNIQUE NOT NULL CHECK (length(cpf) = 11),
    nome_passageiro VARCHAR(80) NOT NULL,
    sobrenome_passageiro VARCHAR(80) NOT NULL,
    data_nascimento DATE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    celular VARCHAR(20) NOT NULL,
    senha TEXT NOT NULL, 
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MOTORISTA (Removida coluna endereco)
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
    senha TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ENDERECO (A tabela central de endereços)
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
    CONSTRAINT fk_passageiro FOREIGN KEY (id_passageiro) REFERENCES passageiro(id_passageiro) ON DELETE CASCADE
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
    duracao_corrida INT NOT NULL CHECK (duracao_corrida >= 0),
    status_corrida VARCHAR(20) NOT NULL CHECK (status_corrida IN ('Em andamento', 'Finalizada', 'Cancelada'))
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
-- INSERTS DE TESTE
-- ============================================

-- ============================================
-- INSERTS (com hash bcrypt real de exemplo)
-- senha original para todos: 123456
-- ============================================

-- Hash real bcrypt de "123456"
-- $2b$10$7a0XWnF1WmG0pYxJjXxJ9uG6v1JH7gHnL2gYw7mJ7Qp8VZbJm9mW2


-- ============================================
-- INSERTS (com hash bcrypt real de exemplo)
-- senha original para todos: 123456
-- ============================================

-- Hash real bcrypt de "123456"
-- $2b$10$7a0XWnF1WmG0pYxJjXxJ9uG6v1JH7gHnL2gYw7mJ7Qp8VZbJm9mW2

INSERT INTO administrador (nome, email, senha) VALUES
 ('Pedro Roque', 'roquelindo@gmail.com', '$2b$10$7a0XWnF1WmG0pYxJjXxJ9uG6v1JH7gHnL2gYw7mJ7Qp8VZbJm9mW2');

-- Compensa mais inserir manualmente os administradores pra não ter que criar uma função pra registrar admin-- 
-- node -e "console.log(require('bcrypt').hashSync('SUA_SENHA_AQUI', 10))" -- 
-- faz o Hash da senha manualmente e loga depois pelo aplicativo, já sincroninzando com o banco de dados!!! 
-- Demorei um baita tempo pra entender como fuciona isso meudeus -- 

-- Inserindo Passageiros (Sem a coluna endereço)
INSERT INTO passageiro 
(cpf, nome_passageiro, sobrenome_passageiro, data_nascimento, email, celular, senha)
VALUES
('52998224725', 'Carlos', 'Silva', '1995-04-10', 'carlos@email.com', '11999990001', '$2b$10$7a0XWnF1WmG0pYxJjXxJ9uG6v1JH7gHnL2gYw7mJ7Qp8VZbJm9mW2'),
('12345678909', 'Mariana', 'Souza', '1998-09-21', 'mariana@email.com', '11999990002', '$2b$10$7a0XWnF1WmG0pYxJjXxJ9uG6v1JH7gHnL2gYw7mJ7Qp8VZbJm9mW2'),
('11144477735', 'João', 'Oliveira', '1992-12-05', 'joao@email.com', '11999990003', '$2b$10$7a0XWnF1WmG0pYxJjXxJ9uG6v1JH7gHnL2gYw7mJ7Qp8VZbJm9mW2');

-- Inserindo Endereços dos Passageiros (Ligando pelos IDs 1, 2 e 3)
INSERT INTO endereco (rua, numero, bairro, cidade, estado, cep, id_passageiro) VALUES
('Rua A', '123', 'Centro', 'Sertãozinho', 'SP', '14160000', 1),
('Av. Brasil', '456', 'Zona Sul', 'Sertãozinho', 'SP', '14160000', 2),
('Rua das Flores', '789', 'Norte', 'Sertãozinho', 'SP', '14160000', 3);

-- Inserindo Motoristas (Sem a coluna endereço)
INSERT INTO motorista
(cpf, cnh, nome_motorista, sobrenome_motorista, data_nascimento, celular, email, antecedentes_criminais, senha)
VALUES
('98765432100', '12345678901', 'Ricardo', 'Almeida', '1985-06-15', '11988880001', 'ricardo@email.com', 'Nada consta', '$2b$10$7a0XWnF1WmG0pYxJjXxJ9uG6v1JH7gHnL2gYw7mJ7Qp8VZbJm9mW2'),
('74185296300', '23456789012', 'Fernanda', 'Costa', '1990-03-12', '11988880002', 'fernanda@email.com', 'Nada consta', '$2b$10$7a0XWnF1WmG0pYxJjXxJ9uG6v1JH7gHnL2gYw7mJ7Qp8VZbJm9mW2'),
('36925814706', '34567890123', 'Bruno', 'Lima', '1982-11-30', '11988880003', 'bruno@email.com', 'Nada consta', '$2b$10$7a0XWnF1WmG0pYxJjXxJ9uG6v1JH7gHnL2gYw7mJ7Qp8VZbJm9mW2');

-- Inserindo Endereços dos Motoristas (Ligando pelos IDs 1, 2 e 3)
INSERT INTO endereco (rua, numero, bairro, cidade, estado, cep, id_motorista) VALUES
('Rua B', '321', 'Centro', 'Sertãozinho', 'SP', '14160000', 1),
('Av. Paulista', '1000', 'Bela Vista', 'São Paulo', 'SP', '01310100', 2),
('Rua C', '654', 'Leste', 'Sertãozinho', 'SP', '14160000', 3);

INSERT INTO veiculo
(id_motorista, placa, tipo_veiculo, modelo_veiculo)
VALUES
(1, 'ABC1234', 'Carro', 'Toyota Corolla'),
(2, 'DEF5678', 'Carro', 'Honda Civic'),
(3, 'GHI9012', 'Moto', 'Honda CG 160');

INSERT INTO corrida
(id_passageiro, id_motorista, id_veiculo, origem_corrida, destino_corrida, preco, duracao_corrida, status_corrida)
VALUES
(1, 1, 1, 'Shopping Center', 'Aeroporto', 45.50, 35, 'Finalizada'),
(2, 2, 2, 'Rodoviária', 'Centro Empresarial', 32.00, 25, 'Em andamento'),
(3, 3, 3, 'Universidade', 'Estação de Metrô', 18.75, 15, 'Cancelada');

INSERT INTO avaliacao_corrida
(id_corrida, nota, comentario)
VALUES
(1, 5, 'Excelente motorista, muito educado.'),
(2, 4, 'Boa corrida, mas demorou um pouco.'),
(3, 2, 'Motorista cancelou no meio do trajeto.');