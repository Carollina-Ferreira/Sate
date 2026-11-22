# Integração SATE: Flutter + backend

## Branch de correções
As alterações devem ser revisadas e testadas na branch de correção antes de fazer merge em `develop`.

## Ajustes realizados
- `package.json` corrigido e dependências Swagger/Jest declaradas. O `package-lock.json` precisa ser atualizado executando `npm install` e commitando o resultado, antes de usar `npm ci`.
- Cadastro de novos atletas gera senha provisória aleatória por conta, em vez de senha universal conhecida. O endpoint continua retornando `senhaTemporaria` somente para o treinador no cadastro; trate o valor como credencial sensível.
- Snapshot mobile devolve apenas ID, equipe, nome, posição e avatar dos **colegas**. Dados completos continuam disponíveis para o próprio atleta e para seu treinador.
- Dados locais por usuário: publicações, documentos pessoais, plano, exercícios ocultados e tutorial são separados pela ID da conta. Dados antigos salvos sem identificação de usuário **não são carregados automaticamente** para evitar vazamento entre contas.
- Logout invalida o estado carregado e as requisições da sessão antiga não podem preencher a interface da nova sessão.
- Resposta HTTP 401 só encerra a sessão que iniciou aquela requisição.
- Na retomada do app, o JWT do treinador também é verificado com `/api/mobile/me`.
- O bypass de Turnstile usando chave embutida no aplicativo só é permitido fora de `NODE_ENV=production`, podendo ser desabilitado localmente com `ALLOW_MOBILE_CAPTCHA_BYPASS=false`. Para produção com Turnstile ativo, implementar autenticação mobile com proteção apropriada (por exemplo, atestação/controle de abuso no servidor); uma chave distribuída no APK não pode ser tratada como segredo.

## Executar testes
No diretório `sate_backend`:

```bash
npm install
npx prisma generate
npm run test:coverage
```

Para teste de integração REAL, suba API e **banco de desenvolvimento migrado** (o script cria registros de teste e não os remove):

```bash
npm run test:integracao
```

A variável `BASE_URL` altera a URL de destino. Se o Turnstile estiver ativo, testes de cadastro precisam usar ambiente de testes sem desafio ou integração de desafio válida.

No diretório `sate_app`:

```bash
flutter pub get
flutter analyze
flutter test
flutter run --dart-define=API_URL=http://10.0.2.2:3000
```

Para celular físico, substitua `API_URL` pelo IP local acessível do computador rodando a API. Em produção, use URL HTTPS pública.

## Pendente / fora do escopo destas correções
- Comunidade ainda é armazenamento local, sem API de publicações.
- O cadastro de documentos pela rota `/api/documentos` registra metadados, não o arquivo PDF. Upload binário precisa de fluxo próprio no app.
- O `package-lock.json` deve ser atualizado e versionado com as dependências declaradas.
- Build de APK/iOS, integração ponta a ponta com banco e teste físico do app não são substituídos por Jest/Flutter analyze.

## Alerta: migrações históricas
O teste com MySQL vazio descobriu que `20261016100000_adicionar_marcacoes_video` tenta referenciar `VideoPartida` antes de a tabela ser criada. Por isso, `prisma migrate deploy` falha ao montar um banco novo a partir de zero. **Não modificar o SQL de migrações já aplicadas no banco real sem um plano de reconciliação.** Para os testes de API em banco descartável, o CI usa `prisma db push` para criar as tabelas diretamente a partir de `schema.prisma`. Isso valida o comportamento da API, mas **não valida o histórico de migrações**.
