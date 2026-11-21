import 'package:flutter/material.dart';
import 'app.dart';
import 'services/acessibilidade_controller.dart';
import 'services/sessao.dart';
import 'services/tema_controller.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await TemaController.carregar();
  await AcessibilidadeController.carregar();
  // Recupera o token salvo (se o usuário já tinha entrado antes).
  await Sessao.carregar();
  runApp(const SateApp());
}
