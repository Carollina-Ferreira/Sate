import 'package:flutter/material.dart';

import '../data/modelos.dart';
import '../data/sate_store.dart';
import '../ui/cores.dart';
import '../ui/tela.dart';
import '../ui/widgets.dart';
import 'documentos_page.dart';
import 'planos_page.dart';
import 'testes_page.dart';

double? _pctMes(Atleta a) {
  final h = SateStore.i.hoje;
  return SateStore.i.pct([a], somaDias(h, -30), h);
}

/// Presença em verde (bom) ou rosa (atenção), sem tons fora da identidade.
Color _corPct(SC c, double? p) =>
    p == null ? c.vazio : (p >= 0.6 ? c.primaria : c.rosa);

// ───────────────────────── Lista de atletas (cards individuais) ─────────────────────────

class AtletasListaView extends StatefulWidget {
  const AtletasListaView({super.key});

  @override
  State<AtletasListaView> createState() => _AtletasListaViewState();
}

class _AtletasListaViewState extends State<AtletasListaView> {
  String? _equipe;
  String _busca = '';

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return AnimatedBuilder(
      animation: SateStore.i,
      builder: (context, _) {
        final s = SateStore.i;
        final lista = s.atletasDaEquipe(_equipe)
            .where((a) => a.nome.toLowerCase().contains(_busca.toLowerCase()))
            .toList();
        return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          if (s.excedeuLimite) ...[
            Superficie(
              cor: c.suave(c.rosa),
              onTap: () => abrir(context, const PlanosSatePage()),
              child: Row(children: [
                Icon(Icons.workspace_premium_outlined, color: c.rosa),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('Limite de atletas excedido',
                        style: TextStyle(
                            fontSize: 14, fontWeight: FontWeight.w700, color: c.texto)),
                    Text('${s.totalAtletas} atletas para um limite de ${s.plano.limite}. Conheça os planos.',
                        style: TextStyle(fontSize: 12, height: 1.35, color: c.texto2)),
                  ]),
                ),
                Icon(Icons.chevron_right_rounded, color: c.rosa),
              ]),
            ),
            const SizedBox(height: 14),
          ],
          Row(children: [
            Expanded(
              child: TextField(
                onChanged: (v) => setState(() => _busca = v),
                decoration: decoracaoCampo(context, 'Buscar atleta').copyWith(
                  prefixIcon: Icon(Icons.search_rounded, color: c.texto2),
                ),
              ),
            ),
            const SizedBox(width: 10),
            BotaoIcone(
              icone: Icons.person_add_alt_1_rounded,
              destaque: true,
              dica: 'Novo atleta',
              onTap: () => novoAtleta(context),
            ),
          ]),
          const SizedBox(height: 12),
          LinhaChips([
            FiltroChip('Todos', _equipe == null, () => setState(() => _equipe = null)),
            for (final e in s.equipes)
              FiltroChip(e.nome, _equipe == e.id, () => setState(() => _equipe = e.id)),
          ]),
          const SizedBox(height: 14),
          if (lista.isEmpty)
            const VazioView(Icons.groups_rounded, 'Nenhum atleta', 'Ajuste a busca ou o filtro.')
          else
            for (var i = 0; i < lista.length; i++)
              Revela(
                ordem: i.clamp(0, 6).toInt(),
                child: Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: _CartaoAtleta(
                    a: lista[i],
                    onTap: () => abrir(context, AtletaDetalhePage(atletaId: lista[i].id)),
                  ),
                ),
              ),
        ]);
      },
    );
  }
}

class _CartaoAtleta extends StatelessWidget {
  final Atleta a;
  final VoidCallback onTap;
  const _CartaoAtleta({required this.a, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final s = SateStore.i;
    final p = _pctMes(a);
    final metas = s.metasDe(a.id);
    final concl = metas.where((m) => m.concluida).length;
    return Superficie(
      onTap: onTap,
      padding: const EdgeInsets.all(14),
      child: Column(children: [
        Row(children: [
          AvatarIni(a.nome, tamanho: 52),
          const SizedBox(width: 14),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(a.nome,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(fontSize: 15.5, fontWeight: FontWeight.w700, color: c.texto)),
              const SizedBox(height: 2),
              Text('${a.posicao} · ${s.equipe(a.equipeId).modalidade}',
                  style: TextStyle(fontSize: 12.5, color: c.texto2)),
            ]),
          ),
          Icon(Icons.chevron_right_rounded, color: c.texto2),
        ]),
        const SizedBox(height: 12),
        Row(children: [
          Expanded(child: BarraFina(valor: p ?? 0, cor: _corPct(c, p), altura: 7)),
          const SizedBox(width: 10),
          Text(p == null ? '—' : '${(p * 100).round()}%',
              style: TextStyle(
                  fontSize: 13, fontWeight: FontWeight.w700, color: _corPct(c, p))),
          const SizedBox(width: 14),
          Icon(Icons.flag_outlined, size: 15, color: c.texto2),
          const SizedBox(width: 4),
          Text('$concl/${metas.length}', style: TextStyle(fontSize: 12.5, color: c.texto2)),
        ]),
      ]),
    );
  }
}

