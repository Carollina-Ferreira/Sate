import 'dart:async';
import 'package:flutter/material.dart';
import './login_page.dart';

class InicialPage extends StatefulWidget {
  const InicialPage({super.key});

  @override
  State<InicialPage> createState() => _InicialPageState();
}

class _InicialPageState extends State<InicialPage> {

  @override
  void initState() {
    super.initState();

    Timer(const Duration(seconds: 3), () {
      if (!mounted) return;

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => const LoginPage(),
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF006B4E),
      body: Stack(
        fit: StackFit.expand,
        children: [
          // PLANO DE FUNDO
          Image.asset(
            'assets/images/inicial_img.png',
            fit: BoxFit.cover,
          ),

          // CONTEÚDO
          SafeArea(
            child: Column(
              children: [
                const SizedBox(height: 45),

                // LOGO
                Image.asset(
                  'assets/images/logo_img.png',
                  width: 125,
                ),

                const SizedBox(height: 35),

                // FRASE
                const Text(
                  'Evolua.\n'
                  'Acompanhe.\n'
                  'Supere.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 21,
                    height: 1.05,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 22),

                // DESCRIÇÃO
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 45),
                  child: Text(
                    'Sua plataforma completa\n'
                    'para acompanhar treinos,\n'
                    'desempenho e evolução.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 11,
                      height: 1.3,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}