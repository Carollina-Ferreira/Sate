
<div align="center">

# 🏆 SATE

### Sistema de Acompanhamento e Treinamento Esportivo

**Treinar. Acompanhar. Evoluir.**

Uma plataforma integrada para conectar treinadores e atletas, modernizar a gestão esportiva e acompanhar a evolução individual.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)
![Dart](https://img.shields.io/badge/Dart-0175C2?style=for-the-badge&logo=dart&logoColor=white)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

---

### 🌐 Conheça o SATE

[![Acessar Site](https://img.shields.io/badge/Acessar_Site-005C45?style=for-the-badge&logo=googlechrome&logoColor=white)](https://sateweb.vercel.app/)

[![Documentação API](https://img.shields.io/badge/Documentação_API-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://sate-backend.onrender.com/api-docs/)

![Status](https://img.shields.io/badge/Status-Em_produção-16A875?style=flat-square)
![Projeto](https://img.shields.io/badge/Projeto-TCC_SENAI-E98BA8?style=flat-square)
![Versão](https://img.shields.io/badge/Versão-1.0.0-4EA5D9?style=flat-square)

</div>

---

## 📑 Sumário

- [Sobre o projeto](#-sobre-o-projeto)
- [Acesso à plataforma](#-acesso-à-plataforma)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias utilizadas](#-tecnologias-utilizadas)
- [Arquitetura do sistema](#-arquitetura-do-sistema)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Como executar o projeto](#-como-executar-o-projeto)
- [API REST](#-api-rest)
- [Documentação Swagger](#-documentação-swagger)
- [Banco de dados](#-banco-de-dados)
- [Segurança e autenticação](#-segurança-e-autenticação)
- [Testes e qualidade de software](#-testes-e-qualidade-de-software)
- [Hospedagem e deploy](#-hospedagem-e-deploy)
- [Contexto acadêmico](#-contexto-acadêmico)
- [Equipe de desenvolvimento](#-equipe-de-desenvolvimento)
- [Status do projeto](#-status-do-projeto)

---

## 📖 Sobre o projeto

O **SATE (Sistema de Acompanhamento e Treinamento Esportivo)** é uma plataforma desenvolvida como Trabalho de Conclusão de Curso (TCC) do curso Técnico em Desenvolvimento de Sistemas do SENAI Osasco.

O projeto surgiu da necessidade de modernizar e simplificar a gestão esportiva, centralizando informações que frequentemente são distribuídas entre planilhas, aplicativos de mensagens e ferramentas independentes.

Por meio de uma plataforma integrada, o SATE permite que treinadores organizem suas equipes, analisem partidas, planejem treinamentos e acompanhem o desenvolvimento dos atletas.

A plataforma é composta por três módulos:

| Módulo | Finalidade |
|---|---|
| 💻 Site Web | Gestão esportiva e análise de desempenho para treinadores |
| 📱 Aplicativo Mobile | Acompanhamento esportivo para atletas e treinadores |
| ⚙️ Backend | Comunicação, processamento e persistência dos dados |

### 🎯 Objetivo

Centralizar informações esportivas em um único ambiente, facilitando o planejamento, a análise de desempenho e o acompanhamento da evolução individual dos atletas.

### 💡 Diferenciais

- Integração entre site e aplicativo.
- Centralização das informações esportivas.
- Personalização dos critérios de análise.
- Suporte a diferentes modalidades esportivas.
- Organização da rotina de atletas e treinadores.
- Análise de vídeos e identificação de eventos.
- Acompanhamento individualizado do desempenho.
- Acesso remoto por meio de infraestrutura em nuvem.

O SATE prioriza a evolução individual dos atletas, sem estabelecer rankings entre eles.

---

## 🌐 Acesso à plataforma

Os serviços web do SATE estão disponibilizados online.

| Serviço | Endereço |
|---|---|
| 💻 Site oficial | [sateweb.vercel.app](https://sateweb.vercel.app/) |
| ⚙️ Backend | [sate-backend.onrender.com](https://sate-backend.onrender.com/) |
| 📚 Swagger | [Documentação da API](https://sate-backend.onrender.com/api-docs/) |
| 🩺 Health Check | [Status do backend](https://sate-backend.onrender.com/api/health) |
| 📱 Aplicativo Android | [Consultar versões no GitHub Releases](https://github.com/Carollina-Ferreira/Sate/releases) |
| 📂 Código-fonte | [Repositório GitHub](https://github.com/Carollina-Ferreira/Sate) |

### 📲 Aplicativo Android

O aplicativo foi desenvolvido em Flutter e pode ser distribuído por meio de um arquivo APK.

A versão de distribuição utiliza o backend hospedado no Render, permitindo o acesso remoto às informações esportivas.

Para instalar uma versão disponibilizada no GitHub Releases:

1. Acesse a página de versões do projeto.
2. Baixe o arquivo APK disponibilizado.
3. Abra o arquivo em um dispositivo Android.
4. Autorize a instalação pela fonte utilizada, caso necessário.
5. Instale o aplicativo e realize o login.

> A disponibilidade do download depende da publicação da versão correspondente no GitHub Releases.

---

## ✨ Funcionalidades

### 💻 Site Web — Treinador

O ambiente web disponibiliza ferramentas para administração, planejamento e análise esportiva.

| Funcionalidade | Descrição |
|---|---|
| 📊 Dashboard | Visualização de indicadores das equipes e partidas |
| 👥 Atletas | Cadastro, edição e gerenciamento de atletas |
| 🛡️ Equipes | Criação, personalização e organização de equipes |
| ⚽ Partidas | Cadastro e gerenciamento de partidas esportivas |
| 🎥 Análise de vídeos | Upload de vídeos e identificação de eventos |
| ✂️ Clipes | Criação de trechos de vídeos de partidas |
| 📈 Estatísticas | Visualização de indicadores esportivos |
| 🔄 Comparações | Comparação de informações e indicadores de desempenho |
| 📅 Calendário | Organização de atividades esportivas |
| 📄 Documentos | Gerenciamento de documentos dos atletas |
| 📥 Importação | Importação de informações por planilhas |
| 🔔 Notificações | Acompanhamento de atualizações do sistema |
| ⚙️ Configurações | Personalização de perfil e critérios de análise |

### 🎥 Análise de vídeos

O módulo de análise de vídeos tem como objetivo auxiliar o treinador na identificação e organização de acontecimentos durante partidas.

Entre os recursos estão:

- Upload e reprodução de vídeos.
- Criação de marcações na linha do tempo.
- Identificação de eventos esportivos.
- Associação de eventos a atletas.
- Classificação de ações positivas, negativas, neutras e destaques.
- Criação de clipes.
- Personalização dos campos de análise por modalidade.
- Consulta de informações e indicadores esportivos.

### 📱 Aplicativo Mobile — Atleta

O aplicativo permite que os atletas acompanhem sua rotina e seu desenvolvimento esportivo.

- 🏠 Página inicial personalizada.
- 🏋️ Visualização dos treinamentos.
- 📅 Calendário esportivo.
- 📢 Convocações.
- ✅ Acompanhamento de presença.
- 🎯 Metas individuais.
- 📈 Evolução de desempenho.
- 🩺 Avaliações e testes físicos.
- 💬 Feedbacks do treinador.
- 👤 Perfil do atleta.
- 📄 Documentos.
- 🔔 Notificações.
- 📰 Feed esportivo.

### 📱 Aplicativo Mobile — Treinador

O perfil do treinador oferece ferramentas para planejamento e acompanhamento das equipes.

- 📊 Visão geral das atividades.
- 👥 Gerenciamento de atletas.
- 🛡️ Seleção e gerenciamento de equipes.
- 🏋️ Criação e planejamento de treinos.
- 📚 Biblioteca de exercícios.
- 📅 Agenda esportiva.
- 📢 Organização de convocações.
- ✅ Controle de presença.
- 📝 Registro de avaliações físicas.
- 🎯 Gerenciamento de metas.
- 💬 Envio de feedbacks.
- 📑 Relatórios e indicadores.
- 📄 Gerenciamento de documentos.
- 🔔 Notificações.
- ⚙️ Configurações de perfil.

### 🏅 Modalidades esportivas

O projeto contempla diferentes modalidades, permitindo a personalização de critérios conforme as características de cada esporte.

| Modalidades |
|---|
| ⚽ Futebol |
| 🏀 Basquete |
| 🏐 Vôlei |
| 🏉 Rugby |
| 🤾 Handebol |
| 🏊 Natação |
| 🏃 Atletismo |
| 🎾 Tênis |

> Algumas funcionalidades permanecem em processo de validação e podem variar conforme a versão disponibilizada.

---

## 🛠️ Tecnologias utilizadas

### Frontend Web

| Tecnologia | Aplicação |
|---|---|
| React | Construção de interfaces e componentes |
| TypeScript | Tipagem e organização do código |
| Vite | Ambiente de desenvolvimento e build |
| CSS Modules | Estilização modular das interfaces |
| Lucide React | Biblioteca de ícones |

### Aplicativo Mobile

| Tecnologia | Aplicação |
|---|---|
| Flutter | Desenvolvimento multiplataforma |
| Dart | Linguagem de programação |
| Material Design | Componentes e padrões de interface |
| HTTP | Comunicação com a API REST |

### Backend

| Tecnologia | Aplicação |
|---|---|
| Node.js | Ambiente de execução JavaScript |
| Express | Desenvolvimento da API REST |
| Prisma ORM | Comunicação com o banco de dados |
| JWT | Autenticação baseada em tokens |
| Bcrypt | Hash de senhas |
| Multer | Recebimento de arquivos |
| Nodemailer | Serviços de envio de e-mails |
| CORS | Configuração de acesso entre origens |
| Dotenv | Gerenciamento de variáveis de ambiente |

### Banco de dados e infraestrutura

| Tecnologia | Aplicação |
|---|---|
| MySQL | Banco de dados relacional |
| Prisma Migrate | Gerenciamento de migrações |
| Aiven | Hospedagem do banco de dados |
| Render | Hospedagem do backend |
| Vercel | Hospedagem do frontend |

### Documentação e testes

| Tecnologia | Aplicação |
|---|---|
| Swagger UI | Interface interativa de documentação |
| Swagger JSDoc | Geração da documentação a partir das rotas |
| OpenAPI 3.0.3 | Especificação da API REST |
| Jest | Testes automatizados do backend |
| Supertest | Testes de requisições HTTP |
| Thunder Client | Testes manuais de endpoints |
| Flutter Analyze | Análise estática do código Dart |

### Ferramentas de desenvolvimento

- Git
- GitHub
- Visual Studio Code
- Figma
- Android Studio
- Flutter SDK
- Prisma Studio

---

## 🏗️ Arquitetura do sistema

O SATE utiliza uma arquitetura cliente-servidor, na qual o site e o aplicativo se comunicam com uma API REST centralizada.

A separação entre frontend, backend e banco de dados favorece a manutenção, a organização e a evolução do sistema.

```mermaid
flowchart TD
    A["💻 Site Web<br/>React + TypeScript<br/>Vercel"]
    B["📱 Aplicativo Android<br/>Flutter + Dart"]
    C["⚙️ API REST<br/>Node.js + Express<br/>Render"]
    D["🔗 Prisma ORM"]
    E[("🗄️ MySQL<br/>Aiven")]
    F["📚 Swagger<br/>Documentação da API"]

    A <-->|HTTPS / JSON| C
    B <-->|HTTPS / JSON| C
    F --- C
    C <--> D
    D <--> E

    style A fill:#E6F7F0,stroke:#16A875,color:#005C45
    style B fill:#E7F3FC,stroke:#4EA5D9,color:#14486B
    style C fill:#D8F3E9,stroke:#005C45,color:#005C45
    style D fill:#FFF0F5,stroke:#E98BA8,color:#713F55
    style E fill:#E6F7F0,stroke:#16A875,color:#005C45
    style F fill:#F0F8DC,stroke:#85B900,color:#405900
```

### 🔄 Fluxo de comunicação

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Site ou Aplicativo
    participant R as Rotas Express
    participant C as Controller
    participant P as Prisma ORM
    participant D as MySQL

    U->>F: Realiza uma ação
    F->>R: Requisição HTTP
    R->>C: Encaminha a solicitação
    C->>P: Valida e processa os dados
    P->>D: Executa operação no banco
    D-->>P: Retorna informações
    P-->>C: Retorna resultado
    C-->>F: Resposta HTTP / JSON
    F-->>U: Atualiza a interface
```

### Integração entre plataformas

O site e o aplicativo compartilham a mesma API e o mesmo banco de dados.

Por exemplo:

1. O treinador cadastra uma equipe pelo site.
2. O frontend envia uma requisição ao backend.
3. O backend valida e processa as informações.
4. O Prisma realiza a operação no MySQL.
5. O aplicativo consulta a mesma API.
6. Os dados atualizados são apresentados ao usuário autorizado.

---

## 📁 Estrutura do projeto

O repositório reúne os três principais módulos do SATE.

```text
Sate/
│
├── sate_web/
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   │   └── api.ts
│   │   ├── pages/
│   │   └── ...
│   ├── package.json
│   └── vite.config.ts
│
├── sate_app/
│   ├── android/
│   ├── ios/
│   ├── lib/
│   │   ├── pages/
│   │   ├── services/
│   │   │   ├── api_config.dart
│   │   │   └── sate_api.dart
│   │   ├── sate/
│   │   │   ├── data/
│   │   │   ├── telas/
│   │   │   └── ui/
│   │   └── main.dart
│   ├── test/
│   └── pubspec.yaml
│
├── sate_backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   │   └── swagger.js
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── lib/
│   │   └── server.js
│   ├── tests/
│   ├── package.json
│   └── prisma.config.ts
│
└── README.md
```

> Estrutura simplificada para facilitar a compreensão da organização do projeto.

### Responsabilidades dos módulos

- **Pages:** telas e interfaces do sistema.
- **Components:** componentes reutilizáveis.
- **Routes:** definição dos endpoints da API.
- **Controllers:** processamento das requisições e regras de negócio.
- **Services:** serviços e comunicação entre módulos.
- **Config:** configurações centralizadas.
- **Prisma:** modelagem e gerenciamento do banco.
- **Tests:** testes automatizados.

---

## 🚀 Como executar o projeto

### Pré-requisitos

Antes de executar o projeto localmente, instale:

- Node.js e npm.
- Git.
- Flutter SDK.
- Android SDK, para compilar o aplicativo Android.
- MySQL, caso utilize um banco local.
- Visual Studio Code ou outra IDE.

### 1. Clonar o repositório

```bash
git clone https://github.com/Carollina-Ferreira/Sate.git
cd Sate
```

### 2. Configurar o backend

Acesse a pasta:

```bash
cd sate_backend
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` com as configurações necessárias para o ambiente local:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/sate"
JWT_SECRET="substitua_por_uma_chave_segura"
PORT=3000
```

Configure também as variáveis adicionais exigidas pelos serviços de e-mail e autenticação, conforme a implementação do backend.

Gere o Prisma Client:

```bash
npx prisma generate
```

Valide o schema:

```bash
npx prisma validate
```

Para aplicar migrações em um banco de desenvolvimento:

```bash
npx prisma migrate dev
```

Inicie o servidor:

```bash
npm run dev
```

Endereços locais:

- Backend: http://localhost:3000
- Health Check: http://localhost:3000/api/health
- Swagger: http://localhost:3000/api-docs/

> Nunca utilize credenciais reais em exemplos públicos ou envie arquivos `.env` para o GitHub.

### 3. Executar o frontend web

Em outro terminal, a partir da pasta principal do projeto:

```bash
cd sate_web
npm install
```

Crie um arquivo `.env.local`:

```env
VITE_API_URL=http://localhost:3000
```

Para utilizar o backend online:

```env
VITE_API_URL=https://sate-backend.onrender.com
```

Execute:

```bash
npm run dev
```

Acesse o endereço informado pelo Vite.

Para verificar a compilação TypeScript:

```bash
npx tsc -b
```

Para gerar a versão de produção:

```bash
npm run build
```

A configuração centralizada da API está localizada em:

```text
sate_web/src/config/api.ts
```

### 4. Executar o aplicativo Flutter

A partir da pasta principal:

```bash
cd sate_app
flutter pub get
```

Para executar utilizando o backend de produção:

```bash
flutter run --dart-define=API_URL=https://sate-backend.onrender.com
```

Para utilizar um backend local em um emulador Android:

```bash
flutter run --dart-define=API_URL=http://10.0.2.2:3000
```

Em dispositivos físicos, utilize o endereço IP do computador quando estiver trabalhando com um backend local.

A configuração centralizada da API está localizada em:

```text
sate_app/lib/services/api_config.dart
```

### 5. Gerar o APK para Android

Para gerar uma versão conectada ao backend online:

```bash
flutter pub get
flutter build apk --release --dart-define=API_URL=https://sate-backend.onrender.com
```

O arquivo será disponibilizado em:

```text
sate_app/build/app/outputs/flutter-apk/app-release.apk
```

O APK pode ser instalado em dispositivos Android compatíveis.

---

## 🔌 API REST

O backend do SATE utiliza Node.js e Express, com uma estrutura organizada em rotas, controllers e serviços.

As requisições utilizam métodos HTTP e respostas estruturadas em JSON.

### Principais módulos — Web

| Módulo | Endpoint base |
|---|---|
| Autenticação | `/api/auth` |
| Atletas | `/api/atletas` |
| Treinadores | `/api/treinadores` |
| Usuários | `/api/usuarios` |
| Equipes | `/api/equipes` |
| Partidas | `/api/partidas` |
| Vídeos | `/api/videos` |
| Dashboard | `/api/dashboard` |
| Estatísticas | `/api/estatisticas` |
| Configuração de análise | `/api/configuracao-analise` |
| Recuperação de senha | `/api/password` |
| Notificações | `/api/notificacoes` |
| Preferências | `/api/usuarios/preferencias` |
| Header | `/api/header` |
| Health Check | `/api/health` |

### Principais módulos — Mobile

| Módulo | Endpoint base |
|---|---|
| Aplicativo | `/api/mobile` |
| Exercícios | `/api/exercicios` |
| Treinos | `/api/treinos` |
| Eventos | `/api/eventos` |
| Presenças | `/api/presencas` |
| Testes físicos | `/api/testes` |
| Metas | `/api/metas` |
| Feedbacks | `/api/feedbacks` |
| Documentos | `/api/documentos` |

### Métodos HTTP

| Método | Finalidade |
|---|---|
| GET | Consultar informações |
| POST | Criar registros ou enviar dados |
| PUT | Atualizar registros |
| PATCH | Realizar atualizações parciais |
| DELETE | Remover registros |

### Códigos de resposta HTTP

| Código | Significado |
|---|---|
| 200 | Requisição realizada com sucesso |
| 201 | Recurso criado |
| 400 | Requisição inválida |
| 401 | Autenticação necessária ou inválida |
| 403 | Acesso não autorizado |
| 404 | Recurso ou rota não encontrado |
| 409 | Conflito de informações |
| 413 | Arquivo ou requisição acima do limite |
| 500 | Erro interno do servidor |

### Exemplos de requisições

Consultar equipes:

```http
GET /api/equipes
Authorization: Bearer SEU_TOKEN
```

Consultar atletas:

```http
GET /api/atletas
Authorization: Bearer SEU_TOKEN
```

Consultar vídeos de uma partida:

```http
GET /api/partidas/:id/videos
Authorization: Bearer SEU_TOKEN
```

Enviar um vídeo para uma partida:

```http
POST /api/partidas/:id/videos
Authorization: Bearer SEU_TOKEN
Content-Type: multipart/form-data
```

Consultar marcações de um vídeo:

```http
GET /api/videos/:videoId/marcacoes
Authorization: Bearer SEU_TOKEN
```

Consultar informações do usuário mobile:

```http
GET /api/mobile/me
Authorization: Bearer SEU_TOKEN
```

Consultar o estado do servidor:

```http
GET /api/health
```

> Os parâmetros, permissões e formatos de requisição podem variar conforme o endpoint. Consulte a documentação e o código das rotas.

---

## 📚 Documentação Swagger

A API do SATE possui documentação interativa desenvolvida com Swagger UI e Swagger JSDoc, utilizando a especificação OpenAPI 3.0.3.

A documentação permite visualizar os endpoints, consultar parâmetros, identificar métodos HTTP e executar requisições.

### Acessar documentação

| Ambiente | Endereço |
|---|---|
| Produção | [Swagger Online](https://sate-backend.onrender.com/api-docs/) |
| Desenvolvimento | http://localhost:3000/api-docs/ |

### Organização da documentação

Os comentários `@swagger` estão presentes nos arquivos de rotas do backend.

A configuração está localizada em:

```text
sate_backend/src/config/swagger.js
```

A interface é disponibilizada pelo Express:

```javascript
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);
```

Na versão validada durante a configuração do deploy, foram identificados 36 caminhos documentados na especificação da API.

### Como testar uma requisição

1. Acesse a documentação Swagger.
2. Selecione o endpoint desejado.
3. Informe um token JWT válido em **Authorize**, quando necessário.
4. Clique em **Try it out**.
5. Preencha os parâmetros ou o corpo da requisição.
6. Clique em **Execute**.
7. Analise o código HTTP e o retorno do servidor.

A documentação facilita a integração entre frontend, aplicativo mobile e backend.

> Utilize contas e dados de teste ao executar operações que alteram informações no ambiente de produção.

---

## 🗄️ Banco de dados

O SATE utiliza MySQL como banco de dados relacional e Prisma ORM para o gerenciamento e persistência das informações.

O banco de produção está hospedado na plataforma Aiven.

### Principais entidades e informações

| Entidade ou recurso | Responsabilidade |
|---|---|
| Usuario | Cadastro e informações de acesso |
| Treinador | Informações dos treinadores |
| Atleta | Dados e acompanhamento dos atletas |
| Equipe | Organização das equipes esportivas |
| Partida | Informações das partidas |
| VideoPartida | Vídeos associados às partidas |
| Marcações | Eventos identificados nos vídeos |
| ConfiguracaoAnalise | Critérios personalizados de análise |
| Preferências | Configurações dos usuários |
| Treinos | Planejamento de treinamentos |
| Exercícios | Informações sobre exercícios |
| Presenças | Acompanhamento da participação |
| Testes físicos | Registro de avaliações |
| Metas | Objetivos individuais dos atletas |
| Feedbacks | Acompanhamento realizado pelo treinador |
| Documentos | Informações dos documentos esportivos |
| Notificações | Atualizações e comunicados |

A modelagem completa está definida em:

```text
sate_backend/prisma/schema.prisma
```

### Prisma ORM

Gerar o Prisma Client:

```bash
npx prisma generate
```

Validar o schema:

```bash
npx prisma validate
```

Consultar o estado das migrações:

```bash
npx prisma migrate status
```

Executar migrações em desenvolvimento:

```bash
npx prisma migrate dev
```

Aplicar migrações existentes em produção:

```bash
npx prisma migrate deploy
```

Visualizar o banco em ambiente autorizado:

```bash
npx prisma studio
```

> Alterações no banco de produção devem ser realizadas de forma controlada e com atenção à integridade dos dados.

---

## 🔐 Segurança e autenticação

O sistema utiliza mecanismos de autenticação e controle de acesso para proteger informações e funcionalidades.

### Recursos de segurança

- Autenticação por JWT.
- Hash de senhas com Bcrypt.
- Validação de dados recebidos.
- Proteção de rotas autenticadas.
- Controle de acesso conforme o perfil do usuário.
- Recuperação de senha.
- Variáveis de ambiente para informações sensíveis.
- Comunicação HTTPS no ambiente de produção.
- Validação de arquivos enviados.
- Tratamento de erros e respostas HTTP.
- Configuração de CORS.

### Perfis de acesso

#### 👨‍🏫 Treinador

Possui acesso aos recursos de gerenciamento esportivo, incluindo equipes, atletas, partidas, treinamentos e análises.

Pode utilizar o ambiente web e o aplicativo mobile.

#### 🏃 Atleta

Possui acesso às informações relacionadas à sua rotina, treinamentos e evolução esportiva pelo aplicativo mobile.

### Proteção de dados

Credenciais de banco de dados, chaves JWT, tokens e demais segredos não devem ser armazenados publicamente no código-fonte.

O acesso às informações deve respeitar as permissões do usuário autenticado.

A segurança das dependências e dos mecanismos de autorização permanece sujeita a revisão contínua.

---

## 🧪 Testes e qualidade de software

A validação do SATE contempla testes unitários, testes de rotas, testes de integração, testes funcionais e análise estática.

### Testes unitários — Jest

Os testes unitários têm como objetivo verificar isoladamente funções, controllers e regras de negócio.

A utilização de testes automatizados permite identificar comportamentos inesperados e reduzir a ocorrência de regressões.

### Testes de rotas — Supertest

Permitem verificar o comportamento dos endpoints da API por meio de requisições HTTP.

Entre os aspectos avaliados estão:

- Códigos de resposta HTTP.
- Validação de parâmetros.
- Autenticação.
- Tratamento de erros.
- Retorno de informações.
- Comportamento das operações de cadastro e consulta.

### Executar testes do backend

Acesse a pasta:

```bash
cd sate_backend
```

Com as dependências de teste instaladas, execute:

```bash
npm test
```

Executar testes unitários:

```bash
npm run test:unit
```

Executar testes de rotas:

```bash
npm run test:routes
```

Gerar relatório de cobertura:

```bash
npm run test:coverage
```

O relatório permite analisar:

| Indicador | Descrição |
|---|---|
| Statements | Instruções executadas pelos testes |
| Branches | Caminhos condicionais verificados |
| Functions | Funções executadas |
| Lines | Linhas de código cobertas |

> Os resultados de cobertura devem ser consultados no relatório gerado pela versão atual do projeto.

### Testes de API

As requisições também podem ser verificadas manualmente utilizando:

- Thunder Client.
- Swagger UI.

Essas ferramentas permitem analisar respostas de sucesso e erro, códigos HTTP, autenticação e informações retornadas.

### Validação do frontend

```bash
cd sate_web
npx tsc -b
npx vite build
```

### Validação do aplicativo

```bash
cd sate_app
flutter analyze --no-fatal-infos --no-fatal-warnings
```

Executar testes Flutter:

```bash
flutter test
```

### Testes de integração

Os testes de integração verificam a comunicação entre:

- Frontend web e backend.
- Aplicativo mobile e backend.
- Backend e banco de dados.
- Serviços de autenticação e funcionalidades protegidas.

### Testes funcionais

Os testes funcionais avaliam o comportamento das interfaces e dos principais fluxos de utilização do sistema.

A compilação bem-sucedida e a análise estática não substituem os testes realizados pelos usuários em ambiente de produção.

---

## ☁️ Hospedagem e deploy

O SATE utiliza uma infraestrutura distribuída em serviços de nuvem.

| Componente | Plataforma | Responsabilidade |
|---|---|---|
| Frontend | Vercel | Hospedagem da aplicação React |
| Backend | Render | Execução da API REST |
| Banco de dados | Aiven | Persistência das informações MySQL |
| Documentação | Render | Disponibilização do Swagger |
| Aplicativo | APK Android | Distribuição e instalação mobile |
| Código-fonte | GitHub | Versionamento e colaboração |

### Frontend — Vercel

Configuração de referência:

```text
Root Directory: sate_web
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

Variável de ambiente:

```env
VITE_API_URL=https://sate-backend.onrender.com
```

### Backend — Render

Configuração de referência:

```text
Branch: main
Root Directory: sate_backend
Build Command: npm install && npx prisma generate
Start Command: npm start
```

As credenciais e demais variáveis de ambiente são configuradas diretamente na plataforma de hospedagem.

### Banco de dados — Aiven

O MySQL é disponibilizado como serviço de banco de dados em nuvem.

A conexão é realizada pelo Prisma por meio da variável `DATABASE_URL`.

### Aplicativo — Flutter

A versão Android é compilada utilizando o endereço público do backend.

```bash
flutter build apk --release --dart-define=API_URL=https://sate-backend.onrender.com
```

### Fluxo de publicação

```mermaid
flowchart LR
    A["Desenvolvimento"] --> B["GitHub - main"]
    B --> C["Vercel"]
    B --> D["Render"]
    B --> E["Build Flutter"]
    E --> F["APK Android"]
    D --> G[("MySQL - Aiven")]

    style A fill:#FFF0F5,stroke:#E98BA8,color:#713F55
    style B fill:#E6F7F0,stroke:#16A875,color:#005C45
    style C fill:#E7F3FC,stroke:#4EA5D9,color:#14486B
    style D fill:#E6F7F0,stroke:#005C45,color:#005C45
    style E fill:#E7F3FC,stroke:#4EA5D9,color:#14486B
    style F fill:#E6F7F0,stroke:#16A875,color:#005C45
    style G fill:#FFF0F5,stroke:#E98BA8,color:#713F55
```

---

## 🎨 Identidade visual

A identidade visual do SATE foi desenvolvida para transmitir organização, evolução, movimento e modernidade.

| Cor | Código hexadecimal |
|---|---|
| Verde principal | `#16A875` |
| Verde escuro | `#005C45` |
| Azul | `#4EA5D9` |
| Rosa | `#EF476F` |
| Rosa suave | `#E98BA8` |
| Vermelho | `#D52941` |
| Branco | `#FFFFFF` |

As interfaces buscam proporcionar uma experiência intuitiva, consistente e adequada aos diferentes perfis de usuários.

---

## 🎓 Contexto acadêmico

O SATE foi desenvolvido como **Trabalho de Conclusão de Curso (TCC)** do curso Técnico em Desenvolvimento de Sistemas do SENAI Osasco.

O desenvolvimento do projeto envolveu a aplicação prática de conhecimentos relacionados a:

- Levantamento de requisitos.
- Planejamento de projetos.
- Prototipagem de interfaces.
- Desenvolvimento frontend.
- Desenvolvimento backend.
- Desenvolvimento mobile.
- Banco de dados relacional.
- Modelagem de sistemas.
- APIs REST.
- Segurança e autenticação.
- Experiência do usuário.
- Versionamento de código.
- Testes de software.
- Documentação técnica.
- Integração de sistemas.
- Hospedagem e deploy em nuvem.

### Etapas de desenvolvimento

```mermaid
flowchart LR
    A["Planejamento"] --> B["Prototipagem"]
    B --> C["Frontend e Mobile"]
    C --> D["Backend"]
    D --> E["Banco de Dados"]
    E --> F["Integração"]
    F --> G["Testes"]
    G --> H["Deploy"]

    style A fill:#FFF0F5,stroke:#E98BA8,color:#713F55
    style B fill:#E7F3FC,stroke:#4EA5D9,color:#14486B
    style C fill:#E6F7F0,stroke:#16A875,color:#005C45
    style D fill:#E6F7F0,stroke:#16A875,color:#005C45
    style E fill:#FFF0F5,stroke:#E98BA8,color:#713F55
    style F fill:#E7F3FC,stroke:#4EA5D9,color:#14486B
    style G fill:#FFF0F5,stroke:#E98BA8,color:#713F55
    style H fill:#E6F7F0,stroke:#16A875,color:#005C45
```

---

## 👥 Equipe de desenvolvimento

Projeto desenvolvido pela equipe **SATE**.

| Integrante |
|---|
| Carolina |
| Eduarda |
| Manuela |
| Nicoly |

**Instituição:** SENAI Osasco

**Curso:** Técnico em Desenvolvimento de Sistemas

**Projeto:** Trabalho de Conclusão de Curso

**Ano:** 2026

---

## 📌 Status do projeto

O SATE encontra-se em fase de entrega acadêmica, com os serviços web disponibilizados em ambiente de produção e o aplicativo Android compilado.

| Componente | Status |
|---|---|
| Frontend Web | ✅ Hospedado |
| Backend | ✅ Hospedado |
| Banco de dados | ✅ Hospedado |
| Swagger | ✅ Disponível online |
| Aplicativo Android | ✅ APK gerado |
| Integração entre plataformas | 🔄 Em validação |
| Testes automatizados | 🔄 Implementados e em revisão |
| Documentação técnica | 🔄 Em revisão final |
| Distribuição pública do APK | 🔄 Conforme publicação da versão |

O projeto está sujeito a melhorias, correções e novas validações.

---

<div align="center">

## 💚 SATE

### Treinar. Acompanhar. Evoluir.

*Tecnologia para transformar dados em evolução esportiva.*

---

Desenvolvido pela equipe SATE — SENAI Osasco, 2026.

[![GitHub](https://img.shields.io/badge/GitHub-SATE-181717?style=for-the-badge&logo=github)](https://github.com/Carollina-Ferreira/Sate)

[![Site](https://img.shields.io/badge/SATE-Acessar_Plataforma-16A875?style=for-the-badge)](https://sateweb.vercel.app/)

</div>
