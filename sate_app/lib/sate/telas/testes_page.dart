import 'package:flutter/material.dart';

import '../data/modelos.dart';
import '../data/sate_store.dart';
import '../ui/cores.dart';
import '../ui/tela.dart';
import '../ui/widgets.dart';

/// Testes físicos. Cada resultado pertence a um atleta; o atleta vê só os seus.
class TestesPage extends StatefulWidget {
  final bool treinador;
  final String? atletaId;
  final bool comVoltar;
  final bool embutido;
  const TestesPage({
    super.key,
    required this.treinador,
    this.atletaId,
    this.comVoltar = true,
    this.embutido = false,
  });

  @override
  State<TestesPage> createState() => _TestesPageState();
}

class _TestesPageState extends State<TestesPage> {
  late String _atletaId;
  String? _teste;
  int _vista = 0;

  @override
  void initState() {
    super.initState();
    final s = SateStore.i;
    _atletaId = widget.treinador
        ? (widget.atletaId ?? (s.atletas.isEmpty ? '' : s.atletas.first.id))
        : s.eu.id;
  }

  Atleta get _atleta {
    final s = SateStore.i;
    if (!widget.treinador) return s.eu;
    return s.atletas.firstWhere((a) => a.id == _atletaId,
        orElse: () => s.atletas.isEmpty ? s.eu : s.atletas.first);
  }

  Future<void> _escolherAtleta() async {
    final s = SateStore.i;
    final r = await abrirSeletor<String>(
      context,
      titulo: 'Escolher atleta',
      atuais: [_atletaId],
      itens: [
        for (final a in s.atletas)
          ItemSel(a.id, a.nome, sub: s.equipe(a.equipeId).nome, avatar: a.nome),
      ],
    );
    if (r != null && r.isNotEmpty) {
      setState(() {
        _atletaId = r.first;
        _teste = null;
      });
    }
  }

  Future<void> _escolherTeste(List<TipoTeste> tipos, TipoTeste atual) async {
    final r = await abrirSeletor<String>(
      context,
      titulo: 'Escolher teste',
      atuais: [atual.nome],
      busca: false,
      itens: [for (final t in tipos) ItemSel(t.nome, t.nome, sub: t.categoria)],
    );
    if (r != null && r.isNotEmpty) setState(() => _teste = r.first);
  }

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return AnimatedBuilder(
      animation: SateStore.i,
      builder: (context, _) {
        final s = SateStore.i;
        final a = _atleta;
        final tipos = s.testesDoAtleta(a);
        final tipo = tipos.firstWhere((t) => t.nome == _teste, orElse: () => tipos.first);
        final res = s.resultadosDe(a.id, teste: tipo.nome);

        // Etapa 1: quem e qual teste. Etapa 2: uma visão por vez.
        final vistas = widget.treinador
            ? const ['Evolução', 'Histórico', 'Perfil']
            : const ['Testes', 'Metas', 'Feedbacks'];

        Widget conteudo() {
          if (widget.treinador) {
            return switch (_vista) {
              0 => _EvolucaoTeste(tipo: tipo, res: res),
              1 => res.isEmpty
                  ? const VazioView(Icons.timeline_rounded, 'Sem resultados',
                      'Registre o primeiro resultado deste teste.')
                  : Column(children: [
                      for (final r in res.reversed)
                        _LinhaHistorico(r: r, tipo: tipo, pode: !r.demo),
                    ]),
              _ => _PerfilRadar(atleta: a),
            };
          }
          return switch (_vista) {
            0 => Column(children: [
                _EvolucaoTeste(tipo: tipo, res: res),
                const SizedBox(height: 14),
                for (final r in res.reversed.take(10))
                  _LinhaHistorico(r: r, tipo: tipo, pode: !r.demo),
              ]),
            1 => Column(children: [
                MetasAtletaLeitura(atleta: a),
                const SizedBox(height: 16),
                _PerfilRadar(atleta: a),
              ]),
            _ => FeedbacksRecebidos(atleta: a),
          };
        }

        return corpoDeTela(
          embutido: widget.embutido,
          voltar: widget.comVoltar,
          titulo: 'Testes',
          destaque: 'físicos',
          fab: !widget.embutido
              ? FloatingActionButton(
                  heroTag: null,
                  backgroundColor: c.rosa,
                  foregroundColor: Colors.white,
                  onPressed: () => registrarTeste(context,
                      atletaInicial: a, atletaFixo: !widget.treinador),
                  child: const Icon(Icons.add_rounded),
                )
              : null,
          children: [
            if (widget.treinador || _vista == 0)
              Row(children: [
                if (widget.treinador) ...[
                  Expanded(
                    child: SeletorPill(
                      rotulo: 'Atleta',
                      valor: a.nome,
                      leading: AvatarIni(a.nome, tamanho: 30),
                      onTap: _escolherAtleta,
                    ),
                  ),
                  const SizedBox(width: 10),
                ],
                Expanded(
                  child: SeletorPill(
                    rotulo: 'Teste',
                    valor: tipo.nome,
                    onTap: () => _escolherTeste(tipos, tipo),
                  ),
                ),
                if (widget.embutido) ...[
                  const SizedBox(width: 10),
                  BotaoIcone(
                    icone: Icons.add_rounded,
                    destaque: true,
                    dica: 'Registrar resultado',
                    onTap: () => registrarTeste(context,
                        atletaInicial: a, atletaFixo: !widget.treinador),
                  ),
                ],
              ]),
            if (widget.treinador || _vista == 0) const SizedBox(height: 14),
            Segmentos(
              rotulos: vistas,
              indice: _vista,
              onChanged: (i) => setState(() => _vista = i),
            ),
            const SizedBox(height: 16),
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 200),
              child: KeyedSubtree(
                key: ValueKey('${a.id}-${tipo.nome}-$_vista'),
                child: conteudo(),
              ),
            ),
          ],
        );
      },
    );
  }
}

