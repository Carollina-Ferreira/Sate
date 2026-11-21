# Integração do aplicativo mobile — backend

Este backend atende **o site e o aplicativo Flutter com o mesmo banco MySQL e o mesmo JWT**.
Nada foi migrado nem duplicado: as rotas do site continuam iguais.

## O que foi adicionado

Todas exigem `Authorization: Bearer <token>` (o mesmo token de `POST /api/auth/login`).

| Rota | Quem usa | Para quê |
|---|---|---|
| `GET /api/mobile/me` | ambos | Sessão: usuário e perfil (atleta/treinador) |
| `GET /api/mobile/snapshot` | ambos | Tudo que o usuário pode ver (equipes, atletas, treinos, agenda, presenças, testes, metas, feedbacks, documentos), já filtrado por permissão |
| `GET/PUT /api/atletas/me` | atleta | Ver/editar o próprio perfil (nome, telefone, posição, altura, peso, sexo, nascimento) |
| `GET /api/equipes/minhas` | atleta | Equipe do atleta |
| `POST /api/equipes/entrar` `{codigo}` | atleta | Entrar na equipe pelo código/QR |
| `GET/POST /api/equipes/:id/codigo` | treinador | Ler / renovar código de convite |
| `PUT /api/equipes/:id/agenda` | treinador | Dias, horário e local dos treinos recorrentes |
| `POST/PUT/DELETE /api/exercicios` | treinador | Biblioteca de exercícios |
| `GET/POST/PUT/DELETE /api/treinos` | treinador escreve; atleta lê os seus | Treinos (inclui cancelar/alterar sessão recorrente via `padraoChave`) |
| `GET/POST/PUT/DELETE /api/eventos` | treinador escreve; atleta lê | Jogos, avaliações, reuniões, lembretes |
| `GET/PUT /api/presencas` | treinador escreve; atleta lê a sua | Frequência |
| `GET/POST/DELETE /api/testes` | ambos (atleta só os seus) | Testes físicos / evolução |
| `GET/POST/PUT/DELETE /api/metas` | treinador escreve; atleta lê | Metas |
| `GET/POST/DELETE /api/feedbacks` | treinador escreve; atleta lê | Feedbacks |
| `GET/POST/PUT/DELETE /api/documentos` | ver tabela de permissões abaixo | Metadados de documentos |
| `PUT /api/usuarios/senha` | ambos | Trocar a própria senha |
| `PUT /api/mobile/perfil-profissional` | treinador | Formação, registro profissional e experiência (devolvidos no `snapshot`) |
| `GET /api/notificacoes`, `PATCH /api/notificacoes/:id/lida`, `PATCH /api/notificacoes/lidas` | ambos | **Mesmas URLs do site.** Para atletas leem a tabela `NotificacaoAtleta`; para treinadores o comportamento original foi mantido |

Permissões: o atleta só acessa os próprios dados; o treinador só os dos seus atletas/equipes.
Documentos: o atleta pode **enviar** (fica pendente) e remover o que ainda não foi aprovado; só o treinador aprova.

## Correção de bug do backend original

`atletaController` importava `sincronizarNotificacaoCadastroAtleta` de `notificacaoService`, mas a função **não existia**,
então `POST /api/atletas` e `PUT /api/atletas/:id` respondiam erro 500 (inclusive no site). Foi implementada em
`src/services/notificacaoService.js`.

## Banco de dados (Prisma) — alterações ADITIVAS

Migrations (aplicar NESTA ORDEM):
1. `prisma/migrations/20261101090000_integracao_mobile/migration.sql`
2. `prisma/migrations/20261102090000_perfil_profissional_treinador/migration.sql` (3 colunas nulas em `Treinador`)

* Novas colunas **nulas/com padrão**: `Atleta.posicao/alturaCm/pesoKg`, `Equipe.codigoConvite/local/diasTreino/inicioMin/duracaoMin`,
  `Documento.categoria/validade/aprovado/obs` (documentos existentes ficam `aprovado = true`).
* Novas tabelas: `Exercicio`, `Treino`, `TreinoAtleta`, `Presenca`, `TesteFisico`, `EventoAgenda`, `MetaAtleta`, `FeedbackAtleta`, `NotificacaoAtleta`.
* Nenhum `DROP`, `DELETE`, `RENAME` ou `reset`.

### Como aplicar com segurança

1. **Faça backup do banco** (`mysqldump -u USUARIO -p NOME_DO_BANCO > backup.sql`).
2. `npm install`
3. Veja o estado: `npx prisma migrate status`
   * Se disser que o banco está em dia / só falta a nova migration → `npx prisma migrate deploy`.
   * Se reclamar de histórico divergente ou migrations antigas "não aplicadas" (as migrations antigas do projeto **não cobrem todas as tabelas atuais**, o banco
     provavelmente foi criado com `db push`), **não use** `migrate reset` nem `db push --force-reset`. Aplique só o SQL novo:
     `mysql -u USUARIO -p NOME_DO_BANCO < prisma/migrations/20261101090000_integracao_mobile/migration.sql`
     e depois marque como aplicada: `npx prisma migrate resolve --applied 20261101090000_integracao_mobile`.
4. `npx prisma generate`
5. `npm run dev` (ou `npm start`)

## Teste de integração

Com o servidor rodando num banco **de desenvolvimento**:

```
BASE_URL=http://localhost:3000 npm run test:integracao
```

Cria registros `teste.*@sate.test`. O limitador de login do backend (10 tentativas/15 min por IP) pode bloquear execuções repetidas — reinicie o servidor entre uma execução e outra.

## Captcha (Turnstile)

Se `TURNSTILE_SECRET_KEY` estiver definida, o app precisa do bypass: defina `MOBILE_APP_KEY` no `.env` e use o **mesmo valor** no app
(`--dart-define=MOBILE_APP_KEY=...`). O app envia o cabeçalho `X-SATE-App-Key`. Sem `MOBILE_APP_KEY` no servidor, o bypass não existe.

## Pasta `uploads/`

Este ZIP **não inclui** o conteúdo de `uploads/` (vídeos, PDFs e fotos de usuários — mais de 100 MB). Mantenha a sua pasta atual;
as subpastas vazias foram incluídas só para a estrutura.
