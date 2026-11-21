import 'package:flutter/material.dart';

import '../data/modelos.dart';
import '../data/sate_store.dart';
import '../ui/cores.dart';
import '../ui/tela.dart';
import '../ui/widgets.dart';
import 'exercicios_page.dart';

/// Planejamento de treinos: visões diária, semanal e mensal.
class PlanejamentoPage extends StatefulWidget {
  final bool treinador;
  final bool comVoltar;
  final bool embutido;
  const PlanejamentoPage({
    super.key,
    required this.treinador,
    this.comVoltar = false,
    this.embutido = false,
  });

  @override
  State<PlanejamentoPage> createState() => _PlanejamentoPageState();
}

class _PlanejamentoPageState extends State<PlanejamentoPage> {
  int _modo = 0;
  late DateTime _ref;

  @override
  void initState() {
    super.initState();
    _ref = SateStore.i.hoje;
  }

  List<Treino> _do(SateStore s, DateTime d) => widget.treinador
      ? s.treinosNoDia(d)
      : s.treinosDoAtleta(s.eu, d);

  DateTime get _iniSemana => somaDias(_ref, -(_ref.weekday - 1));

  void _mover(int sinal) {
    setState(() {
      switch (_modo) {
        case 0:
          _ref = somaDias(_ref, sinal);
        case 1:
          _ref = somaDias(_ref, 7 * sinal);
        default:
          _ref = DateTime(_ref.year, _ref.month + sinal, 1);
      }
    });
  }

  String _titulo() {
    switch (_modo) {
      case 0:
        return '${diasSemanaLongos[_ref.weekday - 1]}, ${_ref.day} ${mesesCurtos[_ref.month - 1]}';
      case 1:
        final f = somaDias(_iniSemana, 6);
        return '${_iniSemana.day} ${mesesCurtos[_iniSemana.month - 1]} – ${f.day} ${mesesCurtos[f.month - 1]}';
      default:
        return '${mesesLongos[_ref.month - 1]} ${_ref.year}';
    }
  }

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return AnimatedBuilder(
      animation: SateStore.i,
      builder: (context, _) {
        final s = SateStore.i;
        final dias = <DateTime>[];
        if (_modo == 0) {
          dias.add(_ref);
        } else if (_modo == 1) {
          for (var i = 0; i < 7; i++) {
            dias.add(somaDias(_iniSemana, i));
          }
        } else {
          final n = DateTime(_ref.year, _ref.month + 1, 0).day;
          for (var i = 1; i <= n; i++) {
            dias.add(DateTime(_ref.year, _ref.month, i));
          }
        }
        var total = 0;
        final blocos = <Widget>[];
        for (final d in dias) {
          final ts = _do(s, d);
          total += ts.length;
          if (ts.isEmpty && _modo != 0 && _modo != 1) continue;
          blocos.add(Padding(
            padding: const EdgeInsets.only(top: 14, bottom: 8),
            child: Row(children: [
              Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(
                  color: d == s.hoje ? c.rosa : c.vazio,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                '${diasSemanaLongos[d.weekday - 1]}, ${d.day} ${mesesCurtos[d.month - 1]}${d == s.hoje ? ' · hoje' : ''}',
                style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: d == s.hoje ? c.rosa : c.texto2),
              ),
            ]),
          ));
          if (ts.isEmpty) {
            blocos.add(Text('Sem treino', style: TextStyle(fontSize: 13, color: c.texto2)));
          }
          for (final t in ts) {
            blocos.add(Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: CartaoTreino(
                t: t,
                compacto: _modo != 0,
                onTap: () => abrir(
                  context,
                  TreinoDetalhePage(treinoId: t.id, data: t.data, treinador: widget.treinador),
                ),
              ),
            ));
          }
        }

