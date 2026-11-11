import 'package:flutter/material.dart';

DateTime somenteData(DateTime d) => DateTime(d.year, d.month, d.day);

/// Soma dias sem sofrer com horário de verão (trabalha só com a data).
DateTime somaDias(DateTime d, int n) => DateTime(d.year, d.month, d.day + n);

String chaveData(DateTime d) =>
    '${d.year.toString().padLeft(4, '0')}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

enum StatusPres { realizado, naoRealizado, pendente, semTreino }

class Equipe {
  final String id, nome, modalidade, local;
  final List<int> dias; // DateTime.monday..sunday
  final int inicioMin, duracaoMin;
  const Equipe({
    required this.id,
    required this.nome,
    required this.modalidade,
    required this.local,
    required this.dias,
    required this.inicioMin,
    required this.duracaoMin,
  });
}

class Atleta {
  final String id, nome, equipeId, posicao, email;
  final int idade, alturaCm;
  final double pesoKg;

  /// Taxa de presença usada para gerar o histórico de demonstração (0..1).
  final double assiduidade;

  const Atleta({
    required this.id,
    required this.nome,
    required this.equipeId,
    required this.posicao,
    required this.email,
    required this.idade,
    required this.alturaCm,
    required this.pesoKg,
    required this.assiduidade,
  });
}

class Exercicio {
  final String id, nome, grupo, instrucoes, video;
  final int series, repeticoes, duracaoSeg;
  final bool demo;

  const Exercicio({
    required this.id,
    required this.nome,
    required this.grupo,
    required this.series,
    required this.repeticoes,
    required this.duracaoSeg,
    required this.instrucoes,
    required this.video,
    this.demo = false,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'n': nome,
        'g': grupo,
        's': series,
        'r': repeticoes,
        'd': duracaoSeg,
        'i': instrucoes,
        'v': video,
      };

  factory Exercicio.fromJson(Map<String, dynamic> j) => Exercicio(
        id: j['id'] as String,
        nome: j['n'] as String,
        grupo: (j['g'] ?? 'Geral') as String,
        series: (j['s'] ?? 3) as int,
        repeticoes: (j['r'] ?? 10) as int,
        duracaoSeg: (j['d'] ?? 0) as int,
        instrucoes: (j['i'] ?? '') as String,
        video: (j['v'] ?? '') as String,
      );

  /// Resumo para listas: "4 × 12" ou "3 × 45 s".
  String get resumo {
    final base = duracaoSeg > 0 && repeticoes == 0
        ? '$series × ${duracaoSeg}s'
        : '$series × $repeticoes';
    return base;
  }
}

class Treino {
  final String id, titulo, objetivo, foco, observacoes, equipeId;
  final DateTime data;
  final int inicioMin, duracaoMin;
  final List<String> exercicioIds;

  /// Vazio = toda a equipe participa.
  final List<String> atletaIds;
  final bool modelo;

  const Treino({
    required this.id,
    required this.titulo,
    required this.objetivo,
    required this.foco,
    required this.observacoes,
    required this.equipeId,
    required this.data,
    required this.inicioMin,
    required this.duracaoMin,
    required this.exercicioIds,
    required this.atletaIds,
    this.modelo = false,
  });

  String get chave => chaveData(data);

  Map<String, dynamic> toJson() => {
        'id': id,
        't': titulo,
        'o': objetivo,
        'f': foco,
        'obs': observacoes,
        'eq': equipeId,
        'd': chave,
        'h': inicioMin,
        'du': duracaoMin,
        'ex': exercicioIds,
        'at': atletaIds,
      };

  factory Treino.fromJson(Map<String, dynamic> j) => Treino(
        id: j['id'] as String,
        titulo: j['t'] as String,
        objetivo: (j['o'] ?? '') as String,
        foco: (j['f'] ?? '') as String,
        observacoes: (j['obs'] ?? '') as String,
        equipeId: j['eq'] as String,
        data: somenteData(DateTime.parse(j['d'] as String)),
        inicioMin: (j['h'] ?? 1080) as int,
        duracaoMin: (j['du'] ?? 60) as int,
        exercicioIds: List<String>.from(j['ex'] as List),
        atletaIds: List<String>.from(j['at'] as List),
      );
}

class TipoTeste {
  final String nome, categoria, unidade;
  final bool menorMelhor;
  final double pior, melhor;
  final int casas;
  final String? modalidade;
  final IconData icone;

  const TipoTeste({
    required this.nome,
    required this.categoria,
    required this.unidade,
    required this.menorMelhor,
    required this.pior,
    required this.melhor,
    required this.casas,
    required this.icone,
    this.modalidade,
  });

  /// Converte um valor em escore de 0 a 1 (1 = melhor referência).
  double escore(double v) {
    final e = (v - pior) / (melhor - pior);
    return e.clamp(0.0, 1.0).toDouble();
  }

