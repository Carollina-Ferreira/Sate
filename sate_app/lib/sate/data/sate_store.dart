import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'modelos.dart';

// ───────────────────────── Catálogos fixos ─────────────────────────

const List<TipoTeste> catalogoTestes = [
  TipoTeste(
      nome: 'Corrida de 30 m',
      categoria: 'Velocidade',
      unidade: 's',
      menorMelhor: true,
      pior: 5.6,
      melhor: 4.0,
      casas: 2,
      icone: Icons.bolt_rounded),
  TipoTeste(
      nome: 'Teste de Cooper (12 min)',
      categoria: 'Resistência',
      unidade: 'm',
      menorMelhor: false,
      pior: 1800,
      melhor: 3000,
      casas: 0,
      icone: Icons.favorite_outline_rounded),
  TipoTeste(
      nome: 'Teste T de agilidade',
      categoria: 'Agilidade',
      unidade: 's',
      menorMelhor: true,
      pior: 13.0,
      melhor: 9.5,
      casas: 2,
      icone: Icons.swap_calls_rounded),
  TipoTeste(
      nome: 'Salto vertical',
      categoria: 'Salto vertical',
      unidade: 'cm',
      menorMelhor: false,
      pior: 20,
      melhor: 55,
      casas: 0,
      icone: Icons.north_rounded),
  TipoTeste(
      nome: 'Flexões em 1 minuto',
      categoria: 'Força',
      unidade: 'rep',
      menorMelhor: false,
      pior: 8,
      melhor: 45,
      casas: 0,
      icone: Icons.fitness_center_rounded),
  TipoTeste(
      nome: 'Sentar e alcançar',
      categoria: 'Flexibilidade',
      unidade: 'cm',
      menorMelhor: false,
      pior: 15,
      melhor: 42,
      casas: 0,
      icone: Icons.self_improvement_rounded),
  TipoTeste(
      nome: 'Saque: acertos em 10',
      categoria: 'Específico',
      unidade: 'acertos',
      menorMelhor: false,
      pior: 2,
      melhor: 9,
      casas: 0,
      icone: Icons.sports_volleyball_rounded,
      modalidade: 'Vôlei'),
  TipoTeste(
      nome: 'Condução de bola (slalom)',
      categoria: 'Específico',
      unidade: 's',
      menorMelhor: true,
      pior: 16,
      melhor: 11,
      casas: 2,
      icone: Icons.sports_soccer_rounded,
      modalidade: 'Futsal'),
  TipoTeste(
      nome: 'Salto em distância',
      categoria: 'Específico',
      unidade: 'm',
      menorMelhor: false,
      pior: 1.6,
      melhor: 3.4,
      casas: 2,
      icone: Icons.directions_run_rounded,
      modalidade: 'Atletismo'),
];

const List<String> categoriasUniversais = [
  'Velocidade',
  'Resistência',
  'Agilidade',
  'Salto vertical',
  'Força',
  'Flexibilidade',
];

const Map<String, String> videosDemo = {
  'demo:agachamento': 'Agachamento',
  'demo:salto': 'Salto',
  'demo:prancha': 'Prancha',
  'demo:corrida': 'Corrida',
  'demo:polichinelo': 'Polichinelo',
};

const List<String> gruposExercicio = [
  'Aquecimento',
  'Força',
  'Potência',
  'Agilidade',
  'Velocidade',
  'Resistência',
  'Técnica',
  'Mobilidade',
  'Core',
];

const List<Plano> planosSate = [
  Plano('Gratuito', 30, 0, [
    'Até 30 atletas',
    'Treinos e exercícios',
    'Calendário de frequência',
  ]),
  Plano('Plano 80', 80, 10.90, [
    'Até 80 atletas',
    'Tudo do plano Gratuito',
    'Testes físicos com histórico',
    'Documentação de treinadores',
  ]),
  Plano('Plano 110', 110, 15.90, [
    'Até 110 atletas',
    'Tudo do Plano 80',
    'Comparação entre atletas',
    'Estatísticas coletivas',
  ]),
  Plano('Plano 200', 200, 20.90, [
    'Até 200 atletas',
    'Tudo do Plano 110',
    'Várias equipes e modalidades',
    'Prioridade no suporte',
  ]),
];

const List<Equipe> _equipesDemo = [
  Equipe(
      id: 'eq1',
      nome: 'Vôlei Sub-17 Feminino',
      modalidade: 'Vôlei',
      local: 'Ginásio Municipal',
      dias: [DateTime.monday, DateTime.wednesday, DateTime.friday],
      inicioMin: 18 * 60,
      duracaoMin: 90),
  Equipe(
      id: 'eq2',
      nome: 'Futsal Adulto',
      modalidade: 'Futsal',
      local: 'Quadra Coberta',
      dias: [DateTime.tuesday, DateTime.thursday],
      inicioMin: 19 * 60 + 30,
      duracaoMin: 75),
  Equipe(
      id: 'eq3',
      nome: 'Atletismo Base',
      modalidade: 'Atletismo',
      local: 'Pista do Parque',
      dias: [DateTime.saturday],
      inicioMin: 8 * 60,
      duracaoMin: 90),
];

Atleta _a(String id, String nome, String eq, String pos, int idade, int alt,
        double peso, double ass) =>
    Atleta(
      id: id,
      nome: nome,
      equipeId: eq,
      posicao: pos,
      email: '${nome.toLowerCase().split(' ').first}@exemplo.com',
      idade: idade,
      alturaCm: alt,
      pesoKg: peso,
      assiduidade: ass,
    );

final List<Atleta> _atletasDemo = [
  _a('a1', 'Marina Costa', 'eq1', 'Ponteira', 16, 176, 63, 0.94),
  _a('a2', 'Beatriz Lima', 'eq1', 'Levantadora', 16, 171, 59, 0.88),
  _a('a3', 'Júlia Ramos', 'eq1', 'Central', 17, 182, 68, 0.81),
  _a('a4', 'Camila Duarte', 'eq1', 'Líbero', 15, 165, 55, 0.91),
  _a('a5', 'Sofia Martins', 'eq1', 'Oposta', 17, 179, 66, 0.72),
  _a('a6', 'Larissa Alves', 'eq1', 'Ponteira', 16, 174, 61, 0.85),
  _a('a7', 'Rafael Nunes', 'eq2', 'Fixo', 24, 178, 74, 0.90),
  _a('a8', 'Lucas Barbosa', 'eq2', 'Ala', 22, 175, 70, 0.83),
  _a('a9', 'Pedro Teixeira', 'eq2', 'Goleiro', 26, 184, 82, 0.78),
  _a('a10', 'Gustavo Pires', 'eq2', 'Pivô', 25, 180, 77, 0.69),
  _a('a11', 'Thiago Moura', 'eq2', 'Ala', 23, 173, 68, 0.87),
  _a('a12', 'Ana Clara Souza', 'eq3', 'Velocista', 15, 168, 54, 0.92),
  _a('a13', 'Davi Carvalho', 'eq3', 'Fundista', 16, 172, 58, 0.86),
  _a('a14', 'Helena Ribeiro', 'eq3', 'Saltadora', 16, 170, 56, 0.79),
];