        return corpoDeTela(
          embutido: widget.embutido,
          voltar: widget.comVoltar,
          titulo: 'Planejamento',
          destaque: 'de treinos',
          subtitulo: widget.treinador ? 'Organize cada sessão' : 'Seus próximos treinos',
          fab: widget.treinador
              ? FloatingActionButton.extended(
                  heroTag: null,
                  backgroundColor: c.rosa,
                  foregroundColor: Colors.white,
                  onPressed: () => editarTreino(context, data: _ref),
                  icon: const Icon(Icons.add_rounded),
                  label: const Text('Novo treino'),
                )
              : null,
          children: [
            Row(children: [
              Expanded(
                child: Segmentos(
                  rotulos: const ['Dia', 'Semana', 'Mês'],
                  indice: _modo,
                  onChanged: (v) => setState(() => _modo = v),
                ),
              ),
              if (widget.treinador && widget.embutido) ...[
                const SizedBox(width: 10),
                BotaoIcone(
                  icone: Icons.add_rounded,
                  destaque: true,
                  dica: 'Novo treino',
                  onTap: () => editarTreino(context, data: _ref),
                ),
              ],
            ]),
            const SizedBox(height: 14),
            Row(children: [
              BotaoIcone(icone: Icons.chevron_left_rounded, onTap: () => _mover(-1)),
              Expanded(
                child: GestureDetector(
                  onTap: () => setState(() => _ref = s.hoje),
                  child: Text(_titulo(),
                      textAlign: TextAlign.center,
                      style: TextStyle(
                          fontSize: 16, fontWeight: FontWeight.w700, color: c.texto)),
                ),
              ),
              BotaoIcone(icone: Icons.chevron_right_rounded, onTap: () => _mover(1)),
            ]),
            if (total == 0 && _modo == 2)
              const VazioView(Icons.event_busy_rounded, 'Mês sem treinos',
                  'Nenhum treino programado neste mês.'),
            ...blocos,
          ],
        );
      },
    );
  }
}

/// Cartão de treino reutilizado em várias telas.
class CartaoTreino extends StatelessWidget {
  final Treino t;
  final bool compacto;
  final VoidCallback onTap;
  const CartaoTreino({super.key, required this.t, required this.onTap, this.compacto = false});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final s = SateStore.i;
    final eq = s.equipe(t.equipeId);
    return Superficie(
      onTap: onTap,
      padding: const EdgeInsets.all(14),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Column(children: [
            Text(horaTxt(t.inicioMin),
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: c.texto)),
            Text('${t.duracaoMin} min', style: TextStyle(fontSize: 11, color: c.texto2)),
          ]),
          const SizedBox(width: 14),
          Container(
            width: 3,
            height: compacto ? 38 : 56,
            decoration:
                BoxDecoration(color: c.rosa, borderRadius: BorderRadius.circular(3)),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(t.titulo,
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: c.texto)),
              const SizedBox(height: 2),
              Text('${eq.nome} · ${t.exercicioIds.length} exercícios',
                  style: TextStyle(fontSize: 12.5, color: c.texto2)),
              if (!compacto) ...[
                if (t.objetivo.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Text(t.objetivo,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(fontSize: 12.5, height: 1.35, color: c.texto)),
                ],
              ],
            ]),
          ),
        ],
      ),
    );
  }
}

