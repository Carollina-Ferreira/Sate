import 'package:flutter/material.dart';

class AtletaHomePage extends StatelessWidget {
  const AtletaHomePage({super.key});

  static const Color verde = Color(0xFF00845F);
  static const Color rosa = Color(0xFFE98BA8);
  static const Color azul = Color(0xFF001E98);
  static const Color fundo = Color(0xFFFCFCFC);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: fundo,

      appBar: AppBar(
        backgroundColor: fundo,
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
              color: Colors.black87,
              size: 26,
            ),
          ),
        ],
      ),

      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 10, 20, 30),

          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // SAUDAÇÃO
              const Text(
                'Olá, atleta! 👋',
                style: TextStyle(
                  fontSize: 27,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),

              const SizedBox(height: 6),

              Text(
                'Confira seus treinos e acompanhe sua evolução.',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey.shade600,
                  height: 1.4,
                ),
              ),

              const SizedBox(height: 25),

              // MINHA EQUIPE
              const Text(
                'Minha equipe',
                style: TextStyle(
                  fontSize: 19,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),

              const SizedBox(height: 12),

              Container(
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
                      color: Colors.black.withValues(alpha: 0.04),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),

                child: Row(
                  children: [
                    Container(
                      width: 52,
                      height: 52,

                      decoration: BoxDecoration(
                        color: verde.withValues(alpha: 0.10),
                        borderRadius: BorderRadius.circular(16),
                      ),

                      child: const Icon(
                        Icons.groups_rounded,
                        color: verde,
                        size: 28,
                      ),
                    ),

                    const SizedBox(width: 14),

                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Equipe Performance',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.black87,
                            ),
                          ),

                          SizedBox(height: 5),

                          Text(
                            'Treinador: Carlos Oliveira',
                            style: TextStyle(
                              fontSize: 13,
                              color: Colors.grey,
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

              const SizedBox(height: 25),

              // MEU RESUMO
              const Text(
                'Meu resumo',
                style: TextStyle(
                  fontSize: 19,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),

              const SizedBox(height: 12),

              Row(
                children: [
                  Expanded(
                    child: _buildResumoCard(
                      icon: Icons.fitness_center_rounded,
                      titulo: 'Treinos',
                      valor: '08',
                      cor: azul,
                    ),
                  ),

                  const SizedBox(width: 12),

                  Expanded(
                    child: _buildResumoCard(
                      icon: Icons.calendar_month_rounded,
                      titulo: 'Frequência',
                      valor: '92%',
                      cor: verde,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 25),

              // PRÓXIMO TREINO
              const Text(
                'Próximo treino',
                style: TextStyle(
                  fontSize: 19,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),

              const SizedBox(height: 12),

              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),

                decoration: BoxDecoration(
                  color: verde,
                  borderRadius: BorderRadius.circular(22),
                ),

                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 44,
                          height: 44,

                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.18),
                            borderRadius: BorderRadius.circular(13),
                          ),

                          child: const Icon(
                            Icons.sports_rugby_rounded,
                            color: Colors.white,
                            size: 25,
                          ),
                        ),

                        const SizedBox(width: 12),

                        const Expanded(
                          child: Text(
                            'Treino de hoje',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 18),

                    const Text(
                      'Fundamentos + preparação física',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.w500,
                      ),
                    ),

                    const SizedBox(height: 7),

                    Row(
                      children: [
                        const Icon(
                          Icons.access_time_rounded,
                          color: Colors.white70,
                          size: 17,
                        ),

                        const SizedBox(width: 6),

                        Text(
                          '18:00 • Hoje',
                          style: TextStyle(
                            color: Colors.white.withValues(alpha: 0.85),
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 18),

                    SizedBox(
                      width: double.infinity,
                      height: 46,

                      child: ElevatedButton(
                        onPressed: () {},
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: verde,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(13),
                          ),
                        ),

                        child: const Text(
                          'Ver treino',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 25),

              // ACESSO RÁPIDO
              const Text(
                'Acesso rápido',
                style: TextStyle(
                  fontSize: 19,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),

              const SizedBox(height: 12),

              _buildActionButton(
                icon: Icons.fitness_center_rounded,
                title: 'Meus treinamentos',
                subtitle: 'Veja seus exercícios e atividades',
                cor: azul,
                onTap: () {},
              ),

              const SizedBox(height: 10),

              _buildActionButton(
                icon: Icons.trending_up_rounded,
                title: 'Minha evolução',
                subtitle: 'Acompanhe seu desempenho',
                cor: rosa,
                onTap: () {},
              ),

              const SizedBox(height: 10),

              _buildActionButton(
                icon: Icons.chat_bubble_outline_rounded,
                title: 'Feedbacks',
                subtitle: 'Veja os comentários do treinador',
                cor: verde,
                onTap: () {},
              ),

              const SizedBox(height: 15),
            ],
          ),
        ),
      ),

      // MENU INFERIOR
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0,
        type: BottomNavigationBarType.fixed,
        backgroundColor: Colors.white,
        elevation: 10,

        selectedItemColor: verde,
        unselectedItemColor: Colors.grey,

        selectedLabelStyle: const TextStyle(
          fontWeight: FontWeight.w600,
          fontSize: 11,
        ),

        unselectedLabelStyle: const TextStyle(
          fontSize: 11,
        ),

        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_rounded),
            label: 'Início',
          ),

          BottomNavigationBarItem(
            icon: Icon(Icons.fitness_center_rounded),
            label: 'Treinos',
          ),

          BottomNavigationBarItem(
            icon: Icon(Icons.trending_up_rounded),
            label: 'Evolução',
          ),

          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline_rounded),
            label: 'Perfil',
          ),
        ],

        onTap: (index) {
          // Futuramente vamos colocar a navegação de cada página aqui.
        },
      ),
    );
  }

  // CARD DO RESUMO
  Widget _buildResumoCard({
    required IconData icon,
    required String titulo,
    required String valor,
    required Color cor,
  }) {
    return Container(
      padding: const EdgeInsets.all(17),

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
          Container(
            width: 42,
            height: 42,

            decoration: BoxDecoration(
              color: cor.withValues(alpha: 0.10),
              borderRadius: BorderRadius.circular(13),
            ),

            child: Icon(
              icon,
              color: cor,
              size: 22,
            ),
          ),

          const SizedBox(height: 13),

          Text(
            valor,
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
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

  // BOTÃO DE ACESSO RÁPIDO
  Widget _buildActionButton({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color cor,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(17),

      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(17),

        child: Container(
          padding: const EdgeInsets.all(15),

          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(17),
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
                  color: cor.withValues(alpha: 0.10),
                  borderRadius: BorderRadius.circular(14),
                ),

                child: Icon(
                  icon,
                  color: cor,
                  size: 23,
                ),
              ),

              const SizedBox(width: 13),

              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                    ),

                    const SizedBox(height: 4),

                    Text(
                      subtitle,
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
      ),
    );
  }
}