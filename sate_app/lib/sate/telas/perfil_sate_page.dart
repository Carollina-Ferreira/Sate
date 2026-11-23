import 'equipe_agenda.dart';
import 'perfil_profissional.dart';
import 'package:flutter/material.dart';

import '../data/modelos.dart';
import '../data/sate_store.dart';
import '../ui/cores.dart';
import '../ui/tela.dart';
import '../ui/widgets.dart';
import 'config_perfil_pages.dart';

class _CabecalhoPerfil extends StatelessWidget {
  final String nome, linha;
  final Widget pilula;
  const _CabecalhoPerfil({required this.nome, required this.linha, required this.pilula});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(20, 28, 20, 24),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(30),
        color: c.superficie,
      ),
      child: Column(children: [
        Container(
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(shape: BoxShape.circle, color: c.fundo),
          child: AvatarIni(nome, tamanho: 92),
        ),
        const SizedBox(height: 14),
        Text(nome,
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700, color: c.texto)),
        const SizedBox(height: 3),
        Text(linha, style: TextStyle(fontSize: 13, color: c.texto2)),
        const SizedBox(height: 12),
        pilula,
      ]),
    );
  }
}

class _FaixaNumeros extends StatelessWidget {
  final SC c;
  final List<(String, String)> itens;
  const _FaixaNumeros(this.c, this.itens);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16),
      decoration: BoxDecoration(
        color: c.superficie,
        borderRadius: BorderRadius.circular(22),
      ),
      child: Row(children: [
        for (var i = 0; i < itens.length; i++) ...[
          if (i > 0) Container(width: 1, height: 30, color: c.linha),
          _estatistica(c, itens[i].$1, itens[i].$2),
        ],
      ]),
    );
  }
}

Widget _estatistica(SC c, String v, String r) => Expanded(
      child: Column(children: [
        Text(v, style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700, color: c.texto)),
        const SizedBox(height: 2),
        Text(r, style: TextStyle(fontSize: 12, color: c.texto2)),
      ]),
    );

Widget _linhaInfo(SC c, String r, String v) => Padding(
      padding: const EdgeInsets.symmetric(vertical: 9),
      child: Row(children: [
        Text(r, style: TextStyle(fontSize: 13, color: c.texto2)),
        const SizedBox(width: 12),
        Expanded(
          child: Text(v,
              textAlign: TextAlign.right,
              style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w600, color: c.texto)),
        ),
      ]),
    );

/// Perfil do treinador: identidade, números principais e informações básicas.
class PerfilTreinadorSatePage extends StatelessWidget {
  const PerfilTreinadorSatePage({super.key});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return AnimatedBuilder(
      animation: SateStore.i,
      builder: (context, _) {
        final s = SateStore.i;
        final nome = s.nomeUsuario.isEmpty ? 'Treinador' : s.nomeUsuario;
        final modalidades = s.todasEquipes.map((e) => e.modalidade).toSet().toList();
        return Tela(
          titulo: 'Meu',
          destaque: 'perfil',
          acoes: [
            BotaoIcone(
              icone: Icons.settings_outlined,
              dica: 'Configurações do perfil',
              onTap: () => abrir(context, const ConfigPerfilPage(treinador: true)),
            ),
          ],
          children: [
            Revela(
              child: _CabecalhoPerfil(
                nome: nome,
                linha: s.emailUsuario,
                pilula: Pilula('Treinador', c.rosa, icone: Icons.sports_rounded),
              ),
            ),
            const SizedBox(height: 24),
            _FaixaNumeros(c, [
              ('${s.totalAtletas}', 'Atletas'),
              ('${s.todasEquipes.length}', 'Equipes'),
              ('${modalidades.length}', 'Modalidades'),
            ]),
            const SizedBox(height: 30),
            const SecaoCab('Equipes'),
            const SizedBox(height: 4),
            if (s.todasEquipes.isEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 10),
                child: Text(
                  'Nenhuma equipe ainda. Crie uma equipe pelo site e ela aparece aqui.',
                  style: TextStyle(color: c.texto2),
                ),
              ),
            for (final e in s.todasEquipes)
              LinhaItem(
                icone: Icons.groups_rounded,
                titulo: e.nome,
                sub: '${s.atletasDaEquipe(e.id).length} atletas · ${e.modalidade}'
                    '${e.dias.isEmpty ? ' · defina os dias de treino' : ''}',
                onTap: () => editarEquipe(context, e),
              ),
            const SizedBox(height: 18),
            SecaoCab('Informações profissionais',
                acao: 'Editar', onAcao: () => editarPerfilProfissional(context)),
            const SizedBox(height: 4),
            _linhaInfo(c, 'Formação', s.formacao.isEmpty ? 'Não informado' : s.formacao),
            Divider(height: 1, color: c.linha),
            _linhaInfo(c, 'Registro profissional',
                s.registroProfissional.isEmpty ? 'Não informado' : s.registroProfissional),
            Divider(height: 1, color: c.linha),
            _linhaInfo(
                c, 'Experiência', s.experiencia.isEmpty ? 'Não informado' : s.experiencia),
            const SizedBox(height: 22),
            LinhaItem(
              icone: Icons.manage_accounts_outlined,
              titulo: 'Configurações do perfil',
              sub: 'Informações pessoais, foto e senha',
              fim: Icon(Icons.chevron_right_rounded, color: c.texto2),
              onTap: () => abrir(context, const ConfigPerfilPage(treinador: true)),
            ),
          ],
        );
      },
    );
  }
}

