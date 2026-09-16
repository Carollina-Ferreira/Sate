import 'package:flutter/material.dart';

class FeedPage extends StatelessWidget {
  const FeedPage({super.key});

  static const Color verde = Color(0xFF006B4F);
  static const Color fundo = Color(0xFFFCFCFC);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: fundo,

      appBar: AppBar(
        title: const Text(
          'Feed',
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
          _publicacao(
            nome: 'Treinador SATE',
            texto:
                'Parabéns a todos pelo excelente treino de hoje! Continuem evoluindo.',
            horario: 'Há 2 horas',
          ),

          _publicacao(
            nome: 'Equipe Falcões FC',
            texto:
                'Novo desafio concluído pela equipe! Parabéns a todos os atletas.',
            horario: 'Há 5 horas',
          ),

          _publicacao(
            nome: 'Treinador SATE',
            texto:
                'Lembrete: não esqueçam do próximo treino. Contamos com a presença de todos!',
            horario: 'Ontem',
          ),
        ],
      ),

      floatingActionButton: FloatingActionButton(
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text(
                'A criação de publicações será implementada em breve.',
              ),
            ),
          );
        },

        backgroundColor: verde,

        child: const Icon(
          Icons.add,
          color: Colors.white,
        ),
      ),
    );
  }

  Widget _publicacao({
    required String nome,
    required String texto,
    required String horario,
  }) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),

      elevation: 0,

      color: Colors.white,

      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(
          color: Color(0xFFE8E8E8),
        ),
      ),

      child: Padding(
        padding: const EdgeInsets.all(16),

        child: Column(
          crossAxisAlignment:
              CrossAxisAlignment.start,

          children: [
            Row(
              children: [
                const CircleAvatar(
                  radius: 22,
                  backgroundColor: verde,
                  child: Icon(
                    Icons.person,
                    color: Colors.white,
                  ),
                ),

                const SizedBox(width: 10),

                Expanded(
                  child: Column(
                    crossAxisAlignment:
                        CrossAxisAlignment.start,
                    children: [
                      Text(
                        nome,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),

                      const SizedBox(height: 3),

                      Text(
                        horario,
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),

                const Icon(
                  Icons.more_vert,
                  color: Colors.grey,
                ),
              ],
            ),

            const SizedBox(height: 16),

            Text(
              texto,
              style: const TextStyle(
                fontSize: 15,
                height: 1.4,
                color: Color(0xFF333333),
              ),
            ),

            const SizedBox(height: 16),

            const Divider(
              color: Color(0xFFEAEAEA),
            ),

            const SizedBox(height: 8),

            Row(
              children: [
                const Icon(
                  Icons.favorite_border,
                  size: 21,
                  color: Colors.grey,
                ),

                const SizedBox(width: 6),

                const Text(
                  'Curtir',
                  style: TextStyle(
                    color: Colors.grey,
                    fontSize: 13,
                  ),
                ),

                const SizedBox(width: 24),

                const Icon(
                  Icons.chat_bubble_outline,
                  size: 20,
                  color: Colors.grey,
                ),

                const SizedBox(width: 6),

                const Text(
                  'Comentar',
                  style: TextStyle(
                    color: Colors.grey,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}