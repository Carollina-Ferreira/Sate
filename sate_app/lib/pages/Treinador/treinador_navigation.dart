import 'package:flutter/material.dart';

import 'treinador_home_page.dart';
import 'treinos_page.dart';
import 'atletas_page.dart';
import 'feed_page.dart';
import 'agenda_page.dart';
import 'perfil_page.dart';

import '../../assets/menu_inferior_treinador.dart';

class TreinadorNavigation extends StatefulWidget {
  const TreinadorNavigation({super.key});

  @override
  State<TreinadorNavigation> createState() =>
      _TreinadorNavigationState();
}

class _TreinadorNavigationState
    extends State<TreinadorNavigation> {
  int indiceSelecionado = 0;

  late final List<Widget> paginas;

  @override
  void initState() {
    super.initState();

    paginas = [
      const TreinadorHomePage(),
      const TreinosPage(),
      const AtletasPage(),
      const FeedPage(),
      const AgendaPage(),
      const PerfilPage(),
    ];
  }

  void mudarPagina(int indice) {
    setState(() {
      indiceSelecionado = indice;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: indiceSelecionado,
        children: paginas,
      ),

      bottomNavigationBar: MenuInferiorTreinador(
        indiceSelecionado: indiceSelecionado,

        onItemSelecionado: (indice) {
          mudarPagina(indice);
        },
      ),
    );
  }
}