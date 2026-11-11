import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../theme/sate_theme.dart';
import '../data/sate_store.dart';
import 'cores.dart';

// ───────────────────────── Estrutura e texto ─────────────────────────

/// Entrada suave (fade + deslocamento) usada nas seções das telas.
class Revela extends StatelessWidget {
  final Widget child;
  final int ordem;
  const Revela({super.key, required this.child, this.ordem = 0});

  @override
  Widget build(BuildContext context) {
    if (MediaQuery.disableAnimationsOf(context)) return child;
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0, end: 1),
      duration: Duration(milliseconds: 420 + ordem * 70),
      curve: Curves.easeOutCubic,
      builder: (_, v, c) => Opacity(
        opacity: v,
        child: Transform.translate(offset: Offset(0, (1 - v) * 14), child: c),
      ),
      child: child,
    );
  }
}

/// Superfície plana (sem borda nem sombra forte).
class Superficie extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;
  final Color? cor;
  final VoidCallback? onTap;
  final double raio;

  const Superficie({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(16),
    this.cor,
    this.onTap,
    this.raio = 20,
  });

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final forma = BorderRadius.circular(raio);
    return Material(
      color: cor ?? c.superficie,
      borderRadius: forma,
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Padding(padding: padding, child: child),
      ),
    );
  }
}

/// Título de tela no estilo SATE: texto + palavra de destaque em itálico rosa.
class CabecalhoTela extends StatelessWidget {
  final String titulo;
  final String destaque;
  final String? subtitulo;
  final List<Widget> acoes;

  const CabecalhoTela({
    super.key,
    required this.titulo,
    required this.destaque,
    this.subtitulo,
    this.acoes = const [],
  });

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text.rich(
                TextSpan(children: [
                  TextSpan(
                    text: '$titulo ',
                    style: TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.w700,
                      color: c.texto,
                      height: 1.15,
                    ),
                  ),
                  TextSpan(
                    text: destaque,
                    style: SateEstilo.destaque.copyWith(
                      fontSize: 30,
                      color: c.rosa,
                    ),
                  ),
                ]),
              ),
              if (subtitulo != null) ...[
                const SizedBox(height: 4),
                Text(
                  subtitulo!,
                  style: TextStyle(fontSize: 13, color: c.texto2),
                ),
              ],
            ],
          ),
        ),
        ...acoes,
      ],
    );
  }
}

class SecaoCab extends StatelessWidget {
  final String titulo;
  final String? acao;
  final VoidCallback? onAcao;
  const SecaoCab(this.titulo, {super.key, this.acao, this.onAcao});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return Row(
      children: [
        Expanded(
          child: Text(
            titulo,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: c.texto,
            ),
          ),
        ),
        if (acao != null)
          GestureDetector(
            onTap: onAcao,
            behavior: HitTestBehavior.opaque,
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: Text(
                acao!,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: c.rosa,
                ),
              ),
            ),
          ),
      ],
    );
  }
}

class Pilula extends StatelessWidget {
  final String texto;
  final Color cor;
  final IconData? icone;
  const Pilula(this.texto, this.cor, {super.key, this.icone});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: c.suave(cor),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icone != null) ...[
            Icon(icone, size: 13, color: cor),
            const SizedBox(width: 4),
          ],
          Text(
            texto,
            style: TextStyle(
              fontSize: 11.5,
              fontWeight: FontWeight.w600,
              color: cor,
            ),
          ),
        ],
      ),
    );
  }
}

class AvatarIni extends StatelessWidget {
  final String nome;
  final double tamanho;
  const AvatarIni(this.nome, {super.key, this.tamanho = 44});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return ListenableBuilder(
      listenable: SateStore.i,
      builder: (context, _) {
        final foto = SateStore.i.fotoParaNome(nome);
        if (foto != null) {
          return ClipOval(
            child: Image.memory(foto, width: tamanho, height: tamanho, fit: BoxFit.cover),
          );
        }
        final partes =
            nome.trim().split(RegExp(r'\s+')).where((e) => e.isNotEmpty).toList();
        var ini = '?';
        if (partes.isNotEmpty) {
          ini = partes.first[0];
          if (partes.length > 1) ini += partes.last[0];
        }
        final cores = c.serie;
        final cor = cores[nome.codeUnits.fold<int>(0, (a, b) => a + b) % cores.length];
        return Container(
          width: tamanho,
          height: tamanho,
          alignment: Alignment.center,
          decoration: BoxDecoration(color: c.suave(cor), shape: BoxShape.circle),
          child: Text(
            ini.toUpperCase(),
            style: TextStyle(
              fontSize: tamanho * 0.36,
              fontWeight: FontWeight.w700,
              color: cor,
            ),
          ),
        );
      },
    );
  }
}

