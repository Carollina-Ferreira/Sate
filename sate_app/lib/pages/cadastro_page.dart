
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../theme/sate_theme.dart';

class CadastroPage extends StatefulWidget {
  const CadastroPage({super.key});

  @override
  State<CadastroPage> createState() => _CadastroPageState();
}

class _CadastroPageState extends State<CadastroPage> {
  final nomeController = TextEditingController();
  final emailController = TextEditingController();
  final senhaController = TextEditingController();
  final confirmarSenhaController = TextEditingController();

  bool mostrarSenha = false;
  bool mostrarConfirmarSenha = false;
  bool termos = false;
  bool carregando = false;

  static const verde = Color(0xFF005942);
  static const rosa = Color(0xFFEF476F);
  static const azul = Color(0xFF003D31);

  static const String apiUrl = 'http://localhost:3000';

  @override
  void dispose() {
    nomeController.dispose();
    emailController.dispose();
    senhaController.dispose();
    confirmarSenhaController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF5EE),
      body: Stack(
        children: [
          Positioned.fill(
            child: CustomPaint(
              painter: BackgroundPainter(
                verde: verde,
                rosa: rosa,
                azul: azul,
              ),
            ),
          ),
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 40,
                ),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(
                    maxWidth: 430,
                  ),
                  child: _cadastroCard(),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _cadastroCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(42),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Color(0xFF10251F).withValues(alpha: 0.07),
            blurRadius: 40,
            offset: const Offset(0, 18),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Image.asset(
              'assets/images/logoVerde_img.png',
              width: 125,
              fit: BoxFit.contain,
            ),
          ),

          const SizedBox(height: 28),

          const Text.rich(
            TextSpan(children: [TextSpan(text: 'Crie sua '), TextSpan(text: 'conta', style: SateEstilo.destaque)]),
            style: TextStyle(
              fontSize: 29,
              fontWeight: FontWeight.w700,
              color: Color(0xFF10251F),
            ),
          ),

          const SizedBox(height: 10),

          Text(
            'Crie sua conta para começar a acompanhar '
            'seu desempenho esportivo.',
            style: TextStyle(
              fontSize: 14,
              height: 1.5,
              color: Color(0xFF68736F),
            ),
          ),

          const SizedBox(height: 28),

          _label('Nome completo'),

          const SizedBox(height: 8),

          TextField(
            controller: nomeController,
            textInputAction: TextInputAction.next,
            enabled: !carregando,
            decoration: _inputDecoration(
              'Digite seu nome',
              Icons.person_outline,
            ),
          ),

          const SizedBox(height: 18),

          _label('Email'),

          const SizedBox(height: 8),

          TextField(
            controller: emailController,
            keyboardType: TextInputType.emailAddress,
            textInputAction: TextInputAction.next,
            enabled: !carregando,
            decoration: _inputDecoration(
              'Digite seu email',
              Icons.email_outlined,
            ),
          ),

          const SizedBox(height: 18),

          _label('Senha'),

          const SizedBox(height: 8),

          TextField(
            controller: senhaController,
            obscureText: !mostrarSenha,
            textInputAction: TextInputAction.next,
            enabled: !carregando,
            decoration: _inputDecoration(
              'Crie uma senha',
              Icons.lock_outline,
            ).copyWith(
              suffixIcon: IconButton(
                onPressed: carregando
                    ? null
                    : () {
                        setState(() {
                          mostrarSenha = !mostrarSenha;
                        });
                      },
                icon: Icon(
                  mostrarSenha
                      ? Icons.visibility_off_outlined
                      : Icons.visibility_outlined,
                  color: Color(0xFF8A938F),
                ),
              ),
            ),
          ),

          const SizedBox(height: 18),

          _label('Confirmar senha'),

          const SizedBox(height: 8),

          TextField(
            controller: confirmarSenhaController,
            obscureText: !mostrarConfirmarSenha,
            textInputAction: TextInputAction.done,
            enabled: !carregando,
            onSubmitted: (_) => _criarConta(),
            decoration: _inputDecoration(
              'Digite sua senha novamente',
              Icons.lock_outline,
            ).copyWith(
              suffixIcon: IconButton(
                onPressed: carregando
                    ? null
                    : () {
                        setState(() {
                          mostrarConfirmarSenha =
                              !mostrarConfirmarSenha;
                        });
                      },
                icon: Icon(
                  mostrarConfirmarSenha
                      ? Icons.visibility_off_outlined
                      : Icons.visibility_outlined,
                  color: Color(0xFF8A938F),
                ),
              ),
            ),
          ),

