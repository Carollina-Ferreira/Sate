import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter/material.dart';

import '../../services/api_config.dart';

// Fotos já decodificadas (evita decodificar a mesma imagem grande a cada rebuild).
final Map<String, Uint8List> _cacheFotos = {};

Uint8List? _decodificar(String src) {
  try {
    final cache = _cacheFotos[src];
    if (cache != null) return cache;
    // O site envia "data:image/jpeg;base64,AAAA..." — pega só a parte depois da vírgula.
    final i = src.indexOf(',');
    final bytes = base64Decode((i >= 0 ? src.substring(i + 1) : src).replaceAll(RegExp(r'\s'), ''));
    if (_cacheFotos.length > 12) _cacheFotos.clear();
    _cacheFotos[src] = bytes;
    return bytes;
  } catch (_) {
    return null;
  }
}

/// Foto da equipe (a mesma escolhida no site). Sem foto — ou se ela não puder ser
/// lida — mostra o [fallback], que é o ícone padrão que o app já usava.
class FotoEquipe extends StatelessWidget {
  final String? imagem;
  final double largura;
  final double altura;
  final double raio;
  final Widget fallback;

  const FotoEquipe({
    super.key,
    required this.imagem,
    required this.largura,
    double? altura,
    required this.raio,
    required this.fallback,
  }) : altura = altura ?? largura;

  @override
  Widget build(BuildContext context) {
    final src = imagem;
    if (src == null || src.isEmpty) return fallback;

    Widget foto;
    if (src.startsWith('http') || src.startsWith('/')) {
      // Caso o servidor passe a guardar um endereço de arquivo em vez da imagem em si.
      foto = Image.network(
        ApiConfig.urlArquivo(src),
        width: largura,
        height: altura,
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => fallback,
      );
    } else {
      final bytes = _decodificar(src);
      if (bytes == null) return fallback;
      foto = Image.memory(
        bytes,
        width: largura,
        height: altura,
        fit: BoxFit.cover,
        gaplessPlayback: true,
        errorBuilder: (_, __, ___) => fallback,
      );
    }
    return ClipRRect(
      borderRadius: BorderRadius.circular(raio),
      child: SizedBox(width: largura, height: altura, child: foto),
    );
  }
}
