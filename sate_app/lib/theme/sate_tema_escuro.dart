import 'package:flutter/material.dart';

/// Modo escuro do SATE: identidade em tons de verde.
class SateCoresEscuro {
  static const Color fundo = Color(0xFF003D31);
  static const Color superficie = Color(0xFF00493A);
  static const Color superficieAlta = Color(0xFF005942);
  static const Color destaque = Color(0xFF16A875);
  static const Color texto = Color(0xFFFFFFFF);
  static const Color textoSecundario = Color(0xFFB8CEC4);
  static const Color borda = Color(0xFF0B6A55);
}

class SateTemaEscuro {
  static ThemeData get escuro {
    final borda = OutlineInputBorder(
      borderRadius: BorderRadius.circular(14),
      borderSide: const BorderSide(color: SateCoresEscuro.borda),
    );

    final base = ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      fontFamily: 'Poppins',
      scaffoldBackgroundColor: SateCoresEscuro.fundo,
      cardColor: SateCoresEscuro.superficie,
      dividerColor: SateCoresEscuro.borda,
      colorScheme: const ColorScheme.dark(
        primary: SateCoresEscuro.destaque,
        onPrimary: SateCoresEscuro.fundo,
        secondary: Color(0xFFFF6B8B),
        surface: SateCoresEscuro.superficie,
        onSurface: SateCoresEscuro.texto,
        onSurfaceVariant: SateCoresEscuro.textoSecundario,
        outline: SateCoresEscuro.borda,
        error: Color(0xFFFF6B8B),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: SateCoresEscuro.fundo,
        foregroundColor: SateCoresEscuro.texto,
        elevation: 0,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: SateCoresEscuro.superficie,
        border: borda,
        enabledBorder: borda,
        focusedBorder: borda.copyWith(
          borderSide: const BorderSide(color: SateCoresEscuro.destaque, width: 1.6),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: SateCoresEscuro.destaque,
          foregroundColor: SateCoresEscuro.fundo,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        ),
      ),
    );

    // Reforços de contraste: garante texto claro sobre fundos verdes em todos os componentes.
    const texto = SateCoresEscuro.texto;
    const sec = SateCoresEscuro.textoSecundario;
    return base.copyWith(
      textTheme: base.textTheme.apply(
        bodyColor: texto,
        displayColor: texto,
        fontFamily: 'Poppins',
      ),
      primaryTextTheme: base.primaryTextTheme.apply(
        bodyColor: texto,
        displayColor: texto,
        fontFamily: 'Poppins',
      ),
      iconTheme: const IconThemeData(color: texto),
      primaryIconTheme: const IconThemeData(color: texto),
      inputDecorationTheme: base.inputDecorationTheme.copyWith(
        hintStyle: const TextStyle(color: sec),
        labelStyle: const TextStyle(color: sec),
        floatingLabelStyle: const TextStyle(color: SateCoresEscuro.destaque),
        prefixIconColor: sec,
        suffixIconColor: sec,
      ),
      textSelectionTheme: TextSelectionThemeData(
        cursorColor: SateCoresEscuro.destaque,
        selectionColor: SateCoresEscuro.destaque.withValues(alpha: 0.35),
        selectionHandleColor: SateCoresEscuro.destaque,
      ),
      dialogTheme: const DialogThemeData(
        backgroundColor: SateCoresEscuro.superficieAlta,
        titleTextStyle: TextStyle(
          fontFamily: 'Poppins',
          fontSize: 18,
          fontWeight: FontWeight.w700,
          color: texto,
        ),
        contentTextStyle: TextStyle(
          fontFamily: 'Poppins',
          fontSize: 14,
          color: texto,
        ),
      ),
      popupMenuTheme: const PopupMenuThemeData(
        color: SateCoresEscuro.superficieAlta,
        textStyle: TextStyle(fontFamily: 'Poppins', fontSize: 14, color: texto),
      ),
      snackBarTheme: const SnackBarThemeData(
        backgroundColor: SateCoresEscuro.superficieAlta,
        contentTextStyle: TextStyle(fontFamily: 'Poppins', color: texto),
        behavior: SnackBarBehavior.floating,
      ),
      listTileTheme: const ListTileThemeData(
        textColor: texto,
        iconColor: sec,
        subtitleTextStyle: TextStyle(fontFamily: 'Poppins', fontSize: 12, color: sec),
      ),
      expansionTileTheme: const ExpansionTileThemeData(
        textColor: texto,
        collapsedTextColor: texto,
        iconColor: SateCoresEscuro.destaque,
        collapsedIconColor: sec,
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(foregroundColor: SateCoresEscuro.destaque),
      ),
      dividerTheme: const DividerThemeData(color: SateCoresEscuro.borda),
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: SateCoresEscuro.fundo,
        surfaceTintColor: Colors.transparent,
      ),
      datePickerTheme: const DatePickerThemeData(
        backgroundColor: SateCoresEscuro.superficieAlta,
        surfaceTintColor: Colors.transparent,
      ),
      timePickerTheme: const TimePickerThemeData(
        backgroundColor: SateCoresEscuro.superficieAlta,
      ),
    );
  }
}
