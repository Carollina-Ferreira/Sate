import 'package:flutter/material.dart';

import '../data/modelos.dart';
import '../data/sate_store.dart';
import '../ui/cores.dart';
import '../ui/tela.dart';
import '../ui/widgets.dart';

Color corTipoEv(SC c, TipoEv t) => switch (t) {
      TipoEv.jogo => c.jogo,
      TipoEv.avaliacao => c.avaliacao,
      TipoEv.reuniao => c.reuniao,
      TipoEv.lembrete => c.lembrete,
    };

/// Detalhes de um evento do calendário (jogo, avaliação, reunião, lembrete).
class EventoDetalhePage extends StatelessWidget {
  final String eventoId;
  final bool treinador;
  const EventoDetalhePage({super.key, required this.eventoId, required this.treinador});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return AnimatedBuilder(
      animation: SateStore.i,
      builder: (context, _) {
        final s = SateStore.i;
        final e = s.evento(eventoId);
        if (e == null) {
          return const Tela(
            titulo: 'Evento',
            destaque: 'removido',
            children: [VazioView(Icons.event_busy_rounded, 'Não encontrado', 'Este evento foi removido.')],
          );
        }
        final cor = corTipoEv(c, e.tipo);
        Widget info(IconData i, String r, String v) => Expanded(
              child: Superficie(
                padding: const EdgeInsets.all(12),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Icon(i, size: 18, color: cor),
                  const SizedBox(height: 8),
                  Text(v,
                      style: TextStyle(
                          fontSize: 14, fontWeight: FontWeight.w700, color: c.texto)),
                  Text(r, style: TextStyle(fontSize: 11.5, color: c.texto2)),
                ]),
              ),
            );
        return Tela(
          titulo: 'Detalhes do',
          destaque: 'evento',
          acoes: treinador
              ? [
                  BotaoIcone(
                    icone: Icons.edit_rounded,
                    dica: 'Editar',
                    onTap: () => editarEvento(context, atual: e),
                  ),
                  const SizedBox(width: 8),
                  BotaoIcone(
                    icone: Icons.delete_outline_rounded,
                    dica: 'Excluir',
                    onTap: () async {
                      await SateStore.i.removerEvento(e.id);
                      if (context.mounted) Navigator.of(context).pop();
                    },
                  ),
                ]
              : const [],
          children: [
            Row(children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                    color: c.suave(cor), borderRadius: BorderRadius.circular(16)),
                child: Icon(e.tipo.icone, color: cor, size: 26),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(e.titulo,
                      style: TextStyle(
                          fontSize: 20, fontWeight: FontWeight.w700, color: c.texto)),
                  const SizedBox(height: 6),
                  Pilula(e.tipo.nome, cor),
                ]),
              ),
            ]),
            const SizedBox(height: 18),
            Row(children: [
              info(Icons.event_rounded, 'Data', dataBr(e.data)),
              const SizedBox(width: 10),
              info(Icons.schedule_rounded, 'Horário', '${horaTxt(e.inicioMin)} – ${horaTxt(e.fimMin)}'),
            ]),
            const SizedBox(height: 10),
            Row(children: [
              info(Icons.place_outlined, 'Local', e.local.isEmpty ? 'A definir' : e.local),
              const SizedBox(width: 10),
              info(Icons.groups_rounded, 'Para',
                  e.equipeId == null ? 'Todas as equipes' : s.equipe(e.equipeId!).nome),
            ]),
            if (e.observacoes.isNotEmpty) ...[
              const SizedBox(height: 20),
              const SecaoCab('Observações'),
              const SizedBox(height: 6),
              Text(e.observacoes,
                  style: TextStyle(fontSize: 14, height: 1.5, color: c.texto)),
            ],
          ],
        );
      },
    );
  }
}

