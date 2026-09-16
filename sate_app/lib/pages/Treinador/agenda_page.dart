import 'package:flutter/material.dart';

class AgendaPage extends StatelessWidget {
  const AgendaPage({super.key});

  static const Color verde = Color(0xFF006B4F);
  static const Color fundo = Color(0xFFFCFCFC);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: fundo,

      appBar: AppBar(
        title: const Text(
          'Agenda',
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
          const Text(
            'Próximos compromissos',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),

          const SizedBox(height: 20),

          _evento(
            dia: '27',
            mes: 'AGO',
            titulo: 'Treino de resistência aeróbica',
            horario: '08:00 - 09:30',
            local: 'Campo principal',
            icone: Icons.fitness_center,
          ),

          _evento(
            dia: '29',
            mes: 'AGO',
            titulo: 'Treino técnico',
            horario: '16:00 - 17:30',
            local: 'Centro esportivo',
            icone: Icons.sports_soccer,
          ),

          _evento(
            dia: '31',
            mes: 'AGO',
            titulo: 'Jogo amistoso',
            horario: '10:00 - 12:00',
            local: 'Estádio Municipal',
            icone: Icons.emoji_events_outlined,
          ),

          _evento(
            dia: '03',
            mes: 'SET',
            titulo: 'Avaliação física',
            horario: '08:30 - 10:00',
            local: 'Sala de avaliação',
            icone: Icons.monitor_heart_outlined,
          ),
        ],
      ),
    );
  }

  Widget _evento({
    required String dia,
    required String mes,
    required String titulo,
    required String horario,
    required String local,
    required IconData icone,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),

      padding: const EdgeInsets.all(14),

      decoration: BoxDecoration(
        color: Colors.white,

        borderRadius: BorderRadius.circular(18),

        border: Border.all(
          color: const Color(0xFFE1E1E1),
        ),
      ),

      child: Row(
        children: [
          Container(
            width: 58,
            height: 65,

            decoration: BoxDecoration(
              color: verde.withValues(alpha: 0.08),

              borderRadius: BorderRadius.circular(14),
            ),

            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,

              children: [
                Text(
                  dia,
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: verde,
                  ),
                ),

                Text(
                  mes,
                  style: const TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: verde,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(width: 14),

          Expanded(
            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment.start,

              children: [
                Text(
                  titulo,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),

                const SizedBox(height: 8),

                Row(
                  children: [
                    const Icon(
                      Icons.access_time_outlined,
                      size: 15,
                      color: Colors.grey,
                    ),

                    const SizedBox(width: 5),

                    Text(
                      horario,
                      style: const TextStyle(
                        fontSize: 12,
                        color: Color(0xFF555555),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 5),

                Row(
                  children: [
                    const Icon(
                      Icons.location_on_outlined,
                      size: 15,
                      color: Colors.grey,
                    ),

                    const SizedBox(width: 5),

                    Expanded(
                      child: Text(
                        local,
                        style: const TextStyle(
                          fontSize: 12,
                          color: Color(0xFF555555),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          Icon(
            icone,
            color: verde,
            size: 22,
          ),
        ],
      ),
    );
  }
}