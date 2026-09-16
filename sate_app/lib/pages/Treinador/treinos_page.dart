import 'package:flutter/material.dart';

class TreinosPage extends StatelessWidget {
  const TreinosPage({super.key});

  static const Color verde = Color(0xFF006B4F);
  static const Color fundo = Color(0xFFFCFCFC);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: fundo,

      appBar: AppBar(
        title: const Text(
          'Treinos',
          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: verde,
        foregroundColor: Colors.white,
        elevation: 0,
      ),

      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Row(
            mainAxisAlignment:
                MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Meus treinos',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),

              IconButton(
                onPressed: () {
                  ScaffoldMessenger.of(context)
                      .showSnackBar(
                    const SnackBar(
                      content: Text(
                        'Novo treino em breve.',
                      ),
                    ),
                  );
                },
                icon: const Icon(
                  Icons.add_circle,
                  color: verde,
                  size: 30,
                ),
              ),
            ],
          ),

          const SizedBox(height: 20),

          _treino(
            titulo: 'Resistência aeróbica',
            data: 'Hoje',
            horario: '08:00',
            duracao: '1h 30min',
            status: 'Agendado',
          ),

          _treino(
            titulo: 'Treino técnico',
            data: 'Amanhã',
            horario: '16:00',
            duracao: '1h 30min',
            status: 'Agendado',
          ),

          _treino(
            titulo: 'Velocidade e explosão',
            data: 'Quinta-feira',
            horario: '08:00',
            duracao: '1h',
            status: 'Planejado',
          ),

          _treino(
            titulo: 'Treino coletivo',
            data: 'Sábado',
            horario: '10:00',
            duracao: '2h',
            status: 'Planejado',
          ),
        ],
      ),
    );
  }

  Widget _treino({
    required String titulo,
    required String data,
    required String horario,
    required String duracao,
    required String status,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),

      padding: const EdgeInsets.all(17),

      decoration: BoxDecoration(
        color: Colors.white,

        borderRadius: BorderRadius.circular(18),

        border: Border.all(
          color: const Color(0xFFE1E1E1),
        ),
      ),

      child: Column(
        crossAxisAlignment:
            CrossAxisAlignment.start,

        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  titulo,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),

              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 9,
                  vertical: 5,
                ),

                decoration: BoxDecoration(
                  color: verde.withValues(alpha: 0.09),
                  borderRadius:
                      BorderRadius.circular(20),
                ),

                child: Text(
                  status,
                  style: const TextStyle(
                    color: verde,
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 14),

          Row(
            children: [
              const Icon(
                Icons.calendar_today_outlined,
                size: 16,
                color: Colors.grey,
              ),

              const SizedBox(width: 6),

              Text(
                data,
                style: const TextStyle(
                  fontSize: 12,
                  color: Color(0xFF555555),
                ),
              ),

              const SizedBox(width: 18),

              const Icon(
                Icons.access_time_outlined,
                size: 16,
                color: Colors.grey,
              ),

              const SizedBox(width: 6),

              Text(
                horario,
                style: const TextStyle(
                  fontSize: 12,
                  color: Color(0xFF555555),
                ),
              ),

              const SizedBox(width: 18),

              const Icon(
                Icons.timer_outlined,
                size: 16,
                color: Colors.grey,
              ),

              const SizedBox(width: 6),

              Text(
                duracao,
                style: const TextStyle(
                  fontSize: 12,
                  color: Color(0xFF555555),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}