const List<Exercicio> _exerciciosDemo = [
  Exercicio(
      id: 'ex_aquec',
      nome: 'Aquecimento dinâmico',
      grupo: 'Aquecimento',
      series: 1,
      repeticoes: 0,
      duracaoSeg: 480,
      instrucoes:
          'Comece com trote leve e evolua para elevação de joelhos, skipping e rotações de quadril. Mantenha a respiração controlada.',
      video: 'demo:polichinelo',
      demo: true),
  Exercicio(
      id: 'ex_agach',
      nome: 'Agachamento livre',
      grupo: 'Força',
      series: 4,
      repeticoes: 12,
      duracaoSeg: 0,
      instrucoes:
          'Pés na largura dos ombros, coluna neutra. Desça até as coxas ficarem paralelas ao chão, com os joelhos alinhados aos pés. Suba empurrando o chão.',
      video: 'demo:agachamento',
      demo: true),
  Exercicio(
      id: 'ex_afundo',
      nome: 'Afundo alternado',
      grupo: 'Força',
      series: 3,
      repeticoes: 10,
      duracaoSeg: 0,
      instrucoes:
          'Dê um passo largo à frente e desça o joelho de trás em direção ao chão. Mantenha o tronco ereto e alterne as pernas.',
      video: 'demo:agachamento',
      demo: true),
  Exercicio(
      id: 'ex_prancha',
      nome: 'Prancha frontal',
      grupo: 'Core',
      series: 3,
      repeticoes: 0,
      duracaoSeg: 45,
      instrucoes:
          'Apoie antebraços e pontas dos pés. Mantenha o corpo em linha reta, abdômen contraído e quadril alinhado. Não prenda a respiração.',
      video: 'demo:prancha',
      demo: true),
  Exercicio(
      id: 'ex_caixa',
      nome: 'Salto na caixa',
      grupo: 'Potência',
      series: 4,
      repeticoes: 6,
      duracaoSeg: 0,
      instrucoes:
          'Flexione os joelhos, balance os braços e salte sobre a caixa aterrissando suave, com joelhos semiflexionados. Desça caminhando.',
      video: 'demo:salto',
      demo: true),
  Exercicio(
      id: 'ex_escada',
      nome: 'Escada de agilidade',
      grupo: 'Agilidade',
      series: 5,
      repeticoes: 0,
      duracaoSeg: 30,
      instrucoes:
          'Passos curtos e rápidos dentro de cada quadrado, olhando à frente. Priorize frequência de passos e leveza nos apoios.',
      video: 'demo:corrida',
      demo: true),
  Exercicio(
      id: 'ex_tiro',
      nome: 'Tiros de 30 m',
      grupo: 'Velocidade',
      series: 6,
      repeticoes: 1,
      duracaoSeg: 0,
      instrucoes:
          'Largada com tronco inclinado, passadas fortes nos primeiros metros e postura ereta ao final. Recuperação completa entre os tiros.',
      video: 'demo:corrida',
      demo: true),
  Exercicio(
      id: 'ex_toque',
      nome: 'Toque e manchete em duplas',
      grupo: 'Técnica',
      series: 3,
      repeticoes: 20,
      duracaoSeg: 0,
      instrucoes:
          'Em duplas, alterne toque e manchete. Posicione-se sob a bola, braços firmes e contato na altura dos antebraços.',
      video: 'demo:polichinelo',
      demo: true),
  Exercicio(
      id: 'ex_saque',
      nome: 'Saque em zonas',
      grupo: 'Técnica',
      series: 4,
      repeticoes: 10,
      duracaoSeg: 0,
      instrucoes:
          'Mire nas zonas indicadas da quadra adversária. Lançamento constante, golpe com a palma aberta e continuidade do movimento.',
      video: 'demo:salto',
      demo: true),
  Exercicio(
      id: 'ex_conducao',
      nome: 'Condução com slalom',
      grupo: 'Técnica',
      series: 5,
      repeticoes: 1,
      duracaoSeg: 0,
      instrucoes:
          'Conduza a bola entre os cones usando as duas pernas. Cabeça erguida entre os toques e controle de direção em velocidade.',
      video: 'demo:corrida',
      demo: true),
  Exercicio(
      id: 'ex_mobil',
      nome: 'Mobilidade de quadril',
      grupo: 'Mobilidade',
      series: 2,
      repeticoes: 10,
      duracaoSeg: 0,
      instrucoes:
          'Em posição de quatro apoios, faça círculos amplos com o quadril de cada lado. Movimento lento e controlado.',
      video: 'demo:agachamento',
      demo: true),
  Exercicio(
      id: 'ex_interv',
      nome: 'Corrida intervalada 1:1',
      grupo: 'Resistência',
      series: 8,
      repeticoes: 0,
      duracaoSeg: 30,
      instrucoes:
          '30 segundos em ritmo forte e 30 segundos de trote leve. Mantenha a cadência e hidrate-se ao final.',
      video: 'demo:corrida',
      demo: true),
];

typedef _Modelo = (String, String, String, List<String>);

const Map<String, Map<int, _Modelo>> _modelosSessao = {
  'eq1': {
    DateTime.monday: (
      'Força e potência',
      'Desenvolver força de membros inferiores e potência de salto.',
      'Intensidade com técnica: cada repetição conta.',
      ['ex_aquec', 'ex_agach', 'ex_afundo', 'ex_caixa', 'ex_prancha'],
    ),
    DateTime.wednesday: (
      'Fundamentos de ataque e saque',
      'Aprimorar saque, recepção e passe.',
      'Concentração no gesto técnico.',
      ['ex_aquec', 'ex_toque', 'ex_saque', 'ex_escada', 'ex_mobil'],
    ),
    DateTime.friday: (
      'Jogo coletivo e resistência',
      'Aplicar os fundamentos em situação de jogo.',
      'Comunicação e confiança em quadra.',
      ['ex_aquec', 'ex_escada', 'ex_interv', 'ex_saque', 'ex_mobil'],
    ),
  },
  'eq2': {
    DateTime.tuesday: (
      'Condução e velocidade',
      'Melhorar condução de bola e arrancadas curtas.',
      'Decisões rápidas sob pressão.',
      ['ex_aquec', 'ex_tiro', 'ex_conducao', 'ex_escada', 'ex_mobil'],
    ),
    DateTime.thursday: (
      'Força e resistência específica',
      'Construir base de força e capacidade aeróbia.',
      'Constância até o último minuto.',
      ['ex_aquec', 'ex_agach', 'ex_afundo', 'ex_interv', 'ex_prancha'],
    ),
  },
  'eq3': {
    DateTime.saturday: (
      'Velocidade e saltos',
      'Trabalhar aceleração e potência de impulsão.',
      'Relaxar na velocidade máxima.',
      ['ex_aquec', 'ex_tiro', 'ex_caixa', 'ex_interv', 'ex_mobil'],
    ),
  },
};

