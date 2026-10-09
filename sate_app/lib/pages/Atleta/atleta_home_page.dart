import 'package:flutter/material.dart';

import '../../assets/menu_inferior_atleta.dart';
import 'atleta_treino_page.dart';
import 'atleta_desempenho_page.dart';
import 'atleta_feed_page.dart';
import 'atleta_perfil_page.dart';
import 'atleta_notificacao_page.dart';

class AtletaHomePage extends StatefulWidget {
  const AtletaHomePage({super.key});

  @override
  State<AtletaHomePage> createState() => _AtletaHomePageState();
}

class _AtletaHomePageState extends State<AtletaHomePage> {
  static const Color verde = Color(0xFF00845F);
  static const Color rosa = Color(0xFFE98BA8);
  static const Color azul = Color(0xFF001E98);
  static const Color fundo = Color(0xFFFCFCFC);

  bool _visualizandoFeedbacks = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: fundo,

      // ============================================================
      // APP BAR
      // ============================================================

      appBar: _visualizandoFeedbacks
          ? null
          : AppBar(
              backgroundColor: fundo,
              elevation: 0,
              centerTitle: true,

              title: Image.asset(
                'images/logoVerde_img.png',
                width: 110,
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

      // ============================================================
      // CONTEÚDO
      // ============================================================

      body: SafeArea(
        child: _visualizandoFeedbacks
            ? _buildFeedbacks()
            : _buildInicio(),
      ),

      // ============================================================
      // MENU INFERIOR
      // ============================================================

      bottomNavigationBar: MenuInferiorAtleta(
        indiceSelecionado: 0,
        onItemSelecionado: (index) {
          if (index == 0) {
            return;
          }

          if (index == 1) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => const AtletaTreinoPage(),
              ),
            );
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
  // INÍCIO
  // ============================================================

  Widget _buildInicio() {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 10, 20, 30),

      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,

        children: [
          // ======================================================
          // SAUDAÇÃO
          // ======================================================

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

          // ======================================================
          // MINHA EQUIPE
          // ======================================================

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

          // ======================================================
          // MEU RESUMO
          // ======================================================

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

          // ======================================================
          // PRÓXIMO TREINO
          // ======================================================

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
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const AtletaTreinoPage(),
                        ),
                      );
                    },

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

          // ======================================================
          // ACESSO RÁPIDO
          // ======================================================

          const Text(
            'Acesso rápido',
            style: TextStyle(
              fontSize: 19,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),

          const SizedBox(height: 12),

          // MEUS TREINAMENTOS

          _buildActionButton(
            icon: Icons.fitness_center_rounded,
            title: 'Meus treinamentos',
            subtitle: 'Veja seus exercícios e atividades',
            cor: azul,

            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const AtletaTreinoPage(),
                ),
              );
            },
          ),

          const SizedBox(height: 10),

          // MINHA EVOLUÇÃO

          _buildActionButton(
            icon: Icons.trending_up_rounded,
            title: 'Minha evolução',
            subtitle: 'Acompanhe seu desempenho',
            cor: rosa,

            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const AtletaDesempenhoPage(),
                ),
              );
            },
          ),

          const SizedBox(height: 10),

          // FEEDBACKS

          _buildActionButton(
            icon: Icons.chat_bubble_outline_rounded,
            title: 'Feedbacks',
            subtitle: 'Veja os comentários do treinador',
            cor: verde,

            onTap: () {
              setState(() {
                _visualizandoFeedbacks = true;
              });
            },
          ),

          const SizedBox(height: 15),
        ],
      ),
    );
  }

  // ============================================================
  // FEEDBACKS — PARTE INTERNA DA HOME
  // ============================================================

  Widget _buildFeedbacks() {
    return Column(
      children: [
        // ======================================================
        // CABEÇALHO DOS FEEDBACKS
        // ======================================================

        Container(
          width: double.infinity,

          padding: const EdgeInsets.fromLTRB(
            20,
            18,
            20,
            18,
          ),

          decoration: const BoxDecoration(
            color: verde,

            borderRadius: BorderRadius.only(
              bottomLeft: Radius.circular(22),
              bottomRight: Radius.circular(22),
            ),
          ),

          child: Row(
            children: [
              GestureDetector(
                onTap: () {
                  setState(() {
                    _visualizandoFeedbacks = false;
                  });
                },

                child: const Icon(
                  Icons.arrow_back_rounded,
                  color: Colors.white,
                  size: 25,
                ),
              ),

              const SizedBox(width: 14),

              const Text(
                'Feedbacks',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),

        // ======================================================
        // CONTEÚDO DOS FEEDBACKS
        // ======================================================

        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(
              20,
              20,
              20,
              30,
            ),

            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,

              children: [
                const Text(
                  'Feedbacks do treinador',
                  style: TextStyle(
                    fontSize: 19,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),

                const SizedBox(height: 6),

                Text(
                  'Veja os comentários sobre seus treinos.',
                  style: TextStyle(
                    fontSize: 13,
                    color: Colors.grey.shade600,
                  ),
                ),

                const SizedBox(height: 18),

                _buildFeedbackCard(
                  treino: 'Treino de velocidade',
                  comentario:
                      'Boa evolução na velocidade. Continue trabalhando a explosão nos primeiros metros.',
                  data: 'Hoje',
                ),

                const SizedBox(height: 10),

                _buildFeedbackCard(
                  treino: 'Treino de finalização',
                  comentario:
                      'Boa execução. Procure manter mais precisão nas finalizações sob pressão.',
                  data: 'Ontem',
                ),

                const SizedBox(height: 10),

                _buildFeedbackCard(
                  treino: 'Treino tático',
                  comentario:
                      'Bom posicionamento durante o treino. Continue atento à organização da equipe.',
                  data: '22/09',
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // ============================================================
  // CARD DE FEEDBACK
  // ============================================================

  Widget _buildFeedbackCard({
    required String treino,
    required String comentario,
    required String data,
  }) {
    return Container(
      width: double.infinity,

      padding: const EdgeInsets.all(17),

      decoration: BoxDecoration(
        color: Colors.white,

        borderRadius: BorderRadius.circular(18),

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
        crossAxisAlignment: CrossAxisAlignment.start,

        children: [
          Row(
            children: [
              Container(
                width: 40,
                height: 40,

                decoration: BoxDecoration(
                  color: verde.withValues(alpha: 0.10),
                  borderRadius: BorderRadius.circular(12),
                ),

                child: const Icon(
                  Icons.chat_bubble_outline_rounded,
                  color: verde,
                  size: 21,
                ),
              ),

              const SizedBox(width: 11),

              Expanded(
                child: Text(
                  treino,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
              ),

              Text(
                data,
                style: TextStyle(
                  fontSize: 10,
                  color: Colors.grey.shade500,
                ),
              ),
            ],
          ),

          const SizedBox(height: 13),

          Text(
            comentario,
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey.shade600,
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }

  // ============================================================
  // CARD DO RESUMO
  // ============================================================

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

  // ============================================================
  // BOTÃO DE ACESSO RÁPIDO
  // ============================================================

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