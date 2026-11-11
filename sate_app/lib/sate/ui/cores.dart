import 'package:flutter/material.dart';

/// Paleta adaptativa do SATE.
/// Claro: creme + rosa + detalhes em verde. Escuro: tons de verde.
class SC {
  final bool escuro;
  const SC._(this.escuro);

  static SC of(BuildContext context) =>
      SC._(Theme.of(context).brightness == Brightness.dark);

  Color get fundo => escuro ? const Color(0xFF04271F) : const Color(0xFFFAF5EE);
  Color get superficie =>
      escuro ? const Color(0xFF0A382D) : const Color(0xFFF2EBDF);
  Color get superficieAlta =>
      escuro ? const Color(0xFF0F4838) : const Color(0xFFEAE0D0);
  Color get linha => escuro ? const Color(0xFF165546) : const Color(0xFFE4DACB);

  Color get texto => escuro ? const Color(0xFFF2FAF6) : const Color(0xFF10251F);
  Color get texto2 =>
      escuro ? const Color(0xFFA6C4B7) : const Color(0xFF68736F);

  /// Cor de destaque principal (verde profundo no claro, verde luminoso no escuro).
  Color get primaria =>
      escuro ? const Color(0xFF4CC38F) : const Color(0xFF005942);
  Color get sobrePrimaria =>
      escuro ? const Color(0xFF04271F) : const Color(0xFFFFFFFF);
  Color get primariaSuave =>
      escuro ? const Color(0xFF0F4535) : const Color(0xFFDDF0E6);

  /// Cor sólida dos cartões de destaque (sem degradê).
  Color get heroSolido =>
      escuro ? const Color(0xFF0F4B3B) : const Color(0xFF005942);

  Color get rosa => escuro ? const Color(0xFFF28BA2) : const Color(0xFFEF476F);

  // Estados do calendário e documentos.
  Color get ok => escuro ? const Color(0xFF4CC38F) : const Color(0xFF1F9D6B);
  Color get falta => rosa;
  Color get pendente =>
      escuro ? const Color(0xFFFFD166) : const Color(0xFFE5A100);
  Color get vazio => escuro ? const Color(0xFF5C8173) : const Color(0xFFBDB5A8);
  Color get vermelho =>
      escuro ? const Color(0xFFFF6B6B) : const Color(0xFFD93A4A);

  /// Fundo translúcido para chips e ícones a partir de uma cor.
  Color suave(Color c) => c.withValues(alpha: escuro ? 0.20 : 0.13);

  /// Série de cores harmoniosas para gráficos comparativos.
  List<Color> get serie => escuro
      ? const [
          Color(0xFF4CC38F),
          Color(0xFFF28BA2),
          Color(0xFFA8E6CF),
          Color(0xFFB8CEC4),
        ]
      : const [
          Color(0xFF005942),
          Color(0xFFEF476F),
          Color(0xFF6BBF9F),
          Color(0xFF9A8F82),
        ];
}

extension SateContexto on BuildContext {
  SC get sc => SC.of(this);
}
