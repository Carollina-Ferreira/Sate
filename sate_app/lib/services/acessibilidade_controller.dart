import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Preferências de acessibilidade (salvas no aparelho): tamanho do texto,
/// texto em negrito e redução de animações.
class AcessibilidadeController {
  static const _kEscala = 'sate_acess_escala';
  static const _kNegrito = 'sate_acess_negrito';
  static const _kReduzir = 'sate_acess_reduzir';

  static final ValueNotifier<double> escalaTexto = ValueNotifier(1.0);
  static final ValueNotifier<bool> negrito = ValueNotifier(false);
  static final ValueNotifier<bool> reduzirAnimacoes = ValueNotifier(false);

  static Listenable get todos =>
      Listenable.merge([escalaTexto, negrito, reduzirAnimacoes]);

  static Future<void> carregar() async {
    final p = await SharedPreferences.getInstance();
    final i = p.getInt(_kEscala);
    escalaTexto.value = switch (i) {
      0 => 0.9,
      2 => 1.15,
      3 => 1.3,
      _ => 1.0,
    };
    negrito.value = p.getBool(_kNegrito) ?? false;
    reduzirAnimacoes.value = p.getBool(_kReduzir) ?? false;
  }

  static Future<void> definirEscala(int indice) async {
    escalaTexto.value = switch (indice) {
      0 => 0.9,
      2 => 1.15,
      3 => 1.3,
      _ => 1.0,
    };
    final p = await SharedPreferences.getInstance();
    await p.setInt(_kEscala, indice);
  }

  static int get indiceEscala => switch (escalaTexto.value) {
        0.9 => 0,
        1.15 => 2,
        1.3 => 3,
        _ => 1,
      };

  static Future<void> definirNegrito(bool v) async {
    negrito.value = v;
    final p = await SharedPreferences.getInstance();
    await p.setBool(_kNegrito, v);
  }

  static Future<void> definirReduzir(bool v) async {
    reduzirAnimacoes.value = v;
    final p = await SharedPreferences.getInstance();
    await p.setBool(_kReduzir, v);
  }
}
