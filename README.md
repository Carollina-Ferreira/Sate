
<div align="center">

# 🏆 SATE

### Sistema de Acompanhamento e Treinamento Esportivo

**Treinar. Acompanhar. Evoluir.**

Plataforma integrada para gestão esportiva, análise de desempenho e acompanhamento da evolução de atletas.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)
![Dart](https://img.shields.io/badge/Dart-0175C2?style=for-the-badge&logo=dart&logoColor=white)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

---

[![Site](https://img.shields.io/badge/Acessar_Site-005C45?style=for-the-badge&logo=googlechrome&logoColor=white)](https://sateweb.vercel.app/)
[![Android](https://img.shields.io/badge/Baixar_App-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://github.com/Carollina-Ferreira/Sate/releases/download/lan%C3%A7amentos/SATE.apk)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://sate-backend.onrender.com/api-docs/)
[![PDF](https://img.shields.io/badge/Documentação_Técnica-E98BA8?style=for-the-badge&logo=readthedocs&logoColor=white)](./docs/Documentacao_Tecnica_SATE.pdf)

![Status](https://img.shields.io/badge/Status-Em_produção-16A875)
![Projeto](https://img.shields.io/badge/Projeto-TCC_SENAI-4EA5D9)
![Testes](https://img.shields.io/badge/Testes-466_aprovados-16A875)

</div>

---

## 📖 Sobre o projeto

O **SATE (Sistema de Acompanhamento e Treinamento Esportivo)** é uma plataforma desenvolvida como Trabalho de Conclusão de Curso (TCC) do curso Técnico em Desenvolvimento de Sistemas do SENAI Osasco.

O projeto tem como objetivo modernizar a gestão esportiva, conectando atletas e treinadores em um ambiente integrado para planejamento, organização e análise de desempenho.

A plataforma é composta por um site web, um aplicativo mobile e uma API REST, que compartilham o mesmo banco de dados.

O SATE prioriza a evolução individual dos atletas, sem estabelecer rankings entre eles.

---

## 🌐 Acesse o SATE

| Serviço | Acesso |
|---|---|
| 💻 Site Web | [Acessar plataforma](https://sateweb.vercel.app/) |
| 📱 Aplicativo Android | [Baixar SATE.apk](https://github.com/Carollina-Ferreira/Sate/releases/download/lan%C3%A7amentos/SATE.apk) |
| ⚙️ Backend | [API REST](https://sate-backend.onrender.com/) |
| 🔌 Swagger | [Documentação interativa da API](https://sate-backend.onrender.com/api-docs/) |
| 📄 Documentação Técnica | [Visualizar PDF](./docs/Documentacao_Tecnica_SATE.pdf) |
| 🟢 Health Check | [Status do servidor](https://sate-backend.onrender.com/api/health) |

> O aplicativo está disponível para instalação em dispositivos Android através do arquivo APK.

---

## ✨ Funcionalidades

| 💻 Site Web | 📱 App Treinador | 📱 App Atleta |
|---|---|---|
| Dashboard | Planejamento de treinos | Consulta de treinos |
| Gestão de equipes | Gestão de atletas | Calendário esportivo |
| Gestão de atletas | Biblioteca de exercícios | Convocações |
| Gestão de partidas | Controle de presença | Metas individuais |
| Análise de vídeos | Agenda esportiva | Avaliações físicas |
| Criação de clipes | Avaliações físicas | Evolução de desempenho |
| Estatísticas | Relatórios | Feedbacks |
| Comparações | Convocações | Histórico esportivo |
| Importação de planilhas | Notificações | Notificações |

### 🏅 Modalidades esportivas

Futebol • Basquete • Vôlei • Rugby • Handebol • Natação • Atletismo • Tênis

---

## 🛠️ Tecnologias utilizadas

| Camada | Tecnologias |
|---|---|
| Frontend | React, TypeScript, Vite e CSS Modules |
| Mobile | Flutter e Dart |
| Backend | Node.js, Express e JavaScript |
| Banco de dados | MySQL e Prisma ORM |
| Segurança | JWT e Bcrypt |
| Documentação | Swagger e OpenAPI 3.0.3 |
| Testes | Jest, Supertest e Thunder Client |
| Prototipagem | Figma |
| Versionamento | Git e GitHub |
| Automação | GitHub Actions |
| Hospedagem | Vercel, Render e Aiven |

---

## 🏗️ Arquitetura do sistema

O site e o aplicativo utilizam a mesma API REST, permitindo a centralização e o compartilhamento das informações.

```mermaid
flowchart TD
    A["💻 Site Web<br/>React / Vercel"]
    B["📱 Aplicativo<br/>Flutter / Dart"]
    C["⚙️ API REST<br/>Node.js / Render"]
    D["Prisma ORM"]
    E[("MySQL / Aiven")]
    F["Swagger"]

    A <-->|HTTPS| C
    B <-->|HTTPS| C
    C <--> D
    D <--> E
    F --- C

    style A fill:#E6F7F0,stroke:#16A875,color:#005C45
    style B fill:#E7F3FC,stroke:#4EA5D9,color:#14486B
    style C fill:#D8F3E9,stroke:#005C45,color:#005C45
    style D fill:#FFF0F5,stroke:#E98BA8,color:#713F55
    style E fill:#E6F7F0,stroke:#16A875,color:#005C45
    style F fill:#F0F8DC,stroke:#85B900,color:#405900
```

---

## 📁 Estrutura do projeto

```text
SATE/
├── docs/
│   └── Documentacao_Tecnica_SATE.pdf
│
├── sate_web/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── config/
│   └── package.json
│
├── sate_app/
│   ├── lib/
│   │   ├── pages/
│   │   └── services/
│   └── pubspec.yaml
│
├── sate_backend/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── server.js
│   ├── tests/
│   └── package.json
│
└── README.md
```

---

## 🚀 Como executar o projeto

### Clonar o repositório

```bash
git clone https://github.com/Carollina-Ferreira/Sate.git
cd Sate
```

### Backend

```bash
cd sate_backend
npm install
```

Configure o arquivo `.env`:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/sate"
JWT_SECRET="sua_chave_secreta"
PORT=3000
```

Configure as demais variáveis necessárias ao ambiente.

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Frontend Web

Em outro terminal, a partir da raiz do projeto:

```bash
cd sate_web
npm install
```

Configure o arquivo `.env.local`:

```env
VITE_API_URL=http://localhost:3000
```

Inicie o frontend:

```bash
npm run dev
```

### Aplicativo Flutter

Em outro terminal, a partir da raiz do projeto:

```bash
cd sate_app
flutter pub get
flutter run --dart-define=API_URL=https://sate-backend.onrender.com
```

### Gerar APK

```bash
flutter build apk --release --dart-define=API_URL=https://sate-backend.onrender.com
```

Arquivo gerado:

```text
build/app/outputs/flutter-apk/app-release.apk
```

> Nunca publique arquivos `.env`, senhas ou credenciais no repositório.

---

## 🔌 API REST

O backend foi desenvolvido com Node.js e Express, utilizando uma estrutura organizada em rotas, controllers, middlewares e Prisma ORM.

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
| Aplicativo | `/api/mobile` |
| Treinos | `/api/treinos` |
| Notificações | `/api/notificacoes` |

A API utiliza os métodos HTTP GET, POST, PUT, PATCH e DELETE, conforme as operações de cada recurso.

---

## 📚 Documentação

O projeto disponibiliza dois formatos de documentação:

| Documento | Descrição |
|---|---|
|[📄 Documentação Técnica](./Documentacao_Tecnica_SATE.pdf) | Requisitos, arquitetura, banco de dados, funcionalidades, segurança, testes e implantação |
| [🔌 Swagger — OpenAPI](https://sate-backend.onrender.com/api-docs/) | Documentação interativa dos endpoints da API REST |

O Swagger possui 36 caminhos documentados na versão validada, permitindo consultar parâmetros, métodos HTTP, respostas e realizar requisições.

---

## 🗄️ Banco de dados

O SATE utiliza MySQL, hospedado na plataforma Aiven, com gerenciamento realizado pelo Prisma ORM.

A modelagem consultada possui 26 modelos, organizados nos seguintes domínios:

- Usuários, atletas e treinadores.
- Equipes e partidas.
- Vídeos, marcações e anotações.
- Treinos, exercícios e presenças.
- Avaliações, metas e feedbacks.
- Documentos e notificações.

A modelagem completa está disponível em:

[`sate_backend/prisma/schema.prisma`](./sate_backend/prisma/schema.prisma)

---

## 🔐 Segurança

- Autenticação por JWT.
- Hash de senhas com Bcrypt.
- Controle de acesso por perfil.
- Proteção de rotas autenticadas.
- Validação de dados e arquivos.
- Recuperação de senha.
- Comunicação HTTPS.
- Gerenciamento de credenciais por variáveis de ambiente.

---

## 🧪 Testes e qualidade de software

O backend utiliza Jest e Supertest para a realização de testes automatizados.

### Resultados registrados

| Indicador | Resultado |
|---|---:|
| Suítes aprovadas | 59/59 |
| Testes aprovados | 466/466 |
| Statements | 90,81% |
| Branches | 83,00% |
| Functions | 99,04% |
| Lines | 91,94% |
| Cobertura mínima exigida | 80% |

![Statements](https://img.shields.io/badge/Statements-90.81%25-16A875)
![Branches](https://img.shields.io/badge/Branches-83.00%25-16A875)
![Functions](https://img.shields.io/badge/Functions-99.04%25-16A875)
![Lines](https://img.shields.io/badge/Lines-91.94%25-16A875)

A execução de 18/11/2026 superou a cobertura mínima exigida em todos os indicadores avaliados.

[📊 Visualizar execução no GitHub Actions](https://github.com/Carollina-Ferreira/Sate/actions/runs/44315924386)

### Executar os testes

```bash
cd sate_backend
npm install
npm run test:unit
npm run test:routes
npm run test:coverage
```

Caso necessário, instale as dependências de teste:

```bash
npm install --save-dev jest supertest
```

> Os resultados apresentados correspondem à execução registrada no GitHub Actions. Novas alterações no código devem ser acompanhadas de novas execuções dos testes.

---

## ☁️ Hospedagem

| Componente | Plataforma |
|---|---|
| Frontend Web | Vercel |
| Backend | Render |
| Banco de dados | Aiven |
| Aplicativo Android | GitHub Releases |
| Documentação da API | Swagger |
| Documentação Técnica | GitHub — PDF |
| Versionamento | GitHub |

---

## 👥 Equipe de desenvolvimento

| Integrantes |
|---|
| Carolina Ferreira Domingues |
| Manuely da Silva Viana |
| Maria Eduarda Bezerra da Silva |
| Nicoly Silva Rodrigues Souza |

### Professores

- Vitor Lima
- Jansen Killinger
- Danilo Sibov
- Luiz Henrique

**Instituição:** SENAI Osasco

**Curso:** Técnico em Desenvolvimento de Sistemas

**Projeto:** Trabalho de Conclusão de Curso — 2026

---

<div align="center">

## 💚 SATE

### Treinar. Acompanhar. Evoluir.

*Tecnologia para transformar dados em evolução esportiva.*

**Desenvolvido pela equipe SATE — SENAI Osasco, 2026.**

[![Site](https://img.shields.io/badge/SATE-Acessar_Plataforma-16A875?style=for-the-badge)](https://sateweb.vercel.app/)

</div>
