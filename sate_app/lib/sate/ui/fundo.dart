import 'package:flutter/material.dart';

import 'cores.dart';

/// Círculo decorativo com degradê radial suave (some nas bordas).
void orbeDegrade(Canvas canvas, Offset centro, double raio, Color cor, double alpha) {
  final area = Rect.fromCircle(center: centro, radius: raio);
  canvas.drawCircle(
    centro,
    raio,
    Paint()
      ..shader = RadialGradient(
        colors: [
          cor.withValues(alpha: alpha),
          cor.withValues(alpha: alpha * 0.45),
          cor.withValues(alpha: 0),
        ],
        stops: const [0, 0.55, 1],
      ).createShader(area),
  );
}

/// Fundo decorativo discreto das telas: degradê rosa no canto superior direito
/// e um toque de verde no canto inferior esquerdo.
class FundoSate extends StatelessWidget {
  final Widget child;
  const FundoSate({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return Stack(children: [
      Positioned.fill(
        child: IgnorePointer(
          child: CustomPaint(painter: _FundoPainter(c.rosa, c.primaria, c.escuro)),
        ),
      ),
      child,
    ]);
  }
}

class _FundoPainter extends CustomPainter {
  final Color rosa, verde;
  final bool escuro;
  _FundoPainter(this.rosa, this.verde, this.escuro);

  @override
  void paint(Canvas canvas, Size size) {
    if (escuro) {
      // Tons fechados: verde profundo em destaque e só um toque rosado.
      orbeDegrade(canvas, Offset(size.width - 24, 30), 190, const Color(0xFF1B6B52), 0.35);
      orbeDegrade(canvas, Offset(size.width * 0.05, size.height * 0.88), 170,
          const Color(0xFF145A45), 0.40);
      orbeDegrade(canvas, Offset(size.width * 0.9, size.height * 0.12), 90, rosa, 0.06);
      return;
    }
    orbeDegrade(canvas, Offset(size.width - 24, 30), 190, rosa, 0.26);
    orbeDegrade(canvas, Offset(size.width * 0.05, size.height * 0.88), 170, verde, 0.09);
    orbeDegrade(canvas, Offset(size.width * 0.12, size.height * 0.34), 70, rosa, 0.14);
  }

  @override
  bool shouldRepaint(covariant _FundoPainter o) =>
      o.rosa != rosa || o.verde != verde || o.escuro != escuro;
}
