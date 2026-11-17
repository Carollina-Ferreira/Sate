import 'package:flutter/material.dart';

import '../../services/acessibilidade_controller.dart';
import '../../services/tema_controller.dart';
import '../data/sate_store.dart';
import '../ui/cores.dart';
import '../ui/tela.dart';
import '../ui/widgets.dart';
import 'tutorial_page.dart';

const String versaoApp = '0.3.0';
const String buildApp = '4';

// ───────────────────────── Tema (somente claro e escuro) ─────────────────────────

class TemaPage extends StatelessWidget {
  const TemaPage({super.key});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    Widget opcao(bool escuro, String nome, String sub, bool sel) {
      final fundo = escuro ? const Color(0xFF04271F) : const Color(0xFFFAF5EE);
      final a = escuro ? const Color(0xFF3DDC97) : const Color(0xFFEF476F);
      final b = escuro ? const Color(0xFFFF7A98) : const Color(0xFF005942);
      return Expanded(
        child: GestureDetector(
          onTap: () => TemaController.definir(escuro ? ThemeMode.dark : ThemeMode.light),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 220),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: c.superficie,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: sel ? c.rosa : Colors.transparent, width: 2),
            ),
            child: Column(children: [
              Container(
                height: 90,
                decoration: BoxDecoration(
                  color: fundo,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                  Container(
                      width: 52,
                      height: 8,
                      decoration: BoxDecoration(
                          color: a, borderRadius: BorderRadius.circular(8))),
                  const SizedBox(height: 8),
                  Container(
                      width: 38,
                      height: 8,
                      decoration: BoxDecoration(
                          color: b, borderRadius: BorderRadius.circular(8))),
                ]),
              ),
              const SizedBox(height: 10),
              Text(nome,
                  style: TextStyle(
                      fontSize: 14, fontWeight: FontWeight.w700, color: c.texto)),
              Text(sub, style: TextStyle(fontSize: 11.5, color: c.texto2)),
              const SizedBox(height: 4),
              Icon(sel ? Icons.check_circle_rounded : Icons.circle_outlined,
                  size: 20, color: sel ? c.rosa : c.vazio),
            ]),
          ),
        ),
      );
    }

    return Tela(
      titulo: 'Tema do',
      destaque: 'aplicativo',
      children: [
        ValueListenableBuilder<ThemeMode>(
          valueListenable: TemaController.modo,
          builder: (context, modo, _) {
            final escuroAtivo = modo == ThemeMode.dark ||
                (modo == ThemeMode.system && c.escuro);
            return Row(children: [
              opcao(false, 'Tema claro', 'creme e rosa', !escuroAtivo),
              const SizedBox(width: 12),
              opcao(true, 'Tema escuro', 'tons de verde', escuroAtivo),
            ]);
          },
        ),
        const SizedBox(height: 14),
        Text('A escolha fica salva neste aparelho.',
            style: TextStyle(fontSize: 12.5, color: c.texto2)),
      ],
    );
  }
}

// ───────────────────────── Acessibilidade ─────────────────────────

class AcessibilidadePage extends StatelessWidget {
  const AcessibilidadePage({super.key});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    const nomes = ['Pequeno', 'Normal', 'Grande', 'Muito grande'];
    return Tela(
      titulo: 'Acessi',
      destaque: 'bilidade',
      children: [
        AnimatedBuilder(
          animation: AcessibilidadeController.todos,
          builder: (context, _) {
            final i = AcessibilidadeController.indiceEscala;
            return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              const SecaoCab('Tamanho do texto'),
              const SizedBox(height: 10),
              Wrap(spacing: 8, runSpacing: 8, children: [
                for (var k = 0; k < nomes.length; k++)
                  FiltroChip(nomes[k], i == k, () => AcessibilidadeController.definirEscala(k)),
              ]),
              const SizedBox(height: 12),
              Superficie(
                child: Text(
                  'Prévia: assim ficará o texto em todo o aplicativo.',
                  style: TextStyle(fontSize: 15, color: c.texto),
                ),
              ),
              const SizedBox(height: 22),
              SwitchListTile(
                contentPadding: EdgeInsets.zero,
                activeColor: c.primaria,
                title: Text('Texto em negrito', style: TextStyle(color: c.texto)),
                subtitle: Text('Deixa as letras mais firmes e fáceis de ler.',
                    style: TextStyle(fontSize: 12, color: c.texto2)),
                value: AcessibilidadeController.negrito.value,
                onChanged: AcessibilidadeController.definirNegrito,
              ),
              SwitchListTile(
                contentPadding: EdgeInsets.zero,
                activeColor: c.primaria,
                title: Text('Reduzir animações', style: TextStyle(color: c.texto)),
                subtitle: Text('Remove as transições de entrada das telas.',
                    style: TextStyle(fontSize: 12, color: c.texto2)),
                value: AcessibilidadeController.reduzirAnimacoes.value,
                onChanged: AcessibilidadeController.definirReduzir,
              ),
            ]);
          },
        ),
      ],
    );
  }
}

