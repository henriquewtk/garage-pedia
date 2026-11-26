# GaragePedia - Garagem Virtual e Comparador de Veículos

O **GaragePedia** é um aplicativo mobile desenvolvido como projeto acadêmico, no formato de dinâmica de startup, para a Universidade de Rio Verde (UniRV). A plataforma resolve a falta de transparência nos preços de veículos, centralizando a consulta à Tabela FIPE, a comparação entre veículos e uma garagem virtual de favoritos na palma da mão.

**Versão atual:** v1.0.0 (Entrega Final)

---

## 👥 Integrantes

| Nome | Papel |
| --- | --- |
| **Daniel Carvalho** | Lead Full-Stack Architect & Tech Lead |
| **Henrique Rondon** | Scrum Master & DevOps / QA Engineer |
| **Joao Victor Vieira** | Mobile Front-end Developer & UI/UX Designer |
| **Felipe Lopes** | Back-end Engineer & Database Specialist |

---

## ✨ Funcionalidades

- **Cadastro e login de usuários** com persistência local (SQLite).
- **Home** com saudação ao usuário e lista de marcas carregada em tempo real da API FIPE.
- **Pesquisa de veículos** em cascata: `Marca → Modelo → Ano`, com preço FIPE atualizado.
- **Detalhes do veículo**: preço, combustível, código FIPE e mês de referência.
- **Favoritos (Garagem Virtual)**: adicionar e remover veículos favoritos.
- **Comparador lado a lado** entre dois veículos favoritos (preço, combustível, ano e código FIPE).
- **Histórico de comparações** salvo localmente, com opção de exclusão.
- **Perfil do usuário**: visualização e edição de dados, logout.
- **Configurações**: tema claro/escuro e idioma (Português / Inglês).

---

## 🛠️ Tecnologias Utilizadas

- **React Native** + **Expo** (SDK 58) — desenvolvimento mobile multiplataforma (Android / iOS)
- **JavaScript**
- **React Navigation** (Native Stack e Bottom Tabs) — navegação entre telas
- **expo-sqlite** — banco de dados local (usuários, favoritos e comparações)
- **AsyncStorage** — preferências do usuário (tema, idioma, sessão)
- **@expo/vector-icons** — ícones
- **API FIPE** (`https://parallelum.com.br/fipe/api/v1`) — preços de veículos no Brasil

---

## 📂 Estrutura do Projeto

```
garage-pedia/
└── mobile/
    ├── App.js                 # Ponto de entrada do app
    ├── app.json               # Configuração do Expo
    ├── assets/                # Ícones e splash screen
    └── src/
        ├── components/        # Componentes reutilizáveis
        ├── context/           # Contexto de configurações (tema e idioma)
        ├── database/          # Banco de dados SQLite
        ├── navigation/        # Navegação (Stack e Tabs)
        ├── screens/           # Telas do aplicativo
        └── services/          # Integração com a API FIPE
```

---

## 🚀 Como Instalar e Executar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) 20 ou superior (com npm)
- [Git](https://git-scm.com/)
- App **Expo Go** instalado no celular (Android ou iOS) **ou** um emulador Android / simulador iOS

### Passo a passo

1. Clone o repositório:

   ```bash
   git clone https://github.com/henriquewtk/garage-pedia.git
   ```

2. Entre na pasta do app mobile:

   ```bash
   cd garage-pedia/mobile
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Inicie o servidor de desenvolvimento do Expo:

   ```bash
   npx expo start
   ```

5. Abra o app:
   - **Celular:** escaneie o QR Code exibido no terminal com o app Expo Go (Android) ou com a câmera (iOS). O celular e o computador devem estar na mesma rede Wi-Fi.
   - **Emulador Android:** pressione `a` no terminal.
   - **Simulador iOS (macOS):** pressione `i` no terminal.

> O projeto não precisa de arquivo `.env` nem de chaves de API: a API FIPE é pública.

---

## 📦 Build do APK (GitHub Actions)

O workflow [`.github/workflows/build-apk.yml`](.github/workflows/build-apk.yml) compila o APK Android **Garage Pedia** direto nos servidores do GitHub, sem precisar de Android Studio nem de conta Expo.

- **Automático:** todo push que altera `mobile/` gera um novo APK.
- **Manual:** aba **Actions** → **Build APK (Android)** → **Run workflow**.
- **Download:** abra a execução concluída e baixe o APK em **Artifacts** (fica disponível por 30 dias).
- **Release:** ao criar uma tag `v*` (ex.: `git tag v1.0.1 && git push origin v1.0.1`), o APK é anexado automaticamente a uma Release do GitHub.

> O APK é assinado com a chave de debug padrão do Expo, o que permite instalá-lo diretamente no celular (habilite "instalar apps de fontes desconhecidas"). Para publicar na Play Store é necessário configurar uma chave de assinatura própria.

Os ícones e a splash screen são gerados a partir dos arquivos vetoriais em `mobile/assets/brand/`.