/// Metas do atleta (somente leitura: quem define é o treinador).
class MetasAtletaLeitura extends StatelessWidget {
  final Atleta atleta;
  const MetasAtletaLeitura({super.key, required this.atleta});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final s = SateStore.i;
    final metas = s.metasDe(atleta.id);
    if (metas.isEmpty) {
      return const Superficie(
        child: VazioView(Icons.flag_outlined, 'Sem metas ainda',
            'Seu treinador pode definir metas para você.'),
      );
    }
    return Superficie(
      child: Column(children: [
        for (final m in metas)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(children: [
                Expanded(
                  child: Text(m.titulo,
                      style: TextStyle(
                          fontSize: 14, fontWeight: FontWeight.w600, color: c.texto)),
                ),
                Text('${m.progresso}%',
                    style: TextStyle(
                        fontSize: 13, fontWeight: FontWeight.w700, color: c.primaria)),
              ]),
              const SizedBox(height: 2),
              Text(m.descricao.isEmpty ? 'Prazo: ${dataBr(m.prazo)}' : '${m.descricao} · prazo ${dataBr(m.prazo)}',
                  style: TextStyle(fontSize: 12, color: c.texto2)),
              const SizedBox(height: 8),
              BarraFina(valor: m.progresso / 100, cor: m.concluida ? c.ok : c.rosa, altura: 8),
            ]),
          ),
      ]),
    );
  }
}

/// Feedbacks recebidos do treinador (somente leitura).
class FeedbacksRecebidos extends StatelessWidget {
  final Atleta atleta;
  const FeedbacksRecebidos({super.key, required this.atleta});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final fs = SateStore.i.feedbacksDe(atleta.id);
    if (fs.isEmpty) {
      return const Superficie(
        child: VazioView(Icons.chat_bubble_outline_rounded, 'Nenhum feedback',
            'Os feedbacks do treinador aparecerão aqui.'),
      );
    }
    return Column(children: [
      for (final f in fs.take(3))
        Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: Superficie(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(f.texto, style: TextStyle(fontSize: 13.5, height: 1.45, color: c.texto)),
              const SizedBox(height: 6),
              Text(dataHoraRel(f.quando), style: TextStyle(fontSize: 11.5, color: c.texto2)),
            ]),
          ),
        ),
    ]);
  }
}

