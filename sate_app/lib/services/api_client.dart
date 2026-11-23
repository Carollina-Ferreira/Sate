import 'dart:async';
import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart' show MediaType;

import 'api_config.dart';
import 'sessao.dart';

/// Erro retornado pela API ou falha de conexão, com mensagem pronta para o usuário.
class ApiException implements Exception {
  final int? status;
  final String mensagem;
  final bool semConexao;
  const ApiException(this.mensagem, {this.status, this.semConexao = false});

  @override
  String toString() => mensagem;
}

/// Cliente HTTP único do app: envia o token automaticamente, converte JSON,
/// trata erros e derruba a sessão quando o token expira (401).
class ApiClient {
  ApiClient._();

  static Uri _uri(String caminho, [Map<String, String>? query]) {
    final u = Uri.parse('${ApiConfig.baseUrl}$caminho');
    return query == null || query.isEmpty ? u : u.replace(queryParameters: query);
  }

  static Map<String, String> _cabecalhos({bool json = true, bool autenticado = true}) {
    return {
      'Accept': 'application/json',
      if (json) 'Content-Type': 'application/json',
      if (autenticado && Sessao.token != null) 'Authorization': 'Bearer ${Sessao.token}',
      if (ApiConfig.chaveApp.isNotEmpty) 'X-SATE-App-Key': ApiConfig.chaveApp,
    };
  }

  static Future<dynamic> get(String caminho, {Map<String, String>? query}) =>
      _enviar(() => http.get(_uri(caminho, query), headers: _cabecalhos()));

  // Escritas idênticas feitas ao mesmo tempo (ex.: duplo clique) viram UMA só requisição.
  static final Map<String, Future<dynamic>> _emAndamento = {};

  static Future<dynamic> _unica(String chave, Future<dynamic> Function() envio) {
    final existente = _emAndamento[chave];
    if (existente != null) return existente;
    final f = envio();
    _emAndamento[chave] = f;
    f.whenComplete(() => _emAndamento.remove(chave)).ignore();
    return f;
  }

  static Future<dynamic> post(String caminho,
      {Object? corpo, bool autenticado = true}) {
    final json = jsonEncode(corpo ?? {});
    return _unica(
        'POST $caminho $json',
        () => _enviar(
            () => http.post(_uri(caminho),
                headers: _cabecalhos(autenticado: autenticado), body: json),
            autenticado: autenticado));
  }

  static Future<dynamic> put(String caminho, {Object? corpo}) {
    final json = jsonEncode(corpo ?? {});
    return _unica(
        'PUT $caminho $json',
        () => _enviar(
            () => http.put(_uri(caminho), headers: _cabecalhos(), body: json)));
  }

  static Future<dynamic> patch(String caminho, {Object? corpo}) {
    final json = jsonEncode(corpo ?? {});
    return _unica(
        'PATCH $caminho $json',
        () => _enviar(
            () => http.patch(_uri(caminho), headers: _cabecalhos(), body: json)));
  }

  static Future<dynamic> delete(String caminho) => _unica('DELETE $caminho',
      () => _enviar(() => http.delete(_uri(caminho), headers: _cabecalhos())));

  /// Envio de arquivo (ex.: foto de perfil) por multipart.
  static Future<dynamic> multipartPut(
    String caminho, {
    required Map<String, String> campos,
    required String campoArquivo,
    required List<int> bytes,
    required String nomeArquivo,
    required String tipoMime,
  }) {
    return _enviar(() async {
      final req = http.MultipartRequest('PUT', _uri(caminho))
        ..headers.addAll(_cabecalhos(json: false))
        ..fields.addAll(campos)
        ..files.add(http.MultipartFile.fromBytes(
          campoArquivo,
          bytes,
          filename: nomeArquivo,
          contentType: _mediaType(tipoMime),
        ));
      final stream = await req.send();
      return http.Response.fromStream(stream);
    });
  }

  static MediaType _mediaType(String mime) {
    final partes = mime.split('/');
    return MediaType(partes.first, partes.length > 1 ? partes[1] : 'octet-stream');
  }

  static Future<dynamic> _enviar(Future<http.Response> Function() chamada,
      {bool autenticado = true}) async {
    http.Response r;
    try {
      r = await chamada().timeout(ApiConfig.timeout);
    } on TimeoutException {
      throw const ApiException(
          'O servidor demorou para responder. Verifique sua conexão e tente novamente.',
          semConexao: true);
    } on http.ClientException {
      throw ApiException(
          'Não foi possível conectar ao servidor (${ApiConfig.baseUrl}). '
          'Verifique a internet e o endereço da API.',
          semConexao: true);
    } catch (_) {
      throw const ApiException('Falha de comunicação com o servidor.', semConexao: true);
    }

    dynamic corpo;
    if (r.body.isNotEmpty) {
      try {
        corpo = jsonDecode(utf8.decode(r.bodyBytes));
      } catch (_) {
        corpo = null;
      }
    }

    if (r.statusCode >= 200 && r.statusCode < 300) return corpo;

    final msg = corpo is Map && corpo['mensagem'] != null
        ? corpo['mensagem'].toString()
        : 'Erro ${r.statusCode} ao falar com o servidor.';

    // Token vencido/inválido: encerra a sessão e volta ao login.
    if (r.statusCode == 401 && autenticado && Sessao.token != null) {
      await Sessao.limpar();
      Sessao.aoExpirar?.call();
      throw ApiException('Sua sessão expirou. Entre novamente.', status: 401);
    }
    throw ApiException(msg, status: r.statusCode);
  }
}
