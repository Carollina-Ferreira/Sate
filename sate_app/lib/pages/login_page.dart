import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import 'cadastro_page.dart';
import 'esqueci_senha_page.dart';
import 'Atleta/atleta_vinculo_page.dart';
import 'Treinador/treinador_vinculo_page.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final emailController = TextEditingController();
  final senhaController = TextEditingController();

  bool mostrarSenha = false;
  bool carregando = false;

  String tipoUsuario = 'Atleta';

  static const verde = Color(0xFF00845F);
  static const rosa = Color(0xFFE98BA8);
  static const azul = Color(0xFF001E98);

  static const String apiUrl = 'http://localhost:3000';

  @override
  void dispose() {
    emailController.dispose();
    senhaController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFCFCFC),
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
                  child: _loginCard(),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _loginCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(42),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.07),
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

          const Text(
            'Bem-vindo de volta!',
            style: TextStyle(
              fontSize: 29,
              fontWeight: FontWeight.w700,
              color: Color(0xFF161616),
            ),
          ),

          const SizedBox(height: 10),

          Text(
            'Entre na sua conta para continuar '
            'acompanhando seu desempenho.',
            style: TextStyle(
              fontSize: 14,
              height: 1.5,
              color: Colors.grey.shade600,
            ),
          ),

          const SizedBox(height: 28),

          // TIPO DE USUÁRIO
          _label('Entrar como'),

          const SizedBox(height: 8),

          InkWell(
            borderRadius: BorderRadius.circular(12),
            onTap: carregando ? null : _selecionarPerfil,
            child: Container(
              height: 52,
              padding: const EdgeInsets.symmetric(
                horizontal: 15,
              ),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: Colors.grey.shade300,
                ),
              ),
              child: Row(
                children: [
                  Icon(
                    tipoUsuario == 'Atleta'
                        ? Icons.directions_run
                        : Icons.sports,
                    color: verde,
                    size: 20,
                  ),

                  const SizedBox(width: 12),

                  Expanded(
                    child: Text(
                      tipoUsuario,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),

                  Icon(
                    Icons.keyboard_arrow_down,
                    color: Colors.grey.shade500,
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 18),

          // EMAIL
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

          // SENHA
          _label('Senha'),

          const SizedBox(height: 8),

          TextField(
            controller: senhaController,
            obscureText: !mostrarSenha,
            textInputAction: TextInputAction.done,
            enabled: !carregando,
            onSubmitted: (_) => _entrar(),
            decoration: _inputDecoration(
              'Digite sua senha',
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
                  color: Colors.grey.shade500,
                ),
              ),
            ),
          ),

          const SizedBox(height: 10),

          // ESQUECI SENHA
          Align(
            alignment: Alignment.centerRight,
            child: TextButton(
              onPressed: carregando
                  ? null
                  : () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) =>
                              const EsqueciSenhaPage(),
                        ),
                      );
                    },
              child: const Text(
                'Esqueci minha senha',
                style: TextStyle(
                  color: verde,
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),

          const SizedBox(height: 10),

          // ENTRAR
          _mainButton(
            text: carregando
                ? 'Entrando...'
                : 'Entrar',
            onTap: carregando
                ? () {}
                : _entrar,
          ),

          const SizedBox(height: 22),

          _divider(),

          const SizedBox(height: 22),

          // GOOGLE
          _socialButton(
            icon: _googleIcon(),
            text: 'Continuar com Google',
            onTap: carregando
                ? () {}
                : _entrarComGoogle,
          ),

          const SizedBox(height: 12),

          // APPLE
          _socialButton(
            icon: const Icon(
              Icons.apple,
              color: Colors.black,
              size: 22,
            ),
            text: 'Continuar com Apple',
            onTap: carregando
                ? () {}
                : _entrarComApple,
          ),

          const SizedBox(height: 25),

          Center(
            child: _HoverLink(
              verde: verde,
              normalText: 'Ainda não possui uma conta? ',
              linkText: 'Criar conta',
              onTap: carregando
                  ? () {}
                  : () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) =>
                              const CadastroPage(),
                        ),
                      );
                    },
            ),
          ),
        ],
      ),
    );
  }

  // ============================================================
  // SELECIONAR PERFIL
  // ============================================================

  void _selecionarPerfil() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(24),
        ),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(25),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Como você vai entrar?',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                ),
              ),

              const SizedBox(height: 8),

              Text(
                'Selecione o tipo de perfil que deseja acessar.',
                style: TextStyle(
                  color: Colors.grey.shade600,
                  fontSize: 13,
                ),
              ),

              const SizedBox(height: 20),

              _perfilOption(
                'Atleta',
                'Acesse seus treinos e acompanhe sua evolução.',
                Icons.directions_run,
              ),

              const SizedBox(height: 10),

              _perfilOption(
                'Treinador',
                'Gerencie atletas, treinos e equipes.',
                Icons.sports,
              ),

              const SizedBox(height: 10),
            ],
          ),
        );
      },
    );
  }

  Widget _perfilOption(
    String titulo,
    String descricao,
    IconData icon,
  ) {
    final selecionado = tipoUsuario == titulo;

    return InkWell(
      borderRadius: BorderRadius.circular(14),
      onTap: () {
        setState(() {
          tipoUsuario = titulo;
        });

        Navigator.pop(context);
      },
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: selecionado
              ? verde.withValues(alpha: 0.06)
              : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: selecionado
                ? verde
                : Colors.grey.shade300,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 45,
              height: 45,
              decoration: BoxDecoration(
                color: selecionado
                    ? verde
                    : Colors.grey.shade100,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                icon,
                color: selecionado
                    ? Colors.white
                    : Colors.grey.shade700,
              ),
            ),

            const SizedBox(width: 14),

            Expanded(
              child: Column(
                crossAxisAlignment:
                    CrossAxisAlignment.start,
                children: [
                  Text(
                    titulo,
                    style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 14,
                    ),
                  ),

                  const SizedBox(height: 4),

                  Text(
                    descricao,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey.shade600,
                    ),
                  ),
                ],
              ),
            ),

            if (selecionado)
              const Icon(
                Icons.check_circle,
                color: verde,
              ),
          ],
        ),
      ),
    );
  }

  // ============================================================
  // LOGIN
  // ============================================================

  Future<void> _entrar() async {
    final email = emailController.text.trim();
    final senha = senhaController.text;

    if (email.isEmpty || senha.isEmpty) {
      _mostrarMensagem(
        'Preencha seu email e sua senha.',
      );
      return;
    }

    if (email.contains(' ') || !email.contains('@')) {
      _mostrarMensagem(
        'Digite um email válido.',
      );
      return;
    }

    setState(() {
      carregando = true;
    });

    try {
      final tipo = tipoUsuario == 'Atleta'
          ? 'ATLETA'
          : 'TREINADOR';

      debugPrint('================================');
      debugPrint('LOGIN');
      debugPrint('Email: $email');
      debugPrint('Tipo escolhido: $tipo');
      debugPrint('================================');

      final resposta = await http.post(
        Uri.parse(
          '$apiUrl/api/auth/login',
        ),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'email': email,
          'senha': senha,
          'tipo': tipo,
        }),
      );

      debugPrint(
        'Status do login: ${resposta.statusCode}',
      );

      debugPrint(
        'Resposta do servidor: ${resposta.body}',
      );

      if (!mounted) return;

      final data = jsonDecode(resposta.body);

      if (resposta.statusCode != 200) {
        _mostrarMensagem(
          data['mensagem'] ??
              'Não foi possível realizar o login.',
          erro: true,
        );
        return;
      }

      final usuario = data['usuario'];

      if (usuario == null) {
        _mostrarMensagem(
          'Resposta inválida do servidor.',
          erro: true,
        );
        return;
      }

      final tipoRetornado = usuario['tipo'];

      // ========================================================
      // VERIFICA O TIPO RETORNADO PELO BACKEND
      // ========================================================

      if (tipoRetornado == 'ATLETA') {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) =>
                const AtletaVinculoPage(),
          ),
        );
      } else if (tipoRetornado == 'TREINADOR') {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) =>
                const TreinadorVinculoPage(),
          ),
        );
      } else {
        _mostrarMensagem(
          'Tipo de usuário inválido.',
          erro: true,
        );
      }

    } catch (error) {
      if (!mounted) return;

      debugPrint(
        'Erro no login: $error',
      );

      _mostrarMensagem(
        'Não foi possível conectar ao servidor.\n$error',
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

  // ============================================================
  // ESTILO
  // ============================================================

  Widget _label(String text) {
    return Text(
      text,
      style: const TextStyle(
        fontSize: 13,
        fontWeight: FontWeight.w600,
        color: Color(0xFF242424),
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
        color: Colors.grey.shade400,
        fontSize: 13,
      ),
      prefixIcon: Icon(
        icon,
        size: 19,
        color: Colors.grey.shade500,
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
          color: Colors.grey.shade300,
        ),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(
          color: Colors.grey.shade300,
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
            color: Colors.grey.shade300,
          ),
        ),

        Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: 12,
          ),
          child: Text(
            'ou continue com',
            style: TextStyle(
              color: Colors.grey.shade500,
              fontSize: 11,
            ),
          ),
        ),

        Expanded(
          child: Divider(
            color: Colors.grey.shade300,
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
    return SizedBox(
      width: double.infinity,
      height: 50,
      child: OutlinedButton(
        onPressed: onTap,
        style: OutlinedButton.styleFrom(
          backgroundColor: Colors.white,
          foregroundColor: const Color(0xFF222222),
          side: BorderSide(
            color: Colors.grey.shade300,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        child: Row(
          mainAxisAlignment:
              MainAxisAlignment.center,
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

  void _entrarComGoogle() {
    _mostrarMensagem(
      'Login com Google será configurado em breve.',
    );
  }

  void _entrarComApple() {
    _mostrarMensagem(
      'Login com Apple será configurado em breve.',
    );
  }

  void _mostrarMensagem(
    String mensagem, {
    bool erro = false,
  }) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(mensagem),
        backgroundColor: erro ? Colors.red : null,
      ),
    );
  }
}

// ============================================================
// LINK COM HOVER
// ============================================================

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
              color: Colors.grey.shade600,
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
                      ? const Color(0xFF006B4D)
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

// ============================================================
// FUNDO
// ============================================================

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

    for (
      int i = 0;
      i < points.length;
      i += 2
    ) {
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