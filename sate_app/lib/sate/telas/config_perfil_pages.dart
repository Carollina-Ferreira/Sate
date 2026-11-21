import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import '../../services/perfil_service.dart';
import '../data/sate_store.dart';
import '../ui/cores.dart';
import '../ui/tela.dart';
import '../ui/widgets.dart';

/// Aviso claro quando o servidor ainda não oferece a operação (nada é "salvo de mentira").
Future<void> _avisarIndisponivel(BuildContext context, String oQue) {
  return showDialog<void>(
    context: context,
    builder: (ctx) => AlertDialog(
      title: const Text('Não foi possível salvar'),
      content: Text(
        'A alteração de $oQue ainda não está disponível: o servidor do SATE ainda não oferece essa operação. '
        'Nada foi alterado na sua conta.',
      ),
      actions: [
        TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Entendi')),
      ],
    ),
  );
}

bool _emailValido(String v) => RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$').hasMatch(v.trim());

// ───────────────────────── Menu de configurações do perfil ─────────────────────────

class ConfigPerfilPage extends StatelessWidget {
  final bool treinador;
  const ConfigPerfilPage({super.key, required this.treinador});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final s = SateStore.i;

    Widget item(IconData i, String t, String sub, VoidCallback f) => InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: f,
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
            child: Row(children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: c.suave(c.primaria),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(i, size: 21, color: c.primaria),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(t,
                      style: TextStyle(
                          fontSize: 14.5, fontWeight: FontWeight.w600, color: c.texto)),
                  const SizedBox(height: 2),
                  Text(sub, style: TextStyle(fontSize: 12, color: c.texto2)),
                ]),
              ),
              Icon(Icons.chevron_right_rounded, color: c.texto2),
            ]),
          ),
        );

    Widget grupo(String titulo, List<Widget> itens) => Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.only(left: 4, bottom: 8),
              child: Text(titulo,
                  style: TextStyle(
                      fontSize: 12, fontWeight: FontWeight.w700, color: c.texto2)),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              decoration: BoxDecoration(
                color: c.superficie,
                borderRadius: BorderRadius.circular(22),
              ),
              child: Column(children: [
                for (var i = 0; i < itens.length; i++) ...[
                  if (i > 0) Divider(height: 1, color: c.linha),
                  itens[i],
                ],
              ]),
            ),
          ],
        );

    return AnimatedBuilder(
      animation: s,
      builder: (context, _) => Tela(
        titulo: 'Configurações do',
        destaque: 'perfil',
        children: [
          Row(children: [
            AvatarIni(s.nomeUsuario.isEmpty ? (treinador ? 'Treinador' : 'Atleta') : s.nomeUsuario,
                tamanho: 54),
            const SizedBox(width: 14),
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(s.nomeUsuario.isEmpty ? (treinador ? 'Treinador' : 'Atleta') : s.nomeUsuario,
                    style: TextStyle(
                        fontSize: 17, fontWeight: FontWeight.w700, color: c.texto)),
                Text(s.emailUsuario, style: TextStyle(fontSize: 12.5, color: c.texto2)),
              ]),
            ),
          ]),
          const SizedBox(height: 26),
          grupo('Conta', [
            item(Icons.person_outline_rounded, 'Informações pessoais', 'Nome e e-mail',
                () => abrir(context, EditarInformacoesPage(treinador: treinador))),
            item(Icons.photo_camera_outlined, 'Foto de perfil', 'Escolher, alterar ou remover',
                () => abrir(context, const FotoPerfilPage())),
          ]),
          const SizedBox(height: 22),
          grupo('Segurança', [
            item(Icons.lock_outline_rounded, 'Alterar senha', 'Senha atual, nova e confirmação',
                () => abrir(context, const AlterarSenhaPage())),
          ]),
        ],
      ),
    );
  }
}

// ───────────────────────── Informações pessoais ─────────────────────────

class EditarInformacoesPage extends StatefulWidget {
  final bool treinador;
  const EditarInformacoesPage({super.key, required this.treinador});

  @override
  State<EditarInformacoesPage> createState() => _EditarInformacoesPageState();
}

