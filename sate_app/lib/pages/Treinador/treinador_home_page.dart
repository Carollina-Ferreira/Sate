import 'package:flutter/material.dart';

import '../../assets/cabecalho_treinador.dart';

class TreinadorHomePage extends StatelessWidget {
  const TreinadorHomePage({super.key});

  static const Color verde = Color(0xFF006B4F);
  static const Color verdeEscuro = Color(0xFF004D3A);
  static const Color verdeClaro = Color(0xFFE8F5F0);
  static const Color fundo = Color(0xFFF4F8F6);
  static const Color texto = Color(0xFF12261F);
  static const Color textoSecundario = Color(0xFF68736F);
  static const Color linha = Color(0xFFDCE7E2);
  static const Color rosa = Color(0xFFE98BA8);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: fundo,
      body: Column(
        children: [
          const CabecalhoTreinador(
            titulo: 'Professor Marcos!',
            subtitulo: 'Olá,',
          ),

          Expanded(
            child: Container(
              width: double.infinity,
              decoration: const BoxDecoration(
                color: fundo,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(32),
                  topRight: Radius.circular(32),
                ),
              ),
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.fromLTRB(
                  20,
                  24,
                  20,
                  40,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _saudacao(),

                    const SizedBox(height: 24),

                    _tituloSecao('Visão geral'),

                    const SizedBox(height: 12),

                    _resumoEquipe(),

                    const SizedBox(height: 28),

                    _tituloSecao('Próximo treino'),

                    const SizedBox(height: 12),

                    _proximoTreino(),

                    const SizedBox(height: 28),

                    _tituloSecao('Desempenho da equipe'),

                    const SizedBox(height: 12),

                    _graficoDesempenho(),

                    const SizedBox(height: 28),

                    _atividadeRecente(),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // =========================================================
  // SAUDAÇÃO
  // =========================================================

  Widget _saudacao() {
    return Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Bom dia, Professor! 👋',
                style: TextStyle(
                  fontSize: 21,
                  fontWeight: FontWeight.w700,
                  color: texto,
                ),
              ),

              const SizedBox(height: 5),

              const Text(
                'Acompanhe o desempenho da sua equipe.',
                style: TextStyle(
                  fontSize: 13,
                  color: textoSecundario,
                  fontWeight: FontWeight.w400,
                ),
              ),
            ],
          ),
        ),

        Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            color: verdeClaro,
            borderRadius: BorderRadius.circular(14),
          ),
          child: const Icon(
            Icons.insights_rounded,
            color: verde,
            size: 22,
          ),
        ),
      ],
    );
  }

  // =========================================================
  // TÍTULO
  // =========================================================

  Widget _tituloSecao(String titulo) {
    return Text(
      titulo,
      style: const TextStyle(
        fontSize: 17,
        fontWeight: FontWeight.w700,
        color: texto,
      ),
    );
  }

  // =========================================================
  // RESUMO DA EQUIPE
  // =========================================================

  Widget _resumoEquipe() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: linha,
          width: 1,
        ),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: _indicador(
                  icone: Icons.groups_rounded,
                  titulo: 'Atletas',
                  valor: '24',
                ),
              ),

              Container(
                width: 1,
                height: 52,
                color: linha,
              ),

              Expanded(
                child: _indicador(
                  icone: Icons.event_available_rounded,
                  titulo: 'Frequência',
                  valor: '88%',
                ),
              ),
            ],
          ),

          const SizedBox(height: 18),

          Container(
            height: 1,
            color: linha,
          ),

          const SizedBox(height: 18),

          Row(
            children: [
              Expanded(
                child: _indicador(
                  icone: Icons.fitness_center_rounded,
                  titulo: 'Treinos/semana',
                  valor: '6',
                ),
              ),

              Container(
                width: 1,
                height: 52,
                color: linha,
              ),

              Expanded(
                child: _indicador(
                  icone: Icons.trending_up_rounded,
                  titulo: 'Desempenho',
                  valor: '+9%',
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _indicador({
    required IconData icone,
    required String titulo,
    required String valor,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10),
      child: Row(
        children: [
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              color: verdeClaro,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              icone,
              color: verde,
              size: 20,
            ),
          ),

          const SizedBox(width: 10),

          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  titulo,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 11,
                    color: textoSecundario,
                    fontWeight: FontWeight.w500,
                  ),
                ),

                const SizedBox(height: 3),

                Text(
                  valor,
                  style: const TextStyle(
                    fontSize: 21,
                    fontWeight: FontWeight.w700,
                    color: texto,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // =========================================================
  // PRÓXIMO TREINO
  // =========================================================

  Widget _proximoTreino() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: linha,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 45,
                height: 45,
                decoration: BoxDecoration(
                  color: verdeClaro,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Icon(
                  Icons.sports_rounded,
                  color: verde,
                  size: 23,
                ),
              ),

              const SizedBox(width: 12),

              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Próximo treino',
                      style: TextStyle(
                        fontSize: 11,
                        color: textoSecundario,
                        fontWeight: FontWeight.w500,
                      ),
                    ),

                    SizedBox(height: 3),

                    Text(
                      'Resistência aeróbica',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 16,
                        color: texto,
                        fontWeight: FontWeight.w700,
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
                  color: const Color(0xFFF8EAF0),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text(
                  'Agendado',
                  style: TextStyle(
                    color: Color(0xFF9B5377),
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 18),

          Container(
            height: 1,
            color: linha,
          ),

          const SizedBox(height: 15),

          Row(
            children: [
              const Icon(
                Icons.calendar_today_outlined,
                size: 16,
                color: textoSecundario,
              ),

              const SizedBox(width: 7),

              const Text(
                'Qua, 27/08',
                style: TextStyle(
                  fontSize: 12,
                  color: textoSecundario,
                  fontWeight: FontWeight.w500,
                ),
              ),

              const SizedBox(width: 20),

              Container(
                width: 4,
                height: 4,
                decoration: const BoxDecoration(
                  color: linha,
                  shape: BoxShape.circle,
                ),
              ),

              const SizedBox(width: 20),

              const Icon(
                Icons.access_time_rounded,
                size: 17,
                color: textoSecundario,
              ),

              const SizedBox(width: 7),

              const Text(
                '08:00',
                style: TextStyle(
                  fontSize: 12,
                  color: textoSecundario,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // =========================================================
  // GRÁFICO
  // =========================================================

  Widget _graficoDesempenho() {
    final valores = [
      80.0,
      75.0,
      80.0,
      87.0,
    ];

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(
        14,
        18,
        14,
        16,
      ),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: linha,
        ),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  color: verdeClaro,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.bar_chart_rounded,
                  color: verde,
                  size: 21,
                ),
              ),

              const SizedBox(width: 10),

              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Evolução da equipe',
                      style: TextStyle(
                        fontSize: 14,
                        color: texto,
                        fontWeight: FontWeight.w700,
                      ),
                    ),

                    SizedBox(height: 2),

                    Text(
                      'Desempenho médio',
                      style: TextStyle(
                        fontSize: 11,
                        color: textoSecundario,
                      ),
                    ),
                  ],
                ),
              ),

              const Text(
                '+9%',
                style: TextStyle(
                  color: verde,
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),

          const SizedBox(height: 20),

          SizedBox(
            height: 190,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(
                  width: 28,
                  child: Column(
                    mainAxisAlignment:
                        MainAxisAlignment.spaceBetween,
                    children: [
                      Text('100', style: _eixoStyle),
                      Text('80', style: _eixoStyle),
                      Text('60', style: _eixoStyle),
                      Text('40', style: _eixoStyle),
                      Text('20', style: _eixoStyle),
                      Text('0', style: _eixoStyle),
                    ],
                  ),
                ),

                const SizedBox(width: 8),

                Expanded(
                  child: Stack(
                    children: [
                      Column(
                        mainAxisAlignment:
                            MainAxisAlignment.spaceBetween,
                        children: List.generate(
                          6,
                          (index) {
                            return const Divider(
                              color: Color(0xFFE3EBE7),
                              height: 1,
                              thickness: 1,
                            );
                          },
                        ),
                      ),

                      Row(
                        crossAxisAlignment:
                            CrossAxisAlignment.end,
                        mainAxisAlignment:
                            MainAxisAlignment.spaceEvenly,
                        children: List.generate(
                          valores.length,
                          (index) {
                            return _barra(
                              valores[index],
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 9),

          Row(
            mainAxisAlignment:
                MainAxisAlignment.spaceAround,
            children: const [
              Text('Mês 1', style: _eixoStyle),
              Text('Mês 2', style: _eixoStyle),
              Text('Mês 3', style: _eixoStyle),
              Text('Mês 4', style: _eixoStyle),
            ],
          ),
        ],
      ),
    );
  }

  Widget _barra(double valor) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        Text(
          '${valor.toInt()}%',
          style: const TextStyle(
            color: verde,
            fontSize: 10,
            fontWeight: FontWeight.w700,
          ),
        ),

        const SizedBox(height: 4),

        Container(
          width: 32,
          height: valor * 1.55,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Color(0xFF16A875),
                Color(0xFF006B4F),
              ],
            ),
            borderRadius: const BorderRadius.vertical(
              top: Radius.circular(7),
            ),
          ),
        ),
      ],
    );
  }

  // =========================================================
  // ATIVIDADE RECENTE
  // =========================================================

  Widget _atividadeRecente() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _tituloSecao('Atividade recente'),

        const SizedBox(height: 12),

        _itemAtividade(
          icone: Icons.person_add_alt_1_rounded,
          titulo: 'Novo atleta adicionado',
          descricao: 'Mariana Souza entrou na equipe.',
          tempo: 'Hoje',
        ),

        const SizedBox(height: 10),

        _itemAtividade(
          icone: Icons.check_circle_outline_rounded,
          titulo: 'Treino concluído',
          descricao: 'Treino de resistência finalizado.',
          tempo: 'Ontem',
        ),
      ],
    );
  }

  Widget _itemAtividade({
    required IconData icone,
    required String titulo,
    required String descricao,
    required String tempo,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: linha,
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: verdeClaro,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              icone,
              color: verde,
              size: 20,
            ),
          ),

          const SizedBox(width: 12),

          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  titulo,
                  style: const TextStyle(
                    fontSize: 13,
                    color: texto,
                    fontWeight: FontWeight.w700,
                  ),
                ),

                const SizedBox(height: 3),

                Text(
                  descricao,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 11,
                    color: textoSecundario,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(width: 8),

          Text(
            tempo,
            style: const TextStyle(
              fontSize: 10,
              color: textoSecundario,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

const TextStyle _eixoStyle = TextStyle(
  fontSize: 10,
  color: Color(0xFF68736F),
  fontWeight: FontWeight.w500,
);