class VazioView extends StatelessWidget {
  final IconData icone;
  final String titulo;
  final String texto;
  const VazioView(this.icone, this.titulo, this.texto, {super.key});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return Padding(
      padding: const EdgeInsets.all(28),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icone, size: 38, color: c.texto2),
          const SizedBox(height: 10),
          Text(
            titulo,
            style: TextStyle(
                fontSize: 15, fontWeight: FontWeight.w700, color: c.texto),
          ),
          const SizedBox(height: 4),
          Text(
            texto,
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 13, color: c.texto2),
          ),
        ],
      ),
    );
  }
}

class Legenda extends StatelessWidget {
  final List<(String, Color)> itens;
  const Legenda(this.itens, {super.key});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return Wrap(
      spacing: 14,
      runSpacing: 6,
      children: [
        for (final i in itens)
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 9,
                height: 9,
                decoration: BoxDecoration(color: i.$2, shape: BoxShape.circle),
              ),
              const SizedBox(width: 6),
              Text(i.$1, style: TextStyle(fontSize: 11.5, color: c.texto2)),
            ],
          ),
      ],
    );
  }
}

// ───────────────────────── Formulários e folhas ─────────────────────────

InputDecoration decoracaoCampo(BuildContext context, String rotulo,
    {String? dica, Widget? sufixo}) {
  final c = context.sc;
  OutlineInputBorder borda(Color cor, [double w = 0]) => OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: w == 0 ? BorderSide.none : BorderSide(color: cor, width: w),
      );
  return InputDecoration(
    labelText: rotulo,
    hintText: dica,
    suffix: sufixo,
    filled: true,
    fillColor: c.superficie,
    labelStyle: TextStyle(color: c.texto2, fontSize: 14),
    hintStyle: TextStyle(color: c.texto2.withValues(alpha: 0.7)),
    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
    border: borda(c.linha),
    enabledBorder: borda(c.linha),
    focusedBorder: borda(c.primaria, 1.5),
  );
}

ButtonStyle estiloBotao(BuildContext context, {bool rosa = false}) {
  final c = context.sc;
  return FilledButton.styleFrom(
    backgroundColor: rosa ? c.rosa : c.primaria,
    foregroundColor: rosa ? Colors.white : c.sobrePrimaria,
    minimumSize: const Size.fromHeight(50),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    textStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
  );
}

/// Folha inferior padrão do app (respeita teclado e tema).
Future<T?> abrirFolha<T>(BuildContext context, WidgetBuilder builder) {
  final c = context.sc;
  return showModalBottomSheet<T>(
    context: context,
    isScrollControlled: true,
    useSafeArea: true,
    showDragHandle: true,
    backgroundColor: c.fundo,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
    ),
    builder: (ctx) => Padding(
      padding: EdgeInsets.only(bottom: MediaQuery.viewInsetsOf(ctx).bottom),
      child: Builder(builder: builder),
    ),
  );
}

void aviso(BuildContext context, String texto) {
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(SnackBar(content: Text(texto)));
}

String dataBr(DateTime d) =>
    '${d.day.toString().padLeft(2, '0')}/${d.month.toString().padLeft(2, '0')}/${d.year}';

const List<String> mesesCurtos = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];
const List<String> mesesLongos = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto',
  'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
const List<String> diasSemanaCurtos = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const List<String> diasSemanaLongos = [
  'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira',
  'Sábado', 'Domingo',
];

String horaTxt(int minutos) =>
    '${(minutos ~/ 60).toString().padLeft(2, '0')}:${(minutos % 60).toString().padLeft(2, '0')}';

// ───────────────────────── Indicadores ─────────────────────────

class AnelPct extends StatelessWidget {
  final double valor; // 0..1
  final double tamanho;
  final double espessura;
  final Color cor;
  final Widget? centro;

