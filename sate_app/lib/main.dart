import 'package:flutter/material.dart';
import 'app.dart';
import 'services/acessibilidade_controller.dart';
import 'services/tema_controller.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await TemaController.carregar();
  await AcessibilidadeController.carregar();
  runApp(const SateApp());
}
