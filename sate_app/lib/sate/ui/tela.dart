import 'package:flutter/material.dart';

import '../../theme/sate_theme.dart';
import 'cores.dart';
import 'fundo.dart';
import 'widgets.dart';

/// Abre uma tela do SATE com transição padrão.
Future<T?> abrir<T>(BuildContext context, Widget pagina) =>
    Navigator.of(context).push<T>(MaterialPageRoute(builder: (_) => pagina));

/// Telas antigas usam cores fixas do modo claro: abrimos sempre em tema claro.
Future<T?> abrirLegado<T>(BuildContext context, Widget pagina) {
  return Navigator.of(context).push<T>(
    MaterialPageRoute(
      builder: (_) => Theme(data: SateTema.claro, child: pagina),
    ),
  );
}

/// Linha fina e discreta que separa o cabeçalho do conteúdo.
class DivisaoMarca extends StatelessWidget {
  const DivisaoMarca({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(height: 1, color: context.sc.linha);
  }
}

/// Estrutura padrão das telas internas.
/// Telas abertas por cima (voltar = true) ganham um cabeçalho fixo compacto:
/// voltar + título à esquerda e ações à direita, com divisão em cor da marca.
/// Abas principais (mostrarTitulo = false) usam o cabeçalho do app.
class Tela extends StatelessWidget {
  final String titulo;
  final String destaque;
  final String? subtitulo;
  final List<Widget> acoes;
  final List<Widget> children;
  final Widget? fab;
  final bool voltar;

  /// false nas abas principais: o título fica no cabeçalho do app.
  final bool mostrarTitulo;

  /// true quando [destaque] completa a mesma palavra de [titulo] (sem espaço entre os dois).
  final bool colado;

  const Tela({
    super.key,
    required this.titulo,
    required this.destaque,
    this.subtitulo,
    this.acoes = const [],
    required this.children,
    this.fab,
    this.voltar = true,
    this.mostrarTitulo = true,
    this.colado = false,
  });

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final compacto = mostrarTitulo && voltar;
    return Scaffold(
      backgroundColor: c.fundo,
      floatingActionButton: fab,
      body: FundoSate(
        child: SafeArea(
          bottom: false,
          child: Column(children: [
            if (compacto) ...[
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 10),
                child: Row(children: [
                  BotaoIcone(
                    icone: Icons.arrow_back_ios_new_rounded,
                    onTap: () => Navigator.of(context).maybePop(),
                    dica: 'Voltar',
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text.rich(
                      TextSpan(children: [
                        TextSpan(
                          text: titulo.isEmpty ? '' : (colado ? titulo : '$titulo '),
                          style: TextStyle(
                              fontSize: 18, fontWeight: FontWeight.w700, color: c.texto),
                        ),
                        TextSpan(
                          text: destaque,
                          style: SateEstilo.destaque.copyWith(
                              fontSize: colado ? 20 : 23,
                              letterSpacing: colado ? 0 : null,
                              color: c.rosa),
                        ),
                      ]),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  ...acoes,
                ]),
              ),
              const DivisaoMarca(),
            ],
            Expanded(
              child: ListView(
                physics: const BouncingScrollPhysics(),
                padding: EdgeInsets.fromLTRB(20, compacto ? 18 : 6, 20, 110),
                children: [
                  if (mostrarTitulo && !voltar) ...[
                    CabecalhoTela(
                      titulo: titulo,
                      destaque: destaque,
                      subtitulo: subtitulo,
                      acoes: acoes,
                      colado: colado,
                    ),
                    const SizedBox(height: 20),
                  ] else if (compacto && subtitulo != null) ...[
                    Text(subtitulo!, style: TextStyle(fontSize: 13, color: c.texto2)),
                    const SizedBox(height: 16),
                  ],
                  ...children,
                ],
              ),
            ),
          ]),
        ),
      ),
    );
  }
}

class BotaoIcone extends StatelessWidget {
  final IconData icone;
  final VoidCallback? onTap;
  final String? dica;
  final bool destaque;
  const BotaoIcone({
    super.key,
    required this.icone,
    this.onTap,
    this.dica,
    this.destaque = false,
  });

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return Tooltip(
      message: dica ?? '',
      child: Material(
        color: destaque ? c.primaria : c.superficie,
        shape: const CircleBorder(),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: onTap,
          child: SizedBox(
            width: 42,
            height: 42,
            child: Icon(
              icone,
              size: 19,
              color: destaque ? c.sobrePrimaria : c.texto,
            ),
          ),
        ),
      ),
    );
  }
}

