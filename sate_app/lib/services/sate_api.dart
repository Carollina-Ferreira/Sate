import 'api_client.dart';

/// Chamadas à API do SATE agrupadas por funcionalidade.
/// Todas usam o backend existente (Node/Express/Prisma/MySQL), o mesmo do site.
class SateApi {
  SateApi._();

  // ── Autenticação ──
  static Future<Map<String, dynamic>> login(String email, String senha, String tipo) async {
    final r = await ApiClient.post('/api/auth/login',
        corpo: {'email': email, 'senha': senha, 'tipo': tipo}, autenticado: false);
    return Map<String, dynamic>.from(r as Map);
  }

  static Future<Map<String, dynamic>> cadastro(String nome, String email, String senha) async {
    final r = await ApiClient.post('/api/auth/cadastro',
        corpo: {'nome': nome, 'email': email, 'senha': senha}, autenticado: false);
    return Map<String, dynamic>.from((r ?? {}) as Map);
  }

  static Future<void> esqueciSenha(String email) async {
    await ApiClient.post('/api/password/esqueci-senha',
        corpo: {'email': email}, autenticado: false);
  }

  static Future<Map<String, dynamic>> me() async =>
      Map<String, dynamic>.from(await ApiClient.get('/api/mobile/me') as Map);

  // ── Dados gerais (uma chamada traz tudo que o usuário pode ver) ──
  static Future<Map<String, dynamic>> snapshot() async =>
      Map<String, dynamic>.from(await ApiClient.get('/api/mobile/snapshot') as Map);

  // ── Perfil ──
  static Future<void> atualizarUsuario({required String nome, required String email}) =>
      ApiClient.put('/api/usuarios/perfil', corpo: {'nome': nome, 'email': email});

  static Future<void> atualizarUsuarioComFoto({
    required String nome,
    required String email,
    required List<int> bytes,
  }) =>
      ApiClient.multipartPut('/api/usuarios/perfil',
          campos: {'nome': nome, 'email': email},
          campoArquivo: 'avatar',
          bytes: bytes,
          nomeArquivo: 'avatar.jpg',
          tipoMime: 'image/jpeg');

  /// Formação, registro profissional e experiência do treinador.
  static Future<void> perfilProfissional(Map<String, dynamic> dados) =>
      ApiClient.put('/api/mobile/perfil-profissional', corpo: dados);

  static Future<void> alterarSenha(String atual, String nova) =>
      ApiClient.put('/api/usuarios/senha', corpo: {'senhaAtual': atual, 'novaSenha': nova});

  static Future<void> atualizarMeuPerfilAtleta(Map<String, dynamic> dados) =>
      ApiClient.put('/api/atletas/me', corpo: dados);

  // ── Equipes ──
  static Future<List<dynamic>> equipesDoTreinador() async =>
      (await ApiClient.get('/api/equipes')) as List<dynamic>;

  static Future<String> codigoEquipe(String equipeId, {bool renovar = false}) async {
    final r = renovar
        ? await ApiClient.post('/api/equipes/$equipeId/codigo')
        : await ApiClient.get('/api/equipes/$equipeId/codigo');
    return (r as Map)['codigo'] as String;
  }

  static Future<Map<String, dynamic>> entrarEquipe(String codigo) async =>
      Map<String, dynamic>.from(
          await ApiClient.post('/api/equipes/entrar', corpo: {'codigo': codigo}) as Map);

  static Future<void> agendaEquipe(String equipeId, Map<String, dynamic> dados) =>
      ApiClient.put('/api/equipes/$equipeId/agenda', corpo: dados);

  // ── Exercícios e treinos ──
  static Future<dynamic> criarExercicio(Map<String, dynamic> d) =>
      ApiClient.post('/api/exercicios', corpo: d);
  static Future<dynamic> atualizarExercicio(String id, Map<String, dynamic> d) =>
      ApiClient.put('/api/exercicios/$id', corpo: d);
  static Future<dynamic> excluirExercicio(String id) =>
      ApiClient.delete('/api/exercicios/$id');

  static Future<dynamic> criarTreino(Map<String, dynamic> d) =>
      ApiClient.post('/api/treinos', corpo: d);
  static Future<dynamic> atualizarTreino(String id, Map<String, dynamic> d) =>
      ApiClient.put('/api/treinos/$id', corpo: d);
  static Future<dynamic> excluirTreino(String id) => ApiClient.delete('/api/treinos/$id');

  // ── Agenda e frequência ──
  static Future<dynamic> criarEvento(Map<String, dynamic> d) =>
      ApiClient.post('/api/eventos', corpo: d);
  static Future<dynamic> atualizarEvento(String id, Map<String, dynamic> d) =>
      ApiClient.put('/api/eventos/$id', corpo: d);
  static Future<dynamic> excluirEvento(String id) => ApiClient.delete('/api/eventos/$id');

  static Future<dynamic> registrarPresenca(
          String atletaId, String data, bool? presente) =>
      ApiClient.put('/api/presencas',
          corpo: {'atletaId': int.parse(atletaId), 'data': data, 'presente': presente});

  // ── Testes físicos, metas, feedbacks, documentos ──
  static Future<dynamic> registrarTeste(Map<String, dynamic> d) =>
      ApiClient.post('/api/testes', corpo: d);
  static Future<dynamic> excluirTeste(int id) => ApiClient.delete('/api/testes/$id');

  static Future<dynamic> criarMeta(Map<String, dynamic> d) =>
      ApiClient.post('/api/metas', corpo: d);
  static Future<dynamic> atualizarMeta(String id, Map<String, dynamic> d) =>
      ApiClient.put('/api/metas/$id', corpo: d);
  static Future<dynamic> excluirMeta(String id) => ApiClient.delete('/api/metas/$id');

  static Future<dynamic> criarFeedback(Map<String, dynamic> d) =>
      ApiClient.post('/api/feedbacks', corpo: d);
  static Future<dynamic> excluirFeedback(String id) =>
      ApiClient.delete('/api/feedbacks/$id');

  static Future<dynamic> criarDocumento(Map<String, dynamic> d) =>
      ApiClient.post('/api/documentos', corpo: d);
  static Future<dynamic> atualizarDocumento(String id, Map<String, dynamic> d) =>
      ApiClient.put('/api/documentos/$id', corpo: d);
  static Future<dynamic> excluirDocumento(String id) =>
      ApiClient.delete('/api/documentos/$id');

  // ── Notificações (mesmas URLs para atleta e treinador) ──
  static Future<Map<String, dynamic>> notificacoes() async =>
      Map<String, dynamic>.from(await ApiClient.get('/api/notificacoes') as Map);
  static Future<void> marcarNotificacaoLida(String id) =>
      ApiClient.patch('/api/notificacoes/$id/lida');
  static Future<void> marcarTodasNotificacoesLidas() =>
      ApiClient.patch('/api/notificacoes/lidas');
}