class TreinoDetalhePage extends StatelessWidget {
  final String treinoId;
  final DateTime data;
  final bool treinador;
  const TreinoDetalhePage({
    super.key,
    required this.treinoId,
    required this.data,
    required this.treinador,
  });

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return AnimatedBuilder(
      animation: SateStore.i,
      builder: (context, _) {
        final s = SateStore.i;
        Treino? t;
        for (final x in s.treinosNoDia(data)) {
          if (x.id == treinoId) t = x;
        }
        if (t == null) {
          return const Tela(
            titulo: 'Treino',
            destaque: 'removido',
            children: [VazioView(Icons.event_busy_rounded, 'Não encontrado', 'Este treino não está mais programado.')],
          );
        }
        final tr = t;
        final eq = s.equipe(tr.equipeId);
        final participantes = tr.atletaIds.isEmpty
            ? s.atletasDaEquipe(tr.equipeId)
            : s.atletas.where((a) => tr.atletaIds.contains(a.id)).toList();
        final exs = [
          for (final id in tr.exercicioIds)
            if (s.exercicio(id) != null) s.exercicio(id)!,
        ];

        Widget info(IconData i, String rotulo, String valor) => Expanded(
              child: Superficie(
                padding: const EdgeInsets.all(12),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Icon(i, size: 18, color: c.primaria),
                  const SizedBox(height: 8),
                  Text(valor,
                      style: TextStyle(fontSize: 14.5, fontWeight: FontWeight.w700, color: c.texto)),
                  Text(rotulo, style: TextStyle(fontSize: 11.5, color: c.texto2)),
                ]),
              ),
            );

        return Tela(
          titulo: 'Detalhes do',
          destaque: 'treino',
          acoes: treinador
              ? [
                  BotaoIcone(
                    icone: Icons.edit_rounded,
                    dica: 'Editar',
                    onTap: () => editarTreino(context, atual: tr),
                  ),
                  const SizedBox(width: 8),
                  BotaoIcone(
                    icone: Icons.delete_outline_rounded,
                    dica: 'Remover',
                    onTap: () async {
                      await SateStore.i.removerTreino(tr.id);
                      if (context.mounted) Navigator.of(context).pop();
                    },
                  ),
                ]
              : const [],
          children: [
            Text(tr.titulo,
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700, color: c.texto)),
            const SizedBox(height: 4),
            Text('${eq.nome} · ${eq.local}',
                style: TextStyle(fontSize: 13, color: c.texto2)),
            const SizedBox(height: 14),
            Row(children: [
              info(Icons.event_rounded, 'Data', '${tr.data.day}/${tr.data.month}'),
              const SizedBox(width: 10),
              info(Icons.schedule_rounded, 'Horário', horaTxt(tr.inicioMin)),
              const SizedBox(width: 10),
              info(Icons.timer_outlined, 'Duração', '${tr.duracaoMin} min'),
            ]),
            if (tr.objetivo.isNotEmpty) ...[
              const SizedBox(height: 20),
              const SecaoCab('Objetivo'),
              const SizedBox(height: 6),
              Text(tr.objetivo, style: TextStyle(fontSize: 14, height: 1.5, color: c.texto)),
            ],
            if (tr.foco.isNotEmpty) ...[
              const SizedBox(height: 16),
              Superficie(
                cor: c.suave(c.rosa),
                child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Icon(Icons.psychology_alt_outlined, color: c.rosa),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text('Mentalidade do dia',
                          style: TextStyle(
                              fontSize: 12, fontWeight: FontWeight.w700, color: c.rosa)),
                      const SizedBox(height: 3),
                      Text(tr.foco,
                          style: TextStyle(fontSize: 14, height: 1.4, color: c.texto)),
                    ]),
                  ),
                ]),
              ),
            ],
            const SizedBox(height: 22),
            SecaoCab('Exercícios (${exs.length})'),
            const SizedBox(height: 6),
            if (exs.isEmpty)
              const VazioView(Icons.fitness_center_rounded, 'Sem exercícios',
                  'Nenhum exercício associado a este treino.')
            else
              for (var i = 0; i < exs.length; i++)
                LinhaItem(
                  icone: Icons.play_circle_outline_rounded,
                  titulo: '${i + 1}. ${exs[i].nome}',
                  sub: '${exs[i].grupo} · ${exs[i].resumo}',
                  fim: Icon(Icons.chevron_right_rounded, color: c.texto2),
                  onTap: () => abrir(
                      context, ExercicioDetalhePage(id: exs[i].id, treinador: treinador)),
                ),
            if (tr.observacoes.isNotEmpty) ...[
              const SizedBox(height: 18),
              const SecaoCab('Observações'),
              const SizedBox(height: 6),
              Text(tr.observacoes,
                  style: TextStyle(fontSize: 14, height: 1.5, color: c.texto)),
            ],
            const SizedBox(height: 22),
            SecaoCab('Atletas participantes (${participantes.length})'),
            const SizedBox(height: 10),
            Wrap(spacing: 8, runSpacing: 8, children: [
              for (final a in participantes)
                Container(
                  padding: const EdgeInsets.fromLTRB(4, 4, 12, 4),
                  decoration: BoxDecoration(
                      color: c.superficie, borderRadius: BorderRadius.circular(20)),
                  child: Row(mainAxisSize: MainAxisSize.min, children: [
                    AvatarIni(a.nome, tamanho: 26),
                    const SizedBox(width: 8),
                    Text(a.nome.split(' ').first,
                        style: TextStyle(fontSize: 12.5, color: c.texto)),
                  ]),
                ),
            ]),
          ],
        );
      },
    );
  }
}

