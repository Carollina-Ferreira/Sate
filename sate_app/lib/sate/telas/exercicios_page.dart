import 'package:flutter/material.dart';

import '../data/modelos.dart';
import '../data/sate_store.dart';
import '../ui/cores.dart';
import '../ui/tela.dart';
import '../ui/widgets.dart';
import 'video_demo.dart';

/// Biblioteca de exercícios. O treinador cria/edita; o atleta consulta e assiste.
class ExerciciosPage extends StatefulWidget {
  final bool treinador;
  final bool embutido;
  const ExerciciosPage({super.key, required this.treinador, this.embutido = false});

  @override
  State<ExerciciosPage> createState() => _ExerciciosPageState();
}

class _ExerciciosPageState extends State<ExerciciosPage> {
  String _grupo = 'Todos';
  String _busca = '';

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return AnimatedBuilder(
      animation: SateStore.i,
      builder: (context, _) {
        final todos = SateStore.i.exercicios;
        final grupos = ['Todos', ...gruposExercicio.where((g) => todos.any((e) => e.grupo == g))];
        final lista = todos
            .where((e) =>
                (_grupo == 'Todos' || e.grupo == _grupo) &&
                e.nome.toLowerCase().contains(_busca.toLowerCase()))
            .toList();

        return corpoDeTela(
          embutido: widget.embutido,
          titulo: 'Biblioteca de',
          destaque: 'exercícios',
          subtitulo: widget.treinador
              ? 'Crie, edite e associe vídeos demonstrativos'
              : 'Veja a execução correta de cada movimento',
          children: [
            Row(children: [
              Expanded(
                child: TextField(
                  onChanged: (v) => setState(() => _busca = v),
                  style: TextStyle(color: c.texto),
                  decoration: decoracaoCampo(context, 'Buscar exercício').copyWith(
                    prefixIcon: Icon(Icons.search_rounded, color: c.texto2),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              BotaoIcone(
                icone: Icons.tune_rounded,
                destaque: _grupo != 'Todos',
                dica: 'Filtrar por grupo',
                onTap: () async {
                  final r = await abrirSeletor<String>(
                    context,
                    titulo: 'Filtrar por grupo',
                    busca: false,
                    atuais: [_grupo],
                    itens: [for (final g in grupos) ItemSel(g, g)],
                  );
                  if (r != null && r.isNotEmpty) setState(() => _grupo = r.first);
                },
              ),
              if (widget.treinador) ...[
                const SizedBox(width: 8),
                BotaoIcone(
                  icone: Icons.add_rounded,
                  destaque: true,
                  dica: 'Novo exercício',
                  onTap: () => editarExercicio(context),
                ),
              ],
            ]),
            if (_grupo != 'Todos') ...[
              const SizedBox(height: 10),
              Align(
                alignment: Alignment.centerLeft,
                child: GestureDetector(
                  onTap: () => setState(() => _grupo = 'Todos'),
                  child: Pilula('$_grupo  ✕', c.primaria),
                ),
              ),
            ],
            const SizedBox(height: 14),
            if (lista.isEmpty)
              const VazioView(Icons.fitness_center_rounded, 'Nada por aqui',
                  'Nenhum exercício encontrado para este filtro.')
            else
              for (var i = 0; i < lista.length; i++)
                Revela(
                  ordem: i.clamp(0, 6).toInt(),
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 10),
                    child: _CartaoExercicio(
                      e: lista[i],
                      onTap: () => abrir(
                        context,
                        ExercicioDetalhePage(
                            id: lista[i].id, treinador: widget.treinador),
                      ),
                    ),
                  ),
                ),
          ],
        );
      },
    );
  }
}

class _CartaoExercicio extends StatelessWidget {
  final Exercicio e;
  final VoidCallback onTap;
  const _CartaoExercicio({required this.e, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return Superficie(
      onTap: onTap,
      padding: const EdgeInsets.all(12),
      child: Row(
        children: [
          Container(
            width: 54,
            height: 54,
            decoration: BoxDecoration(
              color: c.heroSolido,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(
              e.video.isEmpty ? Icons.fitness_center_rounded : Icons.play_arrow_rounded,
              color: Colors.white,
              size: 26,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(e.nome,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                        fontSize: 15, fontWeight: FontWeight.w600, color: c.texto)),
                const SizedBox(height: 3),
                Text('${e.grupo} · ${e.resumo}',
                    style: TextStyle(fontSize: 12.5, color: c.texto2)),
              ],
            ),
          ),
          Icon(Icons.chevron_right_rounded, color: c.texto2),
        ],
      ),
    );
  }
}

