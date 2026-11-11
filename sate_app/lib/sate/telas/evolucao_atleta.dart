import 'package:flutter/material.dart';

import '../data/modelos.dart';
import '../data/sate_store.dart';
import '../ui/cores.dart';
import '../ui/tela.dart';
import '../ui/widgets.dart';
import 'testes_page.dart';

/// "Minha evolução" do atleta, na organização da versão anterior:
/// período, desempenho, frequência mensal, resumo, avaliação física,
/// últimas avaliações, histórico recente e relatórios.
class EvolucaoAtletaView extends StatefulWidget {
  const EvolucaoAtletaView({super.key});

  @override
  State<EvolucaoAtletaView> createState() => _EvolucaoAtletaViewState();
}

class _EvolucaoAtletaViewState extends State<EvolucaoAtletaView> {
  int _periodo = 0; // 0 Todos · 1 Mês · 2 Ano
  int _relatorio = 1; // 0 Semanal · 1 Mensal · 2 Anual

  static const _periodos = ['Todos', 'Mês', 'Ano'];
  static const _relatorios = ['Semanal', 'Mensal', 'Anual'];

  DateTime? _desde(SateStore s) => switch (_periodo) {
        1 => somaDias(s.hoje, -30),
        2 => somaDias(s.hoje, -365),
        _ => null,
      };

  /// Índice físico (0..100) a cada data de avaliação: média dos escores dos testes gerais.
  List<(DateTime, double)> _indice(SateStore s, Atleta a) {
    final gerais = s.testesDoAtleta(a).where((t) => t.modalidade == null).toList();
    final porTeste = {for (final t in gerais) t.nome: s.resultadosDe(a.nome, teste: t.nome)};
    final datas = <DateTime>{
      for (final l in porTeste.values) for (final r in l) somenteData(r.data),
    }.toList()
      ..sort();
    final res = <(DateTime, double)>[];
    for (final d in datas) {
      var soma = 0.0, n = 0;
      for (final t in gerais) {
        ResultadoTeste? ult;
        for (final r in porTeste[t.nome]!) {
          if (!somenteData(r.data).isAfter(d)) ult = r;
        }
        if (ult != null) {
          soma += t.escore(ult.valor);
          n++;
        }
      }
      if (n > 0) res.add((d, soma / n * 100));
    }
    return res;
  }

  String _classe(double indice) =>
      indice >= 70 ? 'Excelente' : (indice >= 50 ? 'Boa' : 'Regular');

