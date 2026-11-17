# SATE Mobile (sate_app)

Aplicativo Flutter do **SATE — Sistema de Acompanhamento e Treinamento Esportivo**, com os perfis de
**Atleta** e **Treinador**.

## Como executar

Pré-requisitos: [Flutter](https://docs.flutter.dev/get-started/install) (SDK compatível com o `pubspec.yaml`)
e um emulador ou aparelho.

```bash
cd sate_app
flutter pub get      # baixa as dependências (inclui as novas: pdf e printing)
flutter analyze      # verificação estática
flutter run          # executa no dispositivo/emulador selecionado
```

Para gerar uma versão de instalação: `flutter build apk` (Android) ou `flutter build ios` (iOS, em um Mac).

## Estrutura (resumo)

- `lib/sate/` — telas, dados e componentes atuais do aplicativo
  - `telas/` — telas (Início, Calendário, Atletas, Testes, Exercícios, Evolução, Configurações…)
  - `ui/` — componentes visuais (inclui `animacao_exercicio.dart`, a biblioteca de animações)
  - `relatorios/` — geração do relatório individual do atleta em PDF
  - `data/` — modelos e `SateStore`
- `lib/pages/` — login, cadastro, vínculo com equipe e navegação inicial
- `lib/services/` — serviços (API de autenticação, tema, acessibilidade, perfil)

O servidor (backend) não faz parte deste projeto e não foi alterado.

## Observações

- O relatório em PDF usa o pacote `printing`: no Android/iOS abre a visualização do sistema (imprimir/salvar) ou o
  menu de compartilhamento.
- Os detalhes das alterações desta versão estão em `ALTERACOES.md`.
