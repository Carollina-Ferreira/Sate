
<div align="center">

# 🏆 SATE
### Sistema de Acompanhamento e Treinamento Esportivo

**Treinar. Acompanhar. Evoluir.**

Plataforma integrada para gestão esportiva, análise de desempenho e acompanhamento da evolução de atletas.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

[![Site](https://img.shields.io/badge/Acessar_Site-005C45?style=for-the-badge&logo=googlechrome&logoColor=white)](https://sateweb.vercel.app/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://sate-backend.onrender.com/api-docs/)
[![Android](https://img.shields.io/badge/Aplicativo-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://github.com/Carollina-Ferreira/Sate/releases)

![Status](https://img.shields.io/badge/Status-Em_produção-16A875)
![Projeto](https://img.shields.io/badge/Projeto-TCC_SENAI-E98BA8)

</div>

---

## 📖 Sobre o projeto

O **SATE** é uma plataforma desenvolvida como Trabalho de Conclusão de Curso (TCC) do Técnico em Desenvolvimento de Sistemas do SENAI Osasco.

Seu objetivo é modernizar a gestão esportiva, conectando atletas e treinadores em um ambiente integrado para planejamento, organização e análise de desempenho.

O sistema é composto por um site web, um aplicativo mobile e uma API REST, que compartilham o mesmo banco de dados.

O SATE prioriza a evolução individual, sem estabelecer rankings entre atletas.

---

## 🌐 Acesse o SATE

| Serviço | Acesso |
|---|---|
| 💻 Site Web | [Acessar plataforma](https://sateweb.vercel.app/) |
| 📱 Aplicativo Android | [GitHub Releases](https://github.com/Carollina-Ferreira/Sate/releases) |
| ⚙️ Backend | [API REST](https://sate-backend.onrender.com/) |
| 📚 Swagger | [Documentação da API](https://sate-backend.onrender.com/api-docs/) |
| 🟢 Health Check | [Status do servidor](https://sate-backend.onrender.com/api/health) |

> O APK foi compilado para Android. O download depende da publicação da versão no GitHub Releases.

---

## ✨ Funcionalidades

| 💻 Site Web | 📱 App Treinador | 📱 App Atleta |
|---|---|---|
| Dashboard | Planejamento de treinos | Acompanhamento de treinos |
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
| Hospedagem | Vercel, Render e Aiven |

---

## 🏗️ Arquitetura do sistema

O site e o aplicativo utilizam a mesma API REST, permitindo a centralização e o compartilhamento das informações.

```mermaid
flowchart TD
    A["Site Web - React / Vercel"] <-->|HTTPS| C["API REST - Node.js / Render"]
    B["Aplicativo - Flutter"] <-->|HTTPS| C
    C <--> D["Prisma ORM"]
    D <--> E[("MySQL - Aiven")]
    F["Swagger"] --- C

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
│   │   ├── services/
│   │   └── sate/
│   └── pubspec.yaml
│
├── sate_backend/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── config/
│   │   └── server.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Como executar

### Clonar o repositório

```bash
git clone https://github.com/Carollina-Ferreira/Sate.git
cd Sate
```

### Backend

```bash
cd sate_backend
npm install
npx prisma generate
npm run dev
```

Configure o arquivo `.env` antes de iniciar:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/sate"
JWT_SECRET="sua_chave_secreta"
PORT=3000
```

Configure também as demais variáveis exigidas pelo backend. Para um banco local de desenvolvimento, aplique as migrações com `npx prisma migrate dev`.

### Frontend

Em outro terminal, a partir da raiz do projeto:

```bash
cd sate_web
npm install
npm run dev
```

Configure o arquivo `.env.local`:

```env
VITE_API_URL=http://localhost:3000
```

### Aplicativo

Em outro terminal, a partir da raiz:

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

---

## 🔌 API REST e Swagger

A API foi desenvolvida com Express, utilizando rotas, controllers, autenticação JWT e Prisma ORM.

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
| Aplicativo | `/api/mobile` |
| Treinos | `/api/treinos` |
| Notificações | `/api/notificacoes` |

A documentação Swagger possui **36 caminhos de API documentados**, permitindo consultar e testar requisições HTTP.

📚 **[Acessar documentação completa](https://sate-backend.onrender.com/api-docs/)**

---

## 🗄️ Banco de dados

O SATE utiliza MySQL, hospedado na plataforma Aiven, com gerenciamento realizado pelo Prisma ORM.

Principais entidades:

- Usuário, Atleta e Treinador.
- Equipe e Partida.
- Vídeos e Marcações.
- Treinos, Exercícios e Presenças.
- Avaliações, Metas e Feedbacks.
- Documentos e Notificações.

A modelagem está disponível em `sate_backend/prisma/schema.prisma`.

---

## 🔐 Segurança

- Autenticação por JWT.
- Hash de senhas com Bcrypt.
- Controle de acesso por perfil.
- Proteção de rotas.
- Validação de dados.
- Recuperação de senha.
- Comunicação HTTPS.
- Variáveis de ambiente.

---

## 🧪 Testes

O projeto utiliza testes unitários, testes de rotas, testes de integração e validação funcional.

### Backend — Jest

```bash
npm test
npm run test:unit
npm run test:routes
npm run test:coverage
```

### Frontend — TypeScript e Vite

```bash
npx tsc -b
npm run build
```

### Aplicativo — Flutter

```bash
flutter analyze
flutter test
```

Os resultados de cobertura podem ser consultados no relatório gerado pelo Jest.

---

## ☁️ Hospedagem

| Componente | Plataforma |
|---|---|
| Frontend Web | Vercel |
| Backend | Render |
| Banco de dados | Aiven |
| Aplicativo | APK Android |
| Documentação | Swagger |
| Código-fonte | GitHub |

---

## 👥 Equipe de desenvolvimento

- Carolina
- Eduarda
- Manuela
- Nicoly

**Instituição:** SENAI Osasco  
**Curso:** Técnico em Desenvolvimento de Sistemas  
**Projeto:** Trabalho de Conclusão de Curso — 2026

---

<div align="center">

### 💚 SATE

**Treinar. Acompanhar. Evoluir.**

*Tecnologia para transformar dados em evolução esportiva.*

Desenvolvido pela equipe SATE — SENAI Osasco, 2026.

</div>
