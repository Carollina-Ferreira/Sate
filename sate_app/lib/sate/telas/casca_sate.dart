import 'package:flutter/material.dart';

import '../../pages/Atleta/atleta_qrcode_page.dart';
import '../../pages/login_page.dart';
import '../../theme/sate_theme.dart';
import '../data/sate_store.dart';
import '../ui/cores.dart';
import '../ui/tela.dart';
import '../ui/widgets.dart';
import 'configuracoes_pages.dart';
import 'documentos_page.dart';
import 'notificacoes_page.dart';
import 'perfil_sate_page.dart';
import 'planos_page.dart';
import 'tutorial_page.dart';

Future<void> sairDaConta(BuildContext context) async {
  final ok = await showDialog<bool>(
    context: context,
    builder: (ctx) => AlertDialog(
      title: const Text('Sair da conta?'),
      content: const Text('Você voltará para a tela de login.'),
      actions: [
        TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancelar')),
        TextButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Sair')),
      ],
    ),
  );
  if (ok == true && context.mounted) {
    Navigator.of(context, rootNavigator: true).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const LoginPage()),
      (_) => false,
    );
  }
}

/// Estrutura comum das duas áreas: cabeçalho superior, gaveta lateral e barra inferior.
class CascaSate extends StatefulWidget {
  final bool treinador;
  final String nome;
  final String email;
  final List<ItemNav> itens;

  /// (texto, palavra em destaque) de cada aba, para o cabeçalho.
  final List<(String, String)> titulos;

  /// Monta as páginas das abas. [irPara] troca de aba.
  final List<Widget> Function(ValueChanged<int> irPara) paginas;

  const CascaSate({
    super.key,
    required this.treinador,
    required this.nome,
    required this.email,
    required this.itens,
    required this.titulos,
    required this.paginas,
  });

  @override
  State<CascaSate> createState() => _CascaSateState();
}

class _CascaSateState extends State<CascaSate> {
  int _i = 0;
  final PageController _pagina = PageController();
  late final Future<void> _pronto;
  List<Widget>? _paginas;

  @override
  void initState() {
    super.initState();
    _pronto = SateStore.i
        .iniciar(nome: widget.nome, email: widget.email, ehTreinador: widget.treinador)
        .then((_) => _tutorialInicial());
  }

