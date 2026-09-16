import 'package:flutter/material.dart';

class TreinadorHomePage extends StatelessWidget {
  const TreinadorHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFCFCFC),

      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,

        title: Image.asset(
          'images/logoVerde_img.png',
          width: 110,
        ),

        actions: [
          IconButton(
            onPressed: () {},
            icon: const Icon(
              Icons.notifications_none_rounded,
              color: Colors.black,
            ),
          ),
        ],
      ),

      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 15, 20, 30),

          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // SAUDAÇÃO
              const Text(
                'Olá, treinador! 👋',
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),

              const SizedBox(height: 8),

              Text(
                'Bem-vindo ao seu painel.',
                style: TextStyle(
                  fontSize: 15,
                  color: Colors.grey.shade600,
                ),
              ),

              const SizedBox(height: 30),

              // RESUMO
              const Text(
                'Resumo da equipe',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),

              const SizedBox(height: 15),

              Row(
                children: [
                  Expanded(
                    child: _card(
                      '0',
                      'Atletas',
                      Icons.groups_rounded,
                      const Color(0xFF001E98),
                    ),
                  ),

                  const SizedBox(width: 12),

                  Expanded(
                    child: _card(
                      '0',
                      'Treinos',
                      Icons.fitness_center_rounded,
                      const Color(0xFF00845F),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 30),

              // AÇÕES RÁPIDAS
              const Text(
                'Ações rápidas',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),

              const SizedBox(height: 15),

              // ADICIONAR ATLETA
              SizedBox(
                width: double.infinity,
                height: 55,

                child: ElevatedButton.icon(
                  onPressed: () {},

                  icon: const Icon(
                    Icons.person_add_rounded,
                  ),

                  label: const Text(
                    'Adicionar atleta',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF00845F),
                    foregroundColor: Colors.white,
                    elevation: 0,

                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(15),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 12),

              // CRIAR TREINAMENTO
              SizedBox(
                width: double.infinity,
                height: 55,

                child: OutlinedButton.icon(
                  onPressed: () {},

                  icon: const Icon(
                    Icons.add_rounded,
                  ),

                  label: const Text(
                    'Criar treinamento',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  style: OutlinedButton.styleFrom(
                    foregroundColor: const Color(0xFF001E98),

                    side: const BorderSide(
                      color: Color(0xFF001E98),
                    ),

                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(15),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 25),

              // PRÓXIMA ÁREA
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(18),

                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),

                  border: Border.all(
                    color: Colors.grey.shade200,
                  ),
                ),

                child: Row(
                  children: [
                    Container(
                      width: 45,
                      height: 45,

                      decoration: BoxDecoration(
                        color: const Color(0xFFE98BA8).withOpacity(0.12),
                        borderRadius: BorderRadius.circular(14),
                      ),

                      child: const Icon(
                        Icons.insights_rounded,
                        color: Color(0xFFE98BA8),
                      ),
                    ),

                    const SizedBox(width: 13),

                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Desempenho da equipe',
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: Colors.black87,
                            ),
                          ),

                          const SizedBox(height: 4),

                          Text(
                            'Acompanhe a evolução dos seus atletas.',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey.shade600,
                            ),
                          ),
                        ],
                      ),
                    ),

                    const Icon(
                      Icons.chevron_right_rounded,
                      color: Colors.grey,
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 10),
            ],
          ),
        ),
      ),

      // MENU INFERIOR
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0,

        selectedItemColor: const Color(0xFF00845F),
        unselectedItemColor: Colors.grey,

        type: BottomNavigationBarType.fixed,

        items: const [
          BottomNavigationBarItem(
            icon: Icon(
              Icons.home_rounded,
            ),
            label: 'Início',
          ),

          BottomNavigationBarItem(
            icon: Icon(
              Icons.groups_rounded,
            ),
            label: 'Atletas',
          ),

          BottomNavigationBarItem(
            icon: Icon(
              Icons.fitness_center_rounded,
            ),
            label: 'Treinos',
          ),

          BottomNavigationBarItem(
            icon: Icon(
              Icons.insights_rounded,
            ),
            label: 'Desempenho',
          ),
        ],

        onTap: (index) {
          // Navegação será adicionada depois.
        },
      ),
    );
  }

  static Widget _card(
    String numero,
    String titulo,
    IconData icon,
    Color cor,
  ) {
    return Container(
      padding: const EdgeInsets.all(18),

      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),

        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),

      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            icon,
            color: cor,
            size: 28,
          ),

          const SizedBox(height: 12),

          Text(
            numero,
            style: const TextStyle(
              fontSize: 25,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),

          const SizedBox(height: 3),

          Text(
            titulo,
            style: TextStyle(
              fontSize: 13,
              color: Colors.grey.shade600,
            ),
          ),
        ],
      ),
    );
  }
}