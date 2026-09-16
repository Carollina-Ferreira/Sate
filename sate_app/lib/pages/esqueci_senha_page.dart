import 'package:flutter/material.dart';
import 'link_enviado_page.dart';

class EsqueciSenhaPage extends StatefulWidget {
  const EsqueciSenhaPage({super.key});

  @override
  State<EsqueciSenhaPage> createState() => _EsqueciSenhaPageState();
}

class _EsqueciSenhaPageState extends State<EsqueciSenhaPage> {
  final emailController = TextEditingController();

  static const verde = Color(0xFF00845F);
  static const rosa = Color(0xFFE98BA8);
  static const azul = Color(0xFF001E98);

  @override
  void dispose() {
    emailController.dispose();
    super.dispose();
  }

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
              painter: BackgroundPainter(
                verde: verde,
                rosa: rosa,
                azul: azul,
              ),
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
                  constraints: const BoxConstraints(
                    maxWidth: 430,
                  ),
                  child: _card(),
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

  Widget _card() {
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
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ================================================================
          // LOGO
          // ================================================================

          Center(
            child: Image.asset(
              'images/logoVerde_img.png',
              width: 125,
              fit: BoxFit.contain,
            ),
          ),

          const SizedBox(height: 28),

          // ================================================================
          // TÍTULO
          // ================================================================

          const Text(
            'Esqueceu sua senha?',
            style: TextStyle(
              fontSize: 29,
              fontWeight: FontWeight.w700,
              color: Color(0xFF161616),
            ),
          ),

          const SizedBox(height: 10),

          Text(
            'Não se preocupe! Digite seu email abaixo '
            'e enviaremos um link para você redefinir sua senha.',
            style: TextStyle(
              fontSize: 14,
              height: 1.5,
              color: Colors.grey.shade600,
            ),
          ),

          const SizedBox(height: 28),

          // ================================================================
          // EMAIL
          // ================================================================

          const Text(
            'Email',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: Color(0xFF242424),
            ),
          ),

          const SizedBox(height: 8),

          TextField(
            controller: emailController,
            keyboardType: TextInputType.emailAddress,
            textInputAction: TextInputAction.done,
            onSubmitted: (_) => _enviarLink(),
            decoration: InputDecoration(
              hintText: 'Digite seu email',
              hintStyle: TextStyle(
                color: Colors.grey.shade400,
                fontSize: 13,
              ),
              prefixIcon: Icon(
                Icons.email_outlined,
                size: 19,
                color: Colors.grey.shade500,
              ),
              filled: true,
              fillColor: Colors.white,
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 15,
                vertical: 15,
              ),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(
                  color: Colors.grey.shade300,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(
                  color: Colors.grey.shade300,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(
                  color: verde,
                  width: 1.5,
                ),
              ),
            ),
          ),

          const SizedBox(height: 22),

          // ================================================================
          // BOTÃO ENVIAR LINK
          // ================================================================

          SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton(
              onPressed: _enviarLink,
              style: ElevatedButton.styleFrom(
                backgroundColor: verde,
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text(
                'Enviar link',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),

          const SizedBox(height: 24),

          // ================================================================
          // VOLTAR PARA LOGIN
          // ================================================================

          Center(
            child: _HoverLink(
              verde: verde,
              normalText: 'Lembrou da senha? ',
              linkText: 'Voltar para o login',
              onTap: () {
                Navigator.pop(context);
              },
            ),
          ),
        ],
      ),
    );
  }

  // ========================================================================
  // ENVIAR LINK
  // ========================================================================

  void _enviarLink() {
    final email = emailController.text.trim();

    // ------------------------------------------------------------
    // Campo vazio
    // ------------------------------------------------------------

    if (email.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Digite seu email.',
          ),
        ),
      );

      return;
    }

    // ------------------------------------------------------------
    // Email inválido
    // ------------------------------------------------------------

    if (!email.contains('@') || !email.contains('.')) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Digite um email válido.',
          ),
        ),
      );

      return;
    }

    // ------------------------------------------------------------
    // Vai para tela de confirmação
    // ------------------------------------------------------------

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => LinkEnviadoPage(
          email: email,
        ),
      ),
    );
  }
}

// ============================================================================
// LINK COM HOVER
// ============================================================================

class _HoverLink extends StatefulWidget {
  final Color verde;
  final String normalText;
  final String linkText;
  final VoidCallback onTap;

  const _HoverLink({
    required this.verde,
    required this.normalText,
    required this.linkText,
    required this.onTap,
  });

  @override
  State<_HoverLink> createState() => _HoverLinkState();
}

class _HoverLinkState extends State<_HoverLink> {
  bool hover = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,

      onEnter: (_) {
        setState(() {
          hover = true;
        });
      },

      onExit: (_) {
        setState(() {
          hover = false;
        });
      },

      child: GestureDetector(
        onTap: widget.onTap,
        child: RichText(
          text: TextSpan(
            style: TextStyle(
              color: Colors.grey.shade600,
              fontSize: 13,
            ),
            children: [
              TextSpan(
                text: widget.normalText,
              ),
              TextSpan(
                text: widget.linkText,
                style: TextStyle(
                  color: hover
                      ? const Color(0xFF006B4D)
                      : widget.verde,
                  fontWeight: FontWeight.w700,
                  decoration: hover
                      ? TextDecoration.underline
                      : TextDecoration.none,
                ),
              ),
            ],
          ),
        ),
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

    final pinkPaint = Paint()
      ..color = rosa.withValues(alpha: 0.13);

    canvas.drawCircle(
      Offset(size.width - 30, -20),
      150,
      pinkPaint,
    );

    // ================================================================
    // BLOB AZUL
    // ================================================================

    final bluePaint = Paint()
      ..color = azul.withValues(alpha: 0.06);

    canvas.drawCircle(
      Offset(size.width - 90, 150),
      80,
      bluePaint,
    );

    // ================================================================
    // BLOB VERDE
    // ================================================================

    final greenPaint = Paint()
      ..color = verde.withValues(alpha: 0.08);

    canvas.drawCircle(
      Offset(-30, size.height - 50),
      150,
      greenPaint,
    );

    // ================================================================
    // GRID DE PONTOS
    // ================================================================

    final dotPaint = Paint()
      ..color = azul.withValues(alpha: 0.13);

    const spacing = 13.0;

    for (
      double x = size.width - 140;
      x < size.width - 30;
      x += spacing
    ) {
      for (
        double y = 45;
        y < 135;
        y += spacing
      ) {
        canvas.drawCircle(
          Offset(x, y),
          1.6,
          dotPaint,
        );
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

    path.moveTo(
      points[0].dx,
      points[0].dy,
    );

    for (int i = 1; i < points.length; i++) {
      path.lineTo(
        points[i].dx,
        points[i].dy,
      );
    }

    canvas.drawPath(
      path,
      linePaint,
    );

    // ================================================================
    // PONTOS DO GRÁFICO
    // ================================================================

    for (int i = 0; i < points.length; i += 2) {
      final paint = Paint()
        ..color = i % 4 == 0
            ? rosa
            : verde;

      canvas.drawCircle(
        points[i],
        4,
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(
    CustomPainter oldDelegate,
  ) {
    return false;
  }
}