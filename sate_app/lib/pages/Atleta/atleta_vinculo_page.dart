import 'package:flutter/material.dart';

import 'atleta_navigation.dart';
import 'atleta_qrcode_page.dart';
import '../../theme/sate_theme.dart';

class AtletaVinculoPage extends StatefulWidget {
  final String nomeUsuario;
  final String emailUsuario;

  const AtletaVinculoPage({
    super.key,
    required this.nomeUsuario,
    required this.emailUsuario,
  });

  @override
  State<AtletaVinculoPage> createState() => _AtletaVinculoPageState();
}

class _AtletaVinculoPageState extends State<AtletaVinculoPage> {
  final TextEditingController codigoController = TextEditingController();

  bool carregando = false;

  static const Color verde = Color(0xFF005942);
  static const Color rosa = Color(0xFFEF476F);
  static const Color azul = Color(0xFF003D31);
  static const Color fundo = Color(0xFFFAF5EE);

  @override
  void dispose() {
    codigoController.dispose();
    super.dispose();
  }

  // ============================================================
  // VINCULAR (manual)
  // ============================================================

  Future<void> vincular() async {
    final codigo = codigoController.text.trim();

    if (codigo.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Digite o código da equipe.'),
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    setState(() {
      carregando = true;
    });

    await Future.delayed(const Duration(seconds: 1));

    if (!mounted) return;

    setState(() {
      carregando = false;
    });

    mostrarTreinador();
  }

  // ============================================================
  // ESCANEAR QR CODE
  // ============================================================

  Future<void> _escanearQrCode() async {
    final codigoLido = await Navigator.push<String>(
      context,
      MaterialPageRoute(
        builder: (_) => const AtletaQrCodePage(),
      ),
    );

    if (codigoLido == null || codigoLido.isEmpty) return;

    // Se o QR Code tiver uma URL tipo "https://sate.app/join/TRN-4829",
    // pega só o último segmento. Caso contrário, usa o valor direto.
    final codigoLimpo = codigoLido.contains('/')
        ? codigoLido.split('/').last
        : codigoLido;

    codigoController.text = codigoLimpo;

    // Chama o vínculo direto após ler o QR
    if (mounted) {
      vincular();
    }
  }

  // ============================================================
  // BOTTOM SHEET DE CONFIRMAÇÃO
  // ============================================================

  void mostrarTreinador() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) {
        return Container(
          width: double.infinity,
          padding: const EdgeInsets.fromLTRB(24, 12, 24, 28),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(
              top: Radius.circular(28),
            ),
          ),
          child: SafeArea(
            top: false,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // BARRINHA
                Container(
                  width: 42,
                  height: 5,
                  decoration: BoxDecoration(
                    color: Color(0xFFD5C9BA),
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),

                const SizedBox(height: 25),

                Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    color: azul.withValues(alpha: 0.10),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Icon(
                    Icons.person_rounded,
                    color: azul,
                    size: 34,
                  ),
                ),

                const SizedBox(height: 18),

                const Text.rich(
                  TextSpan(children: [TextSpan(text: 'Equipe '), TextSpan(text: 'encontrada!', style: SateEstilo.destaque)]),
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 23,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF10251F),
                  ),
                ),

                const SizedBox(height: 8),