class _EditarInformacoesPageState extends State<EditarInformacoesPage> {
  late final TextEditingController _nome;
  late final TextEditingController _email;
  late final TextEditingController _altura;
  late final TextEditingController _peso;
  String? _erroNome, _erroEmail, _erroAltura, _erroPeso;
  bool _salvando = false;

  @override
  void initState() {
    super.initState();
    final eu = SateStore.i.eu;
    _nome = TextEditingController(text: SateStore.i.nomeUsuario);
    _email = TextEditingController(text: SateStore.i.emailUsuario);
    _altura = TextEditingController(text: eu.alturaCm > 0 ? '${eu.alturaCm}' : '');
    _peso = TextEditingController(
        text: eu.pesoKg > 0 ? eu.pesoKg.toStringAsFixed(eu.pesoKg % 1 == 0 ? 0 : 1) : '');
  }

  @override
  void dispose() {
    _nome.dispose();
    _email.dispose();
    _altura.dispose();
    _peso.dispose();
    super.dispose();
  }

  /// Altura em cm. Aceita "175" ou "1,75" (metros). Retorna null se vazio/inválido.
  int? _lerAltura() {
    final t = _altura.text.trim().replaceAll(',', '.');
    final v = double.tryParse(t);
    if (v == null) return null;
    final cm = v < 3 ? (v * 100).round() : v.round();
    return (cm >= 50 && cm <= 260) ? cm : null;
  }

  double? _lerPeso() {
    final v = double.tryParse(_peso.text.trim().replaceAll(',', '.'));
    return (v != null && v >= 10 && v <= 400) ? v : null;
  }

  /// IMC calculado na hora, com o que está digitado.
  ({double valor, String classe})? _imcAoVivo() {
    final h = _lerAltura(), p = _lerPeso();
    if (h == null || p == null) return null;
    final v = p / ((h / 100) * (h / 100));
    final classe = v < 18.5
        ? 'Abaixo do peso'
        : (v < 25 ? 'Peso normal' : (v < 30 ? 'Sobrepeso' : 'Obesidade'));
    return (valor: v, classe: classe);
  }

