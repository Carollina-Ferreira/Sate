import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Tema do app (claro, escuro ou do sistema). A escolha fica salva no aparelho.
class TemaController {
  static const _chave = 'sate_tema';
  static final ValueNotifier<ThemeMode> modo = ValueNotifier(ThemeMode.system);

  static Future<void> carregar() async {
    final p = await SharedPreferences.getInstance();
    modo.value = switch (p.getString(_chave)) {
      'claro' => ThemeMode.light,
      'escuro' => ThemeMode.dark,
      _ => ThemeMode.system,
    };
  }

  static Future<void> definir(ThemeMode m) async {
    modo.value = m;
    final p = await SharedPreferences.getInstance();
    await p.setString(
      _chave,
      switch (m) {
        ThemeMode.light => 'claro',
        ThemeMode.dark => 'escuro',
        _ => 'sistema',
      },
    );
  }
}