  String formatar(double v) => '${v.toStringAsFixed(casas)} $unidade';
}

class ResultadoTeste {
  final String atleta, teste, unidade, obs;
  final DateTime data;
  final double valor;
  final bool demo;

  const ResultadoTeste(this.atleta, this.teste, this.unidade, this.data,
      this.valor, this.obs,
      {this.demo = false});

  // Mesmo formato já usado pela tela de testes anterior (dados continuam válidos).
  Map<String, dynamic> toJson() => {
        'a': atleta,
        't': teste,
        'u': unidade,
        'd': data.toIso8601String(),
        'v': valor,
        'o': obs,
      };

  factory ResultadoTeste.fromJson(Map<String, dynamic> j) => ResultadoTeste(
        j['a'] as String,
        j['t'] as String,
        j['u'] as String,
        DateTime.parse(j['d'] as String),
        (j['v'] as num).toDouble(),
        (j['o'] ?? '') as String,
      );
}

enum EstadoDoc { emDia, proximo, pendente, vencido }

class Documento {
  final String id, titulo, categoria, obs;
  final DateTime? validade;
  final bool aprovado;

  /// null = documento do treinador; senão, id do atleta dono do documento.
  final String? atletaId;

  const Documento({
    required this.id,
    required this.titulo,
    required this.categoria,
    required this.validade,
    required this.aprovado,
    required this.obs,
    this.atletaId,
  });

  EstadoDoc estado(DateTime hoje) {
    if (!aprovado) return EstadoDoc.pendente;
    if (validade == null) return EstadoDoc.emDia;
    if (validade!.isBefore(hoje)) return EstadoDoc.vencido;
    if (validade!.difference(hoje).inDays <= 30) return EstadoDoc.proximo;
    return EstadoDoc.emDia;
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        't': titulo,
        'c': categoria,
        'o': obs,
        'v': validade == null ? null : chaveData(validade!),
        'a': aprovado,
        'at': atletaId,
      };

  factory Documento.fromJson(Map<String, dynamic> j) => Documento(
        id: j['id'] as String,
        titulo: j['t'] as String,
        categoria: (j['c'] ?? 'Geral') as String,
        obs: (j['o'] ?? '') as String,
        validade: j['v'] == null ? null : somenteData(DateTime.parse(j['v'] as String)),
        aprovado: (j['a'] ?? false) as bool,
        atletaId: j['at'] as String?,
      );
}

class Plano {
  final String nome;
  final int limite;
  final double preco;
  final List<String> beneficios;
  const Plano(this.nome, this.limite, this.preco, this.beneficios);

  String get precoTxt =>
      'R\$ ${preco.toStringAsFixed(2).replaceAll('.', ',')}';
}

// ───────────────────────── Eventos, metas, feedbacks e comunidade ─────────────────────────

enum TipoEv { jogo, avaliacao, reuniao, lembrete }

extension TipoEvInfo on TipoEv {
  String get nome => switch (this) {
        TipoEv.jogo => 'Jogo',
        TipoEv.avaliacao => 'Avaliação',
        TipoEv.reuniao => 'Reunião',
        TipoEv.lembrete => 'Lembrete',
      };
  IconData get icone => switch (this) {
        TipoEv.jogo => Icons.emoji_events_rounded,
        TipoEv.avaliacao => Icons.monitor_heart_outlined,
        TipoEv.reuniao => Icons.groups_rounded,
        TipoEv.lembrete => Icons.notifications_active_outlined,
      };
}

/// Evento do calendário que não é treino (jogos, avaliações, reuniões...).
class EventoAgenda {
  final String id, titulo, local, observacoes;
  final DateTime data;
  final TipoEv tipo;
  final int inicioMin, fimMin;

  /// null = toda a comissão e todas as equipes.
  final String? equipeId;
  final bool demo;

  const EventoAgenda({
    required this.id,
    required this.titulo,
    required this.local,
    required this.observacoes,
    required this.data,
    required this.tipo,
    required this.inicioMin,
    required this.fimMin,
    this.equipeId,
    this.demo = false,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        't': titulo,
        'l': local,
        'o': observacoes,
        'd': chaveData(data),
        'tp': tipo.index,
        'i': inicioMin,
        'f': fimMin,
        'eq': equipeId,
      };

  factory EventoAgenda.fromJson(Map<String, dynamic> j) => EventoAgenda(
        id: j['id'] as String,
        titulo: j['t'] as String,
        local: (j['l'] ?? '') as String,
        observacoes: (j['o'] ?? '') as String,
        data: somenteData(DateTime.parse(j['d'] as String)),
        tipo: TipoEv.values[(j['tp'] ?? 0) as int],
        inicioMin: (j['i'] ?? 480) as int,
        fimMin: (j['f'] ?? 540) as int,
        equipeId: j['eq'] as String?,
      );
}

class MetaAtleta {
  final String id, atletaId, titulo, descricao;
  final int progresso; // 0..100
  final DateTime prazo;
  const MetaAtleta({
    required this.id,
    required this.atletaId,
    required this.titulo,
    required this.descricao,
    required this.progresso,
    required this.prazo,
  });