  Future<void> _salvar() async {
    final s = SateStore.i;
    final nome = _nome.text.trim();
    final email = _email.text.trim();
    setState(() {
      _erroNome = nome.isEmpty ? 'Informe seu nome.' : null;
      _erroEmail = _emailValido(email) ? null : 'Informe um e-mail válido.';
    });
    // Medidas do atleta (opcionais, mas se preenchidas precisam ser válidas).
    int? altura;
    double? peso;
    if (!widget.treinador) {
      final tA = _altura.text.trim(), tP = _peso.text.trim();
      altura = _lerAltura();
      peso = _lerPeso();
      setState(() {
        _erroAltura = (tA.isNotEmpty && altura == null) ? 'Altura inválida (ex.: 175 ou 1,75).' : null;
        _erroPeso = (tP.isNotEmpty && peso == null) ? 'Peso inválido (ex.: 68,5).' : null;
      });
      if (_erroAltura != null || _erroPeso != null) return;
    }
    if (_erroNome != null || _erroEmail != null) return;
    final mudouMedidas = !widget.treinador &&
        ((altura != null && altura != s.eu.alturaCm) ||
            (peso != null && (peso - s.eu.pesoKg).abs() > 0.001));
    final mudouConta = nome != s.nomeUsuario || email != s.emailUsuario;
    if (!mudouConta && !mudouMedidas) {
      aviso(context, 'Nenhuma alteração para salvar.');
      return;
    }
    setState(() => _salvando = true);
    var r = ResultadoPerfil.sucesso;
    if (mudouConta) {
      r = await PerfilService.atualizarDados(nome: nome, email: email);
    }
    if (r == ResultadoPerfil.sucesso && mudouMedidas) {
      r = await PerfilService.atualizarMedidas(alturaCm: altura, pesoKg: peso);
    }
    if (!mounted) return;
    setState(() => _salvando = false);
    switch (r) {
      case ResultadoPerfil.sucesso:
        aviso(context, 'Informações atualizadas.');
        Navigator.of(context).pop();
      case ResultadoPerfil.indisponivel:
        await _avisarIndisponivel(context, 'nome e e-mail');
      case ResultadoPerfil.falha:
        aviso(context, PerfilService.ultimaMensagem ?? 'Não foi possível salvar. Tente novamente.');
    }
  }

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return Tela(
      titulo: 'Informações',
      destaque: 'pessoais',
      children: [
        TextField(
          controller: _nome,
          textCapitalization: TextCapitalization.words,
          style: TextStyle(color: c.texto),
          decoration: decoracaoCampo(context, 'Nome').copyWith(
            errorText: _erroNome,
            prefixIcon: Icon(Icons.person_outline_rounded, color: c.texto2),
          ),
        ),
        const SizedBox(height: 14),
        TextField(
          controller: _email,
          keyboardType: TextInputType.emailAddress,
          style: TextStyle(color: c.texto),
          decoration: decoracaoCampo(context, 'E-mail').copyWith(
            errorText: _erroEmail,
            prefixIcon: Icon(Icons.mail_outline_rounded, color: c.texto2),
          ),
        ),
        if (!widget.treinador) ...[
          const SizedBox(height: 14),
          Row(children: [
            Expanded(
              child: TextField(
                controller: _altura,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                onChanged: (_) => setState(() => _erroAltura = null),
                style: TextStyle(color: c.texto),
                decoration: decoracaoCampo(context, 'Altura (cm)').copyWith(
                  errorText: _erroAltura,
                  prefixIcon: Icon(Icons.height_rounded, color: c.texto2),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: TextField(
                controller: _peso,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                onChanged: (_) => setState(() => _erroPeso = null),
                style: TextStyle(color: c.texto),
                decoration: decoracaoCampo(context, 'Peso (kg)').copyWith(
                  errorText: _erroPeso,
                  prefixIcon: Icon(Icons.monitor_weight_outlined, color: c.texto2),
                ),
              ),
            ),
          ]),
          const SizedBox(height: 10),
          Builder(builder: (_) {
            final imc = _imcAoVivo();
            return Text(
              imc == null
                  ? 'Informe altura e peso para ver seu IMC.'
                  : 'IMC ${imc.valor.toStringAsFixed(1)} · ${imc.classe}',
              style: TextStyle(
                fontSize: 13,
                fontWeight: imc == null ? FontWeight.w400 : FontWeight.w700,
                color: imc == null ? c.texto2 : c.primaria,
              ),
            );
          }),
        ],
        const SizedBox(height: 14),
        TextField(
          readOnly: true,
          controller: TextEditingController(
              text: widget.treinador ? 'Treinador' : 'Atleta'),
          style: TextStyle(color: c.texto2),
          decoration: decoracaoCampo(context, 'Tipo de conta').copyWith(
            prefixIcon: Icon(Icons.badge_outlined, color: c.texto2),
            suffixIcon: Icon(Icons.lock_outline_rounded, size: 18, color: c.texto2),
          ),
        ),
        const SizedBox(height: 8),
        Text('O tipo de conta não pode ser alterado.',
            style: TextStyle(fontSize: 12, color: c.texto2)),
        const SizedBox(height: 26),
        FilledButton(
          style: estiloBotao(context),
          onPressed: _salvando ? null : _salvar,
          child: _salvando
              ? SizedBox(
                  width: 22,
                  height: 22,
                  child: CircularProgressIndicator(strokeWidth: 2.5, color: c.sobrePrimaria),
                )
              : const Text('Salvar alterações'),
        ),
      ],
    );
  }
}

// ───────────────────────── Alterar senha ─────────────────────────

class AlterarSenhaPage extends StatefulWidget {
  const AlterarSenhaPage({super.key});

  @override
  State<AlterarSenhaPage> createState() => _AlterarSenhaPageState();
}

class _AlterarSenhaPageState extends State<AlterarSenhaPage> {
  final _atual = TextEditingController();
  final _nova = TextEditingController();
  final _confirma = TextEditingController();
  bool _vAtual = false, _vNova = false, _vConfirma = false;
  String? _eAtual, _eNova, _eConfirma;
  bool _salvando = false;

