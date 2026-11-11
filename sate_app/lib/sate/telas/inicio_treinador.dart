import 'package:flutter/material.dart';

import '../data/modelos.dart';
import '../data/sate_store.dart';
import '../ui/cores.dart';
import '../ui/fundo.dart';
import '../ui/tela.dart';
import '../ui/widgets.dart';
import 'atletas_page.dart';
import 'evento_page.dart';
import 'notificacoes_page.dart';
import 'planejamento_page.dart';

String quandoTxt(DateTime d, DateTime hoje) {
  final dif = somenteData(d).difference(hoje).inDays;
  if (dif == 0) return 'Hoje';
  if (dif == 1) return 'Amanhã';
  return '${diasSemanaCurtos[d.weekday - 1]}, ${d.day} ${mesesCurtos[d.month - 1]}';
}

/// Variação média de escore (0..1) entre o primeiro e o último resultado.
double _evolucao(SateStore s, Atleta a) {
  var soma = 0.0, n = 0;
  for (final t in s.testesDoAtleta(a).where((t) => t.modalidade == null)) {
    final r = s.resultadosDe(a.nome, teste: t.nome);
    if (r.length < 2) continue;
    soma += t.escore(r.last.valor) - t.escore(r.first.valor);
    n++;
  }
  return n == 0 ? 0 : soma / n;
}