  bool get concluida => progresso >= 100;

  Map<String, dynamic> toJson() => {
        'id': id,
        'a': atletaId,
        't': titulo,
        'd': descricao,
        'p': progresso,
        'pz': chaveData(prazo),
      };

  factory MetaAtleta.fromJson(Map<String, dynamic> j) => MetaAtleta(
        id: j['id'] as String,
        atletaId: j['a'] as String,
        titulo: j['t'] as String,
        descricao: (j['d'] ?? '') as String,
        progresso: (j['p'] ?? 0) as int,
        prazo: somenteData(DateTime.parse(j['pz'] as String)),
      );
}

class FeedbackAtleta {
  final String id, atletaId, texto;
  final DateTime quando;
  const FeedbackAtleta(this.id, this.atletaId, this.texto, this.quando);

  Map<String, dynamic> toJson() =>
      {'id': id, 'a': atletaId, 't': texto, 'q': quando.toIso8601String()};

  factory FeedbackAtleta.fromJson(Map<String, dynamic> j) => FeedbackAtleta(
        j['id'] as String,
        j['a'] as String,
        j['t'] as String,
        DateTime.parse(j['q'] as String),
      );
}

class Comentario {
  final String autor, texto;
  const Comentario(this.autor, this.texto);
}

/// Publicação da comunidade (feed).
class Post {
  final String id, autor, texto;
  final DateTime quando;
  final bool minha;

  /// 'equipe' ou 'seguindo' (para os filtros do feed).
  final String grupo;
  final int curtidasBase;
  final bool curtido;
  final List<Comentario> comentarios;

  /// Caminho de um asset de imagem (opcional).
  final String? imagem;

  const Post({
    required this.id,
    required this.autor,
    required this.texto,
    required this.quando,
    required this.minha,
    required this.grupo,
    required this.curtidasBase,
    required this.curtido,
    required this.comentarios,
    this.imagem,
  });

  int get curtidas => curtidasBase + (curtido ? 1 : 0);

  Post copiar({
    bool? curtido,
    List<Comentario>? comentarios,
    String? texto,
    String? imagem,
    bool limparImagem = false,
  }) =>
      Post(
        id: id,
        autor: autor,
        texto: texto ?? this.texto,
        quando: quando,
        minha: minha,
        grupo: grupo,
        curtidasBase: curtidasBase,
        curtido: curtido ?? this.curtido,
        comentarios: comentarios ?? this.comentarios,
        imagem: limparImagem ? null : (imagem ?? this.imagem),
      );

  Map<String, dynamic> toJson() => {
        'im': imagem,
        'id': id,
        'a': autor,
        't': texto,
        'q': quando.toIso8601String(),
        'm': minha,
        'g': grupo,
        'c': curtidasBase,
        'k': curtido,
        'cm': [
          for (final c in comentarios) {'a': c.autor, 't': c.texto}
        ],
      };

  factory Post.fromJson(Map<String, dynamic> j) => Post(
        id: j['id'] as String,
        autor: j['a'] as String,
        texto: j['t'] as String,
        quando: DateTime.parse(j['q'] as String),
        minha: (j['m'] ?? false) as bool,
        grupo: (j['g'] ?? 'equipe') as String,
        curtidasBase: (j['c'] ?? 0) as int,
        curtido: (j['k'] ?? false) as bool,
        imagem: (j['im'] as String?) ?? _imagemPadrao(j['id'] as String),
        comentarios: [
          for (final c in (j['cm'] as List? ?? const []))
            Comentario((c as Map)['a'] as String, c['t'] as String),
        ],
      );
}

/// Imagens disponíveis para publicações (ilustrações do SATE).
const List<String> imagensFeed = [
  'assets/images/feed_quadra.png',
  'assets/images/feed_equipe.png',
  'assets/images/feed_pista.png',
  'assets/images/feed_treino.png',
];

String? _imagemPadrao(String id) => switch (id) {
      'p1' => imagensFeed[0],
      'p2' => imagensFeed[1],
      'p3' => imagensFeed[2],
      'p4' => imagensFeed[3],
      _ => null,
    };

/// Item que aparece no calendário/agenda de um dia: treino ou evento.
class AtividadeDia {
  final DateTime data;
  final int inicioMin;
  final int? fimMin;
  final String titulo, subtitulo;
  final IconData icone;
  final String tipoRotulo;
  final Treino? treino;
  final EventoAgenda? evento;
  const AtividadeDia({
    required this.data,
    required this.inicioMin,
    required this.fimMin,
    required this.titulo,
    required this.subtitulo,
    required this.icone,
    required this.tipoRotulo,
    this.treino,
    this.evento,
  });
}
