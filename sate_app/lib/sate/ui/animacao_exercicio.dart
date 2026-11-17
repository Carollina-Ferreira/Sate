import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../data/modelos.dart';

// ─────────────────────────────────────────────────────────────────────────────
// Animações de exercícios do SATE.
//
// Uma única estrutura reutilizável desenha um boneco articulado (cinemática
// direta) e anima cada movimento a partir de uma "pose" por instante do ciclo.
// Todo exercício da biblioteca — os de demonstração e os criados pelo treinador —
// recebe uma animação por [movimentoDoExercicio].
// ─────────────────────────────────────────────────────────────────────────────

/// Movimentos disponíveis.
enum Movimento {
  polichinelo,
  joelhos,
  agachamento,
  afundo,
  salto,
  saltoCaixa,
  prancha,
  flexao,
  abdominal,
  corrida,
  sprint,
  escada,
  toqueManchete,
  saque,
  conducao,
  mobilidade,
}

extension MovimentoInfo on Movimento {
  /// Quantas repetições do movimento acontecem em cada volta da animação (12 s).
  int get ciclos => switch (this) {
        Movimento.polichinelo => 10,
        Movimento.joelhos => 6,
        Movimento.agachamento => 4,
        Movimento.afundo => 3,
        Movimento.salto => 5,
        Movimento.saltoCaixa => 3,
        Movimento.prancha => 3,
        Movimento.flexao => 5,
        Movimento.abdominal => 5,
        Movimento.corrida => 10,
        Movimento.sprint => 14,
        Movimento.escada => 4,
        Movimento.toqueManchete => 6,
        Movimento.saque => 3,
        Movimento.conducao => 3,
        Movimento.mobilidade => 4,
      };
}

/// Chave dos vídeos "demo:*" (ver `videosDemo`) -> movimento.
const Map<String, Movimento> _porChave = {
  'demo:polichinelo': Movimento.polichinelo,
  'demo:joelhos': Movimento.joelhos,
  'demo:agachamento': Movimento.agachamento,
  'demo:afundo': Movimento.afundo,
  'demo:salto': Movimento.salto,
  'demo:salto_caixa': Movimento.saltoCaixa,
  'demo:prancha': Movimento.prancha,
  'demo:flexao': Movimento.flexao,
  'demo:abdominal': Movimento.abdominal,
  'demo:corrida': Movimento.corrida,
  'demo:sprint': Movimento.sprint,
  'demo:escada': Movimento.escada,
  'demo:toque_manchete': Movimento.toqueManchete,
  'demo:saque': Movimento.saque,
  'demo:conducao': Movimento.conducao,
  'demo:mobilidade': Movimento.mobilidade,
};

/// Exercícios que já vêm no aplicativo: cada um com o seu movimento.
const Map<String, Movimento> _porId = {
  'ex_aquec': Movimento.joelhos,
  'ex_agach': Movimento.agachamento,
  'ex_afundo': Movimento.afundo,
  'ex_prancha': Movimento.prancha,
  'ex_caixa': Movimento.saltoCaixa,
  'ex_escada': Movimento.escada,
  'ex_tiro': Movimento.sprint,
  'ex_toque': Movimento.toqueManchete,
  'ex_saque': Movimento.saque,
  'ex_conducao': Movimento.conducao,
  'ex_mobil': Movimento.mobilidade,
  'ex_interv': Movimento.corrida,
};