  @override
  void dispose() {
    _atual.dispose();
    _nova.dispose();
    _confirma.dispose();
    super.dispose();
  }

  Future<void> _salvar() async {
    setState(() {
      _eAtual = _atual.text.isEmpty ? 'Informe a senha atual.' : null;
      _eNova = _nova.text.length < 8
          ? 'A senha deve ter pelo menos 8 caracteres.'
          : (_nova.text == _atual.text ? 'A nova senha deve ser diferente da atual.' : null);
      _eConfirma = _confirma.text != _nova.text ? 'As senhas não coincidem.' : null;
    });
    if (_eAtual != null || _eNova != null || _eConfirma != null) return;
    setState(() => _salvando = true);
    final r = await PerfilService.alterarSenha(
        senhaAtual: _atual.text, novaSenha: _nova.text);
    if (!mounted) return;
    setState(() => _salvando = false);
    switch (r) {
      case ResultadoPerfil.sucesso:
        aviso(context, 'Senha alterada com sucesso.');
        Navigator.of(context).pop();
      case ResultadoPerfil.indisponivel:
        await _avisarIndisponivel(context, 'senha');
      case ResultadoPerfil.falha:
        aviso(context, PerfilService.ultimaMensagem ?? 'Não foi possível alterar a senha. Verifique a senha atual.');
    }
  }

