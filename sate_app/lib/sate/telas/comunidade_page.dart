import 'dart:convert';
import 'dart:typed_data';

import 'package:image_picker/image_picker.dart';
import 'package:flutter/material.dart';

import '../data/modelos.dart';
import '../data/sate_store.dart';
import '../ui/cores.dart';
import '../ui/tela.dart';
import '../ui/widgets.dart';

String _tempo(DateTime q) {
  final d = DateTime.now().difference(q);
  if (d.inMinutes < 1) return 'agora';
  if (d.inMinutes < 60) return 'há ${d.inMinutes} min';
  if (d.inHours < 24) return 'há ${d.inHours} h';
  if (d.inDays == 1) return 'ontem';
  return 'há ${d.inDays} dias';
}

/// Comunidade (feed): foco em publicações. Avisos e pendências ficam nas notificações.
class ComunidadePage extends StatefulWidget {
  const ComunidadePage({super.key});

  @override
  State<ComunidadePage> createState() => _ComunidadePageState();
}

class _ComunidadePageState extends State<ComunidadePage> {
  int _filtro = 0;
  static const _filtros = ['Todos', 'Equipe', 'Seguindo'];

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return AnimatedBuilder(
      animation: SateStore.i,
      builder: (context, _) {
        final s = SateStore.i;
        final lista = s.posts.where((p) {
          if (_filtro == 1) return p.grupo == 'equipe';
          if (_filtro == 2) return p.grupo == 'seguindo';
          return true;
        }).toList();
        final nome = s.nomeUsuario.isEmpty ? 'Você' : s.nomeUsuario;
        return Tela(
          voltar: false,
          mostrarTitulo: false,
          titulo: '',
          destaque: '',
          children: [
            LinhaChips([
              for (var i = 0; i < _filtros.length; i++)
                FiltroChip(_filtros[i], _filtro == i, () => setState(() => _filtro = i)),
            ]),
            const SizedBox(height: 14),
            Superficie(
              onTap: () => publicar(context),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              child: Row(children: [
                AvatarIni(nome, tamanho: 38),
                const SizedBox(width: 12),
                Expanded(
                  child: Text('Compartilhe algo com a comunidade...',
                      style: TextStyle(fontSize: 13.5, color: c.texto2)),
                ),
                Icon(Icons.edit_outlined, size: 19, color: c.rosa),
              ]),
            ),
            const SizedBox(height: 8),
            if (lista.isEmpty)
              const VazioView(Icons.forum_outlined, 'Nada por aqui',
                  'Ainda não há publicações neste filtro.')
            else
              for (var i = 0; i < lista.length; i++) ...[
                Revela(ordem: i.clamp(0, 4).toInt(), child: _PostCard(p: lista[i])),
                if (i < lista.length - 1) Divider(height: 1, color: c.linha),
              ],
          ],
        );
      },
    );
  }
}

class _PostCard extends StatelessWidget {
  final Post p;
  const _PostCard({required this.p});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final s = SateStore.i;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 14),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          AvatarIni(p.autor, tamanho: 42),
          const SizedBox(width: 12),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(p.autor,
                  style: TextStyle(fontSize: 14.5, fontWeight: FontWeight.w700, color: c.texto)),
              Text(_tempo(p.quando), style: TextStyle(fontSize: 11.5, color: c.texto2)),
            ]),
          ),
          if (p.minha)
            PopupMenuButton<String>(
              icon: Icon(Icons.more_horiz_rounded, color: c.texto2),
              onSelected: (v) {
                if (v == 'e') publicar(context, atual: p);
                if (v == 'x') s.removerPost(p.id);
              },
              itemBuilder: (_) => const [
                PopupMenuItem(value: 'e', child: Text('Editar')),
                PopupMenuItem(value: 'x', child: Text('Excluir')),
              ],
            ),
        ]),
        const SizedBox(height: 10),
        Text(p.texto, style: TextStyle(fontSize: 14.5, height: 1.5, color: c.texto)),
        if (p.imagem != null) ...[
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(20),
            child: AspectRatio(
              aspectRatio: 16 / 10,
              child: imagemDoPost(p.imagem!),
            ),
          ),
        ],
        const SizedBox(height: 12),
        Row(children: [
          GestureDetector(
            onTap: () => s.alternarCurtida(p.id),
            behavior: HitTestBehavior.opaque,
            child: Row(children: [
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 180),
                child: Icon(
                  p.curtido ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                  key: ValueKey(p.curtido),
                  size: 21,
                  color: p.curtido ? c.rosa : c.texto2,
                ),
              ),
              const SizedBox(width: 6),
              Text('${p.curtidas}', style: TextStyle(fontSize: 13, color: c.texto2)),
            ]),
          ),
          const SizedBox(width: 22),
          GestureDetector(
            onTap: () => abrirComentarios(context, p.id),
            behavior: HitTestBehavior.opaque,
            child: Row(children: [
              Icon(Icons.chat_bubble_outline_rounded, size: 20, color: c.texto2),
              const SizedBox(width: 6),
              Text('${p.comentarios.length}',
                  style: TextStyle(fontSize: 13, color: c.texto2)),
            ]),
          ),
        ]),
      ]),
    );
  }
}

// Cache simples para não decodificar a mesma foto a cada reconstrução da tela.
final Map<String, Uint8List> _cacheImagens = {};

/// Mostra a imagem de um post: foto escolhida (guardada como "data:image/...;base64,...")
/// ou um asset antigo do app.
Widget imagemDoPost(String src) {
  if (src.startsWith('data:')) {
    final bytes = _cacheImagens.putIfAbsent(src, () => base64Decode(src.split(',').last));
    return Image.memory(bytes, fit: BoxFit.cover, width: double.infinity, gaplessPlayback: true);
  }
  return Image.asset(src, fit: BoxFit.cover, width: double.infinity);
}

