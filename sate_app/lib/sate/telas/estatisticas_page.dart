import 'package:flutter/material.dart';

import '../data/modelos.dart';
import '../data/sate_store.dart';
import '../ui/cores.dart';
import '../ui/tela.dart';
import '../ui/widgets.dart';

/// Gráficos e estatísticas de desempenho do treinador.
class EstatisticasPage extends StatefulWidget {
  final bool embutido;
  const EstatisticasPage({super.key, this.embutido = false});

  @override
  State<EstatisticasPage> createState() => _EstatisticasPageState();
}

class _EstatisticasPageState extends State<EstatisticasPage> {
  int _aba = 0;
  String _atletaId = 'a1';
  String _teste = catalogoTestes.first.nome;
  int _periodo = 1; // 0=3m 1=6m 2=tudo
  final Set<String> _comparar = {'a1', 'a2'};
  String? _equipe = 'eq1';

  List<ResultadoTeste> _filtra(List<ResultadoTeste> r) {
    if (_periodo == 2) return r;
    final lim = somaDias(SateStore.i.hoje, _periodo == 0 ? -92 : -183);
    return r.where((x) => !x.data.isBefore(lim)).toList();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: SateStore.i,
      builder: (context, _) {
        final c = context.sc;
        return corpoDeTela(
          embutido: widget.embutido,
          titulo: 'Gráficos e',
          destaque: 'estatísticas',
          children: [
            LinhaChips([
              for (final e in const ['Individual', 'Comparação', 'Coletivo', 'Frequência'].asMap().entries)
                FiltroChip(e.value, _aba == e.key, () => setState(() => _aba = e.key)),
            ]),
            const SizedBox(height: 16),
            if (_aba == 0) ..._individual(c),
            if (_aba == 1) ..._comparacao(c),
            if (_aba == 2) ..._coletivo(c),
            if (_aba == 3) ..._frequencia(c),
          ],
        );
      },
    );
  }

  Future<void> _escolherAtletas(bool multi) async {
    final s = SateStore.i;
    final r = await abrirSeletor<String>(
      context,
      titulo: multi ? 'Comparar atletas (até 4)' : 'Escolher atleta',
      multi: multi,
      atuais: multi ? _comparar.toList() : [_atletaId],
      itens: [
        for (final a in s.atletas)
          ItemSel(a.id, a.nome, sub: s.equipe(a.equipeId).nome, avatar: a.nome),
      ],
    );
    if (r == null || r.isEmpty) return;
    setState(() {
      if (multi) {
        _comparar
          ..clear()
          ..addAll(r);
      } else {
        _atletaId = r.first;
      }
    });
  }

  Future<void> _escolherTeste() async {
    final r = await abrirSeletor<String>(
      context,
      titulo: 'Escolher teste',
      busca: false,
      atuais: [_teste],
      itens: [
        for (final t in catalogoTestes.where((t) => t.modalidade == null))
          ItemSel(t.nome, t.nome, sub: t.categoria),
      ],
    );
    if (r != null && r.isNotEmpty) setState(() => _teste = r.first);
  }

  /// Etapa 1: quem (opcional) e qual teste, em dois seletores compactos.
  Widget _linhaSeletores({bool atleta = true, bool multi = false}) {
    final s = SateStore.i;
    String valorAtleta;
    if (multi) {
      final nomes = s.atletas
          .where((a) => _comparar.contains(a.id))
          .map((a) => a.nome.split(' ').first)
          .toList();
      valorAtleta = nomes.length <= 2
          ? nomes.join(', ')
          : '${nomes.take(2).join(', ')} +${nomes.length - 2}';
    } else {
      valorAtleta = s.atletas.firstWhere((x) => x.id == _atletaId).nome;
    }
    return Row(children: [
      if (atleta) ...[
        Expanded(
          child: SeletorPill(
            rotulo: multi ? 'Atletas' : 'Atleta',
            valor: valorAtleta,
            onTap: () => _escolherAtletas(multi),
          ),
        ),
        const SizedBox(width: 10),
      ],
      Expanded(
        child: SeletorPill(rotulo: 'Teste', valor: _teste, onTap: _escolherTeste),
      ),
    ]);
  }

  Widget _seletorPeriodo() => Segmentos(
        rotulos: const ['3 meses', '6 meses', 'Tudo'],
        indice: _periodo,
        onChanged: (v) => setState(() => _periodo = v),
      );

  TipoTeste get _tipo => catalogoTestes.firstWhere((t) => t.nome == _teste);

  List<Widget> _individual(SC c) {
    final s = SateStore.i;
    final a = s.atletas.firstWhere((x) => x.id == _atletaId);
    final tipo = _tipo;
    final res = _filtra(s.resultadosDe(a.nome, teste: tipo.nome));
    return [
      _linhaSeletores(),
      const SizedBox(height: 12),
      _seletorPeriodo(),
      const SizedBox(height: 16),
      Revela(
        child: Superficie(
          padding: const EdgeInsets.fromLTRB(16, 16, 12, 12),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('Evolução · ${a.nome}',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: c.texto)),
            Text('${tipo.nome} (${tipo.unidade})${tipo.menorMelhor ? ' · menor é melhor' : ''}',
                style: TextStyle(fontSize: 12, color: c.texto2)),
            const SizedBox(height: 12),
            if (res.length < 2)
              const VazioView(Icons.timeline_rounded, 'Poucos dados',
                  'É preciso ao menos dois resultados no período.')
            else
              GraficoLinha(
                rotulos: [for (final r in res) '${r.data.day}/${r.data.month}'],
                series: [SerieLinha(tipo.nome, [for (final r in res) r.valor], c.primaria)],
                casas: tipo.casas,
                unidade: ' ${tipo.unidade}',
              ),
          ]),
        ),
      ),
      const SizedBox(height: 18),
      const SecaoCab('Perfil físico atual'),
      GraficoRadar(
        eixos: categoriasUniversais,
        series: [SerieRadar(a.nome, s.escoresPorCategoria(a), c.primaria)],
        altura: 230,
      ),
    ];
  }

  List<Widget> _comparacao(SC c) {
    final s = SateStore.i;
    final tipo = _tipo;
    final selecionados = s.atletas.where((a) => _comparar.contains(a.id)).toList();
    final cores = c.serie;
    final series = <SerieLinha>[];
    List<String> rotulos = [];
    for (var i = 0; i < selecionados.length; i++) {
      final r = _filtra(s.resultadosDe(selecionados[i].nome, teste: tipo.nome));
      if (r.isEmpty) continue;
      if (rotulos.length < r.length) {
        rotulos = [for (final x in r) '${x.data.day}/${x.data.month}'];
      }
      series.add(SerieLinha(selecionados[i].nome.split(' ').first,
          [for (final x in r) x.valor], cores[i % cores.length]));
    }
    // Ranking por último resultado de todos os atletas que fazem o teste.
    final ranking = <(String, double)>[];
    for (final a in s.atletas) {
      final r = s.resultadosDe(a.nome, teste: tipo.nome);
      if (r.isNotEmpty) ranking.add((a.nome.split(' ').first, r.last.valor));
    }
    ranking.sort((x, y) => tipo.menorMelhor ? x.$2.compareTo(y.$2) : y.$2.compareTo(x.$2));
    final maxV = ranking.isEmpty ? 1.0 : ranking.map((e) => e.$2).reduce((a, b) => a > b ? a : b);

    return [
      _linhaSeletores(multi: true),
      const SizedBox(height: 12),
      _seletorPeriodo(),
      const SizedBox(height: 16),
      Superficie(
        padding: const EdgeInsets.fromLTRB(16, 16, 12, 12),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('${tipo.nome} · comparação',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: c.texto)),
          const SizedBox(height: 8),
          Legenda([for (final x in series) (x.nome, x.cor)]),
          const SizedBox(height: 12),
          if (series.isEmpty)
            const VazioView(Icons.compare_arrows_rounded, 'Sem dados', 'Nenhum resultado no período.')
          else
            GraficoLinha(
              rotulos: rotulos,
              series: series,
              casas: tipo.casas,
              unidade: ' ${tipo.unidade}',
            ),
        ]),
      ),
      const SizedBox(height: 18),
      const SecaoCab('Perfil físico comparado'),
      GraficoRadar(
        eixos: categoriasUniversais,
        series: [
          for (var i = 0; i < selecionados.length; i++)
            SerieRadar(selecionados[i].nome, s.escoresPorCategoria(selecionados[i]),
                cores[i % cores.length]),
        ],
        altura: 240,
      ),
      const SizedBox(height: 18),
      SecaoCab('Ranking · ${tipo.nome}'),
      const SizedBox(height: 6),
      BarrasRanking(
        itens: ranking.take(8).toList(),
        maximo: maxV,
        cor: c.primaria,
        formato: (v) => '${v.toStringAsFixed(tipo.casas)} ${tipo.unidade}',
      ),
    ];
  }

  List<Widget> _coletivo(SC c) {
    final s = SateStore.i;
    final grupo = s.atletasDaEquipe(_equipe);
    final tipo = _tipo;

    // Média do grupo por categoria (escore 0..100).
    final medias = <double>[];
    for (var i = 0; i < categoriasUniversais.length; i++) {
      var soma = 0.0;
      for (final a in grupo) {
        soma += s.escoresPorCategoria(a)[i];
      }
      medias.add(grupo.isEmpty ? 0 : soma / grupo.length * 100);
    }

    // Média do grupo no teste escolhido (k-ésimo resultado de cada atleta).
    final listas = [
      for (final a in grupo) _filtra(s.resultadosDe(a.nome, teste: tipo.nome)),
    ].where((l) => l.isNotEmpty).toList();
    final n = listas.isEmpty ? 0 : listas.map((l) => l.length).reduce((a, b) => a < b ? a : b);
    final mediaTeste = <double>[
      for (var k = 0; k < n; k++)
        listas.map((l) => l[l.length - n + k].valor).reduce((a, b) => a + b) / listas.length,
    ];
    final rot = n == 0
        ? <String>[]
        : [for (var k = 0; k < n; k++) '${listas.first[listas.first.length - n + k].data.day}/${listas.first[listas.first.length - n + k].data.month}'];

    return [
      LinhaChips([
        FiltroChip('Todos', _equipe == null, () => setState(() => _equipe = null)),
        for (final e in s.equipes)
          FiltroChip(e.nome, _equipe == e.id, () => setState(() => _equipe = e.id)),
      ]),
      const SizedBox(height: 12),
      _linhaSeletores(atleta: false),
      const SizedBox(height: 12),
      _seletorPeriodo(),
      const SizedBox(height: 16),
      Superficie(
        padding: const EdgeInsets.fromLTRB(16, 16, 12, 12),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('Média do grupo · ${tipo.nome}',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: c.texto)),
          Text('${grupo.length} atletas', style: TextStyle(fontSize: 12, color: c.texto2)),
          const SizedBox(height: 12),
          if (n < 2)
            const VazioView(Icons.groups_rounded, 'Poucos dados', 'Sem resultados suficientes no período.')
          else
            GraficoLinha(
              rotulos: rot,
              series: [SerieLinha('Média', mediaTeste, c.primaria)],
              casas: tipo.casas,
              unidade: ' ${tipo.unidade}',
            ),
        ]),
      ),
      const SizedBox(height: 18),
      const SecaoCab('Desempenho coletivo por categoria'),
      const SizedBox(height: 10),
      BarrasVerticais(
        rotulos: [for (final x in categoriasUniversais) x.split(' ').first.substring(0, x.split(' ').first.length.clamp(0, 6).toInt())],
        valores: medias,
        cor: c.rosa,
        altura: 120,
        formato: (v) => '${v.round()}',
      ),
      const SizedBox(height: 6),
      Text('Escore médio de 0 a 100 em relação à faixa de referência de cada teste.',
          style: TextStyle(fontSize: 11.5, color: c.texto2)),
    ];
  }

  List<Widget> _frequencia(SC c) {
    final s = SateStore.i;
    final h = s.hoje;
    final grupo = s.atletasDaEquipe(_equipe);
    final pcts = <double>[];
    final rot = <String>[];
    for (var k = 5; k >= 0; k--) {
      final m = DateTime(h.year, h.month - k);
      rot.add(mesesCurtos[m.month - 1]);
      pcts.add((s.pct(grupo, m, DateTime(m.year, m.month + 1, 0)) ?? 0) * 100);
    }
    final ini = somaDias(h, -90);
    final rank = <(String, double)>[];
    for (final a in grupo) {
      final p = s.pct([a], ini, h);
      if (p != null) rank.add((a.nome.split(' ').first, p * 100));
    }
    rank.sort((x, y) => y.$2.compareTo(x.$2));
    final geral = s.pct(grupo, ini, h);

    return [
      LinhaChips([
        FiltroChip('Todos', _equipe == null, () => setState(() => _equipe = null)),
        for (final e in s.equipes)
          FiltroChip(e.nome, _equipe == e.id, () => setState(() => _equipe = e.id)),
      ]),
      const SizedBox(height: 16),
      Superficie(
        child: Row(children: [
          AnelPct(
            valor: geral ?? 0,
            tamanho: 84,
            espessura: 9,
            cor: c.ok,
            centro: Text(geral == null ? '—' : '${(geral * 100).round()}%',
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700, color: c.texto)),
          ),
          const SizedBox(width: 18),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Presença nos últimos 90 dias',
                  style: TextStyle(fontSize: 14.5, fontWeight: FontWeight.w700, color: c.texto)),
              const SizedBox(height: 4),
              Text('${grupo.length} atletas considerados',
                  style: TextStyle(fontSize: 12.5, color: c.texto2)),
            ]),
          ),
        ]),
      ),
      const SizedBox(height: 18),
      const SecaoCab('Evolução mensal'),
      const SizedBox(height: 8),
      Superficie(
        padding: const EdgeInsets.fromLTRB(16, 16, 12, 12),
        child: GraficoLinha(
          rotulos: rot,
          series: [SerieLinha('Presença', pcts, c.ok)],
          casas: 0,
          unidade: '%',
        ),
      ),
      const SizedBox(height: 18),
      const SecaoCab('Ranking de presença'),
      const SizedBox(height: 6),
      BarrasRanking(
        itens: rank,
        maximo: 100,
        cor: c.ok,
        formato: (v) => '${v.round()}%',
      ),
    ];
  }
}
