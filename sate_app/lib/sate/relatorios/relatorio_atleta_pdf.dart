import 'dart:math' as math;
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';

import '../data/modelos.dart';
import '../data/sate_store.dart';
import '../ui/cores.dart';
import '../ui/widgets.dart';

// ─────────────────────────────────────────────────────────────────────────────
// Relatório individual do atleta em PDF.
// Usa somente dados que já existem no aplicativo (nada é inventado): quando uma
// seção não tem registros, o relatório informa isso.
// ─────────────────────────────────────────────────────────────────────────────

const PdfColor _verde = PdfColor.fromInt(0xFF16A875);
const PdfColor _verdeEscuro = PdfColor.fromInt(0xFF005942);
const PdfColor _rosa = PdfColor.fromInt(0xFFEF476F);
const PdfColor _texto = PdfColor.fromInt(0xFF12261F);
const PdfColor _texto2 = PdfColor.fromInt(0xFF6C7C77);
const PdfColor _linha = PdfColor.fromInt(0xFFE1E8E4);
const PdfColor _fundo = PdfColor.fromInt(0xFFF6F9F7);
const PdfColor _branco = PdfColors.white;

class _Fontes {
  final pw.Font regular, medio, negrito, italico, serifa;

  const _Fontes(
    this.regular,
    this.medio,
    this.negrito,
    this.italico,
    this.serifa,
  );

  static Future<_Fontes> carregar() async {
    Future<pw.Font> f(String caminho) async =>
        pw.Font.ttf(await rootBundle.load(caminho));

    return _Fontes(
      await f('assets/fonts/Poppins-Regular.ttf'),
      await f('assets/fonts/Poppins-Medium.ttf'),
      await f('assets/fonts/Poppins-Bold.ttf'),
      await f('assets/fonts/Poppins-Italic.ttf'),
      await f('assets/fonts/DMSerifDisplay-Italic.ttf'),
    );
  }
}

String _dataHora(DateTime d) =>
    '${dataBr(d)} às ${d.hour.toString().padLeft(2, '0')}:${d.minute.toString().padLeft(2, '0')}';

String _slug(String t) {
  const de = 'áàâãäéèêëíìîïóòôõöúùûüç';
  const para = 'aaaaaeeeeiiiiooooouuuuc';

  final b = StringBuffer();

  for (final ch in t.toLowerCase().split('')) {
    final i = de.indexOf(ch);
    final x = i >= 0 ? para[i] : ch;

    b.write(RegExp(r'[a-z0-9]').hasMatch(x) ? x : '_');
  }

  return b.toString().replaceAll(RegExp(r'_+'), '_');
}

