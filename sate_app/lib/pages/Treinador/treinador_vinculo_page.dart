import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:qr_flutter/qr_flutter.dart';

import './treinador_navigation.dart';

class TreinadorVinculoPage extends StatefulWidget {
  final String nomeEquipe;
  final String modalidade;
  final String atletas;
  final String codigoEquipe;

  const TreinadorVinculoPage({
    super.key,
    required this.nomeEquipe,
    required this.modalidade,
    required this.atletas,
    required this.codigoEquipe,
  });

  @override
  State<TreinadorVinculoPage> createState() => _TreinadorVinculoPageState();
}

class _TreinadorVinculoPageState extends State<TreinadorVinculoPage> {
  static const Color verde = Color(0xFF006B4F);
  static const Color rosa = Color(0xFFE98BA8);
  static const Color azul = Color(0xFF8FB9E8);

  String get codigo => widget.codigoEquipe;

  void copiarCodigo() {
    Clipboard.setData(ClipboardData(text: codigo));

    ScaffoldMessenger.of(context)
        .showSnackBar(const SnackBar(content: Text('Código copiado!')));
  }

  void gerarNovoCodigo() {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('O código foi atualizado.')));
  }

  void entrar() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => const TreinadorNavigation()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F9F8),
      body: Stack(
        children: [
          Positioned.fill(
            child: CustomPaint(
              painter: _FundoPainter(rosa: rosa, azul: azul, verde: verde),
            ),
          ),
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(24, 24, 24, 30),
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
                            color: Colors.black.withOpacity(0.06),
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

                  const Text(
                    'Sua equipe está pronta.',
                    style: TextStyle(
                      color: Color(0xFF12261F),
                      fontSize: 29,
                      fontWeight: FontWeight.bold,
                      height: 1.15,
                    ),
                  ),

                  const SizedBox(height: 10),

                  Text(
                    'Você está acessando a equipe ${widget.nomeEquipe}. '
                    'Use o código abaixo para vincular atletas à equipe.',
                    style: const TextStyle(
                      color: Color(0xFF68736F),
                      fontSize: 15,
                      height: 1.5,
                    ),
                  ),

                  const SizedBox(height: 24),

                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(22),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.06),
                          blurRadius: 18,
                          offset: const Offset(0, 7),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        const Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            'Código da equipe',
                            style: TextStyle(
                              color: Color(0xFF68736F),
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),

                        const SizedBox(height: 10),

                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 18,
                            vertical: 17,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFFE8F5F0),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Center(
                            child: Text(
                              codigo,
                              style: const TextStyle(
                                color: verde,
                                fontSize: 27,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 2,
                              ),
                            ),
                          ),
                        ),

                        const SizedBox(height: 14),

                        SizedBox(
                          width: double.infinity,
                          height: 48,
                          child: OutlinedButton.icon(
                            onPressed: copiarCodigo,
                            icon: const Icon(Icons.copy_rounded, size: 18),
                            label: const Text('Copiar código'),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: verde,
                              side: const BorderSide(color: verde),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(14),
                              ),
                            ),
                          ),
                        ),

                        const SizedBox(height: 22),

                        const Text(
                          'Ou escaneie o QR Code',
                          style: TextStyle(
                            color: Color(0xFF68736F),
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                        ),

                        const SizedBox(height: 14),

                        Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(color: const Color(0xFFDCE7E2)),
                          ),
                          child: QrImageView(
                            data: codigo,
                            version: QrVersions.auto,
                            size: 180,
                            backgroundColor: Colors.white,
                          ),
                        ),

                        const SizedBox(height: 18),

                        SizedBox(
                          width: double.infinity,
                          height: 50,
                          child: ElevatedButton(
                            onPressed: entrar,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: verde,
                              foregroundColor: Colors.white,
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(14),
                              ),
                            ),
                            child: const Text(
                              'Entrar na equipe',
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 18),

                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(22),
                      border: Border.all(color: const Color(0xFFDCE7E2)),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            color: const Color(0xFFE8F5F0),
                            borderRadius: BorderRadius.circular(15),
                          ),
                          child: const Icon(Icons.groups_rounded, color: verde),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Equipe',
                                style: TextStyle(
                                  color: Color(0xFF68736F),
                                  fontSize: 12,
                                ),
                              ),
                              const SizedBox(height: 3),
                              Text(
                                widget.nomeEquipe,
                                style: const TextStyle(
                                  color: Color(0xFF12261F),
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 3),
                              Text(
                                '${widget.modalidade} • ${widget.atletas}',
                                style: const TextStyle(
                                  color: Color(0xFF68736F),
                                  fontSize: 13,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  const Center(
                    child: Text(
                      'Compartilhe o código com seus atletas.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Color(0xFF68736F), fontSize: 13),
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
}

class _FundoPainter extends CustomPainter {
  final Color rosa;
  final Color azul;
  final Color verde;

  _FundoPainter({required this.rosa, required this.azul, required this.verde});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..style = PaintingStyle.fill;

    paint.color = rosa.withOpacity(0.12);

    canvas.drawCircle(Offset(size.width * 0.10, size.height * 0.12), 85, paint);

    paint.color = azul.withOpacity(0.13);

    canvas.drawCircle(
      Offset(size.width * 0.92, size.height * 0.22),
      100,
      paint,
    );

    paint.color = verde.withOpacity(0.08);

    canvas.drawCircle(
      Offset(size.width * 0.88, size.height * 0.84),
      130,
      paint,
    );

    final pontos = Paint()
      ..color = verde.withOpacity(0.10)
      ..style = PaintingStyle.fill;

    for (int i = 0; i < 18; i++) {
      final x = (i * 53.0) % size.width;
      final y = 80 + ((i * 91.0) % size.height);

      canvas.drawCircle(Offset(x, y), 2.5, pontos);
    }

    final linha = Paint()
      ..color = rosa.withOpacity(0.16)
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    final path = Path();

    path.moveTo(0, size.height * 0.72);

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

    canvas.drawPath(path, linha);
  }

  @override
  bool shouldRepaint(covariant _FundoPainter oldDelegate) {
    return false;
  }
}
