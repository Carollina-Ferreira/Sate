import 'package:flutter/material.dart';

import '../../assets/menu_inferior_atleta.dart';
import 'atleta_home_page.dart';
import 'atleta_treino_page.dart';
import 'atleta_feed_page.dart';
import 'atleta_perfil_page.dart';
import 'atleta_notificacao_page.dart';

class AtletaDesempenhoPage extends StatefulWidget {
  const AtletaDesempenhoPage({super.key});

  @override
  State<AtletaDesempenhoPage> createState() => _AtletaDesempenhoPageState();
}

class _AtletaDesempenhoPageState extends State<AtletaDesempenhoPage> {
  static const Color verde = Color(0xFF00845F);
  static const Color verdeClaro = Color(0xFFE7F5F0);
  static const Color fundo = Color(0xFFF8F8F8);

  int periodoSelecionado = 0;
  int relatorioSelecionado = 1;

  final List<String> periodos = ['Todos', 'Mês', 'Ano'];

  final List<String> relatorios = ['Semanal', 'Mensal', 'Anual'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: fundo,

      // ========================================================
      // APP BAR
      // ========================================================

      appBar: AppBar(
        backgroundColor: fundo,
        elevation: 0,
        centerTitle: false,

        title: const Text(
          'Minha evolução',
          style: TextStyle(
            color: Colors.black87,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),

        actions: [
          IconButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const AtletaNotificacaoPage(),
                ),
              );
            },
            icon: const Icon(
              Icons.notifications_none_rounded,
              color: Colors.black87,
              size: 26,
            ),
          ),
        ],
      ),

      // ========================================================
      // CONTEÚDO
      // ========================================================

      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 4, 16, 30),

          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,

            children: [
              // ==================================================
              // FILTRO PRINCIPAL
              // ==================================================

              _buildPeriodo(),

              const SizedBox(height: 22),

              // ==================================================
              // SEÇÃO DESEMPENHO
              // ==================================================

              const Text(
                'Seu desempenho',
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),

              const SizedBox(height: 10),

              _buildGraficoDesempenho(),

              const SizedBox(height: 22),

              // ==================================================
              // FREQUÊNCIA
              // ==================================================

              const Text(
                'Frequência mensal',
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),

              const SizedBox(height: 10),

              _buildGraficoFrequencia(),

              const SizedBox(height: 10),

              // ==================================================
              // CARDS RESUMO
              // ==================================================

              Row(
                children: [
                  Expanded(
                    child: _buildResumoCard(
                      titulo: 'Treinos realizados',
                      valor: '47',
                      icone: Icons.fitness_center_rounded,
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

              // ==================================================
              // AVALIAÇÃO FÍSICA
              // ==================================================

              Row(
                children: [
                  const Expanded(
                    child: Text(
                      'Avaliação física',
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
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

              // ==================================================
              // ÚLTIMAS AVALIAÇÕES
              // ==================================================

              const Text(
                'Últimas avaliações',
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),

              const SizedBox(height: 10),

              _buildUltimasAvaliacoes(),

              const SizedBox(height: 24),

              // ==================================================
              // HISTÓRICO RECENTE
              // ==================================================

              const Text(
                'Histórico recente',
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),

              const SizedBox(height: 10),

              _buildHistorico(),

              const SizedBox(height: 24),

              // ==================================================
              // RELATÓRIOS
              // ==================================================

              const Text(
                'Relatórios',
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
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

      // ========================================================
      // MENU INFERIOR
      // ========================================================

      bottomNavigationBar: MenuInferiorAtleta(
        indiceSelecionado: 2,

        onItemSelecionado: (index) {
          // INÍCIO
          if (index == 0) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => const AtletaHomePage(),
              ),
            );
            return;
          }

          // TREINO
          if (index == 1) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => const AtletaTreinoPage(),
              ),
            );
            return;
          }

          // DESEMPENHO
          if (index == 2) {
            return;
          }

          // FEED
          if (index == 3) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => const AtletaFeedPage(),
              ),
            );
            return;
          }

          // PERFIL
          if (index == 4) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => const AtletaPerfilPage(),
              ),
            );
            return;
          }
        },
      ),
    );
  }

  // ============================================================
  // PERÍODO
  // ============================================================

  Widget _buildPeriodo() {
    return Container(
      height: 38,

      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),

      child: Row(
        children: List.generate(
          periodos.length,
          (index) {
            final selecionado = periodoSelecionado == index;

            return Expanded(
              child: GestureDetector(
                onTap: () {
                  setState(() {
                    periodoSelecionado = index;
                  });
                },

                child: Container(
                  margin: const EdgeInsets.all(3),

                  decoration: BoxDecoration(
                    color: selecionado
                        ? verde
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(18),
                  ),

                  alignment: Alignment.center,

                  child: Text(
                    periodos[index],
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: selecionado
                          ? FontWeight.w600
                          : FontWeight.w400,
                      color: selecionado
                          ? Colors.white
                          : Colors.grey.shade700,
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  // ============================================================
  // GRÁFICO DE DESEMPENHO
  // ============================================================

  Widget _buildGraficoDesempenho() {
    return Container(
      height: 185,
      width: double.infinity,

      padding: const EdgeInsets.fromLTRB(
        10,
        12,
        10,
        8,
      ),

      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
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
            mainAxisAlignment: MainAxisAlignment.spaceAround,

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

  // ============================================================
  // GRÁFICO DE FREQUÊNCIA
  // ============================================================

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
      height: 165,

      padding: const EdgeInsets.fromLTRB(
        18,
        15,
        18,
        10,
      ),

      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),

      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        mainAxisAlignment: MainAxisAlignment.spaceAround,

        children: List.generate(
          valores.length,
          (index) {
            return Column(
              mainAxisAlignment: MainAxisAlignment.end,

              children: [
                Container(
                  width: 22,
                  height: 105 * valores[index],

                  decoration: BoxDecoration(
                    color: Colors.blue.shade400,
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),

                const SizedBox(height: 8),

                Text(
                  meses[index],
                  style: TextStyle(
                    fontSize: 10,
                    color: Colors.grey.shade600,
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  // ============================================================
  // CARD RESUMO
  // ============================================================

  Widget _buildResumoCard({
    required String titulo,
    required String valor,
    required IconData icone,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),

      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),

      child: Row(
        children: [
          Container(
            width: 35,
            height: 35,

            decoration: BoxDecoration(
              color: verdeClaro,
              borderRadius: BorderRadius.circular(10),
            ),

            child: Icon(
              icone,
              size: 18,
              color: verde,
            ),
          ),

          const SizedBox(width: 9),

          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,

              children: [
                Text(
                  titulo,
                  maxLines: 2,

                  style: TextStyle(
                    fontSize: 9,
                    color: Colors.grey.shade600,
                  ),
                ),

                const SizedBox(height: 2),

                Text(
                  valor,

                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: titulo == 'Metas atingidas'
                        ? Colors.red.shade400
                        : verde,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ============================================================
  // AVALIAÇÃO FÍSICA
  // ============================================================

  Widget _buildAvaliacaoFisica() {
    return Container(
      padding: const EdgeInsets.all(14),

      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),

      child: Column(
        children: [
          Row(
            children: [
              const Expanded(
                child: Text(
                  'Condição geral',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),

              Text(
                '+12%',
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.bold,
                  color: verde,
                ),
              ),
            ],
          ),

          const SizedBox(height: 10),

          SizedBox(
            height: 120,

            child: CustomPaint(
              painter: _GraficoAvaliacaoPainter(),
              child: Container(),
            ),
          ),

          const Divider(height: 25),

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
            color: Colors.grey.shade600,
          ),
        ),

        const SizedBox(height: 7),

        Text(
          valor,

          style: const TextStyle(
            fontSize: 19,
            fontWeight: FontWeight.bold,
          ),
        ),

        const SizedBox(height: 3),

        Text(
          legenda,
          textAlign: TextAlign.center,

          style: TextStyle(
            fontSize: 9,
            color: legenda == 'Ideal' || legenda == 'Normal'
                ? verde
                : Colors.grey.shade500,
          ),
        ),
      ],
    );
  }

  Widget _buildDivisor() {
    return Container(
      width: 1,
      height: 65,
      color: Colors.grey.shade200,
    );
  }

  // ============================================================
  // ÚLTIMAS AVALIAÇÕES
  // ============================================================

  Widget _buildUltimasAvaliacoes() {
    final avaliacoes = [
      ['29/05/2026', 'Excelente'],
      ['22/05/2026', 'Boa'],
      ['15/05/2026', 'Boa'],
    ];

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),

      child: Column(
        children: List.generate(
          avaliacoes.length,
          (index) {
            final avaliacao = avaliacoes[index];

            return Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 13,
                vertical: 12,
              ),

              decoration: BoxDecoration(
                border: index != avaliacoes.length - 1
                    ? Border(
                        bottom: BorderSide(
                          color: Colors.grey.shade200,
                        ),
                      )
                    : null,
              ),

              child: Row(
                children: [
                  Icon(
                    Icons.assignment_turned_in_outlined,
                    size: 19,
                    color: Colors.grey.shade600,
                  ),

                  const SizedBox(width: 10),

                  Expanded(
                    child: Text(
                      avaliacao[0],

                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),

                  Text(
                    avaliacao[1],

                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      color: verde,
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

  // ============================================================
  // HISTÓRICO
  // ============================================================

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
      padding: const EdgeInsets.all(12),

      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),

      child: Row(
        children: [
          Container(
            width: 32,
            height: 32,

            decoration: BoxDecoration(
              color: Colors.green.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(9),
            ),

            child: Icon(
              Icons.check_rounded,
              color: Colors.green.shade600,
              size: 20,
            ),
          ),

          const SizedBox(width: 11),

          Column(
            crossAxisAlignment: CrossAxisAlignment.start,

            children: [
              Text(
                titulo,

                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),

              const SizedBox(height: 2),

              Text(
                data,

                style: TextStyle(
                  fontSize: 10,
                  color: Colors.grey.shade600,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ============================================================
  // RELATÓRIOS
  // ============================================================

  Widget _buildRelatorios() {
    return Container(
      height: 40,

      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),

      child: Row(
        children: List.generate(
          relatorios.length,
          (index) {
            final selecionado =
                relatorioSelecionado == index;

            return Expanded(
              child: GestureDetector(
                onTap: () {
                  setState(() {
                    relatorioSelecionado = index;
                  });
                },

                child: Container(
                  margin: const EdgeInsets.all(3),

                  decoration: BoxDecoration(
                    color: selecionado
                        ? verde
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(18),
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
                          : Colors.grey.shade700,
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  // ============================================================
  // GRÁFICO DO RELATÓRIO
  // ============================================================

  Widget _buildGraficoRelatorio() {
    return Container(
      height: 205,

      padding: const EdgeInsets.all(15),

      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),

      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,

        children: [
          Text(
            relatorioSelecionado == 0
                ? 'Desempenho semanal'
                : relatorioSelecionado == 1
                    ? 'Desempenho mensal'
                    : 'Desempenho anual',

            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
            ),
          ),

          const SizedBox(height: 10),

          Expanded(
            child: CustomPaint(
              painter: _GraficoBarrasPainter(),
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
      color: Colors.grey.shade600,
    );
  }

  // ============================================================
  // BOTÃO EXPORTAR
  // ============================================================

  Widget _buildBotaoExportar() {
    return SizedBox(
      width: double.infinity,
      height: 47,

      child: ElevatedButton.icon(
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
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
            borderRadius: BorderRadius.circular(14),
          ),
        ),
      ),
    );
  }
}

// ================================================================
// LEGENDA DO GRÁFICO
// ================================================================

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
        color: Colors.grey.shade600,
      ),
    );
  }
}

// ================================================================
// PAINTER - GRÁFICO DE LINHA
// ================================================================

class _GraficoLinhaPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paintLinha = Paint()
      ..color = const Color(0xFF16B86F)
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    final paintArea = Paint()
      ..color = const Color(0xFF16B86F)
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

    for (int i = 1; i < pontos.length; i++) {
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
      ..color = const Color(0xFF16B86F)
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

// ================================================================
// PAINTER - GRÁFICO DE AVALIAÇÃO
// ================================================================

class _GraficoAvaliacaoPainter extends CustomPainter {
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
      ..color = const Color(0xFF00845F)
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    final caminho = Path();

    caminho.moveTo(
      pontos.first.dx,
      pontos.first.dy,
    );

    for (int i = 1; i < pontos.length; i++) {
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
      ..color = const Color(0xFF00845F)
          .withValues(alpha: 0.28)
      ..style = PaintingStyle.fill;

    for (int i = 0; i < pontos.length; i++) {
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
      ..color = const Color(0xFF00845F)
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

// ================================================================
// PAINTER - GRÁFICO DE BARRAS
// ================================================================

class _GraficoBarrasPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final valores = [
      0.70,
      0.75,
      0.80,
      0.87,
    ];

    final paint = Paint()
      ..color = const Color(0xFF00845F)
      ..style = PaintingStyle.fill;

    final largura = 28.0;

    for (int i = 0; i < valores.length; i++) {
      final x = (size.width / 4) * i +
          (size.width / 8);

      final altura = size.height * valores[i];

      final y = size.height - altura;

      canvas.drawRect(
        Rect.fromLTWH(
          x - largura / 2,
          y,
          largura,
          altura,
        ),
        paint,
      );

      final textoPainter = TextPainter(
        text: TextSpan(
          text: '${(valores[i] * 100).round()}%',
          style: const TextStyle(
            color: Colors.white,
            fontSize: 9,
            fontWeight: FontWeight.bold,
          ),
        ),
        textDirection: TextDirection.ltr,
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