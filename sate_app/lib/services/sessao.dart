import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Dados do usuário autenticado (retornados por /api/auth/login).
class UsuarioSessao {
  final int id;
  final String nome, email, tipo; // tipo: 'ATLETA' ou 'TREINADOR'
  const UsuarioSessao({
    required this.id,
    required this.nome,
    required this.email,
    required this.tipo,
  });

  bool get ehTreinador => tipo == 'TREINADOR';

  Map<String, dynamic> toJson() =>
      {'id': id, 'nome': nome, 'email': email, 'tipo': tipo};

  factory UsuarioSessao.fromJson(Map<String, dynamic> j) => UsuarioSessao(
        id: (j['id'] as num).toInt(),
        nome: (j['nome'] ?? '') as String,
        email: (j['email'] ?? '') as String,
        tipo: (j['tipo'] ?? '') as String,
      );
}

/// Sessão do aplicativo: token JWT (armazenamento seguro do sistema:
/// Keychain no iOS e Keystore no Android) + dados básicos do usuário.
class Sessao {
  Sessao._();

  static const _kToken = 'sate_jwt';
  static const _kUsuario = 'sate_usuario';
  static const _seguro = FlutterSecureStorage();

  static String? _token;
  static UsuarioSessao? _usuario;
  static int revisao = 0;

  /// Chamado quando o servidor recusa o token (sessão expirada).
  /// O app define esta função para voltar à tela de login.
  static void Function()? aoExpirar;

  static String? get token => _token;
  static UsuarioSessao? get usuario => _usuario;
  static bool get logado => _token != null && _usuario != null;

  static Future<void> carregar() async {
    revisao++;
    try {
      _token = await _seguro.read(key: _kToken);
    } catch (_) {
      // Alguns aparelhos/emuladores falham no armazenamento seguro:
      // usa o armazenamento comum como alternativa.
      final p = await SharedPreferences.getInstance();
      _token = p.getString(_kToken);
    }
    final p = await SharedPreferences.getInstance();
    final raw = p.getString(_kUsuario);
    if (raw != null) {
      try {
        _usuario = UsuarioSessao.fromJson(jsonDecode(raw) as Map<String, dynamic>);
      } catch (_) {
        _usuario = null;
      }
    }
    if (_token == null || _usuario == null) {
      _token = null;
      _usuario = null;
    }
  }

  static Future<void> salvar(String token, UsuarioSessao usuario) async {
    revisao++;
    _token = token;
    _usuario = usuario;
    final p = await SharedPreferences.getInstance();
    await p.setString(_kUsuario, jsonEncode(usuario.toJson()));
    try {
      await _seguro.write(key: _kToken, value: token);
    } catch (_) {
      await p.setString(_kToken, token);
    }
  }

  static Future<void> atualizarUsuario(UsuarioSessao usuario) async {
    _usuario = usuario;
    final p = await SharedPreferences.getInstance();
    await p.setString(_kUsuario, jsonEncode(usuario.toJson()));
  }

  /// Sai da conta (apaga token e dados da sessão deste aparelho).
  static Future<void> limpar() async {
    revisao++;
    _token = null;
    _usuario = null;
    final p = await SharedPreferences.getInstance();
    await p.remove(_kUsuario);
    await p.remove(_kToken);
    try {
      await _seguro.delete(key: _kToken);
    } catch (_) {}
  }
}
