import 'package:flutter/material.dart';

import '../../sate/telas/calendario_page.dart';
import '../../sate/telas/casca_sate.dart';
import '../../sate/telas/comunidade_page.dart';
import '../../sate/telas/hubs.dart';
import '../../sate/telas/inicio_treinador.dart';
import '../../sate/ui/widgets.dart';

/// Estrutura interna do treinador (depois do login e do vínculo com a equipe).
/// Abas: Início, Atletas, Treinos, Calendário e Comunidade.
/// Documentação, notificações, configurações e ajuda ficam na gaveta lateral.
class TreinadorNavigation extends StatelessWidget {
  final String nomeUsuario;
  final String emailUsuario;

  const TreinadorNavigation({
    super.key,
    required this.nomeUsuario,
    required this.emailUsuario,
  });

  @override
  Widget build(BuildContext context) {
    return CascaSate(
      treinador: true,
      nome: nomeUsuario,
      email: emailUsuario,
      titulos: const [
        ('Seu', 'início'),
        ('Seus', 'atletas'),
        ('Seus', 'treinos'),
        ('Seu', 'calendário'),
        ('Nossa', 'comunidade'),
      ],
      itens: const [
        ItemNav(Icons.home_outlined, Icons.home_rounded, 'Início'),
        ItemNav(Icons.groups_outlined, Icons.groups_rounded, 'Atletas'),
        ItemNav(Icons.fitness_center_outlined, Icons.fitness_center_rounded, 'Treinos'),
        ItemNav(Icons.calendar_month_outlined, Icons.calendar_month_rounded, 'Calendário'),
        ItemNav(Icons.forum_outlined, Icons.forum_rounded, 'Comunidade'),
      ],
      paginas: (ir) => [
        InicioTreinadorPage(irPara: ir),
        const AtletasHub(),
        const TreinosHub(treinador: true),
        const CalendarioPage(treinador: true),
        const ComunidadePage(),
      ],
    );
  }
}
