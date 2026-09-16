import 'package:flutter/material.dart';

class MenuInferiorTreinador extends StatelessWidget {
  final int indiceSelecionado;
  final Function(int) onItemSelecionado;

  const MenuInferiorTreinador({
    super.key,
    required this.indiceSelecionado,
    required this.onItemSelecionado,
  });

  static const Color verde = Color(0xFF006B4F);
  static const Color cinza = Color(0xFF8A8A8A);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(
          top: BorderSide(
            color: Color(0xFFE5E5E5),
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
                texto: 'Treinos',
              ),

              _item(
                indice: 2,
                icone: Icons.groups_outlined,
                iconeSelecionado: Icons.groups_rounded,
                texto: 'Atletas',
              ),

              _item(
                indice: 3,
                icone: Icons.dynamic_feed_outlined,
                iconeSelecionado: Icons.dynamic_feed_rounded,
                texto: 'Feed',
              ),

              _item(
                indice: 4,
                icone: Icons.calendar_month_outlined,
                iconeSelecionado: Icons.calendar_month_rounded,
                texto: 'Agenda',
              ),

              _item(
                indice: 5,
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
        splashColor: verde.withValues(alpha: 0.08),
        highlightColor: Colors.transparent,
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                selecionado ? iconeSelecionado : icone,
                size: 22,
                color: selecionado ? verde : cinza,
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