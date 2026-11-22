import 'package:flutter/material.dart';

import '../data/sate_store.dart';
import '../ui/cores.dart';
import '../ui/tela.dart';
import '../ui/widgets.dart';

/// Folha para o treinador preencher Formação, Registro profissional e Experiência.
/// Os dados são salvos no servidor (mesmo banco do site).
Future<void> editarPerfilProfissional(BuildContext context) {
  return abrirFolha(context, (ctx) => const _EditorProfissional());
}

class _EditorProfissional extends StatefulWidget {
  const _EditorProfissional();

  @override
  State<_EditorProfissional> createState() => _EditorProfissionalState();
}

class _EditorProfissionalState extends State<_EditorProfissional> {
  final _s = SateStore.i;
  late final TextEditingController _formacao = TextEditingController(text: _s.formacao);
  late final TextEditingController _registro = TextEditingController(text: _s.registroProfissional);
  late final TextEditingController _experiencia = TextEditingController(text: _s.experiencia);
  bool _salvando = false;

  @override
  void dispose() {
    _formacao.dispose();
    _registro.dispose();
    _experiencia.dispose();
    super.dispose();
  }

  Future<void> _salvar() async {
    setState(() => _salvando = true);
    final ok = await _s.salvarPerfilProfissional(
      formacao: _formacao.text.trim(),
      registroProfissional: _registro.text.trim(),
      experiencia: _experiencia.text.trim(),
    );
    if (!mounted) return;
    setState(() => _salvando = false);
    if (ok) {
      Navigator.of(context).pop();
      aviso(context, 'Informações profissionais salvas.');
    }
  }

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return SingleChildScrollView(
      // Sobe junto com o teclado para não cobrir os campos.
      padding: EdgeInsets.fromLTRB(22, 4, 22, 24 + MediaQuery.of(context).viewInsets.bottom),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Informações profissionais',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700)),
          const SizedBox(height: 6),
          Text('Opcional. Aparece no seu perfil.',
              style: TextStyle(color: c.texto2, fontSize: 13)),
          const SizedBox(height: 18),
          TextField(
            controller: _formacao,
            maxLength: 191,
            textCapitalization: TextCapitalization.sentences,
            style: TextStyle(color: c.texto),
            decoration: const InputDecoration(
                labelText: 'Formação', hintText: 'Ex.: Educação Física', counterText: ''),
          ),
          const SizedBox(height: 14),
          TextField(
            controller: _registro,
            maxLength: 191,
            style: TextStyle(color: c.texto),
            decoration: const InputDecoration(
                labelText: 'Registro profissional',
                hintText: 'Ex.: CREF 123456-G/SP',
                counterText: ''),
          ),
          const SizedBox(height: 14),
          TextField(
            controller: _experiencia,
            maxLength: 191,
            textCapitalization: TextCapitalization.sentences,
            style: TextStyle(color: c.texto),
            decoration: const InputDecoration(
                labelText: 'Experiência', hintText: 'Ex.: 8 anos', counterText: ''),
          ),
          const SizedBox(height: 22),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: _salvando ? null : _salvar,
              child: Text(_salvando ? 'Salvando…' : 'Salvar'),
            ),
          ),
        ],
      ),
    );
  }
}
