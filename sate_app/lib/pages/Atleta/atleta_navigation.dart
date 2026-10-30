import 'package:flutter/material.dart';

import 'atleta_home_page.dart';
import 'atleta_treino_page.dart';
import 'atleta_desempenho_page.dart';
import 'atleta_feed_page.dart';
import 'atleta_perfil_page.dart';

import '../../assets/menu_inferior_atleta.dart';

class AtletaNavigation extends StatefulWidget {
  final String nomeUsuario;
  final String emailUsuario;

  const AtletaNavigation({
    super.key,
    required this.nomeUsuario,
    required this.emailUsuario,
  });

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
      AtletaPerfilPage(
        nomeUsuario: widget.nomeUsuario,
        emailUsuario: widget.emailUsuario,
      ),
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
      backgroundColor: const Color(0xFFFAF5EE),

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