Future<void> novoAtleta(BuildContext context) async {
  final s = SateStore.i;
  final nome = TextEditingController();
  final pos = TextEditingController();
  var equipe = s.equipes.first.id;
  final ok = await abrirFolha<bool>(context, (ctx) {
    final c = ctx.sc;
    return StatefulBuilder(
      builder: (ctx, setM) => SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20, 4, 20, 24),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('Novo atleta',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: c.texto)),
          const SizedBox(height: 16),
          TextField(controller: nome, decoration: decoracaoCampo(ctx, 'Nome do atleta')),
          const SizedBox(height: 12),
          TextField(controller: pos, decoration: decoracaoCampo(ctx, 'Posição (opcional)')),
          const SizedBox(height: 14),
          Text('Equipe', style: TextStyle(fontSize: 12.5, color: c.texto2)),
          const SizedBox(height: 8),
          Wrap(spacing: 8, runSpacing: 8, children: [
            for (final e in s.equipes)
              FiltroChip(e.nome, e.id == equipe, () => setM(() => equipe = e.id)),
          ]),
          const SizedBox(height: 20),
          FilledButton(
            style: estiloBotao(ctx),
            onPressed: () {
              if (nome.text.trim().isEmpty) {
                aviso(ctx, 'Informe o nome do atleta.');
                return;
              }
              Navigator.pop(ctx, true);
            },
            child: const Text('Adicionar atleta'),
          ),
        ]),
      ),
    );
  });
  if (ok != true) return;
  await s.adicionarAtleta(nome.text.trim(), equipe, pos.text.trim());
  if (context.mounted) {
    aviso(context, s.excedeuLimite
        ? 'Atleta adicionado. O limite do seu plano foi excedido.'
        : 'Atleta adicionado.');
  }
}

// ───────────────────────── Perfil do atleta (visão do treinador) ─────────────────────────

class AtletaDetalhePage extends StatefulWidget {
  final String atletaId;
  const AtletaDetalhePage({super.key, required this.atletaId});

  @override
  State<AtletaDetalhePage> createState() => _AtletaDetalhePageState();
}

class _AtletaDetalhePageState extends State<AtletaDetalhePage> {
  int _aba = 0;
  static const _abas = ['Resumo', 'Metas', 'Feedbacks', 'Atividade', 'Testes', 'Documentos'];

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return AnimatedBuilder(
      animation: SateStore.i,
      builder: (context, _) {
        final s = SateStore.i;
        final a = s.atletas.firstWhere((x) => x.id == widget.atletaId);
        final eq = s.equipe(a.equipeId);
        final p30 = _pctMes(a);

        return Tela(
          titulo: 'Perfil do',
          destaque: 'atleta',
          children: [
            Revela(
              child: Row(children: [
                AvatarIni(a.nome, tamanho: 68),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(a.nome,
                        style: TextStyle(
                            fontSize: 20, fontWeight: FontWeight.w700, color: c.texto)),
                    const SizedBox(height: 2),
                    Text('${a.posicao} · ${eq.nome}',
                        style: TextStyle(fontSize: 13, color: c.texto2)),
                    const SizedBox(height: 8),
                    Pilula(
                      p30 == null ? 'Sem treinos recentes' : 'Presença ${(p30 * 100).round()}%',
                      _corPct(c, p30),
                      icone: Icons.check_circle_outline_rounded,
                    ),
                  ]),
                ),
              ]),
            ),
            const SizedBox(height: 18),
            LinhaChips([
              for (var i = 0; i < _abas.length; i++)
                FiltroChip(_abas[i], _aba == i, () => setState(() => _aba = i)),
            ]),
            const SizedBox(height: 16),
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 220),
              child: KeyedSubtree(
                key: ValueKey(_aba),
                child: switch (_aba) {
                  0 => _Resumo(a: a),
                  1 => _Metas(a: a),
                  2 => _Feedbacks(a: a),
                  3 => _Atividade(a: a),
                  4 => _TestesResumo(a: a),
                  _ => _DocumentosAtleta(a: a),
                },
              ),
            ),
          ],
        );
      },
    );
  }
}

