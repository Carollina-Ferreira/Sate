## Expansão da cobertura (18/11/2026)
Foram acrescentados arquivos com cenários adicionais de testes para atletas, equipes, partidas, vídeos e JWT. Eles verificam caminhos de autorização, resultados vazios, erros de banco, campos inválidos, criação de clipes e anotações, e uso dos mocks Prisma.

A cobertura anterior de **15,27% (Stmts)** é apenas a linha de base informada antes da ampliação. É necessário **executar novamente** `npm run test:coverage` no computador com dependências instaladas para obter a porcentagem real e localizar falhas.

Os novos testes foram escritos após leitura dos controllers da branch `develop`, mas ainda exigem validação de execução no projeto real. Não afirmar que passaram sem conferir o Jest.