/// Palavras do nome (sem acento) que indicam o movimento — vale para exercícios novos.
const List<(String, Movimento)> _porNome = [
  ('polichinelo', Movimento.polichinelo),
  ('jumping', Movimento.polichinelo),
  ('agach', Movimento.agachamento),
  ('squat', Movimento.agachamento),
  ('afundo', Movimento.afundo),
  ('avanco', Movimento.afundo),
  ('lunge', Movimento.afundo),
  ('caixa', Movimento.saltoCaixa),
  ('banco', Movimento.saltoCaixa),
  ('box', Movimento.saltoCaixa),
  ('salto', Movimento.salto),
  ('pliometr', Movimento.salto),
  ('jump', Movimento.salto),
  ('prancha', Movimento.prancha),
  ('plank', Movimento.prancha),
  ('flexao', Movimento.flexao),
  ('apoio', Movimento.flexao),
  ('abdominal', Movimento.abdominal),
  ('abdomen', Movimento.abdominal),
  ('escada', Movimento.escada),
  ('coordenacao', Movimento.escada),
  ('tiro', Movimento.sprint),
  ('sprint', Movimento.sprint),
  ('velocidade', Movimento.sprint),
  ('arranque', Movimento.sprint),
  ('joelho', Movimento.joelhos),
  ('skipping', Movimento.joelhos),
  ('aquec', Movimento.joelhos),
  ('toque', Movimento.toqueManchete),
  ('manchete', Movimento.toqueManchete),
  ('passe', Movimento.toqueManchete),
  ('saque', Movimento.saque),
  ('conduc', Movimento.conducao),
  ('drible', Movimento.conducao),
  ('slalom', Movimento.conducao),
  ('mobil', Movimento.mobilidade),
  ('quadril', Movimento.mobilidade),
  ('alongamento', Movimento.mobilidade),
  ('flexibilidade', Movimento.mobilidade),
  ('corrida', Movimento.corrida),
  ('trote', Movimento.corrida),
  ('intervalado', Movimento.corrida),
  ('resistencia', Movimento.corrida),
];

/// Quando nada identifica o movimento, vale o grupo do exercício.
const Map<String, Movimento> _porGrupo = {
  'Aquecimento': Movimento.joelhos,
  'Força': Movimento.agachamento,
  'Potência': Movimento.salto,
  'Agilidade': Movimento.escada,
  'Velocidade': Movimento.sprint,
  'Resistência': Movimento.corrida,
  'Técnica': Movimento.conducao,
  'Mobilidade': Movimento.mobilidade,
  'Core': Movimento.prancha,
};

String _semAcento(String t) {
  const de = 'áàâãäéèêëíìîïóòôõöúùûüç';
  const para = 'aaaaaeeeeiiiiooooouuuuc';
  final b = StringBuffer();
  for (final ch in t.toLowerCase().split('')) {
    final i = de.indexOf(ch);
    b.write(i >= 0 ? para[i] : ch);
  }
  return b.toString();
}

/// Movimento de um vídeo "demo:*" (ou null se a chave não for de demonstração).
Movimento? movimentoDaChave(String chave) => _porChave[chave];

/// Movimento animado de um exercício. Sempre devolve algum movimento, então
/// **todos** os exercícios têm animação.
Movimento movimentoDoExercicio(Exercicio e) {
  final porId = _porId[e.id];
  if (porId != null) return porId;
  final porChave = _porChave[e.video];
  if (porChave != null) return porChave;
  final nome = _semAcento(e.nome);
  for (final (trecho, m) in _porNome) {
    if (nome.contains(trecho)) return m;
  }
  return _porGrupo[e.grupo] ?? Movimento.polichinelo;
}

// ─────────────────────────────────────────────────────────────────────────────
// Widget reutilizável
// ─────────────────────────────────────────────────────────────────────────────

/// Mostra a animação de um [movimento], guiada por [animacao] (0..1 a cada volta
/// de 12 s). Quem controla o ritmo (play/pausa) é quem fornece a [animacao].
class AnimacaoExercicio extends StatelessWidget {
  final Movimento movimento;
  final Animation<double> animacao;
  final Color cor;
  final Color destaque;

  const AnimacaoExercicio({
    super.key,
    required this.movimento,
    required this.animacao,
    this.cor = Colors.white,
    this.destaque = const Color(0xFFEF476F),
  });

