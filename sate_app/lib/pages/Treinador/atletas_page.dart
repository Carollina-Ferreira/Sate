import 'package:flutter/material.dart';

class AtletasPage extends StatelessWidget {
  const AtletasPage({super.key});

  static const Color verde = Color(0xFF006B4F);
  static const Color fundo = Color(0xFFFCFCFC);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: fundo,

      appBar: AppBar(
        title: const Text(
          'Atletas',
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
                'Meus atletas',
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
                        'Cadastro de atleta em breve.',
                      ),
                    ),
                  );
                },
                icon: const Icon(
                  Icons.person_add_alt_1,
                  color: verde,
                ),
              ),
            ],
          ),

          const SizedBox(height: 20),

          _atleta(
            nome: 'Ana Souza',
            modalidade: 'Futebol',
            inicial: 'A',
            frequencia: '94%',
          ),

          _atleta(
            nome: 'Carlos Oliveira',
            modalidade: 'Basquete',
            inicial: 'C',
            frequencia: '89%',
          ),

          _atleta(
            nome: 'Mariana Santos',
            modalidade: 'Vôlei',
            inicial: 'M',
            frequencia: '92%',
          ),

          _atleta(
            nome: 'Pedro Henrique',
            modalidade: 'Futebol',
            inicial: 'P',
            frequencia: '84%',
          ),

          _atleta(
            nome: 'Lucas Almeida',
            modalidade: 'Futebol',
            inicial: 'L',
            frequencia: '87%',
          ),
        ],
      ),
    );
  }

  Widget _atleta({
    required String nome,
    required String modalidade,
    required String inicial,
    required String frequencia,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),

      decoration: BoxDecoration(
        color: Colors.white,

        borderRadius: BorderRadius.circular(16),

        border: Border.all(
          color: const Color(0xFFE1E1E1),
        ),
      ),

      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 8,
        ),

        leading: CircleAvatar(
          radius: 23,
          backgroundColor: verde,
          child: Text(
            inicial,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),

        title: Text(
          nome,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),

        subtitle: Padding(
          padding: const EdgeInsets.only(top: 5),
          child: Text(
            '$modalidade • Frequência $frequencia',
          ),
        ),

        trailing: const Icon(
          Icons.arrow_forward_ios,
          size: 16,
          color: Colors.grey,
        ),
      ),
    );
  }
}