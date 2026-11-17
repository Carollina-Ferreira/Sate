import 'package:flutter/material.dart';

import '../data/modelos.dart';
import '../data/sate_store.dart';
import '../ui/animacao_exercicio.dart';
import '../ui/cores.dart';

/// Player demonstrativo de interface (sem backend e sem pacote de vídeo).
/// Todo exercício recebe uma animação do movimento (ver `animacao_exercicio.dart`):
/// pelos vídeos "demo:*", pelo exercício cadastrado ou, em último caso, pelo grupo.
class VideoDemo extends StatefulWidget {
  final String video;
  final String titulo;

  /// Exercício exibido; permite escolher a animação certa mesmo quando o
  /// treinador associou um arquivo de vídeo próprio.
  final Exercicio? exercicio;

  const VideoDemo({
    super.key,
    required this.video,
    required this.titulo,
    this.exercicio,
  });

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
  bool _verificouAcessibilidade = false;

  Movimento get _movimento {
    final e = widget.exercicio;
    if (e != null) return movimentoDoExercicio(e);
    return movimentoDaChave(widget.video) ?? Movimento.polichinelo;
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // "Reduzir animações" (acessibilidade): mostra um quadro parado; o usuário pode tocar em play.
    if (!_verificouAcessibilidade) {
      _verificouAcessibilidade = true;
      if (MediaQuery.disableAnimationsOf(context)) {
        _ctl.stop();
        _ctl.value = 0.12;
        _tocando = false;
      }
    }
  }

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
    final temArquivo = widget.video.isNotEmpty && !videosDemo.containsKey(widget.video);

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
              Positioned.fill(
                child: Semantics(
                  label: 'Animação demonstrativa: ${widget.titulo}',
                  child: AnimacaoExercicio(
                    movimento: _movimento,
                    animacao: _ctl,
                    cor: Colors.white,
                    destaque: c.rosa,
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
                  child: Text(
                    temArquivo ? 'Animação demonstrativa · vídeo associado' : 'Animação demonstrativa',
                    style: const TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.w600),
                  ),
                ),
              ),
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