class _PerfilRadar extends StatelessWidget {
  final Atleta atleta;
  const _PerfilRadar({required this.atleta});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final esc = SateStore.i.escoresPorCategoria(atleta);
    final media = esc.isEmpty ? 0.0 : esc.reduce((a, b) => a + b) / esc.length;
    return Superficie(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Perfil físico',
                    style: TextStyle(
                        fontSize: 16, fontWeight: FontWeight.w700, color: c.texto)),
                Text(atleta.nome, style: TextStyle(fontSize: 12.5, color: c.texto2)),
              ]),
            ),
            Pilula('Índice ${(media * 100).round()}', c.primaria,
                icone: Icons.bolt_rounded),
          ]),
          GraficoRadar(
            eixos: categoriasUniversais,
            series: [SerieRadar(atleta.nome, esc, c.primaria)],
          ),
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Text(
              'Escore de 0 a 100% em relação à faixa de referência de cada teste (último resultado).',
              style: TextStyle(fontSize: 11.5, color: c.texto2),
            ),
          ),
        ],
      ),
    );
  }
}

class _EvolucaoTeste extends StatelessWidget {
  final TipoTeste tipo;
  final List<ResultadoTeste> res;
  const _EvolucaoTeste({required this.tipo, required this.res});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    if (res.isEmpty) {
      return Superficie(
        child: VazioView(tipo.icone, tipo.nome, 'Ainda sem dados para este atleta.'),
      );
    }
    final ultimo = res.last.valor;
    final primeiro = res.first.valor;
    final dif = ultimo - primeiro;
    final melhorou = tipo.menorMelhor ? dif < 0 : dif > 0;
    final neutro = dif.abs() < 1e-9;
    final cor = neutro ? c.texto2 : (melhorou ? c.ok : c.falta);
    final melhor = tipo.menorMelhor
        ? res.map((e) => e.valor).reduce((a, b) => a < b ? a : b)
        : res.map((e) => e.valor).reduce((a, b) => a > b ? a : b);

    return Superficie(
      padding: const EdgeInsets.fromLTRB(16, 16, 12, 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(tipo.categoria,
                      style: TextStyle(fontSize: 12, color: c.texto2)),
                  const SizedBox(height: 2),
                  Text.rich(TextSpan(children: [
                    TextSpan(
                        text: ultimo.toStringAsFixed(tipo.casas),
                        style: TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.w700,
                            color: c.texto,
                            height: 1.1)),
                    TextSpan(
                        text: ' ${tipo.unidade}',
                        style: TextStyle(fontSize: 14, color: c.texto2)),
                  ])),
                ]),
              ),
              Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                Pilula(
                  neutro
                      ? 'Estável'
                      : '${dif > 0 ? '+' : ''}${dif.toStringAsFixed(tipo.casas)} ${tipo.unidade}',
                  cor,
                  icone: neutro
                      ? Icons.remove_rounded
                      : (dif > 0 ? Icons.trending_up_rounded : Icons.trending_down_rounded),
                ),
                const SizedBox(height: 4),
                Text('desde ${dataBr(res.first.data)}',
                    style: TextStyle(fontSize: 11, color: c.texto2)),
              ]),
            ],
          ),
          const SizedBox(height: 12),
          GraficoLinha(
            rotulos: [for (final r in res) '${r.data.day}/${r.data.month}'],
            series: [SerieLinha(tipo.nome, [for (final r in res) r.valor], c.primaria)],
            casas: tipo.casas,
            unidade: ' ${tipo.unidade}',
          ),
          const SizedBox(height: 6),
          Padding(
            padding: const EdgeInsets.only(right: 4),
            child: Text(
              'Melhor marca: ${tipo.formatar(melhor)}${tipo.menorMelhor ? ' · menor é melhor' : ''}',
              style: TextStyle(fontSize: 11.5, color: c.texto2),
            ),
          ),
        ],
      ),
    );
  }
}

class _LinhaHistorico extends StatelessWidget {
  final ResultadoTeste r;
  final TipoTeste tipo;
  final bool pode;
  const _LinhaHistorico({required this.r, required this.tipo, required this.pode});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 7),
      child: Row(
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
                color: c.primaria, shape: BoxShape.circle),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(dataBr(r.data),
                  style: TextStyle(
                      fontSize: 13.5, fontWeight: FontWeight.w600, color: c.texto)),
              if (r.obs.isNotEmpty)
                Text(r.obs,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 12, color: c.texto2)),
            ]),
          ),
          Text(tipo.formatar(r.valor),
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: c.texto)),
          if (pode)
            IconButton(
              visualDensity: VisualDensity.compact,
              icon: Icon(Icons.delete_outline_rounded, size: 19, color: c.texto2),
              onPressed: () => SateStore.i.removerTeste(r),
            ),
        ],
      ),
    );
  }
}