  const AnelPct({
    super.key,
    required this.valor,
    this.tamanho = 72,
    this.espessura = 8,
    required this.cor,
    this.centro,
  });

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return SizedBox(
      width: tamanho,
      height: tamanho,
      child: TweenAnimationBuilder<double>(
        tween: Tween(begin: 0, end: valor.clamp(0.0, 1.0).toDouble()),
        duration: const Duration(milliseconds: 900),
        curve: Curves.easeOutCubic,
        builder: (_, v, __) => CustomPaint(
          painter: _AnelPainter(v, cor, c.linha, espessura),
          child: Center(child: centro),
        ),
      ),
    );
  }
}

class _AnelPainter extends CustomPainter {
  final double v;
  final Color cor;
  final Color trilha;
  final double esp;
  _AnelPainter(this.v, this.cor, this.trilha, this.esp);

  @override
  void paint(Canvas canvas, Size size) {
    final r = Rect.fromLTWH(esp / 2, esp / 2, size.width - esp, size.height - esp);
    final p = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = esp
      ..strokeCap = StrokeCap.round;
    canvas.drawArc(r, 0, math.pi * 2, false, p..color = trilha);
    if (v > 0) {
      canvas.drawArc(r, -math.pi / 2, math.pi * 2 * v, false, p..color = cor);
    }
  }

  @override
  bool shouldRepaint(covariant _AnelPainter o) =>
      o.v != v || o.cor != cor || o.trilha != trilha;
}

class BarraFina extends StatelessWidget {
  final double valor;
  final Color cor;
  final double altura;
  const BarraFina({super.key, required this.valor, required this.cor, this.altura = 6});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return ClipRRect(
      borderRadius: BorderRadius.circular(altura),
      child: TweenAnimationBuilder<double>(
        tween: Tween(begin: 0, end: valor.clamp(0.0, 1.0).toDouble()),
        duration: const Duration(milliseconds: 800),
        curve: Curves.easeOutCubic,
        builder: (_, v, __) => LinearProgressIndicator(
          value: v,
          minHeight: altura,
          backgroundColor: c.linha,
          valueColor: AlwaysStoppedAnimation(cor),
        ),
      ),
    );
  }
}

class Sparkline extends StatelessWidget {
  final List<double> valores;
  final Color cor;
  final double largura;
  final double altura;
  const Sparkline(this.valores, this.cor, {super.key, this.largura = 70, this.altura = 28});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: largura,
      height: altura,
      child: CustomPaint(painter: _SparkPainter(valores, cor)),
    );
  }
}

class _SparkPainter extends CustomPainter {
  final List<double> v;
  final Color cor;
  _SparkPainter(this.v, this.cor);

  @override
  void paint(Canvas canvas, Size size) {
    if (v.length < 2) return;
    var mn = v.reduce(math.min), mx = v.reduce(math.max);
    if ((mx - mn).abs() < 1e-9) {
      mn -= 1;
      mx += 1;
    }
    final pts = <Offset>[
      for (var i = 0; i < v.length; i++)
        Offset(size.width * i / (v.length - 1),
            size.height - 3 - (v[i] - mn) / (mx - mn) * (size.height - 6)),
    ];
    final path = _suave(pts);
    canvas.drawPath(
      path,
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2.2
        ..strokeCap = StrokeCap.round
        ..color = cor,
    );
    canvas.drawCircle(pts.last, 3, Paint()..color = cor);
  }

  @override
  bool shouldRepaint(covariant _SparkPainter o) => o.v != v || o.cor != cor;
}

Path _suave(List<Offset> p) {
  final path = Path()..moveTo(p.first.dx, p.first.dy);
  for (var i = 0; i < p.length - 1; i++) {
    final a = p[i], b = p[i + 1];
    final m = (a.dx + b.dx) / 2;
    path.cubicTo(m, a.dy, m, b.dy, b.dx, b.dy);
  }
  return path;
}