class ExercicioDetalhePage extends StatelessWidget {
  final String id;
  final bool treinador;
  const ExercicioDetalhePage({super.key, required this.id, required this.treinador});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return AnimatedBuilder(
      animation: SateStore.i,
      builder: (context, _) {
        final e = SateStore.i.exercicio(id);
        if (e == null) {
          return const Tela(
            titulo: 'Exercício',
            destaque: 'removido',
            children: [VazioView(Icons.delete_outline_rounded, 'Não encontrado', 'Este exercício foi removido da biblioteca.')],
          );
        }
        Widget metrica(String rotulo, String valor) => Expanded(
              child: Superficie(
                padding: const EdgeInsets.symmetric(vertical: 14),
                child: Column(
                  children: [
                    Text(valor,
                        style: TextStyle(
                            fontSize: 20, fontWeight: FontWeight.w700, color: c.texto)),
                    const SizedBox(height: 2),
                    Text(rotulo, style: TextStyle(fontSize: 11.5, color: c.texto2)),
                  ],
                ),
              ),
            );

        return Tela(
          titulo: 'Como',
          destaque: 'executar',
          acoes: treinador
              ? [
                  BotaoIcone(
                    icone: Icons.edit_rounded,
                    dica: 'Editar',
                    onTap: () => editarExercicio(context, atual: e),
                  ),
                  const SizedBox(width: 8),
                  BotaoIcone(
                    icone: Icons.delete_outline_rounded,
                    dica: 'Excluir',
                    onTap: () async {
                      final ok = await showDialog<bool>(
                        context: context,
                        builder: (ctx) => AlertDialog(
                          title: const Text('Excluir exercício?'),
                          content: const Text('Ele deixará de aparecer na biblioteca.'),
                          actions: [
                            TextButton(
                                onPressed: () => Navigator.pop(ctx, false),
                                child: const Text('Cancelar')),
                            TextButton(
                                onPressed: () => Navigator.pop(ctx, true),
                                child: const Text('Excluir')),
                          ],
                        ),
                      );
                      if (ok == true) {
                        await SateStore.i.removerExercicio(e.id);
                        if (context.mounted) Navigator.of(context).pop();
                      }
                    },
                  ),
                ]
              : const [],
          children: [
            VideoDemo(video: e.video, titulo: e.nome, exercicio: e),
            const SizedBox(height: 18),
            Row(children: [
              Expanded(
                child: Text(e.nome,
                    style: TextStyle(
                        fontSize: 20, fontWeight: FontWeight.w700, color: c.texto)),
              ),
              Pilula(e.grupo, c.primaria),
            ]),
            const SizedBox(height: 14),
            Row(children: [
              metrica('Séries', '${e.series}'),
              const SizedBox(width: 10),
              metrica('Repetições', e.repeticoes == 0 ? '—' : '${e.repeticoes}'),
              const SizedBox(width: 10),
              metrica('Duração', e.duracaoSeg == 0 ? '—' : '${e.duracaoSeg}s'),
            ]),
            const SizedBox(height: 22),
            const SecaoCab('Instruções'),
            const SizedBox(height: 8),
            Text(
              e.instrucoes.isEmpty ? 'Sem instruções cadastradas.' : e.instrucoes,
              style: TextStyle(fontSize: 14, height: 1.55, color: c.texto),
            ),
            const SizedBox(height: 18),
            Superficie(
              cor: c.suave(c.primaria),
              child: Row(
                children: [
                  Icon(Icons.health_and_safety_outlined, color: c.primaria),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Execute com controle. Em caso de dor ou desconforto, interrompa e avise o treinador.',
                      style: TextStyle(fontSize: 12.5, height: 1.4, color: c.texto),
                    ),
                  ),
                ],
              ),
            ),
          ],
        );
      },
    );
  }
}

