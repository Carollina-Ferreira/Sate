import 'package:flutter/material.dart';

import '../data/modelos.dart';
import '../data/sate_store.dart';
import '../ui/cores.dart';
import '../ui/fundo.dart';
import '../ui/tela.dart';
import '../ui/widgets.dart';
import 'exercicios_page.dart';
import 'inicio_treinador.dart' show quandoTxt;
import 'planejamento_page.dart';

/// Início do atleta: treino do dia, exercícios e a semana. Sem registro de presença.
/// A faixa de dias pode ser arrastada para os lados; o dia escolhido atualiza o treino
/// e os exercícios exibidos.
class InicioAtletaPage extends StatefulWidget {
  final ValueChanged<int> irPara;
  const InicioAtletaPage({super.key, required this.irPara});

  @override
  State<InicioAtletaPage> createState() => _InicioAtletaPageState();
}

class _InicioAtletaPageState extends State<InicioAtletaPage> {
  /// Quantidade de dias disponíveis antes e depois de hoje na faixa arrastável.
  static const int _margemDias = 60;
  static const int _visiveis = 7;

  final ScrollController _faixa = ScrollController();
  late final DateTime _hoje = SateStore.i.hoje;
  late DateTime _sel = _hoje;
  bool _posicionada = false;

  DateTime get _primeiroDia => somaDias(_hoje, -_margemDias);
  int get _total => _margemDias * 2 + 1;

  int _indiceDe(DateTime d) =>
      (somenteData(d).difference(_primeiroDia).inHours / 24).round();

  @override
  void dispose() {
    _faixa.dispose();
    super.dispose();
  }

  /// Centraliza [d] na faixa de dias.
  void _centralizar(DateTime d, double largura, {bool animar = true}) {
    if (!_faixa.hasClients) return;
    final ext = largura / _visiveis;
    final alvo = ((_indiceDe(d) - (_visiveis ~/ 2)) * ext)
        .clamp(0.0, _faixa.position.maxScrollExtent)
        .toDouble();
    if (animar) {
      _faixa.animateTo(alvo,
          duration: const Duration(milliseconds: 280), curve: Curves.easeOut);
    } else {
      _faixa.jumpTo(alvo);
    }
  }

