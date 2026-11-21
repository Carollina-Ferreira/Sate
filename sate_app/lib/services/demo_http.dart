import 'package:http/http.dart' as http;

import 'api_config.dart';

/// Envio de POST (sem sessão) usado por login, cadastro e recuperação de senha.
/// O MODO DEMONSTRAÇÃO foi removido: o app sempre fala com a API real
/// (endereço definido em [ApiConfig]).
Future<http.Response> apiPost(
  Uri url, {
  Map<String, String>? headers,
  Object? body,
}) {
  return http.post(
    url,
    headers: {
      ...?headers,
      if (ApiConfig.chaveApp.isNotEmpty) 'X-SATE-App-Key': ApiConfig.chaveApp,
    },
    body: body,
  );
}