void _txt(Canvas canvas, String t, Offset ancora,
    {TextAlign alinhar = TextAlign.center,
    required Color cor,
    double tamanho = 10.5,
    bool negrito = false}) {
  final tp = TextPainter(
    text: TextSpan(
      text: t,
      style: TextStyle(
        fontSize: tamanho,
        color: cor,
        fontWeight: negrito ? FontWeight.w700 : FontWeight.w500,
        fontFamily: 'Poppins',
      ),
    ),
    textDirection: TextDirection.ltr,
    textAlign: alinhar,
  )..layout();
  final dx = switch (alinhar) {
    TextAlign.right || TextAlign.end => ancora.dx - tp.width,
    TextAlign.left || TextAlign.start => ancora.dx,
    _ => ancora.dx - tp.width / 2,
  };
  tp.paint(canvas, Offset(dx, ancora.dy - tp.height / 2));
}

// ───────────────────────── Gráfico de linha ─────────────────────────

class SerieLinha {
  final String nome;
  final List<double> valores;
  final Color cor;
  const SerieLinha(this.nome, this.valores, this.cor);
}

/// Linha suave com área em degradê, grade discreta e valor ao tocar.
class GraficoLinha extends StatefulWidget {
  final List<String> rotulos;
  final List<SerieLinha> series;
  final double altura;
  final int casas;
  final String unidade;

  const GraficoLinha({
    super.key,
    required this.rotulos,
    required this.series,
    this.altura = 190,
    this.casas = 1,
    this.unidade = '',
  });

  @override
  State<GraficoLinha> createState() => _GraficoLinhaState();
}

class _GraficoLinhaState extends State<GraficoLinha> {
  int? _sel;

