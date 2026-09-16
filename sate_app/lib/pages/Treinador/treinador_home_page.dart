import 'package:flutter/material.dart';

class TreinadorHomePage extends StatelessWidget {
  const TreinadorHomePage({super.key});

  static const Color verde = Color(0xFF006B4F);
  static const Color fundo = Color(0xFFFCFCFC);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: fundo,

      body: Container(
        width: double.infinity,
        height: double.infinity,

        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF006B4F),
              Color(0xFF005640),
              Color(0xFF003426),
            ],
            stops: [0.0, 0.55, 1.0],
          ),
        ),

        child: SafeArea(
          bottom: false,

          child: Column(
            children: [
              _cabecalho(),

              Expanded(
                child: Container(
                  width: double.infinity,

                  decoration: const BoxDecoration(
                    color: fundo,

                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(30),
                      topRight: Radius.circular(30),
                    ),
                  ),

                  child: SingleChildScrollView(
                    physics: const BouncingScrollPhysics(),

                    padding: const EdgeInsets.fromLTRB(
                      24,
                      25,
                      24,
                      30,
                    ),

                    child: Column(
                      crossAxisAlignment:
                          CrossAxisAlignment.start,

                      children: [
                        _tituloSecao('Resumo da equipe'),

                        const SizedBox(height: 14),

                        _resumoEquipe(),

                        const SizedBox(height: 26),

                        _tituloSecao('Próximo treino'),

                        const SizedBox(height: 14),

                        _proximoTreino(),

                        const SizedBox(height: 26),

                        _tituloSecao('Desempenho da equipe'),

                        const SizedBox(height: 14),

                        _graficoDesempenho(),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _cabecalho() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(22, 8, 22, 16),

      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,

        children: [
          SizedBox(
            width: 58,
            height: 38,

            child: Image.asset(
              'assets/images/logo_img.png',

              width: 58,
              height: 38,

              fit: BoxFit.contain,
              alignment: Alignment.centerLeft,
            ),
          ),

          const SizedBox(width: 12),

          const Expanded(
            child: Text.rich(
              TextSpan(
                children: [
                  TextSpan(
                    text: 'Olá, ',

                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w400,
                    ),
                  ),

                  TextSpan(
                    text: 'Professor Marcos!',

                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),

              maxLines: 1,
              overflow: TextOverflow.ellipsis,

              style: TextStyle(
                color: Colors.white,
                fontStyle: FontStyle.italic,
              ),
            ),
          ),

          const SizedBox(width: 8),

          IconButton(
            padding: EdgeInsets.zero,

            constraints: const BoxConstraints(
              minWidth: 34,
              minHeight: 34,
            ),

            onPressed: () {
              print('Notificações clicadas');
            },

            icon: const Icon(
              Icons.notifications_none_rounded,

              color: Colors.white,
              size: 23,
            ),
          ),

          const SizedBox(width: 4),

          GestureDetector(
            onTap: () {
              print('Perfil clicado');
            },

            child: Container(
              width: 38,
              height: 38,

              decoration: BoxDecoration(
                shape: BoxShape.circle,

                border: Border.all(
                  color: Colors.white,
                  width: 2,
                ),
              ),

              child: ClipOval(
                child: Image.asset(
                  'assets/images/perfil_treinador.png',

                  width: 38,
                  height: 38,

                  fit: BoxFit.cover,

                  errorBuilder: (
                    context,
                    error,
                    stackTrace,
                  ) {
                    return Container(
                      color: Colors.white,

                      child: const Icon(
                        Icons.person_rounded,

                        color: verde,
                        size: 22,
                      ),
                    );
                  },
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _tituloSecao(String titulo) {
    return Text(
      titulo,

      style: const TextStyle(
        fontSize: 17,
        fontWeight: FontWeight.w600,
        fontStyle: FontStyle.italic,
        color: Colors.black,
      ),
    );
  }

  Widget _resumoEquipe() {
    return Container(
      width: double.infinity,

      padding: const EdgeInsets.all(18),

      decoration: BoxDecoration(
        color: Colors.white,

        borderRadius: BorderRadius.circular(20),

        border: Border.all(
          color: Color(0xAAC1C1C1),
        ),
      ),

      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: _indicador(
                  'Atletas',
                  '24',
                ),
              ),

              Expanded(
                child: _indicador(
                  'Frequência',
                  '88%',
                ),
              ),
            ],
          ),

          const Padding(
            padding: EdgeInsets.symmetric(vertical: 14),

            child: Divider(
              color: Color(0xFFD5D5D5),
              height: 1,
            ),
          ),

          Row(
            children: [
              Expanded(
                child: _indicador(
                  'Treinos/semana',
                  '6',
                ),
              ),

              Expanded(
                child: _indicador(
                  'Desempenho',
                  '+9%',
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _indicador(
    String titulo,
    String valor,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,

      children: [
        Text(
          titulo,

          maxLines: 1,
          overflow: TextOverflow.ellipsis,

          style: const TextStyle(
            fontSize: 12,
            color: Color(0xFF4A4A4A),
            fontWeight: FontWeight.w500,
          ),
        ),

        const SizedBox(height: 5),

        Text(
          valor,

          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w600,
            fontStyle: FontStyle.italic,
            color: Colors.black,
          ),
        ),
      ],
    );
  }

  Widget _proximoTreino() {
    return Container(
      width: double.infinity,

      padding: const EdgeInsets.all(16),

      decoration: BoxDecoration(
        color: Colors.white,

        borderRadius: BorderRadius.circular(20),

        border: Border.all(
          color: Color(0xAAC1C1C1),
        ),
      ),

      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,

        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,

            children: [
              const Expanded(
                child: Text(
                  'Resistência aeróbica',

                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,

                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ),

              const SizedBox(width: 10),

              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 6,
                ),

                decoration: BoxDecoration(
                  color: Color(0xFFF0DBE7),

                  borderRadius: BorderRadius.circular(20),
                ),

                child: const Text(
                  'Agendado',

                  style: TextStyle(
                    color: Color(0xFF9B5377),
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 14),

          Wrap(
            spacing: 20,
            runSpacing: 8,

            children: [
              Row(
                mainAxisSize: MainAxisSize.min,

                children: const [
                  Icon(
                    Icons.calendar_today_outlined,

                    size: 15,
                    color: Color(0xFF4A4A4A),
                  ),

                  SizedBox(width: 7),

                  Text(
                    'Qua, 27/08',

                    style: TextStyle(
                      fontSize: 12,
                      color: Color(0xFF4A4A4A),
                    ),
                  ),
                ],
              ),

              Row(
                mainAxisSize: MainAxisSize.min,

                children: const [
                  Icon(
                    Icons.access_time_rounded,

                    size: 15,
                    color: Color(0xFF4A4A4A),
                  ),

                  SizedBox(width: 7),

                  Text(
                    '08:00',

                    style: TextStyle(
                      fontSize: 12,
                      color: Color(0xFF4A4A4A),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

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
        12,
        20,
        12,
        14,
      ),

      decoration: BoxDecoration(
        color: Colors.white,

        borderRadius: BorderRadius.circular(25),

        border: Border.all(
          color: Color(0xAAC1C1C1),
        ),
      ),

      child: Column(
        children: [
          SizedBox(
            height: 190,

            child: Row(
              crossAxisAlignment:
                  CrossAxisAlignment.stretch,

              children: [
                const SizedBox(
                  width: 28,

                  child: Column(
                    mainAxisAlignment:
                        MainAxisAlignment.spaceBetween,

                    children: [
                      Text(
                        '100',
                        style: _eixoStyle,
                      ),

                      Text(
                        '80',
                        style: _eixoStyle,
                      ),

                      Text(
                        '60',
                        style: _eixoStyle,
                      ),

                      Text(
                        '40',
                        style: _eixoStyle,
                      ),

                      Text(
                        '20',
                        style: _eixoStyle,
                      ),

                      Text(
                        '0',
                        style: _eixoStyle,
                      ),
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
                              color: Color(0xFFD6D6D6),
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

          const SizedBox(height: 8),

          Row(
            mainAxisAlignment:
                MainAxisAlignment.spaceAround,

            children: const [
              Text(
                'Mês 1',
                style: _eixoStyle,
              ),

              Text(
                'Mês 2',
                style: _eixoStyle,
              ),

              Text(
                'Mês 3',
                style: _eixoStyle,
              ),

              Text(
                'Mês 4',
                style: _eixoStyle,
              ),
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
            fontWeight: FontWeight.w600,
          ),
        ),

        const SizedBox(height: 3),

        Container(
          width: 30,

          height: valor * 1.55,

          decoration: const BoxDecoration(
            color: verde,

            borderRadius: BorderRadius.vertical(
              top: Radius.circular(4),
            ),
          ),
        ),
      ],
    );
  }
}

const TextStyle _eixoStyle = TextStyle(
  fontSize: 10,
  color: Color(0xFF4A4A4A),
);