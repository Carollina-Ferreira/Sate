import 'package:flutter/material.dart';
import '../../theme/sate_theme.dart';

class TreinadorNotificacaoPage extends StatelessWidget {
  const TreinadorNotificacaoPage({super.key});

  static const Color verde = Color(0xFF005942);
  static const Color fundo = Color(0xFFFAF5EE);
  static const Color cinza = Color(0xFF68736F);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: fundo,

      appBar: AppBar(
        backgroundColor: fundo,
        elevation: 0,
        centerTitle: false,

        leading: IconButton(
          onPressed: () {
            Navigator.pop(context);
          },
          icon: const Icon(
            Icons.arrow_back_rounded,
            color: Color(0xFF10251F),
          ),
        ),

        title: const Text.rich(
          TextSpan(children: [TextSpan(text: 'Notificações', style: SateEstilo.destaque)]),
          style: TextStyle(
            color: Color(0xFF10251F),
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),

        actions: [
          IconButton(
            onPressed: () {
              _mostrarOpcoes(context);
            },
            icon: const Icon(
              Icons.more_horiz_rounded,
              color: Color(0xFF10251F),
              size: 25,
            ),
          ),

          const SizedBox(width: 4),
        ],
      ),

      body: ListView(
        padding: const EdgeInsets.fromLTRB(
          16,
          16,
          16,
          30,
        ),
        children: [
          _notificacao(
            icone: Icons.calendar_month_outlined,
            corIcone: const Color(0xFFC9305A),
            fundoIcone: const Color(0xFFFDE6EC),
            titulo: 'Novo treino agendado',
            descricao: 'Treino de força hoje às 18:00',
            tempo: 'Agora',
            nova: true,
          ),

          _notificacao(
            icone: Icons.check_box_outlined,
            corIcone: const Color(0xFF005942),
            fundoIcone: const Color(0xFFDFF7EE),
            titulo: 'Meta concluída',
            descricao:
                'Parabéns! Você concluiu a meta\n'
                '"Melhorar resistência".',
            tempo: '20 min',
            nova: true,
          ),

          _notificacao(
            icone: Icons.notifications_none_rounded,
            corIcone: const Color(0xFFC9305A),
            fundoIcone: const Color(0xFFFDE6EC),
            titulo: 'Lembrete de treino',
            descricao:
                'Seu treino começa em 30 minutos.',
            tempo: '1h',
            nova: false,
          ),

          _notificacao(
            icone: Icons.sports_handball_outlined,
            corIcone: const Color(0xFF005942),
            fundoIcone: const Color(0xFFDFF7EE),
            titulo: 'Novo desafio',
            descricao:
                'Participe do desafio\n'
                '"30 dias de foco".',
            tempo: '2h',
            nova: false,
          ),

          _notificacao(
            icone: Icons.bar_chart_rounded,
            corIcone: const Color(0xFF003D31),
            fundoIcone: const Color(0xFFDFF7EE),
            titulo: 'Avaliação disponível',
            descricao:
                'Sua avaliação física está disponível.',
            tempo: '1d',
            nova: false,
          ),
        ],
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
    required bool nova,
  }) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(17),
        border: Border.all(
          color: Color(0xFFE8DFD3),
        ),
        boxShadow: [
          BoxShadow(
            color: Color(0xFF10251F).withValues(
              alpha: 0.025,
            ),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          crossAxisAlignment:
              CrossAxisAlignment.start,
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: fundoIcone,
                borderRadius:
                    BorderRadius.circular(13),
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
                            fontWeight:
                                FontWeight.bold,
                            color: Color(0xFF10251F),
                          ),
                        ),
                      ),

                      const SizedBox(width: 8),

                      Text(
                        tempo,
                        style: const TextStyle(
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
                      color: Color(0xFF68736F),
                    ),
                  ),

                  if (nova) ...[
                    const SizedBox(height: 8),

                    Container(
                      padding:
                          const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(
                          0xFFEAF5F1,
                        ),
                        borderRadius:
                            BorderRadius.circular(10),
                      ),
                      child: const Text(
                        'Nova',
                        style: TextStyle(
                          fontSize: 8,
                          fontWeight:
                              FontWeight.w600,
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
                  color: Color(0xFFC9305A),
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