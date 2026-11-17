import 'package:flutter/material.dart';

import '../../theme/sate_theme.dart';
import '../data/sate_store.dart';
import '../ui/cores.dart';
import '../ui/widgets.dart';

class _Passo {
  final IconData icone;
  final String titulo, destaque, texto, dica;
  const _Passo(this.icone, this.titulo, this.destaque, this.texto, this.dica);
}

const List<_Passo> _passosTreinador = [
  _Passo(Icons.waving_hand_rounded, 'Bem-vindo ao', 'SATE',
      'Reúna atletas, treinos, testes e frequência em um só lugar.',
      'Você pode rever este tutorial em Mais > Tutorial.'),
  _Passo(Icons.home_rounded, 'Seu painel', 'inicial',
      'O Início resume atletas, equipes, próximos treinos, frequência e pendências.',
      'Toque nos cartões para abrir cada área.'),
  _Passo(Icons.groups_rounded, 'Atletas e', 'equipes',
      'Na aba Atletas você filtra por equipe e abre o perfil completo de cada um.',
      'No perfil do atleta há frequência, perfil físico e testes.'),
  _Passo(Icons.event_note_rounded, 'Planeje os', 'treinos',
      'Em Treinos, veja o dia, a semana ou o mês e crie sessões com objetivo, foco e exercícios.',
      'Use o botão "Novo treino" para montar uma sessão.'),
  _Passo(Icons.play_circle_rounded, 'Exercícios com', 'vídeo',
      'Cadastre exercícios, defina séries e repetições e associe um vídeo demonstrativo.',
      'Acesse em Mais > Exercícios.'),
  _Passo(Icons.calendar_month_rounded, 'Frequência no', 'calendário',
      'Verde: realizado · Rosa: não realizado · Cinza: sem treino.',
      'Faça a chamada tocando no dia e marcando presença ou falta.'),
  _Passo(Icons.show_chart_rounded, 'Testes e', 'evolução',
      'Registre resultados por atleta e acompanhe gráficos de evolução e comparações.',
      'Cada resultado pertence a um único atleta.'),
  _Passo(Icons.apps_rounded, 'Tudo em', 'Mais',
      'Documentação, planos, estatísticas, aparência e configurações ficam no menu Mais.',
      'Escolha o tema claro, escuro ou automático.'),
];

const List<_Passo> _passosAtleta = [
  _Passo(Icons.waving_hand_rounded, 'Bem-vindo ao', 'SATE',
      'Acompanhe seus treinos, sua presença e sua evolução.',
      'Você pode rever este tutorial em Mais > Tutorial.'),
  _Passo(Icons.home_rounded, 'Seu', 'início',
      'Veja o próximo treino, os exercícios do dia, sua frequência da semana e suas metas.',
      'O resumo muda conforme o treinador programa as sessões.'),
  _Passo(Icons.fitness_center_rounded, 'Meus', 'treinos',
      'Abra um treino para ver objetivo, foco do dia e a lista de exercícios.',
      'Toque em um exercício para assistir ao vídeo demonstrativo.'),
  _Passo(Icons.calendar_month_rounded, 'Seu', 'calendário',
      'Acompanhe suas presenças no mês e no ano e confirme sua presença no dia do treino.',
      'Verde: presente · Rosa: faltou.'),
  _Passo(Icons.trending_up_rounded, 'Sua', 'evolução',
      'Veja os resultados dos testes físicos, gráficos e o avanço das suas metas.',
      'Você registra e acompanha apenas os seus próprios testes.'),
  _Passo(Icons.person_rounded, 'Seu', 'perfil',
      'Consulte seus dados, histórico esportivo e indicadores. Ajuste o tema em Mais.',
      'Pronto! Bons treinos.'),
];

/// Tutorial com avançar, voltar, pular e consulta posterior.
class TutorialSatePage extends StatefulWidget {
  final bool treinador;
  const TutorialSatePage({super.key, required this.treinador});