class _Resumo extends StatelessWidget {
  final Atleta a;
  const _Resumo({required this.a});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final s = SateStore.i;
    final h = s.hoje;
    final valores = <double>[];
    final rot = <String>[];
    for (var k = 5; k >= 0; k--) {
      final m = DateTime(h.year, h.month - k);
      rot.add(mesesCurtos[m.month - 1]);
      valores.add((s.pct([a], m, DateTime(m.year, m.month + 1, 0)) ?? 0) * 100);
    }
    Widget dado(String r, String v) => Expanded(
          child: Column(children: [
            Text(v, style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: c.texto)),
            Text(r, style: TextStyle(fontSize: 11.5, color: c.texto2)),
          ]),
        );
    final ultimo = s.feedbacksDe(a.id);

    // Evolução geral (como na versão anterior): média dos escores dos testes gerais.
    var atualSoma = 0.0, primSoma = 0.0, nTestes = 0;
    for (final t in s.testesDoAtleta(a).where((t) => t.modalidade == null)) {
      final r = s.resultadosDe(a.nome, teste: t.nome);
      if (r.isEmpty) continue;
      atualSoma += t.escore(r.last.valor);
      primSoma += t.escore(r.first.valor);
      nTestes++;
    }
    final desempenhoAtual = nTestes == 0 ? 0.0 : atualSoma / nTestes;
    final variacao = nTestes == 0 ? 0 : ((atualSoma - primSoma) / nTestes * 100).round();
    final p30 = _pctMes(a);

    Widget indicadorResumo(IconData i, String t, String v) => Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Row(children: [
              Icon(i, color: c.primaria, size: 23),
              const SizedBox(width: 11),
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(t, style: TextStyle(fontSize: 11, color: c.texto2)),
                  const SizedBox(height: 3),
                  Text(v,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                          fontSize: 15, fontWeight: FontWeight.w700, color: c.texto)),
                ]),
              ),
            ]),
          ),
        );

    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      const SecaoCab('Resumo'),
      const SizedBox(height: 10),
      Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(border: Border(bottom: BorderSide(color: c.linha))),
        child: Row(children: [
          indicadorResumo(Icons.calendar_month_outlined, 'Frequência',
              p30 == null ? '—' : '${(p30 * 100).round()}%'),
          Container(width: 1, height: 48, color: c.linha),
          indicadorResumo(Icons.sports_outlined, 'Modalidade',
              s.equipe(a.equipeId).modalidade),
        ]),
      ),
      const SizedBox(height: 26),
      const SecaoCab('Desempenho'),
      const SizedBox(height: 12),
      Superficie(
        padding: const EdgeInsets.all(18),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            Container(
              width: 45,
              height: 45,
              decoration: BoxDecoration(
                  color: c.suave(c.primaria), borderRadius: BorderRadius.circular(13)),
              child: Icon(Icons.trending_up_rounded, color: c.primaria, size: 23),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Evolução geral',
                    style: TextStyle(
                        fontSize: 15, fontWeight: FontWeight.w700, color: c.texto)),
                const SizedBox(height: 3),
                Text('Desempenho nos últimos treinos',
                    style: TextStyle(fontSize: 12, color: c.texto2)),
              ]),
            ),
            Pilula('${variacao >= 0 ? '+' : ''}$variacao%', variacao >= 0 ? c.ok : c.rosa),
          ]),
          const SizedBox(height: 18),
          BarraFina(valor: desempenhoAtual, cor: c.primaria, altura: 9),
          const SizedBox(height: 8),
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Text('Desempenho atual', style: TextStyle(fontSize: 11, color: c.texto2)),
            Text('${(desempenhoAtual * 100).round()}%',
                style: TextStyle(
                    fontSize: 12, fontWeight: FontWeight.w700, color: c.primaria)),
          ]),
        ]),
      ),
      const SizedBox(height: 26),
      Superficie(
        padding: const EdgeInsets.symmetric(vertical: 16),
        child: Row(children: [
          dado('Idade', '${a.idade} anos'),
          dado('Altura', '${a.alturaCm} cm'),
          dado('Peso', '${a.pesoKg.toStringAsFixed(0)} kg'),
        ]),
      ),
      const SizedBox(height: 20),
      const SecaoCab('Presença por mês'),
      const SizedBox(height: 10),
      BarrasVerticais(
        rotulos: rot,
        valores: valores,
        cor: c.primaria,
        altura: 96,
        destaque: 5,
        formato: (v) => v == 0 ? '' : '${v.round()}%',
      ),
      const SizedBox(height: 20),
      const SecaoCab('Perfil físico'),
      GraficoRadar(
        eixos: categoriasUniversais,
        series: [SerieRadar(a.nome, s.escoresPorCategoria(a), c.primaria)],
        altura: 220,
      ),
      if (ultimo.isNotEmpty) ...[
        const SizedBox(height: 8),
        const SecaoCab('Último feedback'),
        const SizedBox(height: 8),
        Superficie(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(ultimo.first.texto,
                style: TextStyle(fontSize: 13.5, height: 1.45, color: c.texto)),
            const SizedBox(height: 6),
            Text(dataHoraRel(ultimo.first.quando),
                style: TextStyle(fontSize: 11.5, color: c.texto2)),
          ]),
        ),
      ],
    ]);
  }
}

