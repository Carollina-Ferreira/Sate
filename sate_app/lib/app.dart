import 'package:flutter/material.dart';
import 'pages/inicial_page.dart';
import 'theme/sate_theme.dart';

class SateApp extends StatelessWidget {
  const SateApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'SATE',

      theme: SateTema.claro,

      // Força formato 24h em qualquer TimePicker do app
      builder: (context, child) {
        return MediaQuery(
          data: MediaQuery.of(context).copyWith(
            alwaysUse24HourFormat: true,
          ),
          child: child!,
        );
      },

      home: const InicialPage(),
    );
  }
}