/// Perfil do atleta: identidade, números principais, dados e histórico.
class PerfilAtletaSatePage extends StatelessWidget {
  const PerfilAtletaSatePage({super.key});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return AnimatedBuilder(
      animation: SateStore.i,
      builder: (context, _) {
        final s = SateStore.i;
        final a = s.eu;
        final eq = s.equipe(a.equipeId);
        final h = s.hoje;
        final p30 = s.pct([a], somaDias(h, -30), h);
        final metas = s.metasDe(a.id);
        final concl = metas.where((m) => m.concluida).length;
        return Tela(
          titulo: 'Meu',
          destaque: 'perfil',
          acoes: [
            BotaoIcone(
              icone: Icons.settings_outlined,
              dica: 'Configurações do perfil',
              onTap: () => abrir(context, const ConfigPerfilPage(treinador: false)),
            ),
          ],
          children: [
            Revela(
              child: _CabecalhoPerfil(
                nome: a.nome,
                linha: '${eq.modalidade} · ${a.posicao}',
                pilula: Pilula(eq.nome, c.primaria, icone: Icons.groups_rounded),
              ),
            ),
            const SizedBox(height: 24),
            _FaixaNumeros(c, [
              (p30 == null ? '—' : '${(p30 * 100).round()}%', 'Presença'),
              ('$concl/${metas.length}', 'Metas'),
              ('${s.testesDoAtleta(a).length}', 'Testes'),
            ]),
            const SizedBox(height: 30),
            const SecaoCab('Sobre mim'),
            const SizedBox(height: 4),
            _linhaInfo(c, 'Equipe', eq.nome),
            Divider(height: 1, color: c.linha),
            _linhaInfo(c, 'Posição', a.posicao),
            Divider(height: 1, color: c.linha),
            _linhaInfo(c, 'Idade · altura · peso',
                '${a.idadeTxt} · ${a.alturaTxt} · ${a.pesoTxt}${a.imc == null ? '' : ' · IMC ${a.imcTxt}'}'),
            const SizedBox(height: 22),
            const SecaoCab('Histórico esportivo'),
            const SizedBox(height: 10),
            _Marco(c, '2026', 'Entrada na equipe ${eq.nome}', true),
            _Marco(c, '2025', 'Campeonato escolar · participação', false),
            _Marco(c, '2024', 'Início na modalidade', false),
            const SizedBox(height: 22),
            LinhaItem(
              icone: Icons.manage_accounts_outlined,
              titulo: 'Configurações do perfil',
              sub: 'Informações pessoais, foto e senha',
              fim: Icon(Icons.chevron_right_rounded, color: c.texto2),
              onTap: () => abrir(context, const ConfigPerfilPage(treinador: false)),
            ),
          ],
        );
      },
    );
  }
}

class _Marco extends StatelessWidget {
  final SC c;
  final String ano, texto;
  final bool atual;
  const _Marco(this.c, this.ano, this.texto, this.atual);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(children: [
        SizedBox(
          width: 44,
          child: Text(ano,
              style: TextStyle(
                  fontSize: 13, fontWeight: FontWeight.w700, color: atual ? c.rosa : c.texto2)),
        ),
        Container(
          width: 9,
          height: 9,
          decoration: BoxDecoration(color: atual ? c.rosa : c.vazio, shape: BoxShape.circle),
        ),
        const SizedBox(width: 12),
        Expanded(child: Text(texto, style: TextStyle(fontSize: 13.5, color: c.texto))),
      ]),
    );
  }
}
