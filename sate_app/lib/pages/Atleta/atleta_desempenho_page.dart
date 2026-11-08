import 'package:flutter/material.dart';

import 'atleta_notificacao_page.dart';
import '../../theme/sate_theme.dart';

class AtletaDesempenhoPage extends StatefulWidget {
  const AtletaDesempenhoPage({super.key});

  @override
  State<AtletaDesempenhoPage> createState() =>
      _AtletaDesempenhoPageState();
}

class _AtletaDesempenhoPageState
    extends State<AtletaDesempenhoPage> {
  static const Color verde = Color(0xFF005942);
  static const Color verdeClaro = Color(0xFFDFF7EE);
  static const Color fundo = Color(0xFFFAF5EE);

  int periodoSelecionado = 0;
  int relatorioSelecionado = 1;

  final List<String> periodos = [
    'Todos',
    'Mês',
    'Ano',
  ];

  final List<String> relatorios = [
    'Semanal',
    'Mensal',
    'Anual',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: fundo,

      appBar: AppBar(
        backgroundColor: fundo,
        elevation: 0,
        centerTitle: false,
        title: const Text.rich(
          TextSpan(children: [TextSpan(text: 'Minha '), TextSpan(text: 'evolução', style: SateEstilo.destaque)]),
          style: TextStyle(
            color: Color(0xFF10251F),
            fontSize: 19,
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) =>
                      const AtletaNotificacaoPage(),
                ),
              );
            },
            icon: const Icon(
              Icons.notifications_none_rounded,
              color: Color(0xFF10251F),
              size: 26,
            ),
          ),
        ],
      ),

      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(
            16,
            4,
            16,
            30,
          ),
          child: Column(
            crossAxisAlignment:
                CrossAxisAlignment.start,
            children: [
              _buildHeader(),

              const SizedBox(height: 22),

              _buildPeriodo(),

              const SizedBox(height: 24),

              const Text(
                'Seu desempenho',
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF10251F),
                ),
              ),

              const SizedBox(height: 10),

              _buildGraficoDesempenho(),

              const SizedBox(height: 24),

              const Text(
                'Frequência mensal',
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF10251F),
                ),
              ),

              const SizedBox(height: 10),

              _buildGraficoFrequencia(),

              const SizedBox(height: 12),

              Row(
                children: [
                  Expanded(
                    child: _buildResumoCard(
                      titulo: 'Treinos realizados',
                      valor: '47',
                      icone:
                          Icons.fitness_center_rounded,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _buildResumoCard(
                      titulo: 'Metas atingidas',
                      valor: '6/8',
                      icone: Icons.flag_rounded,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 24),

              Row(
                children: [
                  const Expanded(
                    child: Text(
                      'Avaliação física',
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF10251F),
                      ),
                    ),
                  ),
                  TextButton(
                    onPressed: () {},
                    child: const Text(
                      'Ver detalhes',
                      style: TextStyle(
                        color: verde,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 4),

              _buildAvaliacaoFisica(),

              const SizedBox(height: 24),

              const Text(
                'Últimas avaliações',
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF10251F),
                ),
              ),

              const SizedBox(height: 10),

              _buildUltimasAvaliacoes(),

              const SizedBox(height: 24),

              const Text(
                'Histórico recente',
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF10251F),
                ),
              ),

              const SizedBox(height: 10),

              _buildHistorico(),

              const SizedBox(height: 24),

              const Text(
                'Relatórios',
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF10251F),
                ),
              ),

              const SizedBox(height: 10),

              _buildRelatorios(),

              const SizedBox(height: 10),

              _buildGraficoRelatorio(),

              const SizedBox(height: 14),

              _buildBotaoExportar(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: verde,
        borderRadius: BorderRadius.circular(22),
      ),
      child: Row(
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: Colors.white.withValues(
                alpha: 0.15,
              ),
              borderRadius:
                  BorderRadius.circular(16),
            ),
            child: const Icon(
              Icons.bar_chart_rounded,
              color: Colors.white,
              size: 28,
            ),
          ),
          const SizedBox(width: 14),
          const Expanded(
            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment.start,
              children: [
                Text(
                  'Acompanhe sua evolução',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 5),
                Text(
                  'Veja seu desempenho e acompanhe seus resultados.',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 13,
                    height: 1.3,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPeriodo() {
    return SizedBox(
      height: 38,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: periodos.length,
        separatorBuilder: (_, _) {
          return const SizedBox(width: 8);
        },
        itemBuilder: (context, index) {
          final selecionado =
              periodoSelecionado == index;

          return GestureDetector(
            onTap: () {
              setState(() {
                periodoSelecionado = index;
              });
            },
            child: Container(
              padding:
                  const EdgeInsets.symmetric(
                horizontal: 17,
              ),
              decoration: BoxDecoration(
                color: selecionado
                    ? verde
                    : Colors.white,
                borderRadius:
                    BorderRadius.circular(20),
                border: Border.all(
                  color: selecionado
                      ? verde
                      : Color(0xFFE8DFD3),
                ),
              ),
              alignment: Alignment.center,
              child: Text(
                periodos[index],
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: selecionado
                      ? FontWeight.w600
                      : FontWeight.w400,
                  color: selecionado
                      ? Colors.white
                      : Color(0xFF4F5A56),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildGraficoDesempenho() {
    return Container(
      height: 190,
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(
        12,
        14,
        12,
        10,
      ),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius:
            BorderRadius.circular(20),
        border: Border.all(
          color: Color(0xFFE8DFD3),
        ),
        boxShadow: [
          BoxShadow(
            color: Color(0xFF10251F).withValues(
              alpha: 0.035,
            ),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Expanded(
            child: CustomPaint(
              painter: _GraficoLinhaPainter(),
              child: Container(),
            ),
          ),
          Row(
            mainAxisAlignment:
                MainAxisAlignment.spaceAround,
            children: const [
              _LegendaGrafico(texto: 'Seg'),
              _LegendaGrafico(texto: 'Ter'),
              _LegendaGrafico(texto: 'Qua'),
              _LegendaGrafico(texto: 'Qui'),
              _LegendaGrafico(texto: 'Sex'),
              _LegendaGrafico(texto: 'Sáb'),
              _LegendaGrafico(texto: 'Dom'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildGraficoFrequencia() {
    final valores = [
      0.55,
      0.90,
      0.68,
      0.35,
    ];

    final meses = [
      'Mai',
      'Jun',
      'Jul',
      'Ago',
    ];

    return Container(
      height: 170,
      padding: const EdgeInsets.fromLTRB(
        18,
        15,
        18,
        10,
      ),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius:
            BorderRadius.circular(20),
        border: Border.all(
          color: Color(0xFFE8DFD3),
        ),
        boxShadow: [
          BoxShadow(
            color: Color(0xFF10251F).withValues(
              alpha: 0.035,
            ),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment:
            CrossAxisAlignment.end,
        mainAxisAlignment:
            MainAxisAlignment.spaceAround,
        children: List.generate(
          valores.length,
          (index) {
            return Column(
              mainAxisAlignment:
                  MainAxisAlignment.end,
              children: [
                Text(
                  '${(valores[index] * 100).round()}%',
                  style: const TextStyle(
                    fontSize: 9,
                    fontWeight: FontWeight.w600,
                    color: verde,
                  ),
                ),
                const SizedBox(height: 5),
                Container(
                  width: 25,
                  height:
                      105 * valores[index],
                  decoration: BoxDecoration(
                    color: verde,
                    borderRadius:
                        BorderRadius.circular(12),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  meses[index],
                  style: TextStyle(
                    fontSize: 10,
                    color:
                        Color(0xFF68736F),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildResumoCard({
    required String titulo,
    required String valor,
    required IconData icone,
  }) {
    return Container(
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius:
            BorderRadius.circular(20),
        border: Border.all(
          color: Color(0xFFE8DFD3),
        ),
        boxShadow: [
          BoxShadow(
            color: Color(0xFF10251F).withValues(
              alpha: 0.035,
            ),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment:
            CrossAxisAlignment.start,
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: verdeClaro,
              borderRadius:
                  BorderRadius.circular(12),
            ),
            child: Icon(
              icone,
              size: 20,
              color: verde,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            titulo,
            maxLines: 2,
            style: TextStyle(
              fontSize: 10,
              color: Color(0xFF68736F),
            ),
          ),
          const SizedBox(height: 3),
          Text(
            valor,
            style: const TextStyle(
              fontSize: 21,
              fontWeight: FontWeight.bold,
              color: verde,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAvaliacaoFisica() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius:
            BorderRadius.circular(20),
        border: Border.all(
          color: Color(0xFFE8DFD3),
        ),
        boxShadow: [
          BoxShadow(
            color: Color(0xFF10251F).withValues(
              alpha: 0.035,
            ),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              const Expanded(
                child: Text(
                  'Condição geral',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF10251F),
                  ),
                ),
              ),
              Text(
                '+12%',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: verde,
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),

          SizedBox(
            height: 120,
            child: CustomPaint(
              painter:
                  _GraficoAvaliacaoPainter(),
              child: Container(),
            ),
          ),

          Divider(
            height: 25,
            color: Color(0xFFE8DFD3),
          ),

          Row(
            children: [
              Expanded(
                child: _buildIndicador(
                  'VO2 Máx',
                  '55',
                  'ml/kg/min',
                ),
              ),
              _buildDivisor(),
              Expanded(
                child: _buildIndicador(
                  'IMC',
                  '22.4',
                  'Normal',
                ),
              ),
              _buildDivisor(),
              Expanded(
                child: _buildIndicador(
                  'Gordura Corporal',
                  '14%',
                  'Ideal',
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildIndicador(
    String titulo,
    String valor,
    String legenda,
  ) {
    return Column(
      children: [
        Text(
          titulo,
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 9,
            color: Color(0xFF68736F),
          ),
        ),
        const SizedBox(height: 7),
        Text(
          valor,
          style: const TextStyle(
            fontSize: 19,
            fontWeight: FontWeight.bold,
            color: Color(0xFF10251F),
          ),
        ),
        const SizedBox(height: 3),
        Text(
          legenda,
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 9,
            color: legenda == 'Ideal' ||
                    legenda == 'Normal'
                ? verde
                : Color(0xFF8A938F),
          ),
        ),
      ],
    );
  }

  Widget _buildDivisor() {
    return Container(
      width: 1,
      height: 65,
      color: Color(0xFFE8DFD3),
    );
  }

  Widget _buildUltimasAvaliacoes() {
    final avaliacoes = [
      ['29/05/2026', 'Excelente'],
      ['22/05/2026', 'Boa'],
      ['15/05/2026', 'Boa'],
    ];

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius:
            BorderRadius.circular(20),
        border: Border.all(
          color: Color(0xFFE8DFD3),
        ),
        boxShadow: [
          BoxShadow(
            color: Color(0xFF10251F).withValues(
              alpha: 0.035,
            ),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: List.generate(
          avaliacoes.length,
          (index) {
            final avaliacao =
                avaliacoes[index];

            return Container(
              padding:
                  const EdgeInsets.symmetric(
                horizontal: 15,
                vertical: 13,
              ),
              decoration: BoxDecoration(
                border: index !=
                        avaliacoes.length - 1
                    ? Border(
                        bottom: BorderSide(
                          color:
                              Color(0xFFE8DFD3),
                        ),
                      )
                    : null,
              ),
              child: Row(
                children: [
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      color: verdeClaro,
                      borderRadius:
                          BorderRadius.circular(11),
                    ),
                    child: const Icon(
                      Icons
                          .assignment_turned_in_outlined,
                      size: 19,
                      color: verde,
                    ),
                  ),

                  const SizedBox(width: 11),

                  Expanded(
                    child: Text(
                      avaliacao[0],
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight:
                            FontWeight.w500,
                        color: Color(0xFF10251F),
                      ),
                    ),
                  ),

                  Container(
                    padding:
                        const EdgeInsets.symmetric(
                      horizontal: 9,
                      vertical: 5,
                    ),
                    decoration: BoxDecoration(
                      color: verdeClaro,
                      borderRadius:
                          BorderRadius.circular(20),
                    ),
                    child: Text(
                      avaliacao[1],
                      style: const TextStyle(
                        fontSize: 9,
                        fontWeight:
                            FontWeight.w600,
                        color: verde,
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildHistorico() {
    return Column(
      children: [
        _buildHistoricoItem(
          'Treino tático',
          'Ontem',
        ),
        const SizedBox(height: 10),
        _buildHistoricoItem(
          'Fortalecimento',
          'Seg, 18/08',
        ),
        const SizedBox(height: 10),
        _buildHistoricoItem(
          'Treino de velocidade',
          'Sex, 15/08',
        ),
      ],
    );
  }

  Widget _buildHistoricoItem(
    String titulo,
    String data,
  ) {
    return Container(
      padding: const EdgeInsets.all(13),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius:
            BorderRadius.circular(20),
        border: Border.all(
          color: Color(0xFFE8DFD3),
        ),
        boxShadow: [
          BoxShadow(
            color: Color(0xFF10251F).withValues(
              alpha: 0.035,
            ),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              color: verdeClaro,
              borderRadius:
                  BorderRadius.circular(11),
            ),
            child: const Icon(
              Icons.check_rounded,
              color: verde,
              size: 20,
            ),
          ),

          const SizedBox(width: 11),

          Expanded(
            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment.start,
              children: [
                Text(
                  titulo,
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF10251F),
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  data,
                  style: TextStyle(
                    fontSize: 10,
                    color: Color(0xFF68736F),
                  ),
                ),
              ],
            ),
          ),

          const Icon(
            Icons.chevron_right_rounded,
            size: 20,
            color: Color(0xFF8A938F),
          ),
        ],
      ),
    );
  }

  Widget _buildRelatorios() {
    return SizedBox(
      height: 40,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: relatorios.length,
        separatorBuilder: (_, _) {
          return const SizedBox(width: 8);
        },
        itemBuilder: (context, index) {
          final selecionado =
              relatorioSelecionado == index;

          return GestureDetector(
            onTap: () {
              setState(() {
                relatorioSelecionado = index;
              });
            },
            child: Container(
              padding:
                  const EdgeInsets.symmetric(
                horizontal: 18,
              ),
              decoration: BoxDecoration(
                color: selecionado
                    ? verde
                    : Colors.white,
                borderRadius:
                    BorderRadius.circular(20),
                border: Border.all(
                  color: selecionado
                      ? verde
                      : Color(0xFFE8DFD3),
                ),
              ),
              alignment: Alignment.center,
              child: Text(
                relatorios[index],
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: selecionado
                      ? FontWeight.w600
                      : FontWeight.w400,
                  color: selecionado
                      ? Colors.white
                      : Color(0xFF4F5A56),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildGraficoRelatorio() {
    return Container(
      height: 210,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius:
            BorderRadius.circular(20),
        border: Border.all(
          color: Color(0xFFE8DFD3),
        ),
        boxShadow: [
          BoxShadow(
            color: Color(0xFF10251F).withValues(
              alpha: 0.035,
            ),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment:
            CrossAxisAlignment.start,
        children: [
          Text(
            relatorioSelecionado == 0
                ? 'Desempenho semanal'
                : relatorioSelecionado == 1
                    ? 'Desempenho mensal'
                    : 'Desempenho anual',
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Color(0xFF10251F),
            ),
          ),

          const SizedBox(height: 12),

          Expanded(
            child: CustomPaint(
              painter:
                  _GraficoBarrasPainter(),
              child: Container(),
            ),
          ),

          Row(
            mainAxisAlignment:
                MainAxisAlignment.spaceAround,
            children: [
              Text(
                relatorioSelecionado == 2
                    ? 'Mês 1'
                    : 'Semana 1',
                style: _labelStyle(),
              ),
              Text(
                relatorioSelecionado == 2
                    ? 'Mês 2'
                    : 'Semana 2',
                style: _labelStyle(),
              ),
              Text(
                relatorioSelecionado == 2
                    ? 'Mês 3'
                    : 'Semana 3',
                style: _labelStyle(),
              ),
              Text(
                relatorioSelecionado == 2
                    ? 'Mês 4'
                    : 'Semana 4',
                style: _labelStyle(),
              ),
            ],
          ),
        ],
      ),
    );
  }

  TextStyle _labelStyle() {
    return TextStyle(
      fontSize: 8,
      color: Color(0xFF68736F),
    );
  }

  Widget _buildBotaoExportar() {
    return SizedBox(
      width: double.infinity,
      height: 48,
      child: ElevatedButton.icon(
        onPressed: () {
          ScaffoldMessenger.of(context)
              .showSnackBar(
            const SnackBar(
              content: Text(
                'Relatório preparado para exportação.',
              ),
            ),
          );
        },
        icon: const Icon(
          Icons.download_rounded,
          size: 18,
        ),
        label: const Text(
          'EXPORTAR RELATÓRIO',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.bold,
          ),
        ),
        style: ElevatedButton.styleFrom(
          backgroundColor: verde,
          foregroundColor: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius:
                BorderRadius.circular(14),
          ),
        ),
      ),
    );
  }
}

class _LegendaGrafico extends StatelessWidget {
  final String texto;

  const _LegendaGrafico({
    required this.texto,
  });

  @override
  Widget build(BuildContext context) {
    return Text(
      texto,
      style: TextStyle(
        fontSize: 8,
        color: Color(0xFF68736F),
      ),
    );
  }
}

class _GraficoLinhaPainter
    extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paintLinha = Paint()
      ..color = const Color(0xFF005942)
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    final paintArea = Paint()
      ..color = const Color(0xFF005942)
          .withValues(alpha: 0.12)
      ..style = PaintingStyle.fill;

    final pontos = [
      Offset(
        size.width * 0.00,
        size.height * 0.82,
      ),
      Offset(
        size.width * 0.16,
        size.height * 0.58,
      ),
      Offset(
        size.width * 0.32,
        size.height * 0.70,
      ),
      Offset(
        size.width * 0.48,
        size.height * 0.42,
      ),
      Offset(
        size.width * 0.65,
        size.height * 0.25,
      ),
      Offset(
        size.width * 0.82,
        size.height * 0.23,
      ),
      Offset(
        size.width * 1.00,
        size.height * 0.18,
      ),
    ];

    final caminho = Path();

    caminho.moveTo(
      pontos.first.dx,
      pontos.first.dy,
    );

    for (int i = 1;
        i < pontos.length;
        i++) {
      caminho.lineTo(
        pontos[i].dx,
        pontos[i].dy,
      );
    }

    final area = Path.from(caminho);

    area.lineTo(
      size.width,
      size.height,
    );

    area.lineTo(
      0,
      size.height,
    );

    area.close();

    canvas.drawPath(
      area,
      paintArea,
    );

    canvas.drawPath(
      caminho,
      paintLinha,
    );

    final paintPonto = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;

    final paintBorda = Paint()
      ..color = const Color(0xFF005942)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;

    for (final ponto in pontos) {
      canvas.drawCircle(
        ponto,
        3,
        paintPonto,
      );

      canvas.drawCircle(
        ponto,
        3,
        paintBorda,
      );
    }
  }

  @override
  bool shouldRepaint(
    covariant CustomPainter oldDelegate,
  ) {
    return false;
  }
}

class _GraficoAvaliacaoPainter
    extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final pontos = [
      Offset(
        size.width * 0.03,
        size.height * 0.82,
      ),
      Offset(
        size.width * 0.16,
        size.height * 0.62,
      ),
      Offset(
        size.width * 0.29,
        size.height * 0.72,
      ),
      Offset(
        size.width * 0.43,
        size.height * 0.43,
      ),
      Offset(
        size.width * 0.56,
        size.height * 0.49,
      ),
      Offset(
        size.width * 0.69,
        size.height * 0.28,
      ),
      Offset(
        size.width * 0.82,
        size.height * 0.37,
      ),
      Offset(
        size.width * 0.94,
        size.height * 0.12,
      ),
    ];

    final linha = Paint()
      ..color = const Color(0xFF005942)
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    final caminho = Path();

    caminho.moveTo(
      pontos.first.dx,
      pontos.first.dy,
    );

    for (int i = 1;
        i < pontos.length;
        i++) {
      caminho.lineTo(
        pontos[i].dx,
        pontos[i].dy,
      );
    }

    canvas.drawPath(
      caminho,
      linha,
    );

    final barras = Paint()
      ..color = const Color(0xFF005942)
          .withValues(alpha: 0.28)
      ..style = PaintingStyle.fill;

    for (int i = 0;
        i < pontos.length;
        i++) {
      canvas.drawRect(
        Rect.fromLTWH(
          pontos[i].dx - 3,
          pontos[i].dy,
          6,
          size.height - pontos[i].dy,
        ),
        barras,
      );
    }

    final pontosPaint = Paint()
      ..color = const Color(0xFF005942)
      ..style = PaintingStyle.fill;

    for (final ponto in pontos) {
      canvas.drawCircle(
        ponto,
        3.5,
        pontosPaint,
      );
    }
  }

  @override
  bool shouldRepaint(
    covariant CustomPainter oldDelegate,
  ) {
    return false;
  }
}

class _GraficoBarrasPainter
    extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final valores = [
      0.70,
      0.75,
      0.80,
      0.87,
    ];

    final paint = Paint()
      ..color = const Color(0xFF005942)
      ..style = PaintingStyle.fill;

    const largura = 28.0;

    for (int i = 0;
        i < valores.length;
        i++) {
      final x = (size.width / 4) * i +
          (size.width / 8);

      final altura =
          size.height * valores[i];

      final y =
          size.height - altura;

      canvas.drawRRect(
        RRect.fromRectAndRadius(
          Rect.fromLTWH(
            x - largura / 2,
            y,
            largura,
            altura,
          ),
          const Radius.circular(8),
        ),
        paint,
      );

      final textoPainter = TextPainter(
        text: TextSpan(
          text:
              '${(valores[i] * 100).round()}%',
          style: const TextStyle(
            color: Colors.white,
            fontSize: 9,
            fontWeight: FontWeight.bold,
          ),
        ),
        textDirection:
            TextDirection.ltr,
      );

      textoPainter.layout();

      textoPainter.paint(
        canvas,
        Offset(
          x - textoPainter.width / 2,
          y + 5,
        ),
      );
    }
  }

  @override
  bool shouldRepaint(
    covariant CustomPainter oldDelegate,
  ) {
    return false;
  }
}