  @override
  State<TutorialSatePage> createState() => _TutorialSatePageState();
}

class _TutorialSatePageState extends State<TutorialSatePage> {
  final _ctrl = PageController();
  int _i = 0;

  List<_Passo> get _passos => widget.treinador ? _passosTreinador : _passosAtleta;

  Future<void> _fechar() async {
    await SateStore.i.marcarTutorialVisto(widget.treinador);
    if (mounted) Navigator.of(context).pop();
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final p = _passos;
    final ultimo = _i == p.length - 1;
    return Scaffold(
      backgroundColor: c.fundo,
      body: SafeArea(
        child: Column(children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 8, 12, 0),
            child: Row(children: [
              Pilula(widget.treinador ? 'Tutorial do treinador' : 'Tutorial do atleta', c.primaria),
              const Spacer(),
              TextButton(
                onPressed: _fechar,
                child: Text('Pular', style: TextStyle(color: c.texto2)),
              ),
            ]),
          ),
          Expanded(
            child: PageView.builder(
              controller: _ctrl,
              itemCount: p.length,
              onPageChanged: (v) => setState(() => _i = v),
              itemBuilder: (_, k) => Padding(
                padding: const EdgeInsets.symmetric(horizontal: 28),
                child: Center(
                  child: SingleChildScrollView(
                    child: Column(mainAxisSize: MainAxisSize.min, children: [
                  Container(
                    width: 132,
                    height: 132,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: c.heroSolido,
                    ),
                    child: Icon(p[k].icone, size: 60, color: Colors.white),
                  ),
                  const SizedBox(height: 34),
                  Text.rich(
                    TextSpan(children: [
                      TextSpan(
                          text: '${p[k].titulo} ',
                          style: TextStyle(
                              fontSize: 26, fontWeight: FontWeight.w700, color: c.texto)),
                      TextSpan(
                          text: p[k].destaque,
                          style: SateEstilo.destaque.copyWith(fontSize: 32, color: c.rosa)),
                    ]),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 14),
                  Text(p[k].texto,
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 15.5, height: 1.5, color: c.texto)),
                  const SizedBox(height: 18),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    decoration: BoxDecoration(
                      color: c.superficie,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Row(mainAxisSize: MainAxisSize.min, children: [
                      Icon(Icons.lightbulb_outline_rounded, size: 17, color: c.pendente),
                      const SizedBox(width: 8),
                      Flexible(
                        child: Text(p[k].dica,
                            style: TextStyle(fontSize: 12.5, color: c.texto2)),
                      ),
                    ]),
                  ),
                    ]),
                  ),
                ),
              ),
            ),
          ),
          Row(mainAxisAlignment: MainAxisAlignment.center, children: [
            for (var k = 0; k < p.length; k++)
              AnimatedContainer(
                duration: const Duration(milliseconds: 250),
                margin: const EdgeInsets.symmetric(horizontal: 3),
                width: k == _i ? 22 : 7,
                height: 7,
                decoration: BoxDecoration(
                  color: k == _i ? c.rosa : c.linha,
                  borderRadius: BorderRadius.circular(7),
                ),
              ),
          ]),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 20),
            child: Row(children: [
              if (_i > 0)
                Expanded(
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size.fromHeight(50),
                      foregroundColor: c.texto,
                      side: BorderSide(color: c.linha),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    onPressed: () => _ctrl.previousPage(
                        duration: const Duration(milliseconds: 300), curve: Curves.easeOut),
                    child: const Text('Voltar'),
                  ),
                ),
              if (_i > 0) const SizedBox(width: 10),
              Expanded(
                flex: 2,
                child: FilledButton(
                  style: estiloBotao(context),
                  onPressed: () => ultimo
                      ? _fechar()
                      : _ctrl.nextPage(
                          duration: const Duration(milliseconds: 300), curve: Curves.easeOut),
                  child: Text(ultimo ? 'Concluir' : 'Avançar'),
                ),
              ),
            ]),
          ),
        ]),
      ),
    );
  }
}
