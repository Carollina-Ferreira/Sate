
<div align="center">

# 🏆 SATE
### Sistema de Acompanhamento e Treinamento Esportivo

**Treinar. Acompanhar. Evoluir.**

Uma plataforma integrada para conectar treinadores e atletas, organizar atividades esportivas e acompanhar o desenvolvimento individual.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

</div>

---

## 📖 Sobre o projeto

O **SATE (Sistema de Acompanhamento e Treinamento Esportivo)** é uma plataforma desenvolvida como Trabalho de Conclusão de Curso (TCC) do Técnico em Desenvolvimento de Sistemas do SENAI.

O projeto nasceu com o objetivo de modernizar e simplificar a gestão esportiva, permitindo que treinadores organizem suas equipes, analisem partidas, acompanhem atletas e tomem decisões com base em dados.

A plataforma é composta por três sistemas integrados:

- 💻 **Site Web:** gestão esportiva voltada aos treinadores.
- 📱 **Aplicativo Mobile:** acompanhamento esportivo para atletas e treinadores.
- ⚙️ **Backend:** API responsável pela comunicação e sincronização dos dados entre as plataformas.

### 🎯 Objetivo

Centralizar informações esportivas em um único ambiente, facilitando o planejamento, a análise de desempenho e o acompanhamento da evolução individual dos atletas.

---

## ✨ Funcionalidades

### 💻 Site Web — Treinador

O ambiente web disponibiliza recursos para a administração e análise esportiva.

| Funcionalidade | Descrição |
|---|---|
| 📊 Dashboard | Visualização de indicadores e informações das equipes |
| 👥 Atletas | Cadastro, edição e acompanhamento de atletas |
| 🛡️ Equipes | Criação e gerenciamento de equipes |
| ⚽ Partidas | Cadastro e organização de partidas |
| 🎥 Análise de Vídeos | Upload de vídeos e identificação de eventos |
| ✂️ Clipes | Criação de trechos de partidas |
| 📈 Estatísticas | Análise de informações esportivas |
| 🔄 Comparações | Comparação de indicadores de desempenho |
| 📅 Calendário | Organização de atividades esportivas |
| ⚙️ Configurações | Personalização e critérios de análise |

### 📱 Aplicativo — Atleta

O aplicativo permite que os atletas acompanhem suas informações e atividades.

- 🏠 Página inicial personalizada
- 🏋️ Visualização de treinos
- 📅 Calendário esportivo
- 📢 Convocações
- 🎯 Metas individuais
- 📈 Evolução de desempenho
- 🩺 Avaliações físicas
- 👤 Perfil do atleta
- 🔔 Notificações
- 📰 Feed esportivo

### 📱 Aplicativo — Treinador

O perfil do treinador oferece ferramentas para acompanhar e organizar as equipes.

- 📊 Visão geral das atividades
- 👥 Acompanhamento de atletas
- 🏋️ Planejamento de treinos
- 📅 Calendário esportivo
- 📢 Gerenciamento de convocações
- ✅ Controle de presença
- 📝 Registro de avaliações
- 📑 Relatórios esportivos
- 🔔 Notificações

> Algumas funcionalidades podem estar em desenvolvimento ou validação, dependendo da versão do projeto.

---

## 🛠️ Tecnologias utilizadas

### Frontend Web

- **React:** construção das interfaces
- **TypeScript:** tipagem e organização do código
- **Vite:** ambiente de desenvolvimento e build
- **CSS Modules:** estilização das páginas e componentes

### Aplicativo Mobile

- **Flutter:** desenvolvimento multiplataforma
- **Dart:** linguagem de programação do aplicativo

### Backend

- **Node.js:** ambiente de execução JavaScript
- **Express:** criação e gerenciamento da API REST
- **Prisma ORM:** comunicação com o banco de dados
- **JWT:** autenticação baseada em tokens

### Banco de Dados

- **MySQL:** armazenamento relacional das informações
- **Prisma Migrate:** gerenciamento das migrações

### Ferramentas de desenvolvimento

- Git e GitHub
- Visual Studio Code
- Figma
- Thunder Client
- Swagger (documentação da API, quando configurado)

---

## 🏗️ Arquitetura do Sistema

O SATE utiliza uma arquitetura integrada, na qual o site e o aplicativo se comunicam com o mesmo backend.

