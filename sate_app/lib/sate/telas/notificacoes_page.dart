import 'package:flutter/material.dart';

import '../data/sate_store.dart';
import '../ui/cores.dart';
import '../ui/tela.dart';
import '../ui/widgets.dart';
import 'documentos_page.dart';
import 'planos_page.dart';

/// Ícone e cor conforme o tipo da notificação enviada pelo servidor.
IconData _iconeDoTipo(String tipo) {
  if (tipo.startsWith('treino')) return Icons.calendar_month_outlined;
  if (tipo.startsWith('evento')) return Icons.event_outlined;
  if (tipo.startsWith('teste')) return Icons.bar_chart_rounded;
  if (tipo.startsWith('meta')) return Icons.flag_outlined;
  if (tipo.startsWith('feedback')) return Icons.chat_bubble_outline_rounded;
  if (tipo.startsWith('documento')) return Icons.folder_outlined;
  if (tipo.contains('equipe') || tipo.contains('atleta')) return Icons.groups_2_outlined;
  return Icons.notifications_none_rounded;
}

String _tempoRelativo(DateTime quando) {
  final d = DateTime.now().difference(quando);
  if (d.inMinutes < 1) return 'Agora';
  if (d.inMinutes < 60) return '${d.inMinutes} min';
  if (d.inHours < 24) return '${d.inHours} h';
  if (d.inDays < 30) return '${d.inDays} d';
  return '${quando.day.toString().padLeft(2, '0')}/${quando.month.toString().padLeft(2, '0')}';
}

/// Quantidade de avisos que ainda pedem atenção (para o selo do sino):
/// notificações não lidas do servidor + pendências do treinador.
int contarAvisos(bool treinador) {
  final s = SateStore.i;
  return s.notificacoesNaoLidas + (treinador ? s.pendenciasTreinador().length : 0);
}

/// Notificações: avisos, lembretes e (para o treinador) pendências.
class NotificacoesPage extends StatefulWidget {
  final bool treinador;

  /// Chamado com o índice da aba a abrir (a tela se fecha antes).
  final ValueChanged<int>? irPara;
  const NotificacoesPage({super.key, required this.treinador, this.irPara});

  @override
  State<NotificacoesPage> createState() => _NotificacoesPageState();
}

class _NotificacoesPageState extends State<NotificacoesPage> {
  bool get treinador => widget.treinador;
  ValueChanged<int>? get irPara => widget.irPara;

  @override
  void initState() {
    super.initState();
    // Ao abrir, busca no servidor as notificações mais recentes (inclusive as do site).
    SateStore.i.sincronizar(silencioso: true);
  }

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
        final avisos = s.notificacoes;
        final naoLidas = s.notificacoesNaoLidas;
        return Tela(
          // Só o "es" fica em itálico, colado ao restante da palavra.
          titulo: 'Notificaçõ',
          destaque: 'es',
          colado: true,
          subtitulo: treinador
              ? 'Avisos e pendências que pedem sua atenção'
              : 'Avisos e lembretes',
          acoes: [
            if (naoLidas > 0)
              TextButton(
                onPressed: s.marcarTodasNotifLidas,
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
            if (avisos.isEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 24),
                child: Text(
                  s.erroSincronizacao ?? 'Você não tem notificações no momento.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: c.texto2),
                ),
              ),
            for (final a in avisos)
              LinhaItem(
                icone: _iconeDoTipo(a.tipo),
                cor: a.lida ? c.ok : c.rosa,
                titulo: a.titulo,
                sub: '${a.texto} · ${_tempoRelativo(a.quando)}',
                fim: a.lida
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