  String _relDia(DateTime d) {
    final h = SateStore.i.hoje;
    final dia = somenteData(d);
    final dif = h.difference(dia).inDays;
    if (dif == 0) return 'Hoje';
    if (dif == 1) return 'Ontem';
    final dd = d.day.toString().padLeft(2, '0');
    final mm = d.month.toString().padLeft(2, '0');
    return '${diasSemanaCurtos[d.weekday - 1]}, $dd/$mm';
  }

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return AnimatedBuilder(
      animation: SateStore.i,
      builder: (context, _) {
        final s = SateStore.i;
        final a = s.eu;
        final h = s.hoje;
        final desde = _desde(s);

        // Desempenho (índice físico) no período
        final todos = _indice(s, a);
        final serie = desde == null ? todos : todos.where((e) => !e.$1.isBefore(desde)).toList();
        final atual = todos.isEmpty ? null : todos.last.$2;
        final variacao = serie.length >= 2 ? serie.last.$2 - serie.first.$2 : null;

        // Frequência mensal (6 meses)
        final rotMes = <String>[];
        final valMes = <double>[];
        for (var k = 5; k >= 0; k--) {
          final m = DateTime(h.year, h.month - k);
          rotMes.add(mesesCurtos[m.month - 1]);
          valMes.add((s.pct([a], m, DateTime(m.year, m.month + 1, 0)) ?? 0) * 100);
        }

        // Resumo
        final treinos = s.contagem([a], desde ?? somaDias(h, -365), h).ok;
        final metas = s.metasDe(a.id);
        final atingidas = metas.where((m) => m.concluida).length;

        // Avaliação física
        final cooper = s.resultadosDe(a.nome, teste: 'Teste de Cooper (12 min)');
        final vo2 = cooper.isEmpty ? null : (cooper.last.valor - 504.9) / 44.73;
        final imc = a.alturaCm > 0 ? a.pesoKg / ((a.alturaCm / 100) * (a.alturaCm / 100)) : null;
        String classeImc(double v) =>
            v < 18.5 ? 'Abaixo do peso' : (v < 25 ? 'Normal' : (v < 30 ? 'Sobrepeso' : 'Obesidade'));
        String classeVo2(double v) => v >= 45 ? 'Excelente' : (v >= 38 ? 'Boa' : 'Regular');

        // Últimas avaliações (por data)
        final ultimas = todos.reversed.take(3).toList();

        // Histórico recente
        final historico = s.historicoAtleta(a).where((x) => !x.marco).take(3).toList();

        // Relatórios
        List<String> rotRel = [];
        List<double> valRel = [];
        if (_relatorio == 0) {
          for (var k = 6; k >= 0; k--) {
            final d = somaDias(h, -k);
            rotRel.add(diasSemanaCurtos[d.weekday - 1].substring(0, 3));
            final st = s.statusAtleta(a, d);
            valRel.add(st == StatusPres.realizado ? 100 : 0);
          }
        } else if (_relatorio == 1) {
          for (var k = 4; k >= 0; k--) {
            final fim = somaDias(h, -7 * k);
            final ini = somaDias(fim, -6);
            rotRel.add('S${5 - k}');
            valRel.add((s.pct([a], ini, fim) ?? 0) * 100);
          }
        } else {
          for (var k = 11; k >= 0; k--) {
            final m = DateTime(h.year, h.month - k);
            rotRel.add(mesesCurtos[m.month - 1].substring(0, 1));
            valRel.add((s.pct([a], m, DateTime(m.year, m.month + 1, 0)) ?? 0) * 100);
          }
        }

        Widget titulo(String t, {String? acao, VoidCallback? onAcao}) => Padding(
              padding: const EdgeInsets.only(top: 26, bottom: 10),
              child: SecaoCab(t, acao: acao, onAcao: onAcao),
            );

        Widget indicador(String r, String v, String? un, String leg, {Color? cor}) => Expanded(
              child: Column(children: [
                Text(r, style: TextStyle(fontSize: 11, color: c.texto2)),
                const SizedBox(height: 6),
                Text(v,
                    style: TextStyle(
                        fontSize: 21, fontWeight: FontWeight.w700, color: c.texto)),
                if (un != null)
                  Text(un, style: TextStyle(fontSize: 10, color: c.texto2)),
                const SizedBox(height: 3),
                Text(leg,
                    style: TextStyle(
                        fontSize: 11, fontWeight: FontWeight.w600, color: cor ?? c.texto2)),
              ]),
            );

        Widget cartaoResumo(IconData i, String t, String v) => Expanded(
              child: Superficie(
                child: Row(children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                        color: c.suave(c.primaria), borderRadius: BorderRadius.circular(13)),
                    child: Icon(i, size: 20, color: c.primaria),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(v,
                          style: TextStyle(
                              fontSize: 20, fontWeight: FontWeight.w700, color: c.texto)),
                      Text(t,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(fontSize: 11.5, color: c.texto2)),
                    ]),
                  ),
                ]),
              ),
            );

        return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          // Cabeçalho
          Superficie(
            child: Row(children: [
              Container(
                width: 46,
                height: 46,
                decoration: BoxDecoration(
                    color: c.suave(c.primaria), borderRadius: BorderRadius.circular(15)),
                child: Icon(Icons.bar_chart_rounded, color: c.primaria),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('Acompanhe sua evolução',
                      style: TextStyle(
                          fontSize: 15, fontWeight: FontWeight.w700, color: c.texto)),
                  const SizedBox(height: 2),
                  Text('Veja seu desempenho e acompanhe seus resultados.',
                      style: TextStyle(fontSize: 12.5, height: 1.35, color: c.texto2)),
                ]),
              ),
            ]),
          ),
          const SizedBox(height: 18),
          LinhaChips([
            for (var i = 0; i < _periodos.length; i++)
              FiltroChip(_periodos[i], _periodo == i, () => setState(() => _periodo = i)),
          ]),

          titulo('Seu desempenho'),
          Superficie(
            padding: const EdgeInsets.fromLTRB(16, 16, 12, 12),
            child: serie.length < 2
                ? const VazioView(Icons.timeline_rounded, 'Poucos dados',
                    'Ainda não há avaliações suficientes neste período.')
                : GraficoLinha(
                    rotulos: [for (final e in serie) '${e.$1.day}/${e.$1.month}'],
                    series: [SerieLinha('Desempenho', [for (final e in serie) e.$2], c.primaria)],
                    casas: 0,
                    unidade: '%',
                  ),
          ),

          titulo('Frequência mensal'),
          Superficie(
            padding: const EdgeInsets.fromLTRB(14, 16, 14, 10),
            child: BarrasVerticais(
              rotulos: rotMes,
              valores: valMes,
              cor: c.primaria,
              altura: 100,
              destaque: 5,
              formato: (v) => v == 0 ? '' : '${v.round()}%',
            ),
          ),
          const SizedBox(height: 12),
          Row(children: [
            cartaoResumo(Icons.fitness_center_rounded, 'Treinos realizados', '$treinos'),
            const SizedBox(width: 10),
            cartaoResumo(Icons.flag_rounded, 'Metas atingidas', '$atingidas/${metas.length}'),
          ]),

          titulo('Avaliação física',
              acao: 'Ver detalhes',
              onAcao: () => abrir(context, const TestesPage(treinador: false))),
          Superficie(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
            child: Column(children: [
              Row(children: [
                Expanded(
                  child: Text('Condição geral',
                      style: TextStyle(
                          fontSize: 14, fontWeight: FontWeight.w700, color: c.texto)),
                ),
                if (variacao != null)
                  Pilula('${variacao >= 0 ? '+' : ''}${variacao.round()}%',
                      variacao >= 0 ? c.ok : c.rosa),
              ]),
              const SizedBox(height: 4),
              Align(
                alignment: Alignment.centerLeft,
                child: Text(atual == null ? 'Sem avaliações' : _classe(atual),
                    style: TextStyle(fontSize: 12, color: c.texto2)),
              ),
              const SizedBox(height: 12),
              if (serie.length >= 2)
                SizedBox(
                  height: 70,
                  child: Sparkline([for (final e in serie) e.$2], c.primaria,
                      largura: double.infinity, altura: 70),
                ),
              const SizedBox(height: 12),
              Divider(height: 1, color: c.linha),
              const SizedBox(height: 14),
              Row(children: [
                indicador('VO2 Máx', vo2 == null ? '—' : vo2.toStringAsFixed(0), 'ml/kg/min',
                    vo2 == null ? 'Sem teste' : classeVo2(vo2)),
                Container(width: 1, height: 64, color: c.linha),
                indicador('IMC', imc == null ? '—' : imc.toStringAsFixed(1), null,
                    imc == null ? 'Sem dados' : classeImc(imc),
                    cor: imc != null && imc >= 18.5 && imc < 25 ? c.ok : c.texto2),
                Container(width: 1, height: 64, color: c.linha),
                indicador('Gordura corporal', '—', null, 'Não avaliado'),
              ]),
            ]),
          ),

          titulo('Últimas avaliações'),
          if (ultimas.isEmpty)
            const VazioView(Icons.assignment_outlined, 'Sem avaliações',
                'Suas avaliações físicas aparecerão aqui.')
          else
            for (final e in ultimas)
              Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Superficie(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  child: Row(children: [
                    Icon(Icons.event_note_outlined, size: 20, color: c.texto2),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(dataBr(e.$1),
                          style: TextStyle(
                              fontSize: 14, fontWeight: FontWeight.w600, color: c.texto)),
                    ),
                    Pilula(_classe(e.$2), e.$2 >= 50 ? c.ok : c.rosa),
                  ]),
                ),
              ),

          titulo('Histórico recente'),
          if (historico.isEmpty)
            const VazioView(Icons.history_rounded, 'Sem registros', 'Nada registrado nos últimos dias.')
          else
            for (final x in historico)
              Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Superficie(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  child: Row(children: [
                    Container(
                      width: 38,
                      height: 38,
                      decoration: BoxDecoration(
                          color: c.suave(c.primaria), borderRadius: BorderRadius.circular(12)),
                      child: Icon(x.icone, size: 19, color: c.primaria),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(x.titulo,
                          style: TextStyle(
                              fontSize: 14, fontWeight: FontWeight.w600, color: c.texto)),
                    ),
                    Text(_relDia(x.data), style: TextStyle(fontSize: 12, color: c.texto2)),
                  ]),
                ),
              ),

          titulo('Relatórios'),
          LinhaChips([
            for (var i = 0; i < _relatorios.length; i++)
              FiltroChip(_relatorios[i], _relatorio == i, () => setState(() => _relatorio = i)),
          ]),
          const SizedBox(height: 12),
          Superficie(
            padding: const EdgeInsets.fromLTRB(14, 16, 14, 10),
            child: BarrasVerticais(
              key: ValueKey(_relatorio),
              rotulos: rotRel,
              valores: valRel,
              cor: c.primaria,
              altura: 100,
              formato: (v) => v == 0 ? '' : '${v.round()}',
            ),
          ),
          const SizedBox(height: 14),
          OutlinedButton.icon(
            style: OutlinedButton.styleFrom(
              minimumSize: const Size.fromHeight(48),
              foregroundColor: c.primaria,
              side: BorderSide(color: c.primaria.withValues(alpha: 0.5)),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
            onPressed: () =>
                aviso(context, 'A exportação de relatórios ainda não está disponível.'),
            icon: const Icon(Icons.file_download_outlined, size: 19),
            label: const Text('Exportar relatório'),
          ),

          // Mantidos da versão atual: metas e feedbacks recebidos.
          titulo('Minhas metas'),
          MetasAtletaLeitura(atleta: a),
          titulo('Feedbacks do treinador'),
          FeedbacksRecebidos(atleta: a),
        ]);
      },
    );
  }
}
