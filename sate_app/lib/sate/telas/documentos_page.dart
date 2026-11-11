import 'package:flutter/material.dart';

import '../data/modelos.dart';
import '../data/sate_store.dart';
import '../ui/cores.dart';
import '../ui/tela.dart';
import '../ui/widgets.dart';

Color corEstadoDoc(SC c, EstadoDoc e) => switch (e) {
      EstadoDoc.emDia => c.ok,
      EstadoDoc.proximo => c.pendente,
      EstadoDoc.pendente => c.vermelho,
      EstadoDoc.vencido => c.vermelho,
    };

String rotuloEstadoDoc(EstadoDoc e) => switch (e) {
      EstadoDoc.emDia => 'Em dia',
      EstadoDoc.proximo => 'Vence em breve',
      EstadoDoc.pendente => 'Pendente',
      EstadoDoc.vencido => 'Vencido',
    };

/// Linha minimalista de documento: indicador de estado, nome e validade.
class LinhaDocumento extends StatelessWidget {
  final Documento d;
  final VoidCallback onTap;
  const LinhaDocumento({super.key, required this.d, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final e = d.estado(SateStore.i.hoje);
    final cor = corEstadoDoc(c, e);
    final detalhe = d.validade == null
        ? rotuloEstadoDoc(e)
        : '${rotuloEstadoDoc(e)} · ${dataBr(d.validade!)}';
    return InkWell(
      borderRadius: BorderRadius.circular(14),
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 9, horizontal: 2),
        child: Row(children: [
          Container(
            width: 9,
            height: 9,
            decoration: BoxDecoration(color: cor, shape: BoxShape.circle),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(d.titulo,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: c.texto)),
              const SizedBox(height: 1),
              Text(detalhe, style: TextStyle(fontSize: 12, color: cor)),
            ]),
          ),
          Icon(Icons.chevron_right_rounded, size: 20, color: c.texto2),
        ]),
      ),
    );
  }
}

/// Documentação: organizada por atleta, com busca pelo nome.
class DocumentosPage extends StatefulWidget {
  const DocumentosPage({super.key});

  @override
  State<DocumentosPage> createState() => _DocumentosPageState();
}

class _DocumentosPageState extends State<DocumentosPage> {
  String _filtro = 'Todos';
  String _busca = '';
  final Set<String> _abertos = {};

  bool _passa(Documento d, DateTime h) {
    final e = d.estado(h);
    return switch (_filtro) {
      'Pendentes' => e == EstadoDoc.pendente,
      'Vencidos' => e == EstadoDoc.vencido,
      'A vencer' => e == EstadoDoc.proximo,
      _ => true,
    };
  }

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return AnimatedBuilder(
      animation: SateStore.i,
      builder: (context, _) {
        final s = SateStore.i;
        final h = s.hoje;
        final docs = s.documentos;
        final nPend = docs.where((d) => d.estado(h) == EstadoDoc.pendente).length;
        final nVenc = docs.where((d) => d.estado(h) == EstadoDoc.vencido).length;
        final nAVenc = docs.where((d) => d.estado(h) == EstadoDoc.proximo).length;

        // Grupos: treinador primeiro, depois atletas em ordem alfabética.
        final grupos = <({String? id, String nome, String sub, List<Documento> docs})>[];
        final busca = _busca.trim().toLowerCase();
        final meus = s.documentosDe(null).where((d) => _passa(d, h)).toList();
        if (busca.isEmpty || 'treinador comissão meus documentos'.contains(busca)) {
          if (meus.isNotEmpty) {
            grupos.add((id: null, nome: 'Meus documentos', sub: 'Treinador', docs: meus));
          }
        }
        final atletas = [...s.atletas]..sort((a, b) => a.nome.compareTo(b.nome));
        for (final a in atletas) {
          if (busca.isNotEmpty && !a.nome.toLowerCase().contains(busca)) continue;
          final l = s.documentosDe(a.id).where((d) => _passa(d, h)).toList();
          if (l.isEmpty && (_filtro != 'Todos' || busca.isEmpty)) continue;
          grupos.add((id: a.id, nome: a.nome, sub: s.equipe(a.equipeId).modalidade, docs: l));
        }

        return Tela(
          titulo: '',
          destaque: 'Documentação',
          fab: FloatingActionButton(
            heroTag: null,
            backgroundColor: c.rosa,
            foregroundColor: Colors.white,
            onPressed: () => editarDocumento(context),
            child: const Icon(Icons.add_rounded),
          ),
          children: [
            TextField(
              onChanged: (v) => setState(() => _busca = v),
              style: TextStyle(color: c.texto),
              decoration: decoracaoCampo(context, 'Buscar atleta pelo nome').copyWith(
                prefixIcon: Icon(Icons.search_rounded, color: c.texto2),
              ),
            ),
            const SizedBox(height: 12),
            LinhaChips([
              FiltroChip('Todos', _filtro == 'Todos', () => setState(() => _filtro = 'Todos')),
              FiltroChip('Pendentes ($nPend)', _filtro == 'Pendentes',
                  () => setState(() => _filtro = 'Pendentes')),
              FiltroChip('Vencidos ($nVenc)', _filtro == 'Vencidos',
                  () => setState(() => _filtro = 'Vencidos')),
              FiltroChip('A vencer ($nAVenc)', _filtro == 'A vencer',
                  () => setState(() => _filtro = 'A vencer')),
            ]),
            const SizedBox(height: 14),
            if (grupos.isEmpty)
              const VazioView(Icons.folder_open_rounded, 'Nada encontrado',
                  'Ajuste a busca ou o filtro.')
            else
              for (var i = 0; i < grupos.length; i++)
                Revela(
                  ordem: i.clamp(0, 5).toInt(),
                  child: _Grupo(
                    nome: grupos[i].nome,
                    sub: grupos[i].sub,
                    atletaId: grupos[i].id,
                    docs: grupos[i].docs,
                    aberto: _abertos.contains(grupos[i].id ?? 'treinador') ||
                        busca.isNotEmpty ||
                        _filtro != 'Todos',
                    onAlternar: () => setState(() {
                      final k = grupos[i].id ?? 'treinador';
                      _abertos.contains(k) ? _abertos.remove(k) : _abertos.add(k);
                    }),
                  ),
                ),
            const SizedBox(height: 8),
            Legenda([
              ('Em dia', c.ok),
              ('Vence em até 30 dias', c.pendente),
              ('Pendente ou vencido', c.vermelho),
            ]),
          ],
        );
      },
    );
  }
}

