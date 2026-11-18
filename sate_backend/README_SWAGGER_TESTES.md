# SATE — Swagger tradicional + testes Jest

Implementação baseada na branch `develop` do repositório em 18/11/2026.

## 1. Ferramentas

- **swagger-jsdoc:** lê os comentários `@swagger` escritos manualmente em cada arquivo de rotas.
- **swagger-ui-express:** exibe a interface web de documentação.
- **Jest:** executa testes unitários dos controllers, com dependências simuladas.
- **Supertest:** exercita os endpoints Express com controllers simulados, sem acessar MySQL.

## 2. Instalar dependências

No terminal, entre na pasta `sate_backend`:

```bash
npm install swagger-jsdoc swagger-ui-express
npm install --save-dev jest supertest
```

**Esses comandos também atualizam o package-lock.json.** Antes de rodar `npm ci` em outro computador, salve o arquivo de lock atualizado.

## 3. Swagger — interface

```bash
npm run dev
```

Abra **http://localhost:3000/api-docs**.

Para testar operações protegidas, entre em `POST /api/auth/login`, copie o token JWT do login e clique em **Authorize**.

A documentação fica nos próprios arquivos `src/routes/*.js`. O arquivo `src/config/swagger.js` apenas configura a leitura, e o `server.js` monta a interface. O campo `openapi: '3.0.3'` é o padrão que o Swagger usa; não é um gerador externo.

**Atenção:** parâmetros complexos das rotas foram descritos inicialmente com esquemas básicos. Consulte o controller antes de enviar um payload real — os modelos OpenAPI detalhados, regras de obrigatoriedade e códigos retornados ainda precisam de revisão contratual.

## 4. Testes

```bash
npm test
npm run test:unit
npm run test:routes
npm run test:coverage
```

- `tests/unit`: validações e regras selecionadas dos 16 controllers.
- `tests/routes`: 55 operações HTTP descritas em 15 módulos, com verificação do roteamento. Também verificam que rotas protegidas exigem autenticação. Os controllers são substituídos por mocks.
- `tests/helpers/resposta.js`: simula `res.status()` e `res.json()`.

O Jest executa os testes unitários **sem banco de dados real**. Isso não demonstra que a API real se conectou ao MySQL nem substitui os testes de integração completos com dados reais.

## 5. Como explicar na apresentação

**Exemplo de Swagger:** abra `src/routes/atletaRoutes.js`, mostre o comentário `@swagger` de `GET /api/atletas`, depois exiba o mesmo endpoint na UI.

**Exemplo de teste unitário:** abra `tests/unit/atletaController.test.js`, aponte `mockResolvedValue(null)` e explique: "simulamos um treinador inexistente, executamos o controller e verificamos se ele retorna HTTP 401". Em seguida rode `npm run test:unit`.

**Exemplo de teste HTTP:** abra `tests/routes/atletaRoutes.test.js` e explique que Supertest chama o Express, enquanto o middleware e os controllers são simulados. Esse teste mede roteamento e aplicação do middleware configurado no teste — não acesso ao banco.

## 6. Limitações e checklist de revisão

- Os testes foram adicionados ao código, mas **ainda não foram executados com todas as dependências instaladas** no ambiente do SATE. Não declare porcentagem de cobertura ou aprovação sem rodar `npm run test:coverage`.
- Há 55 operações de rota documentadas, mas não há 55 controllers diferentes. Cada operação da API foi incluída nos testes HTTP.
- Os testes unitários existentes exercitam algumas regras por controller; para garantir cobertura total de todos os métodos, cenários de sucesso, falhas, permissões, filtros, upload e serviços, é necessário ampliar os testes e analisar o relatório de cobertura.
- A branch adiciona `/api/header` ao `server.js`, porque o arquivo `headerRoutes.js` existia, mas não estava montado na `develop`.
- Confira se sua versão local tem alterações posteriores. Não mescle automaticamente em `main` sem revisão.
