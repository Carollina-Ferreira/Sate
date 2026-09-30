import 'package:flutter/material.dart';

class AtletaNotificacaoPage extends StatelessWidget {
  const AtletaNotificacaoPage({super.key});

  static const Color verde = Color(0xFF00845F);
  static const Color verdeEscuro = Color(0xFF006B4F);
  static const Color fundo = Color(0xFFF7F7F7);
  static const Color cinza = Color(0xFF777777);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: fundo,
      body: SafeArea(
        child: Column(
          children: [
            _buildCabecalho(context),

            Expanded(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(
                  16,
                  16,
                  16,
                  30,
                ),
                children: [
                  _buildTituloSecao(),

                  const SizedBox(height: 12),

                  _notificacao(
                    icone: Icons.calendar_month_outlined,
                    corIcone: const Color(0xFFB45A8B),
                    fundoIcone: const Color(0xFFF7E6F0),
                    titulo: 'Novo treino agendado',
                    descricao: 'Treino de força hoje às 18:00',
                    tempo: 'Agora',
                    nova: true,
                  ),

                  _notificacao(
                    icone: Icons.check_box_outlined,
                    corIcone: const Color(0xFF70A85C),
                    fundoIcone: const Color(0xFFE8F3E4),
                    titulo: 'Meta concluída',
                    descricao:
                        'Parabéns! Você concluiu a meta\n'
                        '"Melhorar resistência".',
                    tempo: '20 min',
                    nova: true,
                  ),

                  _notificacao(
                    icone: Icons.notifications_none_rounded,
                    corIcone: const Color(0xFFC47A9F),
                    fundoIcone: const Color(0xFFF7E6F0),
                    titulo: 'Lembrete de treino',
                    descricao:
                        'Seu treino começa em 30 minutos.',
                    tempo: '1h',
                    nova: false,
                  ),

                  _notificacao(
                    icone: Icons.sports_handball_outlined,
                    corIcone: const Color(0xFF76A85F),
                    fundoIcone: const Color(0xFFE8F3E4),
                    titulo: 'Novo desafio',
                    descricao:
                        'Participe do desafio\n'
                        '"30 dias de foco".',
                    tempo: '2h',
                    nova: false,
                  ),

                  _notificacao(
                    icone: Icons.bar_chart_rounded,
                    corIcone: const Color(0xFF8270B7),
                    fundoIcone: const Color(0xFFEDE9F8),
                    titulo: 'Avaliação disponível',
                    descricao:
                        'Sua avaliação física está disponível.',
                    tempo: '1d',
                    nova: false,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCabecalho(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(
        16,
        8,
        16,
        14,
      ),
      decoration: const BoxDecoration(
        color: verdeEscuro,
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(22),
          bottomRight: Radius.circular(22),
        ),
      ),
      child: Row(
        children: [
          IconButton(
            onPressed: () {
              Navigator.pop(context);
            },
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(
              minWidth: 40,
              minHeight: 40,
            ),
            icon: const Icon(
              Icons.arrow_back_rounded,
              color: Colors.white,
              size: 24,
            ),
          ),

          const SizedBox(width: 4),

          const Expanded(
            child: Text(
              'Notificações',
              style: TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),

          IconButton(
            onPressed: () {
              _mostrarOpcoes(context);
            },
            icon: const Icon(
              Icons.more_horiz_rounded,
              color: Colors.white,
              size: 25,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTituloSecao() {
    return Row(
      children: [
        const Text(
          'Notificações recentes',
          style: TextStyle(
            fontSize: 17,
            fontWeight: FontWeight.bold,
            color: Colors.black87,
          ),
        ),

        const Spacer(),

        Text(
          '5 notificações',
          style: TextStyle(
            fontSize: 10,
            color: cinza,
          ),
        ),
      ],
    );
  }

  Widget _notificacao({
    required IconData icone,
    required Color corIcone,
    required Color fundoIcone,
    required String titulo,
    required String descricao,
    required String tempo,
    required bool nova,
  }) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(17),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.025),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: fundoIcone,
                borderRadius: BorderRadius.circular(13),
              ),
              child: Icon(
                icone,
                color: corIcone,
                size: 24,
              ),
            ),

            const SizedBox(width: 12),

            Expanded(
              child: Column(
                crossAxisAlignment:
                    CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment:
                        CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Text(
                          titulo,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: Colors.black87,
                          ),
                        ),
                      ),

                      const SizedBox(width: 8),

                      Text(
                        tempo,
                        style: TextStyle(
                          fontSize: 9,
                          color: cinza,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 5),

                  Text(
                    descricao,
                    style: const TextStyle(
                      fontSize: 11,
                      height: 1.35,
                      color: Color(0xFF777777),
                    ),
                  ),

                  if (nova) ...[
                    const SizedBox(height: 8),

                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEAF5F1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Text(
                        'Nova',
                        style: TextStyle(
                          fontSize: 8,
                          fontWeight: FontWeight.w600,
                          color: verde,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _mostrarOpcoes(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(22),
        ),
      ),
      builder: (context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: const Icon(
                  Icons.done_all_rounded,
                  color: verde,
                ),
                title: const Text(
                  'Marcar todas como lidas',
                ),
                onTap: () {
                  Navigator.pop(context);
                },
              ),

              ListTile(
                leading: const Icon(
                  Icons.delete_outline_rounded,
                  color: Colors.redAccent,
                ),
                title: const Text(
                  'Limpar notificações',
                ),
                onTap: () {
                  Navigator.pop(context);
                },
              ),

              const SizedBox(height: 8),
            ],
          ),
        );
      },
    );
  }
}