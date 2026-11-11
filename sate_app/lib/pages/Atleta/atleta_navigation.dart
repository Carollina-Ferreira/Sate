import 'package:flutter/material.dart';

import '../../sate/telas/calendario_page.dart';
import '../../sate/telas/casca_sate.dart';
import '../../sate/telas/comunidade_page.dart';
import '../../sate/telas/hubs.dart';
import '../../sate/telas/inicio_atleta.dart';
import '../../sate/ui/widgets.dart';

/// Estrutura interna do atleta (depois do login e do vínculo com a equipe).
/// Abas: Início, Treinos, Calendário, Evolução e Comunidade.
/// Perfil, notificações, configurações e ajuda ficam no cabeçalho e na gaveta lateral.
/// Recursos exclusivos de treinador não aparecem aqui.
class AtletaNavigation extends StatelessWidget {
  final String nomeUsuario;
  final String emailUsuario;

  const AtletaNavigation({
    super.key,
    required this.nomeUsuario,
    required this.emailUsuario,
  });

  @override
  Widget build(BuildContext context) {
    return CascaSate(
      treinador: false,
      nome: nomeUsuario,
      email: emailUsuario,
      titulos: const [
        ('Seu', 'início'),
        ('Meus', 'treinos'),
        ('Meu', 'calendário'),
        ('Minha', 'evolução'),
        ('Nossa', 'comunidade'),
      ],
      itens: const [
        ItemNav(Icons.home_outlined, Icons.home_rounded, 'Início'),
        ItemNav(Icons.fitness_center_outlined, Icons.fitness_center_rounded, 'Treinos'),
        ItemNav(Icons.calendar_month_outlined, Icons.calendar_month_rounded, 'Calendário'),
        ItemNav(Icons.trending_up_rounded, Icons.trending_up_rounded, 'Evolução'),
        ItemNav(Icons.forum_outlined, Icons.forum_rounded, 'Comunidade'),
      ],
      paginas: (ir) => [
        InicioAtletaPage(irPara: ir),
        const TreinosHub(treinador: false),
        const CalendarioPage(treinador: false),
        const EvolucaoAba(),
        const ComunidadePage(),
      ],
    );
  }
}
