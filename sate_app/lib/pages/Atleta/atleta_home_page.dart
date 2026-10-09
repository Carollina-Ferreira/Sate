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
  static const Color verde = Color(0xFF006B4F);
  static const Color verdeClaro = Color(0xFFE8F5F0);
  static const Color rosa = Color(0xFFE98BA8);
  static const Color azul = Color(0xFF001E98);

  static const Color fundo = Color(0xFFF4F8F6);
  static const Color texto = Color(0xFF12261F);
  static const Color textoSecundario = Color(0xFF68736F);
  static const Color linha = Color(0xFFDCE7E2);

  bool _visualizandoFeedbacks = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: fundo,

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
                    color: texto,
                    size: 26,
                  ),
                ),
              ],
            ),

      body: SafeArea(
        child: _visualizandoFeedbacks
            ? _buildFeedbacks()
            : _buildInicio(),
      ),

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

  Widget _buildInicio() {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(
        20,
        10,
        20,
        40,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSaudacao(),

          const SizedBox(height: 28),

          _tituloSecao('Visão geral'),

          const SizedBox(height: 12),

          _buildVisaoGeral(),

          const SizedBox(height: 28),

          _tituloSecao('Próximo treino'),

          const SizedBox(height: 12),

          _buildProximoTreino(),

          const SizedBox(height: 28),

          _tituloSecao('Acesso rápido'),

          const SizedBox(height: 12),

          _buildAcao(
            icon: Icons.fitness_center_rounded,
            titulo: 'Meus treinamentos',
            descricao: 'Veja seus exercícios e atividades',
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

          _buildAcao(
            icon: Icons.trending_up_rounded,
            titulo: 'Minha evolução',
            descricao: 'Acompanhe seu desempenho',
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

          _buildAcao(
            icon: Icons.chat_bubble_outline_rounded,
            titulo: 'Feedbacks',
            descricao: 'Veja os comentários do treinador',
            cor: verde,
            onTap: () {
              setState(() {
                _visualizandoFeedbacks = true;
              });
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSaudacao() {
    return Row(
      children: [
        const Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Olá, atleta! 👋',
                style: TextStyle(
                  fontSize: 21,
                  fontWeight: FontWeight.w700,
                  color: texto,
                ),
              ),
              SizedBox(height: 5),
              Text(
                'Confira seus treinos e acompanhe sua evolução.',
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
            borderRadius: BorderRadius.circular(13),
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

  Widget _buildVisaoGeral() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: linha,
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: _buildIndicador(
              icon: Icons.fitness_center_rounded,
              titulo: 'Treinos',
              valor: '08',
              cor: azul,
            ),
          ),

          Container(
            width: 1,
            height: 52,
            color: linha,
          ),

          Expanded(
            child: _buildIndicador(
              icon: Icons.calendar_month_rounded,
              titulo: 'Frequência',
              valor: '92%',
              cor: verde,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildIndicador({
    required IconData icon,
    required String titulo,
    required String valor,
    required Color cor,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: cor.withValues(alpha: 0.10),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              icon,
              color: cor,
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

  Widget _buildProximoTreino() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
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
                  borderRadius: BorderRadius.circular(13),
                ),
                child: const Icon(
                  Icons.sports_rugby_rounded,
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
                      'Fundamentos + preparação física',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 15,
                        color: texto,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),

              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 9,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: verdeClaro,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text(
                  'Hoje',
                  style: TextStyle(
                    color: verde,
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          Container(
            height: 1,
            color: linha,
          ),

          const SizedBox(height: 14),

          Row(
            children: [
              const Icon(
                Icons.calendar_today_outlined,
                size: 16,
                color: textoSecundario,
              ),

              const SizedBox(width: 7),

              const Text(
                'Hoje',
                style: TextStyle(
                  fontSize: 12,
                  color: textoSecundario,
                  fontWeight: FontWeight.w500,
                ),
              ),

              const SizedBox(width: 18),

              Container(
                width: 4,
                height: 4,
                decoration: const BoxDecoration(
                  color: linha,
                  shape: BoxShape.circle,
                ),
              ),

              const SizedBox(width: 18),

              const Icon(
                Icons.access_time_rounded,
                size: 17,
                color: textoSecundario,
              ),

              const SizedBox(width: 7),

              const Text(
                '18:00',
                style: TextStyle(
                  fontSize: 12,
                  color: textoSecundario,
                  fontWeight: FontWeight.w500,
                ),
              ),

              const Spacer(),

              GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const AtletaTreinoPage(),
                    ),
                  );
                },
                child: const Icon(
                  Icons.chevron_right_rounded,
                  color: textoSecundario,
                  size: 22,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildAcao({
    required IconData icon,
    required String titulo,
    required String descricao,
    required Color cor,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(18),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(18),
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(18),
            border: Border.all(
              color: linha,
            ),
          ),
          child: Row(
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: cor.withValues(alpha: 0.10),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  icon,
                  color: cor,
                  size: 21,
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
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: texto,
                      ),
                    ),

                    const SizedBox(height: 3),

                    Text(
                      descricao,
                      style: const TextStyle(
                        fontSize: 11,
                        color: textoSecundario,
                      ),
                    ),
                  ],
                ),
              ),

              const Icon(
                Icons.chevron_right_rounded,
                color: textoSecundario,
                size: 22,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFeedbacks() {
    return Column(
      children: [
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
              bottomLeft: Radius.circular(20),
              bottomRight: Radius.circular(20),
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
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ),

        Expanded(
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.fromLTRB(
              20,
              20,
              20,
              30,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _tituloSecao('Feedbacks do treinador'),

                const SizedBox(height: 5),

                const Text(
                  'Veja os comentários sobre seus treinos.',
                  style: TextStyle(
                    fontSize: 12,
                    color: textoSecundario,
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

  Widget _buildFeedbackCard({
    required String treino,
    required String comentario,
    required String data,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
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
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: verdeClaro,
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
                    fontWeight: FontWeight.w700,
                    color: texto,
                  ),
                ),
              ),

              Text(
                data,
                style: const TextStyle(
                  fontSize: 10,
                  color: textoSecundario,
                ),
              ),
            ],
          ),

          const SizedBox(height: 13),

          Text(
            comentario,
            style: const TextStyle(
              fontSize: 12,
              color: textoSecundario,
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }
}