  void _atualiza(double dx, double largura) {
    final n = widget.rotulos.length;
    if (n == 0) return;
    final w = largura - _LinhaPainter.eEsq - _LinhaPainter.eDir;
    final i = n <= 1 ? 0 : ((dx - _LinhaPainter.eEsq) / w * (n - 1)).round();
    setState(() => _sel = i.clamp(0, n - 1).toInt());
  }

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return LayoutBuilder(
      builder: (_, box) => GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTapDown: (d) => _atualiza(d.localPosition.dx, box.maxWidth),
        onHorizontalDragUpdate: (d) => _atualiza(d.localPosition.dx, box.maxWidth),
        child: SizedBox(
          height: widget.altura,
          width: double.infinity,
          child: TweenAnimationBuilder<double>(
            tween: Tween(begin: 0, end: 1),
            duration: const Duration(milliseconds: 900),
            curve: Curves.easeOutCubic,
            builder: (_, prog, __) => CustomPaint(
              painter: _LinhaPainter(
                rotulos: widget.rotulos,
                series: widget.series,
                progresso: prog,
                sel: _sel,
                casas: widget.casas,
                unidade: widget.unidade,
                cTexto: c.texto2,
                cGrade: c.linha,
                cTip: c.texto,
                cTipTxt: c.fundo,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _LinhaPainter extends CustomPainter {
  static const double eEsq = 40, eDir = 10, eTopo = 12, eBase = 24;

  final List<String> rotulos;
  final List<SerieLinha> series;
  final double progresso;
  final int? sel;
  final int casas;
  final String unidade;
  final Color cTexto, cGrade, cTip, cTipTxt;

  _LinhaPainter({
    required this.rotulos,
    required this.series,
    required this.progresso,
    required this.sel,
    required this.casas,
    required this.unidade,
    required this.cTexto,
    required this.cGrade,
    required this.cTip,
    required this.cTipTxt,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final area = Rect.fromLTRB(eEsq, eTopo, size.width - eDir, size.height - eBase);
    final todos = series.expand((s) => s.valores).toList();
    if (todos.isEmpty || rotulos.isEmpty) return;
    var mn = todos.reduce(math.min), mx = todos.reduce(math.max);
    if ((mx - mn).abs() < 1e-9) {
      mn -= 1;
      mx += 1;
    }
    final pad = (mx - mn) * 0.14;
    mn -= pad;
    mx += pad;

    final n = rotulos.length;
    double xAt(int i) =>
        n <= 1 ? area.center.dx : area.left + area.width * i / (n - 1);
    double yAt(double v) => area.bottom - (v - mn) / (mx - mn) * area.height;

    final grade = Paint()
      ..color = cGrade
      ..strokeWidth = 1;
    for (var k = 0; k <= 3; k++) {
      final y = area.top + area.height * k / 3;
      canvas.drawLine(Offset(area.left, y), Offset(area.right, y), grade);
      final v = mx - (mx - mn) * k / 3;
      _txt(canvas, v.toStringAsFixed(casas), Offset(eEsq - 6, y),
          alinhar: TextAlign.right, cor: cTexto);
    }
    final passo = (n / 6).ceil().clamp(1, 99).toInt();
    for (var i = 0; i < n; i += passo) {
      _txt(canvas, rotulos[i], Offset(xAt(i), size.height - 8), cor: cTexto);
    }

    canvas.save();
    canvas.clipRect(Rect.fromLTWH(0, 0, size.width * progresso, size.height));
    for (var si = 0; si < series.length; si++) {
      final s = series[si];
      final pts = <Offset>[
        for (var i = 0; i < s.valores.length && i < n; i++)
          Offset(xAt(i), yAt(s.valores[i])),
      ];
      if (pts.isEmpty) continue;
      if (pts.length > 1) {
        final linha = _suave(pts);
        if (si == 0) {
          final fill = Path.from(linha)
            ..lineTo(pts.last.dx, area.bottom)
            ..lineTo(pts.first.dx, area.bottom)
            ..close();
          canvas.drawPath(
            fill,
            Paint()
              ..shader = LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [s.cor.withValues(alpha: 0.16), s.cor.withValues(alpha: 0)],
              ).createShader(area),
          );
        }
        canvas.drawPath(
          linha,
          Paint()
            ..style = PaintingStyle.stroke
            ..strokeWidth = 2.6
            ..strokeCap = StrokeCap.round
            ..color = s.cor,
        );
      }
      for (final p in pts) {
        canvas.drawCircle(p, 3.6, Paint()..color = cTipTxt);
        canvas.drawCircle(
            p,
            3.6,
            Paint()
              ..style = PaintingStyle.stroke
              ..strokeWidth = 2
              ..color = s.cor);
      }
    }
    canvas.restore();

    if (sel != null && sel! < n) {
      final x = xAt(sel!);
      canvas.drawLine(
        Offset(x, area.top),
        Offset(x, area.bottom),
        Paint()
          ..color = cTexto.withValues(alpha: 0.5)
          ..strokeWidth = 1,
      );
      final linhas = <String>[rotulos[sel!]];
      for (final s in series) {
        if (sel! < s.valores.length) {
          final v = s.valores[sel!].toStringAsFixed(casas);
          linhas.add(series.length > 1 ? '${s.nome}: $v$unidade' : '$v$unidade');
        }
      }
      final tp = TextPainter(
        text: TextSpan(
          text: linhas.join('\n'),
          style: TextStyle(
              fontSize: 11,
              height: 1.35,
              fontWeight: FontWeight.w600,
              color: cTipTxt,
              fontFamily: 'Poppins'),
        ),
        textDirection: TextDirection.ltr,
      )..layout();
      final bw = tp.width + 16, bh = tp.height + 10;
      var bx = x - bw / 2;
      bx = bx.clamp(area.left, math.max(area.left, area.right - bw)).toDouble();
      final r = RRect.fromRectAndRadius(
          Rect.fromLTWH(bx, area.top - 2, bw, bh), const Radius.circular(10));
      canvas.drawRRect(r, Paint()..color = cTip);
      tp.paint(canvas, Offset(bx + 8, area.top + 3));
    }
  }

  @override
  bool shouldRepaint(covariant _LinhaPainter o) => true;
}

// ───────────────────────── Barras ─────────────────────────

/// Barras verticais arredondadas, com valor no topo.
class BarrasVerticais extends StatelessWidget {
  final List<String> rotulos;
  final List<double> valores;
  final Color cor;
  final double maximo;
  final double altura;
  final int? destaque;
  final String Function(double) formato;

  const BarrasVerticais({
    super.key,
    required this.rotulos,
    required this.valores,
    required this.cor,
    this.maximo = 100,
    this.altura = 150,
    this.destaque,
    required this.formato,
  });

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return SizedBox(
      height: altura + 52,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          for (var i = 0; i < valores.length; i++)
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Text(
                    formato(valores[i]),
                    style: TextStyle(
                      fontSize: 10.5,
                      fontWeight: FontWeight.w600,
                      color: destaque == i ? c.texto : c.texto2,
                    ),
                  ),
                  const SizedBox(height: 4),
                  TweenAnimationBuilder<double>(
                    tween: Tween(
                      begin: 0,
                      end: (valores[i] / maximo).clamp(0.0, 1.0).toDouble(),
                    ),
                    duration: Duration(milliseconds: 600 + i * 40),
                    curve: Curves.easeOutCubic,
                    builder: (_, v, __) => Container(
                      height: math.max(4.0, altura * v),
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      decoration: BoxDecoration(
                        color: destaque == null || destaque == i
                            ? cor
                            : cor.withValues(alpha: 0.35),
                        borderRadius:
                            const BorderRadius.vertical(top: Radius.circular(8)),
                      ),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    rotulos[i],
                    maxLines: 1,
                    overflow: TextOverflow.clip,
                    style: TextStyle(fontSize: 10.5, color: c.texto2),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

/// Ranking horizontal (comparação entre atletas).
class BarrasRanking extends StatelessWidget {
  final List<(String, double)> itens;
  final double maximo;
  final Color cor;
  final String Function(double) formato;

  const BarrasRanking({
    super.key,
    required this.itens,
    required this.maximo,
    required this.cor,
    required this.formato,
  });

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return Column(
      children: [
        for (var i = 0; i < itens.length; i++)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 6),
            child: Row(
              children: [
                SizedBox(
                  width: 92,
                  child: Text(
                    itens[i].$1,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 12.5, color: c.texto),
                  ),
                ),
                Expanded(
                  child: BarraFina(
                    valor: maximo == 0 ? 0 : itens[i].$2 / maximo,
                    cor: i == 0 ? cor : cor.withValues(alpha: 0.55),
                    altura: 9,
                  ),
                ),
                SizedBox(
                  width: 52,
                  child: Text(
                    formato(itens[i].$2),
                    textAlign: TextAlign.right,
                    style: TextStyle(
                        fontSize: 12.5,
                        fontWeight: FontWeight.w700,
                        color: c.texto),
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }
}

// ───────────────────────── Radar ─────────────────────────

class SerieRadar {
  final String nome;
  final List<double> valores; // 0..1
  final Color cor;
  const SerieRadar(this.nome, this.valores, this.cor);
}

class GraficoRadar extends StatelessWidget {
  final List<String> eixos;
  final List<SerieRadar> series;
  final double altura;
  const GraficoRadar({super.key, required this.eixos, required this.series, this.altura = 240});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return SizedBox(
      height: altura,
      width: double.infinity,
      child: TweenAnimationBuilder<double>(
        tween: Tween(begin: 0, end: 1),
        duration: const Duration(milliseconds: 900),
        curve: Curves.easeOutCubic,
        builder: (_, p, __) => CustomPaint(
          painter: _RadarPainter(eixos, series, p, c.linha, c.texto2),
        ),
      ),
    );
  }
}

class _RadarPainter extends CustomPainter {
  final List<String> eixos;
  final List<SerieRadar> series;
  final double prog;
  final Color grade, texto;
  _RadarPainter(this.eixos, this.series, this.prog, this.grade, this.texto);

  @override
  void paint(Canvas canvas, Size size) {
    final n = eixos.length;
    if (n < 3) return;
    final centro = size.center(Offset.zero);
    final raio = math.min(size.width, size.height) / 2 - 34;
    Offset ponto(int i, double f) {
      final a = -math.pi / 2 + 2 * math.pi * i / n;
      return centro + Offset(math.cos(a), math.sin(a)) * (raio * f);
    }

    final pg = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1
      ..color = grade;
    for (var ring = 1; ring <= 4; ring++) {
      final path = Path();
      for (var i = 0; i < n; i++) {
        final p = ponto(i, ring / 4);
        i == 0 ? path.moveTo(p.dx, p.dy) : path.lineTo(p.dx, p.dy);
      }
      canvas.drawPath(path..close(), pg);
    }
    for (var i = 0; i < n; i++) {
      canvas.drawLine(centro, ponto(i, 1), pg);
      final p = ponto(i, 1.2);
      _txt(canvas, eixos[i], p, cor: texto, tamanho: 10.5);
    }
    for (final s in series) {
      final path = Path();
      for (var i = 0; i < n; i++) {
        final v = (i < s.valores.length ? s.valores[i] : 0).clamp(0.0, 1.0) * prog;
        final p = ponto(i, v.toDouble());
        i == 0 ? path.moveTo(p.dx, p.dy) : path.lineTo(p.dx, p.dy);
      }
      path.close();
      canvas.drawPath(path, Paint()..color = s.cor.withValues(alpha: 0.2));
      canvas.drawPath(
        path,
        Paint()
          ..style = PaintingStyle.stroke
          ..strokeWidth = 2.4
          ..strokeJoin = StrokeJoin.round
          ..color = s.cor,
      );
    }
  }

  @override
  bool shouldRepaint(covariant _RadarPainter o) => true;
}

// ───────────────────────── Barra de navegação ─────────────────────────

class ItemNav {
  final IconData icone;
  final IconData iconeAtivo;
  final String rotulo;
  const ItemNav(this.icone, this.iconeAtivo, this.rotulo);
}

class SateNavBar extends StatelessWidget {
  final List<ItemNav> itens;
  final int indice;
  final ValueChanged<int> onChanged;
  const SateNavBar({
    super.key,
    required this.itens,
    required this.indice,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return Container(
      decoration: BoxDecoration(
        color: c.fundo,
        border: Border(top: BorderSide(color: c.linha)),
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 66,
          child: Row(
            children: [
              for (var i = 0; i < itens.length; i++)
                Expanded(
                  child: InkWell(
                    onTap: () => onChanged(i),
                    splashColor: Colors.transparent,
                    highlightColor: Colors.transparent,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        AnimatedContainer(
                          duration: const Duration(milliseconds: 260),
                          curve: Curves.easeOutCubic,
                          width: indice == i ? 54 : 34,
                          height: 30,
                          decoration: BoxDecoration(
                            color: indice == i ? c.primariaSuave : Colors.transparent,
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Icon(
                            indice == i ? itens[i].iconeAtivo : itens[i].icone,
                            size: 22,
                            color: indice == i ? c.primaria : c.texto2,
                          ),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          itens[i].rotulo,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 10.5,
                            fontWeight:
                                indice == i ? FontWeight.w700 : FontWeight.w500,
                            color: indice == i ? c.texto : c.texto2,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

/// "Hoje • 09:30", "Ontem • 16:30" ou "25/08/2026".
String dataHoraRel(DateTime d) {
  final agora = DateTime.now();
  final hoje = DateTime(agora.year, agora.month, agora.day);
  final dia = DateTime(d.year, d.month, d.day);
  final hh = '${d.hour.toString().padLeft(2, '0')}:${d.minute.toString().padLeft(2, '0')}';
  final dif = hoje.difference(dia).inDays;
  if (dif == 0) return 'Hoje • $hh';
  if (dif == 1) return 'Ontem • $hh';
  return dataBr(d);
}

/// Avatares sobrepostos (ex.: "equipe") com contador opcional.
class PilhaAvatares extends StatelessWidget {
  final List<String> nomes;
  final double tamanho;
  final int maximo;
  const PilhaAvatares(this.nomes, {super.key, this.tamanho = 30, this.maximo = 4});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final mostrar = nomes.take(maximo).toList();
    final resto = nomes.length - mostrar.length;
    final passo = tamanho * 0.68;
    final largura = passo * (mostrar.length + (resto > 0 ? 1 : 0)) + tamanho * 0.32;
    return SizedBox(
      width: largura,
      height: tamanho + 4,
      child: Stack(children: [
        for (var i = 0; i < mostrar.length; i++)
          Positioned(
            left: i * passo,
            child: Container(
              padding: const EdgeInsets.all(2),
              decoration: BoxDecoration(color: c.superficie, shape: BoxShape.circle),
              child: AvatarIni(mostrar[i], tamanho: tamanho),
            ),
          ),
        if (resto > 0)
          Positioned(
            left: mostrar.length * passo,
            child: Container(
              width: tamanho + 4,
              height: tamanho + 4,
              alignment: Alignment.center,
              decoration: BoxDecoration(color: c.superficieAlta, shape: BoxShape.circle),
              child: Text('+$resto',
                  style: TextStyle(
                      fontSize: tamanho * 0.34, fontWeight: FontWeight.w700, color: c.texto)),
            ),
          ),
      ]),
    );
  }
}