/// Abre a câmera OU a galeria (as duas únicas opções) e devolve a foto comprimida.
Future<String?> _escolherImagem(BuildContext context, ImageSource origem) async {
  try {
    final x = await ImagePicker().pickImage(
      source: origem,
      maxWidth: 1080,
      imageQuality: 72, // reduz o tamanho: o feed é guardado no aparelho
    );
    if (x == null) return null;
    final bytes = await x.readAsBytes();
    return 'data:image/jpeg;base64,${base64Encode(bytes)}';
  } catch (_) {
    if (context.mounted) {
      aviso(
          context,
          origem == ImageSource.camera
              ? 'Não foi possível abrir a câmera. Verifique a permissão do app.'
              : 'Não foi possível abrir a galeria. Verifique a permissão do app.');
    }
    return null;
  }
}

Future<void> publicar(BuildContext context, {Post? atual}) async {
  final texto = TextEditingController(text: atual?.texto ?? '');
  String? imagem = atual?.imagem;
  final ok = await abrirFolha<bool>(context, (ctx) {
    final c = ctx.sc;
    return StatefulBuilder(builder: (ctx, setM) => SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 4, 20, 24),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(atual == null ? 'Nova publicação' : 'Editar publicação',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: c.texto)),
        const SizedBox(height: 16),
        TextField(
          controller: texto,
          autofocus: true,
          minLines: 4,
          maxLines: 8,
          decoration: decoracaoCampo(ctx, 'No que você está pensando?'),
        ),
        const SizedBox(height: 16),
        Text('Imagem (opcional)', style: TextStyle(fontSize: 12.5, color: c.texto2)),
        const SizedBox(height: 8),
        if (imagem != null) ...[
          Stack(children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: SizedBox(
                height: 150,
                width: double.infinity,
                child: imagemDoPost(imagem!),
              ),
            ),
            Positioned(
              top: 6,
              right: 6,
              child: InkWell(
                onTap: () => setM(() => imagem = null),
                child: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: const BoxDecoration(color: Colors.black54, shape: BoxShape.circle),
                  child: const Icon(Icons.close_rounded, size: 18, color: Colors.white),
                ),
              ),
            ),
          ]),
          const SizedBox(height: 10),
        ],
        Row(children: [
          Expanded(
            child: OutlinedButton.icon(
              onPressed: () async {
                final r = await _escolherImagem(ctx, ImageSource.camera);
                if (r != null) setM(() => imagem = r);
              },
              icon: const Icon(Icons.photo_camera_outlined),
              label: const Text('Câmera'),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: OutlinedButton.icon(
              onPressed: () async {
                final r = await _escolherImagem(ctx, ImageSource.gallery);
                if (r != null) setM(() => imagem = r);
              },
              icon: const Icon(Icons.photo_library_outlined),
              label: const Text('Galeria'),
            ),
          ),
        ]),
        const SizedBox(height: 20),
        FilledButton(
          style: estiloBotao(ctx),
          onPressed: () {
            if (texto.text.trim().isEmpty) {
              aviso(ctx, 'Escreva algo para publicar.');
              return;
            }
            Navigator.pop(ctx, true);
          },
          child: Text(atual == null ? 'Publicar' : 'Salvar'),
        ),
      ]),
    ));
  });
  if (ok != true) return;
  if (atual == null) {
    await SateStore.i.publicar(texto.text.trim(), imagem: imagem);
  } else {
    await SateStore.i.editarPost(atual.id, texto.text.trim(), imagem: imagem);
  }
}

Future<void> abrirComentarios(BuildContext context, String postId) {
  final ctrl = TextEditingController();
  return abrirFolha<void>(context, (ctx) {
    final c = ctx.sc;
    return AnimatedBuilder(
      animation: SateStore.i,
      builder: (ctx, _) {
        final p = SateStore.i.posts.where((x) => x.id == postId).toList();
        final coment = p.isEmpty ? <Comentario>[] : p.first.comentarios;
        return ConstrainedBox(
          constraints: BoxConstraints(maxHeight: MediaQuery.sizeOf(ctx).height * 0.7),
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 8),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text('Comentários',
                    style: TextStyle(
                        fontSize: 18, fontWeight: FontWeight.w700, color: c.texto)),
              ),
            ),
            Flexible(
              child: coment.isEmpty
                  ? const VazioView(Icons.chat_bubble_outline_rounded, 'Sem comentários',
                      'Seja a primeira pessoa a comentar.')
                  : ListView(
                      shrinkWrap: true,
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      children: [
                        for (final m in coment)
                          Padding(
                            padding: const EdgeInsets.symmetric(vertical: 8),
                            child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                              AvatarIni(m.autor, tamanho: 34),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(m.autor,
                                          style: TextStyle(
                                              fontSize: 13,
                                              fontWeight: FontWeight.w700,
                                              color: c.texto)),
                                      Text(m.texto,
                                          style: TextStyle(
                                              fontSize: 13.5, height: 1.4, color: c.texto)),
                                    ]),
                              ),
                            ]),
                          ),
                      ],
                    ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 16),
              child: Row(children: [
                Expanded(
                  child: TextField(
                    controller: ctrl,
                    decoration: decoracaoCampo(ctx, 'Escreva um comentário'),
                  ),
                ),
                const SizedBox(width: 8),
                BotaoIcone(
                  icone: Icons.send_rounded,
                  destaque: true,
                  onTap: () async {
                    final t = ctrl.text.trim();
                    if (t.isEmpty) return;
                    ctrl.clear();
                    await SateStore.i.comentar(postId, t);
                  },
                ),
              ]),
            ),
          ]),
        );
      },
    );
  });
}
