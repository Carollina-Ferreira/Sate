import 'package:flutter/material.dart';

import '../services/api_client.dart';
import '../services/sate_api.dart';
import '../services/sessao.dart';
import '../sate/data/sate_store.dart';
import 'Atleta/atleta_navigation.dart';
import 'Atleta/atleta_vinculo_page.dart';
import 'Treinador/treinador_equipes_page.dart';
import 'Treinador/treinador_navigation.dart';
import 'inicial_page.dart';

/// Decide para onde ir depois do login (ou ao reabrir o app com sessão salva):
///  - Atleta COM equipe  -> telas do atleta;  SEM equipe -> tela de código/QR Code.
///  - Treinador          -> suas equipes (login) ou direto ao app (sessão retomada).
Future<Widget> destinoPosLogin(UsuarioSessao u, {bool retomar = false}) async {
  // Validar o JWT ao retomar também para treinadores.
  final me = await SateApi.me();
  if (u.ehTreinador) {
    return retomar
        ? TreinadorNavigation(nomeUsuario: u.nome, emailUsuario: u.email)
        : TreinadorEquipesPage(nomeUsuario: u.nome, emailUsuario: u.email);
  }
  final atleta = me['atleta'] as Map?;
  final temEquipe = atleta != null && atleta['equipeId'] != null;
  return temEquipe
      ? AtletaNavigation(nomeUsuario: u.nome, emailUsuario: u.email)
      : AtletaVinculoPage(nomeUsuario: u.nome, emailUsuario: u.email);
}

/// Tela de entrada: se existe sessão salva, valida no servidor e abre o app.
class SessaoGate extends StatefulWidget {
  const SessaoGate({super.key});

  @override
  State<SessaoGate> createState() => _SessaoGateState();
}

class _SessaoGateState extends State<SessaoGate> {
  String? _erro;

  @override
  void initState() {
    super.initState();
    _abrir();
  }

  Future<void> _abrir() async {
    final u = Sessao.usuario;
    if (!Sessao.logado || u == null) {
      _irPara(const InicialPage());
      return;
    }
    setState(() => _erro = null);
    try {
      final destino = await destinoPosLogin(u, retomar: true);
      if (!mounted) return;
      _irPara(destino);
    } on ApiException catch (e) {
      if (!mounted) return;
      if (e.status == 401) {
        _irPara(const InicialPage());
      } else {
        setState(() => _erro = e.mensagem);
      }
    }
  }

  void _irPara(Widget destino) {
    Navigator.of(context)
        .pushReplacement(MaterialPageRoute(builder: (_) => destino));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: _erro == null
            ? const CircularProgressIndicator()
            : Padding(
                padding: const EdgeInsets.all(28),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.cloud_off_rounded, size: 46),
                    const SizedBox(height: 14),
                    Text(_erro!, textAlign: TextAlign.center),
                    const SizedBox(height: 18),
                    FilledButton(onPressed: _abrir, child: const Text('Tentar novamente')),
                    TextButton(
                      onPressed: () async {
                        await Sessao.limpar();
                        await SateStore.i.encerrar();
                        if (mounted) _irPara(const InicialPage());
                      },
                      child: const Text('Sair'),
                    ),
                  ],
                ),
              ),
      ),
    );
  }
}
