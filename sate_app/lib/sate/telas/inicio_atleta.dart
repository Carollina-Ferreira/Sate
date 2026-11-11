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

/// Início do atleta: próximo treino, exercícios e a semana. Sem registro de presença.
class InicioAtletaPage extends StatelessWidget {
  final ValueChanged<int> irPara;
  const InicioAtletaPage({super.key, required this.irPara});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return AnimatedBuilder(
      animation: SateStore.i,
      builder: (context, _) {
        final s = SateStore.i;
        final a = s.eu;
        final h = s.hoje;
        final nome = a.nome.split(' ').first;
        final proximos = s.proximosTreinos(atleta: a);
        final prox = proximos.isEmpty ? null : proximos.first;
        final exs = prox == null
            ? <Exercicio>[]
            : [
                for (final id in prox.exercicioIds)
                  if (s.exercicio(id) != null) s.exercicio(id)!,
              ];

        final seg = somaDias(h, -(h.weekday - 1));
        final semana = [for (var i = 0; i < 7; i++) somaDias(seg, i)];
        final contSem = s.contagem([a], seg, somaDias(seg, 6));

        Color corStatus(StatusPres st) => switch (st) {
              StatusPres.realizado => c.ok,
              StatusPres.naoRealizado => c.falta,
              StatusPres.pendente => c.pendente,
              StatusPres.semTreino => c.vazio,
            };

        return Scaffold(
          backgroundColor: c.fundo,
          body: FundoSate(
            child: ListView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 110),
            children: [
              Text('${diasSemanaLongos[h.weekday - 1]}, ${h.day} de ${mesesLongos[h.month - 1].toLowerCase()}',
                  style: TextStyle(fontSize: 12.5, color: c.texto2)),
              const SizedBox(height: 2),
              Text.rich(TextSpan(children: [
                TextSpan(
                    text: 'Bora treinar, ',
                    style: TextStyle(fontSize: 23, fontWeight: FontWeight.w700, color: c.texto)),
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
                  child: prox == null
                      ? const Text('Nenhum treino programado para você nas próximas semanas.',
                          style: TextStyle(color: Colors.white))
                      : Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.18),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text('Próximo treino · ${quandoTxt(prox.data, h)}',
                                style: const TextStyle(
                                    fontSize: 11.5,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.white)),
                          ),
                          const SizedBox(height: 12),
                          Text(prox.titulo,
                              style: const TextStyle(
                                  fontSize: 21, fontWeight: FontWeight.w700, color: Colors.white)),
                          const SizedBox(height: 4),
                          Text(
                              '${horaTxt(prox.inicioMin)} · ${prox.duracaoMin} min · ${s.equipe(prox.equipeId).local}',
                              style: const TextStyle(fontSize: 13, color: Colors.white70)),
                          if (prox.foco.isNotEmpty) ...[
                            const SizedBox(height: 10),
                            Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                              const Icon(Icons.psychology_alt_outlined,
                                  size: 18, color: Colors.white70),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(prox.foco,
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
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            ),
                            onPressed: () => abrir(
                                context,
                                TreinoDetalhePage(
                                    treinoId: prox.id, data: prox.data, treinador: false)),
                            child: const Text('Ver treino'),
                          ),
                        ]),
                ),
              ),
              const SizedBox(height: 24),
              SecaoCab('Minha semana', acao: 'Calendário', onAcao: () => irPara(2)),
              const SizedBox(height: 12),
              Revela(
                ordem: 2,
                child: Row(children: [
                  for (final d in semana)
                    () {
                      final st = s.statusAtleta(a, d);
                      final cor = corStatus(st);
                      return Expanded(
                        child: Column(children: [
                          Text(diasSemanaCurtos[d.weekday - 1].substring(0, 1),
                              style: TextStyle(fontSize: 11.5, color: c.texto2)),
                          const SizedBox(height: 6),
                          Container(
                            width: 36,
                            height: 36,
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: st == StatusPres.semTreino
                                  ? Colors.transparent
                                  : c.suave(cor),
                              border: Border.all(
                                  color: d == h ? c.rosa : Colors.transparent, width: 1.5),
                            ),
                            child: st == StatusPres.semTreino
                                ? Text('${d.day}',
                                    style: TextStyle(fontSize: 12.5, color: c.texto2))
                                : Icon(
                                    st == StatusPres.realizado
                                        ? Icons.check_rounded
                                        : (st == StatusPres.naoRealizado
                                            ? Icons.close_rounded
                                            : Icons.more_horiz_rounded),
                                    size: 18,
                                    color: cor),
                          ),
                        ]),
                      );
                    }(),
                ]),
              ),
              const SizedBox(height: 10),
              Text(
                contSem.total == 0
                    ? 'A presença é registrada pelo seu treinador.'
                    : 'Você esteve em ${contSem.ok} de ${contSem.total} treinos desta semana.',
                style: TextStyle(fontSize: 12.5, color: c.texto2),
              ),
              const SizedBox(height: 24),
              SecaoCab('Exercícios do treino',
                  acao: exs.length > 3 ? 'Ver todos' : null,
                  onAcao: prox == null
                      ? null
                      : () => abrir(
                          context,
                          TreinoDetalhePage(
                              treinoId: prox.id, data: prox.data, treinador: false))),
              const SizedBox(height: 4),
              if (exs.isEmpty)
                const VazioView(Icons.self_improvement_rounded, 'Dia de descanso',
                    'Sem exercícios programados por enquanto.')
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
}