// ── Metas ──

class _Metas extends StatelessWidget {
  final Atleta a;
  const _Metas({required this.a});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final s = SateStore.i;
    final metas = s.metasDe(a.id);
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      BotaoAcao(
        icone: Icons.add_rounded,
        texto: 'Nova meta',
        onTap: () => editarMeta(context, a.id),
      ),
      const SizedBox(height: 14),
      if (metas.isEmpty)
        const VazioView(Icons.flag_outlined, 'Nenhuma meta', 'Defina a primeira meta deste atleta.')
      else
        for (final m in metas)
          Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: Superficie(
              onTap: () => editarMeta(context, a.id, atual: m),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(children: [
                  Expanded(
                    child: Text(m.titulo,
                        style: TextStyle(
                            fontSize: 15, fontWeight: FontWeight.w700, color: c.texto)),
                  ),
                  Pilula(
                    m.concluida
                        ? 'Concluída'
                        : (m.prazo.isBefore(s.hoje) ? 'Atrasada' : 'Em andamento'),
                    m.concluida ? c.ok : (m.prazo.isBefore(s.hoje) ? c.falta : c.primaria),
                  ),
                ]),
                if (m.descricao.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Text(m.descricao, style: TextStyle(fontSize: 12.5, color: c.texto2)),
                ],
                const SizedBox(height: 12),
                Row(children: [
                  Expanded(
                    child: BarraFina(
                        valor: m.progresso / 100,
                        cor: m.concluida ? c.ok : c.rosa,
                        altura: 8),
                  ),
                  const SizedBox(width: 10),
                  Text('${m.progresso}%',
                      style: TextStyle(
                          fontSize: 13, fontWeight: FontWeight.w700, color: c.texto)),
                ]),
                const SizedBox(height: 8),
                Text('Prazo: ${dataBr(m.prazo)}',
                    style: TextStyle(fontSize: 11.5, color: c.texto2)),
              ]),
            ),
          ),
    ]);
  }
}

