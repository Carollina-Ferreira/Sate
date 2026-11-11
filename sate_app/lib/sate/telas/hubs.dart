import 'package:flutter/material.dart';

import '../ui/tela.dart';
import 'atletas_page.dart';
import 'estatisticas_page.dart';
import 'evolucao_atleta.dart';
import 'exercicios_page.dart';
import 'planejamento_page.dart';
import 'testes_page.dart';

/// Aba "Atletas" do treinador: atletas, testes físicos e estatísticas de desempenho.
class AtletasHub extends StatefulWidget {
  const AtletasHub({super.key});

  @override
  State<AtletasHub> createState() => _AtletasHubState();
}

class _AtletasHubState extends State<AtletasHub> {
  int _v = 0;

  @override
  Widget build(BuildContext context) {
    return Tela(
      voltar: false,
      mostrarTitulo: false,
      titulo: '',
      destaque: '',
      children: [
        Segmentos(
          rotulos: const ['Atletas', 'Testes', 'Desempenho'],
          indice: _v,
          onChanged: (i) => setState(() => _v = i),
        ),
        const SizedBox(height: 16),
        switch (_v) {
          0 => const AtletasListaView(),
          1 => const TestesPage(treinador: true, embutido: true, comVoltar: false),
          _ => const EstatisticasPage(embutido: true),
        },
      ],
    );
  }
}

/// Aba "Treinos": planejamento por período e biblioteca de exercícios.
class TreinosHub extends StatefulWidget {
  final bool treinador;
  const TreinosHub({super.key, required this.treinador});

  @override
  State<TreinosHub> createState() => _TreinosHubState();
}

class _TreinosHubState extends State<TreinosHub> {
  int _v = 0;

  @override
  Widget build(BuildContext context) {
    return Tela(
      voltar: false,
      mostrarTitulo: false,
      titulo: '',
      destaque: '',
      children: [
        Segmentos(
          rotulos: const ['Planejamento', 'Exercícios'],
          indice: _v,
          onChanged: (i) => setState(() => _v = i),
        ),
        const SizedBox(height: 16),
        _v == 0
            ? PlanejamentoPage(treinador: widget.treinador, embutido: true)
            : ExerciciosPage(treinador: widget.treinador, embutido: true),
      ],
    );
  }
}

/// Aba "Evolução" do atleta: a área "Minha evolução" da versão anterior.
class EvolucaoAba extends StatelessWidget {
  const EvolucaoAba({super.key});

  @override
  Widget build(BuildContext context) {
    return const Tela(
      voltar: false,
      mostrarTitulo: false,
      titulo: '',
      destaque: '',
      children: [EvolucaoAtletaView()],
    );
  }
}
