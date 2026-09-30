import 'package:flutter/material.dart';

import '../../assets/menu_inferior_atleta.dart';
import 'atleta_home_page.dart';
import 'atleta_treino_page.dart';
import 'atleta_desempenho_page.dart';
import 'atleta_feed_page.dart';
import 'atleta_notificacao_page.dart';

class AtletaPerfilPage extends StatefulWidget {
  const AtletaPerfilPage({super.key});

  @override
  State<AtletaPerfilPage> createState() => _AtletaPerfilPageState();
}

class _AtletaPerfilPageState extends State<AtletaPerfilPage> {
  static const Color verde = Color(0xFF00845F);
  static const Color verdeEscuro = Color(0xFF006B4F);
  static const Color fundo = Color(0xFFF7F7F7);
  static const Color cinza = Color(0xFF777777);

  bool _visualizandoPerfil = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: fundo,
      body: SafeArea(
        child: _visualizandoPerfil
            ? _buildPerfilEsportivo()
            : _buildConta(),
      ),
      bottomNavigationBar: MenuInferiorAtleta(
        indiceSelecionado: 4,
        onItemSelecionado: (index) {
          if (index == 0) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => const AtletaHomePage(),
              ),
            );
            return;
          }

          if (index == 1) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => const AtletaTreinoPage(),
              ),
            );
            return;
          }

          if (index == 2) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => const AtletaDesempenhoPage(),
              ),
            );
            return;
          }

          if (index == 3) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => const AtletaFeedPage(),
              ),
            );
            return;
          }

          if (index == 4) {
            return;
          }
        },
      ),
    );
  }

  // ============================================================
  // TELA PRINCIPAL DO PERFIL / CONTA
  // ============================================================

  Widget _buildConta() {
    return Column(
      children: [
        _buildCabecalho(
          titulo: 'Perfil',
          voltarAcao: () {
            Navigator.pop(context);
          },
        ),

        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // ==================================================
                // CARTÃO DO USUÁRIO
                // ==================================================

                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(
                      color: Colors.grey.shade200,
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 64,
                        height: 64,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: const Color(0xFFE5F1E9),
                          border: Border.all(
                            color: verde,
                            width: 1.5,
                          ),
                        ),
                        child: const Icon(
                          Icons.person_rounded,
                          color: verde,
                          size: 35,
                        ),
                      ),

                      const SizedBox(width: 14),

                      Expanded(
                        child: Column(
                          crossAxisAlignment:
                              CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'João Silva',
                              style: TextStyle(
                                fontSize: 17,
                                fontWeight: FontWeight.bold,
                                color: Colors.black87,
                              ),
                            ),

                            const SizedBox(height: 4),

                            Text(
                              'Atleta',
                              style: TextStyle(
                                fontSize: 11,
                                color: cinza,
                              ),
                            ),

                            const SizedBox(height: 9),

                            GestureDetector(
                              onTap: () {
                                setState(() {
                                  _visualizandoPerfil = true;
                                });
                              },
                              child: const Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    'Visualizar perfil esportivo',
                                    style: TextStyle(
                                      fontSize: 11,
                                      color: verde,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  SizedBox(width: 4),
                                  Icon(
                                    Icons.arrow_forward_rounded,
                                    color: verde,
                                    size: 14,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 22),

                // ==================================================
                // CONFIGURAÇÕES
                // ==================================================

                _buildTituloSecao('Configurações da conta'),

                const SizedBox(height: 10),

                _buildOpcaoConta(
                  icone: Icons.person_outline_rounded,
                  texto: 'Conta',
                  subtitulo: 'Informações pessoais',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const ContaPage(),
                      ),
                    );
                  },
                ),

                _buildOpcaoConta(
                  icone: Icons.settings_outlined,
                  texto: 'Preferências',
                  subtitulo: 'Personalize sua experiência',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const PreferenciasPage(),
                      ),
                    );
                  },
                ),

                _buildOpcaoConta(
                  icone: Icons.lock_outline_rounded,
                  texto: 'Privacidade',
                  subtitulo: 'Controle seus dados',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const PrivacidadePage(),
                      ),
                    );
                  },
                ),

                _buildOpcaoConta(
                  icone: Icons.shield_outlined,
                  texto: 'Segurança',
                  subtitulo: 'Proteja sua conta',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const SegurancaPage(),
                      ),
                    );
                  },
                ),

                const SizedBox(height: 22),

                // ==================================================
                // AJUDA
                // ==================================================

                _buildTituloSecao('Ajuda'),

                const SizedBox(height: 10),

                _buildOpcaoConta(
                  icone: Icons.help_outline_rounded,
                  texto: 'Ajuda e suporte',
                  subtitulo: 'Tire suas dúvidas',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const AjudaSuportePage(),
                      ),
                    );
                  },
                ),

                _buildOpcaoConta(
                  icone: Icons.info_outline_rounded,
                  texto: 'Sobre o SATE',
                  subtitulo: 'Informações sobre o aplicativo',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const SobreSatePage(),
                      ),
                    );
                  },
                ),

                const SizedBox(height: 22),

                // ==================================================
                // SAIR
                // ==================================================

                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: OutlinedButton.icon(
                    onPressed: () {
                      _confirmarSaida(context);
                    },
                    icon: const Icon(
                      Icons.logout_rounded,
                      size: 18,
                    ),
                    label: const Text(
                      'Sair da conta',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.red.shade600,
                      side: BorderSide(
                        color: Colors.red.shade200,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // ============================================================
  // PERFIL ESPORTIVO
  // ============================================================

  Widget _buildPerfilEsportivo() {
    return Column(
      children: [
        _buildCabecalho(
          titulo: 'Perfil esportivo',
          voltarAcao: () {
            setState(() {
              _visualizandoPerfil = false;
            });
          },
        ),

        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 30),
            child: Column(
              children: [
                // ==================================================
                // CARTÃO PRINCIPAL
                // ==================================================

                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(
                      color: Colors.grey.shade200,
                    ),
                  ),
                  child: Column(
                    children: [
                      Container(
                        width: 82,
                        height: 82,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: const Color(0xFFE5F1E9),
                          border: Border.all(
                            color: verde,
                            width: 2,
                          ),
                        ),
                        child: const Icon(
                          Icons.person_rounded,
                          color: verde,
                          size: 46,
                        ),
                      ),

                      const SizedBox(height: 12),

                      const Text(
                        'João Silva',
                        style: TextStyle(
                          fontSize: 19,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                      ),

                      const SizedBox(height: 4),

                      Text(
                        'Falcões FC • Futebol',
                        style: TextStyle(
                          fontSize: 11,
                          color: cinza,
                        ),
                      ),

                      const SizedBox(height: 12),

                      Text(
                        'Meio-campista, apaixonado por futebol desde os 8 anos.\n'
                        'Foco em evoluir a cada treino.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 11,
                          height: 1.4,
                          color: Colors.grey.shade700,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 12),

                // ==================================================
                // EDITAR PERFIL
                // ==================================================

                SizedBox(
                  width: double.infinity,
                  height: 46,
                  child: OutlinedButton.icon(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const EditarPerfilPage(),
                        ),
                      );
                    },
                    icon: const Icon(
                      Icons.edit_outlined,
                      size: 18,
                    ),
                    label: const Text(
                      'Editar perfil',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: verde,
                      side: const BorderSide(
                        color: verde,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 18),

                // ==================================================
                // ESTATÍSTICAS
                // ==================================================

                Row(
                  children: [
                    Expanded(
                      child: _buildEstatistica(
                        titulo: 'Posição',
                        valor: 'Meio-campo',
                      ),
                    ),

                    const SizedBox(width: 8),

                    Expanded(
                      child: _buildEstatistica(
                        titulo: 'Número',
                        valor: '#10',
                        corValor: verde,
                      ),
                    ),

                    const SizedBox(width: 8),

                    Expanded(
                      child: _buildEstatistica(
                        titulo: 'Publicações',
                        valor: '3',
                        corValor: Color(0xFFE86BA5),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 10),

                Row(
                  children: [
                    Expanded(
                      child: _buildMiniInformacao(
                        Icons.trending_up_rounded,
                        'Frequência',
                        '92%',
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _buildMiniInformacao(
                        Icons.check_circle_outline_rounded,
                        'Treinos concluídos',
                        '18',
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 18),

                // ==================================================
                // CARD DE EVOLUÇÃO
                // ==================================================

                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(15),
                  decoration: BoxDecoration(
                    color: verde,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 42,
                        height: 42,
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.16),
                          borderRadius: BorderRadius.circular(11),
                        ),
                        child: const Icon(
                          Icons.trending_up_rounded,
                          color: Colors.white,
                          size: 23,
                        ),
                      ),

                      const SizedBox(width: 12),

                      const Expanded(
                        child: Column(
                          crossAxisAlignment:
                              CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Seu perfil esportivo',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              'Acompanhe seu desempenho, evolução,\n'
                              'metas e feedbacks.',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 10,
                                height: 1.3,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 22),

                // ==================================================
                // PUBLICAÇÕES
                // ==================================================

                _buildTituloSecao('Publicações'),

                const SizedBox(height: 10),

                Row(
                  children: [
                    Expanded(
                      child: _buildPublicacao(),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _buildPublicacao(),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _buildPublicacao(),
                    ),
                  ],
                ),

                const SizedBox(height: 22),

                // ==================================================
                // MEU PERFIL
                // ==================================================

                _buildTituloSecao('Meu perfil'),

                const SizedBox(height: 10),

                _buildOpcaoPerfil(
                  icone: Icons.groups_outlined,
                  texto: 'Minha equipe',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const MinhaEquipePage(),
                      ),
                    );
                  },
                ),

                _buildOpcaoPerfil(
                  icone: Icons.track_changes_outlined,
                  texto: 'Minhas metas',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const MinhasMetasPage(),
                      ),
                    );
                  },
                ),

                _buildOpcaoPerfil(
                  icone: Icons.star_outline_rounded,
                  texto: 'Feedbacks',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const FeedbacksPage(),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // ============================================================
  // CABEÇALHO
  // ============================================================

  Widget _buildCabecalho({
    required String titulo,
    required VoidCallback voltarAcao,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
      decoration: const BoxDecoration(
        color: verdeEscuro,
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(22),
          bottomRight: Radius.circular(22),
        ),
      ),
      child: Row(
        children: [
          IconButton(
            onPressed: voltarAcao,
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(
              minWidth: 40,
              minHeight: 40,
            ),
            icon: const Icon(
              Icons.arrow_back_rounded,
              color: Colors.white,
              size: 24,
            ),
          ),

          const SizedBox(width: 4),

          Expanded(
            child: Text(
              titulo,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),

          IconButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const AtletaNotificacaoPage(),
                ),
              );
            },
            icon: const Icon(
              Icons.notifications_none_rounded,
              color: Colors.white,
              size: 25,
            ),
          ),
        ],
      ),
    );
  }

  // ============================================================
  // TÍTULO DE SEÇÃO
  // ============================================================

  Widget _buildTituloSecao(String texto) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Text(
        texto,
        style: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: Colors.black87,
        ),
      ),
    );
  }

  // ============================================================
  // OPÇÃO DA CONTA
  // ============================================================

  Widget _buildOpcaoConta({
    required IconData icone,
    required String texto,
    required String subtitulo,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(18),
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: 20,
            vertical: 14,
          ),
          child: Row(
            children: [
              Container(
                width: 58,
                height: 58,
                decoration: BoxDecoration(
                  color: const Color(0xFFEAF5F1),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(
                  icone,
                  size: 28,
                  color: verde,
                ),
              ),

              const SizedBox(width: 18),

              Expanded(
                child: Column(
                  crossAxisAlignment:
                      CrossAxisAlignment.start,
                  children: [
                    Text(
                      texto,
                      style: const TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w600,
                        color: Colors.black87,
                      ),
                    ),

                    const SizedBox(height: 4),

                    Text(
                      subtitulo,
                      style: TextStyle(
                        fontSize: 14,
                        color: cinza,
                      ),
                    ),
                  ],
                ),
              ),

              Icon(
                Icons.chevron_right_rounded,
                size: 28,
                color: Colors.grey.shade500,
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ============================================================
  // OPÇÃO DO PERFIL
  // ============================================================

  Widget _buildOpcaoPerfil({
    required IconData icone,
    required String texto,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(18),
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: 14,
            vertical: 12,
          ),
          child: Row(
            children: [
              Container(
                width: 54,
                height: 54,
                decoration: BoxDecoration(
                  color: const Color(0xFFEAF5F1),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(
                  icone,
                  size: 27,
                  color: verde,
                ),
              ),

              const SizedBox(width: 18),

              Expanded(
                child: Text(
                  texto,
                  style: const TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w600,
                    color: Colors.black87,
                  ),
                ),
              ),

              Icon(
                Icons.chevron_right_rounded,
                size: 28,
                color: Colors.grey.shade500,
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ============================================================
  // ESTATÍSTICA
  // ============================================================

  Widget _buildEstatistica({
    required String titulo,
    required String valor,
    Color corValor = Colors.black87,
  }) {
    return Container(
      height: 72,
      padding: const EdgeInsets.all(11),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),
      child: Column(
        crossAxisAlignment:
            CrossAxisAlignment.start,
        mainAxisAlignment:
            MainAxisAlignment.center,
        children: [
          Text(
            titulo,
            style: TextStyle(
              fontSize: 9,
              color: cinza,
            ),
          ),

          const SizedBox(height: 5),

          Text(
            valor,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: corValor,
            ),
          ),
        ],
      ),
    );
  }

  // ============================================================
  // MINI INFORMAÇÃO
  // ============================================================

  Widget _buildMiniInformacao(
    IconData icone,
    String titulo,
    String valor,
  ) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 12,
        vertical: 10,
      ),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(13),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),
      child: Row(
        children: [
          Icon(
            icone,
            size: 18,
            color: verde,
          ),

          const SizedBox(width: 8),

          Expanded(
            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment.start,
              children: [
                Text(
                  titulo,
                  style: TextStyle(
                    fontSize: 9,
                    color: cinza,
                  ),
                ),

                const SizedBox(height: 2),

                Text(
                  valor,
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ============================================================
  // PUBLICAÇÃO
  // ============================================================

  Widget _buildPublicacao() {
    return Container(
      height: 100,
      decoration: BoxDecoration(
        color: Colors.grey.shade200,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),
      child: Icon(
        Icons.image_outlined,
        color: Colors.grey.shade400,
        size: 28,
      ),
    );
  }

  // ============================================================
  // CONFIRMAR SAÍDA
  // ============================================================

  void _confirmarSaida(BuildContext context) {
    showDialog(
      context: context,
      builder: (dialogContext) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(18),
          ),
          title: const Text(
            'Sair da conta?',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          content: const Text(
            'Você precisará entrar novamente para acessar sua conta.',
            style: TextStyle(
              fontSize: 13,
              height: 1.4,
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(dialogContext);
              },
              child: Text(
                'CANCELAR',
                style: TextStyle(
                  color: Colors.grey.shade600,
                ),
              ),
            ),

            TextButton(
              onPressed: () {
                Navigator.pop(dialogContext);
              },
              child: const Text(
                'SAIR',
                style: TextStyle(
                  color: Colors.redAccent,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}

// ==================================================================
// TELA BASE DAS PÁGINAS INTERNAS
// ==================================================================

class _TelaPerfilInterna extends StatelessWidget {
  final String titulo;
  final Widget child;

  const _TelaPerfilInterna({
    required this.titulo,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F7),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF7F7F7),
        elevation: 0,
        centerTitle: false,
        leading: IconButton(
          onPressed: () {
            Navigator.pop(context);
          },
          icon: const Icon(
            Icons.arrow_back_rounded,
            color: Colors.black87,
          ),
        ),
        title: Text(
          titulo,
          style: const TextStyle(
            color: Colors.black87,
            fontSize: 19,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(
          16,
          8,
          16,
          30,
        ),
        child: child,
      ),
    );
  }
}

// ==================================================================
// EDITAR PERFIL
// ==================================================================

class EditarPerfilPage extends StatefulWidget {
  const EditarPerfilPage({super.key});

  @override
  State<EditarPerfilPage> createState() =>
      _EditarPerfilPageState();
}

class _EditarPerfilPageState
    extends State<EditarPerfilPage> {
  final TextEditingController nomeController =
      TextEditingController(text: 'João Silva');

  final TextEditingController posicaoController =
      TextEditingController(text: 'Meio-campista');

  final TextEditingController numeroController =
      TextEditingController(text: '10');

  final TextEditingController equipeController =
      TextEditingController(text: 'Falcões FC');

  final TextEditingController descricaoController =
      TextEditingController(
    text: 'Meio-campista, apaixonado por futebol desde os 8 anos.',
  );

  @override
  void dispose() {
    nomeController.dispose();
    posicaoController.dispose();
    numeroController.dispose();
    equipeController.dispose();
    descricaoController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return _TelaPerfilInterna(
      titulo: 'Editar perfil',
      child: Column(
        crossAxisAlignment:
            CrossAxisAlignment.start,
        children: [
          _buildAvatarEditar(),

          const SizedBox(height: 24),

          _buildCampo(
            titulo: 'Nome',
            controller: nomeController,
          ),

          _buildCampo(
            titulo: 'Posição',
            controller: posicaoController,
          ),

          Row(
            children: [
              Expanded(
                child: _buildCampo(
                  titulo: 'Número',
                  controller: numeroController,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _buildCampo(
                  titulo: 'Equipe',
                  controller: equipeController,
                ),
              ),
            ],
          ),

          _buildCampo(
            titulo: 'Descrição',
            controller: descricaoController,
            maxLines: 4,
          ),

          const SizedBox(height: 10),

          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              onPressed: () {
                ScaffoldMessenger.of(context)
                    .showSnackBar(
                  const SnackBar(
                    content: Text(
                      'Perfil atualizado!',
                    ),
                  ),
                );

                Navigator.pop(context);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor:
                    const Color(0xFF00845F),
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius:
                      BorderRadius.circular(14),
                ),
              ),
              child: const Text(
                'SALVAR ALTERAÇÕES',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAvatarEditar() {
    return Center(
      child: Column(
        children: [
          Container(
            width: 90,
            height: 90,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: const Color(0xFFE5F1E9),
              border: Border.all(
                color: const Color(0xFF00845F),
                width: 2,
              ),
            ),
            child: const Icon(
              Icons.person_rounded,
              color: Color(0xFF00845F),
              size: 48,
            ),
          ),
          const SizedBox(height: 8),
          TextButton(
            onPressed: () {},
            child: const Text(
              'Alterar foto',
              style: TextStyle(
                color: Color(0xFF00845F),
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCampo({
    required String titulo,
    required TextEditingController controller,
    int maxLines = 1,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: TextField(
        controller: controller,
        maxLines: maxLines,
        style: const TextStyle(
          fontSize: 13,
          color: Colors.black87,
        ),
        decoration: InputDecoration(
          labelText: titulo,
          labelStyle: TextStyle(
            color: Colors.grey.shade600,
            fontSize: 12,
          ),
          filled: true,
          fillColor: Colors.white,
          contentPadding:
              const EdgeInsets.symmetric(
            horizontal: 14,
            vertical: 13,
          ),
          border: OutlineInputBorder(
            borderRadius:
                BorderRadius.circular(14),
            borderSide: BorderSide(
              color: Colors.grey.shade200,
            ),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius:
                BorderRadius.circular(14),
            borderSide: BorderSide(
              color: Colors.grey.shade200,
            ),
          ),
          focusedBorder:
              const OutlineInputBorder(
            borderRadius: BorderRadius.all(
              Radius.circular(14),
            ),
            borderSide: BorderSide(
              color: Color(0xFF00845F),
              width: 1.5,
            ),
          ),
        ),
      ),
    );
  }
}

// ==================================================================
// MINHA EQUIPE
// ==================================================================

class MinhaEquipePage extends StatelessWidget {
  const MinhaEquipePage({super.key});

  @override
  Widget build(BuildContext context) {
    return _TelaPerfilInterna(
      titulo: 'Minha equipe',
      child: Column(
        children: [
          _buildCabecalhoEquipe(),

          const SizedBox(height: 14),

          _buildMembro(
            nome: 'João Silva',
            funcao: 'Meio-campista',
            voce: true,
          ),

          _buildMembro(
            nome: 'Carlos Mendes',
            funcao: 'Atacante',
            voce: false,
          ),

          _buildMembro(
            nome: 'Ana Costa',
            funcao: 'Defensora',
            voce: false,
          ),

          _buildMembro(
            nome: 'Mariana Souza',
            funcao: 'Goleira',
            voce: false,
          ),
        ],
      ),
    );
  }

  Widget _buildCabecalhoEquipe() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFF00845F),
        borderRadius: BorderRadius.circular(18),
      ),
      child: const Row(
        children: [
          Icon(
            Icons.groups_rounded,
            color: Colors.white,
            size: 35,
          ),
          SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment.start,
              children: [
                Text(
                  'Falcões FC',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  '4 atletas na equipe',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMembro({
    required String nome,
    required String funcao,
    required bool voce,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: const BoxDecoration(
              color: Color(0xFFEAF5F1),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.person_rounded,
              color: Color(0xFF00845F),
              size: 25,
            ),
          ),

          const SizedBox(width: 12),

          Expanded(
            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment.start,
              children: [
                Text(
                  nome,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  funcao,
                  style: const TextStyle(
                    fontSize: 10,
                    color: Color(0xFF777777),
                  ),
                ),
              ],
            ),
          ),

          if (voce)
            const Text(
              'Você',
              style: TextStyle(
                color: Color(0xFF00845F),
                fontSize: 10,
                fontWeight: FontWeight.bold,
              ),
            ),
        ],
      ),
    );
  }
}

// ==================================================================
// MINHAS METAS
// ==================================================================

class MinhasMetasPage extends StatelessWidget {
  const MinhasMetasPage({super.key});

  @override
  Widget build(BuildContext context) {
    return _TelaPerfilInterna(
      titulo: 'Minhas metas',
      child: Column(
        children: [
          _buildResumo(),

          const SizedBox(height: 16),

          _buildMeta(
            titulo: 'Aumentar frequência nos treinos',
            progresso: '92%',
            percentual: 0.92,
          ),

          _buildMeta(
            titulo: 'Concluir 20 treinos',
            progresso: '18/20',
            percentual: 0.90,
          ),

          _buildMeta(
            titulo: 'Melhorar desempenho',
            progresso: '75%',
            percentual: 0.75,
          ),

          _buildMeta(
            titulo: 'Participar de competições',
            progresso: '2/3',
            percentual: 0.66,
          ),
        ],
      ),
    );
  }

  Widget _buildResumo() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFF00845F),
        borderRadius: BorderRadius.circular(18),
      ),
      child: const Row(
        children: [
          Icon(
            Icons.track_changes_rounded,
            color: Colors.white,
            size: 36,
          ),
          SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment.start,
              children: [
                Text(
                  'Suas metas',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'Continue acompanhando sua evolução.',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMeta({
    required String titulo,
    required String progresso,
    required double percentual,
  }) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),
      child: Column(
        crossAxisAlignment:
            CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.track_changes_outlined,
                color: Color(0xFF00845F),
                size: 20,
              ),
              const SizedBox(width: 9),
              Expanded(
                child: Text(
                  titulo,
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              Text(
                progresso,
                style: const TextStyle(
                  color: Color(0xFF00845F),
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),

          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: LinearProgressIndicator(
              value: percentual,
              minHeight: 7,
              backgroundColor:
                  const Color(0xFFEAF5F1),
              valueColor:
                  const AlwaysStoppedAnimation<Color>(
                Color(0xFF00845F),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ==================================================================
// FEEDBACKS
// ==================================================================

class FeedbacksPage extends StatelessWidget {
  const FeedbacksPage({super.key});

  @override
  Widget build(BuildContext context) {
    return _TelaPerfilInterna(
      titulo: 'Feedbacks',
      child: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: const Color(0xFF00845F),
              borderRadius: BorderRadius.circular(18),
            ),
            child: const Row(
              children: [
                Icon(
                  Icons.star_rounded,
                  color: Colors.white,
                  size: 35,
                ),
                SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment:
                        CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Seus feedbacks',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 17,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        'Acompanhe as avaliações da equipe.',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          _buildFeedback(
            autor: 'Treinador',
            data: 'Hoje',
            texto:
                'Ótimo desempenho nos últimos treinos. Continue mantendo o foco e a disciplina.',
          ),

          _buildFeedback(
            autor: 'Preparador físico',
            data: 'Há 3 dias',
            texto:
                'Sua evolução física está sendo muito positiva. Continue seguindo o planejamento.',
          ),

          _buildFeedback(
            autor: 'Treinador',
            data: 'Há 1 semana',
            texto:
                'Boa participação nos treinos coletivos e excelente evolução técnica.',
          ),
        ],
      ),
    );
  }

  Widget _buildFeedback({
    required String autor,
    required String data,
    required String texto,
  }) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),
      child: Column(
        crossAxisAlignment:
            CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 38,
                height: 38,
                decoration: const BoxDecoration(
                  color: Color(0xFFEAF5F1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.person_rounded,
                  color: Color(0xFF00845F),
                  size: 21,
                ),
              ),

              const SizedBox(width: 10),

              Expanded(
                child: Column(
                  crossAxisAlignment:
                      CrossAxisAlignment.start,
                  children: [
                    Text(
                      autor,
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      data,
                      style: const TextStyle(
                        fontSize: 9,
                        color: Color(0xFF888888),
                      ),
                    ),
                  ],
                ),
              ),

              const Icon(
                Icons.star_rounded,
                color: Color(0xFFE86BA5),
                size: 21,
              ),
            ],
          ),

          const SizedBox(height: 12),

          Text(
            texto,
            style: const TextStyle(
              fontSize: 11,
              color: Color(0xFF666666),
              height: 1.45,
            ),
          ),
        ],
      ),
    );
  }
}

// ==================================================================
// CONTA
// ==================================================================

class ContaPage extends StatefulWidget {
  const ContaPage({super.key});

  @override
  State<ContaPage> createState() => _ContaPageState();
}

class _ContaPageState extends State<ContaPage> {
  final TextEditingController nomeController =
      TextEditingController(text: 'João Silva');

  final TextEditingController emailController =
      TextEditingController(text: 'joao@email.com');

  final TextEditingController telefoneController =
      TextEditingController(text: '(11) 99999-9999');

  @override
  void dispose() {
    nomeController.dispose();
    emailController.dispose();
    telefoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return _TelaPerfilInterna(
      titulo: 'Conta',
      child: Column(
        crossAxisAlignment:
            CrossAxisAlignment.start,
        children: [
          _buildTitulo(
            'Informações pessoais',
          ),

          const SizedBox(height: 12),

          _buildCampo(
            'Nome',
            nomeController,
          ),

          _buildCampo(
            'E-mail',
            emailController,
          ),

          _buildCampo(
            'Telefone',
            telefoneController,
          ),

          const SizedBox(height: 8),

          _buildBotaoSalvar(),
        ],
      ),
    );
  }

  Widget _buildTitulo(String texto) {
    return Text(
      texto,
      style: const TextStyle(
        fontSize: 15,
        fontWeight: FontWeight.bold,
      ),
    );
  }

  Widget _buildCampo(
    String titulo,
    TextEditingController controller,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: TextField(
        controller: controller,
        style: const TextStyle(
          fontSize: 13,
        ),
        decoration: InputDecoration(
          labelText: titulo,
          filled: true,
          fillColor: Colors.white,
          border: OutlineInputBorder(
            borderRadius:
                BorderRadius.circular(14),
            borderSide: BorderSide(
              color: Colors.grey.shade200,
            ),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius:
                BorderRadius.circular(14),
            borderSide: BorderSide(
              color: Colors.grey.shade200,
            ),
          ),
          focusedBorder:
              const OutlineInputBorder(
            borderRadius: BorderRadius.all(
              Radius.circular(14),
            ),
            borderSide: BorderSide(
              color: Color(0xFF00845F),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBotaoSalvar() {
    return SizedBox(
      width: double.infinity,
      height: 48,
      child: ElevatedButton(
        onPressed: () {
          ScaffoldMessenger.of(context)
              .showSnackBar(
            const SnackBar(
              content: Text(
                'Informações atualizadas!',
              ),
            ),
          );
        },
        style: ElevatedButton.styleFrom(
          backgroundColor:
              const Color(0xFF00845F),
          foregroundColor: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius:
                BorderRadius.circular(14),
          ),
        ),
        child: const Text(
          'SALVAR ALTERAÇÕES',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}

// ==================================================================
// PREFERÊNCIAS
// ==================================================================

class PreferenciasPage extends StatefulWidget {
  const PreferenciasPage({super.key});

  @override
  State<PreferenciasPage> createState() =>
      _PreferenciasPageState();
}

class _PreferenciasPageState
    extends State<PreferenciasPage> {
  bool notificacoes = true;
  bool lembretes = true;
  bool atualizacoes = true;

  @override
  Widget build(BuildContext context) {
    return _TelaPerfilInterna(
      titulo: 'Preferências',
      child: Column(
        children: [
          _buildSwitch(
            titulo: 'Notificações',
            subtitulo:
                'Receber notificações do aplicativo',
            valor: notificacoes,
            onChanged: (valor) {
              setState(() {
                notificacoes = valor;
              });
            },
          ),

          _buildSwitch(
            titulo: 'Lembretes de treino',
            subtitulo:
                'Receber lembretes dos próximos treinos',
            valor: lembretes,
            onChanged: (valor) {
              setState(() {
                lembretes = valor;
              });
            },
          ),

          _buildSwitch(
            titulo: 'Atualizações',
            subtitulo:
                'Receber novidades sobre o SATE',
            valor: atualizacoes,
            onChanged: (valor) {
              setState(() {
                atualizacoes = valor;
              });
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSwitch({
    required String titulo,
    required String subtitulo,
    required bool valor,
    required ValueChanged<bool> onChanged,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 46,
            height: 46,
            decoration: BoxDecoration(
              color: const Color(0xFFEAF5F1),
              borderRadius:
                  BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.settings_outlined,
              color: Color(0xFF00845F),
            ),
          ),

          const SizedBox(width: 12),

          Expanded(
            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment.start,
              children: [
                Text(
                  titulo,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  subtitulo,
                  style: const TextStyle(
                    fontSize: 10,
                    color: Color(0xFF777777),
                  ),
                ),
              ],
            ),
          ),

          Switch(
            value: valor,
            onChanged: onChanged,
            activeThumbColor:
                const Color(0xFF00845F),
          ),
        ],
      ),
    );
  }
}

// ==================================================================
// PRIVACIDADE
// ==================================================================

class PrivacidadePage extends StatefulWidget {
  const PrivacidadePage({super.key});

  @override
  State<PrivacidadePage> createState() =>
      _PrivacidadePageState();
}

class _PrivacidadePageState
    extends State<PrivacidadePage> {
  bool perfilPublico = true;
  bool mostrarEquipe = true;
  bool mostrarDesempenho = false;

  @override
  Widget build(BuildContext context) {
    return _TelaPerfilInterna(
      titulo: 'Privacidade',
      child: Column(
        children: [
          _buildOpcao(
            titulo: 'Perfil público',
            subtitulo:
                'Permitir que outros atletas visualizem seu perfil',
            valor: perfilPublico,
            onChanged: (valor) {
              setState(() {
                perfilPublico = valor;
              });
            },
          ),

          _buildOpcao(
            titulo: 'Mostrar equipe',
            subtitulo:
                'Exibir sua equipe no perfil',
            valor: mostrarEquipe,
            onChanged: (valor) {
              setState(() {
                mostrarEquipe = valor;
              });
            },
          ),

          _buildOpcao(
            titulo: 'Mostrar desempenho',
            subtitulo:
                'Permitir que seu desempenho seja visualizado',
            valor: mostrarDesempenho,
            onChanged: (valor) {
              setState(() {
                mostrarDesempenho = valor;
              });
            },
          ),
        ],
      ),
    );
  }

  Widget _buildOpcao({
    required String titulo,
    required String subtitulo,
    required bool valor,
    required ValueChanged<bool> onChanged,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),
      child: Row(
        children: [
          const Icon(
            Icons.lock_outline_rounded,
            color: Color(0xFF00845F),
            size: 25,
          ),

          const SizedBox(width: 12),

          Expanded(
            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment.start,
              children: [
                Text(
                  titulo,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  subtitulo,
                  style: const TextStyle(
                    fontSize: 10,
                    color: Color(0xFF777777),
                  ),
                ),
              ],
            ),
          ),

          Switch(
            value: valor,
            onChanged: onChanged,
            activeThumbColor:
                const Color(0xFF00845F),
          ),
        ],
      ),
    );
  }
}

// ==================================================================
// SEGURANÇA
// ==================================================================

class SegurancaPage extends StatelessWidget {
  const SegurancaPage({super.key});

  @override
  Widget build(BuildContext context) {
    return _TelaPerfilInterna(
      titulo: 'Segurança',
      child: Column(
        children: [
          _buildOpcao(
            icone: Icons.lock_reset_rounded,
            titulo: 'Alterar senha',
            subtitulo:
                'Atualize sua senha de acesso',
            onTap: () {
              _mostrarMensagem(
                context,
                'Alteração de senha',
              );
            },
          ),

          _buildOpcao(
            icone: Icons.devices_rounded,
            titulo: 'Dispositivos conectados',
            subtitulo:
                'Veja onde sua conta está conectada',
            onTap: () {
              _mostrarMensagem(
                context,
                'Dispositivos conectados',
              );
            },
          ),

          _buildOpcao(
            icone: Icons.verified_user_outlined,
            titulo: 'Verificação de segurança',
            subtitulo:
                'Confira a segurança da sua conta',
            onTap: () {
              _mostrarMensagem(
                context,
                'Verificação de segurança',
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildOpcao({
    required IconData icone,
    required String titulo,
    required String subtitulo,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),
      child: ListTile(
        onTap: onTap,
        contentPadding:
            const EdgeInsets.symmetric(
          horizontal: 14,
          vertical: 5,
        ),
        leading: Container(
          width: 46,
          height: 46,
          decoration: BoxDecoration(
            color: const Color(0xFFEAF5F1),
            borderRadius:
                BorderRadius.circular(12),
          ),
          child: Icon(
            icone,
            color: const Color(0xFF00845F),
          ),
        ),
        title: Text(
          titulo,
          style: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
          ),
        ),
        subtitle: Text(
          subtitulo,
          style: const TextStyle(
            fontSize: 10,
            color: Color(0xFF777777),
          ),
        ),
        trailing: const Icon(
          Icons.chevron_right_rounded,
          color: Colors.grey,
        ),
      ),
    );
  }

  void _mostrarMensagem(
    BuildContext context,
    String texto,
  ) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$texto selecionado.'),
      ),
    );
  }
}

// ==================================================================
// AJUDA E SUPORTE
// ==================================================================

class AjudaSuportePage extends StatelessWidget {
  const AjudaSuportePage({super.key});

  @override
  Widget build(BuildContext context) {
    return _TelaPerfilInterna(
      titulo: 'Ajuda e suporte',
      child: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: const Color(0xFF00845F),
              borderRadius:
                  BorderRadius.circular(18),
            ),
            child: const Column(
              crossAxisAlignment:
                  CrossAxisAlignment.start,
              children: [
                Icon(
                  Icons.help_outline_rounded,
                  color: Colors.white,
                  size: 34,
                ),
                SizedBox(height: 10),
                Text(
                  'Como podemos ajudar?',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'Encontre respostas para suas dúvidas sobre o SATE.',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          _buildPergunta(
            'Como visualizar meus treinos?',
          ),

          _buildPergunta(
            'Como acompanhar meu desempenho?',
          ),

          _buildPergunta(
            'Como editar meu perfil?',
          ),

          _buildPergunta(
            'Como alterar minhas preferências?',
          ),

          _buildPergunta(
            'Como entrar em contato com o suporte?',
          ),
        ],
      ),
    );
  }

  Widget _buildPergunta(String texto) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),
      child: ExpansionTile(
        tilePadding:
            const EdgeInsets.symmetric(
          horizontal: 14,
        ),
        childrenPadding:
            const EdgeInsets.fromLTRB(
          14,
          0,
          14,
          14,
        ),
        leading: const Icon(
          Icons.help_outline_rounded,
          color: Color(0xFF00845F),
        ),
        title: Text(
          texto,
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
          ),
        ),
        children: const [
          Text(
            'Aqui você encontrará informações e orientações '
            'sobre essa funcionalidade do aplicativo.',
            style: TextStyle(
              fontSize: 11,
              color: Color(0xFF777777),
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }
}

// ==================================================================
// SOBRE O SATE
// ==================================================================

class SobreSatePage extends StatelessWidget {
  const SobreSatePage({super.key});

  @override
  Widget build(BuildContext context) {
    return _TelaPerfilInterna(
      titulo: 'Sobre o SATE',
      child: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius:
                  BorderRadius.circular(18),
              border: Border.all(
                color: Colors.grey.shade200,
              ),
            ),
            child: Column(
              children: [
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: const Color(0xFFEAF5F1),
                    borderRadius:
                        BorderRadius.circular(20),
                  ),
                  child: const Icon(
                    Icons.sports_soccer_rounded,
                    color: Color(0xFF00845F),
                    size: 45,
                  ),
                ),

                const SizedBox(height: 16),

                const Text(
                  'SATE',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF006B4F),
                  ),
                ),

                const SizedBox(height: 5),

                Text(
                  'Sistema de Acompanhamento e Treinamento Esportivo',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 11,
                    color: Colors.grey.shade600,
                    height: 1.4,
                  ),
                ),

                const SizedBox(height: 18),

                Text(
                  'O SATE foi desenvolvido para auxiliar atletas '
                  'e equipes no acompanhamento de treinos, '
                  'desempenho, evolução e interação entre os membros.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 11,
                    color: Colors.grey.shade700,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          _buildInformacao(
            'Versão',
            '1.0.0',
          ),

          _buildInformacao(
            'Desenvolvido para',
            'Atletas e equipes esportivas',
          ),

          _buildInformacao(
            'Aplicativo',
            'SATE',
          ),
        ],
      ),
    );
  }

  Widget _buildInformacao(
    String titulo,
    String valor,
  ) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: Text(
              titulo,
              style: const TextStyle(
                fontSize: 12,
                color: Color(0xFF777777),
              ),
            ),
          ),
          Text(
            valor,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: Colors.black87,
            ),
          ),
        ],
      ),
    );
  }
}