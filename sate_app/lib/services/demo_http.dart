import 'dart:convert';

import 'package:http/http.dart' as http;

/// Modo demonstração: o app funciona SEM servidor (login, cadastro e recuperação de senha
/// retornam respostas simuladas). Para usar a API real: flutter run --dart-define=DEMO=false
const bool modoDemo = bool.fromEnvironment('DEMO', defaultValue: true);

Future<http.Response> demoPost(
  Uri url, {
  Map<String, String>? headers,
  Object? body,
  Encoding? encoding,
}) async {
  if (!modoDemo) {
    return http.post(url, headers: headers, body: body, encoding: encoding);
  }

  await Future.delayed(const Duration(milliseconds: 500));

  final dados = body is String ? jsonDecode(body) as Map<String, dynamic> : <String, dynamic>{};
  var status = 200;
  Map<String, dynamic> corpo;

  if (url.path.endsWith('/auth/login')) {
    final email = '${dados['email'] ?? ''}';
    final base = email.split('@').first.replaceAll(RegExp(r'[^A-Za-zÀ-ÿ]'), ' ').trim();
    final nome = base.isEmpty ? 'Usuário' : base[0].toUpperCase() + base.substring(1);
    corpo = {
      'mensagem': 'Login em modo demonstração.',
      'usuario': {'id': 1, 'nome': nome, 'email': email, 'tipo': dados['tipo']},
    };
  } else if (url.path.endsWith('/auth/cadastro')) {
    status = 201;
    corpo = {'mensagem': 'Conta criada em modo demonstração.'};
  } else {
    corpo = {'mensagem': 'Link enviado em modo demonstração.'};
  }

  return http.Response(
    jsonEncode(corpo),
    status,
    headers: {'content-type': 'application/json; charset=utf-8'},
  );
}
