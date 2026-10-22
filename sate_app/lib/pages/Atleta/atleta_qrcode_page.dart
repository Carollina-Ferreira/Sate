import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

class AtletaQrCodePage extends StatefulWidget {
  const AtletaQrCodePage({super.key});

  @override
  State<AtletaQrCodePage> createState() => _AtletaQrCodePageState();
}

class _AtletaQrCodePageState extends State<AtletaQrCodePage> {
  static const Color verde = Color(0xFF00845F);
  static const Color fundo = Color(0xFFFCFCFC);

  final MobileScannerController controller = MobileScannerController(
    detectionSpeed: DetectionSpeed.noDuplicates,
  );

  bool _jaLeu = false;

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  void _onDetect(BarcodeCapture capture) {
    if (_jaLeu) return;

    final List<Barcode> barcodes = capture.barcodes;
    if (barcodes.isEmpty) return;

    final String? codigo = barcodes.first.rawValue;
    if (codigo == null || codigo.isEmpty) return;

    _jaLeu = true;

    // Volta pra tela anterior passando o código lido
    Navigator.pop(context, codigo);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,

      appBar: AppBar(
        backgroundColor: Colors.black,
        elevation: 0,
        centerTitle: false,
        leading: IconButton(
          onPressed: () {
            Navigator.pop(context);
          },
          icon: const Icon(
            Icons.arrow_back_rounded,
            color: Colors.white,
            size: 28,
          ),
        ),
        title: const Text(
          'Escanear QR Code',
          style: TextStyle(
            color: Colors.white,
            fontSize: 19,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      body: Stack(
        children: [
          MobileScanner(
            controller: controller,
            onDetect: _onDetect,
          ),

          // Moldura do scanner
          Center(
            child: Container(
              width: 260,
              height: 260,
              decoration: BoxDecoration(
                border: Border.all(color: verde, width: 4),
                borderRadius: BorderRadius.circular(24),
              ),
            ),
          ),

          // Texto de instrução
          Positioned(
            bottom: 60,
            left: 0,
            right: 0,
            child: Column(
              children: [
                const Icon(
                  Icons.qr_code_scanner_rounded,
                  color: Colors.white,
                  size: 40,
                ),
                const SizedBox(height: 12),
                Text(
                  'Aponte a câmera para o QR Code\nda equipe',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.white.withValues(alpha: 0.9),
                    fontSize: 14,
                    height: 1.5,
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