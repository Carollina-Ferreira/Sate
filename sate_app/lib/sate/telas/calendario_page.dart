import 'package:flutter/material.dart';

import '../data/modelos.dart';
import '../data/sate_store.dart';
import '../ui/cores.dart';
import '../ui/tela.dart';
import '../ui/widgets.dart';
import 'evento_page.dart';
import 'planejamento_page.dart';

/// Calendário de frequência (mensal e anual), individual ou da equipe.
class CalendarioPage extends StatefulWidget {
  final bool treinador;
  final bool comVoltar;
  const CalendarioPage({super.key, required this.treinador, this.comVoltar = false});

  @override
  State<CalendarioPage> createState() => _CalendarioPageState();
}

class _CalendarioPageState extends State<CalendarioPage> {
  int _modo = 0;
  late DateTime _mes;
  late DateTime _sel;
  late String _escopo;

  @override
  void initState() {
    super.initState();
    final h = SateStore.i.hoje;
    _mes = DateTime(h.year, h.month);
    _sel = h;
    _escopo = widget.treinador ? 'all' : 'at:eu';
  }

  List<(String, String)> _escopos(SateStore s) {
    if (!widget.treinador) {
      return [('Minha frequência', 'at:eu')];
    }
    return [
      ('Todos', 'all'),
      for (final e in s.equipes) (e.nome, 'eq:${e.id}'),
      for (final a in s.atletas) (a.nome.split(' ').first, 'at:${a.id}'),
    ];
  }

  List<Atleta> _lista(SateStore s) {
    if (_escopo == 'all') return s.atletas;
    final id = _escopo.substring(3);
    if (_escopo.startsWith('eq:')) return s.atletasDaEquipe(id);
    if (id == 'eu') return [s.eu];
    return s.atletas.where((a) => a.id == id).toList();
  }

  bool get _individual => _escopo.startsWith('at:');

  /// null = todas as equipes.
  Set<String>? _equipesEscopo(List<Atleta> lista) =>
      _escopo == 'all' ? null : lista.map((a) => a.equipeId).toSet();

  List<AtividadeDia> _atividades(SateStore s, List<Atleta> lista, DateTime d) {
    if (_individual) {
      return lista.isEmpty ? <AtividadeDia>[] : s.atividadesNoDia(d, atleta: lista.first);
    }
    return s.atividadesNoDia(d, equipeIds: _equipesEscopo(lista));
  }

  StatusPres _statusDia(SateStore s, List<Atleta> lista, DateTime d) {
    var ok = 0, falta = 0, pend = 0;
    for (final a in lista) {
      switch (s.statusAtleta(a, d)) {
        case StatusPres.realizado:
          ok++;
        case StatusPres.naoRealizado:
          falta++;
        case StatusPres.pendente:
          pend++;
        case StatusPres.semTreino:
          break;
      }
    }
    if (ok + falta + pend == 0) return StatusPres.semTreino;
    if (ok + falta == 0) return StatusPres.pendente;
    return ok / (ok + falta) >= 0.6 ? StatusPres.realizado : StatusPres.naoRealizado;
  }