  @override
  Widget build(BuildContext context) {
    return RepaintBoundary(
      child: AnimatedBuilder(
        animation: animacao,
        builder: (_, __) {
          final t = (animacao.value * movimento.ciclos) % 1.0;
          return CustomPaint(
            size: Size.infinite,
            painter: FiguraExercicioPainter(movimento, t, cor, destaque),
          );
        },
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Pose do boneco
// ─────────────────────────────────────────────────────────────────────────────

/// Ângulos em radianos, medidos a partir da vertical para baixo; positivo = para a frente
/// (direita da tela). O tronco usa a vertical para cima.
class _Pose {
  /// Inclinação do tronco (0 = em pé; positivo = para a frente).
  final double tor;

  /// Braço da frente (ombro, cotovelo) e de trás.
  final double bF1, bF2, bT1, bT2;

  /// Perna da frente (coxa, canela) e de trás.
  final double pF1, pF2, pT1, pT2;

  /// Altura acima do chão, em fração da altura da área.
  final double lift;

  /// Deslocamento horizontal, em fração da largura.
  final double dx;

  /// Vista frontal: o segundo membro é o espelho do primeiro.
  final bool frontal;

  /// Espelha o boneco (alternar lados).
  final bool espelhar;

  const _Pose({
    this.tor = 0,
    this.bF1 = 0,
    this.bF2 = 0,
    this.bT1 = 0,
    this.bT2 = 0,
    this.pF1 = 0,
    this.pF2 = 0,
    this.pT1 = 0,
    this.pT2 = 0,
    this.lift = 0,
    this.dx = 0,
    this.frontal = false,
    this.espelhar = false,
  });
}

double _suave(double x) => x <= 0 ? 0.0 : (x >= 1 ? 1.0 : x * x * (3 - 2 * x));

_Pose _pose(Movimento m, double t) {
  final w = 2 * math.pi * t;
  final s = (1 - math.cos(w)) / 2; // 0 → 1 → 0 ao longo do ciclo

  switch (m) {
    case Movimento.polichinelo: {
      final braco = math.pi * 0.92 * s;
      final perna = 0.34 * s;
      return _Pose(
        frontal: true,
        bF1: braco,
        bF2: braco,
        pF1: perna,
        pF2: perna,
        lift: 0.025 * s,
      );
    }

    case Movimento.joelhos: {
      final w2 = 2 * w; // dois passos por ciclo
      final sa = math.sin(w2);
      final cima = math.max(0.0, sa);
      final cimaT = math.max(0.0, -sa);
      return _Pose(
        tor: 0.06,
        pF1: 1.3 * cima,
        pF2: -0.25 * cima,
        pT1: 1.3 * cimaT,
        pT2: -0.25 * cimaT,
        bF1: -0.9 * sa,
        bF2: -0.9 * sa + 1.3,
        bT1: 0.9 * sa,
        bT2: 0.9 * sa + 1.3,
        lift: 0.02 * sa.abs(),
      );
    }

    case Movimento.agachamento: {
      final a = 1.15 * s;
      return _Pose(
        tor: 0.55 * s,
        pF1: a,
        pF2: -a * 0.9,
        pT1: a,
        pT2: -a * 0.9,
        bF1: 1.5 * s,
        bF2: 1.5 * s,
        bT1: 1.5 * s,
        bT2: 1.5 * s,
      );
    }

    case Movimento.afundo: {
      // duas repetições por ciclo, alternando o lado (espelhando o boneco)
      final u = (t * 2) % 1.0;
      final su = (1 - math.cos(2 * math.pi * u)) / 2;
      return _Pose(
        espelhar: t >= 0.5,
        tor: 0.05,
        pF1: 1.4 * su,
        pF2: 0.0,
        pT1: -0.3 * su,
        pT2: -1.6 * su,
        bF1: 0.35 * su,
        bF2: 0.9 * su,
        bT1: -0.25 * su,
        bT2: 0.6 * su,
      );
    }

    case Movimento.salto: {
      final c = math.cos(w);
      final agacha = math.max(0.0, c);
      final ar = math.max(0.0, -c);
      final braco = math.pi * 0.95 * ar - 0.5 * agacha;
      return _Pose(
        tor: 0.4 * agacha,
        pF1: 1.0 * agacha,
        pF2: -0.9 * agacha,
        pT1: 1.0 * agacha,
        pT2: -0.9 * agacha,
        bF1: braco,
        bF2: braco,
        bT1: braco,
        bT2: braco,
        lift: 0.22 * ar * ar,
      );
    }

    case Movimento.saltoCaixa: {
      const dist = _distCaixa;
      const alt = _altCaixa;
      var agacha = 0.0, dx = 0.0, lift = 0.0, noAr = false;
      if (t < 0.2) {
        agacha = _suave(t / 0.2);
      } else if (t < 0.45) {
        final j = (t - 0.2) / 0.25;
        noAr = true;
        agacha = math.max(0.0, 1 - j * 3);
        dx = dist * _suave(j);
        lift = alt * _suave(j) + 0.09 * math.sin(math.pi * j);
      } else if (t < 0.7) {
        final j = (t - 0.45) / 0.25;
        agacha = 0.35 * math.max(0.0, 1 - j * 4);
        dx = dist;
        lift = alt;
      } else if (t < 0.9) {
        final j = (t - 0.7) / 0.2;
        dx = dist * (1 - _suave(j));
        lift = alt * (1 - _suave(j));
      }
      final braco = noAr
          ? math.pi * 0.8 * math.sin(math.pi * (t - 0.2) / 0.25)
          : -0.5 * agacha;
      return _Pose(
        tor: 0.4 * agacha,
        pF1: agacha,
        pF2: -agacha * 0.9,
        pT1: agacha,
        pT2: -agacha * 0.9,
        bF1: braco,
        bF2: braco,
        bT1: braco,
        bT2: braco,
        dx: dx,
        lift: lift,
      );
    }

    case Movimento.prancha: {
      final respira = 0.025 * math.sin(w);
      return _Pose(
        tor: 1.45 + respira,
        pF1: -1.35,
        pF2: -1.35,
        pT1: -1.35,
        pT2: -1.35,
        bF1: 0,
        bF2: 1.5,
        bT1: 0,
        bT2: 1.5,
      );
    }

    case Movimento.flexao: {
      final phi = 0.46 - 0.31 * s; // ângulo do corpo com o chão
      final tor = math.pi / 2 - phi;
      final cotovelo = 1.15 * s;
      return _Pose(
        tor: tor,
        pF1: -tor,
        pF2: -tor,
        pT1: -tor,
        pT2: -tor,
        bF1: -cotovelo,
        bF2: cotovelo,
        bT1: -cotovelo,
        bT2: cotovelo,
      );
    }

    case Movimento.abdominal: {
      return _Pose(
        tor: -1.45 + 1.8 * s,
        pF1: 2.2,
        pF2: 0.95,
        pT1: 2.2,
        pT2: 0.95,
        bF1: 1.2 + 0.5 * s,
        bF2: 1.2 + 0.5 * s,
        bT1: 1.2 + 0.5 * s,
        bT2: 1.2 + 0.5 * s,
      );
    }

    case Movimento.corrida: {
      return _corrida(w, amp: 0.95, dobra: 1.1, tronco: 0.25, braco: 0.9, voo: 0.03);
    }

    case Movimento.sprint: {
      return _corrida(w, amp: 1.15, dobra: 1.3, tronco: 0.55, braco: 1.2, voo: 0.045);
    }

    case Movimento.escada: {
      // passadas rápidas (8 por travessia da escada)
      final passo = _corrida(w * 8,
          amp: 0.5, dobra: 0.9, tronco: 0.2, braco: 0.7, voo: 0.012);
      return _Pose(
        tor: passo.tor,
        pF1: passo.pF1,
        pF2: passo.pF2,
        pT1: passo.pT1,
        pT2: passo.pT2,
        bF1: passo.bF1,
        bF2: passo.bF2,
        bT1: passo.bT1,
        bT2: passo.bT2,
        lift: passo.lift,
        dx: -0.24 + 0.48 * t,
      );
    }

    case Movimento.toqueManchete: {
      return _Pose(
        tor: 0.35 * (1 - s) + 0.1,
        pF1: 0.5 * (1 - s) + 0.1,
        pF2: -(0.5 * (1 - s) + 0.1) * 0.9,
        pT1: 0.5 * (1 - s) + 0.1,
        pT2: -(0.5 * (1 - s) + 0.1) * 0.9,
        bF1: 1.2 + 0.5 * s,
        bF2: 1.2 + 0.5 * s,
        bT1: 1.2 + 0.5 * s,
        bT2: 1.2 + 0.5 * s,
        lift: 0.012 * s,
      );
    }

    case Movimento.saque: {
      final golpe = _suave((t - 0.25) / 0.17);
      final volta = _suave((t - 0.7) / 0.3);
      final bracoGolpe = (-0.9 + 3.9 * golpe) * (1 - volta) + (-0.9) * volta;
      final lanca = t < 0.2
          ? math.pi * 0.9 * _suave(t / 0.2)
          : math.pi * 0.9 * (1 - _suave((t - 0.3) / 0.15));
      final tronco = -0.2 + 0.45 * golpe * (1 - volta) + 0.0 * volta;
      return _Pose(
        tor: tronco,
        pF1: 0.12,
        pF2: 0.0,
        pT1: -0.18,
        pT2: -0.12,
        bF1: bracoGolpe,
        bF2: bracoGolpe - 0.25 * (1 - golpe),
        bT1: lanca,
        bT2: lanca,
        lift: 0.03 * golpe * (1 - volta),
      );
    }

    case Movimento.conducao: {
      // 4 passadas por travessia, com a bola sempre junto ao pé da frente
      final base = _corrida(w * 4,
          amp: 0.8, dobra: 1.0, tronco: 0.3, braco: 0.8, voo: 0.02);
      return _Pose(
        tor: base.tor,
        pF1: base.pF1,
        pF2: base.pF2,
        pT1: base.pT1,
        pT2: base.pT2,
        bF1: base.bF1,
        bF2: base.bF2,
        bT1: base.bT1,
        bT2: base.bT2,
        lift: base.lift,
        dx: -0.24 + 0.48 * t,
      );
    }

    case Movimento.mobilidade: {
      final giro = math.sin(w);
      final coxa = -0.55 + 0.75 * giro;
      return _Pose(
        tor: 1.25,
        pF1: coxa,
        pF2: coxa - 1.3 + 0.5 * math.cos(w),
        pT1: 0.0,
        pT2: -1.5,
        bF1: 0.0,
        bF2: 0.0,
        bT1: 0.0,
        bT2: 0.0,
      );
    }
  }
}

/// Ciclo de corrida com amplitude configurável. [w] é a fase em radianos.
_Pose _corrida(
  double w, {
  required double amp,
  required double dobra,
  required double tronco,
  required double braco,
  required double voo,
}) {
  final th = amp * math.sin(w);
  final dobraF = dobra * math.max(0.0, math.cos(w));
  final dobraT = dobra * math.max(0.0, -math.cos(w));
  final sa = math.sin(w);
  return _Pose(
    tor: tronco,
    pF1: th,
    pF2: th - dobraF - 0.15,
    pT1: -th,
    pT2: -th - dobraT - 0.15,
    bF1: -braco * sa,
    bF2: -braco * sa + 1.3,
    bT1: braco * sa,
    bT2: braco * sa + 1.3,
    lift: voo * (1 - math.cos(2 * w)) / 2,
  );
}

// Medidas do salto na caixa (frações da largura / da altura da área).
const double _distCaixa = 0.17;
const double _altCaixa = 0.13;

// ─────────────────────────────────────────────────────────────────────────────
// Desenho
// ─────────────────────────────────────────────────────────────────────────────

class FiguraExercicioPainter extends CustomPainter {
  final Movimento movimento;

  /// Fase do ciclo, de 0 a 1.
  final double t;
  final Color cor;
  final Color destaque;

  const FiguraExercicioPainter(this.movimento, this.t, this.cor, this.destaque);

  @override
  bool shouldRepaint(covariant FiguraExercicioPainter old) =>
      old.t != t ||
      old.movimento != movimento ||
      old.cor != cor ||
      old.destaque != destaque;

  Offset _v(double ang, double len) => Offset(math.sin(ang) * len, math.cos(ang) * len);

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width, h = size.height;
    if (w <= 0 || h <= 0) return;
    final base = h * 0.84; // linha do chão
    final cx = w / 2;

    final p = _pose(movimento, t);
    final seg = h * 0.20; // coxa e canela
    final tronco = h * 0.27;
    final braco = h * 0.15; // braço e antebraço
    final raio = h * 0.055; // cabeça

    // ── pontos relativos ao quadril (y positivo = para baixo)
    final dirTronco = Offset(math.sin(p.tor), -math.cos(p.tor));
    final pescoco = dirTronco * tronco;
    final cabeca = pescoco + dirTronco * (raio * 1.5);
    final joelhoA = _v(p.pF1, seg);
    final peA = joelhoA + _v(p.pF2, seg);
    final joelhoB = p.frontal ? _v(-p.pF1, seg) : _v(p.pT1, seg);
    final peB = joelhoB + (p.frontal ? _v(-p.pF2, seg) : _v(p.pT2, seg));
    final cotoveloA = pescoco + _v(p.bF1, braco);
    final maoA = cotoveloA + _v(p.bF2, braco);
    final cotoveloB = pescoco + (p.frontal ? _v(-p.bF1, braco) : _v(p.bT1, braco));
    final maoB = cotoveloB + (p.frontal ? _v(-p.bF2, braco) : _v(p.bT2, braco));

    // O ponto mais baixo do corpo apoia no chão (ou na caixa, quando há [lift]).
    var maisBaixo = 0.0;
    for (final q in [joelhoA, peA, joelhoB, peB, cotoveloA, maoA, cotoveloB, maoB, pescoco]) {
      maisBaixo = math.max(maisBaixo, q.dy);
    }
    maisBaixo = math.max(maisBaixo, cabeca.dy + raio);

    final origem = Offset(cx + p.dx * w, base - maisBaixo - p.lift * h);

    // ── chão e sombra
    final chao = Paint()
      ..color = cor.withValues(alpha: 0.30)
      ..strokeWidth = 2
      ..strokeCap = StrokeCap.round;
    canvas.drawLine(Offset(w * 0.06, base), Offset(w * 0.94, base), chao);

    final alturaSalto = (p.lift * 2.2).clamp(0.0, 1.0);
    final sombra = Paint()..color = cor.withValues(alpha: 0.18 * (1 - alturaSalto * 0.6));
    canvas.drawOval(
      Rect.fromCenter(
        center: Offset(origem.dx, base + 3),
        width: h * 0.34 * (1 - alturaSalto * 0.4),
        height: h * 0.035,
      ),
      sombra,
    );

    _apoios(canvas, size, base, cx);

    // ── boneco
    canvas.save();
    if (p.espelhar) {
      canvas.translate(cx, 0);
      canvas.scale(-1, 1);
      canvas.translate(-cx, 0);
    }

    final traco = h * 0.032;
    Paint pincel(double alfa, double larg) => Paint()
      ..color = cor.withValues(alpha: alfa)
      ..style = PaintingStyle.stroke
      ..strokeWidth = larg
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    void membro(Offset a, Offset b, Offset c, Paint pn) {
      final path = Path()
        ..moveTo(origem.dx + a.dx, origem.dy + a.dy)
        ..lineTo(origem.dx + b.dx, origem.dy + b.dy)
        ..lineTo(origem.dx + c.dx, origem.dy + c.dy);
      canvas.drawPath(path, pn);
    }

    // membros de trás (mais discretos)
    membro(Offset.zero, joelhoB, peB, pincel(0.55, traco));
    membro(pescoco, cotoveloB, maoB, pincel(0.55, traco * 0.9));

    // tronco e cabeça
    canvas.drawLine(
      origem,
      origem + pescoco,
      pincel(1, h * 0.042),
    );
    canvas.drawCircle(
      origem + cabeca,
      raio,
      Paint()..color = cor,
    );

    // membros da frente
    membro(Offset.zero, joelhoA, peA, pincel(1, traco));
    membro(pescoco, cotoveloA, maoA, pincel(1, traco * 0.9));

    canvas.restore();

    _bola(canvas, size, base, origem, raio, pescoco, maoA, peA, peB);
  }

  // ── objetos de cena atrás do boneco ────────────────────────────────────────
  void _apoios(Canvas canvas, Size size, double base, double cx) {
    final w = size.width, h = size.height;
    final cheio = Paint()..color = destaque;
    final suave = Paint()..color = cor.withValues(alpha: 0.2);

    switch (movimento) {
      case Movimento.saltoCaixa:
        final largura = w * 0.17;
        final caixa = RRect.fromRectAndRadius(
          Rect.fromLTWH(cx + _distCaixa * w - largura / 2, base - _altCaixa * h, largura,
              _altCaixa * h),
          const Radius.circular(6),
        );
        canvas.drawRRect(caixa, cheio);
        break;

      case Movimento.escada:
        for (var i = 0; i < 8; i++) {
          final x = cx - w * 0.3 + i * (w * 0.6 / 7);
          canvas.drawRRect(
            RRect.fromRectAndRadius(
              Rect.fromCenter(center: Offset(x, base + 6), width: w * 0.012, height: h * 0.045),
              const Radius.circular(2),
            ),
            cheio,
          );
        }
        canvas.drawLine(
          Offset(cx - w * 0.3, base + 6),
          Offset(cx + w * 0.3, base + 6),
          Paint()
            ..color = destaque
            ..strokeWidth = 2,
        );
        break;

      case Movimento.conducao:
        for (final fx in [-0.12, 0.04, 0.2]) {
          final x = cx + fx * w;
          final cone = Path()
            ..moveTo(x - h * 0.03, base)
            ..lineTo(x + h * 0.03, base)
            ..lineTo(x, base - h * 0.08)
            ..close();
          canvas.drawPath(cone, cheio);
        }
        break;

      case Movimento.prancha:
      case Movimento.flexao:
      case Movimento.abdominal:
      case Movimento.mobilidade:
        canvas.drawRRect(
          RRect.fromRectAndRadius(
            Rect.fromLTWH(cx - w * 0.3, base + 2, w * 0.6, h * 0.022),
            const Radius.circular(6),
          ),
          suave,
        );
        break;

      default:
        break;
    }
  }

  // ── bola (toque/manchete, saque e condução) ────────────────────────────────
  void _bola(Canvas canvas, Size size, double base, Offset origem, double raio, Offset pescoco,
      Offset maoA, Offset peA, Offset peB) {
    final w = size.width, h = size.height;
    final r = raio * 0.85;
    Offset c;

    switch (movimento) {
      case Movimento.toqueManchete:
        final u = (t + 0.5) % 1.0;
        final maos = origem + maoA;
        c = Offset(maos.dx, maos.dy - r - h * 0.30 * math.sin(math.pi * u));
        break;

      case Movimento.saque:
        final pesc = origem + pescoco;
        final solta = Offset(pesc.dx + h * 0.06, pesc.dy - h * 0.12);
        final contato = Offset(pesc.dx + h * 0.06, pesc.dy - h * 0.27);
        if (t < 0.1) {
          c = Offset(solta.dx, solta.dy + h * 0.1 * (1 - t / 0.1));
        } else if (t < 0.42) {
          final u = (t - 0.1) / 0.32;
          c = Offset.lerp(solta, contato, u)! - Offset(0, h * 0.12 * math.sin(math.pi * u));
        } else {
          final u = (t - 0.42) / 0.58;
          c = Offset(contato.dx + u * w * 0.34,
              contato.dy - h * 0.08 * math.sin(math.pi * u) + u * h * 0.12);
        }
        break;

      case Movimento.conducao:
        final lider = (peA.dx > peB.dx ? peA : peB);
        final pe = origem + lider;
        c = Offset(pe.dx + r * 2.4, base - r - h * 0.012 * math.sin(t * 2 * math.pi * 12).abs());
        break;

      default:
        return;
    }

    canvas.drawCircle(c, r, Paint()..color = destaque);
    canvas.drawCircle(
      c,
      r,
      Paint()
        ..color = cor
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.4,
    );
  }
}