/// Início do treinador: próximo treino, visão geral, destaque e o que vem a seguir.
class InicioTreinadorPage extends StatelessWidget {
  final ValueChanged<int> irPara;
  const InicioTreinadorPage({super.key, required this.irPara});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return AnimatedBuilder(
      animation: SateStore.i,
      builder: (context, _) {
        final s = SateStore.i;
        final h = s.hoje;
        final nome = s.nomeUsuario.isEmpty ? 'Treinador' : s.nomeUsuario.split(' ').first;
        final proximos = s.proximosTreinos();
        final prox = proximos.isEmpty ? null : proximos.first;
        final pct30 = s.pct(s.atletas, somaDias(h, -30), h);
        final pctAnt = s.pct(s.atletas, somaDias(h, -60), somaDias(h, -31));
        final delta = (pct30 != null && pctAnt != null) ? ((pct30 - pctAnt) * 100).round() : null;
        final agenda = s.proximasAtividades(limite: 4)
            .where((a) => !(a.treino != null && prox != null && a.treino!.id == prox.id))
            .take(3)
            .toList();
        final pend = s.pendenciasTreinador().length;
        final ranking = [for (final a in s.atletas) (a, _evolucao(s, a))]
          ..sort((x, y) => y.$2.compareTo(x.$2));
        final destaque = ranking.isEmpty || ranking.first.$2 <= 0 ? null : ranking.first;

        Widget tile({required Color cor, required Widget child}) => Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(26),
                color: c.superficie,
              ),
              child: child,
            );

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
                      text: 'Olá, ',
                      style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: c.texto)),
                  TextSpan(
                      text: nome,
                      style: TextStyle(
                          fontFamily: 'DMSerifDisplay',
                          fontStyle: FontStyle.italic,
                          fontSize: 28,
                          color: c.rosa)),
                ])),
                const SizedBox(height: 18),

                // Próximo treino
                Revela(
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(28),
                    child: Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: c.heroSolido,
                      ),
                      child: Stack(children: [
                        prox == null
                            ? const Text('Nenhum treino programado nas próximas semanas.',
                                style: TextStyle(color: Colors.white))
                            : Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                                Container(
                                  padding:
                                      const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
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
                                        fontSize: 21,
                                        fontWeight: FontWeight.w700,
                                        color: Colors.white)),
                                const SizedBox(height: 4),
                                Text(
                                    '${horaTxt(prox.inicioMin)} · ${prox.duracaoMin} min · ${s.equipe(prox.equipeId).nome}',
                                    style: const TextStyle(fontSize: 13, color: Colors.white70)),
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
                                          treinoId: prox.id, data: prox.data, treinador: true)),
                                  child: const Text('Ver treino'),
                                ),
                              ]),
                      ]),
                    ),
                  ),
                ),
                const SizedBox(height: 18),

                // Visão geral: dois indicadores
                Revela(
                  ordem: 1,
                  child: IntrinsicHeight(
                    child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
                      Expanded(
                        child: GestureDetector(
                          onTap: () => irPara(1),
                          child: tile(
                            cor: c.primaria,
                            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                              Container(
                                width: 38,
                                height: 38,
                                decoration: BoxDecoration(
                                    color: c.suave(c.primaria), shape: BoxShape.circle),
                                child: Icon(Icons.groups_rounded, size: 20, color: c.primaria),
                              ),
                              const SizedBox(height: 14),
                              Text('${s.totalAtletas}',
                                  style: TextStyle(
                                      fontSize: 34,
                                      height: 1,
                                      fontWeight: FontWeight.w700,
                                      color: c.texto)),
                              const SizedBox(height: 4),
                              Text('Total de atletas',
                                  style: TextStyle(fontSize: 12.5, color: c.texto2)),
                              const Spacer(),
                              const SizedBox(height: 12),
                              PilhaAvatares([for (final a in s.atletas) a.nome], tamanho: 28),
                            ]),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: tile(
                          cor: c.rosa,
                          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Text('Presença geral',
                                style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: c.texto)),
                            const SizedBox(height: 10),
                            Center(
                              child: AnelPct(
                                valor: pct30 ?? 0,
                                tamanho: 92,
                                espessura: 10,
                                cor: c.rosa,
                                centro: Text(pct30 == null ? '—' : '${(pct30 * 100).round()}%',
                                    style: TextStyle(
                                        fontSize: 20,
                                        fontWeight: FontWeight.w700,
                                        color: c.texto)),
                              ),
                            ),
                            const Spacer(),
                            const SizedBox(height: 10),
                            Row(children: [
                              if (delta != null)
                                Pilula(
                                  '${delta >= 0 ? '+' : ''}$delta pts',
                                  delta >= 0 ? c.ok : c.rosa,
                                  icone: delta >= 0
                                      ? Icons.trending_up_rounded
                                      : Icons.trending_down_rounded,
                                ),
                              if (delta != null) const SizedBox(width: 6),
                              Flexible(
                                child: Text('30 dias',
                                    style: TextStyle(fontSize: 11.5, color: c.texto2)),
                              ),
                            ]),
                          ]),
                        ),
                      ),
                    ]),
                  ),
                ),

                if (pend > 0) ...[
                  const SizedBox(height: 14),
                  Revela(
                    ordem: 2,
                    child: Superficie(
                      onTap: () => abrir(
                          context, NotificacoesPage(treinador: true, irPara: irPara)),
                      child: Row(children: [
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                              color: c.suave(c.rosa), borderRadius: BorderRadius.circular(13)),
                          child: Icon(Icons.notifications_active_outlined, color: c.rosa),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                              '$pend ${pend == 1 ? 'item precisa' : 'itens precisam'} de atenção',
                              style: TextStyle(
                                  fontSize: 14, fontWeight: FontWeight.w600, color: c.texto)),
                        ),
                        Icon(Icons.chevron_right_rounded, color: c.texto2),
                      ]),
                    ),
                  ),
                ],

                if (destaque != null) ...[
                  const SizedBox(height: 26),
                  const SecaoCab('Destaque da semana'),
                  const SizedBox(height: 6),
                  Revela(
                    ordem: 3,
                    child: LinhaItem(
                      icone: Icons.military_tech_outlined,
                      cor: c.rosa,
                      titulo: destaque.$1.nome,
                      sub:
                          '${s.equipe(destaque.$1.equipeId).modalidade} · +${(destaque.$2 * 100).round()} pts nos testes',
                      fim: Icon(Icons.chevron_right_rounded, color: c.texto2),
                      onTap: () =>
                          abrir(context, AtletaDetalhePage(atletaId: destaque.$1.id)),
                    ),
                  ),
                ],

                if (agenda.isNotEmpty) ...[
                  const SizedBox(height: 22),
                  SecaoCab('Em seguida', acao: 'Calendário', onAcao: () => irPara(3)),
                  const SizedBox(height: 4),
                  for (final a in agenda)
                    LinhaItem(
                      icone: a.icone,
                      cor: a.evento != null ? corTipoEv(c, a.evento!.tipo) : c.primaria,
                      titulo: a.titulo,
                      sub: '${quandoTxt(a.data, h)} · ${horaTxt(a.inicioMin)} · ${a.tipoRotulo}',
                      fim: Icon(Icons.chevron_right_rounded, color: c.texto2),
                      onTap: () {
                        if (a.treino != null) {
                          abrir(
                              context,
                              TreinoDetalhePage(
                                  treinoId: a.treino!.id, data: a.data, treinador: true));
                        } else if (a.evento != null) {
                          abrir(context,
                              EventoDetalhePage(eventoId: a.evento!.id, treinador: true));
                        }
                      },
                    ),
                ],
              ],
            ),
          ),
        );
      },
    );
  }
}
