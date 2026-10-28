import 'package:flutter/material.dart';

import './treinador_vinculo_page.dart';
import '../../theme/sate_theme.dart';

class TreinadorEquipesPage extends StatefulWidget {
  final String nomeUsuario;
  final String emailUsuario;

  const TreinadorEquipesPage({
    super.key,
    required this.nomeUsuario,
    required this.emailUsuario,
  });

  @override
  State<TreinadorEquipesPage> createState() =>
      _TreinadorEquipesPageState();
}

class _TreinadorEquipesPageState
    extends State<TreinadorEquipesPage> {
  static const Color verde = Color(0xFF003D31);
  static const Color rosa = Color(0xFFEF476F);
  static const Color azul = Color(0xFF55CA9B);

  final List<Map<String, String>> equipes = [
    {
      'nome': 'Falcões FC',
      'modalidade': 'Futebol',
      'atletas': '18 atletas',
      'codigo': 'TRN-4829',
    },
    {
      'nome': 'Águias Vôlei',
      'modalidade': 'Vôlei',
      'atletas': '12 atletas',
      'codigo': 'TRN-7351',
    },
  ];

  void selecionarEquipe(Map<String, String> equipe) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => TreinadorVinculoPage(
          nomeUsuario: widget.nomeUsuario,
          emailUsuario: widget.emailUsuario,
          nomeEquipe: equipe['nome'] ?? '',
          modalidade: equipe['modalidade'] ?? '',
          atletas: equipe['atletas'] ?? '',
          codigoEquipe: equipe['codigo'] ?? '',
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF5EE),
      body: Stack(
        children: [
          Positioned.fill(
            child: CustomPaint(
              painter: _FundoPainter(
                rosa: rosa,
                azul: azul,
                verde: verde,
              ),
            ),
          ),
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(
                24,
                24,
                24,
                30,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 68,
                      height: 68,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(22),
                        boxShadow: [
                          BoxShadow(
                            color: Color(0xFF10251F).withOpacity(0.06),
                            blurRadius: 15,
                            offset: const Offset(0, 6),
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.sports_rounded,
                        color: verde,
                        size: 36,
                      ),
                    ),
                  ),

                  const SizedBox(height: 22),

                  Center(
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 7,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(30),
                      ),
                      child: const Text(
                        'ÁREA DO TREINADOR',
                        style: TextStyle(
                          color: verde,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 26),

                  const Text.rich(
                    TextSpan(children: [TextSpan(text: 'Escolha sua '), TextSpan(text: 'equipe.', style: SateEstilo.destaque)]),
                    style: TextStyle(
                      color: Color(0xFF10251F),
                      fontSize: 29,
                      fontWeight: FontWeight.bold,
                      height: 1.15,
                    ),
                  ),

                  const SizedBox(height: 10),

                  const Text(
                    'Selecione a equipe que você deseja acessar para continuar.',
                    style: TextStyle(
                      color: Color(0xFF68736F),
                      fontSize: 15,
                      height: 1.5,
                    ),
                  ),

                  const SizedBox(height: 24),

                  ...equipes.map(
                    (equipe) {
                      return Padding(
                        padding: const EdgeInsets.only(
                          bottom: 16,
                        ),
                        child: _cardEquipe(equipe),
                      );
                    },
                  ),

                  const SizedBox(height: 8),

                  const Center(
                    child: Text(
                      'Você poderá acessar outra equipe posteriormente.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Color(0xFF68736F),
                        fontSize: 13,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _cardEquipe(Map<String, String> equipe) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Color(0xFF10251F).withOpacity(0.06),
            blurRadius: 18,
            offset: const Offset(0, 7),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: const Color(0xFFDFF7EE),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Icon(
                  Icons.groups_rounded,
                  color: verde,
                  size: 28,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment:
                      CrossAxisAlignment.start,
                  children: [
                    Text(
                      equipe['nome'] ?? '',
                      style: const TextStyle(
                        color: Color(0xFF10251F),
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      equipe['modalidade'] ?? '',
                      style: const TextStyle(
                        color: Color(0xFF68736F),
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 18),

          Container(
            height: 1,
            color: const Color(0xFFE8DFD3),
          ),

          const SizedBox(height: 16),

          Row(
            children: [
              Expanded(
                child: _informacaoEquipe(
                  Icons.people_alt_rounded,
                  equipe['atletas'] ?? '',
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _informacaoEquipe(
                  Icons.sports_rounded,
                  equipe['modalidade'] ?? '',
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              onPressed: () {
                selecionarEquipe(equipe);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: verde,
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
              child: const Text(
                'Entrar nesta equipe',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _informacaoEquipe(
    IconData icone,
    String texto,
  ) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 12,
        vertical: 10,
      ),
      decoration: BoxDecoration(
        color: const Color(0xFFFAF5EE),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Icon(
            icone,
            color: verde,
            size: 18,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              texto,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                color: Color(0xFF68736F),
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _FundoPainter extends CustomPainter {
  final Color rosa;
  final Color azul;
  final Color verde;

  _FundoPainter({
    required this.rosa,
    required this.azul,
    required this.verde,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..style = PaintingStyle.fill;

    paint.color = rosa.withOpacity(0.12);

    canvas.drawCircle(
      Offset(
        size.width * 0.10,
        size.height * 0.12,
      ),
      85,
      paint,
    );

    paint.color = azul.withOpacity(0.13);

    canvas.drawCircle(
      Offset(
        size.width * 0.92,
        size.height * 0.22,
      ),
      100,
      paint,
    );

    paint.color = verde.withOpacity(0.08);

    canvas.drawCircle(
      Offset(
        size.width * 0.88,
        size.height * 0.84,
      ),
      130,
      paint,
    );

    final pontos = Paint()
      ..color = verde.withOpacity(0.10)
      ..style = PaintingStyle.fill;

    for (int i = 0; i < 18; i++) {
      final x = (i * 53.0) % size.width;
      final y = 80 + ((i * 91.0) % size.height);

      canvas.drawCircle(
        Offset(x, y),
        2.5,
        pontos,
      );
    }

    final linha = Paint()
      ..color = rosa.withOpacity(0.16)
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    final path = Path();

    path.moveTo(
      0,
      size.height * 0.72,
    );

    path.quadraticBezierTo(
      size.width * 0.30,
      size.height * 0.62,
      size.width * 0.52,
      size.height * 0.73,
    );

    path.quadraticBezierTo(
      size.width * 0.74,
      size.height * 0.84,
      size.width,
      size.height * 0.70,
    );

    canvas.drawPath(
      path,
      linha,
    );
  }

  @override
  bool shouldRepaint(
    covariant _FundoPainter oldDelegate,
  ) {
    return false;
  }
}