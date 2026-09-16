import 'package:flutter/material.dart';

class LinkEnviadoPage extends StatelessWidget {
  final String email;

  const LinkEnviadoPage({super.key, required this.email});

  static const verde = Color(0xFF00845F);
  static const rosa = Color(0xFFE98BA8);
  static const azul = Color(0xFF001E98);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFCFCFC),
      body: Stack(
        children: [
          // ================================================================
          // FUNDO DECORATIVO
          // ================================================================

          Positioned.fill(
            child: CustomPaint(
              painter: BackgroundPainter(verde: verde, rosa: rosa, azul: azul),
            ),
          ),

          // ================================================================
          // CONTEÚDO
          // ================================================================
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 40,
                ),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 430),
                  child: _card(context),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ========================================================================
  // CARD
  // ========================================================================

  Widget _card(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(42),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.07),
            blurRadius: 40,
            offset: const Offset(0, 18),
          ),
        ],
      ),
      child: Column(
        children: [
          // ================================================================
          // ÍCONE DE SUCESSO
          // ================================================================
          Container(
            width: 78,
            height: 78,
            decoration: BoxDecoration(
              color: verde.withValues(alpha: 0.10),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.mark_email_read_outlined,
              color: verde,
              size: 40,
            ),
          ),

          const SizedBox(height: 25),

          // ================================================================
          // TÍTULO
          // ================================================================
          const Text(
            'Link enviado!',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w700,
              color: Color(0xFF161616),
            ),
          ),

          const SizedBox(height: 12),

          // ================================================================
          // DESCRIÇÃO
          // ================================================================
          Text(
            'Enviamos um link para redefinir sua senha '
            'para o email:',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 14,
              height: 1.5,
              color: Colors.grey.shade600,
            ),
          ),

          const SizedBox(height: 10),

          // ================================================================
          // EMAIL
          // ================================================================
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            decoration: BoxDecoration(
              color: verde.withValues(alpha: 0.06),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              email,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: verde,
                fontSize: 14,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),

          const SizedBox(height: 18),

          // ================================================================
          // INSTRUÇÃO
          // ================================================================
          Text(
            'Verifique sua caixa de entrada e também a pasta '
            'de spam. O link ficará disponível por tempo limitado.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 12,
              height: 1.5,
              color: Colors.grey.shade500,
            ),
          ),

          const SizedBox(height: 28),

          // ================================================================
          // VOLTAR PARA LOGIN
          // ================================================================
          SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton(
              onPressed: () {
                Navigator.popUntil(context, (route) => route.isFirst);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: verde,
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text(
                'Voltar para o login',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
              ),
            ),
          ),

          const SizedBox(height: 15),

          // ================================================================
          // TENTAR OUTRO EMAIL
          // ================================================================
          MouseRegion(
            cursor: SystemMouseCursors.click,
            child: GestureDetector(
              onTap: () {
                Navigator.pop(context);
              },
              child: const Text(
                'Usar outro email',
                style: TextStyle(
                  color: verde,
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ============================================================================
// BACKGROUND
// ============================================================================

class BackgroundPainter extends CustomPainter {
  final Color verde;
  final Color rosa;
  final Color azul;

  BackgroundPainter({
    required this.verde,
    required this.rosa,
    required this.azul,
  });

  @override
  void paint(Canvas canvas, Size size) {
    // ================================================================
    // BLOB ROSA
    // ================================================================

    final pinkPaint = Paint()..color = rosa.withValues(alpha: 0.13);

    canvas.drawCircle(Offset(size.width - 30, -20), 150, pinkPaint);

    // ================================================================
    // BLOB AZUL
    // ================================================================

    final bluePaint = Paint()..color = azul.withValues(alpha: 0.06);

    canvas.drawCircle(Offset(size.width - 90, 150), 80, bluePaint);

    // ================================================================
    // BLOB VERDE
    // ================================================================

    final greenPaint = Paint()..color = verde.withValues(alpha: 0.08);

    canvas.drawCircle(Offset(-30, size.height - 50), 150, greenPaint);

    // ================================================================
    // GRID DE PONTOS
    // ================================================================

    final dotPaint = Paint()..color = azul.withValues(alpha: 0.13);

    const spacing = 13.0;

    for (double x = size.width - 140; x < size.width - 30; x += spacing) {
      for (double y = 45; y < 135; y += spacing) {
        canvas.drawCircle(Offset(x, y), 1.6, dotPaint);
      }
    }

    // ================================================================
    // GRÁFICO
    // ================================================================

    final points = [
      Offset(size.width - 280, 210),
      Offset(size.width - 240, 190),
      Offset(size.width - 200, 200),
      Offset(size.width - 160, 165),
      Offset(size.width - 120, 178),
      Offset(size.width - 80, 140),
      Offset(size.width - 40, 155),
    ];

    final linePaint = Paint()
      ..color = azul.withValues(alpha: 0.7)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final path = Path();

    path.moveTo(points[0].dx, points[0].dy);

    for (int i = 1; i < points.length; i++) {
      path.lineTo(points[i].dx, points[i].dy);
    }

    canvas.drawPath(path, linePaint);

    for (int i = 0; i < points.length; i += 2) {
      final paint = Paint()..color = i % 4 == 0 ? rosa : verde;

      canvas.drawCircle(points[i], 4, paint);
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) {
    return false;
  }
}