class _Grupo extends StatelessWidget {
  final String nome, sub;
  final String? atletaId;
  final List<Documento> docs;
  final bool aberto;
  final VoidCallback onAlternar;
  const _Grupo({
    required this.nome,
    required this.sub,
    required this.atletaId,
    required this.docs,
    required this.aberto,
    required this.onAlternar,
  });

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final h = SateStore.i.hoje;
    final problemas = docs.where((d) {
      final e = d.estado(h);
      return e == EstadoDoc.pendente || e == EstadoDoc.vencido;
    }).length;
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Container(
        decoration: BoxDecoration(
          color: c.superficie,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Column(children: [
          InkWell(
            borderRadius: BorderRadius.circular(20),
            onTap: onAlternar,
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Row(children: [
                atletaId == null
                    ? Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                            color: c.suave(c.rosa), shape: BoxShape.circle),
                        child: Icon(Icons.badge_outlined, size: 20, color: c.rosa),
                      )
                    : AvatarIni(nome, tamanho: 40),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(nome,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                            fontSize: 14.5, fontWeight: FontWeight.w700, color: c.texto)),
                    Text(
                      '$sub · ${docs.length} ${docs.length == 1 ? 'documento' : 'documentos'}',
                      style: TextStyle(fontSize: 12, color: c.texto2),
                    ),
                  ]),
                ),
                if (problemas > 0)
                  Container(
                    margin: const EdgeInsets.only(right: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: c.suave(c.vermelho),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text('$problemas',
                        style: TextStyle(
                            fontSize: 12, fontWeight: FontWeight.w700, color: c.vermelho)),
                  ),
                AnimatedRotation(
                  turns: aberto ? 0.5 : 0,
                  duration: const Duration(milliseconds: 200),
                  child: Icon(Icons.keyboard_arrow_down_rounded, color: c.texto2),
                ),
              ]),
            ),
          ),
          AnimatedCrossFade(
            duration: const Duration(milliseconds: 220),
            crossFadeState: aberto ? CrossFadeState.showSecond : CrossFadeState.showFirst,
            firstChild: const SizedBox(width: double.infinity),
            secondChild: Padding(
              padding: const EdgeInsets.fromLTRB(14, 0, 14, 8),
              child: Column(children: [
                Divider(height: 1, color: c.linha),
                if (docs.isEmpty)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    child: Text('Nenhum documento cadastrado.',
                        style: TextStyle(fontSize: 13, color: c.texto2)),
                  ),
                for (final d in docs)
                  LinhaDocumento(
                      d: d, onTap: () => editarDocumento(context, atual: d)),
                const SizedBox(height: 2),
                Align(
                  alignment: Alignment.centerLeft,
                  child: TextButton.icon(
                    onPressed: () => editarDocumento(context, atletaId: atletaId, fixarDono: true),
                    icon: Icon(Icons.add_rounded, size: 18, color: c.rosa),
                    label: Text('Adicionar documento',
                        style: TextStyle(
                            fontSize: 13, color: c.rosa, fontWeight: FontWeight.w600)),
                  ),
                ),
              ]),
            ),
          ),
        ]),
      ),
    );
  }
}

