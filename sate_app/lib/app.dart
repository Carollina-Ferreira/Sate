import 'package:flutter/material.dart';
import 'pages/inicial_page.dart';

class SateApp extends StatelessWidget {
  const SateApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'SATE',

      theme: ThemeData(
        useMaterial3: true,
        fontFamily: 'Arial',
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF00845F),
          primary: const Color(0xFF00845F),
        ),
      ),

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