import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import './treinador_home_page.dart';

class TreinadorVinculoPage extends StatefulWidget {
  const TreinadorVinculoPage({super.key});

  @override
  State<TreinadorVinculoPage> createState() => _TreinadorVinculoPageState();
}

class _TreinadorVinculoPageState extends State<TreinadorVinculoPage> {
  final String codigo = 'TRN-4829';

  static const verde = Color(0xFF00845F);
  static const rosa = Color(0xFFE98BA8);
  static const azul = Color(0xFF001E98);

  // ================================================================
  // COPIAR CÓDIGO
  // ================================================================

  void copiarCodigo() {
    Clipboard.setData(
      ClipboardData(text: codigo),
    );

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text(
          'Código copiado!',
          style: TextStyle(
            fontWeight: FontWeight.w600,
          ),
        ),
        behavior: SnackBarBehavior.floating,
        backgroundColor: verde,
        margin: const EdgeInsets.all(20),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }

  // ================================================================
  // GERAR NOVO CÓDIGO
  // ================================================================

  void gerarNovoCodigo() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text(
          'Novo código gerado!',
          style: TextStyle(
            fontWeight: FontWeight.w600,
          ),
        ),
        behavior: SnackBarBehavior.floating,
        backgroundColor: verde,
        margin: const EdgeInsets.all(20),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }

  // ================================================================
  // ENTRAR NA PLATAFORMA
  // ================================================================

  void entrar() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => const TreinadorHomePage(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFCFCFC),

      body: Stack(
        children: [
          // ============================================================
          // FUNDO
          // ============================================================

          Positioned.fill(
            child: CustomPaint(
              painter: TreinadorBackgroundPainter(
                verde: verde,
                rosa: rosa,
                azul: azul,
              ),
            ),
          ),

          // ============================================================
          // CONTEÚDO
          // ============================================================

          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 35,
                ),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(
                    maxWidth: 620,
                  ),
                  child: Column(
                    children: [
                      // ==================================================
                      // LOGO
                      // ==================================================

                      Image.asset(
                        'assets/images/logoVerde_img.png',
                        width: 125,
                        fit: BoxFit.contain,
                      ),

                      const SizedBox(height: 38),

                      // ==================================================
                      // IDENTIFICAÇÃO
                      // ==================================================

                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 13,
                          vertical: 7,
                        ),
                        decoration: BoxDecoration(
                          color: verde.withValues(alpha: 0.08),
                          borderRadius: BorderRadius.circular(30),
                          border: Border.all(
                            color: verde.withValues(alpha: 0.15),
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 7,
                              height: 7,
                              decoration: const BoxDecoration(
                                color: verde,
                                shape: BoxShape.circle,
                              ),
                            ),

                            const SizedBox(width: 8),

                            const Text(
                              'ÁREA DO TREINADOR',
                              style: TextStyle(
                                color: verde,
                                fontSize: 10,
                                fontWeight: FontWeight.w700,
                                letterSpacing: 1.2,
                              ),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 20),

                      // ==================================================
                      // TÍTULO
                      // ==================================================

                      const Text(
                        'Sua equipe está pronta.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 31,
                          height: 1.15,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF161616),
                        ),
                      ),

                      const SizedBox(height: 12),

                      Text(
                        'Compartilhe o código da equipe com seus atletas '
                        'para que eles possam se conectar à sua equipe.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 14,
                          height: 1.55,
                          color: Colors.grey.shade600,
                        ),
                      ),

                      const SizedBox(height: 32),

                      // ==================================================
                      // CARD DO CÓDIGO
                      // ==================================================

                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(28),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(
                            color: Colors.grey.shade200,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(
                                alpha: 0.055,
                              ),
                              blurRadius: 35,
                              offset: const Offset(0, 16),
                            ),
                          ],
                        ),
                        child: Column(
                          children: [
                            // ÍCONE

                            Container(
                              width: 54,
                              height: 54,
                              decoration: BoxDecoration(
                                color: azul.withValues(alpha: 0.07),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: const Icon(
                                Icons.groups_rounded,
                                color: azul,
                                size: 27,
                              ),
                            ),

                            const SizedBox(height: 18),

                            const Text(
                              'CÓDIGO DA SUA EQUIPE',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w700,
                                letterSpacing: 1.4,
                                color: Color(0xFF888888),
                              ),
                            ),

                            const SizedBox(height: 12),

                            // CÓDIGO

                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.symmetric(
                                vertical: 20,
                              ),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF8F9FC),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: const Color(0xFFE8EAF0),
                                ),
                              ),
                              child: Text(
                                codigo,
                                textAlign: TextAlign.center,
                                style: const TextStyle(
                                  fontSize: 30,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 4,
                                  color: azul,
                                ),
                              ),
                            ),

                            const SizedBox(height: 16),

                            // =================================================
                            // COPIAR
                            // =================================================

                            SizedBox(
                              width: double.infinity,
                              height: 50,
                              child: OutlinedButton.icon(
                                onPressed: copiarCodigo,
                                icon: const Icon(
                                  Icons.copy_rounded,
                                  size: 18,
                                ),
                                label: const Text(
                                  'Copiar código',
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                                style: OutlinedButton.styleFrom(
                                  foregroundColor: azul,
                                  backgroundColor: Colors.white,
                                  side: BorderSide(
                                    color: azul.withValues(alpha: 0.25),
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                              ),
                            ),

                            const SizedBox(height: 6),

                            // =================================================
                            // GERAR NOVO
                            // =================================================

                            TextButton(
                              onPressed: gerarNovoCodigo,
                              style: TextButton.styleFrom(
                                foregroundColor: azul,
                              ),
                              child: const Text(
                                'Gerar novo código',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),

                            const SizedBox(height: 8),

                            // =================================================
                            // ENTRAR
                            // =================================================

                            SizedBox(
                              width: double.infinity,
                              height: 52,
                              child: ElevatedButton(
                                onPressed: entrar,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: verde,
                                  foregroundColor: Colors.white,
                                  elevation: 0,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                                child: const Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      'Entrar',
                                      style: TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),

                                    SizedBox(width: 8),

                                    Icon(
                                      Icons.arrow_forward_rounded,
                                      size: 18,
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 28),

                      // ==================================================
                      // ATLETAS VINCULADOS
                      // ==================================================

                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(22),
                          border: Border.all(
                            color: Colors.grey.shade200,
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  width: 42,
                                  height: 42,
                                  decoration: BoxDecoration(
                                    color: rosa.withValues(alpha: 0.13),
                                    borderRadius: BorderRadius.circular(13),
                                  ),
                                  child: const Icon(
                                    Icons.people_alt_outlined,
                                    color: Color(0xFFD56F91),
                                    size: 21,
                                  ),
                                ),

                                const SizedBox(width: 12),

                                const Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Atletas vinculados',
                                        style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w700,
                                          color: Color(0xFF181818),
                                        ),
                                      ),

                                      SizedBox(height: 3),

                                      Text(
                                        'Atletas que fazem parte da sua equipe',
                                        style: TextStyle(
                                          fontSize: 11,
                                          color: Color(0xFF888888),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),

                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 10,
                                    vertical: 6,
                                  ),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFF4F5F7),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: const Text(
                                    '0 atletas',
                                    style: TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFF777777),
                                    ),
                                  ),
                                ),
                              ],
                            ),

                            const SizedBox(height: 20),

                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.symmetric(
                                vertical: 25,
                                horizontal: 20,
                              ),
                              decoration: BoxDecoration(
                                color: const Color(0xFFFAFAFA),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: const Color(0xFFEEEEEE),
                                ),
                              ),
                              child: Column(
                                children: [
                                  Icon(
                                    Icons.person_add_alt_1_rounded,
                                    size: 28,
                                    color: Colors.grey.shade400,
                                  ),

                                  const SizedBox(height: 10),

                                  const Text(
                                    'Nenhum atleta vinculado ainda',
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFF555555),
                                    ),
                                  ),

                                  const SizedBox(height: 5),

                                  Text(
                                    'Compartilhe o código acima para começar.',
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                      fontSize: 11,
                                      color: Colors.grey.shade500,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 28),

                      // ==================================================
                      // RODAPÉ
                      // ==================================================

                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.lock_outline_rounded,
                            size: 13,
                            color: Colors.grey.shade400,
                          ),

                          const SizedBox(width: 6),

                          Text(
                            'Código exclusivo da sua equipe',
                            style: TextStyle(
                              fontSize: 10,
                              color: Colors.grey.shade500,
                            ),
                          ),
                        ],
                      ),
                    ],
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