// ───────────────────────── Armazenamento ─────────────────────────

/// Estado local do app. Tudo aqui é demonstrativo: sem servidor.
/// Persistem no aparelho apenas os itens criados/editados pelo usuário.
class SateStore extends ChangeNotifier {
  SateStore._();
  static final SateStore i = SateStore._();

  static const _kExercicios = 'sate_exercicios';
  static const _kTreinos = 'sate_treinos_custom';
  static const _kRemovidos = 'sate_treinos_removidos';
  static const _kPresencas = 'sate_presencas';
  static const _kTestes = 'sate_testes'; // mesma chave da versão anterior
  static const _kDocs = 'sate_docs';
  static const _kPlano = 'sate_plano';
  static const _kEventos = 'sate_eventos';
  static const _kMetas = 'sate_metas';
  static const _kFeedbacks = 'sate_feedbacks';
  static const _kPosts = 'sate_posts';
  static const _kExtras = 'sate_atletas_extra';
  static const _kSimLimite = 'sate_sim_limite';
  static const _kDocsAtletas = 'sate_docs_atletas_v1';

  bool _carregado = false;
  bool treinador = true;
  String nomeUsuario = '';
  String emailUsuario = '';

  List<Equipe> get equipes => _equipesDemo;
  final List<Atleta> _atletas = [];
  late Atleta eu;

  final List<Exercicio> _exercicios = [];
  final List<Treino> _custom = [];
  final Set<String> _removidos = {};
  final Map<String, String> _pres = {};
  final List<ResultadoTeste> _testes = [];
  final List<ResultadoTeste> _testesDemo = [];
  final List<Documento> _docs = [];
  int planoAtual = 0;
  final List<EventoAgenda> _eventos = [];
  final List<MetaAtleta> _metas = [];
  final List<FeedbackAtleta> _feedbacks = [];
  final List<Post> _posts = [];
  final List<Atleta> _extras = [];
  final Set<String> notifLidas = {};

  /// Foto de perfil do usuário atual (guardada somente neste aparelho).
  Uint8List? fotoBytes;

  /// Apenas para demonstrar a tela de planos: finge que o limite foi excedido.
  bool simularLimite = false;

  DateTime get hoje => somenteData(DateTime.now());

  Future<void> iniciar({
    required String nome,
    required String email,
    required bool ehTreinador,
  }) async {
    treinador = ehTreinador;
    nomeUsuario = nome.trim();
    emailUsuario = email;
    if (!_carregado) {
      final p = await SharedPreferences.getInstance();
      _lerExercicios(p.getString(_kExercicios));
      _lerTreinos(p.getString(_kTreinos));
      _removidos
        ..clear()
        ..addAll(p.getStringList(_kRemovidos) ?? const []);
      final presRaw = p.getString(_kPresencas);
      if (presRaw != null) {
        final m = jsonDecode(presRaw) as Map<String, dynamic>;
        _pres
          ..clear()
          ..addAll(m.map((k, v) => MapEntry(k, v as String)));
      }
      final testesRaw = p.getString(_kTestes);
      if (testesRaw != null) {
        _testes
          ..clear()
          ..addAll((jsonDecode(testesRaw) as List)
              .map((e) => ResultadoTeste.fromJson(e as Map<String, dynamic>)));
      }
      _lerDocs(p.getString(_kDocs));
      if (!(p.getBool(_kDocsAtletas) ?? false)) {
        _docs.addAll(_docsDosAtletas());
        await _persistir(_kDocs, _docs.map((e) => e.toJson()).toList());
        await p.setBool(_kDocsAtletas, true);
      }
      _lerExtras(p.getString(_kExtras));
      simularLimite = p.getBool(_kSimLimite) ?? false;
      _lerEventos(p.getString(_kEventos));
      _lerMetas(p.getString(_kMetas));
      _lerFeedbacks(p.getString(_kFeedbacks));
      _lerPosts(p.getString(_kPosts));
      planoAtual = (p.getInt(_kPlano) ?? 0).clamp(0, planosSate.length - 1).toInt();
      _carregado = true;
    }
    final pf = await SharedPreferences.getInstance();
    final f = pf.getString('sate_foto_${emailUsuario.toLowerCase()}');
    fotoBytes = f == null ? null : base64Decode(f);
    _montarDemo();
    notifyListeners();
  }

  /// Foto do usuário atual, se [nome] for o dele.
  Uint8List? fotoParaNome(String nome) =>
      (nomeUsuario.isNotEmpty && nome == nomeUsuario) ? fotoBytes : null;

  /// Guarda (ou remove, com null) a foto de perfil neste aparelho.
  Future<void> definirFoto(Uint8List? bytes) async {
    final p = await SharedPreferences.getInstance();
    final chave = 'sate_foto_${emailUsuario.toLowerCase()}';
    if (bytes == null) {
      await p.remove(chave);
    } else {
      await p.setString(chave, base64Encode(bytes));
    }
    fotoBytes = bytes;
    notifyListeners();
  }

  void _lerExercicios(String? raw) {
    _exercicios.clear();
    if (raw != null) {
      _exercicios.addAll((jsonDecode(raw) as List)
          .map((e) => Exercicio.fromJson(e as Map<String, dynamic>)));
    } else {
      _exercicios.addAll(_exerciciosDemo);
    }
  }

  void _lerTreinos(String? raw) {
    _custom.clear();
    if (raw != null) {
      _custom.addAll((jsonDecode(raw) as List)
          .map((e) => Treino.fromJson(e as Map<String, dynamic>)));
    }
  }

