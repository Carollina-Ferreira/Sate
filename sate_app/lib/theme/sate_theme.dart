import 'package:flutter/material.dart';

/// Paleta oficial do SATE (verde + rosa + creme).
class SateCores {
  static const Color verde = Color(0xFF005942);
  static const Color verdeProfundo = Color(0xFF003D31);
  static const Color rosa = Color(0xFFEF476F);
  static const Color rosaEscuro = Color(0xFFC9305A);
  static const Color rosaSuave = Color(0xFFFDE6EC);
  static const Color creme = Color(0xFFFAF5EE);
  static const Color menta = Color(0xFFDFF7EE);
  static const Color texto = Color(0xFF10251F);
  static const Color textoSecundario = Color(0xFF68736F);
  static const Color borda = Color(0xFFE8DFD3);
}

/// Estilos de apoio. [destaque] é a palavra em itálico rosa dos títulos.
class SateEstilo {
  static const TextStyle destaque = TextStyle(
    fontFamily: 'DMSerifDisplay',
    fontStyle: FontStyle.italic,
    fontWeight: FontWeight.w400,
    color: SateCores.rosa,
    letterSpacing: -0.2,
  );
}

/// Tema global (somente aparência).
class SateTema {
  static ThemeData get claro {
    final esquema = ColorScheme.fromSeed(
      seedColor: SateCores.verde,
      primary: SateCores.verde,
    ).copyWith(
      onPrimary: Colors.white,
      primaryContainer: SateCores.menta,
      onPrimaryContainer: SateCores.verdeProfundo,
      secondary: SateCores.rosa,
      onSecondary: Colors.white,
      secondaryContainer: SateCores.rosaSuave,
      onSecondaryContainer: SateCores.rosaEscuro,
      surface: Colors.white,
      onSurface: SateCores.texto,
      onSurfaceVariant: SateCores.textoSecundario,
      outline: SateCores.borda,
      outlineVariant: SateCores.borda,
      surfaceTint: Colors.transparent,
      error: SateCores.rosaEscuro,
    );

    final borda = OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: const BorderSide(color: SateCores.borda),
    );

    return ThemeData(
      useMaterial3: true,
      fontFamily: 'Poppins',
      colorScheme: esquema,
      scaffoldBackgroundColor: SateCores.creme,
      canvasColor: SateCores.creme,
      dividerColor: SateCores.borda,
      dividerTheme: const DividerThemeData(color: SateCores.borda, thickness: 1),
      appBarTheme: const AppBarTheme(
        backgroundColor: SateCores.creme,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        foregroundColor: SateCores.texto,
        iconTheme: IconThemeData(color: SateCores.texto),
        titleTextStyle: TextStyle(
          fontFamily: 'Poppins',
          fontSize: 20,
          fontWeight: FontWeight.w700,
          color: SateCores.texto,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: SateCores.verde,
          foregroundColor: Colors.white,
          disabledBackgroundColor: SateCores.borda,
          disabledForegroundColor: SateCores.textoSecundario,
          elevation: 0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          textStyle: const TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.w600),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: SateCores.verde,
          foregroundColor: Colors.white,
          disabledBackgroundColor: SateCores.borda,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          textStyle: const TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.w600),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: SateCores.verde,
          side: const BorderSide(color: SateCores.borda, width: 1.5),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          textStyle: const TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.w600),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: SateCores.rosaEscuro,
          textStyle: const TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.w600),
        ),
      ),
      floatingActionButtonTheme: FloatingActionButtonThemeData(
        backgroundColor: SateCores.rosa,
        foregroundColor: Colors.white,
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        hintStyle: const TextStyle(color: Color(0xFF9AA5A0)),
        border: borda,
        enabledBorder: borda,
        disabledBorder: borda,
        focusedBorder: borda.copyWith(
          borderSide: const BorderSide(color: SateCores.verde, width: 1.5),
        ),
        errorBorder: borda.copyWith(
          borderSide: const BorderSide(color: SateCores.rosaEscuro),
        ),
        focusedErrorBorder: borda.copyWith(
          borderSide: const BorderSide(color: SateCores.rosaEscuro, width: 1.5),
        ),
      ),
      textSelectionTheme: const TextSelectionThemeData(
        cursorColor: SateCores.verde,
        selectionHandleColor: SateCores.rosa,
      ),
      progressIndicatorTheme: const ProgressIndicatorThemeData(color: SateCores.verde),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: SateCores.verdeProfundo,
        contentTextStyle: const TextStyle(fontFamily: 'Poppins', color: Colors.white),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: SateCores.creme,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
      ),
      cardTheme: CardThemeData(
        color: Colors.white,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: SateCores.borda),
        ),
      ),
    );
  }
}
