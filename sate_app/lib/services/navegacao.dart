import 'package:flutter/material.dart';

/// Navegador global do app: permite trocar de tela sem depender do `context` de um
/// widget (usado ao sair da conta e quando a sessão expira).
final GlobalKey<NavigatorState> sateNavigatorKey = GlobalKey<NavigatorState>();