  void _lerDocs(String? raw) {
    _docs.clear();
    if (raw != null) {
      _docs.addAll((jsonDecode(raw) as List)
          .map((e) => Documento.fromJson(e as Map<String, dynamic>)));
      return;
    }
    final h = hoje;
    Documento d(String id, String t, String c, int? dias, bool ok, String o) =>
        Documento(
          id: id,
          titulo: t,
          categoria: c,
          validade: dias == null ? null : somaDias(h, dias),
          aprovado: ok,
          obs: o,
        );
    _docs.addAll([
      d('d1', 'Registro profissional (CREF)', 'Profissional', 210, true,
          ''),
      d('d2', 'Atestado de antecedentes', 'Profissional', 20, true,
          'Renovar nas próximas semanas.'),
      d('d3', 'Certificado de primeiros socorros', 'Capacitação', -35, true,
          'Validade expirada: agendar reciclagem.'),
      d('d4', 'Seguro de responsabilidade civil', 'Seguros', null, false,
          'Ainda não enviado.'),
      d('d5', 'Autorização de uso do espaço esportivo', 'Local', 75, true, ''),
      d('d6', 'Termos de responsabilidade dos atletas', 'Atletas', null, false,
          'Coletar assinaturas do grupo Sub-17.'),
      d('d7', 'Curso de preparação física', 'Capacitação', 400, true, ''),
      d('d8', 'Comprovante de formação continuada', 'Capacitação', -5, true,
          'Vencido há poucos dias.'),
    ]);
  }

  // ── Demonstração: atletas, testes ──

  double _h(String s, [int salt = 0]) {
    var h = (2166136261 ^ salt) & 0xFFFFFFFF;
    for (final u in s.codeUnits) {
      h ^= u;
      h = (h * 16777619) & 0xFFFFFFFF;
    }
    return (h % 10000) / 10000.0;
  }

  void _montarDemo() {
    _atletas
      ..clear()
      ..addAll(_atletasDemo)
      ..addAll(_extras);
    eu = Atleta(
      id: 'eu',
      nome: nomeUsuario.isEmpty ? 'Atleta' : nomeUsuario,
      equipeId: 'eq1',
      posicao: 'Ponteira',
      email: emailUsuario,
      idade: 16,
      alturaCm: 172,
      pesoKg: 60,
      assiduidade: 0.88,
    );
    _testesDemo.clear();
    for (final a in [..._atletas, if (!treinador) eu]) {
      final eq = equipes.firstWhere((e) => e.id == a.equipeId);
      final aplicaveis = catalogoTestes.where(
          (t) => t.modalidade == null || t.modalidade == eq.modalidade);
      for (final t in aplicaveis) {
        final nivel = 0.30 + _h(a.id, t.nome.length) * 0.42;
        final tendencia = 0.08 + _h(a.id, t.nome.length + 7) * 0.14;
        for (var k = 0; k < 6; k++) {
          final ruido = (_h('${a.id}${t.nome}$k') - 0.5) * 0.06;
          final f = (nivel + tendencia * k / 5 + ruido).clamp(0.02, 0.98).toDouble();
          var v = t.pior + (t.melhor - t.pior) * f;
          v = double.parse(v.toStringAsFixed(t.casas == 0 ? 0 : t.casas));
          final data = somaDias(hoje, -((5 - k) * 28 + 6));
          _testesDemo.add(ResultadoTeste(a.nome, t.nome, t.unidade, data, v, '',
              demo: true));
        }
      }
    }
  }

  // ── Consultas básicas ──

  List<Atleta> get atletas => List.unmodifiable(_atletas);

  List<Atleta> atletasDaEquipe(String? equipeId) => equipeId == null
      ? atletas
      : _atletas.where((a) => a.equipeId == equipeId).toList();

  Equipe equipe(String id) => equipes.firstWhere((e) => e.id == id);

  Atleta? atletaPorNome(String nome) {
    for (final a in [..._atletas, eu]) {
      if (a.nome.toLowerCase() == nome.trim().toLowerCase()) return a;
    }
    return null;
  }

  List<Exercicio> get exercicios => List.unmodifiable(_exercicios);

  Exercicio? exercicio(String id) {
    for (final e in _exercicios) {
      if (e.id == id) return e;
    }
    return null;
  }

  List<Documento> get documentos => List.unmodifiable(_docs);

  /// Documentos de um atleta (ou do treinador, quando [atletaId] é null).
  List<Documento> documentosDe(String? atletaId) =>
      _docs.where((d) => d.atletaId == atletaId).toList();

  /// Documentos iniciais de cada atleta (atestado, termo e identificação).
  List<Documento> _docsDosAtletas() {
    final h = hoje;
    final res = <Documento>[];
    for (final a in _atletasDemo) {
      final r = _h(a.id, 21);
      final r2 = _h(a.id, 22);
      DateTime? val(int dias) => somaDias(h, dias);
      // Atestado médico: varia entre em dia, vencendo, vencido e pendente.
      final estado = (r * 10).floor();
      res.add(Documento(
        id: 'da1-${a.id}',
        titulo: 'Atestado médico',
        categoria: 'Saúde',
        validade: estado == 9 ? null : val(estado < 5 ? 120 + estado * 20 : (estado < 7 ? 18 : -12)),
        aprovado: estado != 9,
        obs: estado == 9 ? 'Ainda não enviado.' : '',
        atletaId: a.id,
      ));
      res.add(Documento(
        id: 'da2-${a.id}',
        titulo: a.idade < 18 ? 'Autorização dos responsáveis' : 'Termo de responsabilidade',
        categoria: 'Termos',
        validade: val(300),
        aprovado: r2 > 0.2,
        obs: r2 > 0.2 ? '' : 'Aguardando assinatura.',
        atletaId: a.id,
      ));
      res.add(Documento(
        id: 'da3-${a.id}',
        titulo: 'Documento de identificação',
        categoria: 'Cadastro',
        validade: null,
        aprovado: true,
        obs: '',
        atletaId: a.id,
      ));
    }
    return res;
  }

  // ── Exercícios (CRUD local) ──

  Future<void> salvarExercicio(Exercicio e) async {
    final idx = _exercicios.indexWhere((x) => x.id == e.id);
    if (idx >= 0) {
      _exercicios[idx] = e;
    } else {
      _exercicios.add(e);
    }
    await _persistir(_kExercicios, _exercicios.map((e) => e.toJson()).toList());
    notifyListeners();
  }

  Future<void> removerExercicio(String id) async {
    _exercicios.removeWhere((x) => x.id == id);
    await _persistir(_kExercicios, _exercicios.map((e) => e.toJson()).toList());
    notifyListeners();
  }

  // ── Treinos ──

  Treino _padrao(Equipe e, DateTime d) {
    final m = _modelosSessao[e.id]?[d.weekday];
    return Treino(
      id: 'p-${e.id}-${chaveData(d)}',
      titulo: m?.$1 ?? 'Treino da equipe',
      objetivo: m?.$2 ?? '',
      foco: m?.$3 ?? '',
      observacoes: '',
      equipeId: e.id,
      data: d,
      inicioMin: e.inicioMin,
      duracaoMin: e.duracaoMin,
      exercicioIds: m?.$4 ?? const [],
      atletaIds: const [],
      modelo: true,
    );
  }