/// Cria ou edita um documento. [atletaId] define o dono (null = treinador).
Future<void> editarDocumento(
  BuildContext context, {
  Documento? atual,
  String? atletaId,
  bool fixarDono = false,
}) async {
  final s = SateStore.i;
  final titulo = TextEditingController(text: atual?.titulo ?? '');
  final cat = TextEditingController(text: atual?.categoria ?? '');
  final obs = TextEditingController(text: atual?.obs ?? '');
  var validade = atual?.validade;
  var aprovado = atual?.aprovado ?? false;
  var dono = atual?.atletaId ?? atletaId;
  var remover = false;

  final ok = await abrirFolha<bool>(context, (ctx) {
    final c = ctx.sc;
    return StatefulBuilder(
      builder: (ctx, setM) => SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20, 4, 20, 24),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(atual == null ? 'Novo documento' : 'Editar documento',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: c.texto)),
          const SizedBox(height: 16),
          if (!fixarDono && atual == null) ...[
            Text('Documento de', style: TextStyle(fontSize: 12.5, color: c.texto2)),
            const SizedBox(height: 8),
            LinhaChips([
              FiltroChip('Treinador', dono == null, () => setM(() => dono = null)),
              for (final a in s.atletas)
                FiltroChip(a.nome.split(' ').first, dono == a.id, () => setM(() => dono = a.id)),
            ]),
            const SizedBox(height: 14),
          ] else if (dono != null) ...[
            Row(children: [
              AvatarIni(s.atletas.firstWhere((a) => a.id == dono).nome, tamanho: 30),
              const SizedBox(width: 10),
              Text(s.atletas.firstWhere((a) => a.id == dono).nome,
                  style: TextStyle(
                      fontSize: 13.5, fontWeight: FontWeight.w600, color: c.texto)),
            ]),
            const SizedBox(height: 14),
          ],
          TextField(
              controller: titulo,
              style: TextStyle(color: c.texto),
              decoration: decoracaoCampo(ctx, 'Nome do documento')),
          const SizedBox(height: 12),
          TextField(
              controller: cat,
              style: TextStyle(color: c.texto),
              decoration: decoracaoCampo(ctx, 'Categoria')),
          const SizedBox(height: 12),
          InkWell(
            borderRadius: BorderRadius.circular(14),
            onTap: () async {
              final d = await showDatePicker(
                context: ctx,
                initialDate: validade ?? s.hoje,
                firstDate: DateTime(2020),
                lastDate: DateTime(2040),
              );
              if (d != null) setM(() => validade = somenteData(d));
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
              decoration:
                  BoxDecoration(color: c.superficie, borderRadius: BorderRadius.circular(14)),
              child: Row(children: [
                Icon(Icons.event_rounded, size: 19, color: c.primaria),
                const SizedBox(width: 10),
                Text(validade == null ? 'Definir validade' : 'Validade: ${dataBr(validade!)}',
                    style: TextStyle(color: c.texto)),
              ]),
            ),
          ),
          const SizedBox(height: 8),
          SwitchListTile(
            contentPadding: EdgeInsets.zero,
            activeColor: c.primaria,
            title: Text('Documento aprovado', style: TextStyle(color: c.texto)),
            value: aprovado,
            onChanged: (v) => setM(() => aprovado = v),
          ),
          TextField(
            controller: obs,
            minLines: 2,
            maxLines: 4,
            style: TextStyle(color: c.texto),
            decoration: decoracaoCampo(ctx, 'Observações'),
          ),
          const SizedBox(height: 20),
          FilledButton(
            style: estiloBotao(ctx),
            onPressed: () {
              if (titulo.text.trim().isEmpty) {
                aviso(ctx, 'Informe o nome do documento.');
                return;
              }
              Navigator.pop(ctx, true);
            },
            child: const Text('Salvar'),
          ),
          if (atual != null) ...[
            const SizedBox(height: 8),
            Center(
              child: TextButton(
                onPressed: () {
                  remover = true;
                  Navigator.pop(ctx, true);
                },
                child: Text('Excluir documento', style: TextStyle(color: c.vermelho)),
              ),
            ),
          ],
        ]),
      ),
    );
  });

  if (ok != true) return;
  if (remover && atual != null) {
    await s.removerDocumento(atual.id);
    return;
  }
  await s.salvarDocumento(Documento(
    id: atual?.id ?? s.novoId(),
    titulo: titulo.text.trim(),
    categoria: cat.text.trim().isEmpty ? 'Geral' : cat.text.trim(),
    validade: validade,
    aprovado: aprovado,
    obs: obs.text.trim(),
    atletaId: dono,
  ));
}
