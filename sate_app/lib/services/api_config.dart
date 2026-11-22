import 'package:flutter/foundation.dart';

/// Configuração CENTRAL da API do SATE.
///
/// A URL NÃO é fixa no código. Defina na hora de rodar/compilar:
///
///   flutter run --dart-define=API_URL=http://192.168.0.10:3000
///
/// Sem o parâmetro, é usado um padrão de DESENVOLVIMENTO:
///   - Emulador Android  -> http://10.0.2.2:3000  (10.0.2.2 = o computador que roda o emulador)
///   - iOS Simulator / Windows / Web / Desktop -> http://localhost:3000
///   - Celular físico    -> informe o IP do computador via --dart-define=API_URL=...
///
/// Em produção use SEMPRE https e a URL pública do servidor.
class ApiConfig {
  ApiConfig._();

  static const String _urlDefinida = String.fromEnvironment('API_URL');

  /// Chave que identifica o app perante o backend para pular o captcha do site
  /// (precisa ser igual a MOBILE_APP_KEY do .env do backend). Opcional.
  static const String chaveApp = String.fromEnvironment('MOBILE_APP_KEY');

  static String get baseUrl {
    if (_urlDefinida.isNotEmpty) {
      return _urlDefinida.endsWith('/')
          ? _urlDefinida.substring(0, _urlDefinida.length - 1)
          : _urlDefinida;
    }
    if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:3000';
    }
    return 'http://localhost:3000';
  }

  /// Tempo máximo de espera de cada requisição.
  static const Duration timeout = Duration(seconds: 20);

  /// Transforma caminhos como "/uploads/perfil/x.jpg" em URL completa.
  static String urlArquivo(String caminho) {
    if (caminho.startsWith('http')) return caminho;
    return '$baseUrl${caminho.startsWith('/') ? '' : '/'}$caminho';
  }
}