/// Cria ou edita um treino (folha inferior).
Future<void> editarTreino(BuildContext context, {Treino? atual, DateTime? data}) async {
  final s = SateStore.i;
  if (atual == null && s.equipes.isEmpty) {
    aviso(context, 'Crie uma equipe pelo site para agendar treinos.');
    return;
  }
  final titulo = TextEditingController(text: atual?.titulo ?? '');
  final objetivo = TextEditingController(text: atual?.objetivo ?? '');
  final foco = TextEditingController(text: atual?.foco ?? '');
  final obs = TextEditingController(text: atual?.observacoes ?? '');
  var equipeId = atual?.equipeId ?? s.equipes.first.id;
  var dia = atual?.data ?? data ?? s.hoje;
  var inicio = atual?.inicioMin ?? s.equipe(equipeId).inicioMin;
  var duracao = atual?.duracaoMin ?? s.equipe(equipeId).duracaoMin;
  final exSel = <String>[...?atual?.exercicioIds];
  final atSel = <String>{...?atual?.atletaIds};

  final ok = await abrirFolha<bool>(context, (ctx) {
    final c = ctx.sc;
    return StatefulBuilder(
      builder: (ctx, setM) {
        final doTime = s.atletasDaEquipe(equipeId);
        return SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 4, 20, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(atual == null ? 'Novo treino' : 'Editar treino',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: c.texto)),
              const SizedBox(height: 16),
              TextField(controller: titulo, decoration: decoracaoCampo(ctx, 'Título do treino')),
              const SizedBox(height: 14),
              Text('Equipe', style: TextStyle(fontSize: 12.5, color: c.texto2)),
              const SizedBox(height: 8),
              Wrap(spacing: 8, runSpacing: 8, children: [
                for (final e in s.equipes)
                  FiltroChip(e.nome, e.id == equipeId, () {
                    setM(() {
                      equipeId = e.id;
                      atSel.clear();
                    });
                  }),
              ]),
              const SizedBox(height: 14),
              Row(children: [
                Expanded(
                  child: _CampoToque(
                    icone: Icons.event_rounded,
                    texto: dataBr(dia),
                    onTap: () async {
                      final d = await showDatePicker(
                        context: ctx,
                        initialDate: dia,
                        firstDate: DateTime(2020),
                        lastDate: DateTime(2035),
                      );
                      if (d != null) setM(() => dia = somenteData(d));
                    },
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _CampoToque(
                    icone: Icons.schedule_rounded,
                    texto: horaTxt(inicio),
                    onTap: () async {
                      final t = await showTimePicker(
                        context: ctx,
                        initialTime: TimeOfDay(hour: inicio ~/ 60, minute: inicio % 60),
                      );
                      if (t != null) setM(() => inicio = t.hour * 60 + t.minute);
                    },
                  ),
                ),
              ]),
              const SizedBox(height: 10),
              Contador(
                rotulo: 'Duração',
                valor: duracao,
                min: 15,
                max: 240,
                passo: 15,
                sufixo: ' min',
                onChanged: (v) => setM(() => duracao = v),
              ),
              const SizedBox(height: 14),
              TextField(
                controller: objetivo,
                minLines: 2,
                maxLines: 4,
                decoration: decoracaoCampo(ctx, 'Objetivo do treino'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: foco,
                decoration: decoracaoCampo(ctx, 'Mentalidade / foco do dia'),
              ),
              const SizedBox(height: 16),
              Text('Exercícios (toque para incluir; a ordem é a da seleção)',
                  style: TextStyle(fontSize: 12.5, color: c.texto2)),
              const SizedBox(height: 8),
              Wrap(spacing: 8, runSpacing: 8, children: [
                for (final e in s.exercicios)
                  FiltroChip(
                    exSel.contains(e.id) ? '${exSel.indexOf(e.id) + 1}. ${e.nome}' : e.nome,
                    exSel.contains(e.id),
                    () => setM(() => exSel.contains(e.id) ? exSel.remove(e.id) : exSel.add(e.id)),
                  ),
              ]),
              const SizedBox(height: 16),
              Text('Atletas participantes',
                  style: TextStyle(fontSize: 12.5, color: c.texto2)),
              const SizedBox(height: 8),
              Wrap(spacing: 8, runSpacing: 8, children: [
                FiltroChip('Toda a equipe', atSel.isEmpty, () => setM(atSel.clear)),
                for (final a in doTime)
                  FiltroChip(
                    a.nome.split(' ').first,
                    atSel.contains(a.id),
                    () => setM(() => atSel.contains(a.id) ? atSel.remove(a.id) : atSel.add(a.id)),
                  ),
              ]),
              const SizedBox(height: 14),
              TextField(
                controller: obs,
                minLines: 2,
                maxLines: 4,
                decoration: decoracaoCampo(ctx, 'Observações'),
              ),
              const SizedBox(height: 22),
              FilledButton(
                style: estiloBotao(ctx),
                onPressed: () {
                  if (titulo.text.trim().isEmpty) {
                    aviso(ctx, 'Informe o título do treino.');
                    return;
                  }
                  Navigator.pop(ctx, true);
                },
                child: const Text('Salvar treino'),
              ),
            ],
          ),
        );
      },
    );
  });

  if (ok != true) return;
  final id = atual?.id ?? s.novoId();
  // Se a data de um treino-modelo mudou, o id antigo deixa de valer para o novo dia.
  if (atual != null && atual.id.startsWith('p-') && atual.data != dia) {
    await s.removerTreino(atual.id);
  }
  await s.salvarTreino(Treino(
    id: atual != null && atual.id.startsWith('p-') && atual.data != dia ? s.novoId() : id,
    titulo: titulo.text.trim(),
    objetivo: objetivo.text.trim(),
    foco: foco.text.trim(),
    observacoes: obs.text.trim(),
    equipeId: equipeId,
    data: dia,
    inicioMin: inicio,
    duracaoMin: duracao,
    exercicioIds: exSel,
    atletaIds: atSel.toList(),
  ));
  if (context.mounted) aviso(context, 'Treino salvo.');
}

class _CampoToque extends StatelessWidget {
  final IconData icone;
  final String texto;
  final VoidCallback onTap;
  const _CampoToque({required this.icone, required this.texto, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return InkWell(
      borderRadius: BorderRadius.circular(14),
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 15),
        decoration:
            BoxDecoration(color: c.superficie, borderRadius: BorderRadius.circular(14)),
        child: Row(children: [
          Icon(icone, size: 19, color: c.primaria),
          const SizedBox(width: 10),
          Text(texto, style: TextStyle(color: c.texto)),
        ]),
      ),
    );
  }
}
