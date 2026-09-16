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
      ),

      home: const InicialPage(),
    );
  }
}