import 'package:flutter/material.dart';

import '../../assets/menu_inferior_atleta.dart';
import 'atleta_home_page.dart';
import 'atleta_treino_page.dart';
import 'atleta_desempenho_page.dart';
import 'atleta_feed_page.dart';
import 'atleta_perfil_page.dart';

class AtletaNotificacaoPage extends StatelessWidget {
  const AtletaNotificacaoPage({super.key});

  static const Color verde = Color(0xFF006B4F);
  static const Color cinza = Color(0xFF666666);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F1F1),

      body: SafeArea(
        child: Column(
          children: [
            // CABEÇALHO
            Container(
              width: double.infinity,
              padding: const EdgeInsets.only(
                top: 20,
                left: 20,
                right: 20,
                bottom: 20,
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
                      Navigator.pop(context);
                    },
                    child: const Icon(
                      Icons.arrow_back,
                      color: Colors.white,
                      size: 25,
                    ),
                  ),
                  const SizedBox(width: 14),
                  const Text(
                    'Notificações',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontStyle: FontStyle.italic,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                ],
              ),
            ),

            // LISTA DE NOTIFICAÇÕES
            Expanded(
              child: Container(
                width: double.infinity,
                margin: const EdgeInsets.only(
                  left: 5,
                  right: 5,
                ),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(22),
                    topRight: Radius.circular(22),
                  ),
                ),
                child: ListView(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                  ),
                  children: [
                    _notificacao(
                      icone: Icons.calendar_month_outlined,
                      corIcone: const Color(0xFFB45A8B),
                      fundoIcone: const Color(0xFFF7E6F0),
                      titulo: 'Novo treino agendado',
                      descricao: 'Treino de força hoje às 18:00',
                      tempo: 'Agora',
                    ),

                    _notificacao(
                      icone: Icons.check_box_outlined,
                      corIcone: const Color(0xFF70A85C),
                      fundoIcone: const Color(0xFFE8F3E4),
                      titulo: 'Meta concluída',
                      descricao:
                          'Parabéns! Você concluiu a meta\n"Melhorar resistência".',
                      tempo: '20 min',
                    ),

                    _notificacao(
                      icone: Icons.notifications_none,
                      corIcone: const Color(0xFFC47A9F),
                      fundoIcone: const Color(0xFFF7E6F0),
                      titulo: 'Lembrete de treino',
                      descricao: 'Seu treino começa em 30 minutos.',
                      tempo: '1h',
                    ),

                    _notificacao(
                      icone: Icons.sports_handball_outlined,
                      corIcone: const Color(0xFF76A85F),
                      fundoIcone: const Color(0xFFE8F3E4),
                      titulo: 'Novo desafio',
                      descricao:
                          'Participe do desafio\n"30 dias de foco".',
                      tempo: '2h',
                    ),

                    _notificacao(
                      icone: Icons.bar_chart_rounded,
                      corIcone: const Color(0xFF8270B7),
                      fundoIcone: const Color(0xFFEDE9F8),
                      titulo: 'Avaliação disponível',
                      descricao: 'Sua avaliação física está disponível.',
                      tempo: '1d',
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),

      // MENU INFERIOR
      bottomNavigationBar: MenuInferiorAtleta(
        indiceSelecionado: 0,
        onItemSelecionado: (index) {
          // INÍCIO
          if (index == 0) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (_) => const AtletaHomePage(),
              ),
            );
            return;
          }

          // TREINO
          if (index == 1) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (_) => const AtletaTreinoPage(),
              ),
            );
            return;
          }

          // DESEMPENHO
          if (index == 2) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (_) => const AtletaDesempenhoPage(),
              ),
            );
            return;
          }

          // FEED
          if (index == 3) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (_) => const AtletaFeedPage(),
              ),
            );
            return;
          }

          // PERFIL
          if (index == 4) {
            Navigator.pushReplacement(
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

  Widget _notificacao({
    required IconData icone,
    required Color corIcone,
    required Color fundoIcone,
    required String titulo,
    required String descricao,
    required String tempo,
  }) {
    return Container(
      constraints: const BoxConstraints(
        minHeight: 74,
      ),
      padding: const EdgeInsets.symmetric(
        vertical: 12,
      ),
      decoration: const BoxDecoration(
        border: Border(
          bottom: BorderSide(
            color: Color(0xFFE5E5E5),
            width: 1,
          ),
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ÍCONE
          Container(
            width: 25,
            height: 25,
            decoration: BoxDecoration(
              color: fundoIcone,
              borderRadius: BorderRadius.circular(6),
            ),
            child: Icon(
              icone,
              color: corIcone,
              size: 17,
            ),
          ),

          const SizedBox(width: 10),

          // TEXTO
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
                    fontWeight: FontWeight.w600,
                    fontStyle: FontStyle.italic,
                    color: Colors.black,
                  ),
                ),

                const SizedBox(height: 7),

                Text(
                  descricao,
                  style: const TextStyle(
                    fontSize: 9.5,
                    height: 1.2,
                    color: cinza,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(width: 8),

          // TEMPO
          Text(
            tempo,
            style: const TextStyle(
              fontSize: 8.5,
              fontStyle: FontStyle.italic,
              color: cinza,
            ),
          ),
        ],
      ),
    );
  }
}