  List<Treino> treinosNoDia(DateTime dia, {String? equipeId}) {
    final d = somenteData(dia);
    final k = chaveData(d);
    final res = <Treino>[];
    for (final t in _custom) {
      if (t.chave == k) res.add(t);
    }
    for (final e in equipes) {
      final id = 'p-${e.id}-$k';
      if (_removidos.contains(id) || _custom.any((t) => t.id == id)) continue;
      if (e.dias.contains(d.weekday)) res.add(_padrao(e, d));
    }
    final filtrados = equipeId == null
        ? res
        : res.where((t) => t.equipeId == equipeId).toList();
    filtrados.sort((a, b) => a.inicioMin.compareTo(b.inicioMin));
    return filtrados;
  }

  List<Treino> treinosDoAtleta(Atleta a, DateTime dia) {
    return treinosNoDia(dia)
        .where((t) =>
            t.equipeId == a.equipeId &&
            (t.atletaIds.isEmpty || t.atletaIds.contains(a.id)))
        .toList();
  }

  /// Próximos treinos a partir de agora (até [dias] dias à frente).
  List<Treino> proximosTreinos({Atleta? atleta, int dias = 21, int limite = 6}) {
    final res = <Treino>[];
    final agora = DateTime.now();
    for (var i = 0; i <= dias && res.length < limite; i++) {
      final d = somaDias(hoje, i);
      final lista = atleta == null ? treinosNoDia(d) : treinosDoAtleta(atleta, d);
      for (final t in lista) {
        final fim = DateTime(d.year, d.month, d.day).add(Duration(minutes: t.inicioMin + t.duracaoMin));
        if (fim.isAfter(agora)) res.add(t);
      }
    }
    return res.take(limite).toList();
  }

  Future<void> salvarTreino(Treino t) async {
    final idx = _custom.indexWhere((x) => x.id == t.id);
    if (idx >= 0) {
      _custom[idx] = t;
    } else {
      _custom.add(t);
    }
    _removidos.remove(t.id);
    await _salvarTreinos();
    notifyListeners();
  }

  Future<void> removerTreino(String id) async {
    _custom.removeWhere((x) => x.id == id);
    if (id.startsWith('p-')) _removidos.add(id);
    await _salvarTreinos();
    notifyListeners();
  }

  Future<void> _salvarTreinos() async {
    await _persistir(_kTreinos, _custom.map((e) => e.toJson()).toList());
    final p = await SharedPreferences.getInstance();
    await p.setStringList(_kRemovidos, _removidos.toList());
  }

  // ── Frequência ──

  StatusPres statusAtleta(Atleta a, DateTime dia) {
    final d = somenteData(dia);
    if (treinosDoAtleta(a, d).isEmpty) return StatusPres.semTreino;
    final o = _pres['${a.id}|${chaveData(d)}'];
    if (o == 'ok') return StatusPres.realizado;
    if (o == 'falta') return StatusPres.naoRealizado;
    if (d.isBefore(hoje)) {
      return _h('${a.id}${chaveData(d)}') < a.assiduidade
          ? StatusPres.realizado
          : StatusPres.naoRealizado;
    }
    return StatusPres.pendente;
  }

  /// Marca presença (true), falta (false) ou limpa a marcação (null).
  Future<void> marcarPresenca(Atleta a, DateTime dia, bool? presente) async {
    final k = '${a.id}|${chaveData(somenteData(dia))}';
    if (presente == null) {
      _pres.remove(k);
    } else {
      _pres[k] = presente ? 'ok' : 'falta';
    }
    await _persistir(_kPresencas, _pres);
    notifyListeners();
  }

  ({int ok, int total}) contagem(List<Atleta> lista, DateTime ini, DateTime fim) {
    var ok = 0, total = 0;
    var d = somenteData(ini);
    final f = somenteData(fim);
    while (!d.isAfter(f)) {
      for (final a in lista) {
        final s = statusAtleta(a, d);
        if (s == StatusPres.realizado) {
          ok++;
          total++;
        } else if (s == StatusPres.naoRealizado) {
          total++;
        }
      }
      d = somaDias(d, 1);
    }
    return (ok: ok, total: total);
  }

  /// Percentual de presença (0..1) ou null se não houve treino no período.
  double? pct(List<Atleta> lista, DateTime ini, DateTime fim) {
    final c = contagem(lista, ini, fim);
    return c.total == 0 ? null : c.ok / c.total;
  }

  // ── Testes físicos ──

  TipoTeste tipoPorNome(String nome, String unidade) {
    for (final t in catalogoTestes) {
      if (t.nome.toLowerCase() == nome.toLowerCase()) return t;
    }
    return TipoTeste(
      nome: nome,
      categoria: 'Outro',
      unidade: unidade,
      menorMelhor: false,
      pior: 0,
      melhor: 1,
      casas: 1,
      icone: Icons.show_chart_rounded,
    );
  }

  /// Testes aplicáveis a um atleta (universais + específicos da modalidade).
  List<TipoTeste> testesDoAtleta(Atleta a) {
    final m = equipe(a.equipeId).modalidade;
    return catalogoTestes
        .where((t) => t.modalidade == null || t.modalidade == m)
        .toList();
  }

  /// Resultados de UM atleta (nunca mistura atletas), do mais antigo ao mais novo.
  List<ResultadoTeste> resultadosDe(String atleta, {String? teste}) {
    final nome = atleta.trim().toLowerCase();
    final todos = [..._testesDemo, ..._testes].where((r) =>
        r.atleta.trim().toLowerCase() == nome &&
        (teste == null || r.teste.toLowerCase() == teste.toLowerCase()));
    final l = todos.toList()..sort((a, b) => a.data.compareTo(b.data));
    return l;
  }

  Future<void> registrarTeste(ResultadoTeste r) async {
    _testes.add(r);
    await _persistir(_kTestes, _testes.map((e) => e.toJson()).toList());
    notifyListeners();
  }

  Future<void> removerTeste(ResultadoTeste r) async {
    _testes.remove(r);
    await _persistir(_kTestes, _testes.map((e) => e.toJson()).toList());
    notifyListeners();
  }

  /// Escores 0..1 por categoria universal usando o último resultado do atleta.
  List<double> escoresPorCategoria(Atleta a) {
    return [
      for (final cat in categoriasUniversais)
        () {
          final t = catalogoTestes.firstWhere((x) => x.categoria == cat);
          final r = resultadosDe(a.nome, teste: t.nome);
          return r.isEmpty ? 0.0 : t.escore(r.last.valor);
        }(),
    ];
  }

  // ── Documentos ──

  Future<void> salvarDocumento(Documento d) async {
    final idx = _docs.indexWhere((x) => x.id == d.id);
    if (idx >= 0) {
      _docs[idx] = d;
    } else {
      _docs.add(d);
    }
    await _persistir(_kDocs, _docs.map((e) => e.toJson()).toList());
    notifyListeners();
  }

