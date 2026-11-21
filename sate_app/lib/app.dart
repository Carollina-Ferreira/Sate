import 'package:flutter/material.dart';
import 'pages/inicial_page.dart';
import 'pages/sessao_gate.dart';
import 'sate/data/sate_store.dart';
import 'services/navegacao.dart';
import 'services/sessao.dart';
import 'services/acessibilidade_controller.dart';
import 'services/tema_controller.dart';
import 'services/toque_seguro.dart';
import 'theme/sate_tema_escuro.dart';
import 'theme/sate_theme.dart';

class SateApp extends StatelessWidget {
  const SateApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Token recusado pelo servidor (expirado): limpa tudo e volta ao início.
    Sessao.aoExpirar = () {
      SateStore.i.encerrar();
      sateNavigatorKey.currentState?.pushAndRemoveUntil(
        MaterialPageRoute(builder: (_) => const InicialPage()),
        (_) => false,
      );
      sateMessengerKey.currentState?.showSnackBar(const SnackBar(
        content: Text('Sua sessão expirou. Entre novamente.'),
        behavior: SnackBarBehavior.floating,
      ));
    };

    return ValueListenableBuilder<ThemeMode>(
      valueListenable: TemaController.modo,
      builder: (context, modo, _) {
        return MaterialApp(
          debugShowCheckedModeBanner: false,
          title: 'SATE',
          navigatorKey: sateNavigatorKey,
          scaffoldMessengerKey: sateMessengerKey,

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
                // Ignora toques repetidos em sequência (evita abrir tela 2x / envio duplicado).
                child: ToqueSeguro(child: child!),
              ),
            );
          },

          // Com sessão salva, valida no servidor e abre direto o app.
          home: Sessao.logado ? const SessaoGate() : const InicialPage(),
        );
      },
    );
  }
}