/// Gera o PDF do relatório do atleta [a].
Future<Uint8List> gerarRelatorioAtletaPdf(Atleta a) async {
  final s = SateStore.i;
  final eq = s.equipe(a.equipeId);
  final agora = DateTime.now();
  final hoje = s.hoje;
  final fontes = await _Fontes.carregar();

  // ── dados ────────────────────────────────────────────────────────────────

  final ult30 = s.contagem([a], somaDias(hoje, -29), hoje);

  final meses = <({String rotulo, double? pct})>[];

  for (var i = 5; i >= 0; i--) {
    final ini = DateTime(hoje.year, hoje.month - i, 1);

    var fim = DateTime(hoje.year, hoje.month - i + 1, 0);

    if (fim.isAfter(hoje)) fim = hoje;

    meses.add((
      rotulo: mesesCurtos[ini.month - 1],
      pct: s.pct([a], ini, fim),
    ));
  }

  final linhasTeste = <({TipoTeste tipo, List<ResultadoTeste> res})>[];

  for (final t in s.testesDoAtleta(a)) {
    final r = s.resultadosDe(a.id, teste: t.nome);

    if (r.isNotEmpty) {
      linhasTeste.add((tipo: t, res: r));
    }
  }

  final categorias = <({String nome, double? escore})>[];

  for (final cat in categoriasUniversais) {
    final t = catalogoTestes.firstWhere((x) => x.categoria == cat);

    final r = s.resultadosDe(a.id, teste: t.nome);

    categorias.add((
      nome: cat,
      escore: r.isEmpty ? null : t.escore(r.last.valor),
    ));
  }

  final comEscore = categorias.where((c) => c.escore != null).toList();

  final indiceGeral = comEscore.isEmpty
      ? null
      : comEscore.fold<double>(
            0,
            (soma, c) => soma + c.escore!,
          ) /
          comEscore.length;

  final historico = s.resultadosDe(a.id).reversed.take(15).toList();
  final metas = s.metasDe(a.id);
  final feedbacks = s.feedbacksDe(a.id).take(5).toList();
  final docs = s.documentosDe(a.id);
  final atividade = s.historicoAtleta(a).take(8).toList();

  // ── estilos ──────────────────────────────────────────────────────────────

  pw.TextStyle est(
    double tam, {
    pw.Font? fonte,
    PdfColor cor = _texto,
    double? altura,
  }) =>
      pw.TextStyle(
        font: fonte ?? fontes.regular,
        fontSize: tam,
        color: cor,
        lineSpacing: altura,
      );

  pw.Widget secao(String titulo, {String? sub}) => pw.Padding(
        padding: const pw.EdgeInsets.only(top: 18, bottom: 8),
        child: pw.Column(
          crossAxisAlignment: pw.CrossAxisAlignment.start,
          children: [
            pw.Row(
              children: [
                pw.Container(width: 4, height: 15, color: _verde),
                pw.SizedBox(width: 8),
                pw.Text(
                  titulo,
                  style: est(
                    13.5,
                    fonte: fontes.negrito,
                    cor: _verdeEscuro,
                  ),
                ),
              ],
            ),
            if (sub != null)
              pw.Padding(
                padding: const pw.EdgeInsets.only(left: 12, top: 2),
                child: pw.Text(sub, style: est(8.5, cor: _texto2)),
              ),
          ],
        ),
      );

  pw.Widget vazio(String texto) => pw.Container(
        width: double.infinity,
        padding: const pw.EdgeInsets.all(12),
        decoration: pw.BoxDecoration(
          color: _fundo,
          borderRadius: pw.BorderRadius.circular(8),
        ),
        child: pw.Text(texto, style: est(9.5, cor: _texto2)),
      );

  pw.Widget barra(
    double frac, {
    double largura = 120,
    PdfColor cor = _verde,
  }) =>
      pw.Container(
        width: largura,
        height: 6,
        decoration: pw.BoxDecoration(
          color: _linha,
          borderRadius: pw.BorderRadius.circular(3),
        ),
        child: pw.Align(
          alignment: pw.Alignment.centerLeft,
          child: pw.Container(
            width: largura * frac.clamp(0.0, 1.0),
            height: 6,
            decoration: pw.BoxDecoration(
              color: cor,
              borderRadius: pw.BorderRadius.circular(3),
            ),
          ),
        ),
      );

  pw.Widget campo(
    String rotulo,
    String valor, {
    double largura = 160,
  }) =>
      pw.SizedBox(
        width: largura,
        child: pw.Column(
          crossAxisAlignment: pw.CrossAxisAlignment.start,
          children: [
            pw.Text(rotulo, style: est(8, cor: _texto2)),
            pw.SizedBox(height: 2),
            pw.Text(valor, style: est(10.5, fonte: fontes.medio)),
          ],
        ),
      );

  pw.Widget indicador(String rotulo, String valor, String sub) =>
      pw.Expanded(
        child: pw.Container(
          margin: const pw.EdgeInsets.only(right: 8),
          padding: const pw.EdgeInsets.all(12),
          decoration: pw.BoxDecoration(
            color: _fundo,
            borderRadius: pw.BorderRadius.circular(10),
            border: pw.Border.all(color: _linha, width: 0.8),
          ),
          child: pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              pw.Text(rotulo, style: est(8.5, cor: _texto2)),
              pw.SizedBox(height: 4),
              pw.Text(
                valor,
                style: est(
                  20,
                  fonte: fontes.negrito,
                  cor: _verdeEscuro,
                ),
              ),
              pw.SizedBox(height: 2),
              pw.Text(sub, style: est(8, cor: _texto2)),
            ],
          ),
        ),
      );

  pw.Widget celula(
    String t, {
    pw.Font? fonte,
    PdfColor cor = _texto,
    double tam = 9,
    pw.TextAlign alinhar = pw.TextAlign.left,
  }) =>
      pw.Padding(
        padding: const pw.EdgeInsets.symmetric(
          horizontal: 6,
          vertical: 6,
        ),
        child: pw.Text(
          t,
          textAlign: alinhar,
          style: est(tam, fonte: fonte, cor: cor),
        ),
      );

  pw.TableRow cabecalhoTabela(List<String> titulos) => pw.TableRow(
        decoration: pw.BoxDecoration(color: _verdeEscuro),
        children: [
          for (final t in titulos)
            celula(
              t,
              fonte: fontes.negrito,
              cor: _branco,
              tam: 8.5,
            ),
        ],
      );

  final bordaTabela = pw.TableBorder(
    bottom: pw.BorderSide(color: _linha, width: 0.8),
    horizontalInside: pw.BorderSide(color: _linha, width: 0.5),
  );

  // ── blocos ───────────────────────────────────────────────────────────────

  final capa = pw.Container(
    width: double.infinity,
    padding: const pw.EdgeInsets.fromLTRB(22, 20, 22, 22),
    decoration: pw.BoxDecoration(
      color: _verdeEscuro,
      borderRadius: pw.BorderRadius.circular(14),
    ),
    child: pw.Column(
      crossAxisAlignment: pw.CrossAxisAlignment.start,
      children: [
        pw.Row(
          mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
          children: [
            pw.Text(
              'SATE',
              style: est(
                15,
                fonte: fontes.negrito,
                cor: _branco,
              ),
            ),
            pw.Text(
              'Emitido em ${_dataHora(agora)}',
              style: est(8.5, cor: _branco),
            ),
          ],
        ),
        pw.SizedBox(height: 22),
        pw.RichText(
          text: pw.TextSpan(
            children: [
              pw.TextSpan(
                text: 'Relatório do ',
                style: est(
                  22,
                  fonte: fontes.negrito,
                  cor: _branco,
                ),
              ),
              pw.TextSpan(
                text: 'atleta',
                style: est(
                  26,
                  fonte: fontes.serifa,
                  cor: PdfColor.fromInt(0xFFF28BA2),
                ),
              ),
            ],
          ),
        ),
        pw.SizedBox(height: 6),
        pw.Text(
          a.nome,
          style: est(15, fonte: fontes.medio, cor: _branco),
        ),
        pw.SizedBox(height: 2),
        pw.Text(
          '${a.posicao} · ${eq.nome} · ${eq.modalidade}',
          style: est(
            9.5,
            cor: PdfColor.fromInt(0xFFD9EDE5),
          ),
        ),
      ],
    ),
  );

  final identificacao = <pw.Widget>[
    secao('Identificação'),
    pw.Wrap(
      spacing: 14,
      runSpacing: 12,
      children: [
        campo('Nome', a.nome, largura: 230),
        campo('Posição / função', a.posicao),
        campo('Equipe', eq.nome),
        campo('Modalidade', eq.modalidade),
        campo('Idade', a.idadeTxt),
        campo('Altura', a.alturaTxt),
        campo('Peso', a.pesoTxt),
        campo('IMC', a.imc == null ? '—' : '${a.imcTxt} (${a.imcClasse})'),
        if (a.email.isNotEmpty)
          campo('E-mail', a.email, largura: 230),
        campo('Local de treino', eq.local, largura: 230),
      ],
    ),
  ];

  final resumo = <pw.Widget>[
    secao('Resumo de desempenho'),
    pw.Row(
      children: [
        indicador(
          'Assiduidade geral',
          '${(a.assiduidade * 100).round()}%',
          'frequência nos treinos',
        ),
        indicador(
          'Últimos 30 dias',
          ult30.total == 0 ? '—' : '${ult30.ok}/${ult30.total}',
          ult30.total == 0
              ? 'sem treinos no período'
              : 'treinos com presença',
        ),
        indicador(
          'Índice físico',
          indiceGeral == null
              ? '—'
              : '${(indiceGeral * 100).round()}%',
          indiceGeral == null
              ? 'sem testes registrados'
              : 'média das categorias testadas',
        ),
      ],
    ),
  ];

  final frequencia = <pw.Widget>[
    secao(
      'Frequência nos treinamentos',
      sub: 'Presença por mês, nos últimos 6 meses.',
    ),
    pw.Container(
      width: double.infinity,
      padding: const pw.EdgeInsets.fromLTRB(10, 12, 10, 8),
      decoration: pw.BoxDecoration(
        color: _fundo,
        borderRadius: pw.BorderRadius.circular(10),
        border: pw.Border.all(color: _linha, width: 0.8),
      ),
      child: pw.Row(
        crossAxisAlignment: pw.CrossAxisAlignment.end,
        mainAxisAlignment: pw.MainAxisAlignment.spaceAround,
        children: [
          for (final m in meses)
            pw.Column(
              mainAxisSize: pw.MainAxisSize.min,
              children: [
                pw.Text(
                  m.pct == null ? '—' : '${(m.pct! * 100).round()}%',
                  style: est(
                    8.5,
                    fonte: fontes.medio,
                    cor: _texto2,
                  ),
                ),
                pw.SizedBox(height: 3),
                pw.Container(
                  width: 28,
                  height: m.pct == null ? 2 : math.max(2.0, 70 * m.pct!),
                  decoration: pw.BoxDecoration(
                    color: m.pct == null ? _linha : _verde,
                    borderRadius: pw.BorderRadius.circular(3),
                  ),
                ),
                pw.SizedBox(height: 4),
                pw.Text(m.rotulo, style: est(8.5, cor: _texto2)),
              ],
            ),
        ],
      ),
    ),
  ];

  final perfilFisico = <pw.Widget>[
    secao(
      'Perfil físico por categoria',
      sub: 'Último resultado de cada categoria, de 0 a 100% da referência.',
    ),
    if (comEscore.isEmpty)
      vazio('Nenhum teste físico registrado para este atleta.')
    else
      pw.Container(
        width: double.infinity,
        padding: const pw.EdgeInsets.all(12),
        decoration: pw.BoxDecoration(
          color: _fundo,
          borderRadius: pw.BorderRadius.circular(10),
          border: pw.Border.all(color: _linha, width: 0.8),
        ),
        child: pw.Column(
          children: [
            for (final c in categorias)
              pw.Padding(
                padding: const pw.EdgeInsets.symmetric(vertical: 4),
                child: pw.Row(
                  children: [
                    pw.SizedBox(
                      width: 90,
                      child: pw.Text(c.nome, style: est(9.5)),
                    ),
                    barra(c.escore ?? 0, largura: 270),
                    pw.SizedBox(width: 10),
                    pw.Text(
                      c.escore == null
                          ? 'sem registro'
                          : '${(c.escore! * 100).round()}%',
                      style: est(
                        9,
                        fonte: fontes.medio,
                        cor: c.escore == null ? _texto2 : _verdeEscuro,
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
  ];

  String tendencia(TipoTeste t, List<ResultadoTeste> r) {
    if (r.length < 2) return 'Primeira medição';

    final delta = r.last.valor - r.first.valor;

    if (delta.abs() < math.pow(10, -t.casas) / 2) {
      return 'Estável';
    }

    final melhorou = t.menorMelhor ? delta < 0 : delta > 0;
    final sinal = delta > 0 ? '+' : '';

    return '${melhorou ? 'Melhorou' : 'Piorou'} ($sinal${delta.toStringAsFixed(t.casas)} ${t.unidade})';
  }

  PdfColor corTendencia(String t) => t.startsWith('Melhorou')
      ? _verdeEscuro
      : (t.startsWith('Piorou') ? _rosa : _texto2);

  final testes = <pw.Widget>[
    secao(
      'Resultados dos testes físicos',
      sub: 'Último resultado, melhor marca e evolução desde a primeira medição.',
    ),
    if (linhasTeste.isEmpty)
      vazio('Nenhum teste físico registrado para este atleta.')
    else
      pw.Table(
        border: bordaTabela,
        columnWidths: {
          0: pw.FlexColumnWidth(2.6),
          1: pw.FlexColumnWidth(1.6),
          2: pw.FlexColumnWidth(1.6),
          3: pw.FlexColumnWidth(2.4),
          4: pw.FlexColumnWidth(1.5),
        },
        children: [
          cabecalhoTabela([
            'Teste',
            'Último',
            'Melhor marca',
            'Evolução',
            'Data',
          ]),
          for (final l in linhasTeste)
            pw.TableRow(
              children: [
                celula(l.tipo.nome, fonte: fontes.medio),
                celula(l.tipo.formatar(l.res.last.valor)),
                celula(
                  l.tipo.formatar(
                    l.tipo.menorMelhor
                        ? l.res.map((x) => x.valor).reduce(math.min)
                        : l.res.map((x) => x.valor).reduce(math.max),
                  ),
                ),
                celula(
                  tendencia(l.tipo, l.res),
                  fonte: fontes.medio,
                  cor: corTendencia(tendencia(l.tipo, l.res)),
                ),
                celula(dataBr(l.res.last.data)),
              ],
            ),
        ],
      ),
  ];

  final historicoAval = <pw.Widget>[
    secao(
      'Histórico de avaliações',
      sub: 'Registros mais recentes.',
    ),
    if (historico.isEmpty)
      vazio('Nenhuma avaliação registrada.')
    else
      pw.Table(
        border: bordaTabela,
        columnWidths: {
          0: pw.FlexColumnWidth(1.3),
          1: pw.FlexColumnWidth(2.4),
          2: pw.FlexColumnWidth(1.6),
          3: pw.FlexColumnWidth(2.8),
        },
        children: [
          cabecalhoTabela([
            'Data',
            'Teste',
            'Resultado',
            'Observação',
          ]),
          for (final r in historico)
            pw.TableRow(
              children: [
                celula(dataBr(r.data)),
                celula(r.teste, fonte: fontes.medio),
                celula(
                  s.tipoPorNome(r.teste, r.unidade).formatar(r.valor),
                ),
                celula(r.obs.isEmpty ? '—' : r.obs, cor: _texto2),
              ],
            ),
        ],
      ),
  ];

  final atividades = <pw.Widget>[
    secao('Atividades recentes'),
    if (atividade.isEmpty)
      vazio('Sem atividades registradas nas últimas semanas.')
    else
      pw.Table(
        border: bordaTabela,
        columnWidths: {
          0: pw.FlexColumnWidth(1.3),
          1: pw.FlexColumnWidth(3),
          2: pw.FlexColumnWidth(2.6),
        },
        children: [
          cabecalhoTabela([
            'Data',
            'Atividade',
            'Detalhe',
          ]),
          for (final x in atividade)
            pw.TableRow(
              children: [
                celula(dataBr(x.data)),
                celula(x.titulo, fonte: fontes.medio),
                celula(x.sub, cor: _texto2),
              ],
            ),
        ],
      ),
  ];

  final blocoMetas = <pw.Widget>[
    secao('Metas'),
    if (metas.isEmpty)
      vazio('Nenhuma meta definida para este atleta.')
    else
      for (final m in metas)
        pw.Container(
          width: double.infinity,
          margin: const pw.EdgeInsets.only(bottom: 6),
          padding: const pw.EdgeInsets.all(10),
          decoration: pw.BoxDecoration(
            color: _fundo,
            borderRadius: pw.BorderRadius.circular(8),
            border: pw.Border.all(color: _linha, width: 0.8),
          ),
          child: pw.Row(
            crossAxisAlignment: pw.CrossAxisAlignment.center,
            children: [
              pw.Expanded(
                child: pw.Column(
                  crossAxisAlignment: pw.CrossAxisAlignment.start,
                  children: [
                    pw.Text(m.titulo, style: est(10, fonte: fontes.medio)),
                    if (m.descricao.isNotEmpty)
                      pw.Text(m.descricao, style: est(8.5, cor: _texto2)),
                    pw.SizedBox(height: 2),
                    pw.Text(
                      'Prazo: ${dataBr(m.prazo)}',
                      style: est(8.5, cor: _texto2),
                    ),
                  ],
                ),
              ),
              pw.SizedBox(width: 10),
              barra(m.progresso / 100, largura: 90),
              pw.SizedBox(width: 8),
              pw.Text(
                '${m.progresso}%',
                style: est(
                  9.5,
                  fonte: fontes.negrito,
                  cor: _verdeEscuro,
                ),
              ),
            ],
          ),
        ),
  ];

  final blocoFeedbacks = <pw.Widget>[
    secao('Feedbacks do treinador'),
    if (feedbacks.isEmpty)
      vazio('Nenhum feedback registrado.')
    else
      for (final f in feedbacks)
        pw.Container(
          width: double.infinity,
          margin: const pw.EdgeInsets.only(bottom: 6),
          padding: const pw.EdgeInsets.all(10),
          decoration: pw.BoxDecoration(
            color: _fundo,
            borderRadius: pw.BorderRadius.circular(8),
          ),
          child: pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              pw.Text(dataBr(f.quando), style: est(8, cor: _texto2)),
              pw.SizedBox(height: 2),
              pw.Text(f.texto, style: est(9.5, altura: 2)),
            ],
          ),
        ),
  ];

  String situacaoDoc(Documento d) => switch (d.estado(hoje)) {
        EstadoDoc.emDia => 'Em dia',
        EstadoDoc.proximo => 'Vence em breve',
        EstadoDoc.pendente => 'Pendente de aprovação',
        EstadoDoc.vencido => 'Vencido',
      };

  final blocoDocs = <pw.Widget>[
    secao('Documentação'),
    if (docs.isEmpty)
      vazio('Nenhum documento vinculado a este atleta.')
    else
      pw.Table(
        border: bordaTabela,
        columnWidths: {
          0: pw.FlexColumnWidth(3),
          1: pw.FlexColumnWidth(1.8),
          2: pw.FlexColumnWidth(1.5),
          3: pw.FlexColumnWidth(2),
        },
        children: [
          cabecalhoTabela([
            'Documento',
            'Categoria',
            'Validade',
            'Situação',
          ]),
          for (final d in docs)
            pw.TableRow(
              children: [
                celula(d.titulo, fonte: fontes.medio),
                celula(d.categoria),
                celula(d.validade == null ? '—' : dataBr(d.validade!)),
                celula(situacaoDoc(d), cor: _texto2),
              ],
            ),
        ],
      ),
  ];

  // ── documento ────────────────────────────────────────────────────────────

  final doc = pw.Document(
    title: 'Relatório do atleta — ${a.nome}',
    author: s.nomeUsuario.isEmpty ? 'SATE' : s.nomeUsuario,
    creator: 'SATE — Sistema de Acompanhamento e Treinamento Esportivo',
  );

  doc.addPage(
    pw.MultiPage(
      pageTheme: pw.PageTheme(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.fromLTRB(34, 30, 34, 36),
        theme: pw.ThemeData.withFont(
          base: fontes.regular,
          bold: fontes.negrito,
          italic: fontes.italico,
          boldItalic: fontes.italico,
        ),
      ),
      header: (ctx) => ctx.pageNumber == 1
          ? pw.SizedBox()
          : pw.Padding(
              padding: const pw.EdgeInsets.only(bottom: 8),
              child: pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Text(
                    'SATE · Relatório do atleta',
                    style: est(
                      8.5,
                      fonte: fontes.negrito,
                      cor: _verdeEscuro,
                    ),
                  ),
                  pw.Text(a.nome, style: est(8.5, cor: _texto2)),
                ],
              ),
            ),
      footer: (ctx) => pw.Container(
        margin: const pw.EdgeInsets.only(top: 10),
        padding: const pw.EdgeInsets.only(top: 6),
        decoration: pw.BoxDecoration(
          border: pw.Border(
            top: pw.BorderSide(color: _linha, width: 0.8),
          ),
        ),
        child: pw.Row(
          mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
          children: [
            pw.Text(
              'Gerado pelo SATE em ${_dataHora(agora)}',
              style: est(8, cor: _texto2),
            ),
            pw.Text(
              'Página ${ctx.pageNumber} de ${ctx.pagesCount}',
              style: est(8, cor: _texto2),
            ),
          ],
        ),
      ),
      build: (ctx) => [
        capa,
        ...identificacao,
        ...resumo,
        ...frequencia,
        ...perfilFisico,
        ...testes,
        ...historicoAval,
        ...atividades,
        ...blocoMetas,
        ...blocoFeedbacks,
        ...blocoDocs,
      ],
    ),
  );

  return doc.save();
}

// ─────────────────────────────────────────────────────────────────────────────
// Ação de tela: visualizar / salvar / compartilhar
// ─────────────────────────────────────────────────────────────────────────────

Future<void> _gerarEEnviar(
  BuildContext context,
  Atleta a, {
  required bool compartilhar,
}) async {
  aviso(context, 'Gerando relatório de ${a.nome.split(' ').first}…');

  try {
    final bytes = await gerarRelatorioAtletaPdf(a);
    final nomeArquivo = 'relatorio_${_slug(a.nome)}.pdf';

    if (compartilhar) {
      await Printing.sharePdf(
        bytes: bytes,
        filename: nomeArquivo,
      );
    } else {
      await Printing.layoutPdf(
        name: nomeArquivo,
        onLayout: (_) async => bytes,
      );
    }
  } catch (e) {
    debugPrint('Erro ao gerar o relatório do atleta: $e');

    if (context.mounted) {
      aviso(
        context,
        'Não foi possível gerar o relatório. Tente novamente.',
      );
    }
  }
}

/// Abre as opções de exportação do relatório individual do atleta.
Future<void> exportarRelatorioAtleta(BuildContext context, Atleta a) {
  return abrirFolha<void>(context, (ctx) {
    final c = ctx.sc;

    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 4, 20, 24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Relatório em PDF',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: c.texto,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Relatório individual de ${a.nome}.',
            style: TextStyle(
              fontSize: 13,
              color: c.texto2,
            ),
          ),
          const SizedBox(height: 12),

          // Opção 1: visualizar, imprimir ou salvar
          ListTile(
            contentPadding: EdgeInsets.zero,
            leading: Icon(
              Icons.picture_as_pdf_outlined,
              color: c.primaria,
            ),
            title: Text(
              'Visualizar, imprimir ou salvar',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: c.texto,
              ),
            ),
            subtitle: Text(
              'Abre o PDF para conferir e salvar no aparelho',
              style: TextStyle(
                fontSize: 12,
                color: c.texto2,
              ),
            ),
            trailing: Icon(
              Icons.chevron_right_rounded,
              color: c.texto2,
            ),
            onTap: () {
              Navigator.of(ctx).pop();
              _gerarEEnviar(
                context,
                a,
                compartilhar: false,
              );
            },
          ),

          // Opção 2: compartilhar
          ListTile(
            contentPadding: EdgeInsets.zero,
            leading: Icon(
              Icons.ios_share_rounded,
              color: c.primaria,
            ),
            title: Text(
              'Compartilhar',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: c.texto,
              ),
            ),
            subtitle: Text(
              'Envia o PDF por e-mail, WhatsApp e outros apps',
              style: TextStyle(
                fontSize: 12,
                color: c.texto2,
              ),
            ),
            trailing: Icon(
              Icons.chevron_right_rounded,
              color: c.texto2,
            ),
            onTap: () {
              Navigator.of(ctx).pop();
              _gerarEEnviar(
                context,
                a,
                compartilhar: true,
              );
            },
          ),
        ],
      ),
    );
  });
}