import 'package:flutter/material.dart';

import '../../assets/menu_inferior_atleta.dart';
import 'atleta_home_page.dart';
import 'atleta_desempenho_page.dart';
import 'atleta_feed_page.dart';
import 'atleta_perfil_page.dart';
import 'atleta_notificacao_page.dart';

class AtletaTreinoPage extends StatefulWidget {
  const AtletaTreinoPage({super.key});

  @override
  State<AtletaTreinoPage> createState() => _AtletaTreinoPageState();
}

class _AtletaTreinoPageState extends State<AtletaTreinoPage> {
  static const Color verde = Color(0xFF00845F);
  static const Color rosa = Color(0xFFE98BA8);
  static const Color azul = Color(0xFF001E98);
  static const Color fundo = Color(0xFFFCFCFC);

  int filtroSelecionado = 0;

  DateTime mesAtual = DateTime.now();
  DateTime diaSelecionado = DateTime.now();

  int? treinoSelecionado;
  bool mostrandoDetalhes = false;

  final List<String> filtros = [
    'Todos',
    'Pendentes',
    'Concluídos',
  ];

  final List<Map<String, dynamic>> treinos = [
    {
      'categoria': 'Físico',
      'categoriaCor': verde,
      'titulo': 'Treino de velocidade',
      'data': 'Hoje',
      'dataCalendario': null,
      'horario': '17:00',
      'duracao': '45 min',
      'status': 'Pendente',
      'objetivo': 'Melhorar potência e velocidade de deslocamento.',
      'exercicios': [
        {
          'nome': 'Aquecimento',
          'series': '3 × 5-10',
          'descricao': 'Mobilidade geral',
          'icone': Icons.directions_run_rounded,
        },
        {
          'nome': 'Sprint',
          'series': '4 × 50m',
          'descricao': 'Descanso 1 min',
          'icone': Icons.speed_rounded,
        },
        {
          'nome': 'Corrida intervalada',
          'series': '5 × 200m',
          'descricao': 'Descanso 90s',
          'icone': Icons.directions_run_rounded,
        },
      ],
    },
    {
      'categoria': 'Técnico',
      'categoriaCor': azul,
      'titulo': 'Treino de finalização',
      'data': 'Amanhã',
      'dataCalendario': null,
      'horario': '18:00',
      'duracao': '1h',
      'status': 'Pendente',
      'objetivo': 'Aprimorar precisão, controle e finalização.',
      'exercicios': [
        {
          'nome': 'Finalização curta',
          'series': '3 × 10',
          'descricao': 'Chutes próximos à área',
          'icone': Icons.sports_soccer_rounded,
        },
        {
          'nome': 'Finalização em movimento',
          'series': '4 × 8',
          'descricao': 'Recepção e chute',
          'icone': Icons.sports_soccer_rounded,
        },
      ],
    },
    {
      'categoria': 'Tático',
      'categoriaCor': rosa,
      'titulo': 'Treino tático',
      'data': '24/09',
      'dataCalendario': null,
      'horario': '08:00',
      'duracao': '1h 30min',
      'status': 'Concluído',
      'objetivo': 'Trabalhar posicionamento e organização da equipe.',
      'exercicios': [
        {
          'nome': 'Posicionamento',
          'series': '3 × 10',
          'descricao': 'Organização defensiva',
          'icone': Icons.groups_rounded,
        },
        {
          'nome': 'Movimentação',
          'series': '4 × 10',
          'descricao': 'Movimentação coletiva',
          'icone': Icons.groups_rounded,
        },
      ],
    },
  ];

  @override
  void initState() {
    super.initState();

    // Primeiro dia aberto = hoje
    diaSelecionado = DateTime(
      DateTime.now().year,
      DateTime.now().month,
      DateTime.now().day,
    );
  }