/// Alternador de segmentos (Dia / Semana / Mês etc.), com indicador animado.
class Segmentos extends StatelessWidget {
  final List<String> rotulos;
  final int indice;
  final ValueChanged<int> onChanged;
  const Segmentos({
    super.key,
    required this.rotulos,
    required this.indice,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: c.superficie,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          for (var i = 0; i < rotulos.length; i++)
            Expanded(
              child: GestureDetector(
                behavior: HitTestBehavior.opaque,
                onTap: () => onChanged(i),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 220),
                  curve: Curves.easeOut,
                  padding: const EdgeInsets.symmetric(vertical: 9),
                  decoration: BoxDecoration(
                    color: indice == i ? c.primaria : Colors.transparent,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    rotulos[i],
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: indice == i ? c.sobrePrimaria : c.texto2,
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

/// Linha de lista simples: ícone suave + título + subtítulo + complemento.
class LinhaItem extends StatelessWidget {
  final IconData icone;
  final Color? cor;
  final String titulo;
  final String? sub;
  final Widget? fim;
  final VoidCallback? onTap;
  const LinhaItem({
    super.key,
    required this.icone,
    this.cor,
    required this.titulo,
    this.sub,
    this.fim,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final cc = cor ?? c.primaria;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(
          children: [
            Container(
              width: 42,
              height: 42,
              decoration: BoxDecoration(
                color: c.suave(cc),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(icone, size: 20, color: cc),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    titulo,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 14.5,
                      fontWeight: FontWeight.w600,
                      color: c.texto,
                    ),
                  ),
                  if (sub != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 2),
                      child: Text(
                        sub!,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(fontSize: 12.5, color: c.texto2),
                      ),
                    ),
                ],
              ),
            ),
            if (fim != null) ...[const SizedBox(width: 8), fim!],
          ],
        ),
      ),
    );
  }
}

/// Chip de filtro (seleção única) com visual do SATE.
class FiltroChip extends StatelessWidget {
  final String texto;
  final bool ativo;
  final VoidCallback onTap;
  final Color? cor;
  const FiltroChip(this.texto, this.ativo, this.onTap, {super.key, this.cor});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final cc = cor ?? c.primaria;
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: ativo ? cc : c.superficie,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(
          texto,
          style: TextStyle(
            fontSize: 12.5,
            fontWeight: FontWeight.w600,
            color: ativo ? c.sobrePrimaria : c.texto2,
          ),
        ),
      ),
    );
  }
}

/// Linha horizontal rolável de chips.
class LinhaChips extends StatelessWidget {
  final List<Widget> chips;
  const LinhaChips(this.chips, {super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 38,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        itemCount: chips.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (_, i) => chips[i],
      ),
    );
  }
}

/// Contador com - e + para séries, repetições etc.
class Contador extends StatelessWidget {
  final String rotulo;
  final int valor;
  final int min, max, passo;
  final ValueChanged<int> onChanged;
  final String sufixo;
  const Contador({
    super.key,
    required this.rotulo,
    required this.valor,
    required this.onChanged,
    this.min = 0,
    this.max = 999,
    this.passo = 1,
    this.sufixo = '',
  });

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    Widget botao(IconData i, VoidCallback? f) => GestureDetector(
          onTap: f,
          child: Container(
            width: 34,
            height: 34,
            decoration: BoxDecoration(
              color: f == null ? c.superficie : c.primariaSuave,
              shape: BoxShape.circle,
            ),
            child: Icon(i, size: 18, color: f == null ? c.vazio : c.primaria),
          ),
        );
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: c.superficie,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        children: [
          Text(rotulo, style: TextStyle(fontSize: 11.5, color: c.texto2)),
          const SizedBox(height: 6),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              botao(Icons.remove_rounded,
                  valor - passo < min ? null : () => onChanged(valor - passo)),
              Text(
                '$valor$sufixo',
                style: TextStyle(
                    fontSize: 16, fontWeight: FontWeight.w700, color: c.texto),
              ),
              botao(Icons.add_rounded,
                  valor + passo > max ? null : () => onChanged(valor + passo)),
            ],
          ),
        ],
      ),
    );
  }
}

/// Quando [embutido], devolve só o conteúdo (para ficar dentro de outra tela);
/// caso contrário, a tela completa com título.
Widget corpoDeTela({
  required bool embutido,
  required String titulo,
  required String destaque,
  String? subtitulo,
  List<Widget> acoes = const [],
  required List<Widget> children,
  Widget? fab,
  bool voltar = true,
  Widget? acaoEmbutida,
}) {
  if (embutido) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (acaoEmbutida != null) ...[acaoEmbutida, const SizedBox(height: 14)],
        ...children,
      ],
    );
  }
  return Tela(
    voltar: voltar,
    titulo: titulo,
    destaque: destaque,
    subtitulo: subtitulo,
    acoes: acoes,
    fab: fab,
    children: children,
  );
}

