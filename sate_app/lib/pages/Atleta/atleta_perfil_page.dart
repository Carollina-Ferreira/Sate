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
  static const Color cinza = Color(0xFF777777);

  // false = Conta
  // true = Perfil esportivo
  bool _visualizandoPerfil = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),

      body: SafeArea(
        child: _visualizandoPerfil ? _buildPerfilEsportivo() : _buildConta(),
      ),

      // ===========================================================
      // MENU INFERIOR
      // ===========================================================
      bottomNavigationBar: MenuInferiorAtleta(
        indiceSelecionado: 4,
        onItemSelecionado: (index) {
          if (index == 0) {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const AtletaHomePage()),
            );
            return;
          }

          if (index == 1) {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const AtletaTreinoPage()),
            );
            return;
          }

          if (index == 2) {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const AtletaDesempenhoPage()),
            );
            return;
          }

          if (index == 3) {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const AtletaFeedPage()),
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

  // =================================================================
  // TELA CONTA
  // =================================================================

  Widget _buildConta() {
    return Column(
      children: [
        // ===========================================================
        // CABEÇALHO VERDE
        // ===========================================================

        Container(
          width: double.infinity,
          height: 105,
          decoration: const BoxDecoration(
            color: verdeEscuro,
            borderRadius: BorderRadius.only(
              bottomLeft: Radius.circular(24),
              bottomRight: Radius.circular(24),
            ),
          ),
          padding: const EdgeInsets.fromLTRB(20, 18, 20, 0),
          child: Row(
            children: [
              // VOLTAR
              GestureDetector(
                onTap: () {
                  Navigator.pop(context);
                },
                child: const Icon(
                  Icons.arrow_back_rounded,
                  color: Colors.white,
                  size: 25,
                ),
              ),

              const SizedBox(width: 13),

              // TÍTULO
              const Expanded(
                child: Text(
                  'Conta',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 17,
                    fontStyle: FontStyle.italic,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),

              // NOTIFICAÇÕES
              GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const AtletaNotificacaoPage(),
                    ),
                  );
                },
                child: const Icon(
                  Icons.notifications_rounded,
                  color: Colors.white,
                  size: 21,
                ),
              ),
            ],
          ),
        ),

        // ===========================================================
        // CONTEÚDO BRANCO
        // ===========================================================
        Expanded(
          child: Transform.translate(
            offset: const Offset(0, -18),
            child: Container(
              width: double.infinity,
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(24),
                  topRight: Radius.circular(24),
                ),
              ),
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(20, 20, 20, 25),
                child: Column(
                  children: [
                    // =================================================
                    // USUÁRIO
                    // =================================================

                    Row(
                      children: [
                        // FOTO
                        Container(
                          width: 52,
                          height: 52,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: Colors.grey.shade200,
                            border: Border.all(color: verde, width: 1.5),
                          ),
                          child: const Icon(
                            Icons.person_rounded,
                            color: verde,
                            size: 30,
                          ),
                        ),

                        const SizedBox(width: 12),

                        // INFORMAÇÕES
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'João Silva',
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),

                              const SizedBox(height: 2),

                              const Text(
                                'Atleta',
                                style: TextStyle(
                                  fontSize: 9,
                                  color: cinza,
                                  fontStyle: FontStyle.italic,
                                ),
                              ),

                              const SizedBox(height: 2),

                              // VISUALIZAR PERFIL
                              GestureDetector(
                                onTap: () {
                                  setState(() {
                                    _visualizandoPerfil = true;
                                  });
                                },
                                child: const Text(
                                  'Visualizar perfil',
                                  style: TextStyle(
                                    fontSize: 9,
                                    color: verde,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 14),

                    const Divider(height: 1, color: Color(0xFFE1E1E1)),

                    // =================================================
                    // OPÇÕES
                    // =================================================
                    _buildOpcaoConta(
                      icone: Icons.person_rounded,
                      texto: 'Conta',
                      onTap: () {},
                    ),

                    _buildOpcaoConta(
                      icone: Icons.settings_rounded,
                      texto: 'Preferências',
                      onTap: () {},
                    ),

                    _buildOpcaoConta(
                      icone: Icons.lock_outline_rounded,
                      texto: 'Privacidade',
                      onTap: () {},
                    ),

                    _buildOpcaoConta(
                      icone: Icons.shield_rounded,
                      texto: 'Segurança',
                      onTap: () {},
                    ),

                    _buildOpcaoConta(
                      icone: Icons.help_outline_rounded,
                      texto: 'Ajuda e Suporte',
                      onTap: () {},
                    ),

                    _buildOpcaoConta(
                      icone: Icons.info_outline_rounded,
                      texto: 'Sobre o SATE',
                      onTap: () {},
                    ),

                    // =================================================
                    // ESPAÇO
                    // =================================================
                    const SizedBox(height: 57),

                    // =================================================
                    // SAIR DA CONTA
                    // =================================================
                    SizedBox(
                      width: double.infinity,
                      height: 42,
                      child: ElevatedButton(
                        onPressed: () {
                          _confirmarSaida(context);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFFF315D),
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                        ),
                        child: const Text(
                          'SAIR DA CONTA',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  // =================================================================
  // TELA PERFIL ESPORTIVO
  // =================================================================

  Widget _buildPerfilEsportivo() {
    return Column(
      children: [
        // ===========================================================
        // CABEÇALHO
        // ===========================================================

        Container(
          width: double.infinity,
          height: 105,
          decoration: const BoxDecoration(
            color: verdeEscuro,
            borderRadius: BorderRadius.only(
              bottomLeft: Radius.circular(24),
              bottomRight: Radius.circular(24),
            ),
          ),
          padding: const EdgeInsets.fromLTRB(20, 18, 20, 0),
          child: Row(
            children: [
              // VOLTAR PARA CONTA
              GestureDetector(
                onTap: () {
                  setState(() {
                    _visualizandoPerfil = false;
                  });
                },
                child: const Icon(
                  Icons.arrow_back_rounded,
                  color: Colors.white,
                  size: 25,
                ),
              ),

              const SizedBox(width: 13),

              // TÍTULO
              const Expanded(
                child: Text(
                  'Perfil',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 17,
                    fontStyle: FontStyle.italic,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),

              // NOTIFICAÇÕES
              GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const AtletaNotificacaoPage(),
                    ),
                  );
                },
                child: const Icon(
                  Icons.notifications_rounded,
                  color: Colors.white,
                  size: 21,
                ),
              ),
            ],
          ),
        ),

        // ===========================================================
        // CONTEÚDO
        // ===========================================================
        Expanded(
          child: Transform.translate(
            offset: const Offset(0, -18),
            child: Container(
              width: double.infinity,
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(24),
                  topRight: Radius.circular(24),
                ),
              ),
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(20, 20, 20, 30),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // =================================================
                    // FOTO DO ATLETA
                    // =================================================

                    Center(
                      child: Container(
                        width: 65,
                        height: 65,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.grey.shade200,
                          border: Border.all(color: verde, width: 2),
                        ),
                        child: const Icon(
                          Icons.person_rounded,
                          color: verde,
                          size: 38,
                        ),
                      ),
                    ),

                    const SizedBox(height: 10),

                    // =================================================
                    // NOME
                    // =================================================
                    const Text(
                      'João Silva',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 3),

                    const Text(
                      'Falcões FC - Futebol',
                      style: TextStyle(
                        fontSize: 10,
                        color: cinza,
                        fontStyle: FontStyle.italic,
                      ),
                    ),

                    const SizedBox(height: 8),

                    const Text(
                      'Meio-campista, apaixonado por futebol desde os 8 anos.\n'
                      'Foco em evoluir a cada treino.',
                      style: TextStyle(
                        fontSize: 10,
                        height: 1.35,
                        color: Colors.black87,
                      ),
                    ),

                    const SizedBox(height: 12),

                    // =================================================
                    // ESTATÍSTICAS
                    // =================================================
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
                            destaque: true,
                          ),
                        ),

                        const SizedBox(width: 8),

                        Expanded(
                          child: _buildEstatistica(
                            titulo: 'Publicações',
                            valor: '3',
                            destaqueRosa: true,
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 9),

                    const Text(
                      'Frequência: 92% • Treinos concluídos: 18',
                      style: TextStyle(
                        fontSize: 9,
                        color: cinza,
                        fontStyle: FontStyle.italic,
                      ),
                    ),

                    const SizedBox(height: 16),

                    // =================================================
                    // PERFIL ESPORTIVO
                    // =================================================
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: verde,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 30,
                            height: 30,
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.18),
                              borderRadius: BorderRadius.circular(7),
                            ),
                            child: const Icon(
                              Icons.trending_up_rounded,
                              color: Colors.white,
                              size: 20,
                            ),
                          ),

                          const SizedBox(width: 10),

                          const Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Perfil Esportivo',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),

                              SizedBox(height: 2),

                              Text(
                                'Desempenho, evolução, metas,\n'
                                'feedbacks e histórico',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 7,
                                  height: 1.15,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 22),

                    // =================================================
                    // PUBLICAÇÕES
                    // =================================================
                    const Text(
                      'Publicações',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        fontStyle: FontStyle.italic,
                      ),
                    ),

                    const SizedBox(height: 12),

                    Row(
                      children: [
                        Expanded(child: _buildPublicacao()),

                        const SizedBox(width: 10),

                        Expanded(child: _buildPublicacao()),

                        const SizedBox(width: 10),

                        Expanded(child: _buildPublicacao()),
                      ],
                    ),

                    const SizedBox(height: 22),

                    // =================================================
                    // OPÇÕES
                    // =================================================
                    _buildOpcaoPerfil(
                      icone: Icons.groups_rounded,
                      texto: 'Minha equipe',
                    ),

                    _buildOpcaoPerfil(
                      icone: Icons.track_changes_rounded,
                      texto: 'Minhas metas',
                    ),

                    _buildOpcaoPerfil(
                      icone: Icons.star_rounded,
                      texto: 'Feedbacks',
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  // =================================================================
  // ITEM DA TELA CONTA
  // =================================================================

  Widget _buildOpcaoConta({
    required IconData icone,
    required String texto,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Container(
        height: 38,
        decoration: const BoxDecoration(
          border: Border(
            bottom: BorderSide(color: Color(0xFFE1E1E1), width: 0.8),
          ),
        ),
        child: Row(
          children: [
            Icon(icone, size: 17, color: Colors.grey.shade600),

            const SizedBox(width: 11),

            Text(
              texto,
              style: const TextStyle(
                fontSize: 10,
                fontStyle: FontStyle.italic,
                color: Colors.black87,
              ),
            ),

            const Spacer(),

            Icon(
              Icons.chevron_right_rounded,
              size: 18,
              color: Colors.grey.shade600,
            ),
          ],
        ),
      ),
    );
  }

  // =================================================================
  // ESTATÍSTICA DO PERFIL
  // =================================================================

  Widget _buildEstatistica({
    required String titulo,
    required String valor,
    bool destaque = false,
    bool destaqueRosa = false,
  }) {
    return Container(
      height: 49,
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: const Color(0xFFF3F3F3),
        borderRadius: BorderRadius.circular(7),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(titulo, style: const TextStyle(fontSize: 8, color: cinza)),

          const SizedBox(height: 4),

          Text(
            valor,
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w600,
              color: destaque
                  ? Colors.blue
                  : destaqueRosa
                  ? Colors.pinkAccent
                  : Colors.black87,
            ),
          ),
        ],
      ),
    );
  }

  // =================================================================
  // PUBLICAÇÃO
  // =================================================================

  Widget _buildPublicacao() {
    return Container(
      height: 72,
      decoration: BoxDecoration(
        color: Colors.grey.shade200,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Icon(Icons.image_outlined, color: Colors.grey.shade400, size: 22),
    );
  }

  // =================================================================
  // OPÇÃO DO PERFIL
  // =================================================================

  Widget _buildOpcaoPerfil({required IconData icone, required String texto}) {
    return Container(
      height: 36,
      decoration: const BoxDecoration(
        border: Border(
          bottom: BorderSide(color: Color(0xFFE1E1E1), width: 0.8),
        ),
      ),
      child: Row(
        children: [
          Icon(icone, size: 16, color: Colors.grey.shade600),

          const SizedBox(width: 10),

          Text(
            texto,
            style: const TextStyle(fontSize: 10, fontStyle: FontStyle.italic),
          ),

          const Spacer(),

          Icon(
            Icons.chevron_right_rounded,
            size: 18,
            color: Colors.grey.shade600,
          ),
        ],
      ),
    );
  }

  // =================================================================
  // CONFIRMAR SAÍDA
  // =================================================================

  void _confirmarSaida(BuildContext context) {
    showDialog(
      context: context,
      builder: (dialogContext) {
        return AlertDialog(
          title: const Text('Sair da conta?'),
          content: const Text(
            'Você precisará entrar novamente para acessar sua conta.',
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(dialogContext);
              },
              child: const Text(
                'CANCELAR',
                style: TextStyle(color: Colors.grey),
              ),
            ),

            TextButton(
              onPressed: () {
                Navigator.pop(dialogContext);
              },
              child: const Text(
                'SAIR',
                style: TextStyle(color: Colors.redAccent),
              ),
            ),
          ],
        );
      },
    );
  }
}
