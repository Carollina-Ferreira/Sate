# SATE Mobile — integração com a API

O app **não tem mais dados de demonstração**: tudo vem do backend do SATE (Node/Express/Prisma/MySQL), o mesmo que o site usa.

## Endereço da API (não fica fixo no código)

Defina ao rodar/compilar com `--dart-define`:

| Onde o app roda | Comando |
|---|---|
| Emulador Android | `flutter run` (padrão: `http://10.0.2.2:3000`) |
| iOS Simulator / Windows / Web | `flutter run` (padrão: `http://localhost:3000`) |
| **Celular físico** (mesma rede Wi‑Fi do PC) | `flutter run --dart-define=API_URL=http://IP_DO_PC:3000` |
| Produção | `flutter build apk --dart-define=API_URL=https://api.seudominio.com` |

* `localhost` dentro do emulador/celular é **o próprio aparelho**, não o seu computador — por isso não funciona para Android.
* `10.0.2.2` é o endereço especial do emulador Android que aponta para o computador que o executa.
* No celular físico use o IP do PC na rede (`ipconfig` no Windows / `ifconfig` no Linux e macOS; ex.: `192.168.0.10`) e libere a porta 3000 no firewall.
* Se o site usa captcha (Turnstile), adicione `--dart-define=MOBILE_APP_KEY=<mesma chave do .env do backend>`.
* Release: use **https**. HTTP em texto puro só é permitido nos builds de debug/profile (Android) e em rede local (iOS).

## Estrutura

```
lib/services/api_config.dart   URL base e chave do app (dart-define)
lib/services/sessao.dart       token JWT (flutter_secure_storage) + dados do usuário
lib/services/api_client.dart   cliente HTTP: token automático, JSON, timeout, erros, 401 -> login
lib/services/sate_api.dart     chamadas agrupadas por funcionalidade
lib/sate/data/sate_store.dart  estado do app = cache em memória do /api/mobile/snapshot
lib/pages/sessao_gate.dart     retoma a sessão ao abrir o app e decide a tela inicial
```

## Como os dados ficam sincronizados

1. Ao entrar, o app chama `GET /api/mobile/snapshot` e `GET /api/notificacoes`.
2. Toda alteração (treino, presença, teste, meta…) é enviada à API; depois o app recarrega o snapshot.
3. Atualização automática a cada **45 s** e ao voltar para o app (mudanças do site chegam sem reabrir).
4. Não há WebSocket nem push (FCM) — ver "Pendências".

## Fluxos

* **Login**: mesmo `/api/auth/login` do site (token JWT). Atleta com equipe → app; sem equipe → tela de código/QR. Treinador → suas equipes reais.
* **Atleta cadastrado pelo site**: entra com o e-mail e a senha temporária definida pelo backend.
* **Equipes**: criadas no site aparecem no app. O treinador toca na equipe (Perfil → Equipes) para ver/renovar o **código de convite** e definir **dias, horário e local** dos treinos recorrentes.
* **Atleta entra por código/QR**: `POST /api/equipes/entrar` (respeita as regras: uma equipe por vez, um treinador).
* **Treinos recorrentes**: gerados a partir da agenda da equipe; alterar/cancelar um dia grava um treino com `padraoChave`.
* **Notificações**: lidas de `/api/notificacoes` (atleta e treinador); marcar como lida persiste no servidor.

## Equipe ativa (filtro) e foto da equipe (v0.4.1)

* O treinador escolhe a equipe na tela inicial; `SateStore.equipeAtivaId` guarda o **ID real** e `sate/data/escopo_equipe.dart` filtra atletas, treinos, eventos e documentos. Menu lateral → *Trocar de equipe*.
* A foto vem de `GET /api/equipes` (campo `imagem`, o mesmo que o site grava) e é exibida por `sate/ui/foto_equipe.dart`; sem foto, o ícone padrão.

## Pendências (não integrado — avisado de forma explícita)

* **Comunidade (feed)**: o backend não tem tabela de publicações; o feed é **local ao aparelho**, sem posts de exemplo.
* **Documentos pessoais do treinador**: locais ao aparelho (a tabela `Documento` é por atleta). Documentos de atletas vão para a API (somente metadados; o envio de arquivo PDF continua pelo site).
* **Planos/limite**: apenas visual.
* **Remover foto de perfil**: o backend não oferece; só limpa neste aparelho. Enviar foto funciona.
* **Cadastro de atleta**: continua no site (exige e-mail e gera senha temporária).
* **Partidas, estatísticas de partida e vídeos**: existem no backend/site, mas o app não possui telas para isso; nada foi inventado.
* **Push notifications (FCM)** e tempo real por WebSocket: não configurados.

## Rodar

```
flutter pub get      # baixa também flutter_secure_storage e http_parser (novos)
flutter run          # veja a tabela acima para a URL
```

> Aviso honesto: este código foi validado quanto a **sintaxe** (Dart 3.14, `dart format`) e a API foi testada de ponta a ponta,
> mas o app **não foi compilado nem executado** num emulador/aparelho (sem Flutter SDK/pub.dev no ambiente de desenvolvimento).
> Rode `flutter pub get && flutter analyze` e corrija eventuais avisos/erros de tipo antes de publicar.
