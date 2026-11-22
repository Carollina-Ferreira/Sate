import 'dart:async';
import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../../services/api_client.dart';
import '../../services/api_config.dart';
import '../../services/sate_api.dart';
import '../../services/sessao.dart';
import 'modelos.dart';

/// Permite exibir mensagens de erro da API de qualquer lugar (ligado ao MaterialApp).
final GlobalKey<ScaffoldMessengerState> sateMessengerKey =
    GlobalKey<ScaffoldMessengerState>();

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

/// Animações demonstrativas disponíveis (chave -> nome). Todas são desenhadas por
/// `AnimacaoExercicio` (ui/animacao_exercicio.dart).
const Map<String, String> videosDemo = {
  'demo:polichinelo': 'Polichinelo',
  'demo:joelhos': 'Elevação de joelhos',
  'demo:agachamento': 'Agachamento',
  'demo:afundo': 'Afundo',
  'demo:salto': 'Salto vertical',
  'demo:salto_caixa': 'Salto na caixa',
  'demo:prancha': 'Prancha',
  'demo:flexao': 'Flexão de braços',
  'demo:abdominal': 'Abdominal',
  'demo:corrida': 'Corrida',
  'demo:sprint': 'Tiro de velocidade',
  'demo:escada': 'Escada de agilidade',
  'demo:toque_manchete': 'Toque e manchete',
  'demo:saque': 'Saque',
  'demo:conducao': 'Condução de bola',
  'demo:mobilidade': 'Mobilidade de quadril',
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
      video: 'demo:joelhos',
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
      video: 'demo:afundo',
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
      video: 'demo:salto_caixa',
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
      video: 'demo:escada',
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
      video: 'demo:sprint',
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
      video: 'demo:toque_manchete',
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
      video: 'demo:saque',
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
      video: 'demo:conducao',
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
      video: 'demo:mobilidade',
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

// ───────────────────────── Armazenamento ─────────────────────────

/// Notificação do usuário (vinda de /api/notificacoes; atleta e treinador).
class NotificacaoApp {
  final String id, tipo, titulo, texto;
  final DateTime quando;
  final bool lida;
  const NotificacaoApp(this.id, this.tipo, this.titulo, this.texto, this.quando, this.lida);

  factory NotificacaoApp.fromApi(Map<String, dynamic> j) => NotificacaoApp(
        '${j['id']}',
        (j['type'] ?? '') as String,
        (j['title'] ?? '') as String,
        (j['description'] ?? '') as String,
        DateTime.tryParse('${j['time'] ?? j['createdAt']}')?.toLocal() ?? DateTime.now(),
        (j['read'] ?? false) as bool,
      );
}

// ───────────────────────── Armazenamento ─────────────────────────

/// Estado do app. O BANCO DE DADOS DO SERVIDOR é a fonte oficial: tudo o que
/// aparece aqui vem de /api/mobile/snapshot (mesmos dados do site) e fica apenas em
/// memória. Toda alteração é enviada à API e, depois, o estado é atualizado.
/// Permanecem somente no aparelho: tutorial já visto, plano (visual), feed da
/// comunidade e documentos pessoais do treinador (o servidor ainda não tem essas tabelas).
class SateStore extends ChangeNotifier {
  SateStore._();
  static final SateStore i = SateStore._();

  static const _kDocs = 'sate_docs';
  static const _kPlano = 'sate_plano';
  static const _kPosts = 'sate_posts';
  static const _kSimLimite = 'sate_sim_limite';
  static const _kExOcultos = 'sate_exercicios_ocultos';

  bool _carregado = false;
  bool treinador = true;
  String nomeUsuario = '';
  String emailUsuario = '';

  /// Estados de carregamento e erro para as telas.
  bool carregando = false;
  bool primeiraCargaFeita = false;
  String? erroSincronizacao;
  DateTime? ultimaSincronizacao;

  final List<Equipe> _equipes = [];
  final List<Atleta> _atletas = [];
  Atleta eu = _atletaVazio;

  static const Atleta _atletaVazio = Atleta(
      id: '',
      nome: '',
      equipeId: '',
      posicao: '',
      email: '',
      idade: 0,
      alturaCm: 0,
      pesoKg: 0);

  List<Equipe> get equipes => List.unmodifiable(_equipes);

  final List<Exercicio> _exercicios = [];
  final List<Exercicio> _exerciciosApi = [];
  final Set<String> _exOcultos = {};
  final List<Treino> _treinos = [];
  final Map<String, String> _pres = {};
  final List<ResultadoTeste> _testes = [];
  final List<Documento> _docs = [];
  final List<Documento> _docsLocais = []; // documentos pessoais do treinador
  int planoAtual = 0;
  final List<EventoAgenda> _eventos = [];
  final List<MetaAtleta> _metas = [];
  final List<FeedbackAtleta> _feedbacks = [];
  final List<Post> _posts = [];
  final List<NotificacaoApp> _notificacoes = [];

  Timer? _timer;
  bool _sincronizando = false;
  String? _avatarBaixado;

  /// Informações profissionais do treinador (vêm do servidor).
  String formacao = '', registroProfissional = '', experiencia = '';

  /// Foto de perfil do usuário atual (vem do servidor; cache em memória).
  Uint8List? fotoBytes;

  /// Apenas para demonstrar a tela de planos: finge que o limite foi excedido.
  bool simularLimite = false;

  DateTime get hoje => somenteData(DateTime.now());

  // ── Ciclo de vida da sessão ──

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
      _lerDocsLocais(p.getString(_kDocs));
      _lerPosts(p.getString(_kPosts));
      _exOcultos
        ..clear()
        ..addAll(p.getStringList(_kExOcultos) ?? const []);
      simularLimite = p.getBool(_kSimLimite) ?? false;
      planoAtual = (p.getInt(_kPlano) ?? 0).clamp(0, planosSate.length - 1).toInt();
      _carregado = true;
    }
    await sincronizar();
    _timer?.cancel();
    // Atualização periódica: mudanças feitas no site chegam ao app sem reabrir.
    _timer = Timer.periodic(const Duration(seconds: 45), (_) => sincronizar(silencioso: true));
  }

  /// Sai da conta: limpa tudo que estava em memória.
  Future<void> encerrar() async {
    _timer?.cancel();
    _timer = null;
    _equipes.clear();
    _atletas.clear();
    _exerciciosApi.clear();
    _treinos.clear();
    _pres.clear();
    _testes.clear();
    _docs.clear();
    _eventos.clear();
    _metas.clear();
    _feedbacks.clear();
    _notificacoes.clear();
    formacao = registroProfissional = experiencia = '';
    eu = _atletaVazio;
    fotoBytes = null;
    _avatarBaixado = null;
    primeiraCargaFeita = false;
    erroSincronizacao = null;
    _reconstruirExercicios();
    notifyListeners();
  }

  void _erro(Object e) {
    final msg = e is ApiException ? e.mensagem : 'Algo deu errado. Tente novamente.';
    sateMessengerKey.currentState
      ?..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(msg), behavior: SnackBarBehavior.floating));
  }

  /// Busca no servidor tudo o que o usuário pode ver e atualiza as telas.
  Future<void> sincronizar({bool silencioso = false}) async {
    if (_sincronizando || !Sessao.logado) return;
    _sincronizando = true;
    if (!silencioso) {
      carregando = true;
      notifyListeners();
    }
    try {
      final snap = await SateApi.snapshot();
      _aplicarSnapshot(snap);
      try {
        final n = await SateApi.notificacoes();
        _notificacoes
          ..clear()
          ..addAll([
            for (final x in (n['notificacoes'] as List? ?? const []))
              NotificacaoApp.fromApi(Map<String, dynamic>.from(x as Map))
          ]);
      } catch (_) {
        // Notificações não devem derrubar a tela principal.
      }
      erroSincronizacao = null;
      ultimaSincronizacao = DateTime.now();
      primeiraCargaFeita = true;
      _baixarAvatar();
    } on ApiException catch (e) {
      erroSincronizacao = e.mensagem;
      if (!silencioso && !e.semConexao && e.status != 401) _erro(e);
    } catch (_) {
      erroSincronizacao = 'Não foi possível atualizar os dados.';
    } finally {
      _sincronizando = false;
      carregando = false;
      notifyListeners();
    }
  }

  void _aplicarSnapshot(Map<String, dynamic> j) {
    List<Map<String, dynamic>> lista(String k) => [
          for (final x in (j[k] as List? ?? const [])) Map<String, dynamic>.from(x as Map)
        ];

    _equipes
      ..clear()
      ..addAll(lista('equipes').map(Equipe.fromApi));

    final tr = j['treinador'];
    if (tr is Map) {
      formacao = (tr['formacao'] ?? '') as String;
      registroProfissional = (tr['registroProfissional'] ?? '') as String;
      experiencia = (tr['experiencia'] ?? '') as String;
    }

    final todos = lista('atletas').map(Atleta.fromApi).toList();
    if (treinador) {
      _atletas
        ..clear()
        ..addAll(todos);
      eu = _atletaVazio;
    } else {
      // Para o atleta, o primeiro item é ele mesmo; os demais são colegas de equipe.
      eu = todos.isNotEmpty ? todos.first : _atletaVazio;
      _atletas
        ..clear()
        ..addAll(todos.skip(1));
    }

    _treinos
      ..clear()
      ..addAll(lista('treinos').map(Treino.fromApi));
    _exerciciosApi
      ..clear()
      ..addAll(lista('exercicios').map(_exercicioApi));
    _reconstruirExercicios();

    _eventos
      ..clear()
      ..addAll(lista('eventos').map(EventoAgenda.fromApi));

    _pres.clear();
    for (final p in lista('presencas')) {
      _pres['${p['atletaId']}|${p['data']}'] = (p['presente'] == true) ? 'ok' : 'falta';
    }

    final nomes = {for (final a in [..._atletas, eu]) a.id: a.nome};
    _testes
      ..clear()
      ..addAll([
        for (final t in lista('testes'))
          ResultadoTeste(
            nomes['${t['atletaId']}'] ?? '',
            t['teste'] as String,
            (t['unidade'] ?? '') as String,
            DateTime.parse(t['data'] as String).toLocal(),
            (t['valor'] as num).toDouble(),
            (t['obs'] ?? '') as String,
            id: (t['id'] as num).toInt(),
            atletaId: '${t['atletaId']}',
          )
      ]);

    _metas
      ..clear()
      ..addAll([
        for (final m in lista('metas'))
          MetaAtleta(
            id: '${m['id']}',
            atletaId: '${m['atletaId']}',
            titulo: m['titulo'] as String,
            descricao: (m['descricao'] ?? '') as String,
            progresso: (m['progresso'] as num?)?.toInt() ?? 0,
            prazo: somenteData(DateTime.parse(m['prazo'] as String)),
          )
      ]);

    _feedbacks
      ..clear()
      ..addAll([
        for (final f in lista('feedbacks'))
          FeedbackAtleta('${f['id']}', '${f['atletaId']}', f['texto'] as String,
              DateTime.parse(f['criadoEm'] as String).toLocal())
      ]);

    _docs
      ..clear()
      ..addAll([
        for (final d in lista('documentos'))
          Documento(
            id: '${d['id']}',
            titulo: d['titulo'] as String,
            categoria: (d['categoria'] ?? 'Geral') as String,
            validade: d['validade'] == null
                ? null
                : somenteData(DateTime.parse(d['validade'] as String)),
            aprovado: (d['aprovado'] ?? false) as bool,
            obs: (d['obs'] ?? '') as String,
            atletaId: '${d['atletaId']}',
          )
      ]);
  }

  Exercicio _exercicioApi(Map<String, dynamic> e) => Exercicio(
        id: '${e['id']}',
        nome: e['nome'] as String,
        grupo: (e['grupo'] ?? 'Geral') as String,
        series: (e['series'] as num?)?.toInt() ?? 3,
        repeticoes: (e['repeticoes'] as num?)?.toInt() ?? 10,
        duracaoSeg: (e['duracaoSeg'] as num?)?.toInt() ?? 0,
        instrucoes: (e['instrucoes'] ?? '') as String,
        video: (e['video'] ?? '') as String,
      );

  /// Biblioteca = exercícios-modelo do app (menos os ocultados) + os do treinador no servidor.
  void _reconstruirExercicios() {
    _exercicios
      ..clear()
      ..addAll(_exerciciosDemo.where((e) => !_exOcultos.contains(e.id)))
      ..addAll(_exerciciosApi);
  }

  Future<void> _baixarAvatar() async {
    // O avatar do usuário vem de /api/mobile/me (campo avatarUrl).
    try {
      final me = await SateApi.me();
      final url = (me['usuario'] as Map?)?['avatarUrl'] as String?;
      if (url == null || url.isEmpty) {
        if (fotoBytes != null && _avatarBaixado != null) {
          fotoBytes = null;
          _avatarBaixado = null;
          notifyListeners();
        }
        return;
      }
      if (url == _avatarBaixado) return;
      if (url.startsWith('data:')) {
        fotoBytes = base64Decode(url.split(',').last);
      } else {
        final r = await http.get(Uri.parse(ApiConfig.urlArquivo(url)));
        if (r.statusCode != 200) return;
        fotoBytes = r.bodyBytes;
      }
      _avatarBaixado = url;
      notifyListeners();
    } catch (_) {}
  }

  /// Foto do usuário atual, se [nome] for o dele.
  Uint8List? fotoParaNome(String nome) =>
      (nomeUsuario.isNotEmpty && nome == nomeUsuario) ? fotoBytes : null;

  /// Envia (ou remove, com null) a foto de perfil para o servidor.
  Future<void> definirFoto(Uint8List? bytes) async {
    try {
      if (bytes != null) {
        await SateApi.atualizarUsuarioComFoto(
            nome: nomeUsuario, email: emailUsuario, bytes: bytes);
        fotoBytes = bytes;
        _avatarBaixado = null;
        _baixarAvatar();
      } else {
        // O servidor ainda não oferece remoção de foto: limpa só neste aparelho.
        fotoBytes = null;
      }
    } catch (e) {
      _erro(e);
    }
    notifyListeners();
  }

  // ── Consultas básicas ──

  List<Atleta> get atletas => List.unmodifiable(_atletas);

  List<Atleta> atletasDaEquipe(String? equipeId) => equipeId == null
      ? atletas
      : _atletas.where((a) => a.equipeId == equipeId).toList();

  Equipe equipe(String id) {
    for (final e in _equipes) {
      if (e.id == id) return e;
    }
    return Equipe.nenhuma;
  }

  Atleta? atletaPorNome(String nome) {
    for (final a in [..._atletas, eu]) {
      if (a.nome.toLowerCase() == nome.trim().toLowerCase()) return a;
    }
    return null;
  }

  Atleta? atletaPorId(String id) {
    for (final a in [..._atletas, eu]) {
      if (a.id == id) return a;
    }
    return null;
  }

  List<Exercicio> get exercicios => List.unmodifiable(_exercicios);

  Exercicio? exercicio(String id) {
    for (final e in _exercicios) {
      if (e.id == id) return e;
    }
    for (final e in _exerciciosDemo) {
      if (e.id == id) return e;
    }
    return null;
  }

  List<Documento> get documentos => List.unmodifiable([..._docs, ..._docsLocais]);

  /// Documentos de um atleta (ou do treinador, quando [atletaId] é null).
  List<Documento> documentosDe(String? atletaId) => atletaId == null
      ? _docsLocais.toList()
      : _docs.where((d) => d.atletaId == atletaId).toList();

  void _lerDocsLocais(String? raw) {
    _docsLocais.clear();
    if (raw != null) {
      try {
        _docsLocais.addAll((jsonDecode(raw) as List)
            .map((e) => Documento.fromJson(e as Map<String, dynamic>))
            .where((d) => d.atletaId == null));
      } catch (_) {}
    }
  }

  // ── Exercícios ──

  Map<String, dynamic> _corpoExercicio(Exercicio e) => {
        'nome': e.nome,
        'grupo': e.grupo,
        'series': e.series,
        'repeticoes': e.repeticoes,
        'duracaoSeg': e.duracaoSeg,
        'instrucoes': e.instrucoes,
        'video': e.video,
      };

  Future<void> salvarExercicio(Exercicio e) async {
    try {
      final existeNoServidor = _exerciciosApi.any((x) => x.id == e.id);
      if (existeNoServidor) {
        await SateApi.atualizarExercicio(e.id, _corpoExercicio(e));
      } else {
        await SateApi.criarExercicio(_corpoExercicio(e));
        // Editar um exercício-modelo cria uma cópia sua e oculta o original.
        if (_exerciciosDemo.any((x) => x.id == e.id)) await _ocultarExercicio(e.id);
      }
      await sincronizar(silencioso: true);
    } catch (err) {
      _erro(err);
    }
  }

  Future<void> removerExercicio(String id) async {
    try {
      if (_exerciciosApi.any((x) => x.id == id)) {
        await SateApi.excluirExercicio(id);
      } else {
        await _ocultarExercicio(id);
      }
      await sincronizar(silencioso: true);
    } catch (err) {
      _erro(err);
    }
  }

  Future<void> _ocultarExercicio(String id) async {
    _exOcultos.add(id);
    final p = await SharedPreferences.getInstance();
    await p.setStringList(_kExOcultos, _exOcultos.toList());
    _reconstruirExercicios();
    notifyListeners();
  }

  // ── Treinos ──

  /// Sessão recorrente gerada a partir do dia/horário da equipe (salvos no servidor).
  Treino _padrao(Equipe e, DateTime d) {
    return Treino(
      id: 'p-${e.id}-${chaveData(d)}',
      titulo: 'Treino da equipe',
      objetivo: '',
      foco: '',
      observacoes: '',
      equipeId: e.id,
      data: d,
      inicioMin: e.inicioMin,
      duracaoMin: e.duracaoMin,
      exercicioIds: const [],
      atletaIds: const [],
      modelo: true,
    );
  }

  List<Treino> treinosNoDia(DateTime dia, {String? equipeId}) {
    final d = somenteData(dia);
    final k = chaveData(d);
    final res = <Treino>[];
    for (final t in _treinos) {
      if (t.chave == k && !t.cancelado) res.add(t);
    }
    for (final e in _equipes) {
      if (!e.dias.contains(d.weekday)) continue;
      final id = 'p-${e.id}-$k';
      // Já existe alteração ou cancelamento desta sessão no servidor.
      if (_treinos.any((t) => t.padrao == id)) continue;
      res.add(_padrao(e, d));
    }
    final filtrados =
        equipeId == null ? res : res.where((t) => t.equipeId == equipeId).toList();
    filtrados.sort((a, b) => a.inicioMin.compareTo(b.inicioMin));
    return filtrados;
  }

  List<Treino> treinosDoAtleta(Atleta a, DateTime dia) {
    if (a.equipeId.isEmpty) return const [];
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
        final fim = DateTime(d.year, d.month, d.day)
            .add(Duration(minutes: t.inicioMin + t.duracaoMin));
        if (fim.isAfter(agora)) res.add(t);
      }
    }
    return res.take(limite).toList();
  }

  Map<String, dynamic> _corpoTreino(Treino t, {bool cancelado = false}) => {
        'equipeId': int.parse(t.equipeId),
        'titulo': t.titulo,
        'objetivo': t.objetivo,
        'foco': t.foco,
        'observacoes': t.observacoes,
        'data': t.chave,
        'inicioMin': t.inicioMin,
        'duracaoMin': t.duracaoMin,
        'exercicioIds': t.exercicioIds,
        'atletaIds': [for (final a in t.atletaIds) int.parse(a)],
        'cancelado': cancelado,
      };

  Future<void> salvarTreino(Treino t) async {
    try {
      if (t.id.startsWith('p-')) {
        await SateApi.criarTreino({..._corpoTreino(t), 'padraoChave': t.id});
      } else if (_treinos.any((x) => x.id == t.id)) {
        await SateApi.atualizarTreino(t.id, _corpoTreino(t));
      } else {
        await SateApi.criarTreino(_corpoTreino(t));
      }
      await sincronizar(silencioso: true);
    } catch (e) {
      _erro(e);
    }
  }

  Future<void> removerTreino(String id) async {
    try {
      if (id.startsWith('p-')) {
        // Sessão recorrente: registra o cancelamento apenas daquele dia.
        final partes = id.split('-'); // p, equipe, yyyy, mm, dd
        final equipeId = int.parse(partes[1]);
        final data = partes.sublist(2).join('-');
        await SateApi.criarTreino({
          'equipeId': equipeId,
          'titulo': 'Treino cancelado',
          'data': data,
          'padraoChave': id,
          'cancelado': true,
        });
      } else {
        final t = _treinos.where((x) => x.id == id).firstOrNull;
        if (t?.padrao != null) {
          await SateApi.atualizarTreino(id, {'cancelado': true});
        } else {
          await SateApi.excluirTreino(id);
        }
      }
      await sincronizar(silencioso: true);
    } catch (e) {
      _erro(e);
    }
  }

  // ── Frequência ──

  StatusPres statusAtleta(Atleta a, DateTime dia) {
    final d = somenteData(dia);
    if (treinosDoAtleta(a, d).isEmpty) return StatusPres.semTreino;
    final o = _pres['${a.id}|${chaveData(d)}'];
    if (o == 'ok') return StatusPres.realizado;
    if (o == 'falta') return StatusPres.naoRealizado;
    // Sem registro do treinador: ainda não conta como presença nem como falta.
    return StatusPres.pendente;
  }

  /// Marca presença (true), falta (false) ou limpa a marcação (null). Salvo no servidor.
  Future<void> marcarPresenca(Atleta a, DateTime dia, bool? presente) async {
    final data = chaveData(somenteData(dia));
    final k = '${a.id}|$data';
    final anterior = _pres[k];
    // Atualiza na hora para a tela responder, e desfaz se o servidor recusar.
    if (presente == null) {
      _pres.remove(k);
    } else {
      _pres[k] = presente ? 'ok' : 'falta';
    }
    notifyListeners();
    try {
      await SateApi.registrarPresenca(a.id, data, presente);
    } catch (e) {
      if (anterior == null) {
        _pres.remove(k);
      } else {
        _pres[k] = anterior;
      }
      notifyListeners();
      _erro(e);
    }
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

  /// Percentual de presença (0..1) ou null se não houve registro no período.
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

  /// Resultados de UM atleta, do mais antigo ao mais novo. Aceita o id do atleta
  /// (preferido, evita misturar homônimos) ou o nome.
  List<ResultadoTeste> resultadosDe(String atleta, {String? teste}) {
    final chave = atleta.trim().toLowerCase();
    final todos = _testes.where((r) =>
        (r.atletaId == atleta || r.atleta.trim().toLowerCase() == chave) &&
        (teste == null || r.teste.toLowerCase() == teste.toLowerCase()));
    final l = todos.toList()..sort((a, b) => a.data.compareTo(b.data));
    return l;
  }

  Future<void> registrarTeste(ResultadoTeste r) async {
    try {
      final alvo = r.atletaId.isNotEmpty ? atletaPorId(r.atletaId) : atletaPorNome(r.atleta);
      await SateApi.registrarTeste({
        // O atleta logado grava sempre para si (o servidor também garante isso).
        if (treinador && alvo != null) 'atletaId': int.parse(alvo.id),
        'teste': r.teste,
        'unidade': r.unidade,
        'valor': r.valor,
        'data': r.data.toUtc().toIso8601String(),
        'obs': r.obs,
      });
      await sincronizar(silencioso: true);
    } catch (e) {
      _erro(e);
    }
  }

  Future<void> removerTeste(ResultadoTeste r) async {
    if (r.id == null) return;
    try {
      await SateApi.excluirTeste(r.id!);
      await sincronizar(silencioso: true);
    } catch (e) {
      _erro(e);
    }
  }

  /// Escores 0..1 por categoria universal usando o último resultado do atleta.
  List<double> escoresPorCategoria(Atleta a) {
    return [
      for (final cat in categoriasUniversais)
        () {
          final t = catalogoTestes.firstWhere((x) => x.categoria == cat);
          final r = resultadosDe(a.id, teste: t.nome);
          return r.isEmpty ? 0.0 : t.escore(r.last.valor);
        }(),
    ];
  }

  // ── Documentos ──

  Future<void> salvarDocumento(Documento d) async {
    try {
      if (d.atletaId == null) {
        // Documento pessoal do treinador: ainda sem tabela no servidor (fica no aparelho).
        final idx = _docsLocais.indexWhere((x) => x.id == d.id);
        if (idx >= 0) {
          _docsLocais[idx] = d;
        } else {
          _docsLocais.add(d);
        }
        await _persistir(_kDocs, _docsLocais.map((e) => e.toJson()).toList());
        notifyListeners();
        return;
      }
      final corpo = {
        'atletaId': int.parse(d.atletaId!),
        'titulo': d.titulo,
        'categoria': d.categoria,
        'validade': d.validade == null ? null : chaveData(d.validade!),
        'obs': d.obs,
        'aprovado': d.aprovado,
      };
      if (_docs.any((x) => x.id == d.id)) {
        await SateApi.atualizarDocumento(d.id, corpo);
      } else {
        await SateApi.criarDocumento(corpo);
      }
      await sincronizar(silencioso: true);
    } catch (e) {
      _erro(e);
    }
  }

  Future<void> removerDocumento(String id) async {
    try {
      if (_docsLocais.any((x) => x.id == id)) {
        _docsLocais.removeWhere((x) => x.id == id);
        await _persistir(_kDocs, _docsLocais.map((e) => e.toJson()).toList());
        notifyListeners();
        return;
      }
      await SateApi.excluirDocumento(id);
      await sincronizar(silencioso: true);
    } catch (e) {
      _erro(e);
    }
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

  // ── Eventos da agenda ──

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
    try {
      if (_eventos.any((x) => x.id == e.id)) {
        await SateApi.atualizarEvento(e.id, e.toApi());
      } else {
        await SateApi.criarEvento(e.toApi());
      }
      await sincronizar(silencioso: true);
    } catch (err) {
      _erro(err);
    }
  }

  Future<void> removerEvento(String id) async {
    try {
      await SateApi.excluirEvento(id);
      await sincronizar(silencioso: true);
    } catch (err) {
      _erro(err);
    }
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

  List<MetaAtleta> metasDe(String atletaId) =>
      _metas.where((m) => m.atletaId == atletaId).toList()
        ..sort((a, b) => a.prazo.compareTo(b.prazo));

  Future<void> salvarMeta(MetaAtleta m) async {
    try {
      final corpo = {
        'atletaId': int.parse(m.atletaId),
        'titulo': m.titulo,
        'descricao': m.descricao,
        'progresso': m.progresso,
        'prazo': chaveData(m.prazo),
      };
      if (_metas.any((x) => x.id == m.id)) {
        await SateApi.atualizarMeta(m.id, corpo);
      } else {
        await SateApi.criarMeta(corpo);
      }
      await sincronizar(silencioso: true);
    } catch (e) {
      _erro(e);
    }
  }

  Future<void> removerMeta(String id) async {
    try {
      await SateApi.excluirMeta(id);
      await sincronizar(silencioso: true);
    } catch (e) {
      _erro(e);
    }
  }

  List<FeedbackAtleta> feedbacksDe(String atletaId) =>
      _feedbacks.where((f) => f.atletaId == atletaId).toList()
        ..sort((a, b) => b.quando.compareTo(a.quando));

  Future<void> salvarFeedback(FeedbackAtleta f) async {
    try {
      await SateApi.criarFeedback({'atletaId': int.parse(f.atletaId), 'texto': f.texto});
      await sincronizar(silencioso: true);
    } catch (e) {
      _erro(e);
    }
  }

  Future<void> removerFeedback(String id) async {
    try {
      await SateApi.excluirFeedback(id);
      await sincronizar(silencioso: true);
    } catch (e) {
      _erro(e);
    }
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
      final r = resultadosDe(a.id, teste: t.nome);
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
    res.sort((x, y) => y.data.compareTo(x.data));
    return res;
  }

  // ───────────────────────── Comunidade (feed) ─────────────────────────
  // ATENÇÃO: o servidor ainda não tem tabelas de publicações. O feed continua
  // guardado só neste aparelho (sem dados de demonstração).

  void _lerPosts(String? raw) {
    _posts.clear();
    if (raw != null) {
      try {
        _posts.addAll((jsonDecode(raw) as List)
            .map((e) => Post.fromJson(e as Map<String, dynamic>))
            .where((p) => p.minha));
      } catch (_) {}
    }
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

  // ───────────────────────── Equipes (vínculo) ─────────────────────────

  /// Atleta entra na equipe pelo código/QR Code. Retorna a mensagem de sucesso.
  Future<String> entrarEquipePorCodigo(String codigo) async {
    final r = await SateApi.entrarEquipe(codigo.trim());
    await sincronizar(silencioso: true);
    return (r['mensagem'] ?? 'Você entrou na equipe.') as String;
  }

  /// Código de convite da equipe (treinador).
  Future<String> codigoDaEquipe(String equipeId, {bool renovar = false}) =>
      SateApi.codigoEquipe(equipeId, renovar: renovar);

  /// Define dias, horário e local dos treinos recorrentes da equipe.
  Future<bool> salvarAgendaEquipe(
    String equipeId, {
    required String local,
    required List<int> dias,
    required int inicioMin,
    required int duracaoMin,
  }) async {
    try {
      await SateApi.agendaEquipe(equipeId, {
        'local': local,
        'diasTreino': dias,
        'inicioMin': inicioMin,
        'duracaoMin': duracaoMin,
      });
      await sincronizar(silencioso: true);
      return true;
    } catch (e) {
      _erro(e);
      return false;
    }
  }

  /// Salva Formação, Registro profissional e Experiência do treinador no servidor.
  Future<bool> salvarPerfilProfissional({
    required String formacao,
    required String registroProfissional,
    required String experiencia,
  }) async {
    try {
      await SateApi.perfilProfissional({
        'formacao': formacao,
        'registroProfissional': registroProfissional,
        'experiencia': experiencia,
      });
      await sincronizar(silencioso: true);
      return true;
    } catch (e) {
      _erro(e);
      return false;
    }
  }

  /// O cadastro de atletas é feito no site (exige e-mail e gera a senha temporária).
  Future<void> adicionarAtleta(String nome, String equipeId, String posicao) async {
    _erro(const ApiException(
        'O cadastro de atletas é feito pelo site do SATE. Depois ele aparece aqui automaticamente.'));
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

  // ── Notificações (servidor) ──

  List<NotificacaoApp> get notificacoes => List.unmodifiable(_notificacoes);

  int get notificacoesNaoLidas => _notificacoes.where((n) => !n.lida).length;

  Future<void> marcarNotifLida(String id) async {
    final i = _notificacoes.indexWhere((n) => n.id == id);
    if (i < 0 || _notificacoes[i].lida) return;
    final n = _notificacoes[i];
    _notificacoes[i] = NotificacaoApp(n.id, n.tipo, n.titulo, n.texto, n.quando, true);
    notifyListeners();
    try {
      await SateApi.marcarNotificacaoLida(id);
    } catch (e) {
      _notificacoes[i] = n;
      notifyListeners();
      _erro(e);
    }
  }

  Future<void> marcarTodasNotifLidas() async {
    final antes = List<NotificacaoApp>.from(_notificacoes);
    for (var i = 0; i < _notificacoes.length; i++) {
      final n = _notificacoes[i];
      _notificacoes[i] = NotificacaoApp(n.id, n.tipo, n.titulo, n.texto, n.quando, true);
    }
    notifyListeners();
    try {
      await SateApi.marcarTodasNotificacoesLidas();
    } catch (e) {
      _notificacoes
        ..clear()
        ..addAll(antes);
      notifyListeners();
      _erro(e);
    }
  }

  // ── Pendências do treinador (calculadas com os dados reais) ──

  /// Pendências que exigem atenção do treinador.
  List<({String id, String titulo, String sub, String destino})> pendenciasTreinador() {
    final h = hoje;
    final res = <({String id, String titulo, String sub, String destino})>[];
    final docs = documentos.where((d) {
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
    final agoraMin = DateTime.now().hour * 60 + DateTime.now().minute;
    final hojeSemChamada = treinosNoDia(h).where((t) {
      if (t.inicioMin > agoraMin) return false;
      final doEquipe = atletasDaEquipe(t.equipeId);
      return doEquipe.any((a) => statusAtleta(a, h) == StatusPres.pendente);
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

  // ── Persistência local (somente itens que não existem no servidor) ──

  Future<void> _persistir(String chave, Object dados) async {
    final p = await SharedPreferences.getInstance();
    await p.setString(chave, jsonEncode(dados));
  }

  String novoId() => DateTime.now().microsecondsSinceEpoch.toString();
}
