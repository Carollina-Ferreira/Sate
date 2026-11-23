import 'package:flutter/material.dart';

/// Evita toques repetidos: depois de um TOQUE (não de uma rolagem), a tela ignora
/// novos toques por um instante. Assim, clicar várias vezes seguidas num botão
/// não abre a mesma tela duas vezes, não envia o formulário em duplicidade e não trava.
///
/// Fica no topo do app (MaterialApp.builder): vale para todos os botões, sem alterar nenhuma tela.
class ToqueSeguro extends StatefulWidget {
  final Widget child;

  /// Por quanto tempo novos toques são ignorados depois de um toque.
  final Duration pausa;
  const ToqueSeguro({
    super.key,
    required this.child,
    this.pausa = const Duration(milliseconds: 500),
  });

  @override
  State<ToqueSeguro> createState() => _ToqueSeguroState();
}

class _ToqueSeguroState extends State<ToqueSeguro> {
  bool _bloqueado = false;
  Offset? _inicio;
  DateTime? _quando;
  int _id = 0;

  void _desce(PointerDownEvent e) {
    _inicio = e.position;
    _quando = DateTime.now();
  }

  void _sobe(PointerUpEvent e) {
    final ini = _inicio, t0 = _quando;
    if (ini == null || t0 == null) return;
    final curto = DateTime.now().difference(t0) < const Duration(milliseconds: 350);
    final parado = (e.position - ini).distance < 16;
    // Rolagens e arrastes não contam: só toques rápidos e parados.
    if (!(curto && parado) || _bloqueado) return;
    final meuId = ++_id;
    // Espera a ação do toque acontecer e só então começa a ignorar os próximos.
    Future<void>.delayed(const Duration(milliseconds: 30), () {
      if (!mounted) return;
      setState(() => _bloqueado = true);
      Future<void>.delayed(widget.pausa, () {
        if (mounted && meuId == _id) setState(() => _bloqueado = false);
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Listener(
      behavior: HitTestBehavior.translucent,
      onPointerDown: _desce,
      onPointerUp: _sobe,
      child: AbsorbPointer(absorbing: _bloqueado, child: widget.child),
    );
  }
}
