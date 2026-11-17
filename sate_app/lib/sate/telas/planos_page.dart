import 'package:flutter/material.dart';

import '../data/modelos.dart';
import '../data/sate_store.dart';
import '../ui/cores.dart';
import '../ui/tela.dart';
import '../ui/widgets.dart';

/// Planos do SATE: limite de atletas e comparação.
class PlanosSatePage extends StatelessWidget {
  const PlanosSatePage({super.key});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return AnimatedBuilder(
      animation: SateStore.i,
      builder: (context, _) {
        final s = SateStore.i;
        final atual = planosSate[s.planoAtual];
        final usados = s.totalAtletas;
        final livres = (atual.limite - usados).clamp(0, 9999).toInt();

        return Tela(
          titulo: 'Planos do',
          destaque: 'SATE',
          subtitulo: 'Escolha o plano ideal para a sua equipe',
          children: [
            Revela(
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: c.heroSolido,
                  borderRadius: BorderRadius.circular(26),
                ),
                child: Row(children: [
                  AnelPct(
                    valor: (usados / atual.limite).clamp(0.0, 1.0).toDouble(),
                    tamanho: 92,
                    espessura: 10,
                    cor: Colors.white,
                    centro: Text('$usados',
                        style: const TextStyle(
                            fontSize: 24, fontWeight: FontWeight.w700, color: Colors.white)),
                  ),
                  const SizedBox(width: 18),
                  Expanded(
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      const Text('Plano atual',
                          style: TextStyle(fontSize: 12, color: Colors.white70)),
                      Text(atual.nome,
                          style: const TextStyle(
                              fontSize: 22, fontWeight: FontWeight.w700, color: Colors.white)),
                      const SizedBox(height: 6),
                      Text('$usados de ${atual.limite} atletas cadastrados',
                          style: const TextStyle(fontSize: 13, color: Colors.white)),
                      Text(livres == 0 && usados > atual.limite
                              ? '${usados - atual.limite} acima do limite'
                              : '$livres vagas disponíveis',
                          style: const TextStyle(fontSize: 12.5, color: Colors.white70)),
                    ]),
                  ),
                ]),
              ),
            ),
            const SizedBox(height: 22),
            const SecaoCab('Comparar planos'),
            const SizedBox(height: 10),
            for (var i = 0; i < planosSate.length; i++)
              Revela(
                ordem: i,
                child: Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: _CartaoPlano(
                    plano: planosSate[i],
                    atual: i == s.planoAtual,
                    onEscolher: () => _escolher(context, i),
                  ),
                ),
              ),
          ],
        );
      },
    );
  }

  Future<void> _escolher(BuildContext context, int i) async {
    final p = planosSate[i];
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Selecionar ${p.nome}?'),
        content: Text(
            '${p.precoTxt}/mês · até ${p.limite} atletas.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancelar')),
          TextButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Selecionar')),
        ],
      ),
    );
    if (ok == true) {
      await SateStore.i.escolherPlano(i);
      if (context.mounted) aviso(context, '${p.nome} selecionado.');
    }
  }
}

class _CartaoPlano extends StatelessWidget {
  final Plano plano;
  final bool atual;
  final VoidCallback onEscolher;
  const _CartaoPlano({required this.plano, required this.atual, required this.onEscolher});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: c.superficie,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: atual ? c.rosa : Colors.transparent, width: 2),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Expanded(
            child: Text(plano.nome,
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700, color: c.texto)),
          ),
          if (atual) Pilula('Plano atual', c.rosa, icone: Icons.check_rounded),
        ]),
        const SizedBox(height: 6),
        Row(crossAxisAlignment: CrossAxisAlignment.end, children: [
          Text(plano.precoTxt,
              style: TextStyle(
                  fontSize: 26, fontWeight: FontWeight.w700, color: c.primaria, height: 1.1)),
          Text(' /mês', style: TextStyle(fontSize: 13, color: c.texto2)),
        ]),
        const SizedBox(height: 4),
        Text('Até ${plano.limite} atletas',
            style: TextStyle(fontSize: 13, color: c.texto2)),
        const SizedBox(height: 12),
        for (final b in plano.beneficios)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 3),
            child: Row(children: [
              Icon(Icons.check_circle_rounded, size: 17, color: c.ok),
              const SizedBox(width: 10),
              Expanded(child: Text(b, style: TextStyle(fontSize: 13.5, color: c.texto))),
            ]),
          ),
        if (!atual) ...[
          const SizedBox(height: 14),
          OutlinedButton(
            onPressed: onEscolher,
            style: OutlinedButton.styleFrom(
              minimumSize: const Size.fromHeight(46),
              foregroundColor: c.primaria,
              side: BorderSide(color: c.primaria.withValues(alpha: 0.6)),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
            child: const Text('Selecionar este plano'),
          ),
        ],
      ]),
    );
  }
}