          const SizedBox(height: 14),

          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(
                width: 24,
                height: 24,
                child: Checkbox(
                  value: termos,
                  activeColor: verde,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(4),
                  ),
                  onChanged: carregando
                      ? null
                      : (value) {
                          setState(() {
                            termos = value ?? false;
                          });
                        },
                ),
              ),

              const SizedBox(width: 7),

              Expanded(
                child: Text(
                  'Li e aceito os termos de uso e a política '
                  'de privacidade.',
                  style: TextStyle(
                    fontSize: 12,
                    height: 1.4,
                    color: Color(0xFF68736F),
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 20),

          _mainButton(
            text: carregando
                ? 'Criando conta...'
                : 'Criar conta',
            onTap: carregando
                ? () {}
                : _criarConta,
          ),

          const SizedBox(height: 22),

          _divider(),

          const SizedBox(height: 22),

          _socialButton(
            icon: _googleIcon(),
            text: 'Continuar com Google',
            onTap: carregando
                ? () {}
                : _cadastrarComGoogle,
          ),

          const SizedBox(height: 12),

          _socialButton(
            icon: const Icon(
              Icons.apple,
              color: Color(0xFF10251F),
              size: 22,
            ),
            text: 'Continuar com Apple',
            onTap: carregando
                ? () {}
                : _cadastrarComApple,
          ),

          const SizedBox(height: 25),

          Center(
            child: _HoverLink(
              verde: verde,
              normalText: 'Já possui uma conta? ',
              linkText: 'Entrar',
              onTap: carregando
                  ? () {}
                  : () {
                      Navigator.pop(context);
                    },
            ),
          ),
        ],
      ),
    );
  }

  Widget _label(String text) {
    return Text(
      text,
      style: const TextStyle(
        fontSize: 13,
        fontWeight: FontWeight.w600,
        color: Color(0xFF10251F),
      ),
    );
  }

  InputDecoration _inputDecoration(
    String hint,
    IconData icon,
  ) {
    return InputDecoration(
      hintText: hint,
      hintStyle: TextStyle(
        color: Color(0xFFA3ADA9),
        fontSize: 13,
      ),
      prefixIcon: Icon(
        icon,
        size: 19,
        color: Color(0xFF8A938F),
      ),
      filled: true,
      fillColor: Colors.white,
      contentPadding: const EdgeInsets.symmetric(
        horizontal: 15,
        vertical: 15,
      ),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(
          color: Color(0xFFD5C9BA),
        ),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(
          color: Color(0xFFD5C9BA),
        ),
      ),
      focusedBorder: const OutlineInputBorder(
        borderRadius: BorderRadius.all(
          Radius.circular(12),
        ),
        borderSide: BorderSide(
          color: verde,
          width: 1.5,
        ),
      ),
    );
  }

  Widget _mainButton({
    required String text,
    required VoidCallback onTap,
  }) {
    return SizedBox(
      width: double.infinity,
      height: 52,
      child: ElevatedButton(
        onPressed: onTap,
        style: ElevatedButton.styleFrom(
          backgroundColor: verde,
          foregroundColor: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        child: Text(
          text,
          style: const TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }

  Widget _divider() {
    return Row(
      children: [
        Expanded(
          child: Divider(
            color: Color(0xFFD5C9BA),
            thickness: 1,
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Text(
            'ou continue com',
            style: TextStyle(
              color: Color(0xFF8A938F),
              fontSize: 11,
            ),
          ),
        ),
        Expanded(
          child: Divider(
            color: Color(0xFFD5C9BA),
            thickness: 1,
          ),
        ),
      ],
    );
  }

  Widget _socialButton({
    required Widget icon,
    required String text,
    required VoidCallback onTap,
  }) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: SizedBox(
        width: double.infinity,
        height: 50,
        child: OutlinedButton(
          onPressed: onTap,
          style: OutlinedButton.styleFrom(
            backgroundColor: Colors.white,
            foregroundColor: const Color(0xFF10251F),
            side: BorderSide(
              color: Color(0xFFD5C9BA),
            ),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              icon,
              const SizedBox(width: 10),
              Text(
                text,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _googleIcon() {
    return const Text(
      'G',
      style: TextStyle(
        fontSize: 19,
        fontWeight: FontWeight.w700,
        color: Color(0xFF4285F4),
      ),
    );
  }

  // ==========================================================================
  // CRIAR CONTA
  // ==========================================================================

  Future<void> _criarConta() async {
    final nome = nomeController.text.trim();
    final email = emailController.text.trim();
    final senha = senhaController.text;
    final confirmarSenha = confirmarSenhaController.text;

    if (nome.isEmpty) {
      _mostrarMensagem(
        'Digite seu nome completo.',
        erro: true,
      );
      return;
    }

    if (email.isEmpty) {
      _mostrarMensagem(
        'Digite seu email.',
        erro: true,
      );
      return;
    }

    if (email.contains(' ') ||
        !email.contains('@') ||
        !email.contains('.')) {
      _mostrarMensagem(
        'Digite um email válido.',
        erro: true,
      );
      return;
    }

    if (senha.isEmpty) {
      _mostrarMensagem(
        'Digite uma senha.',
        erro: true,
      );
      return;
    }

    if (senha.length < 6) {
      _mostrarMensagem(
        'A senha deve ter pelo menos 6 caracteres.',
        erro: true,
      );
      return;
    }

    if (confirmarSenha.isEmpty) {
      _mostrarMensagem(
        'Confirme sua senha.',
        erro: true,
      );
      return;
    }

    if (senha != confirmarSenha) {
      _mostrarMensagem(
        'As senhas não coincidem.',
        erro: true,
      );
      return;
    }

    if (!termos) {
      _mostrarMensagem(
        'Aceite os termos de uso para continuar.',
        erro: true,
      );
      return;
    }

    setState(() {
      carregando = true;
    });

    try {
      // O tipo NÃO é enviado pelo aplicativo.
      // O backend define automaticamente como TREINADOR.

      final dadosCadastro = {
        'nome': nome,
        'email': email,
        'senha': senha,
      };

      debugPrint('================================');
      debugPrint('SATE - CADASTRO');
      debugPrint('================================');
      debugPrint('URL: $apiUrl/api/auth/cadastro');
      debugPrint('Nome: $nome');
      debugPrint('Email: $email');
      debugPrint('Senha preenchida: ${senha.isNotEmpty}');
      debugPrint(
        'JSON enviado: ${jsonEncode(dadosCadastro)}',
      );
      debugPrint('================================');

      final resposta = await http
          .post(
            Uri.parse(
              '$apiUrl/api/auth/cadastro',
            ),
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: jsonEncode(dadosCadastro),
          )
          .timeout(
            const Duration(seconds: 15),
          );

      debugPrint('================================');
      debugPrint('RESPOSTA DO BACKEND');
      debugPrint('Status: ${resposta.statusCode}');
      debugPrint('Body: ${resposta.body}');
      debugPrint('================================');

      if (!mounted) return;

      dynamic data;

      try {
        data = jsonDecode(resposta.body);
      } catch (e) {
        data = null;
      }

      if (resposta.statusCode == 201) {
        String mensagem = 'Conta criada com sucesso!';

        if (data is Map && data['mensagem'] != null) {
          mensagem = data['mensagem'].toString();
        }

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              '$mensagem Faça login para continuar.',
            ),
            backgroundColor: verde,
          ),
        );

        await Future.delayed(
          const Duration(milliseconds: 800),
        );

        if (!mounted) return;

        Navigator.pop(context);

        return;
      }

      String mensagemErro =
          'Não foi possível criar a conta.';

      if (data is Map && data['mensagem'] != null) {
        mensagemErro = data['mensagem'].toString();
      } else if (resposta.body.isNotEmpty) {
        mensagemErro = resposta.body;
      }

      _mostrarMensagem(
        mensagemErro,
        erro: true,
      );
    } on http.ClientException catch (error) {
      if (!mounted) return;

      debugPrint(
        'Erro de conexão HTTP: $error',
      );

      _mostrarMensagem(
        'Não foi possível conectar ao servidor.',
        erro: true,
      );
    } on FormatException catch (error) {
      if (!mounted) return;

      debugPrint(
        'Erro de JSON: $error',
      );

      _mostrarMensagem(
        'Resposta inválida do servidor.',
        erro: true,
      );
    } catch (error) {
      if (!mounted) return;

      debugPrint(
        'Erro no cadastro: $error',
      );

      _mostrarMensagem(
        'Não foi possível conectar ao servidor.',
        erro: true,
      );
    } finally {
      if (mounted) {
        setState(() {
          carregando = false;
        });
      }
    }
  }

  void _mostrarMensagem(
    String mensagem, {
    bool erro = false,
  }) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(mensagem),
        backgroundColor: erro ? Color(0xFFC9305A) : null,
      ),
    );
  }

  void _cadastrarComGoogle() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text(
          'Cadastro com Google será configurado em breve.',
        ),
      ),
    );
  }

  void _cadastrarComApple() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text(
          'Cadastro com Apple será configurado em breve.',
        ),
      ),
    );
  }
}