// ───────────────────────── Sobre o aplicativo ─────────────────────────

class SobrePage extends StatefulWidget {
  final bool treinador;
  const SobrePage({super.key, required this.treinador});

  @override
  State<SobrePage> createState() => _SobrePageState();
}

class _SobrePageState extends State<SobrePage> {
  int _toques = 0;
  bool _avancado = false;

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final s = SateStore.i;
    Widget recurso(IconData i, String t, String sub) => Padding(
          padding: const EdgeInsets.symmetric(vertical: 7),
          child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: c.suave(c.primaria),
                borderRadius: BorderRadius.circular(13),
              ),
              child: Icon(i, size: 20, color: c.primaria),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(t,
                    style: TextStyle(
                        fontSize: 14.5, fontWeight: FontWeight.w600, color: c.texto)),
                const SizedBox(height: 2),
                Text(sub, style: TextStyle(fontSize: 12.5, height: 1.35, color: c.texto2)),
              ]),
            ),
          ]),
        );

    return AnimatedBuilder(
      animation: s,
      builder: (context, _) => Tela(
        titulo: 'Sobre o',
        destaque: 'aplicativo',
        children: [
          Center(
            child: Column(children: [
              Image.asset('assets/images/logoVerde_img.png', width: 190, fit: BoxFit.contain),
              Transform.translate(
                offset: const Offset(0, -18),
                child: Column(children: [
                  Text('Sistema de Acompanhamento e Treinamento Esportivo',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 12.5, color: c.texto2)),
                  const SizedBox(height: 12),
                  GestureDetector(
                    onTap: () {
                      _toques++;
                      if (_toques >= 7) setState(() => _avancado = !_avancado);
                    },
                    child: Pilula('Versão $versaoApp · build $buildApp', c.primaria),
                  ),
                ]),
              ),
            ]),
          ),
          const SizedBox(height: 4),
          Text(
            'Uma plataforma para treinadores e atletas acompanharem treinos, frequência e evolução esportiva em um só lugar.',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 14, height: 1.5, color: c.texto),
          ),
          const SizedBox(height: 26),
          const SecaoCab('O que você encontra'),
          const SizedBox(height: 6),
          recurso(Icons.groups_rounded, 'Atletas e equipes',
              'Perfis, metas, feedbacks e documentação organizados.'),
          recurso(Icons.event_note_rounded, 'Treinos e exercícios',
              'Planejamento diário, semanal e mensal com vídeos de execução.'),
          recurso(Icons.insights_rounded, 'Testes e desempenho',
              'Resultados individuais e gráficos de evolução.'),
          recurso(Icons.calendar_month_rounded, 'Calendário e presença',
              'Treinos, jogos e eventos com acompanhamento mensal e anual.'),
          // Opção de teste do limite de atletas (liberada ao tocar 7 vezes na versão).
          if (widget.treinador && (_avancado || s.simularLimite)) ...[
            const SizedBox(height: 18),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              activeColor: c.primaria,
              title: Text('Simular limite de atletas excedido',
                  style: TextStyle(color: c.texto, fontSize: 14)),
              value: s.simularLimite,
              onChanged: s.definirSimularLimite,
            ),
          ],
        ],
      ),
    );
  }
}

// ───────────────────────── Ajuda e FAQ ─────────────────────────