/// Cria ou edita um evento (mesmos campos da agenda antiga).
Future<void> editarEvento(BuildContext context, {EventoAgenda? atual, DateTime? data}) async {
  final s = SateStore.i;
  final titulo = TextEditingController(text: atual?.titulo ?? '');
  final local = TextEditingController(text: atual?.local ?? '');
  final obs = TextEditingController(text: atual?.observacoes ?? '');
  var tipo = atual?.tipo ?? TipoEv.jogo;
  var dia = atual?.data ?? data ?? s.hoje;
  var ini = atual?.inicioMin ?? 10 * 60;
  var fim = atual?.fimMin ?? 12 * 60;
  String? equipe = atual?.equipeId;

  Widget campoToque(BuildContext ctx, IconData i, String t, VoidCallback f) {
    final c = ctx.sc;
    return InkWell(
      borderRadius: BorderRadius.circular(14),
      onTap: f,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 15),
        decoration: BoxDecoration(color: c.superficie, borderRadius: BorderRadius.circular(14)),
        child: Row(children: [
          Icon(i, size: 19, color: c.primaria),
          const SizedBox(width: 10),
          Text(t, style: TextStyle(color: c.texto)),
        ]),
      ),
    );
  }

  final ok = await abrirFolha<bool>(context, (ctx) {
    final c = ctx.sc;
    return StatefulBuilder(
      builder: (ctx, setM) => SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20, 4, 20, 24),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(atual == null ? 'Novo evento' : 'Editar evento',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: c.texto)),
          const SizedBox(height: 16),
          TextField(controller: titulo, decoration: decoracaoCampo(ctx, 'Título do evento')),
          const SizedBox(height: 14),
          Text('Tipo', style: TextStyle(fontSize: 12.5, color: c.texto2)),
          const SizedBox(height: 8),
          Wrap(spacing: 8, runSpacing: 8, children: [
            for (final t in TipoEv.values)
              FiltroChip(t.nome, t == tipo, () => setM(() => tipo = t), cor: corTipoEv(c, t)),
          ]),
          const SizedBox(height: 14),
          campoToque(ctx, Icons.event_rounded, 'Data: ${dataBr(dia)}', () async {
            final d = await showDatePicker(
              context: ctx,
              initialDate: dia,
              firstDate: DateTime(2020),
              lastDate: DateTime(2035),
            );
            if (d != null) setM(() => dia = somenteData(d));
          }),
          const SizedBox(height: 10),
          Row(children: [
            Expanded(
              child: campoToque(ctx, Icons.schedule_rounded, 'Início ${horaTxt(ini)}', () async {
                final t = await showTimePicker(
                    context: ctx, initialTime: TimeOfDay(hour: ini ~/ 60, minute: ini % 60));
                if (t != null) setM(() => ini = t.hour * 60 + t.minute);
              }),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: campoToque(ctx, Icons.schedule_rounded, 'Fim ${horaTxt(fim)}', () async {
                final t = await showTimePicker(
                    context: ctx, initialTime: TimeOfDay(hour: fim ~/ 60, minute: fim % 60));
                if (t != null) setM(() => fim = t.hour * 60 + t.minute);
              }),
            ),
          ]),
          const SizedBox(height: 12),
          TextField(controller: local, decoration: decoracaoCampo(ctx, 'Local')),
          const SizedBox(height: 14),
          Text('Para', style: TextStyle(fontSize: 12.5, color: c.texto2)),
          const SizedBox(height: 8),
          Wrap(spacing: 8, runSpacing: 8, children: [
            FiltroChip('Todas as equipes', equipe == null, () => setM(() => equipe = null)),
            for (final e in s.equipes)
              FiltroChip(e.nome, equipe == e.id, () => setM(() => equipe = e.id)),
          ]),
          const SizedBox(height: 12),
          TextField(
            controller: obs,
            minLines: 2,
            maxLines: 4,
            decoration: decoracaoCampo(ctx, 'Observações'),
          ),
          const SizedBox(height: 20),
          FilledButton(
            style: estiloBotao(ctx),
            onPressed: () {
              if (titulo.text.trim().isEmpty) {
                aviso(ctx, 'Informe o título do evento.');
                return;
              }
              if (fim <= ini) {
                aviso(ctx, 'O horário de fim deve ser depois do início.');
                return;
              }
              Navigator.pop(ctx, true);
            },
            child: const Text('Salvar evento'),
          ),
        ]),
      ),
    );
  });
  if (ok != true) return;
  await s.salvarEvento(EventoAgenda(
    id: atual?.id ?? s.novoId(),
    titulo: titulo.text.trim(),
    local: local.text.trim(),
    observacoes: obs.text.trim(),
    data: dia,
    tipo: tipo,
    inicioMin: ini,
    fimMin: fim,
    equipeId: equipe,
  ));
  if (context.mounted) aviso(context, 'Evento salvo.');
}