  Widget _campo(String rotulo, TextEditingController ctrl, bool visivel, String? erro,
      VoidCallback alternar) {
    final c = context.sc;
    return TextField(
      controller: ctrl,
      obscureText: !visivel,
      enableSuggestions: false,
      autocorrect: false,
      style: TextStyle(color: c.texto),
      decoration: decoracaoCampo(context, rotulo).copyWith(
        errorText: erro,
        prefixIcon: Icon(Icons.lock_outline_rounded, color: c.texto2),
        suffixIcon: IconButton(
          tooltip: visivel ? 'Ocultar' : 'Mostrar',
          icon: Icon(
              visivel ? Icons.visibility_off_outlined : Icons.visibility_outlined,
              color: c.texto2),
          onPressed: alternar,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    return Tela(
      titulo: 'Alterar',
      destaque: 'senha',
      children: [
        _campo('Senha atual', _atual, _vAtual, _eAtual, () => setState(() => _vAtual = !_vAtual)),
        const SizedBox(height: 14),
        _campo('Nova senha', _nova, _vNova, _eNova, () => setState(() => _vNova = !_vNova)),
        const SizedBox(height: 14),
        _campo('Confirmar nova senha', _confirma, _vConfirma, _eConfirma,
            () => setState(() => _vConfirma = !_vConfirma)),
        const SizedBox(height: 10),
        Text('Use pelo menos 6 caracteres.',
            style: TextStyle(fontSize: 12, color: c.texto2)),
        const SizedBox(height: 26),
        FilledButton(
          style: estiloBotao(context),
          onPressed: _salvando ? null : _salvar,
          child: _salvando
              ? SizedBox(
                  width: 22,
                  height: 22,
                  child: CircularProgressIndicator(strokeWidth: 2.5, color: c.sobrePrimaria),
                )
              : const Text('Alterar senha'),
        ),
      ],
    );
  }
}

// ───────────────────────── Foto de perfil ─────────────────────────

class FotoPerfilPage extends StatefulWidget {
  const FotoPerfilPage({super.key});

  @override
  State<FotoPerfilPage> createState() => _FotoPerfilPageState();
}

class _FotoPerfilPageState extends State<FotoPerfilPage> {
  Uint8List? _novo; // escolhida agora, ainda não salva
  bool _removida = false; // remoção pedida, ainda não salva
  bool _salvando = false;

  bool get _mudou => _novo != null || _removida;

  Future<void> _escolher() async {
    try {
      final x = await ImagePicker().pickImage(
        source: ImageSource.gallery,
        maxWidth: 600,
        maxHeight: 600,
        imageQuality: 85,
      );
      if (x == null) return;
      final bytes = await x.readAsBytes();
      if (!mounted) return;
      setState(() {
        _novo = bytes;
        _removida = false;
      });
    } catch (_) {
      if (mounted) aviso(context, 'Não foi possível acessar a galeria.');
    }
  }

  Future<void> _salvar() async {
    setState(() => _salvando = true);
    await SateStore.i.definirFoto(_removida ? null : _novo);
    if (!mounted) return;
    setState(() => _salvando = false);
    aviso(context, _removida ? 'Foto removida.' : 'Foto de perfil salva neste aparelho.');
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final s = SateStore.i;
    final nome = s.nomeUsuario.isEmpty ? 'Usuário' : s.nomeUsuario;
    final atual = _removida ? null : (_novo ?? s.fotoBytes);

    return Tela(
      titulo: 'Foto de',
      destaque: 'perfil',
      children: [
        Center(
          child: Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: _novo != null ? c.rosa : c.linha, width: 2),
            ),
            child: atual != null
                ? ClipOval(
                    child: Image.memory(atual, width: 168, height: 168, fit: BoxFit.cover))
                : _IniciaisGrandes(nome: nome, tamanho: 168),
          ),
        ),
        const SizedBox(height: 14),
        Center(
          child: Text(
            _novo != null
                ? 'Prévia da nova foto'
                : (atual != null ? 'Foto atual' : 'Você ainda não tem foto'),
            style: TextStyle(fontSize: 13, color: c.texto2),
          ),
        ),
        const SizedBox(height: 28),
        FilledButton.icon(
          style: estiloBotao(context),
          onPressed: _escolher,
          icon: const Icon(Icons.photo_library_outlined, size: 20),
          label: Text(atual == null ? 'Escolher da galeria' : 'Alterar foto'),
        ),
        const SizedBox(height: 10),
        OutlinedButton.icon(
          style: OutlinedButton.styleFrom(
            minimumSize: const Size.fromHeight(50),
            foregroundColor: c.texto,
            side: BorderSide(color: c.linha),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          ),
          onPressed: (s.fotoBytes != null || _novo != null) && !_removida
              ? () => setState(() {
                    _novo = null;
                    _removida = s.fotoBytes != null;
                  })
              : null,
          icon: const Icon(Icons.delete_outline_rounded, size: 20),
          label: const Text('Remover foto'),
        ),
        const SizedBox(height: 22),
        FilledButton(
          style: estiloBotao(context, rosa: true),
          onPressed: _mudou && !_salvando ? _salvar : null,
          child: _salvando
              ? const SizedBox(
                  width: 22,
                  height: 22,
                  child: CircularProgressIndicator(strokeWidth: 2.5, color: Colors.white),
                )
              : const Text('Salvar'),
        ),
        const SizedBox(height: 14),
        Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Icon(Icons.info_outline_rounded, size: 16, color: c.texto2),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              'A foto fica guardada neste aparelho. O envio para o servidor ainda não está disponível.',
              style: TextStyle(fontSize: 12, height: 1.4, color: c.texto2),
            ),
          ),
        ]),
      ],
    );
  }
}

class _IniciaisGrandes extends StatelessWidget {
  final String nome;
  final double tamanho;
  const _IniciaisGrandes({required this.nome, required this.tamanho});

  @override
  Widget build(BuildContext context) {
    final c = context.sc;
    final partes = nome.trim().split(RegExp(r'\s+')).where((e) => e.isNotEmpty).toList();
    var ini = partes.isEmpty ? '?' : partes.first[0];
    if (partes.length > 1) ini += partes.last[0];
    return Container(
      width: tamanho,
      height: tamanho,
      alignment: Alignment.center,
      decoration: BoxDecoration(color: c.suave(c.primaria), shape: BoxShape.circle),
      child: Text(ini.toUpperCase(),
          style: TextStyle(
              fontSize: tamanho * 0.36, fontWeight: FontWeight.w700, color: c.primaria)),
    );
  }
}
