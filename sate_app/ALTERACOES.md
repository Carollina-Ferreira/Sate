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
