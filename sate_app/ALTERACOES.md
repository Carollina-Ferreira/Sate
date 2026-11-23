# v0.4.1 — Fotos das equipes e filtro por equipe

* **Foto da equipe:** o app agora exibe a foto cadastrada no site (campo `imagem` de `GET /api/equipes`, que o app descartava). Sem foto, continua o ícone padrão. Atualiza ao abrir a tela de equipes e ao voltar para o app.
* **Filtro por equipe:** ao escolher uma equipe, o app inteiro passa a mostrar SÓ os atletas, treinos, eventos e documentos dela (filtro pelo ID real, em `sate/data/escopo_equipe.dart`). Menu lateral → **Trocar de equipe**. A escolha fica salva ao reabrir o app.
* Teste da regra: `dart run test/escopo_equipe_test.dart`.
* A versão exibida em "Sobre" estava desatualizada (0.3.0); agora acompanha o `pubspec.yaml`.

---

# v0.4.0 — Integração com o backend

O app passou a consumir a API real do SATE e os dados de demonstração foram removidos. Veja `INTEGRACAO_API.md`.

* Corrigido: `pubspec.yaml` tinha a chave `version` duplicada; `atleta_vinculo_page.dart` tinha um parêntese sobrando (erro de compilação).
* Novos pacotes: `flutter_secure_storage`, `http_parser`.

---

# SATE Mobile — v0.3.0+4 (continuação da v0.2.1+3 · somente front-end Flutter)

Backend, banco, APIs, rotas e logins **não foram alterados**. Depois de abrir o projeto, rode `flutter pub get`
(duas dependências novas: `pdf` e `printing`).

## Treinador
- **Botão "Novo atleta" removido** da lista de atletas (`sate/telas/atletas_page.dart`). A busca ocupa a linha inteira.
  A função de cadastro continua existindo para outras partes do app.
- **Relatório individual em PDF:** na tela de perfil de cada atleta, botão **"Exportar relatório em PDF"** → visualizar/imprimir/salvar ou
  compartilhar (`sate/relatorios/relatorio_atleta_pdf.dart`). Conteúdo, sempre do atleta aberto e só com dados reais do app:
  identificação (nome, posição, idade, altura, peso, e-mail), equipe/modalidade/local, resumo (assiduidade, últimos 30 dias, índice físico),
  frequência mensal (gráfico de barras dos últimos 6 meses), perfil físico por categoria, resultados dos testes (último, melhor marca,
  evolução), histórico de avaliações, atividades recentes, metas, feedbacks e documentação. Seções sem registros informam que não há dados.
  O app não registra estatísticas de jogo (gols, pontos etc.); por isso não há essa seção.

## Atleta
- **Registro dos próprios testes:** o atleta agora registra resultados com o **mesmo formulário do treinador** (`registrarTeste`,
  com `atletaFixo`): botão **"Registrar novo teste"** na Evolução, botão **+** na tela de Testes, e botão "+" na lista de testes embutida.
  O resultado é sempre gravado para o atleta logado (não há escolha de outro atleta). O atleta vê o histórico (até 10 registros),
  a evolução por teste e pode remover os **próprios** registros.
- **Home: dias arrastáveis.** A faixa "Minha semana" rola horizontalmente (60 dias antes e depois de hoje). Tocar em um dia seleciona;
  o dia escolhido atualiza o cartão do treino, a lista de exercícios, o texto da semana e a data do topo. "Voltar para hoje" reaparece
  quando outro dia está selecionado (`sate/telas/inicio_atleta.dart`).

## Gerais
- **Calendários sem "Pendente":** removida a legenda, o marcador de anel e a pílula de status. Eventos e treinos continuam como antes.
  Os textos do tutorial foram ajustados.
- **Animações em todos os exercícios:** nova biblioteca reutilizável (`sate/ui/animacao_exercicio.dart`) com 16 movimentos
  (polichinelo, elevação de joelhos, agachamento, afundo, salto, salto na caixa, prancha, flexão, abdominal, corrida, tiro, escada de agilidade,
  toque e manchete, saque, condução de bola e mobilidade de quadril). Cada exercício do app usa seu movimento; os criados pelo treinador
  recebem o movimento pelo nome ou, se não houver correspondência, pelo grupo — assim **nenhum exercício fica sem animação**.
  O seletor de animação do treinador (`videosDemo`) agora oferece as 16 opções. Respeita "reduzir animações".
- **Deslizar entre as abas (Atleta e Treinador):** `PageView` na estrutura principal (`sate/telas/casca_sate.dart`). A barra inferior
  continua fixa e sincronizada. Cada perfil só desliza entre as próprias abas. Rolagens horizontais internas têm prioridade.
- **Entrar em equipe / código:** removida a ilustração decorativa (círculos e linha com bolinhas) das telas de vínculo do atleta e do treinador
  (`pages/Atleta/atleta_vinculo_page.dart`, `pages/Treinador/treinador_equipes_page.dart`, `pages/Treinador/treinador_vinculo_page.dart`).
  A tela do atleta foi reorganizada (cartão único com campo, botão e QR Code; passos logo abaixo). Vincular por código e por QR Code continuam iguais.