Essa estrutura permite compartilhar informações entre as plataformas e manter os dados centralizados.

```mermaid
flowchart TD
    A["💻 Site Web - React"] --> C["⚙️ API REST - Node.js + Express"]
    B["📱 Aplicativo - Flutter"] --> C
    C --> D["🔗 Prisma ORM"]
    D --> E[("🗄️ Banco de Dados MySQL")]

    style A fill:#E6F7F0,stroke:#16A875,color:#005C45
    style B fill:#E7F3FC,stroke:#4EA5D9,color:#14486B
    style C fill:#D8F3E9,stroke:#005C45,color:#005C45
    style D fill:#FFF0F5,stroke:#E98BA8,color:#713F55
    style E fill:#E6F7F0,stroke:#16A875,color:#005C45
```

### 🔄 Integração entre plataformas

O site e o aplicativo compartilham os dados por meio de requisições HTTP à API REST.

**Exemplo de funcionamento:**

1. O treinador cadastra ou atualiza uma equipe pelo site.
2. O frontend envia os dados para o backend.
3. O backend valida as informações e utiliza o Prisma para acessar o MySQL.
4. Os dados são armazenados no banco.
5. O aplicativo consulta a mesma API e apresenta as informações atualizadas.

---

## 📁 Estrutura do Projeto

Organização de referência dos três módulos:

```text
SATE/
│
├── sate_web/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   ├── package.json
│   └── vite.config.ts
│
├── sate_app/
│   ├── lib/
│   │   ├── pages/
│   │   └── ...
│   ├── pubspec.yaml
│   └── ...
│
└── sate_backend/
    ├── prisma/
    │   └── schema.prisma
    │
    ├── src/
    │   ├── controllers/
    │   ├── routes/
    │   ├── services/
    │   ├── lib/
    │   └── server.js
    │
    ├── package.json
    └── .env
```

> Os módulos podem estar organizados em repositórios separados. A estrutura acima representa a organização geral do sistema.

---

## 🚀 Como executar o projeto

### Pré-requisitos

Antes de começar, instale:

- Node.js
- npm
- Flutter SDK
- MySQL
- Git
- Visual Studio Code (recomendado)

### 1. Configurando o Backend

Acesse a pasta do backend:

```bash
cd sate_backend
```

Instale as dependências:

```bash
npm install
```

