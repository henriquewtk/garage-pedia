# GaragePedia - Garagem Virtual e Comparador de Veículos

O **GaragePedia** é uma aplicação desenvolvida como projeto acadêmico no formato de dinâmica de startup para a Universidade de Rio Verde (UniRV)[cite: 1]. A plataforma resolve a opacidade de preços e a dificuldade de cruzar dados de mercado automotivo com especificações técnicas, centralizando a gestão e o acompanhamento financeiro de veículos na palma da mão[cite: 1].

---

## 🚀 Equipe de Desenvolvimento
* **Daniel Carvalho** - Lead Full-Stack Architect & Tech Lead[cite: 1]
* **Henrique Rondon** - Scrum Master & DevOps / QA Engineer[cite: 1]
* **Joao Victor Vieira** - Mobile Front-end Developer & UI/UX Designer[cite: 1]
* **Felipe Lopes** - Back-end Engineer & Database Specialist[cite: 1]

---

## 📱 Arquitetura e Stack Tecnológica

O projeto adota uma arquitetura moderna e escalável dividida entre o ecossistema mobile, microsserviços de back-end e APIs externas:

* **Front-end Mobile:** React Native com Expo[cite: 1] para alta performance e desenvolvimento ágil multiplataforma.
* **Back-end (API / Microsserviços):** 
  * **NestJS** atuando como BFF/Gateway (gerenciamento de rotas, autenticação e cache)[cite: 1].
  * **Kotlin** (com Spring Boot / Ktor) como o microsserviço *Core Engine* para processamento de regras de negócio, desvalorização e cálculos automotivos[cite: 1].
* **Banco de Dados & ORM:** MySQL (gerenciado via DBeaver) com Prisma ORM na camada NestJS[cite: 1].
* **APIs Externas Integradas:**
  * **FIPE API:** Consulta de preços médios, códigos e tabelas de mercado de veículos no Brasil (`https://parallelum.com.br/fipe/api/v1`)[cite: 1].
  * **CarQuery API:** Fichas técnicas detalhadas de motor, potência e especificações mecânicas (`https://www.carqueryapi.com/api/0.3/`)[cite: 1].

---

## 🎯 Escopo do MVP (Produto Mínimo Viável)

* **Entrega 2 (Parcial):** 
  * Tela de catálogo mobile com busca dinâmica (`Marca -> Modelo -> Ano`)[cite: 1].
  * Consumo em tempo real da FIPE API no aplicativo[cite: 1].
  * Tela de cadastro e listagem da "Garagem Virtual" do usuário[cite: 1].
  * Setup inicial do repositório e navegação estruturada[cite: 1].
* **Entrega 3 (Versão Final - Workshop):**
  * Comparador de veículos lado a lado (Preço de mercado vs Ficha técnica)[cite: 1].
  * Integração completa com o ecossistema de serviços e o core de processamento[cite: 1].
  * Refinamentos visuais de UI/UX para a apresentação final[cite: 1].

---

## 🛠️ Como Executar o Projeto Mobile

1. Clone o repositório principal:
   ```bash
   git clone [https://github.com/henriquewtk/garage-pedia.git](https://github.com/henriquewtk/garage-pedia.git)
   cd garage-pedia/mobile

npm install
npx expo start

   