  Color _cor(SC c, StatusPres st) => switch (st) {
        StatusPres.realizado => c.ok,
        StatusPres.naoRealizado => c.falta,
        StatusPres.pendente => c.pendente,
        StatusPres.semTreino => c.vazio,
      };

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: SateStore.i,
      builder: (context, _) {
        final s = SateStore.i;
        final c = context.sc;
        final lista = _lista(s);
        final escopos = _escopos(s);
        return Tela(
          voltar: widget.comVoltar,
          mostrarTitulo: widget.comVoltar,
          titulo: 'Calendário de',
          destaque: 'frequência',
          subtitulo: _individual ? 'Frequência individual' : 'Frequência da equipe',
          children: [
            Segmentos(
              rotulos: const ['Mensal', 'Anual'],
              indice: _modo,
              onChanged: (v) => setState(() => _modo = v),
            ),
            const SizedBox(height: 12),
            if (widget.treinador) ...[
              LinhaChips([
                for (final e in escopos)
                  FiltroChip(e.$1, _escopo == e.$2, () => setState(() => _escopo = e.$2)),
              ]),
              const SizedBox(height: 16),
            ],
            if (_modo == 0)
              ..._mensal(context, s, c, lista)
            else
              ..._anual(context, s, c, lista),
            const SizedBox(height: 14),
            Legenda([
              ('Realizado', c.ok),
              ('Não realizado', c.falta),
              ('Sem treino', c.vazio),
            ]),
            if (_modo == 0) ...[
              const SizedBox(height: 8),
              Legenda([
                ('Jogo', corTipoEv(c, TipoEv.jogo)),
                ('Avaliação', corTipoEv(c, TipoEv.avaliacao)),
                ('Reunião', corTipoEv(c, TipoEv.reuniao)),
                ('Lembrete', corTipoEv(c, TipoEv.lembrete)),
              ]),
            ],
          ],
        );
      },
    );
  }

  // ───────── Mensal ─────────

  List<Widget> _mensal(BuildContext context, SateStore s, SC c, List<Atleta> lista) {
    final primeiro = DateTime(_mes.year, _mes.month);
    final ultimo = DateTime(_mes.year, _mes.month + 1, 0);
    final pct = s.pct(lista, primeiro, ultimo);
    final cont = s.contagem(lista, primeiro, ultimo);
    final deslocamento = primeiro.weekday - 1;
    final linhas = ((deslocamento + ultimo.day) / 7).ceil();

    Widget celula(int dia) {
      final d = DateTime(_mes.year, _mes.month, dia);
      final st = _statusDia(s, lista, d);
      final marcas = _atividades(s, lista, d)
          .where((x) => x.evento != null)
          .map((x) => corTipoEv(c, x.evento!.tipo))
          .toSet()
          .take(3)
          .toList();
      final selecionado = d == _sel;
      final ehHoje = d == s.hoje;
      return Expanded(
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: () => setState(() => _sel = d),
          child: Container(
            height: 48,
            margin: const EdgeInsets.all(2),
            decoration: BoxDecoration(
              color: selecionado ? c.primariaSuave : Colors.transparent,
              borderRadius: BorderRadius.circular(14),
              border: ehHoje ? Border.all(color: c.texto, width: 1.5) : null,
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  '$dia',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: selecionado || ehHoje ? FontWeight.w700 : FontWeight.w500,
                    color: st == StatusPres.semTreino ? c.texto2 : c.texto,
                  ),
                ),
                const SizedBox(height: 4),
                SizedBox(
                  height: 8,
                  child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                    if (st != StatusPres.semTreino && st != StatusPres.pendente)
                      Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color: st == StatusPres.pendente ? Colors.transparent : _cor(c, st),
                          shape: BoxShape.circle,
                          border: st == StatusPres.pendente
                              ? Border.all(color: c.pendente, width: 2)
                              : null,
                        ),
                      ),
                    for (final m in marcas)
                      Container(
                        width: 9,
                        height: 3.5,
                        margin: const EdgeInsets.only(left: 3),
                        decoration: BoxDecoration(
                            color: m, borderRadius: BorderRadius.circular(2)),
                      ),
                  ]),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return [
      Row(children: [
        BotaoIcone(
          icone: Icons.chevron_left_rounded,
          onTap: () => setState(() => _mes = DateTime(_mes.year, _mes.month - 1)),
        ),
        Expanded(
          child: Text(
            '${mesesLongos[_mes.month - 1]} ${_mes.year}',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700, color: c.texto),
          ),
        ),
        BotaoIcone(
          icone: Icons.chevron_right_rounded,
          onTap: () => setState(() => _mes = DateTime(_mes.year, _mes.month + 1)),
        ),
      ]),
      const SizedBox(height: 14),
      Revela(
        child: Superficie(
          child: Row(children: [
            AnelPct(
              valor: pct ?? 0,
              tamanho: 84,
              espessura: 9,
              cor: c.ok,
              centro: Text(
                pct == null ? '—' : '${(pct * 100).round()}%',
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700, color: c.texto),
              ),
            ),
            const SizedBox(width: 18),
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Presença no mês',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: c.texto)),
                const SizedBox(height: 6),
                Text(
                  cont.total == 0
                      ? 'Sem treinos concluídos neste mês.'
                      : '${cont.ok} presenças em ${cont.total} treinos registrados',
                  style: TextStyle(fontSize: 12.5, color: c.texto2),
                ),
              ]),
            ),
          ]),
        ),
      ),
      const SizedBox(height: 16),
      Row(children: [
        for (final d in diasSemanaCurtos)
          Expanded(
            child: Center(
              child: Text(d.substring(0, 1),
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: c.texto2)),
            ),
          ),
      ]),
      const SizedBox(height: 4),
      for (var r = 0; r < linhas; r++)
        Row(children: [
          for (var col = 0; col < 7; col++)
            () {
              final dia = r * 7 + col - deslocamento + 1;
              if (dia < 1 || dia > ultimo.day) {
                return const Expanded(child: SizedBox(height: 52));
              }
              return celula(dia);
            }(),
        ]),
      const SizedBox(height: 18),
      _painelDia(context, s, c, lista),
    ];
  }

  Widget _painelDia(BuildContext context, SateStore s, SC c, List<Atleta> lista) {
    final atividades = _atividades(s, lista, _sel);
    final participantes = lista.where((a) => s.treinosDoAtleta(a, _sel).isNotEmpty).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(children: [
          Expanded(
            child: Text(
              '${diasSemanaLongos[_sel.weekday - 1]}, ${_sel.day} de ${mesesLongos[_sel.month - 1].toLowerCase()}',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: c.texto),
            ),
          ),
          if (widget.treinador)
            TextButton.icon(
              onPressed: () => editarEvento(context, data: _sel),
              icon: Icon(Icons.add_rounded, size: 18, color: c.rosa),
              label: Text('Evento', style: TextStyle(color: c.rosa, fontWeight: FontWeight.w600)),
            ),
        ]),
        const SizedBox(height: 8),
        if (atividades.isEmpty)
          Superficie(
            child: Row(children: [
              Icon(Icons.event_busy_rounded, color: c.vazio),
              const SizedBox(width: 12),
              Text('Nada programado para este dia.',
                  style: TextStyle(fontSize: 13.5, color: c.texto2)),
            ]),
          )
        else
          for (final a in atividades)
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: _CartaoAtividade(
                a: a,
                onTap: () {
                  if (a.treino != null) {
                    abrir(
                      context,
                      TreinoDetalhePage(
                        treinoId: a.treino!.id,
                        data: a.treino!.data,
                        treinador: widget.treinador,
                      ),
                    );
                  } else if (a.evento != null) {
                    abrir(context,
                        EventoDetalhePage(eventoId: a.evento!.id, treinador: widget.treinador));
                  }
                },
              ),
            ),
        if (participantes.isNotEmpty) ...[
          const SizedBox(height: 10),
          Text(widget.treinador ? 'Chamada' : 'Minha presença',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: c.texto)),
          if (!widget.treinador)
            Padding(
              padding: const EdgeInsets.only(top: 2),
              child: Text('A presença é registrada pelo treinador.',
                  style: TextStyle(fontSize: 11.5, color: c.texto2)),
            ),
          const SizedBox(height: 4),
          for (final a in participantes) _linhaChamada(context, s, c, a),
        ],
      ],
    );
  }

  Widget _linhaChamada(BuildContext context, SateStore s, SC c, Atleta a) {
    final st = s.statusAtleta(a, _sel);
    final podeMarcar = widget.treinador; // somente o treinador registra presença
    Widget botao(IconData i, Color cor, bool ativo, VoidCallback f) => GestureDetector(
          onTap: f,
          child: Container(
            width: 36,
            height: 36,
            margin: const EdgeInsets.only(left: 8),
            decoration: BoxDecoration(
              color: ativo ? cor : c.suave(cor),
              shape: BoxShape.circle,
            ),
            child: Icon(i, size: 19, color: ativo ? Colors.white : cor),
          ),
        );
    final presente = st == StatusPres.realizado;
    final faltou = st == StatusPres.naoRealizado;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(children: [
        AvatarIni(a.nome, tamanho: 36),
        const SizedBox(width: 12),
        Expanded(
          child: Text(a.nome,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(fontSize: 14, color: c.texto)),
        ),
        if (podeMarcar) ...[
          botao(Icons.check_rounded, c.ok, presente,
              () => s.marcarPresenca(a, _sel, presente ? null : true)),
          botao(Icons.close_rounded, c.falta, faltou,
              () => s.marcarPresenca(a, _sel, faltou ? null : false)),
        ] else if (st == StatusPres.realizado || st == StatusPres.naoRealizado)
          Pilula(
            st == StatusPres.realizado ? 'Presente' : 'Faltou',
            _cor(c, st),
          ),
      ]),
    );
  }

  // ───────── Anual ─────────

  List<Widget> _anual(BuildContext context, SateStore s, SC c, List<Atleta> lista) {
    final ano = _mes.year;
    final pctMes = <double>[];
    for (var m = 1; m <= 12; m++) {
      pctMes.add((s.pct(lista, DateTime(ano, m), DateTime(ano, m + 1, 0)) ?? 0) * 100);
    }
    final pctAno = s.pct(lista, DateTime(ano), DateTime(ano, 12, 31));
    final cont = s.contagem(lista, DateTime(ano), DateTime(ano, 12, 31));

    Widget mini(int mes) {
      final primeiro = DateTime(ano, mes);
      final n = DateTime(ano, mes + 1, 0).day;
      final desl = primeiro.weekday - 1;
      final linhas = ((desl + n) / 7).ceil();
      return GestureDetector(
        onTap: () => setState(() {
          _mes = primeiro;
          _sel = primeiro;
          _modo = 0;
        }),
        child: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: c.superficie,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(children: [
                Expanded(
                  child: Text(mesesCurtos[mes - 1],
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: c.texto)),
                ),
                Text('${pctMes[mes - 1].round()}%',
                    style: TextStyle(fontSize: 11.5, color: c.texto2)),
              ]),
              const SizedBox(height: 6),
              for (var r = 0; r < linhas; r++)
                Row(children: [
                  for (var col = 0; col < 7; col++)
                    () {
                      final dia = r * 7 + col - desl + 1;
                      Color cor = Colors.transparent;
                      if (dia >= 1 && dia <= n) {
                        final st = _statusDia(s, lista, DateTime(ano, mes, dia));
                        cor = st == StatusPres.semTreino
                            ? c.vazio.withValues(alpha: 0.25)
                            : _cor(c, st);
                      }
                      return Expanded(
                        child: Container(
                          height: 9,
                          margin: const EdgeInsets.all(1.5),
                          decoration: BoxDecoration(
                              color: cor, borderRadius: BorderRadius.circular(3)),
                        ),
                      );
                    }(),
                ]),
            ],
          ),
        ),
      );
    }

    return [
      Row(children: [
        BotaoIcone(
          icone: Icons.chevron_left_rounded,
          onTap: () => setState(() => _mes = DateTime(_mes.year - 1, _mes.month)),
        ),
        Expanded(
          child: Text('$ano',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700, color: c.texto)),
        ),
        BotaoIcone(
          icone: Icons.chevron_right_rounded,
          onTap: () => setState(() => _mes = DateTime(_mes.year + 1, _mes.month)),
        ),
      ]),
      const SizedBox(height: 14),
      Revela(
        child: Superficie(
          child: Row(children: [
            AnelPct(
              valor: pctAno ?? 0,
              tamanho: 84,
              espessura: 9,
              cor: c.ok,
              centro: Text(pctAno == null ? '—' : '${(pctAno * 100).round()}%',
                  style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700, color: c.texto)),
            ),
            const SizedBox(width: 18),
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Presença no ano',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: c.texto)),
                const SizedBox(height: 6),
                Text('${cont.ok} presenças em ${cont.total} treinos registrados',
                    style: TextStyle(fontSize: 12.5, color: c.texto2)),
              ]),
            ),
          ]),
        ),
      ),
      const SizedBox(height: 18),
      const SecaoCab('Presença por mês'),
      const SizedBox(height: 10),
      BarrasVerticais(
        rotulos: mesesCurtos,
        valores: pctMes,
        cor: c.primaria,
        maximo: 100,
        altura: 110,
        destaque: DateTime.now().year == ano ? DateTime.now().month - 1 : null,
        formato: (v) => v == 0 ? '' : '${v.round()}',
      ),
      const SizedBox(height: 18),
      const SecaoCab('Meses do ano'),
      const SizedBox(height: 10),
      for (var r = 0; r < 6; r++)
        Padding(
          padding: const EdgeInsets.only(bottom: 10),
          child: Row(children: [
            Expanded(child: mini(r * 2 + 1)),
            const SizedBox(width: 10),
            Expanded(child: mini(r * 2 + 2)),
          ]),
        ),
    ];
  }
}

class _CartaoAtividade extends StatelessWidget {
  final AtividadeDia a;
  final VoidCallback onTap;
  const _CartaoAtividade({required this.a, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final cor = a.evento != null ? corTipoEv(c, a.evento!.tipo) : c.primaria;
    return Superficie(
      onTap: onTap,
      padding: const EdgeInsets.all(12),
      child: Row(children: [
        Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(color: c.suave(cor), borderRadius: BorderRadius.circular(14)),
          child: Icon(a.icone, color: cor, size: 22),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(a.titulo,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(fontSize: 14.5, fontWeight: FontWeight.w600, color: c.texto)),
            const SizedBox(height: 2),
            Text(
              '${horaTxt(a.inicioMin)}${a.fimMin == null ? '' : ' – ${horaTxt(a.fimMin!)}'} · ${a.subtitulo}',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(fontSize: 12, color: c.texto2),
            ),
          ]),
        ),
        const SizedBox(width: 8),
        Pilula(a.tipoRotulo, cor),
      ]),
    );
  }
}