Crie e configure o arquivo `.env`:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/sate"
JWT_SECRET="sua_chave_secreta"
PORT=3000
```

Configure o Prisma:

```bash
npx prisma generate
npx prisma migrate dev
```

Inicie o servidor:

```bash
npm run dev
```

> Confira os scripts disponíveis no `package.json` e as demais variáveis de ambiente exigidas pela versão atual do backend.

### 2. Executando o Site

Acesse a pasta do site:

```bash
cd sate_web
```

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

Acesse o endereço local informado pelo Vite.

### 3. Executando o Aplicativo

Acesse a pasta do aplicativo:

```bash
cd sate_app
```

Instale as dependências:

```bash
flutter pub get
```

Execute o aplicativo:

```bash
flutter run
```

Selecione o dispositivo desejado.

**Importante:** o endereço da API deve estar corretamente configurado para o ambiente utilizado. Em dispositivos físicos e emuladores, `localhost` pode não apontar para o computador que executa o backend.

---

## 🔌 API REST

O backend do SATE foi desenvolvido utilizando Node.js e Express, seguindo uma organização baseada em rotas, controllers e serviços.

### Principais módulos

| Módulo | Endpoint |
|---|---|
| Autenticação | `/api/auth` |
| Atletas | `/api/atletas` |
| Treinadores | `/api/treinador` |
| Usuários | `/api/usuario` |
| Equipes | `/api/equipes` |
| Partidas | `/api/partidas` |
| Vídeos | `/api/videos` |
| Dashboard | `/api/dashboard` |
| Configuração de Análise | `/api/configuracao-analise` |
| Recuperação de Senha | `/api/password` |
| Verificação do Servidor | `/api/health` |

### Métodos HTTP

A API utiliza os métodos HTTP conforme as operações disponíveis em cada recurso.

| Método | Finalidade |
|---|---|
| GET | Consultar informações |
| POST | Criar registros ou enviar dados |
| PUT | Atualizar registros |
| PATCH | Realizar atualizações parciais, quando implementadas |
| DELETE | Remover registros |

### Exemplos de requisições

**Consultar equipes**

```http
GET /api/equipes
```

**Consultar vídeos de uma partida**

```http
GET /api/partidas/:id/videos
```

**Enviar um vídeo para uma partida**

```http
POST /api/partidas/:id/videos
```

**Consultar marcações de vídeo**

```http
GET /api/videos/:videoId/marcacoes
```

Os endpoints podem exigir autenticação e parâmetros específicos.

---

## 🗄️ Banco de Dados

O banco de dados do SATE utiliza MySQL e Prisma ORM para realizar o gerenciamento e a persistência das informações.

### Principais entidades

| Entidade | Responsabilidade |
|---|---|
| Usuario | Cadastro, autenticação e informações de acesso |
| Treinador | Informações dos treinadores |
| Atleta | Dados e acompanhamento dos atletas |
| Equipe | Organização das equipes esportivas |
| Partida | Armazenamento de informações das partidas |
| VideoPartida | Vídeos associados às partidas |
| Marcações | Eventos identificados nos vídeos |
| ConfiguracaoAnalise | Personalização dos critérios de análise |
| PreferenciasUsuario | Preferências de notificações |

A modelagem completa está definida em:

```text
sate_backend/prisma/schema.prisma
```

### Prisma ORM

Para atualizar o Prisma Client:

```bash
npx prisma generate
```

Para verificar o schema:

```bash
npx prisma validate
```

Para aplicar migrações no ambiente de desenvolvimento:

```bash
npx prisma migrate dev
```

---

## 🔐 Segurança e autenticação

O SATE utiliza mecanismos de autenticação e controle de acesso para proteger as funcionalidades do sistema.

Entre os recursos estão:

- Autenticação com JWT
- Senhas protegidas por hash
- Validação de informações recebidas
- Controle de acesso por perfil
- Proteção de rotas autenticadas
- Recuperação de senha
- Gerenciamento das informações dos usuários

### Perfis de acesso

**Treinador**

Possui acesso aos recursos de administração esportiva, incluindo gerenciamento de equipes, atletas, partidas e análises.

**Atleta**

Possui acesso às informações relacionadas à sua rotina e evolução esportiva pelo aplicativo.

> O sistema prioriza o desenvolvimento individual e não apresenta rankings entre atletas.

---

## 🧪 Testes

A validação do SATE contempla diferentes tipos de verificação, conforme a implementação de cada módulo.

### Testes de API

Podem ser realizados utilizando Thunder Client e Swagger, quando configurado, verificando:

- Respostas HTTP
- Parâmetros de requisição
- Autenticação
- Validações
- Tratamento de erros
- Operações de cadastro e consulta

### Testes funcionais

Verificação das funcionalidades das interfaces do site e do aplicativo.

### Testes de integração

Verificação da comunicação entre:

- Site e backend
- Aplicativo e backend
- Backend e banco de dados

### Testes unitários

Verificação isolada de funções e regras de negócio, conforme a cobertura de testes implementada.

---

## 🎓 Contexto Acadêmico

O SATE foi desenvolvido como **Trabalho de Conclusão de Curso (TCC)** do curso Técnico em Desenvolvimento de Sistemas do SENAI Osasco.

O desenvolvimento envolveu conhecimentos de:

- Desenvolvimento Frontend
- Desenvolvimento Backend
- Desenvolvimento Mobile
- Banco de Dados Relacional
- APIs REST
- Modelagem de Sistemas
- Experiência do Usuário (UX/UI)
- Versionamento de Código
- Integração de Sistemas
- Testes de Software

---

## 👥 Equipe de Desenvolvimento

Projeto desenvolvido pela equipe **SATE**.

<!-- Adicionar nomes dos integrantes e links do GitHub. -->

---

## 📌 Status do Projeto

🚧 **Projeto acadêmico em desenvolvimento e validação.**

As funcionalidades apresentadas representam o escopo do sistema e podem variar conforme a versão implementada.

---

<div align="center">

### 💚 SATE
**Treinar. Acompanhar. Evoluir.**

*Tecnologia para transformar dados em evolução esportiva.*

</div>
