import 'package:flutter/material.dart';
import 'pages/inicial_page.dart';
import 'services/acessibilidade_controller.dart';
import 'services/tema_controller.dart';
import 'theme/sate_tema_escuro.dart';
import 'theme/sate_theme.dart';

class SateApp extends StatelessWidget {
  const SateApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<ThemeMode>(
      valueListenable: TemaController.modo,
      builder: (context, modo, _) {
        return MaterialApp(
          debugShowCheckedModeBanner: false,
          title: 'SATE',

          theme: SateTema.claro,
          darkTheme: SateTemaEscuro.escuro,
          themeMode: modo,

          // Força formato 24h em qualquer TimePicker do app
          builder: (context, child) {
            return AnimatedBuilder(
              animation: AcessibilidadeController.todos,
              builder: (context, _) => MediaQuery(
                data: MediaQuery.of(context).copyWith(
                  alwaysUse24HourFormat: true,
                  textScaler: TextScaler.linear(
                      AcessibilidadeController.escalaTexto.value),
                  boldText: AcessibilidadeController.negrito.value,
                  disableAnimations:
                      AcessibilidadeController.reduzirAnimacoes.value,
                ),
                child: child!,
              ),
            );
          },

          home: const InicialPage(),
        );
      },
    );
  }
}