// ============================================================================
// BACKGROUND
// ============================================================================

class TreinadorBackgroundPainter extends CustomPainter {
  final Color verde;
  final Color rosa;
  final Color azul;

  TreinadorBackgroundPainter({
    required this.verde,
    required this.rosa,
    required this.azul,
  });

  @override
  void paint(Canvas canvas, Size size) {
    // ================================================================
    // BLOB ROSA
    // ================================================================

    final pinkPaint = Paint()
      ..color = rosa.withValues(alpha: 0.12);

    canvas.drawCircle(
      Offset(size.width - 20, -20),
      170,
      pinkPaint,
    );

    // ================================================================
    // BLOB AZUL
    // ================================================================

    final bluePaint = Paint()
      ..color = azul.withValues(alpha: 0.055);

    canvas.drawCircle(
      Offset(size.width - 80, 180),
      100,
      bluePaint,
    );

    // ================================================================
    // BLOB VERDE
    // ================================================================

    final greenPaint = Paint()
      ..color = verde.withValues(alpha: 0.07);

    canvas.drawCircle(
      Offset(-50, size.height - 70),
      170,
      greenPaint,
    );

    // ================================================================
    // PONTOS
    // ================================================================

    final dotPaint = Paint()
      ..color = azul.withValues(alpha: 0.12);

    const spacing = 14.0;

    for (
      double x = size.width - 150;
      x < size.width - 35;
      x += spacing
    ) {
      for (
        double y = 50;
        y < 150;
        y += spacing
      ) {
        canvas.drawCircle(
          Offset(x, y),
          1.5,
          dotPaint,
        );
      }
    }

    // ================================================================
    // LINHA DECORATIVA
    // ================================================================

    final linePaint = Paint()
      ..color = verde.withValues(alpha: 0.25)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2
      ..strokeCap = StrokeCap.round;

    final path = Path();

    path.moveTo(
      35,
      size.height - 160,
    );

    path.cubicTo(
      100,
      size.height - 200,
      130,
      size.height - 100,
      205,
      size.height - 140,
    );

    path.cubicTo(
      260,
      size.height - 170,
      300,
      size.height - 90,
      360,
      size.height - 125,
    );

    canvas.drawPath(
      path,
      linePaint,
    );
  }

  @override
  bool shouldRepaint(
    CustomPainter oldDelegate,
  ) {
    return false;
  }
}