  Future<void> removerDocumento(String id) async {
    _docs.removeWhere((x) => x.id == id);
    await _persistir(_kDocs, _docs.map((e) => e.toJson()).toList());
    notifyListeners();
  }

  // ── Plano (somente visual) ──

  Future<void> escolherPlano(int i) async {
    planoAtual = i;
    final p = await SharedPreferences.getInstance();
    await p.setInt(_kPlano, i);
    notifyListeners();
  }

  // ── Tutorial ──

  Future<bool> tutorialVisto(bool paraTreinador) async {
    final p = await SharedPreferences.getInstance();
    return p.getBool(paraTreinador ? 'sate_tut_treinador' : 'sate_tut_atleta') ?? false;
  }

  Future<void> marcarTutorialVisto(bool paraTreinador) async {
    final p = await SharedPreferences.getInstance();
    await p.setBool(paraTreinador ? 'sate_tut_treinador' : 'sate_tut_atleta', true);
  }


  // ───────────────────────── Eventos do calendário ─────────────────────────

  void _lerEventos(String? raw) {
    _eventos.clear();
    if (raw != null) {
      _eventos.addAll((jsonDecode(raw) as List)
          .map((e) => EventoAgenda.fromJson(e as Map<String, dynamic>)));
      return;
    }
    final h = hoje;
    EventoAgenda ev(String id, int dias, String t, TipoEv tp, int i, int f,
            String l, {String? eq, String o = ''}) =>
        EventoAgenda(
          id: id,
          titulo: t,
          local: l,
          observacoes: o,
          data: somaDias(h, dias),
          tipo: tp,
          inicioMin: i,
          fimMin: f,
          equipeId: eq,
          demo: true,
        );
    _eventos.addAll([
      ev('e1', 3, 'Jogo amistoso', TipoEv.jogo, 10 * 60, 12 * 60, 'Ginásio Municipal',
          eq: 'eq1', o: 'Chegar 40 minutos antes para o aquecimento. Uniforme completo.'),
      ev('e2', 6, 'Avaliação física', TipoEv.avaliacao, 8 * 60 + 30, 10 * 60,
          'Sala de avaliação', o: 'Testes de velocidade, salto e flexibilidade.'),
      ev('e3', 8, 'Reunião com atletas', TipoEv.reuniao, 14 * 60, 15 * 60,
          'Sala da comissão', o: 'Alinhamento do calendário do mês.'),
      ev('e4', 12, 'Jogo - 1ª rodada do campeonato', TipoEv.jogo, 15 * 60, 17 * 60,
          'Quadra Coberta', eq: 'eq2'),
      ev('e5', 1, 'Lembrete: levar atestado médico', TipoEv.lembrete, 9 * 60,
          9 * 60 + 30, 'Secretaria'),
    ]);
  }

  List<EventoAgenda> get eventos => List.unmodifiable(_eventos);

  EventoAgenda? evento(String id) {
    for (final e in _eventos) {
      if (e.id == id) return e;
    }
    return null;
  }

  List<EventoAgenda> eventosNoDia(DateTime dia, {String? equipeId}) {
    final d = somenteData(dia);
    final l = _eventos
        .where((e) =>
            e.data == d &&
            (equipeId == null || e.equipeId == null || e.equipeId == equipeId))
        .toList()
      ..sort((a, b) => a.inicioMin.compareTo(b.inicioMin));
    return l;
  }

  Future<void> salvarEvento(EventoAgenda e) async {
    final i = _eventos.indexWhere((x) => x.id == e.id);
    if (i >= 0) {
      _eventos[i] = e;
    } else {
      _eventos.add(e);
    }
    await _persistir(_kEventos, _eventos.map((x) => x.toJson()).toList());
    notifyListeners();
  }

  Future<void> removerEvento(String id) async {
    _eventos.removeWhere((x) => x.id == id);
    await _persistir(_kEventos, _eventos.map((x) => x.toJson()).toList());
    notifyListeners();
  }

  /// Tudo o que está programado num dia: treinos + eventos.
  /// Com [atleta], só o que diz respeito a ele; sem, filtra por [equipeIds] (null = todas).
  List<AtividadeDia> atividadesNoDia(DateTime dia,
      {Atleta? atleta, Set<String>? equipeIds}) {
    final d = somenteData(dia);
    final res = <AtividadeDia>[];
    final treinos = atleta != null
        ? treinosDoAtleta(atleta, d)
        : treinosNoDia(d)
            .where((t) => equipeIds == null || equipeIds.contains(t.equipeId))
            .toList();
    for (final t in treinos) {
      res.add(AtividadeDia(
        data: d,
        inicioMin: t.inicioMin,
        fimMin: t.inicioMin + t.duracaoMin,
        titulo: t.titulo,
        subtitulo: equipe(t.equipeId).nome,
        icone: Icons.fitness_center_rounded,
        tipoRotulo: 'Treino',
        treino: t,
      ));
    }
    for (final e in _eventos.where((e) => e.data == d)) {
      final vale = atleta != null
          ? (e.equipeId == null || e.equipeId == atleta.equipeId)
          : (equipeIds == null || e.equipeId == null || equipeIds.contains(e.equipeId));
      if (!vale) continue;
      res.add(AtividadeDia(
        data: d,
        inicioMin: e.inicioMin,
        fimMin: e.fimMin,
        titulo: e.titulo,
        subtitulo: e.local,
        icone: e.tipo.icone,
        tipoRotulo: e.tipo.nome,
        evento: e,
      ));
    }
    res.sort((a, b) => a.inicioMin.compareTo(b.inicioMin));
    return res;
  }

  List<AtividadeDia> proximasAtividades({Atleta? atleta, int limite = 4, int dias = 30}) {
    final res = <AtividadeDia>[];
    final agora = DateTime.now();
    for (var i = 0; i <= dias && res.length < limite; i++) {
      final d = somaDias(hoje, i);
      for (final a in atividadesNoDia(d, atleta: atleta)) {
        final fim = DateTime(d.year, d.month, d.day, 0, (a.fimMin ?? a.inicioMin + 60));
        if (fim.isAfter(agora)) res.add(a);
      }
    }
    return res.take(limite).toList();
  }

  // ───────────────────────── Metas e feedbacks ─────────────────────────

  void _lerMetas(String? raw) {
    _metas.clear();
    if (raw != null) {
      _metas.addAll((jsonDecode(raw) as List)
          .map((e) => MetaAtleta.fromJson(e as Map<String, dynamic>)));
      return;
    }
    final h = hoje;
    for (final a in [..._atletasDemo, _atletaEuBase()]) {
      _metas.add(MetaAtleta(
        id: 'm1-${a.id}',
        atletaId: a.id,
        titulo: 'Melhorar resistência',
        descricao: 'Aumentar o desempenho nos treinos aeróbicos.',
        progresso: 40 + (_h(a.id, 3) * 55).round(),
        prazo: somaDias(h, 30),
      ));
      _metas.add(MetaAtleta(
        id: 'm2-${a.id}',
        atletaId: a.id,
        titulo: 'Aumentar frequência',
        descricao: 'Manter frequência acima de 90%.',
        progresso: 50 + (_h(a.id, 9) * 50).round(),
        prazo: somaDias(h, 45),
      ));
    }
  }

