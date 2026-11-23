import 'package:flutter/material.dart';

import '../../services/api_client.dart';
import '../../services/sate_api.dart';
import '../../services/sessao.dart';
import '../ui/cores.dart';
import '../ui/tela.dart';
import '../ui/widgets.dart';

/// "Falar com o suporte": envia a mensagem para o e-mail do suporte (SMTP do backend).
/// A resposta chega no e-mail da conta do usuário.
class SuportePage extends StatefulWidget {
  const SuportePage({super.key});

  @override
  State<SuportePage> createState() => _SuportePageState();
}

class _SuportePageState extends State<SuportePage> {
  final _assunto = TextEditingController();
  final _mensagem = TextEditingController();
  String? _erroAssunto, _erroMensagem;
  bool _enviando = false;

  @override
  void dispose() {
    _assunto.dispose();
    _mensagem.dispose();
    super.dispose();
  }

  Future<void> _enviar() async {
    if (_enviando) return;
    final assunto = _assunto.text.trim();
    final mensagem = _mensagem.text.trim();
    setState(() {
      _erroAssunto = assunto.length < 3 ? 'Informe o assunto.' : null;
      _erroMensagem = mensagem.length < 10 ? 'Descreva melhor (mínimo 10 caracteres).' : null;
    });
    if (_erroAssunto != null || _erroMensagem != null) return;

    setState(() => _enviando = true);
    try {
      await SateApi.enviarSuporte(assunto, mensagem);
      if (!mounted) return;
      Navigator.of(context).pop();
      aviso(context, 'Mensagem enviada! Responderemos no seu e-mail.');
    } on ApiException catch (e) {
      if (!mounted) return;
      setState(() => _enviando = false);
      aviso(context, e.mensagem);
    } catch (_) {
      if (!mounted) return;
      setState(() => _enviando = false);
      aviso(context, 'Não foi possível enviar agora. Tente novamente.');
    }
  }

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final email = Sessao.usuario?.email ?? '';
    return Tela(
      titulo: 'Falar com o',
      destaque: 'suporte',
      children: [
        Text(
          email.isEmpty
              ? 'Conte o que aconteceu. Responderemos por e-mail.'
              : 'Conte o que aconteceu. Responderemos em $email.',
          style: TextStyle(fontSize: 14, color: c.texto2, height: 1.4),
        ),
        const SizedBox(height: 16),
        TextField(
          controller: _assunto,
          maxLength: 120,
          textCapitalization: TextCapitalization.sentences,
          onChanged: (_) => setState(() => _erroAssunto = null),
          style: TextStyle(color: c.texto),
          decoration: decoracaoCampo(context, 'Assunto').copyWith(
            errorText: _erroAssunto,
            counterText: '',
          ),
        ),
        const SizedBox(height: 14),
        TextField(
          controller: _mensagem,
          minLines: 5,
          maxLines: 10,
          maxLength: 3000,
          textCapitalization: TextCapitalization.sentences,
          onChanged: (_) => setState(() => _erroMensagem = null),
          style: TextStyle(color: c.texto),
          decoration: decoracaoCampo(context, 'Mensagem').copyWith(
            errorText: _erroMensagem,
            alignLabelWithHint: true,
          ),
        ),
        const SizedBox(height: 20),
        FilledButton(
          style: estiloBotao(context),
          onPressed: _enviando ? null : _enviar,
          child: Text(_enviando ? 'Enviando…' : 'Enviar mensagem'),
        ),
      ],
    );
  }
}