- **Sobre o app:** removida a seção "Telas da versão anterior" (e seus imports); versão exibida: 0.3.0 (4).
- **Notificações:** título "Notificaçõ" + **"es"** em itálico, sem espaço entre as partes (novo parâmetro `colado` em `Tela`/`CabecalhoTela`).

- **Calendário sem cores repetidas:** cada tipo de evento ganhou cor própria (`corTipoEv`, `ui/cores.dart`): **Jogo = azul**, **Avaliação = âmbar**,
  **Reunião = violeta**, **Lembrete = ardósia**. Antes, Jogo repetia o rosa de "Não realizado", Lembrete repetia a cor de "Sem treino" e Avaliação era um verde
  parecido com "Realizado". Presença continua: verde = realizado, rosa = não realizado, cinza claro = sem treino. O contorno do dia de hoje deixou de ser rosa (igual a "não realizado") e passou a ser neutro. Vale para o calendário, a legenda, os detalhes
  do evento e a Home do treinador (mesma função de cor).

## Verificação
Não foi possível executar `flutter pub get`, `flutter analyze` nem compilar neste ambiente (o SDK não pôde ser baixado). Foi feita
checagem de sintaxe dos arquivos alterados e revisão manual dos nomes e assinaturas usados. **Rode `flutter pub get` e `flutter analyze` antes de publicar.**

---

# SATE Mobile — Ajustes finais de interface (somente front-end) · v0.2.1+3

Sem backend, banco, APIs ou regras de negócio alterados.
Depois de abrir o projeto, rode `flutter pub get` (o `image_picker` passou de dev_dependencies para dependencies).

## 1. Área de evolução (versão anterior recuperada)
- **Atleta · aba Evolução** (`sate/telas/evolucao_atleta.dart`): volta a organização da antiga tela "Minha evolução":
  cabeçalho "Acompanhe sua evolução" → período (Todos/Mês/Ano) → Seu desempenho → Frequência mensal → Treinos realizados / Metas atingidas →
  Avaliação física (condição geral, VO2 Máx, IMC, gordura corporal) → Últimas avaliações → Histórico recente → Relatórios (Semanal/Mensal/Anual).
  Valores calculados com os dados do app. Mantidos no fim: metas e feedbacks recebidos. "Ver detalhes" abre os testes por teste.
- **Treinador · perfil do atleta, aba Resumo:** volta o bloco antigo Resumo (Frequência/Modalidade) + Desempenho ("Evolução geral", % e barra "Desempenho atual").
- Gordura corporal aparece como "Não avaliado" (não há esse teste cadastrado). "Exportar relatório" avisa que ainda não está disponível.

## 2. Modo escuro e gradientes
- Paleta escura mais fechada e suave (verde menos neon, rosa mais discreto).
- Gradientes removidos por completo dos cards da Home, do Perfil, planos, vídeo, miniaturas de exercício, tutorial e gaveta (cores sólidas).
- Restam apenas: fundo decorativo (no escuro, verdes profundos com mínimo de rosa) e o leve preenchimento sob as linhas dos gráficos.

## 3. Header
- Estrutura mantida; agora só uma linha fina e sutil (cor de borda do tema) separa cabeçalho e conteúdo; barra um pouco menor.

## 4–5. Perfil e configurações
- Cabeçalho do perfil em cor sólida.
- Nova área **Configurações do perfil** (engrenagem no topo e item no fim do perfil), para treinador e atleta:
  - **Informações pessoais:** nome e e-mail (tipo de conta somente leitura), com validação.
  - **Alterar senha:** senha atual, nova (mín. 6) e confirmação, com mostrar/ocultar em cada campo.
  - **Foto de perfil:** escolher da galeria, prévia, alterar, remover e salvar. A foto é guardada **neste aparelho**.

## O que falta para funcionar no servidor (nada é "salvo de mentira")
O servidor só tem `POST /api/auth/login`, `/api/auth/cadastro` e `/api/password/esqueci-senha`, e o login não devolve token. Por isso:
- **Nome/e-mail** e **senha**: a tela valida e, ao salvar, informa que a operação ainda não está disponível e nada é alterado. Precisa de: sessão autenticada (token no login), rota de atualização de dados (ex.: `PUT /api/usuarios/:id`) e rota de troca de senha (ex.: `PUT /api/usuarios/:id/senha`).
- **Foto no servidor:** precisa de rota de envio de imagem. Hoje fica só no aparelho.
- Ponto único para ligar tudo: `lib/services/perfil_service.dart` (mude `disponivel` para `true` ao implementar as chamadas).
- iOS: adicionada a permissão de fotos em `ios/Runner/Info.plist`.

## Principais arquivos modificados
`lib/sate/ui/{cores,fundo,tela,widgets}.dart`, `lib/sate/data/sate_store.dart`, `lib/sate/telas/{casca_sate,inicio_treinador,inicio_atleta,perfil_sate_page,config_perfil_pages,evolucao_atleta,atletas_page,hubs,testes_page,planos_page,tutorial_page,video_demo,exercicios_page,configuracoes_pages}.dart`, `lib/services/perfil_service.dart`, `pubspec.yaml`, `ios/Runner/Info.plist`.