  Future<void> _tutorialInicial() async {
    final visto = await SateStore.i.tutorialVisto(widget.treinador);
    if (!visto && mounted) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (!mounted) return;
        Navigator.of(context).push(
          MaterialPageRoute(builder: (_) => TutorialSatePage(treinador: widget.treinador)),
        );
      });
    }
  }

  @override
  void dispose() {
    _pagina.dispose();
    super.dispose();
  }

  /// Troca de aba pela barra inferior (ou por atalhos das telas): a página desliza
  /// quando é vizinha e salta quando está longe, mantendo a barra sincronizada.
  void _ir(int i) {
    if (i == _i) return;
    setState(() => _i = i);
    if (!_pagina.hasClients) return;
    final atual = (_pagina.page ?? _i.toDouble()).round();
    if ((i - atual).abs() == 1) {
      _pagina.animateToPage(i,
          duration: const Duration(milliseconds: 280), curve: Curves.easeOutCubic);
    } else {
      _pagina.jumpToPage(i);
    }
  }

  void _abrirNotificacoes() => abrir(
        context,
        NotificacoesPage(treinador: widget.treinador, irPara: _ir),
      );

  void _abrirPerfil() => abrir(
        context,
        widget.treinador ? const PerfilTreinadorSatePage() : const PerfilAtletaSatePage(),
      );

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return FutureBuilder<void>(
      future: _pronto,
      builder: (context, snap) {
        if (snap.connectionState != ConnectionState.done) {
          return Scaffold(
            backgroundColor: c.fundo,
            body: Center(child: CircularProgressIndicator(color: c.primaria)),
          );
        }
        _paginas ??= widget.paginas(_ir);
        final t = widget.titulos[_i];
        return Scaffold(
          backgroundColor: c.fundo,
          drawerEdgeDragWidth: 40,
          drawer: GavetaSate(
            treinador: widget.treinador,
            nome: SateStore.i.nomeUsuario,
            email: widget.email,
            onPerfil: _abrirPerfil,
            onNotificacoes: _abrirNotificacoes,
          ),
          appBar: AppBar(
            backgroundColor: c.fundo,
            surfaceTintColor: Colors.transparent,
            elevation: 0,
            scrolledUnderElevation: 0,
            toolbarHeight: 58,
            automaticallyImplyLeading: false,
            titleSpacing: 0,
            leadingWidth: 62,
            leading: Builder(
              builder: (ctx) => Padding(
                padding: const EdgeInsets.only(left: 14),
                child: Center(
                  child: BotaoIcone(
                    icone: Icons.menu_rounded,
                    dica: 'Menu',
                    onTap: () => Scaffold.of(ctx).openDrawer(),
                  ),
                ),
              ),
            ),
            title: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 200),
                  child: Text.rich(
                    key: ValueKey(_i),
                    TextSpan(children: [
                      TextSpan(
                        text: '${t.$1} ',
                        style: TextStyle(
                            fontSize: 18, fontWeight: FontWeight.w700, color: c.texto),
                      ),
                      TextSpan(
                        text: t.$2,
                        style: SateEstilo.destaque.copyWith(fontSize: 22, color: c.rosa),
                      ),
                    ]),
                  ),
                ),
              ],
            ),
            bottom: const PreferredSize(
              preferredSize: Size.fromHeight(1),
              child: DivisaoMarca(),
            ),
            actions: [
              AnimatedBuilder(
                animation: SateStore.i,
                builder: (context, _) {
                  final n = contarAvisos(widget.treinador);
                  return Stack(clipBehavior: Clip.none, children: [
                    BotaoIcone(
                      icone: Icons.notifications_none_rounded,
                      dica: 'Notificações',
                      onTap: _abrirNotificacoes,
                    ),
                    if (n > 0)
                      Positioned(
                        right: -2,
                        top: -2,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                          constraints: const BoxConstraints(minWidth: 17),
                          decoration: BoxDecoration(
                            color: c.rosa,
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: c.fundo, width: 1.5),
                          ),
                          child: Text('$n',
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.white)),
                        ),
                      ),
                  ]);
                },
              ),
              const SizedBox(width: 10),
              GestureDetector(
                onTap: _abrirPerfil,
                child: AvatarIni(
                    SateStore.i.nomeUsuario.isEmpty
                        ? (widget.treinador ? 'Treinador' : 'Atleta')
                        : SateStore.i.nomeUsuario,
                    tamanho: 40),
              ),
              const SizedBox(width: 16),
            ],
          ),
          // Deslizar para os lados troca de aba (como no Instagram). A barra inferior
          // continua fixa e é atualizada junto; rolagens horizontais internas têm prioridade.
          body: PageView(
            controller: _pagina,
            physics: const PageScrollPhysics(),
            onPageChanged: (i) {
              if (i != _i) setState(() => _i = i);
            },
            children: [for (final p in _paginas!) _PaginaMantida(child: p)],
          ),
          bottomNavigationBar: SateNavBar(
            indice: _i,
            onChanged: _ir,
            itens: widget.itens,
          ),
        );
      },
    );
  }
}

/// Gaveta lateral: conta, configurações e ajuda. Abre pelo ícone de menu ou arrastando da borda.
class GavetaSate extends StatelessWidget {
  final bool treinador;
  final String nome, email;
  final VoidCallback onPerfil, onNotificacoes;
  const GavetaSate({
    super.key,
    required this.treinador,
    required this.nome,
    required this.email,
    required this.onPerfil,
    required this.onNotificacoes,
  });