Future<void> editarMeta(BuildContext context, String atletaId, {MetaAtleta? atual}) async {
  final s = SateStore.i;
  final titulo = TextEditingController(text: atual?.titulo ?? '');
  final desc = TextEditingController(text: atual?.descricao ?? '');
  var prazo = atual?.prazo ?? somaDias(s.hoje, 30);
  var prog = atual?.progresso ?? 0;
  var remover = false;
  final ok = await abrirFolha<bool>(context, (ctx) {
    final c = ctx.sc;
    return StatefulBuilder(
      builder: (ctx, setM) => SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20, 4, 20, 24),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(atual == null ? 'Nova meta' : 'Editar meta',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: c.texto)),
          const SizedBox(height: 16),
          TextField(controller: titulo, decoration: decoracaoCampo(ctx, 'Título da meta')),
          const SizedBox(height: 12),
          TextField(
            controller: desc,
            minLines: 2,
            maxLines: 4,
            decoration: decoracaoCampo(ctx, 'Descrição'),
          ),
          const SizedBox(height: 12),
          InkWell(
            borderRadius: BorderRadius.circular(14),
            onTap: () async {
              final d = await showDatePicker(
                context: ctx,
                initialDate: prazo,
                firstDate: DateTime(2020),
                lastDate: DateTime(2035),
              );
              if (d != null) setM(() => prazo = somenteData(d));
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
              decoration:
                  BoxDecoration(color: c.superficie, borderRadius: BorderRadius.circular(14)),
              child: Row(children: [
                Icon(Icons.event_rounded, size: 19, color: c.primaria),
                const SizedBox(width: 10),
                Text('Prazo: ${dataBr(prazo)}', style: TextStyle(color: c.texto)),
              ]),
            ),
          ),
          const SizedBox(height: 12),
          Contador(
            rotulo: 'Progresso',
            valor: prog,
            min: 0,
            max: 100,
            passo: 5,
            sufixo: '%',
            onChanged: (v) => setM(() => prog = v),
          ),
          const SizedBox(height: 20),
          FilledButton(
            style: estiloBotao(ctx),
            onPressed: () {
              if (titulo.text.trim().isEmpty) {
                aviso(ctx, 'Informe o título da meta.');
                return;
              }
              Navigator.pop(ctx, true);
            },
            child: const Text('Salvar meta'),
          ),
          if (atual != null) ...[
            const SizedBox(height: 6),
            Center(
              child: TextButton(
                onPressed: () {
                  remover = true;
                  Navigator.pop(ctx, true);
                },
                child: Text('Excluir meta', style: TextStyle(color: c.vermelho)),
              ),
            ),
          ],
        ]),
      ),
    );
  });
  if (ok != true) return;
  if (remover && atual != null) {
    await s.removerMeta(atual.id);
    return;
  }
  await s.salvarMeta(MetaAtleta(
    id: atual?.id ?? s.novoId(),
    atletaId: atletaId,
    titulo: titulo.text.trim(),
    descricao: desc.text.trim(),
    progresso: prog,
    prazo: prazo,
  ));
}

// ── Feedbacks ──

class _Feedbacks extends StatelessWidget {
  final Atleta a;
  const _Feedbacks({required this.a});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final fs = SateStore.i.feedbacksDe(a.id);
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      BotaoAcao(
        icone: Icons.send_rounded,
        texto: 'Enviar feedback',
        onTap: () => editarFeedback(context, a.id),
      ),
      const SizedBox(height: 14),
      if (fs.isEmpty)
        const VazioView(Icons.chat_bubble_outline_rounded, 'Nenhum feedback',
            'Envie o primeiro feedback para este atleta.')
      else
        for (final f in fs)
          Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: Superficie(
              child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Expanded(
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(f.texto,
                        style: TextStyle(fontSize: 13.5, height: 1.45, color: c.texto)),
                    const SizedBox(height: 8),
                    Text(dataHoraRel(f.quando),
                        style: TextStyle(fontSize: 11.5, color: c.texto2)),
                  ]),
                ),
                PopupMenuButton<String>(
                  icon: Icon(Icons.more_horiz_rounded, color: c.texto2),
                  onSelected: (v) {
                    if (v == 'e') editarFeedback(context, a.id, atual: f);
                    if (v == 'x') SateStore.i.removerFeedback(f.id);
                  },
                  itemBuilder: (_) => const [
                    PopupMenuItem(value: 'e', child: Text('Editar')),
                    PopupMenuItem(value: 'x', child: Text('Excluir')),
                  ],
                ),
              ]),
            ),
          ),
    ]);
  }
}

Future<void> editarFeedback(BuildContext context, String atletaId, {FeedbackAtleta? atual}) async {
  final s = SateStore.i;
  final texto = TextEditingController(text: atual?.texto ?? '');
  final ok = await abrirFolha<bool>(context, (ctx) {
    final c = ctx.sc;
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 4, 20, 24),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(atual == null ? 'Enviar feedback' : 'Editar feedback',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: c.texto)),
        const SizedBox(height: 16),
        TextField(
          controller: texto,
          minLines: 4,
          maxLines: 8,
          decoration: decoracaoCampo(ctx, 'Escreva seu feedback para o atleta...'),
        ),
        const SizedBox(height: 20),
        FilledButton(
          style: estiloBotao(ctx),
          onPressed: () {
            if (texto.text.trim().isEmpty) {
              aviso(ctx, 'Escreva um feedback.');
              return;
            }
            Navigator.pop(ctx, true);
          },
          child: Text(atual == null ? 'Enviar feedback' : 'Salvar'),
        ),
      ]),
    );
  });
  if (ok != true) return;
  await s.salvarFeedback(FeedbackAtleta(
    atual?.id ?? s.novoId(),
    atletaId,
    texto.text.trim(),
    atual?.quando ?? DateTime.now(),
  ));
  if (context.mounted) aviso(context, atual == null ? 'Feedback enviado.' : 'Feedback atualizado.');
}

