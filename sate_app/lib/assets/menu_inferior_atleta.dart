import 'package:flutter/material.dart';

class MenuInferiorAtleta extends StatelessWidget {
  final int indiceSelecionado;
  final Function(int) onItemSelecionado;

  const MenuInferiorAtleta({
    super.key,
    required this.indiceSelecionado,
    required this.onItemSelecionado,
  });

  static const Color verde = Color(0xFF005942);
  static const Color rosa = Color(0xFFEF476F);
  static const Color cinza = Color(0xFF68736F);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(
          top: BorderSide(
            color: Color(0xFFE8DFD3),
            width: 1,
          ),
        ),
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 68,
          child: Row(
            children: [
              _item(
                indice: 0,
                icone: Icons.home_outlined,
                iconeSelecionado: Icons.home_rounded,
                texto: 'Início',
              ),

              _item(
                indice: 1,
                icone: Icons.fitness_center_outlined,
                iconeSelecionado: Icons.fitness_center,
                texto: 'Treino',
              ),

              _item(
                indice: 2,
                icone: Icons.bar_chart_outlined,
                iconeSelecionado: Icons.bar_chart_rounded,
                texto: 'Desempenho',
              ),

              _item(
                indice: 3,
                icone: Icons.dynamic_feed_outlined,
                iconeSelecionado: Icons.dynamic_feed_rounded,
                texto: 'Feed',
              ),

              _item(
                indice: 4,
                icone: Icons.person_outline_rounded,
                iconeSelecionado: Icons.person_rounded,
                texto: 'Perfil',
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _item({
    required int indice,
    required IconData icone,
    required IconData iconeSelecionado,
    required String texto,
  }) {
    final bool selecionado = indiceSelecionado == indice;

    return Expanded(
      child: InkWell(
        onTap: () => onItemSelecionado(indice),
        splashColor: rosa.withValues(alpha: 0.10),
        highlightColor: Colors.transparent,
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                selecionado ? iconeSelecionado : icone,
                size: 22,
                color: selecionado ? rosa : cinza,
              ),

              const SizedBox(height: 4),

              Text(
                texto,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: selecionado
                      ? FontWeight.w600
                      : FontWeight.w400,
                  color: selecionado ? verde : cinza,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}