// ============================================================================
// HOVER LINK
// ============================================================================

class _HoverLink extends StatefulWidget {
  final Color verde;
  final String normalText;
  final String linkText;
  final VoidCallback onTap;

  const _HoverLink({
    required this.verde,
    required this.normalText,
    required this.linkText,
    required this.onTap,
  });

  @override
  State<_HoverLink> createState() => _HoverLinkState();
}

class _HoverLinkState extends State<_HoverLink> {
  bool hover = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      onEnter: (_) {
        setState(() {
          hover = true;
        });
      },
      onExit: (_) {
        setState(() {
          hover = false;
        });
      },
      child: GestureDetector(
        onTap: widget.onTap,
        child: RichText(
          text: TextSpan(
            style: TextStyle(
              color: Color(0xFF68736F),
              fontSize: 13,
            ),
            children: [
              TextSpan(
                text: widget.normalText,
              ),
              TextSpan(
                text: widget.linkText,
                style: TextStyle(
                  color: hover
                      ? const Color(0xFF003D31)
                      : widget.verde,
                  fontWeight: FontWeight.w700,
                  decoration: hover
                      ? TextDecoration.underline
                      : TextDecoration.none,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ============================================================================
// BACKGROUND
// ============================================================================

class BackgroundPainter extends CustomPainter {
  final Color verde;
  final Color rosa;
  final Color azul;

  BackgroundPainter({
    required this.verde,
    required this.rosa,
    required this.azul,
  });

  @override
  void paint(
    Canvas canvas,
    Size size,
  ) {
    final pinkPaint = Paint()
      ..color = rosa.withValues(alpha: 0.13);

    canvas.drawCircle(
      Offset(size.width - 30, -20),
      150,
      pinkPaint,
    );

    final bluePaint = Paint()
      ..color = azul.withValues(alpha: 0.06);

    canvas.drawCircle(
      Offset(size.width - 90, 150),
      80,
      bluePaint,
    );

    final greenPaint = Paint()
      ..color = verde.withValues(alpha: 0.08);

    canvas.drawCircle(
      Offset(-30, size.height - 50),
      150,
      greenPaint,
    );

    final dotPaint = Paint()
      ..color = azul.withValues(alpha: 0.13);

    const spacing = 13.0;

    for (
      double x = size.width - 140;
      x < size.width - 30;
      x += spacing
    ) {
      for (
        double y = 45;
        y < 135;
        y += spacing
      ) {
        canvas.drawCircle(
          Offset(x, y),
          1.6,
          dotPaint,
        );
      }
    }

    final points = [
      Offset(size.width - 280, 210),
      Offset(size.width - 240, 190),
      Offset(size.width - 200, 200),
      Offset(size.width - 160, 165),
      Offset(size.width - 120, 178),
      Offset(size.width - 80, 140),
      Offset(size.width - 40, 155),
    ];

    final linePaint = Paint()
      ..color = azul.withValues(alpha: 0.7)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final path = Path();

    path.moveTo(
      points[0].dx,
      points[0].dy,
    );

    for (int i = 1; i < points.length; i++) {
      path.lineTo(
        points[i].dx,
        points[i].dy,
      );
    }

    canvas.drawPath(
      path,
      linePaint,
    );

    for (int i = 0; i < points.length; i += 2) {
      final paint = Paint()
        ..color = i % 4 == 0
            ? rosa
            : verde;

      canvas.drawCircle(
        points[i],
        4,
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(
    CustomPainter oldDelegate,
  ) {
    return false;
  }
}
