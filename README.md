# 🚗 OpenLine — Backend API

**Plataforma de transporte acessível e inclusivo para pessoas com necessidades específicas.**

![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=flat-square&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-FB015B?style=flat-square&logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

[Sobre](#-sobre-o-projeto) • [Funcionalidades](#-funcionalidades) • [Rotas da API](#-rotas-da-api) • [Como rodar](#-como-rodar) • [Variáveis de Ambiente](#-variáveis-de-ambiente) • [Contribuindo](#-contribuindo)

---

## 📌 Sobre o projeto

O **OpenLine** é uma plataforma de transporte por aplicativo com foco em **acessibilidade e inclusão**. Diferente de soluções como Uber e 99, o OpenLine foi desenvolvido pensando em pessoas com deficiência, mobilidade reduzida ou que transportam animais de suporte — conectando-as a motoristas com veículos adaptados.

### 🎯 Problema que resolvemos

As plataformas de transporte existentes:

- Coletam apenas dados básicos de cadastro, sem foco em necessidades específicas
- Não oferecem filtros para conectar passageiros a veículos compatíveis
- Possuem baixa oferta de veículos adaptados
- Geram altas taxas de cancelamento e insegurança para pessoas com deficiência

### ✅ Nossa solução

- Cadastro de passageiros com registro de necessidades específicas
- Filtros inteligentes para compatibilidade entre passageiro e veículo
- Incentivo à oferta de veículos adaptados na plataforma
- Redução de cancelamentos e aumento da segurança
- Interface acessível e intuitiva para todos os perfis de usuário

---

## 🚀 Funcionalidades

- 🔐 **Autenticação JWT** com controle de papéis (Passageiro, Motorista, Admin)
- 👤 **Gestão de perfis** para passageiros e motoristas
- 🚘 **Ciclo completo de corridas**: solicitar → aceitar → iniciar → finalizar → cancelar
- ⭐ **Sistema de avaliações** por corrida
- 🚗 **Cadastro e listagem de veículos** adaptados
- 📊 **Dashboard administrativo** e relatórios de desempenho
- 📍 **Gestão de endereços**
- 📋 **Histórico de corridas** e resumo diário do motorista

---

## 📁 Estrutura do Projeto

```
PPL-backend/
├── src/
│   ├── controller/         # Lógica de cada recurso da API
│   │   ├── AdminController.ts
│   │   ├── AvaliacaoController.ts
│   │   ├── CorridaController.ts
│   │   ├── EnderecoController.ts
│   │   ├── MotoristaController.ts
│   │   ├── PassageiroController.ts
│   │   ├── UsuarioController.ts
│   │   └── VeiculoController.ts
│   ├── middlewares/
│   │   └── AuthMiddleware.ts   # Verificação de token e papéis
│   ├── routes.ts               # Definição de todas as rotas
│   └── server.ts               # Entry point da aplicação
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 📜 Normas e Legislação

Trabalhamos em conformidade com as normas de acessibilidade nacionais e internacionais:

| Norma | Descrição |
|-------|-----------|
| 🇧🇷 **Lei Brasileira de Inclusão** (Lei 13.146/2015) | Marco legal da acessibilidade no Brasil, garante direitos das pessoas com deficiência em serviços digitais |
| 📐 **ABNT NBR 9050:2020** | Norma técnica brasileira que regula acessibilidade em espaços, equipamentos e serviços |
| 🌐 **WCAG 2.1** (W3C, 2018) | Diretrizes internacionais para acessibilidade web, cobrindo navegação, contraste, leitores de tela e mais |
| ✅ **ISO 9001** | Norma internacional de gestão da qualidade, garantindo processos confiáveis e melhoria contínua |

---

## 👥 Time

Desenvolvido com 💜 por alunos do **SENAI** como parte do **PPL — Partido de Programadores Liberais**.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.