/// Registro de resultado de teste físico.
/// O treinador escolhe o atleta; com [atletaFixo] (perfil do atleta) o resultado
/// é sempre registrado para o próprio atleta logado.
Future<void> registrarTeste(BuildContext context,
    {Atleta? atletaInicial, bool atletaFixo = false}) async {
  final s = SateStore.i;
  if (!atletaFixo && atletaInicial == null && s.atletas.isEmpty) {
    aviso(context, 'Cadastre um atleta pelo site para registrar avaliações.');
    return;
  }
  var atleta = atletaFixo ? s.eu : (atletaInicial ?? s.atletas.first);
  var teste = s.testesDoAtleta(atleta).first;
  var data = s.hoje;
  final valor = TextEditingController();
  final obs = TextEditingController();

  final ok = await abrirFolha<bool>(context, (ctx) {
    final c = ctx.sc;
    return StatefulBuilder(
      builder: (ctx, setM) {
        final tipos = s.testesDoAtleta(atleta);
        if (!tipos.any((t) => t.nome == teste.nome)) teste = tipos.first;
        return SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 4, 20, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Registrar resultado',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: c.texto)),
              const SizedBox(height: 16),
              if (!atletaFixo) ...[
                Text('Atleta', style: TextStyle(fontSize: 12.5, color: c.texto2)),
                const SizedBox(height: 8),
                LinhaChips([
                  for (final a in s.atletas)
                    FiltroChip(a.nome.split(' ').first, a.id == atleta.id,
                        () => setM(() => atleta = a)),
                ]),
                const SizedBox(height: 14),
              ],
              Text('Teste', style: TextStyle(fontSize: 12.5, color: c.texto2)),
              const SizedBox(height: 8),
              Wrap(spacing: 8, runSpacing: 8, children: [
                for (final t in tipos)
                  FiltroChip(t.nome, t.nome == teste.nome, () => setM(() => teste = t)),
              ]),
              const SizedBox(height: 14),
              TextField(
                controller: valor,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                decoration: decoracaoCampo(ctx, 'Resultado (${teste.unidade})'),
              ),
              const SizedBox(height: 12),
              InkWell(
                borderRadius: BorderRadius.circular(14),
                onTap: () async {
                  final d = await showDatePicker(
                    context: ctx,
                    initialDate: data,
                    firstDate: DateTime(2020),
                    lastDate: s.hoje,
                  );
                  if (d != null) setM(() => data = somenteData(d));
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
                  decoration: BoxDecoration(
                      color: c.superficie, borderRadius: BorderRadius.circular(14)),
                  child: Row(children: [
                    Icon(Icons.event_rounded, size: 19, color: c.primaria),
                    const SizedBox(width: 10),
                    Text('Data: ${dataBr(data)}', style: TextStyle(color: c.texto)),
                  ]),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: obs,
                minLines: 2,
                maxLines: 4,
                decoration: decoracaoCampo(ctx, 'Observações (opcional)'),
              ),
              const SizedBox(height: 20),
              FilledButton(
                style: estiloBotao(ctx),
                onPressed: () {
                  if (double.tryParse(valor.text.replaceAll(',', '.')) == null) {
                    aviso(ctx, 'Informe um resultado numérico válido.');
                    return;
                  }
                  Navigator.pop(ctx, true);
                },
                child: const Text('Salvar resultado'),
              ),
            ],
          ),
        );
      },
    );
  });

  if (ok != true) return;
  final v = double.parse(valor.text.replaceAll(',', '.'));
  await s.registrarTeste(
      ResultadoTeste(atleta.nome, teste.nome, teste.unidade, data, v, obs.text.trim(),
          atletaId: atleta.id));
  if (context.mounted) {
    aviso(context, atletaFixo ? 'Resultado salvo.' : 'Resultado salvo para ${atleta.nome}.');
  }
}