  void _escolher(DateTime d, double largura) {
    setState(() => _sel = somenteData(d));
    _centralizar(d, largura);
  }

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return AnimatedBuilder(
      animation: SateStore.i,
      builder: (context, _) {
        final s = SateStore.i;
        final a = s.eu;
        final h = _hoje;
        final sel = _sel;
        final nome = a.nome.split(' ').first;

        // Treino mostrado: hoje -> próximo treino; outro dia -> treino daquele dia.
        final proximos = s.proximosTreinos(atleta: a);
        final doDia = s.treinosDoAtleta(a, sel);
        final Treino? treino = sel == h
            ? (proximos.isEmpty ? null : proximos.first)
            : (doDia.isEmpty ? null : doDia.first);
        final exs = treino == null
            ? <Exercicio>[]
            : [
                for (final id in treino.exercicioIds)
                  if (s.exercicio(id) != null) s.exercicio(id)!,
              ];

        final seg = somaDias(sel, -(sel.weekday - 1));
        final contSem = s.contagem([a], seg, somaDias(seg, 6));

        Color corStatus(StatusPres st) => switch (st) {
              StatusPres.realizado => c.ok,
              StatusPres.naoRealizado => c.falta,
              StatusPres.pendente => c.pendente,
              StatusPres.semTreino => c.vazio,
            };

        Widget diaFaixa(DateTime d, double ext) {
          final st = s.statusAtleta(a, d);
          final cor = corStatus(st);
          final selecionado = d == sel;
          final ehHoje = d == h;
          final comResultado =
              st == StatusPres.realizado || st == StatusPres.naoRealizado;
          return GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: () => _escolher(d, _larguraFaixa),
            child: SizedBox(
              width: ext,
              child: Column(children: [
                Text(diasSemanaCurtos[d.weekday - 1].substring(0, 1),
                    style: TextStyle(
                        fontSize: 11.5,
                        fontWeight: selecionado ? FontWeight.w700 : FontWeight.w400,
                        color: selecionado ? c.texto : c.texto2)),
                const SizedBox(height: 6),
                AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  width: 38,
                  height: 38,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: selecionado
                        ? c.primaria
                        : (comResultado ? c.suave(cor) : Colors.transparent),
                    border: Border.all(
                        color: ehHoje && !selecionado ? c.rosa : Colors.transparent,
                        width: 1.5),
                  ),
                  child: !selecionado && comResultado
                      ? Icon(
                          st == StatusPres.realizado
                              ? Icons.check_rounded
                              : Icons.close_rounded,
                          size: 18,
                          color: cor)
                      : Text('${d.day}',
                          style: TextStyle(
                              fontSize: 13,
                              fontWeight:
                                  selecionado ? FontWeight.w700 : FontWeight.w400,
                              color: selecionado ? c.sobrePrimaria : c.texto2)),
                ),
                const SizedBox(height: 5),
                Container(
                  width: 5,
                  height: 5,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: selecionado && comResultado ? cor : Colors.transparent,
                  ),
                ),
              ]),
            ),
          );
        }

        return Scaffold(
          backgroundColor: c.fundo,
          body: FundoSate(
            child: ListView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 110),
              children: [
                Text(
                    '${diasSemanaLongos[sel.weekday - 1]}, ${sel.day} de ${mesesLongos[sel.month - 1].toLowerCase()}',
                    style: TextStyle(fontSize: 12.5, color: c.texto2)),
                const SizedBox(height: 2),
                Text.rich(TextSpan(children: [
                  TextSpan(
                      text: 'Bora treinar, ',
                      style: TextStyle(
                          fontSize: 23, fontWeight: FontWeight.w700, color: c.texto)),
                  TextSpan(
                      text: nome,
                      style: TextStyle(
                          fontFamily: 'DMSerifDisplay',
                          fontStyle: FontStyle.italic,
                          fontSize: 28,
                          color: c.rosa)),
                ])),
                const SizedBox(height: 18),
                Revela(
                  child: Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: c.heroSolido,
                      borderRadius: BorderRadius.circular(26),
                    ),
                    child: treino == null
                        ? Text(
                            sel == h
                                ? 'Nenhum treino programado para você nas próximas semanas.'
                                : 'Nenhum treino programado para este dia.',
                            style: const TextStyle(color: Colors.white))
                        : Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Container(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.18),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                  '${sel == h ? 'Próximo treino' : 'Treino'} · ${quandoTxt(treino.data, h)}',
                                  style: const TextStyle(
                                      fontSize: 11.5,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.white)),
                            ),
                            const SizedBox(height: 12),
                            Text(treino.titulo,
                                style: const TextStyle(
                                    fontSize: 21,
                                    fontWeight: FontWeight.w700,
                                    color: Colors.white)),
                            const SizedBox(height: 4),
                            Text(
                                '${horaTxt(treino.inicioMin)} · ${treino.duracaoMin} min · ${s.equipe(treino.equipeId).local}',
                                style: const TextStyle(fontSize: 13, color: Colors.white70)),
                            if (treino.foco.isNotEmpty) ...[
                              const SizedBox(height: 10),
                              Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                                const Icon(Icons.psychology_alt_outlined,
                                    size: 18, color: Colors.white70),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(treino.foco,
                                      style: const TextStyle(
                                          fontSize: 12.5, height: 1.35, color: Colors.white)),
                                ),
                              ]),
                            ],
                            const SizedBox(height: 14),
                            FilledButton(
                              style: FilledButton.styleFrom(
                                backgroundColor: Colors.white,
                                foregroundColor: const Color(0xFF005942),
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(14)),
                              ),
                              onPressed: () => abrir(
                                  context,
                                  TreinoDetalhePage(
                                      treinoId: treino.id,
                                      data: treino.data,
                                      treinador: false)),
                              child: const Text('Ver treino'),
                            ),
                          ]),
                  ),
                ),
                const SizedBox(height: 24),
                SecaoCab('Minha semana', acao: 'Calendário', onAcao: () => widget.irPara(2)),
                const SizedBox(height: 4),
                Row(children: [
                  Expanded(
                    child: Text(
                        '${mesesLongos[sel.month - 1]} de ${sel.year}',
                        style: TextStyle(fontSize: 12.5, color: c.texto2)),
                  ),
                  if (sel != h)
                    TextButton(
                      style: TextButton.styleFrom(
                        visualDensity: VisualDensity.compact,
                        padding: const EdgeInsets.symmetric(horizontal: 8),
                      ),
                      onPressed: () => _escolher(h, _larguraFaixa),
                      child: Text('Voltar para hoje', style: TextStyle(color: c.rosa)),
                    ),
                ]),
                const SizedBox(height: 6),
                Revela(
                  ordem: 2,
                  child: LayoutBuilder(builder: (context, caixa) {
                    _larguraFaixa = caixa.maxWidth;
                    final ext = caixa.maxWidth / _visiveis;
                    if (!_posicionada) {
                      _posicionada = true;
                      WidgetsBinding.instance.addPostFrameCallback((_) {
                        if (mounted) _centralizar(_sel, caixa.maxWidth, animar: false);
                      });
                    }
                    return SizedBox(
                      height: 92,
                      child: ListView.builder(
                        controller: _faixa,
                        scrollDirection: Axis.horizontal,
                        physics: const BouncingScrollPhysics(),
                        itemExtent: ext,
                        itemCount: _total,
                        itemBuilder: (_, i) => diaFaixa(somaDias(_primeiroDia, i), ext),
                      ),
                    );
                  }),
                ),
                const SizedBox(height: 6),
                Text(
                  contSem.total == 0
                      ? 'A presença é registrada pelo seu treinador.'
                      : 'Você esteve em ${contSem.ok} de ${contSem.total} treinos desta semana.',
                  style: TextStyle(fontSize: 12.5, color: c.texto2),
                ),
                const SizedBox(height: 24),
                SecaoCab(
                    sel == h ? 'Exercícios do treino' : 'Exercícios do dia',
                    acao: exs.length > 3 ? 'Ver todos' : null,
                    onAcao: treino == null
                        ? null
                        : () => abrir(
                            context,
                            TreinoDetalhePage(
                                treinoId: treino.id,
                                data: treino.data,
                                treinador: false))),
                const SizedBox(height: 4),
                if (exs.isEmpty)
                  const VazioView(Icons.self_improvement_rounded, 'Dia de descanso',
                      'Sem exercícios programados para este dia.')
                else
                  for (var i = 0; i < exs.length && i < 3; i++)
                    Revela(
                      ordem: i,
                      child: LinhaItem(
                        icone: Icons.play_circle_outline_rounded,
                        titulo: exs[i].nome,
                        sub: '${exs[i].grupo} · ${exs[i].resumo}',
                        fim: Icon(Icons.chevron_right_rounded, color: c.texto2),
                        onTap: () => abrir(
                            context, ExercicioDetalhePage(id: exs[i].id, treinador: false)),
                      ),
                    ),
              ],
            ),
          ),
        );
      },
    );
  }

  /// Largura atual da faixa (atualizada no LayoutBuilder), usada para centralizar o dia.
  double _larguraFaixa = 0;
}
