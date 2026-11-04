import 'package:flutter/material.dart';

import 'atleta_notificacao_page.dart';
import '../../theme/sate_theme.dart';

class AtletaTreinoPage extends StatefulWidget {
  const AtletaTreinoPage({super.key});

  @override
  State<AtletaTreinoPage> createState() => _AtletaTreinoPageState();
}

class _AtletaTreinoPageState extends State<AtletaTreinoPage> {
  static const Color verde = Color(0xFF005942);
  static const Color rosa = Color(0xFFEF476F);
  static const Color azul = Color(0xFF003D31);
  static const Color amarelo = Color(0xFFE39B18);
  static const Color fundo = Color(0xFFFAF5EE);

  int filtroSelecionado = 0;

  DateTime mesAtual = DateTime(
    DateTime.now().year,
    DateTime.now().month,
  );

  DateTime diaSelecionado = DateTime(
    DateTime.now().year,
    DateTime.now().month,
    DateTime.now().day,
  );

  bool mostrandoDetalhes = false;

  final List<String> filtros = [
    'Todos',
    'Treinos',
    'Jogos',
    'Reuniões',
  ];

  late final List<Map<String, dynamic>> eventos;

  @override
  void initState() {
    super.initState();

    final hoje = DateTime.now();
    final amanha = hoje.add(const Duration(days: 1));
    final emTresDias = hoje.add(const Duration(days: 3));
    final emCincoDias = hoje.add(const Duration(days: 5));

    eventos = [
      // =========================================
      // TREINO
      // =========================================
      {
        'tipo': 'treino',
        'tipoLabel': 'Treino',
        'tipoCor': verde,
        'categoria': 'Físico',
        'titulo': 'Treino de velocidade',
        'data': hoje,
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

      // =========================================
      // TREINO
      // =========================================
      {
        'tipo': 'treino',
        'tipoLabel': 'Treino',
        'tipoCor': verde,
        'categoria': 'Técnico',
        'titulo': 'Treino de finalização',
        'data': amanha,
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

      // =========================================
      // JOGO
      // =========================================
      {
        'tipo': 'jogo',
        'tipoLabel': 'Jogo',
        'tipoCor': amarelo,
        'categoria': 'Amistoso',
        'titulo': 'Jogo amistoso vs Águias FC',
        'data': emTresDias,
        'horario': '10:00',
        'duracao': '2h',
        'status': 'Agendado',
        'objetivo': 'Aplicar em jogo o que foi treinado na semana.',
        'local': 'Estádio Municipal',
        'exercicios': [],
      },

      // =========================================
      // REUNIÃO
      // =========================================
      {
        'tipo': 'reuniao',
        'tipoLabel': 'Reunião',
        'tipoCor': azul,
        'categoria': 'Reunião',
        'titulo': 'Reunião com comissão técnica',
        'data': emCincoDias,
        'horario': '14:00',
        'duracao': '1h',
        'status': 'Agendado',
        'objetivo': 'Alinhar estratégia e objetivos da próxima semana.',
        'local': 'Sala da comissão',
        'exercicios': [],
      },
    ];
  }

  @override
  Widget build(BuildContext context) {
    final eventoDoDia = _getEventoDoDia(diaSelecionado);

    return Scaffold(
      backgroundColor: fundo,
      appBar: AppBar(
        backgroundColor: fundo,
        elevation: 0,
        centerTitle: false,
        title: const Text.rich(
          TextSpan(children: [TextSpan(text: 'Agenda', style: SateEstilo.destaque)]),
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
                  builder: (_) => const AtletaNotificacaoPage(),
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
          padding: const EdgeInsets.fromLTRB(16, 4, 16, 30),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(),

              const SizedBox(height: 22),

              _buildFiltros(),

              const SizedBox(height: 22),

              _buildCalendario(),

              const SizedBox(height: 24),

              _buildEventoDoDia(eventoDoDia),

              if (mostrandoDetalhes && eventoDoDia != null) ...[
                const SizedBox(height: 18),
                _buildDetalhesEvento(eventoDoDia),
              ],
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
              color: Colors.white.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Icon(
              Icons.event_rounded,
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
                  'Agenda da equipe',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 5),
                Text(
                  'Treinos, jogos e reuniões da sua equipe.',
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

  Widget _buildFiltros() {
    return SizedBox(
      height: 38,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: filtros.length,
        separatorBuilder: (_, _) {
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
                  color: selecionado ? verde : Color(0xFFE8DFD3),
                ),
              ),
              alignment: Alignment.center,
              child: Text(
                filtros[index],
                style: TextStyle(
                  fontSize: 12,
                  fontWeight:
                      selecionado ? FontWeight.w600 : FontWeight.w400,
                  color: selecionado ? Colors.white : Color(0xFF4F5A56),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildCalendario() {
    final primeiroDia = DateTime(mesAtual.year, mesAtual.month, 1);
    final ultimoDia = DateTime(mesAtual.year, mesAtual.month + 1, 0);

    final quantidadeDias = ultimoDia.day;
    final primeiroDiaSemana = primeiroDia.weekday;

    final List<Widget> dias = [];

    for (int i = 1; i < primeiroDiaSemana; i++) {
      dias.add(const SizedBox());
    }

    for (int dia = 1; dia <= quantidadeDias; dia++) {
      final data = DateTime(mesAtual.year, mesAtual.month, dia);
      dias.add(_buildDiaCalendario(data));
    }

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(16, 18, 16, 18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: Color(0xFFE8DFD3)),
        boxShadow: [
          BoxShadow(
            color: Color(0xFF10251F).withValues(alpha: 0.035),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
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
                    '${_nomeMes(mesAtual.month)} ${mesAtual.year}',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF10251F),
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

          GridView.count(
            crossAxisCount: 7,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 7,
            crossAxisSpacing: 4,
            childAspectRatio: 0.88,
            children: dias,
          ),

          const SizedBox(height: 14),

          // LEGENDA
          Wrap(
            spacing: 14,
            runSpacing: 8,
            alignment: WrapAlignment.center,
            children: [
              _buildLegendaItem('Treino', verde),
              _buildLegendaItem('Jogo', amarelo),
              _buildLegendaItem('Reunião', azul),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLegendaItem(String texto, Color cor) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 7,
          height: 7,
          decoration: BoxDecoration(
            color: cor,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 5),
        Text(
          texto,
          style: TextStyle(
            fontSize: 10,
            color: Color(0xFF68736F),
          ),
        ),
      ],
    );
  }

  Widget _buildDiaCalendario(DateTime data) {
    final bool selecionado = _mesmoDia(data, diaSelecionado);
    final bool hoje = _mesmoDia(data, DateTime.now());
    final Color? corEvento = _corEventoDoDia(data);

    return GestureDetector(
      onTap: () {
        setState(() {
          diaSelecionado = data;
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
                fontWeight:
                    selecionado || hoje ? FontWeight.bold : FontWeight.w500,
                color: selecionado ? Colors.white : Color(0xFF10251F),
              ),
            ),
            const SizedBox(height: 5),
            Container(
              width: 6,
              height: 6,
              decoration: BoxDecoration(
                color: corEvento == null
                    ? Colors.transparent
                    : selecionado
                        ? Colors.white
                        : corEvento,
                shape: BoxShape.circle,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDiaSemana(String texto) {
    return Expanded(
      child: Center(
        child: Text(
          texto,
          style: TextStyle(
            fontSize: 9,
            fontWeight: FontWeight.w600,
            color: Color(0xFF8A938F),
          ),
        ),
      ),
    );
  }

  Widget _buildEventoDoDia(Map<String, dynamic>? evento) {
    if (evento == null) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Color(0xFFE8DFD3)),
        ),
        child: Column(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: Color(0xFFEFE6DA),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(
                Icons.event_available_rounded,
                color: Color(0xFF8A938F),
                size: 27,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              _formatarData(diaSelecionado),
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Color(0xFF10251F),
              ),
            ),
            const SizedBox(height: 5),
            Text(
              'Nenhum evento programado para este dia.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 12,
                color: Color(0xFF68736F),
              ),
            ),
          ],
        ),
      );
    }

    final Color cor = evento['tipoCor'] as Color;
    final bool concluido = evento['status'] == 'Concluído';

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: cor.withValues(alpha: 0.22)),
        boxShadow: [
          BoxShadow(
            color: Color(0xFF10251F).withValues(alpha: 0.035),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
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
                        color: Color(0xFF68736F),
                      ),
                    ),
                    const SizedBox(height: 3),
                    const Text(
                      'Evento programado',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF10251F),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 17),

          Divider(color: Color(0xFFE8DFD3), height: 1),

          const SizedBox(height: 16),

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
                  _iconeTipo(evento['tipo']),
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
                        evento['tipoLabel'],
                        style: TextStyle(
                          fontSize: 9,
                          fontWeight: FontWeight.w600,
                          color: cor,
                        ),
                      ),
                    ),
                    const SizedBox(height: 7),
                    Text(
                      evento['titulo'],
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF10251F),
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
                      ? Color(0xFF005942).withValues(alpha: 0.10)
                      : Color(0xFFE39B18).withValues(alpha: 0.10),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  evento['status'],
                  style: TextStyle(
                    fontSize: 9,
                    fontWeight: FontWeight.w600,
                    color: concluido
                        ? Color(0xFF005942)
                        : Color(0xFFC9830F),
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 14),

          Row(
            children: [
              Icon(
                Icons.access_time_rounded,
                size: 15,
                color: Color(0xFF68736F),
              ),
              const SizedBox(width: 5),
              Text(
                evento['horario'],
                style: TextStyle(
                  fontSize: 11,
                  color: Color(0xFF68736F),
                ),
              ),
              const SizedBox(width: 14),
              Icon(
                Icons.timelapse_rounded,
                size: 15,
                color: Color(0xFF68736F),
              ),
              const SizedBox(width: 5),
              Text(
                evento['duracao'],
                style: TextStyle(
                  fontSize: 11,
                  color: Color(0xFF68736F),
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

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
                side: const BorderSide(color: verde),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(13),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    mostrandoDetalhes ? 'OCULTAR DETALHES' : 'VER DETALHES',
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

  Widget _buildDetalhesEvento(Map<String, dynamic> evento) {
    final bool concluido = evento['status'] == 'Concluído';
    final bool isJogo = evento['tipo'] == 'jogo';
    final bool isReuniao = evento['tipo'] == 'reuniao';
    final List exercicios = evento['exercicios'] ?? [];

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Color(0xFFE8DFD3)),
        boxShadow: [
          BoxShadow(
            color: Color(0xFF10251F).withValues(alpha: 0.035),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Evento selecionado',
                      style: TextStyle(
                        fontSize: 12,
                        color: Color(0xFF68736F),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      evento['titulo'],
                      style: const TextStyle(
                        fontSize: 19,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF10251F),
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
                      ? Color(0xFF005942).withValues(alpha: 0.10)
                      : Color(0xFFE39B18).withValues(alpha: 0.10),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  evento['status'],
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: concluido
                        ? Color(0xFF005942)
                        : Color(0xFFC9830F),
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 18),

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
                  evento['horario'],
                ),
              ),
              Expanded(
                child: _buildInfoItem(
                  Icons.timelapse_rounded,
                  'Duração',
                  evento['duracao'],
                ),
              ),
            ],
          ),

          if (isJogo || isReuniao) ...[
            const SizedBox(height: 14),
            Row(
              children: [
                Expanded(
                  child: _buildInfoItem(
                    Icons.location_on_outlined,
                    'Local',
                    evento['local'] ?? 'Não informado',
                  ),
                ),
              ],
            ),
          ],

          const SizedBox(height: 20),

          const Text(
            'Objetivo',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Color(0xFF10251F),
            ),
          ),

          const SizedBox(height: 5),

          Text(
            evento['objetivo'],
            style: TextStyle(
              fontSize: 12,
              color: Color(0xFF68736F),
              height: 1.4,
            ),
          ),

          if (exercicios.isNotEmpty) ...[
            const SizedBox(height: 22),
            Row(
              children: [
                const Expanded(
                  child: Text(
                    'Exercícios',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF10251F),
                    ),
                  ),
                ),
                Text(
                  '${exercicios.length} exercícios',
                  style: TextStyle(
                    fontSize: 11,
                    color: Color(0xFF68736F),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 12),

            ...List.generate(
              exercicios.length,
              (index) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 9),
                  child: _buildExercicio(
                    numero: index + 1,
                    exercicio: exercicios[index],
                  ),
                );
              },
            ),
          ],

          const SizedBox(height: 8),

          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              onPressed: concluido
                  ? null
                  : () {
                      final String texto = isJogo
                          ? 'Confirmação de presença enviada!'
                          : isReuniao
                              ? 'Presença confirmada!'
                              : 'Treino iniciado!';

                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(texto)),
                      );
                    },
              style: ElevatedButton.styleFrom(
                backgroundColor: verde,
                foregroundColor: Colors.white,
                elevation: 0,
                disabledBackgroundColor: Color(0xFFD5C9BA),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
              child: Text(
                concluido
                    ? 'CONCLUÍDO'
                    : isJogo
                        ? 'CONFIRMAR PRESENÇA'
                        : isReuniao
                            ? 'CONFIRMAR PARTICIPAÇÃO'
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

  Widget _buildInfoItem(IconData icon, String titulo, String valor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 17, color: verde),
        const SizedBox(height: 5),
        Text(
          titulo,
          style: TextStyle(
            fontSize: 10,
            color: Color(0xFF8A938F),
          ),
        ),
        const SizedBox(height: 2),
        Text(
          valor,
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: Color(0xFF10251F),
          ),
        ),
      ],
    );
  }

  Widget _buildExercicio({
    required int numero,
    required Map<String, dynamic> exercicio,
  }) {
    return Container(
      padding: const EdgeInsets.all(11),
      decoration: BoxDecoration(
        color: const Color(0xFFEFE6DA),
        borderRadius: BorderRadius.circular(13),
        border: Border.all(color: Color(0xFFE8DFD3)),
      ),
      child: Row(
        children: [
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
              color: Color(0xFF68736F),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  exercicio['nome'],
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF10251F),
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  '${exercicio['series']} • ${exercicio['descricao']}',
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

  // ============================================================
  // LÓGICA
  // ============================================================

  Map<String, dynamic>? _getEventoDoDia(DateTime data) {
    for (final evento in eventos) {
      final dataEvento = evento['data'] as DateTime;
      if (_mesmoDia(dataEvento, data) && _filtroPermiteEvento(evento)) {
        return evento;
      }
    }
    return null;
  }

  /// Retorna a cor do evento daquele dia (pra bolinha do calendário).
  /// Se tiver mais de um, prioriza: jogo > treino > reunião.
  Color? _corEventoDoDia(DateTime data) {
    Map<String, dynamic>? encontrado;

    for (final evento in eventos) {
      final dataEvento = evento['data'] as DateTime;
      if (_mesmoDia(dataEvento, data)) {
        if (encontrado == null) {
          encontrado = evento;
        } else {
          // Prioridade: jogo > treino > reunião
          final atual = encontrado['tipo'];
          final novo = evento['tipo'];

          if (novo == 'jogo') {
            encontrado = evento;
          } else if (novo == 'treino' && atual != 'jogo') {
            encontrado = evento;
          }
        }
      }
    }

    return encontrado == null ? null : encontrado['tipoCor'] as Color;
  }

  bool _filtroPermiteEvento(Map<String, dynamic> evento) {
    if (filtroSelecionado == 0) return true;
    if (filtroSelecionado == 1) return evento['tipo'] == 'treino';
    if (filtroSelecionado == 2) return evento['tipo'] == 'jogo';
    if (filtroSelecionado == 3) return evento['tipo'] == 'reuniao';
    return true;
  }

  IconData _iconeTipo(String tipo) {
    switch (tipo) {
      case 'jogo':
        return Icons.emoji_events_rounded;
      case 'reuniao':
        return Icons.groups_rounded;
      default:
        return Icons.fitness_center_rounded;
    }
  }

  bool _mesmoDia(DateTime a, DateTime b) {
    return a.year == b.year && a.month == b.month && a.day == b.day;
  }

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

  String _formatarData(DateTime data) {
    return '${data.day.toString().padLeft(2, '0')}/'
        '${data.month.toString().padLeft(2, '0')}/'
        '${data.year}';
  }

  String _textoDataSelecionada() {
    final hoje = DateTime.now();

    if (_mesmoDia(diaSelecionado, hoje)) {
      return 'Hoje • ${_formatarData(diaSelecionado)}';
    }

    final amanha = hoje.add(const Duration(days: 1));

    if (_mesmoDia(diaSelecionado, amanha)) {
      return 'Amanhã • ${_formatarData(diaSelecionado)}';
    }

    return _formatarData(diaSelecionado);
  }
}