/// Cria ou edita um exercício (folha inferior).
Future<void> editarExercicio(BuildContext context, {Exercicio? atual}) async {
  final nome = TextEditingController(text: atual?.nome ?? '');
  final instr = TextEditingController(text: atual?.instrucoes ?? '');
  final outroVideo = TextEditingController(
      text: atual != null && !videosDemo.containsKey(atual.video) ? atual.video : '');
  var grupo = atual?.grupo ?? gruposExercicio.first;
  var series = atual?.series ?? 3;
  var reps = atual?.repeticoes ?? 10;
  var dur = atual?.duracaoSeg ?? 0;
  var video = atual?.video ?? '';
  var usaOutro = atual != null && atual.video.isNotEmpty && !videosDemo.containsKey(atual.video);

  final salvar = await abrirFolha<bool>(context, (ctx) {
    final c = ctx.sc;
    return StatefulBuilder(
      builder: (ctx, setM) => SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20, 4, 20, 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(atual == null ? 'Novo exercício' : 'Editar exercício',
                style: TextStyle(
                    fontSize: 20, fontWeight: FontWeight.w700, color: c.texto)),
            const SizedBox(height: 16),
            TextField(controller: nome, decoration: decoracaoCampo(ctx, 'Nome do exercício')),
            const SizedBox(height: 14),
            Text('Grupo', style: TextStyle(fontSize: 12.5, color: c.texto2)),
            const SizedBox(height: 8),
            Wrap(spacing: 8, runSpacing: 8, children: [
              for (final g in gruposExercicio)
                FiltroChip(g, grupo == g, () => setM(() => grupo = g)),
            ]),
            const SizedBox(height: 16),
            Row(children: [
              Expanded(
                  child: Contador(
                      rotulo: 'Séries',
                      valor: series,
                      min: 1,
                      max: 20,
                      onChanged: (v) => setM(() => series = v))),
              const SizedBox(width: 8),
              Expanded(
                  child: Contador(
                      rotulo: 'Repetições',
                      valor: reps,
                      max: 100,
                      onChanged: (v) => setM(() => reps = v))),
              const SizedBox(width: 8),
            ]),
            const SizedBox(height: 8),
            Contador(
                rotulo: 'Duração (0 = não se aplica)',
                valor: dur,
                max: 3600,
                passo: 15,
                sufixo: 's',
                onChanged: (v) => setM(() => dur = v)),
            const SizedBox(height: 14),
            TextField(
              controller: instr,
              minLines: 3,
              maxLines: 6,
              decoration: decoracaoCampo(ctx, 'Instruções de execução'),
            ),
            const SizedBox(height: 16),
            Text('Vídeo demonstrativo',
                style: TextStyle(fontSize: 12.5, color: c.texto2)),
            const SizedBox(height: 8),
            Wrap(spacing: 8, runSpacing: 8, children: [
              FiltroChip('Nenhum', video.isEmpty && !usaOutro, () {
                setM(() {
                  video = '';
                  usaOutro = false;
                });
              }),
              for (final v in videosDemo.entries)
                FiltroChip(v.value, video == v.key && !usaOutro, () {
                  setM(() {
                    video = v.key;
                    usaOutro = false;
                  });
                }),
              FiltroChip('Outro arquivo/link', usaOutro, () {
                setM(() => usaOutro = true);
              }),
            ]),
            if (usaOutro) ...[
              const SizedBox(height: 10),
              TextField(
                controller: outroVideo,
                decoration: decoracaoCampo(ctx, 'Nome do arquivo ou link',
                    dica: 'ex.: agachamento_lateral.mp4'),
              ),
              const SizedBox(height: 6),
              Text(
                'Será apenas associado ao exercício. A reprodução real depende da integração do player.',
                style: TextStyle(fontSize: 11.5, color: c.texto2),
              ),
            ],
            const SizedBox(height: 22),
            FilledButton(
              style: estiloBotao(ctx),
              onPressed: () {
                if (nome.text.trim().isEmpty) {
                  aviso(ctx, 'Informe o nome do exercício.');
                  return;
                }
                Navigator.pop(ctx, true);
              },
              child: const Text('Salvar exercício'),
            ),
          ],
        ),
      ),
    );
  });

  if (salvar != true) return;
  final videoFinal = usaOutro ? outroVideo.text.trim() : video;
  await SateStore.i.salvarExercicio(Exercicio(
    id: atual?.id ?? SateStore.i.novoId(),
    nome: nome.text.trim(),
    grupo: grupo,
    series: series,
    repeticoes: reps,
    duracaoSeg: dur,
    instrucoes: instr.text.trim(),
    video: videoFinal,
  ));
  if (context.mounted) aviso(context, 'Exercício salvo.');
}