class AjudaPage extends StatelessWidget {
  final bool treinador;
  const AjudaPage({super.key, required this.treinador});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return Tela(
      titulo: 'Central de',
      destaque: 'ajuda',
      children: [
        Text('Como podemos ajudar?', style: TextStyle(fontSize: 14, color: c.texto2)),
        const SizedBox(height: 10),
        LinhaItem(
          icone: Icons.quiz_outlined,
          titulo: 'Perguntas frequentes',
          sub: 'Respostas rápidas para as dúvidas mais comuns',
          fim: Icon(Icons.chevron_right_rounded, color: c.texto2),
          onTap: () => abrir(context, FaqPage(treinador: treinador)),
        ),
        LinhaItem(
          icone: Icons.school_outlined,
          titulo: 'Rever tutorial',
          sub: 'Passo a passo das principais funções',
          fim: Icon(Icons.chevron_right_rounded, color: c.texto2),
          onTap: () => abrir(context, TutorialSatePage(treinador: treinador)),
        ),
        LinhaItem(
          icone: Icons.mail_outline_rounded,
          titulo: 'Falar com o suporte',
          sub: 'Canal de atendimento do SATE',
          onTap: () => aviso(context, 'O atendimento por aqui estará disponível em breve.'),
        ),
      ],
    );
  }
}

class FaqPage extends StatelessWidget {
  final bool treinador;
  const FaqPage({super.key, required this.treinador});

  List<(String, String)> get _geral => const [
        ('O que é o SATE?',
            'É um sistema para acompanhar treinos, frequência e evolução esportiva, reunindo treinadores e atletas em um só aplicativo.'),
        ('Como troco entre tema claro e escuro?',
            'Abra o menu lateral, toque em Tema e escolha Tema claro ou Tema escuro. A escolha fica salva.'),
        ('Como aumento o tamanho das letras?',
            'No menu lateral, abra Acessibilidade e escolha o tamanho do texto.'),
      ];

  List<(String, String)> get _treinador => const [
        ('Como registro a presença dos atletas?',
            'Abra o Calendário, toque no dia do treino e use os botões de presente ou falta na chamada. Somente o treinador registra presenças.'),
        ('Como crio um treino?',
            'Na aba Treinos, toque em Novo treino, defina data, horário, objetivo e escolha os exercícios da biblioteca.'),
        ('Como adiciono um vídeo a um exercício?',
            'Em Treinos > Exercícios, abra ou crie um exercício e escolha um vídeo demonstrativo no editor.'),
        ('Onde registro testes físicos?',
            'Na aba Atletas, escolha a visão Testes (ou abra o perfil do atleta) e toque em Registrar.'),
        ('Como acompanho metas e feedbacks de um atleta?',
            'Abra o perfil do atleta e use as abas Metas e Feedbacks.'),
        ('Quando aparecem os planos?',
            'A tela de planos só é destacada quando o número de atletas ultrapassa o limite do seu plano atual.'),
      ];

  List<(String, String)> get _atleta => const [
        ('Posso marcar minha própria presença?',
            'Não. A presença é registrada somente pelo seu treinador.'),
        ('Onde vejo meus próximos treinos?',
            'Na aba Treinos e também no Início. Abra um treino para ver objetivo, foco do dia e exercícios.'),
        ('Como assisto ao vídeo de um exercício?',
            'Abra o treino, toque no exercício e use o player de vídeo no topo da tela.'),
        ('Onde acompanho minha evolução?',
            'Na aba Evolução você vê testes, gráficos, metas e feedbacks do treinador.'),
        ('Como publico na comunidade?',
            'Na aba Comunidade, toque em Publicar, escreva sua mensagem e confirme.'),
      ];

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final itens = [...(treinador ? _treinador : _atleta), ..._geral];
    return Tela(
      titulo: 'Perguntas',
      destaque: 'frequentes',
      children: [
        for (final p in itens)
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Theme(
              data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
              child: Container(
                decoration: BoxDecoration(
                  color: c.superficie,
                  borderRadius: BorderRadius.circular(18),
                ),
                child: ExpansionTile(
                  tilePadding: const EdgeInsets.symmetric(horizontal: 16),
                  childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                  expandedAlignment: Alignment.centerLeft,
                  iconColor: c.rosa,
                  collapsedIconColor: c.texto2,
                  shape: const RoundedRectangleBorder(
                      borderRadius: BorderRadius.all(Radius.circular(18))),
                  collapsedShape: const RoundedRectangleBorder(
                      borderRadius: BorderRadius.all(Radius.circular(18))),
                  title: Text(p.$1,
                      style: TextStyle(
                          fontSize: 14.5, fontWeight: FontWeight.w600, color: c.texto)),
                  children: [
                    Text(p.$2,
                        style: TextStyle(fontSize: 13.5, height: 1.5, color: c.texto2)),
                  ],
                ),
              ),
            ),
          ),
      ],
    );
  }
}
