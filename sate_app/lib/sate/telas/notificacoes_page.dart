import 'package:flutter/material.dart';

import '../data/sate_store.dart';
import '../ui/cores.dart';
import '../ui/tela.dart';
import '../ui/widgets.dart';
import 'documentos_page.dart';
import 'planos_page.dart';

class _Aviso {
  final String id;
  final IconData icone;
  final String titulo, texto, tempo;
  final bool rosa;
  const _Aviso(this.id, this.icone, this.titulo, this.texto, this.tempo, this.rosa);
}

// Mesmo conteúdo das notificações da versão anterior.
const List<_Aviso> _avisos = [
  _Aviso('n1', Icons.calendar_month_outlined, 'Novo treino agendado',
      'Treino de força hoje às 18:00', 'Agora', true),
  _Aviso('n2', Icons.flag_outlined, 'Meta concluída',
      'Parabéns! A meta "Melhorar resistência" foi concluída.', '20 min', false),
  _Aviso('n3', Icons.notifications_none_rounded, 'Lembrete de treino',
      'O treino começa em 30 minutos.', '1h', true),
  _Aviso('n4', Icons.sports_handball_outlined, 'Novo desafio',
      'Participe do desafio "30 dias de foco".', '2h', false),
  _Aviso('n5', Icons.bar_chart_rounded, 'Avaliação disponível',
      'Uma nova avaliação física foi disponibilizada.', '1d', false),
];

/// Quantidade de avisos que ainda pedem atenção (para o selo do sino).
int contarAvisos(bool treinador) {
  final s = SateStore.i;
  final novos = _avisos.where((a) => !s.notifLidas.contains(a.id)).length;
  return novos + (treinador ? s.pendenciasTreinador().length : 0);
}

/// Notificações: avisos, lembretes e (para o treinador) pendências.
class NotificacoesPage extends StatelessWidget {
  final bool treinador;

  /// Chamado com o índice da aba a abrir (a tela se fecha antes).
  final ValueChanged<int>? irPara;
  const NotificacoesPage({super.key, required this.treinador, this.irPara});

  void _abrirDestino(BuildContext context, String destino) {
    switch (destino) {
      case 'docs':
        abrir(context, const DocumentosPage());
      case 'planos':
        abrir(context, const PlanosSatePage());
      case 'atletas':
        Navigator.of(context).pop();
        irPara?.call(1);
      case 'calendario':
        Navigator.of(context).pop();
        irPara?.call(3);
    }
  }

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return AnimatedBuilder(
      animation: SateStore.i,
      builder: (context, _) {
        final s = SateStore.i;
        final pend = treinador ? s.pendenciasTreinador() : const [];
        final naoLidas = _avisos.where((a) => !s.notifLidas.contains(a.id)).length;
        return Tela(
          titulo: 'Notifi',
          destaque: 'cações',
          subtitulo: treinador
              ? 'Avisos e pendências que pedem sua atenção'
              : 'Avisos e lembretes',
          acoes: [
            if (naoLidas > 0)
              TextButton(
                onPressed: () {
                  for (final a in _avisos) {
                    s.notifLidas.add(a.id);
                  }
                  s.marcarNotifLida('n1');
                },
                child: Text('Marcar lidas', style: TextStyle(color: c.rosa)),
              ),
          ],
          children: [
            if (pend.isNotEmpty) ...[
              const SecaoCab('Precisa de atenção'),
              const SizedBox(height: 4),
              for (final p in pend)
                LinhaItem(
                  icone: p.destino == 'docs'
                      ? Icons.folder_off_outlined
                      : (p.destino == 'planos'
                          ? Icons.workspace_premium_outlined
                          : (p.destino == 'calendario'
                              ? Icons.fact_check_outlined
                              : Icons.person_search_outlined)),
                  cor: p.destino == 'calendario' ? c.pendente : c.vermelho,
                  titulo: p.titulo,
                  sub: p.sub,
                  fim: Icon(Icons.chevron_right_rounded, color: c.texto2),
                  onTap: () => _abrirDestino(context, p.destino),
                ),
              const SizedBox(height: 18),
            ],
            const SecaoCab('Recentes'),
            const SizedBox(height: 4),
            for (final a in _avisos)
              LinhaItem(
                icone: a.icone,
                cor: a.rosa ? c.rosa : c.ok,
                titulo: a.titulo,
                sub: '${a.texto} · ${a.tempo}',
                fim: s.notifLidas.contains(a.id)
                    ? null
                    : Container(
                        width: 9,
                        height: 9,
                        decoration: BoxDecoration(color: c.rosa, shape: BoxShape.circle),
                      ),
                onTap: () => s.marcarNotifLida(a.id),
              ),
          ],
        );
      },
    );
  }
}