                Text(
                  'Confira os dados antes de confirmar seu vínculo.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 14,
                    height: 1.4,
                    color: Color(0xFF68736F),
                  ),
                ),

                const SizedBox(height: 24),

                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: fundo,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(
                      color: Color(0xFFE8DFD3),
                    ),
                  ),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 45,
                            height: 45,
                            decoration: BoxDecoration(
                              color: verde.withValues(alpha: 0.10),
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: const Icon(
                              Icons.groups_rounded,
                              color: verde,
                            ),
                          ),
                          const SizedBox(width: 13),
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Equipe Performance',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                SizedBox(height: 4),
                                Text(
                                  'Equipe esportiva',
                                  style: TextStyle(
                                    fontSize: 13,
                                    color: Color(0xFF8A938F),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 16),

                      Divider(
                        color: Color(0xFFE8DFD3),
                      ),

                      const SizedBox(height: 12),

                      Row(
                        children: [
                          Icon(
                            Icons.person_outline_rounded,
                            color: Color(0xFF68736F),
                            size: 21,
                          ),
                          const SizedBox(width: 10),
                          const Text(
                            'Treinador: ',
                            style: TextStyle(
                              fontSize: 14,
                              color: Color(0xFF8A938F),
                            ),
                          ),
                          const Text(
                            'Carlos Oliveira',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 22),

                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);

                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (context) => AtletaNavigation(
                            nomeUsuario: widget.nomeUsuario,
                            emailUsuario: widget.emailUsuario,
                          ),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: verde,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(15),
                      ),
                    ),
                    child: const Text(
                      'Confirmar vínculo',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  // ============================================================
  // BUILD
  // ============================================================

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: fundo,

      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(22, 20, 22, 35),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // LOGO
              Center(
                child: Image.asset(
                  'assets/images/logoVerde_img.png',
                  width: 120,
                ),
              ),

              const SizedBox(height: 38),

              // ÍCONE
              Center(
                child: Container(
                  width: 70,
                  height: 70,
                  decoration: BoxDecoration(
                    color: azul.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(22),
                  ),
                  child: const Icon(
                    Icons.link_rounded,
                    color: azul,
                    size: 36,
                  ),
                ),
              ),

              const SizedBox(height: 22),

              // TÍTULO
              const Center(
                child: Text.rich(
                  TextSpan(children: [TextSpan(text: 'Entre na sua '), TextSpan(text: 'equipe', style: SateEstilo.destaque)]),
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 27,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF10251F),
                  ),
                ),
              ),

              const SizedBox(height: 9),

              Center(
                child: Text(
                  'Digite o código fornecido pelo seu treinador '
                  'ou escaneie o QR Code.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 14,
                    height: 1.5,
                    color: Color(0xFF68736F),
                  ),
                ),
              ),

              const SizedBox(height: 30),

              // CAMPO DO CÓDIGO
              const Text(
                'Código da equipe',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF10251F),
                ),
              ),

              const SizedBox(height: 9),

              TextField(
                controller: codigoController,
                textCapitalization: TextCapitalization.characters,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 2,
                  color: azul,
                ),
                decoration: InputDecoration(
                  hintText: 'EX: TRN-4829',
                  hintStyle: TextStyle(
                    color: Color(0xFFA3ADA9),
                    fontSize: 15,
                    letterSpacing: 1,
                  ),
                  prefixIcon: const Icon(
                    Icons.key_rounded,
                    color: azul,
                  ),
                  filled: true,
                  fillColor: Colors.white,
                  contentPadding: const EdgeInsets.symmetric(
                    vertical: 17,
                    horizontal: 16,
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15),
                    borderSide: BorderSide(
                      color: Color(0xFFE8DFD3),
                    ),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15),
                    borderSide: BorderSide(
                      color: Color(0xFFE8DFD3),
                    ),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15),
                    borderSide: const BorderSide(
                      color: azul,
                      width: 1.5,
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // BOTÃO VINCULAR
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: carregando ? null : vincular,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: verde,
                    disabledBackgroundColor: Color(0xFFD5C9BA),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(15),
                    ),
                  ),
                  child: carregando
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(
                            strokeWidth: 2.5,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              Colors.white,
                            ),
                          ),
                        )
                      : const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'Vincular à equipe',
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(width: 8),
                            Icon(
                              Icons.arrow_forward_rounded,
                              size: 20,
                            ),
                          ],
                        ),
                ),
              ),

              const SizedBox(height: 18),

              // DIVISOR "OU"
              Row(
                children: [
                  Expanded(child: Divider(color: Color(0xFFD5C9BA))),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    child: Text(
                      'ou',
                      style: TextStyle(
                        color: Color(0xFF8A938F),
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  Expanded(child: Divider(color: Color(0xFFD5C9BA))),
                ],
              ),

              const SizedBox(height: 18),

              // BOTÃO ESCANEAR QR CODE
              SizedBox(
                width: double.infinity,
                height: 52,
                child: OutlinedButton.icon(
                  onPressed: carregando ? null : _escanearQrCode,
                  icon: const Icon(
                    Icons.qr_code_scanner_rounded,
                    size: 22,
                  ),
                  label: const Text(
                    'Escanear QR Code',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: verde,
                    side: const BorderSide(color: verde, width: 1.5),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(15),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 32),

              // COMO FUNCIONA
              const Text.rich(
                TextSpan(children: [TextSpan(text: 'Como '), TextSpan(text: 'funciona?', style: SateEstilo.destaque)]),
                style: TextStyle(
                  fontSize: 19,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF10251F),
                ),
              ),

              const SizedBox(height: 15),

              _buildStep(
                numero: '1',
                titulo: 'Peça o código',
                descricao: 'Solicite o código da sua equipe ao treinador.',
                cor: azul,
              ),

              const SizedBox(height: 12),

              _buildStep(
                numero: '2',
                titulo: 'Digite o código ou escaneie',
                descricao: 'Insira o código no campo ou use o QR Code.',
                cor: rosa,
              ),

              const SizedBox(height: 12),

              _buildStep(
                numero: '3',
                titulo: 'Confirme o vínculo',
                descricao: 'Confira a equipe e confirme para entrar.',
                cor: verde,
              ),

              const SizedBox(height: 20),

              // AVISO
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(15),
                decoration: BoxDecoration(
                  color: azul.withValues(alpha: 0.05),
                  borderRadius: BorderRadius.circular(15),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(
                      Icons.info_outline_rounded,
                      color: azul,
                      size: 21,
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'O código deve ser fornecido pelo treinador '
                        'da sua equipe.',
                        style: TextStyle(
                          fontSize: 12.5,
                          height: 1.4,
                          color: Color(0xFF4F5A56),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ============================================================
  // STEP
  // ============================================================

  Widget _buildStep({
    required String numero,
    required String titulo,
    required String descricao,
    required Color cor,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(17),
        border: Border.all(
          color: Color(0xFFE8DFD3),
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: cor.withValues(alpha: 0.10),
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                numero,
                style: TextStyle(
                  color: cor,
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),

          const SizedBox(width: 13),

          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  titulo,
                  style: const TextStyle(
                    fontSize: 14.5,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF10251F),
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  descricao,
                  style: TextStyle(
                    fontSize: 12.5,
                    height: 1.3,
                    color: Color(0xFF68736F),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}