// ── Atividade e histórico ──

class _Atividade extends StatelessWidget {
  final Atleta a;
  const _Atividade({required this.a});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final h = SateStore.i.historicoAtleta(a);
    final recentes = h.where((x) => !x.marco).take(4).toList();
    final marcos = h.where((x) => x.marco).take(8).toList();
    Widget item(({DateTime data, IconData icone, String titulo, String sub, bool marco}) x) =>
        LinhaItem(
          icone: x.icone,
          cor: x.marco ? c.rosa : c.primaria,
          titulo: x.titulo,
          sub: '${x.sub}\n${dataHoraRel(x.data)}',
        );
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      const SecaoCab('Atividades recentes'),
      const SizedBox(height: 4),
      if (recentes.isEmpty)
        const VazioView(Icons.history_rounded, 'Sem atividades', 'Nada registrado nos últimos dias.')
      else
        for (final x in recentes) item(x),
      const SizedBox(height: 18),
      const SecaoCab('Histórico importante'),
      const SizedBox(height: 4),
      for (final x in marcos) item(x),
    ]);
  }
}

// ── Testes (resumo + atalhos) ──

class _TestesResumo extends StatelessWidget {
  final Atleta a;
  const _TestesResumo({required this.a});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final s = SateStore.i;
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      BotaoAcao(
        icone: Icons.add_rounded,
        texto: 'Registrar teste',
        onTap: () => registrarTeste(context, atletaInicial: a),
      ),
      const SizedBox(height: 10),
      for (final t in s.testesDoAtleta(a))
        () {
          final r = s.resultadosDe(a.nome, teste: t.nome);
          if (r.isEmpty) return const SizedBox.shrink();
          final melhorou =
              t.menorMelhor ? r.last.valor <= r.first.valor : r.last.valor >= r.first.valor;
          return LinhaItem(
            icone: t.icone,
            cor: melhorou ? c.ok : c.falta,
            titulo: t.nome,
            sub: 'Último: ${t.formatar(r.last.valor)}',
            fim: Sparkline([for (final x in r) x.valor], melhorou ? c.ok : c.falta),
            onTap: () => abrir(context, TestesPage(treinador: true, atletaId: a.id)),
          );
        }(),
      const SizedBox(height: 10),
      OutlinedButton.icon(
        style: OutlinedButton.styleFrom(
          minimumSize: const Size.fromHeight(48),
          foregroundColor: c.primaria,
          side: BorderSide(color: c.primaria.withValues(alpha: 0.5)),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        ),
        onPressed: () => abrir(context, TestesPage(treinador: true, atletaId: a.id)),
        icon: const Icon(Icons.show_chart_rounded, size: 19),
        label: const Text('Ver evolução detalhada'),
      ),
    ]);
  }
}

// ── Documentos do atleta ──

class _DocumentosAtleta extends StatelessWidget {
  final Atleta a;
  const _DocumentosAtleta({required this.a});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final docs = SateStore.i.documentosDe(a.id);
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      BotaoAcao(
        icone: Icons.add_rounded,
        texto: 'Adicionar documento',
        onTap: () => editarDocumento(context, atletaId: a.id, fixarDono: true),
      ),
      const SizedBox(height: 10),
      if (docs.isEmpty)
        const VazioView(Icons.folder_open_rounded, 'Nenhum documento',
            'Cadastre os documentos deste atleta.')
      else
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
          decoration:
              BoxDecoration(color: c.superficie, borderRadius: BorderRadius.circular(20)),
          child: Column(children: [
            for (var i = 0; i < docs.length; i++) ...[
              if (i > 0) Divider(height: 1, color: c.linha),
              LinhaDocumento(d: docs[i], onTap: () => editarDocumento(context, atual: docs[i])),
            ],
          ]),
        ),
    ]);
  }
}
