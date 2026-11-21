import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../data/modelos.dart';
import '../data/sate_store.dart';
import '../ui/cores.dart';
import '../ui/widgets.dart';

const List<String> _diasCurtos = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

String _hora(int min) =>
    '${(min ~/ 60).toString().padLeft(2, '0')}:${(min % 60).toString().padLeft(2, '0')}';

/// Folha do treinador para a equipe: código de convite (para os atletas entrarem
/// pelo app) e agenda recorrente (dias, horário e local). Tudo é salvo no servidor,
/// portanto vale também para o site e para os atletas.
Future<void> editarEquipe(BuildContext context, Equipe equipe) {
  return abrirFolha(context, (ctx) => _EditorEquipe(equipe: equipe));
}

class _EditorEquipe extends StatefulWidget {
  final Equipe equipe;
  const _EditorEquipe({required this.equipe});

  @override
  State<_EditorEquipe> createState() => _EditorEquipeState();
}

class _EditorEquipeState extends State<_EditorEquipe> {
  late final TextEditingController _local = TextEditingController(text: widget.equipe.local);
  late final Set<int> _dias = {...widget.equipe.dias};
  late int _inicio = widget.equipe.inicioMin;
  late int _duracao = widget.equipe.duracaoMin;
  String? _codigo;
  String? _erroCodigo;
  bool _salvando = false;

  @override
  void initState() {
    super.initState();
    _carregarCodigo();
  }

  @override
  void dispose() {
    _local.dispose();
    super.dispose();
  }

  Future<void> _carregarCodigo({bool renovar = false}) async {
    try {
      final c = await SateStore.i.codigoDaEquipe(widget.equipe.id, renovar: renovar);
      if (mounted) setState(() => _codigo = c);
    } catch (e) {
      if (mounted) setState(() => _erroCodigo = 'Não foi possível carregar o código.');
    }
  }

  Future<void> _escolherHora() async {
    final t = await showTimePicker(
      context: context,
      initialTime: TimeOfDay(hour: _inicio ~/ 60, minute: _inicio % 60),
    );
    if (t != null) setState(() => _inicio = t.hour * 60 + t.minute);
  }

  Future<void> _salvar() async {
    setState(() => _salvando = true);
    final ok = await SateStore.i.salvarAgendaEquipe(
      widget.equipe.id,
      local: _local.text.trim(),
      dias: (_dias.toList()..sort()),
      inicioMin: _inicio,
      duracaoMin: _duracao,
    );
    if (!mounted) return;
    setState(() => _salvando = false);
    if (ok) {
      Navigator.of(context).pop();
      aviso(context, 'Agenda da equipe salva.');
    }
  }

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return SingleChildScrollView(
      padding: EdgeInsets.fromLTRB(22, 4, 22, 24 + MediaQuery.of(context).viewInsets.bottom),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(widget.equipe.nome,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700)),
          const SizedBox(height: 18),
          const SecaoCab('Código de convite'),
          const SizedBox(height: 6),
          Text('Os atletas digitam este código (ou leem o QR Code) para entrar na equipe.',
              style: TextStyle(color: c.texto2, fontSize: 13, height: 1.4)),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: Text(
                  _codigo ?? _erroCodigo ?? 'Carregando…',
                  style: const TextStyle(
                      fontSize: 22, fontWeight: FontWeight.w800, letterSpacing: 1.5),
                ),
              ),
              IconButton(
                tooltip: 'Copiar',
                icon: const Icon(Icons.copy_rounded),
                onPressed: _codigo == null
                    ? null
                    : () async {
                        await Clipboard.setData(ClipboardData(text: _codigo!));
                        if (context.mounted) aviso(context, 'Código copiado.');
                      },
              ),
              IconButton(
                tooltip: 'Gerar novo código',
                icon: const Icon(Icons.refresh_rounded),
                onPressed: () => _carregarCodigo(renovar: true),
              ),
            ],
          ),
          const SizedBox(height: 18),
          const SecaoCab('Treinos recorrentes'),
          const SizedBox(height: 10),
          TextField(
            controller: _local,
            decoration: const InputDecoration(labelText: 'Local'),
          ),
          const SizedBox(height: 14),
          Wrap(
            spacing: 8,
            children: [
              for (var i = 0; i < 7; i++)
                FilterChip(
                  label: Text(_diasCurtos[i]),
                  selected: _dias.contains(i + 1),
                  onSelected: (v) => setState(() {
                    if (v) {
                      _dias.add(i + 1);
                    } else {
                      _dias.remove(i + 1);
                    }
                  }),
                ),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: _escolherHora,
                  icon: const Icon(Icons.schedule_rounded),
                  label: Text('Início ${_hora(_inicio)}'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: DropdownButtonFormField<int>(
                  initialValue: _duracao,
                  decoration: const InputDecoration(labelText: 'Duração'),
                  items: [
                    for (final m in const [30, 45, 60, 75, 90, 120, 150, 180])
                      DropdownMenuItem(value: m, child: Text('$m min')),
                    if (![30, 45, 60, 75, 90, 120, 150, 180].contains(_duracao))
                      DropdownMenuItem(value: _duracao, child: Text('$_duracao min')),
                  ],
                  onChanged: (v) => setState(() => _duracao = v ?? _duracao),
                ),
              ),
            ],
          ),
          const SizedBox(height: 22),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: _salvando ? null : _salvar,
              child: Text(_salvando ? 'Salvando…' : 'Salvar'),
            ),
          ),
        ],
      ),
    );
  }
}