  @override
  Widget build(BuildContext context) {
    final c = context.sc;

    Widget item(IconData i, String t, VoidCallback f, {Color? cor, String? sub}) => ListTile(
          contentPadding: const EdgeInsets.symmetric(horizontal: 22, vertical: 0),
          dense: true,
          leading: Icon(i, size: 22, color: cor ?? c.texto2),
          title: Text(t,
              style: TextStyle(
                  fontSize: 14.5, fontWeight: FontWeight.w600, color: cor ?? c.texto)),
          subtitle: sub == null
              ? null
              : Text(sub, style: TextStyle(fontSize: 11.5, color: c.texto2)),
          onTap: () {
            Navigator.of(context).pop();
            f();
          },
        );

    Widget titulo(String t) => Padding(
          padding: const EdgeInsets.fromLTRB(22, 18, 22, 4),
          child: Text(t,
              style: TextStyle(
                  fontSize: 12, fontWeight: FontWeight.w700, color: c.texto2)),
        );

    final s = SateStore.i;
    return Drawer(
      backgroundColor: c.fundo,
      surfaceTintColor: Colors.transparent,
      width: 310,
      child: Column(children: [
        InkWell(
          onTap: () {
            Navigator.of(context).pop();
            onPerfil();
          },
          child: Container(
            width: double.infinity,
            padding: EdgeInsets.fromLTRB(
                22, MediaQuery.paddingOf(context).top + 22, 22, 22),
            decoration: BoxDecoration(
              color: c.heroSolido,
            ),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              AvatarIni(nome.isEmpty ? (treinador ? 'Treinador' : 'Atleta') : nome,
                  tamanho: 58),
              const SizedBox(height: 12),
              Text(nome.isEmpty ? (treinador ? 'Treinador' : 'Atleta') : nome,
                  style: const TextStyle(
                      fontSize: 18, fontWeight: FontWeight.w700, color: Colors.white)),
              const SizedBox(height: 2),
              Text(email.isEmpty ? (treinador ? 'Treinador' : 'Atleta') : email,
                  style: const TextStyle(fontSize: 12.5, color: Colors.white70)),
            ]),
          ),
        ),
        Expanded(
          child: ListView(padding: EdgeInsets.zero, children: [
            titulo('Minha conta'),
            item(Icons.person_outline_rounded, 'Meu perfil', onPerfil),
            item(Icons.notifications_none_rounded, 'Notificações', onNotificacoes),
            if (treinador)
              item(Icons.folder_copy_outlined, 'Documentação',
                  () => abrir(context, const DocumentosPage())),
            if (treinador && s.excedeuLimite)
              item(Icons.workspace_premium_outlined, 'Planos',
                  () => abrir(context, const PlanosSatePage()),
                  cor: c.rosa, sub: 'Limite de atletas excedido'),
            if (!treinador)
              item(Icons.qr_code_2_rounded, 'QR Code',
                  () => abrirLegado(context, const AtletaQrCodePage()),
                  sub: 'Vínculo com o treinador'),
            titulo('Configurações'),
            item(Icons.accessibility_new_rounded, 'Acessibilidade',
                () => abrir(context, const AcessibilidadePage())),
            item(Icons.palette_outlined, 'Tema', () => abrir(context, const TemaPage()),
                sub: 'Claro ou escuro'),
            item(Icons.help_outline_rounded, 'Ajuda',
                () => abrir(context, AjudaPage(treinador: treinador))),
            item(Icons.quiz_outlined, 'Perguntas frequentes',
                () => abrir(context, FaqPage(treinador: treinador))),
            item(Icons.info_outline_rounded, 'Sobre o aplicativo',
                () => abrir(context, SobrePage(treinador: treinador)),
                sub: 'Versão $versaoApp (build $buildApp)'),
          ]),
        ),
        Divider(height: 1, color: c.linha),
        SafeArea(
          top: false,
          child: item(Icons.logout_rounded, 'Sair da conta', () => sairDaConta(context),
              cor: c.vermelho),
        ),
      ]),
    );
  }
}

/// Mantém o estado de cada aba (rolagem, filtros) enquanto o usuário desliza entre elas.
class _PaginaMantida extends StatefulWidget {
  final Widget child;
  const _PaginaMantida({required this.child});

  @override
  State<_PaginaMantida> createState() => _PaginaMantidaState();
}

class _PaginaMantidaState extends State<_PaginaMantida>
    with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return widget.child;
  }
}