  @override
  Widget build(BuildContext context) {
    final treinoDoDia = _getTreinoDoDia(diaSelecionado);

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
          'Meus treinos',
          style: TextStyle(
            color: Colors.black87,
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
              // CABEÇALHO
              _buildHeader(),

              const SizedBox(height: 22),

              // FILTROS
              _buildFiltros(),

              const SizedBox(height: 22),

              // CALENDÁRIO
              _buildCalendario(),

              const SizedBox(height: 24),

              // TREINO DO DIA
              _buildTreinoDoDia(treinoDoDia),

              // DETALHES
              if (mostrandoDetalhes && treinoDoDia != null) ...[
                const SizedBox(height: 18),
                _buildDetalhesTreino(treinoDoDia),
              ],
            ],
          ),
        ),
      ),

      // ========================================================
      // MENU INFERIOR
      // ========================================================
      bottomNavigationBar: MenuInferiorAtleta(
        indiceSelecionado: 1,
        onItemSelecionado: (index) {
          if (index == 0) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => const AtletaHomePage(),
              ),
            );
            return;
          }

          if (index == 1) {
            return;
          }

          if (index == 2) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => const AtletaDesempenhoPage(),
              ),
            );
            return;
          }

          if (index == 3) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => const AtletaFeedPage(),
              ),
            );
            return;
          }

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
  // CABEÇALHO
  // ============================================================

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
              color: Colors.white.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Icon(
              Icons.fitness_center_rounded,
              color: Colors.white,
              size: 27,
            ),
          ),

          const SizedBox(width: 14),

          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Sua rotina de treinos',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 5),
                Text(
                  'Acompanhe seus treinos e exercícios.',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 13,
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
  // FILTROS
  // ============================================================

  Widget _buildFiltros() {
    return SizedBox(
      height: 38,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: filtros.length,
        separatorBuilder: (_, __) {
          return const SizedBox(width: 8);
        },
        itemBuilder: (context, index) {
          final bool selecionado = filtroSelecionado == index;

          return GestureDetector(
            onTap: () {
              setState(() {
                filtroSelecionado = index;
              });
            },
            child: Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 17,
              ),
              decoration: BoxDecoration(
                color: selecionado ? verde : Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: selecionado
                      ? verde
                      : Colors.grey.shade200,
                ),
              ),
              alignment: Alignment.center,
              child: Text(
                filtros[index],
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: selecionado
                      ? FontWeight.w600
                      : FontWeight.w400,
                  color: selecionado
                      ? Colors.white
                      : Colors.grey.shade700,
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  // ============================================================
  // CALENDÁRIO
  // ============================================================

  Widget _buildCalendario() {
    final primeiroDia = DateTime(
      mesAtual.year,
      mesAtual.month,
      1,
    );

    final ultimoDia = DateTime(
      mesAtual.year,
      mesAtual.month + 1,
      0,
    );

    final quantidadeDias = ultimoDia.day;

    // DateTime.weekday:
    // segunda = 1
    // domingo = 7
    final primeiroDiaSemana = primeiroDia.weekday;

    final List<Widget> dias = [];

    // Espaços antes do primeiro dia
    for (int i = 1; i < primeiroDiaSemana; i++) {
      dias.add(const SizedBox());
    }

    for (int dia = 1; dia <= quantidadeDias; dia++) {
      final data = DateTime(
        mesAtual.year,
        mesAtual.month,
        dia,
      );

      dias.add(_buildDiaCalendario(data));
    }

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(16, 18, 16, 18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.035),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          // ======================================================
          // MÊS
          // ======================================================
          Row(
            children: [
              GestureDetector(
                onTap: () {
                  setState(() {
                    mesAtual = DateTime(
                      mesAtual.year,
                      mesAtual.month - 1,
                      1,
                    );
                  });
                },
                child: Container(
                  width: 34,
                  height: 34,
                  decoration: BoxDecoration(
                    color: verde.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(
                    Icons.chevron_left_rounded,
                    color: verde,
                    size: 22,
                  ),
                ),
              ),

              const SizedBox(width: 10),

              Expanded(
                child: Center(
                  child: Text(
                    _nomeMes(mesAtual.month),
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                ),
              ),

              const SizedBox(width: 10),

              GestureDetector(
                onTap: () {
                  setState(() {
                    mesAtual = DateTime(
                      mesAtual.year,
                      mesAtual.month + 1,
                      1,
                    );
                  });
                },
                child: Container(
                  width: 34,
                  height: 34,
                  decoration: BoxDecoration(
                    color: verde.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(
                    Icons.chevron_right_rounded,
                    color: verde,
                    size: 22,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 18),

          // ======================================================
          // DIAS DA SEMANA
          // ======================================================
          Row(
            children: [
              _buildDiaSemana('SEG'),
              _buildDiaSemana('TER'),
              _buildDiaSemana('QUA'),
              _buildDiaSemana('QUI'),
              _buildDiaSemana('SEX'),
              _buildDiaSemana('SÁB'),
              _buildDiaSemana('DOM'),
            ],
          ),

          const SizedBox(height: 8),

          // ======================================================
          // DIAS
          // ======================================================
          GridView.count(
            crossAxisCount: 7,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 7,
            crossAxisSpacing: 4,
            childAspectRatio: 0.88,
            children: dias,
          ),

          const SizedBox(height: 12),

          // ======================================================
          // LEGENDA
          // ======================================================
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 7,
                height: 7,
                decoration: const BoxDecoration(
                  color: verde,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 5),
              Text(
                'Treino programado',
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
  // DIA DO CALENDÁRIO
  // ============================================================

  Widget _buildDiaCalendario(DateTime data) {
    final bool selecionado = _mesmoDia(
      data,
      diaSelecionado,
    );

    final bool hoje = _mesmoDia(
      data,
      DateTime.now(),
    );

    final int? indiceTreino = _getIndiceTreino(data);

    final bool temTreino = indiceTreino != null;

    return GestureDetector(
      onTap: () {
        setState(() {
          diaSelecionado = data;
          treinoSelecionado = indiceTreino;
          mostrandoDetalhes = false;
        });
      },
      child: Container(
        decoration: BoxDecoration(
          color: selecionado
              ? verde
              : hoje
                  ? verde.withValues(alpha: 0.08)
                  : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          border: hoje && !selecionado
              ? Border.all(
                  color: verde.withValues(alpha: 0.35),
                )
              : null,
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              '${data.day}',
              style: TextStyle(
                fontSize: 12,
                fontWeight: selecionado || hoje
                    ? FontWeight.bold
                    : FontWeight.w500,
                color: selecionado
                    ? Colors.white
                    : Colors.black87,
              ),
            ),

            const SizedBox(height: 5),

            Container(
              width: 6,
              height: 6,
              decoration: BoxDecoration(
                color: temTreino
                    ? selecionado
                        ? Colors.white
                        : verde
                    : Colors.transparent,
                shape: BoxShape.circle,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ============================================================
  // DIA DA SEMANA
  // ============================================================

  Widget _buildDiaSemana(String texto) {
    return Expanded(
      child: Center(
        child: Text(
          texto,
          style: TextStyle(
            fontSize: 9,
            fontWeight: FontWeight.w600,
            color: Colors.grey.shade500,
          ),
        ),
      ),
    );
  }

  // ============================================================
  // TREINO DO DIA
  // ============================================================

  Widget _buildTreinoDoDia(
    Map<String, dynamic>? treino,
  ) {
    if (treino == null) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: Colors.grey.shade200,
          ),
        ),
        child: Column(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: Colors.grey.shade100,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(
                Icons.event_available_rounded,
                color: Colors.grey.shade500,
                size: 27,
              ),
            ),

            const SizedBox(height: 12),

            Text(
              _formatarData(diaSelecionado),
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),

            const SizedBox(height: 5),

            Text(
              'Nenhum treino programado para este dia.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey.shade600,
              ),
            ),
          ],
        ),
      );
    }

    final Color cor = treino['categoriaCor'] as Color;
    final bool concluido = treino['status'] == 'Concluído';

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: cor.withValues(alpha: 0.22),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.035),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ======================================================
          // DATA SELECIONADA
          // ======================================================
          Row(
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: verde.withValues(alpha: 0.10),
                  borderRadius: BorderRadius.circular(13),
                ),
                child: const Icon(
                  Icons.calendar_today_rounded,
                  color: verde,
                  size: 21,
                ),
              ),

              const SizedBox(width: 11),

              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _textoDataSelecionada(),
                      style: TextStyle(
                        fontSize: 11,
                        color: Colors.grey.shade600,
                      ),
                    ),
                    const SizedBox(height: 3),
                    const Text(
                      'Treino programado',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 17),

          Divider(
            color: Colors.grey.shade200,
            height: 1,
          ),

          const SizedBox(height: 16),

          // ======================================================
          // TREINO
          // ======================================================
          Row(
            children: [
              Container(
                width: 46,
                height: 46,
                decoration: BoxDecoration(
                  color: cor.withValues(alpha: 0.10),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(
                  treino['categoria'] == 'Tático'
                      ? Icons.groups_rounded
                      : treino['categoria'] == 'Técnico'
                          ? Icons.sports_soccer_rounded
                          : Icons.speed_rounded,
                  color: cor,
                  size: 23,
                ),
              ),

              const SizedBox(width: 12),

              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 9,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: cor.withValues(alpha: 0.10),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        treino['categoria'],
                        style: TextStyle(
                          fontSize: 9,
                          fontWeight: FontWeight.w600,
                          color: cor,
                        ),
                      ),
                    ),

                    const SizedBox(height: 7),

                    Text(
                      treino['titulo'],
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                    ),
                  ],
                ),
              ),

              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 9,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: concluido
                      ? Colors.green.withValues(alpha: 0.10)
                      : Colors.orange.withValues(alpha: 0.10),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  treino['status'],
                  style: TextStyle(
                    fontSize: 9,
                    fontWeight: FontWeight.w600,
                    color: concluido
                        ? Colors.green.shade700
                        : Colors.orange.shade700,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 14),

          // ======================================================
          // HORÁRIO
          // ======================================================
          Row(
            children: [
              Icon(
                Icons.access_time_rounded,
                size: 15,
                color: Colors.grey.shade600,
              ),

              const SizedBox(width: 5),

              Text(
                treino['horario'],
                style: TextStyle(
                  fontSize: 11,
                  color: Colors.grey.shade600,
                ),
              ),

              const SizedBox(width: 14),

              Icon(
                Icons.timelapse_rounded,
                size: 15,
                color: Colors.grey.shade600,
              ),

              const SizedBox(width: 5),

              Text(
                treino['duracao'],
                style: TextStyle(
                  fontSize: 11,
                  color: Colors.grey.shade600,
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // ======================================================
          // BOTÃO VER DETALHES
          // ======================================================
          SizedBox(
            width: double.infinity,
            height: 42,
            child: OutlinedButton(
              onPressed: () {
                setState(() {
                  mostrandoDetalhes = !mostrandoDetalhes;
                });
              },
              style: OutlinedButton.styleFrom(
                foregroundColor: verde,
                side: const BorderSide(
                  color: verde,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(13),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    mostrandoDetalhes
                        ? 'OCULTAR DETALHES'
                        : 'VER DETALHES',
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(width: 5),
                  Icon(
                    mostrandoDetalhes
                        ? Icons.keyboard_arrow_up_rounded
                        : Icons.keyboard_arrow_down_rounded,
                    size: 19,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ============================================================
  // DETALHES DO TREINO
  // ============================================================

  Widget _buildDetalhesTreino(
    Map<String, dynamic> treino,
  ) {
    final bool concluido =
        treino['status'] == 'Concluído';

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.035),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ======================================================
          // TÍTULO
          // ======================================================
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment:
                      CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Treino selecionado',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey.shade600,
                      ),
                    ),

                    const SizedBox(height: 4),

                    Text(
                      treino['titulo'],
                      style: const TextStyle(
                        fontSize: 19,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
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
                  color: concluido
                      ? Colors.green.withValues(alpha: 0.10)
                      : Colors.orange.withValues(alpha: 0.10),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  treino['status'],
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: concluido
                        ? Colors.green.shade700
                        : Colors.orange.shade700,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 18),

          // ======================================================
          // DATA / HORÁRIO / DURAÇÃO
          // ======================================================
          Row(
            children: [
              Expanded(
                child: _buildInfoItem(
                  Icons.calendar_today_rounded,
                  'Data',
                  _formatarData(diaSelecionado),
                ),
              ),

              Expanded(
                child: _buildInfoItem(
                  Icons.access_time_rounded,
                  'Horário',
                  treino['horario'],
                ),
              ),

              Expanded(
                child: _buildInfoItem(
                  Icons.timelapse_rounded,
                  'Duração',
                  treino['duracao'],
                ),
              ),
            ],
          ),

          const SizedBox(height: 20),

          // ======================================================
          // OBJETIVO
          // ======================================================
          const Text(
            'Objetivo',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),

          const SizedBox(height: 5),

          Text(
            treino['objetivo'],
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey.shade600,
              height: 1.4,
            ),
          ),

          const SizedBox(height: 22),

          // ======================================================
          // EXERCÍCIOS
          // ======================================================
          Row(
            children: [
              const Expanded(
                child: Text(
                  'Exercícios',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
              ),

              Text(
                '${treino['exercicios'].length} exercícios',
                style: TextStyle(
                  fontSize: 11,
                  color: Colors.grey.shade600,
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),

          // ======================================================
          // LISTA DE EXERCÍCIOS
          // ======================================================
          ...List.generate(
            (treino['exercicios'] as List).length,
            (index) {
              final exercicio =
                  treino['exercicios'][index];

              return Padding(
                padding: const EdgeInsets.only(
                  bottom: 9,
                ),
                child: _buildExercicio(
                  numero: index + 1,
                  exercicio: exercicio,
                ),
              );
            },
          ),

          const SizedBox(height: 8),

          // ======================================================
          // BOTÃO INICIAR
          // ======================================================
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              onPressed: concluido
                  ? null
                  : () {
                      ScaffoldMessenger.of(context)
                          .showSnackBar(
                        const SnackBar(
                          content:
                              Text('Treino iniciado!'),
                        ),
                      );
                    },
              style: ElevatedButton.styleFrom(
                backgroundColor: verde,
                foregroundColor: Colors.white,
                elevation: 0,
                disabledBackgroundColor:
                    Colors.grey.shade300,
                shape: RoundedRectangleBorder(
                  borderRadius:
                      BorderRadius.circular(14),
                ),
              ),
              child: Text(
                concluido
                    ? 'TREINO CONCLUÍDO'
                    : 'INICIAR TREINO',
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ============================================================
  // ITEM DE INFORMAÇÃO
  // ============================================================

  Widget _buildInfoItem(
    IconData icon,
    String titulo,
    String valor,
  ) {
    return Column(
      crossAxisAlignment:
          CrossAxisAlignment.start,
      children: [
        Icon(
          icon,
          size: 17,
          color: verde,
        ),

        const SizedBox(height: 5),

        Text(
          titulo,
          style: TextStyle(
            fontSize: 10,
            color: Colors.grey.shade500,
          ),
        ),

        const SizedBox(height: 2),

        Text(
          valor,
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: Colors.black87,
          ),
        ),
      ],
    );
  }

  // ============================================================
  // EXERCÍCIO
  // ============================================================

  Widget _buildExercicio({
    required int numero,
    required Map<String, dynamic> exercicio,
  }) {
    return Container(
      padding: const EdgeInsets.all(11),
      decoration: BoxDecoration(
        color: const Color(0xFFF8F9F9),
        borderRadius: BorderRadius.circular(13),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),
      child: Row(
        children: [
          // NÚMERO
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: verde.withValues(alpha: 0.10),
              borderRadius: BorderRadius.circular(10),
            ),
            alignment: Alignment.center,
            child: Text(
              '$numero',
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: verde,
              ),
            ),
          ),

          const SizedBox(width: 11),

          // ÍCONE
          Container(
            width: 35,
            height: 35,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(9),
            ),
            child: Icon(
              exercicio['icone'],
              size: 18,
              color: Colors.black54,
            ),
          ),

          const SizedBox(width: 10),

          // TEXTO
          Expanded(
            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment.start,
              children: [
                Text(
                  exercicio['nome'],
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: Colors.black87,
                  ),
                ),

                const SizedBox(height: 3),

                Text(
                  '${exercicio['series']} • ${exercicio['descricao']}',
                  style: TextStyle(
                    fontSize: 10,
                    color: Colors.grey.shade600,
                  ),
                ),
              ],
            ),
          ),

          const Icon(
            Icons.chevron_right_rounded,
            size: 20,
            color: Colors.grey,
          ),
        ],
      ),
    );
  }

  // ============================================================
  // BUSCAR TREINO DO DIA
  // ============================================================

  Map<String, dynamic>? _getTreinoDoDia(
    DateTime data,
  ) {
    final indice = _getIndiceTreino(data);

    if (indice == null) {
      return null;
    }

    return treinos[indice];
  }

  // ============================================================
  // ÍNDICE DO TREINO
  // ============================================================

  int? _getIndiceTreino(DateTime data) {
    final hoje = DateTime.now();

    final dataHoje = DateTime(
      hoje.year,
      hoje.month,
      hoje.day,
    );

    final dataSelecionada = DateTime(
      data.year,
      data.month,
      data.day,
    );

    // TREINO DE HOJE
    if (_mesmoDia(dataSelecionada, dataHoje)) {
      if (_filtroPermiteTreino(treinos[0])) {
        return 0;
      }
    }

    // TREINO DE AMANHÃ
    final amanha = dataHoje.add(
      const Duration(days: 1),
    );

    if (_mesmoDia(dataSelecionada, amanha)) {
      if (_filtroPermiteTreino(treinos[1])) {
        return 1;
      }
    }

    // TREINO DO DIA 24
    final dia24 = DateTime(
      hoje.year,
      hoje.month,
      24,
    );

    if (_mesmoDia(dataSelecionada, dia24)) {
      if (_filtroPermiteTreino(treinos[2])) {
        return 2;
      }
    }

    return null;
  }

  // ============================================================
  // FILTRO
  // ============================================================

  bool _filtroPermiteTreino(
    Map<String, dynamic> treino,
  ) {
    if (filtroSelecionado == 0) {
      return true;
    }

    if (filtroSelecionado == 1) {
      return treino['status'] != 'Concluído';
    }

    if (filtroSelecionado == 2) {
      return treino['status'] == 'Concluído';
    }

    return true;
  }

  // ============================================================
  // COMPARAR DATAS
  // ============================================================

  bool _mesmoDia(
    DateTime a,
    DateTime b,
  ) {
    return a.year == b.year &&
        a.month == b.month &&
        a.day == b.day;
  }

  // ============================================================
  // NOME DO MÊS
  // ============================================================

  String _nomeMes(int mes) {
    const meses = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];

    return meses[mes - 1];
  }

  // ============================================================
  // DATA FORMATADA
  // ============================================================

  String _formatarData(DateTime data) {
    return '${data.day.toString().padLeft(2, '0')}/'
        '${data.month.toString().padLeft(2, '0')}/'
        '${data.year}';
  }

  // ============================================================
  // TEXTO DA DATA SELECIONADA
  // ============================================================

  String _textoDataSelecionada() {
    final hoje = DateTime.now();

    if (_mesmoDia(diaSelecionado, hoje)) {
      return 'Hoje • ${_formatarData(diaSelecionado)}';
    }

    final amanha = hoje.add(
      const Duration(days: 1),
    );

    if (_mesmoDia(diaSelecionado, amanha)) {
      return 'Amanhã • ${_formatarData(diaSelecionado)}';
    }

    return _formatarData(diaSelecionado);
  }
}