/// Botão de ação largo usado no topo de áreas embutidas (substitui o FAB).
class BotaoAcao extends StatelessWidget {
  final IconData icone;
  final String texto;
  final VoidCallback onTap;
  const BotaoAcao({super.key, required this.icone, required this.texto, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return FilledButton.icon(
      style: FilledButton.styleFrom(
        backgroundColor: c.rosa,
        foregroundColor: Colors.white,
        minimumSize: const Size.fromHeight(46),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      ),
      onPressed: onTap,
      icon: Icon(icone, size: 19),
      label: Text(texto, style: const TextStyle(fontWeight: FontWeight.w600)),
    );
  }
}

// ───────────────────────── Seletores compactos ─────────────────────────

/// Item de uma lista de seleção em folha inferior.
class ItemSel<T> {
  final T valor;
  final String titulo;
  final String? sub;

  /// Se informado, mostra um avatar com as iniciais deste nome.
  final String? avatar;
  const ItemSel(this.valor, this.titulo, {this.sub, this.avatar});
}

/// Botão que mostra "rótulo + valor atual" e abre um seletor.
class SeletorPill extends StatelessWidget {
  final String rotulo;
  final String valor;
  final VoidCallback onTap;
  final Widget? leading;
  const SeletorPill({
    super.key,
    required this.rotulo,
    required this.valor,
    required this.onTap,
    this.leading,
  });

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return Material(
      color: c.superficie,
      borderRadius: BorderRadius.circular(18),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          child: Row(children: [
            if (leading != null) ...[leading!, const SizedBox(width: 10)],
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(rotulo, style: TextStyle(fontSize: 11, color: c.texto2)),
                const SizedBox(height: 1),
                Text(valor,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                        fontSize: 13.5, fontWeight: FontWeight.w700, color: c.texto)),
              ]),
            ),
            Icon(Icons.keyboard_arrow_down_rounded, size: 20, color: c.texto2),
          ]),
        ),
      ),
    );
  }
}

/// Folha de seleção com busca opcional. [multi] permite escolher vários (até [max]).
Future<List<T>?> abrirSeletor<T>(
  BuildContext context, {
  required String titulo,
  required List<ItemSel<T>> itens,
  required List<T> atuais,
  bool multi = false,
  int max = 4,
  bool busca = true,
}) {
  final sel = [...atuais];
  var filtro = '';
  return showModalBottomSheet<List<T>>(
    context: context,
    isScrollControlled: true,
    useSafeArea: true,
    showDragHandle: true,
    backgroundColor: context.sc.fundo,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
    ),
    builder: (ctx) => StatefulBuilder(
      builder: (ctx, setM) {
        final c = ctx.sc;
        final lista = itens
            .where((i) => i.titulo.toLowerCase().contains(filtro.toLowerCase()))
            .toList();
        return ConstrainedBox(
          constraints: BoxConstraints(maxHeight: MediaQuery.sizeOf(ctx).height * 0.78),
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 10),
              child: Row(children: [
                Expanded(
                  child: Text(titulo,
                      style: TextStyle(
                          fontSize: 18, fontWeight: FontWeight.w700, color: c.texto)),
                ),
                if (multi)
                  TextButton(
                    onPressed: () => Navigator.pop(ctx, sel),
                    child: Text('Concluir', style: TextStyle(color: c.rosa)),
                  ),
              ]),
            ),
            if (busca)
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 8),
                child: TextField(
                  onChanged: (v) => setM(() => filtro = v),
                  style: TextStyle(color: c.texto),
                  decoration: decoracaoCampo(ctx, 'Buscar').copyWith(
                    prefixIcon: Icon(Icons.search_rounded, color: c.texto2),
                  ),
                ),
              ),
            Flexible(
              child: ListView(
                shrinkWrap: true,
                padding: const EdgeInsets.fromLTRB(12, 0, 12, 20),
                children: [
                  for (final i in lista)
                    ListTile(
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      leading: i.avatar == null ? null : AvatarIni(i.avatar!, tamanho: 38),
                      title: Text(i.titulo,
                          style: TextStyle(
                              fontSize: 14.5, fontWeight: FontWeight.w600, color: c.texto)),
                      subtitle: i.sub == null
                          ? null
                          : Text(i.sub!, style: TextStyle(fontSize: 12, color: c.texto2)),
                      trailing: sel.contains(i.valor)
                          ? Icon(Icons.check_circle_rounded, color: c.rosa)
                          : (multi ? Icon(Icons.circle_outlined, color: c.vazio) : null),
                      onTap: () {
                        if (!multi) {
                          Navigator.pop(ctx, [i.valor]);
                          return;
                        }
                        setM(() {
                          if (sel.contains(i.valor)) {
                            if (sel.length > 1) sel.remove(i.valor);
                          } else if (sel.length < max) {
                            sel.add(i.valor);
                          }
                        });
                      },
                    ),
                ],
              ),
            ),
          ]),
        );
      },
    ),
  );
}