  Atleta _atletaEuBase() => const Atleta(
      id: 'eu',
      nome: '',
      equipeId: 'eq1',
      posicao: '',
      email: '',
      idade: 0,
      alturaCm: 0,
      pesoKg: 0,
      assiduidade: 0);

  List<MetaAtleta> metasDe(String atletaId) =>
      _metas.where((m) => m.atletaId == atletaId).toList()
        ..sort((a, b) => a.prazo.compareTo(b.prazo));

  Future<void> salvarMeta(MetaAtleta m) async {
    final i = _metas.indexWhere((x) => x.id == m.id);
    if (i >= 0) {
      _metas[i] = m;
    } else {
      _metas.add(m);
    }
    await _persistir(_kMetas, _metas.map((x) => x.toJson()).toList());
    notifyListeners();
  }

  Future<void> removerMeta(String id) async {
    _metas.removeWhere((x) => x.id == id);
    await _persistir(_kMetas, _metas.map((x) => x.toJson()).toList());
    notifyListeners();
  }

  void _lerFeedbacks(String? raw) {
    _feedbacks.clear();
    if (raw != null) {
      _feedbacks.addAll((jsonDecode(raw) as List)
          .map((e) => FeedbackAtleta.fromJson(e as Map<String, dynamic>)));
      return;
    }
    final agora = DateTime.now();
    for (final id in ['a1', 'a2', 'a3', 'a4', 'a7', 'a12', 'eu']) {
      _feedbacks.add(FeedbackAtleta(
          'f1-$id',
          id,
          'Ótima evolução nos últimos treinos. Demonstrou dedicação e participação.',
          agora.subtract(const Duration(hours: 5))));
      _feedbacks.add(FeedbackAtleta(
          'f2-$id',
          id,
          'Melhorou a execução dos exercícios. Continue mantendo esse ritmo.',
          agora.subtract(const Duration(days: 12))));
    }
  }

  List<FeedbackAtleta> feedbacksDe(String atletaId) =>
      _feedbacks.where((f) => f.atletaId == atletaId).toList()
        ..sort((a, b) => b.quando.compareTo(a.quando));

  Future<void> salvarFeedback(FeedbackAtleta f) async {
    final i = _feedbacks.indexWhere((x) => x.id == f.id);
    if (i >= 0) {
      _feedbacks[i] = f;
    } else {
      _feedbacks.add(f);
    }
    await _persistir(_kFeedbacks, _feedbacks.map((x) => x.toJson()).toList());
    notifyListeners();
  }

  Future<void> removerFeedback(String id) async {
    _feedbacks.removeWhere((x) => x.id == id);
    await _persistir(_kFeedbacks, _feedbacks.map((x) => x.toJson()).toList());
    notifyListeners();
  }

  /// Linha do tempo do atleta: atividades recentes + marcos importantes.
  List<({DateTime data, IconData icone, String titulo, String sub, bool marco})>
      historicoAtleta(Atleta a) {
    final res =
        <({DateTime data, IconData icone, String titulo, String sub, bool marco})>[];
    for (var i = 1; i <= 21; i++) {
      final d = somaDias(hoje, -i);
      for (final t in treinosDoAtleta(a, d)) {
        final st = statusAtleta(a, d);
        if (st == StatusPres.semTreino || st == StatusPres.pendente) continue;
        res.add((
          data: DateTime(d.year, d.month, d.day, 0, t.inicioMin),
          icone: Icons.fitness_center_rounded,
          titulo: t.titulo,
          sub: st == StatusPres.realizado ? 'Participou do treino' : 'Não compareceu',
          marco: false,
        ));
      }
    }
    for (final t in testesDoAtleta(a)) {
      final r = resultadosDe(a.nome, teste: t.nome);
      if (r.isEmpty) continue;
      final melhor = t.menorMelhor
          ? r.map((x) => x.valor).reduce((x, y) => x < y ? x : y)
          : r.map((x) => x.valor).reduce((x, y) => x > y ? x : y);
      final ultimo = r.last;
      final recorde = r.length > 1 && ultimo.valor == melhor;
      res.add((
        data: ultimo.data,
        icone: recorde ? Icons.military_tech_outlined : Icons.assessment_outlined,
        titulo: recorde ? 'Melhor marca: ${t.nome}' : 'Avaliação: ${t.nome}',
        sub: t.formatar(ultimo.valor),
        marco: recorde,
      ));
    }
    for (final f in feedbacksDe(a.id)) {
      res.add((
        data: f.quando,
        icone: Icons.chat_bubble_outline_rounded,
        titulo: 'Feedback do treinador',
        sub: f.texto,
        marco: true,
      ));
    }
    for (final m in metasDe(a.id).where((m) => m.concluida)) {
      res.add((
        data: m.prazo.isAfter(hoje) ? hoje : m.prazo,
        icone: Icons.flag_rounded,
        titulo: 'Meta concluída',
        sub: m.titulo,
        marco: true,
      ));
    }
    res.add((
      data: somaDias(hoje, -200),
      icone: Icons.groups_rounded,
      titulo: 'Entrada na equipe',
      sub: equipe(a.equipeId).nome,
      marco: true,
    ));
    res.sort((x, y) => y.data.compareTo(x.data));
    return res;
  }

  // ───────────────────────── Comunidade (feed) ─────────────────────────

  void _lerPosts(String? raw) {
    _posts.clear();
    if (raw != null) {
      _posts.addAll((jsonDecode(raw) as List)
          .map((e) => Post.fromJson(e as Map<String, dynamic>)));
      return;
    }
    final agora = DateTime.now();
    Post p(String id, String autor, Duration atras, String texto, int curt,
            String grupo, List<Comentario> c,
            {bool curtido = false, String? imagem}) =>
        Post(
          id: id,
          autor: autor,
          texto: texto,
          quando: agora.subtract(atras),
          minha: false,
          grupo: grupo,
          curtidasBase: curt,
          curtido: curtido,
          comentarios: c,
          imagem: imagem,
        );
    _posts.addAll([
      p('p1', 'João Silva', const Duration(hours: 2),
          'Treino concluído com sucesso!\nFoco e disciplina sempre!', 45, 'equipe', const [
        Comentario('Ana Costa', 'Muito bom! Parabéns pelo treino!'),
        Comentario('Carlos Mendes', 'É isso aí! Foco sempre.'),
      ], curtido: true, imagem: imagensFeed[0]),
      p('p2', 'Ana Costa', const Duration(hours: 4),
          'Treino coletivo foi demais hoje!\nSeguimos evoluindo.', 65, 'equipe',
          const [Comentario('João Silva', 'Treino muito bom hoje!')],
          imagem: imagensFeed[1]),
      p('p3', 'Carlos Mendes', const Duration(days: 1),
          'Mais um treino finalizado. Evolução é construída todos os dias!', 38,
          'seguindo', const [], imagem: imagensFeed[2]),
      p('p4', 'Mariana Souza', const Duration(days: 1, hours: 3),
          'Muito bom poder acompanhar a evolução da equipe.', 51, 'seguindo',
          const [], imagem: imagensFeed[3]),
    ]);
  }

