import 'package:flutter/material.dart';

import 'atleta_home_page.dart';
import 'atleta_treino_page.dart';
import 'atleta_desempenho_page.dart';
import 'atleta_feed_page.dart';
import 'atleta_perfil_page.dart';

import '../../assets/menu_inferior_atleta.dart';

class AtletaNavigation extends StatefulWidget {
  const AtletaNavigation({super.key});

  @override
  State<AtletaNavigation> createState() => _AtletaNavigationState();
}

class _AtletaNavigationState extends State<AtletaNavigation> {
  int indiceSelecionado = 0;

  late final List<Widget> paginas;

  @override
  void initState() {
    super.initState();

    paginas = [
      const AtletaHomePage(),
      const AtletaTreinoPage(),
      const AtletaDesempenhoPage(),
      const AtletaFeedPage(),
      const AtletaPerfilPage(),
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

      bottomNavigationBar: MenuInferiorAtleta(
        indiceSelecionado: indiceSelecionado,

        onItemSelecionado: (indice) {
          mudarPagina(indice);
        },
      ),
    );
  }
}