import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../data/sate_store.dart';
import '../ui/cores.dart';

/// Player demonstrativo de interface (sem backend e sem pacote de vídeo).
/// Para os vídeos "demo:*" anima um boneco executando o movimento.
/// Para outro valor (nome de arquivo/link), mostra o vídeo como associado,
/// mas a reprodução real depende de integrar um player (ex.: video_player).
class VideoDemo extends StatefulWidget {
  final String video;
  final String titulo;
  const VideoDemo({super.key, required this.video, required this.titulo});

  @override
  State<VideoDemo> createState() => _VideoDemoState();
}

class _VideoDemoState extends State<VideoDemo>
    with SingleTickerProviderStateMixin {
  static const int _duracaoSeg = 12;
  late final AnimationController _ctl = AnimationController(
    vsync: this,
    duration: const Duration(seconds: _duracaoSeg),
  )..repeat();
  bool _tocando = true;

  @override
  void dispose() {
    _ctl.dispose();
    super.dispose();
  }

  void _alternar() {
    setState(() => _tocando = !_tocando);
    if (_tocando) {
      _ctl.repeat(min: 0, max: 1, period: const Duration(seconds: _duracaoSeg));
    } else {
      _ctl.stop();
    }
  }

  String _tempo(double v) {
    final s = (v * _duracaoSeg).floor();
    return '0:${s.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final ehDemo = videosDemo.containsKey(widget.video);

    return ClipRRect(
      borderRadius: BorderRadius.circular(22),
      child: Container(
        decoration: BoxDecoration(
          color: c.heroSolido,
        ),
        child: AspectRatio(
          aspectRatio: 16 / 10,
          child: Stack(
            children: [
              if (ehDemo)
                Positioned.fill(
                  child: AnimatedBuilder(
                    animation: _ctl,
                    builder: (_, __) => CustomPaint(
                      painter: _FiguraPainter(
                        widget.video,
                        (_ctl.value * 4) % 1,
                        Colors.white,
                        Colors.white.withValues(alpha: 0.45),
                      ),
                    ),
                  ),
                )
              else
                Center(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 28),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.smart_display_rounded,
                            size: 46, color: Colors.white),
                        const SizedBox(height: 10),
                        Text(
                          widget.video.isEmpty
                              ? 'Nenhum vídeo associado'
                              : 'Vídeo associado: ${widget.video}',
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w600,
                              fontSize: 14),
                        ),
                        if (widget.video.isNotEmpty)
                          const Padding(
                            padding: EdgeInsets.only(top: 6),
                            child: Text(
                              'Este vídeo estará disponível para reprodução em breve.',
                              textAlign: TextAlign.center,
                              style:
                                  TextStyle(color: Colors.white70, fontSize: 12),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              Positioned(
                left: 14,
                top: 12,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.25),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Text(
                    'Vídeo demonstrativo',
                    style: TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.w600),
                  ),
                ),
              ),
              if (ehDemo)
                Positioned(
                  left: 14,
                  right: 14,
                  bottom: 10,
                  child: Row(
                    children: [
                      GestureDetector(
                        onTap: _alternar,
                        child: Container(
                          width: 38,
                          height: 38,
                          decoration: const BoxDecoration(
                              color: Colors.white, shape: BoxShape.circle),
                          child: Icon(
                            _tocando
                                ? Icons.pause_rounded
                                : Icons.play_arrow_rounded,
                            color: const Color(0xFF005942),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: AnimatedBuilder(
                          animation: _ctl,
                          builder: (_, __) => ClipRRect(
                            borderRadius: BorderRadius.circular(4),
                            child: LinearProgressIndicator(
                              value: _ctl.value,
                              minHeight: 4,
                              backgroundColor:
                                  Colors.white.withValues(alpha: 0.3),
                              valueColor:
                                  const AlwaysStoppedAnimation(Colors.white),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      AnimatedBuilder(
                        animation: _ctl,
                        builder: (_, __) => Text(
                          '${_tempo(_ctl.value)} / 0:$_duracaoSeg',
                          style: const TextStyle(
                              color: Colors.white, fontSize: 11.5),
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

class _FiguraPainter extends CustomPainter {
  final String tipo;
  final double t; // 0..1 em loop
  final Color cor, cor2;
  _FiguraPainter(this.tipo, this.t, this.cor, this.cor2);

  Offset _v(double ang, double len) =>
      Offset(math.sin(ang) * len, math.cos(ang) * len);

  Offset _membro(Canvas canvas, Offset origem, double a1, double a2,
      double len, Paint p) {
    final meio = origem + _v(a1, len);
    final fim = meio + _v(a2, len);
    canvas.drawLine(origem, meio, p);
    canvas.drawLine(meio, fim, p);
    return fim;
  }

  @override
  void paint(Canvas canvas, Size size) {
    final base = size.height * 0.80;
    final cx = size.width / 2;
    final L = size.height * 0.20;
    final tr = size.height * 0.27;
    final bra = size.height * 0.15;
    final raioCabeca = size.height * 0.055;
    final esp = size.height * 0.035;

    final pFrente = Paint()
      ..color = cor
      ..strokeWidth = esp
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;
    final pTras = Paint()
      ..color = cor2
      ..strokeWidth = esp
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    canvas.drawLine(
      Offset(size.width * 0.15, base + 5),
      Offset(size.width * 0.85, base + 5),
      Paint()
        ..color = cor2
        ..strokeWidth = 3
        ..strokeCap = StrokeCap.round,
    );

    final s = (1 - math.cos(2 * math.pi * t)) / 2;

    if (tipo == 'demo:prancha') {
      final w = size.width * 0.26;
      final resp = math.sin(2 * math.pi * t) * 2.5;
      final cotovelo = Offset(cx - w, base);
      final ombro = Offset(cx - w + 6, base - L * 0.62 + resp);
      final quadril = Offset(cx, base - L * 0.78 + resp);
      final pes = Offset(cx + w, base);
      canvas.drawLine(cotovelo, ombro, pFrente);
      canvas.drawLine(ombro, quadril, pFrente);
      canvas.drawLine(quadril, pes, pFrente);
      final dir = (ombro - quadril);
      final u = dir / dir.distance;
      canvas.drawCircle(ombro + u * (raioCabeca * 1.9), raioCabeca,
          Paint()..color = cor);
      return;
    }

    late Offset quadril;
    late double incl;
    double aBraco = 0, aBraco2 = 0;
    var abertos = false;

    switch (tipo) {
      case 'demo:agachamento':
        final a = 1.15 * s;
        quadril = Offset(cx, base - L * (math.cos(a) + math.cos(a * 0.9)));
        incl = 0.55 * s;
        aBraco = 1.5 * s;
        aBraco2 = aBraco;
        _membro(canvas, quadril, a, -a * 0.9, L, pTras);
        _membro(canvas, quadril, a, -a * 0.9, L, pFrente);
        break;
      case 'demo:salto':
        final c = math.cos(2 * math.pi * t);
        final agach = math.max(0.0, c);
        final ar = math.max(0.0, -c);
        final a = 1.0 * agach;
        quadril = Offset(
          cx,
          base - L * (math.cos(a) + math.cos(a * 0.9)) - size.height * 0.2 * ar * ar,
        );
        incl = 0.4 * agach;
        aBraco = math.pi * 0.95 * ar - 0.5 * agach;
        aBraco2 = aBraco;
        _membro(canvas, quadril, a, -a * 0.9, L, pTras);
        _membro(canvas, quadril, a, -a * 0.9, L, pFrente);
        break;
      case 'demo:corrida':
        final w = 2 * math.pi * t;
        final a1 = 0.95 * math.sin(w);
        final a2 = -a1;
        final b1 = a1 - 0.9 * (1 - math.cos(w)) / 2 - 0.2;
        final b2 = a2 - 0.9 * (1 - math.cos(w + math.pi)) / 2 - 0.2;
        quadril = Offset(
          cx,
          base - L * 1.82 + math.sin(2 * w).abs() * -size.height * 0.02,
        );
        incl = 0.25;
        aBraco = -a1 * 0.9;
        aBraco2 = aBraco + 1.2;
        _membro(canvas, quadril, a2, b2, L, pTras);
        _membro(canvas, quadril, a1, b1, L, pFrente);
        break;
      default: // polichinelo (vista frontal)
        abertos = true;
        final a = 0.32 * s;
        quadril = Offset(cx, base - 2 * L * math.cos(a));
        incl = 0;
        aBraco = math.pi * 0.92 * s;
        aBraco2 = aBraco;
        _membro(canvas, quadril, -a, -a, L, pFrente);
        _membro(canvas, quadril, a, a, L, pFrente);
    }

    final pescoco = quadril + Offset(math.sin(incl) * tr, -math.cos(incl) * tr);
    canvas.drawLine(quadril, pescoco, pFrente);
    final dirTronco = (pescoco - quadril) / (pescoco - quadril).distance;
    canvas.drawCircle(
        pescoco + dirTronco * (raioCabeca * 1.5), raioCabeca, Paint()..color = cor);

    if (abertos) {
      _membro(canvas, pescoco, -aBraco, -aBraco2, bra, pFrente);
      _membro(canvas, pescoco, aBraco, aBraco2, bra, pFrente);
    } else {
      _membro(canvas, pescoco, aBraco, aBraco2, bra, pTras);
      _membro(canvas, pescoco, aBraco, aBraco2, bra, pFrente);
    }
  }

  @override
  bool shouldRepaint(covariant _FiguraPainter o) => o.t != t || o.tipo != tipo;
}