  List<Post> get posts =>
      List.unmodifiable(_posts..sort((a, b) => b.quando.compareTo(a.quando)));

  Future<void> _salvarPosts() async {
    await _persistir(_kPosts, _posts.map((x) => x.toJson()).toList());
    notifyListeners();
  }

  Future<void> publicar(String texto, {String? imagem}) async {
    _posts.add(Post(
      id: novoId(),
      autor: nomeUsuario.isEmpty ? (treinador ? 'Treinador' : 'Atleta') : nomeUsuario,
      texto: texto,
      quando: DateTime.now(),
      minha: true,
      grupo: 'equipe',
      curtidasBase: 0,
      curtido: false,
      comentarios: const [],
      imagem: imagem,
    ));
    await _salvarPosts();
  }

  Future<void> alternarCurtida(String id) async {
    final i = _posts.indexWhere((p) => p.id == id);
    if (i < 0) return;
    _posts[i] = _posts[i].copiar(curtido: !_posts[i].curtido);
    await _salvarPosts();
  }

  Future<void> comentar(String id, String texto) async {
    final i = _posts.indexWhere((p) => p.id == id);
    if (i < 0) return;
    final autor = nomeUsuario.isEmpty ? 'Você' : nomeUsuario;
    _posts[i] = _posts[i]
        .copiar(comentarios: [..._posts[i].comentarios, Comentario(autor, texto)]);
    await _salvarPosts();
  }

  Future<void> editarPost(String id, String texto, {String? imagem}) async {
    final i = _posts.indexWhere((p) => p.id == id);
    if (i < 0) return;
    _posts[i] = _posts[i].copiar(texto: texto, imagem: imagem, limparImagem: imagem == null);
    await _salvarPosts();
  }

  Future<void> removerPost(String id) async {
    _posts.removeWhere((p) => p.id == id);
    await _salvarPosts();
  }

  // ───────────────────────── Atletas cadastrados e limite do plano ─────────────────────────

  void _lerExtras(String? raw) {
    _extras.clear();
    if (raw == null) return;
    for (final e in jsonDecode(raw) as List) {
      final m = e as Map<String, dynamic>;
      _extras.add(Atleta(
        id: m['id'] as String,
        nome: m['n'] as String,
        equipeId: m['e'] as String,
        posicao: (m['p'] ?? '') as String,
        email: '',
        idade: 18,
        alturaCm: 170,
        pesoKg: 65,
        assiduidade: 0.8,
      ));
    }
  }

  Future<void> adicionarAtleta(String nome, String equipeId, String posicao) async {
    final a = Atleta(
      id: 'x${novoId()}',
      nome: nome,
      equipeId: equipeId,
      posicao: posicao.isEmpty ? 'A definir' : posicao,
      email: '',
      idade: 18,
      alturaCm: 170,
      pesoKg: 65,
      assiduidade: 0.8,
    );
    _extras.add(a);
    await _persistir(_kExtras, [
      for (final x in _extras) {'id': x.id, 'n': x.nome, 'e': x.equipeId, 'p': x.posicao}
    ]);
    _montarDemo();
    notifyListeners();
  }

  Plano get plano => planosSate[planoAtual];

  /// Quantidade de atletas considerada para o limite do plano.
  int get totalAtletas =>
      simularLimite ? plano.limite + 3 : _atletas.length;

  bool get excedeuLimite => totalAtletas > plano.limite;

  Future<void> definirSimularLimite(bool v) async {
    simularLimite = v;
    final p = await SharedPreferences.getInstance();
    await p.setBool(_kSimLimite, v);
    notifyListeners();
  }

  // ── Avisos (notificações) ──

  /// Pendências que exigem atenção do treinador.
  List<({String id, String titulo, String sub, String destino})> pendenciasTreinador() {
    final h = hoje;
    final res = <({String id, String titulo, String sub, String destino})>[];
    final docs = _docs.where((d) {
      final e = d.estado(h);
      return e == EstadoDoc.pendente || e == EstadoDoc.vencido;
    }).length;
    if (docs > 0) {
      res.add((
        id: 'pend-docs',
        titulo: '$docs documento${docs > 1 ? 's' : ''} pendente${docs > 1 ? 's' : ''} ou vencido${docs > 1 ? 's' : ''}',
        sub: 'Regularize na documentação',
        destino: 'docs',
      ));
    }
    final baixa = _atletas.where((a) {
      final p = pct([a], somaDias(h, -30), h);
      return p != null && p < 0.6;
    }).toList();
    if (baixa.isNotEmpty) {
      res.add((
        id: 'pend-pres',
        titulo: '${baixa.length} atleta${baixa.length > 1 ? 's' : ''} com presença abaixo de 60%',
        sub: baixa.take(3).map((a) => a.nome.split(' ').first).join(', '),
        destino: 'atletas',
      ));
    }
    final hojeSemChamada = treinosNoDia(h).where((t) {
      final agoraMin = DateTime.now().hour * 60 + DateTime.now().minute;
      return t.inicioMin <= agoraMin;
    }).length;
    if (hojeSemChamada > 0) {
      res.add((
        id: 'pend-chamada',
        titulo: '$hojeSemChamada chamada${hojeSemChamada > 1 ? 's' : ''} de hoje para conferir',
        sub: 'Confirme as presenças no calendário',
        destino: 'calendario',
      ));
    }
    if (excedeuLimite) {
      res.add((
        id: 'pend-plano',
        titulo: 'Limite de atletas do plano excedido',
        sub: '$totalAtletas atletas para um limite de ${plano.limite}',
        destino: 'planos',
      ));
    }
    return res;
  }

  void marcarNotifLida(String id) {
    notifLidas.add(id);
    notifyListeners();
  }

  // ── Persistência ──

  Future<void> _persistir(String chave, Object dados) async {
    final p = await SharedPreferences.getInstance();
    await p.setString(chave, jsonEncode(dados));
  }

  String novoId() => DateTime.now().microsecondsSinceEpoch.toString();
}
