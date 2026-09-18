import 'package:SATE/pages/Treinador/perfil_page.dart';
import 'package:flutter/material.dart';
import '../pages/login_page.dart';
import '../pages/Treinador/perfil_page.dart';

class CabecalhoTreinador extends StatefulWidget {
  final String titulo;
  final String? subtitulo;
  final bool mostrarLogo;
  final VoidCallback? onNotificacoes;
  final VoidCallback? onPerfil;
 
  const CabecalhoTreinador({
    super.key,
    required this.titulo,
    this.subtitulo,
    this.mostrarLogo = true,
    this.onNotificacoes,
    this.onPerfil,
  });

  @override
  State<CabecalhoTreinador> createState() =>
      _CabecalhoTreinadorState();
}

class _CabecalhoTreinadorState
    extends State<CabecalhoTreinador> {
  static const Color verde = Color(0xFF006B4F);

  final List<Map<String, dynamic>> notificacoes = [
    {
      'titulo': 'Novo atleta cadastrado',
      'descricao': 'Um novo atleta foi adicionado à equipe.',
      'tempo': 'Há 5 minutos',
      'lida': false,
    },
    {
      'titulo': 'Treino agendado',
      'descricao': 'Você possui um treino marcado para hoje.',
      'tempo': 'Há 30 minutos',
      'lida': false,
    },
    {
      'titulo': 'Relatório disponível',
      'descricao': 'O relatório semanal da equipe está pronto.',
      'tempo': 'Ontem',
      'lida': true,
    },
  ];

  int get notificacoesNaoLidas {
    return notificacoes
        .where((notificacao) => notificacao['lida'] == false)
        .length;
  }

  // ============================================================
  // NOTIFICAÇÕES
  // ============================================================

  void _abrirNotificacoes() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Container(
              height:
                  MediaQuery.of(context).size.height * 0.65,
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(
                  top: Radius.circular(28),
                ),
              ),
              child: Column(
                children: [
                  const SizedBox(height: 12),

                  Container(
                    width: 45,
                    height: 5,
                    decoration: BoxDecoration(
                      color: Colors.grey.shade300,
                      borderRadius:
                          BorderRadius.circular(20),
                    ),
                  ),

                  Padding(
                    padding: const EdgeInsets.fromLTRB(
                      24,
                      22,
                      18,
                      16,
                    ),
                    child: Row(
                      mainAxisAlignment:
                          MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Notificações',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF12261F),
                          ),
                        ),

                        TextButton(
                          onPressed: () {
                            setModalState(() {
                              for (final notificacao
                                  in notificacoes) {
                                notificacao['lida'] = true;
                              }
                            });

                            setState(() {});
                          },
                          child: const Text(
                            'Marcar todas',
                            style: TextStyle(
                              color: verde,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  Expanded(
                    child: notificacoes.isEmpty
                        ? const Center(
                            child: Column(
                              mainAxisAlignment:
                                  MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons
                                      .notifications_none_rounded,
                                  size: 65,
                                  color: Colors.grey,
                                ),
                                SizedBox(height: 14),
                                Text(
                                  'Nenhuma notificação',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight:
                                        FontWeight.bold,
                                  ),
                                ),
                                SizedBox(height: 6),
                                Text(
                                  'Você está em dia!',
                                  style: TextStyle(
                                    color: Colors.grey,
                                  ),
                                ),
                              ],
                            ),
                          )
                        : ListView.builder(
                            padding:
                                const EdgeInsets.symmetric(
                              horizontal: 20,
                            ),
                            itemCount:
                                notificacoes.length,
                            itemBuilder:
                                (context, index) {
                              final notificacao =
                                  notificacoes[index];

                              final bool lida =
                                  notificacao['lida'] == true;

                              return Dismissible(
                                key: ValueKey(notificacao),
                                direction:
                                    DismissDirection
                                        .endToStart,

                                background: Container(
                                  margin:
                                      const EdgeInsets.only(
                                    bottom: 10,
                                  ),
                                  padding:
                                      const EdgeInsets.only(
                                    right: 20,
                                  ),
                                  alignment:
                                      Alignment.centerRight,
                                  decoration: BoxDecoration(
                                    color: Colors.red,
                                    borderRadius:
                                        BorderRadius.circular(
                                      16,
                                    ),
                                  ),
                                  child: const Icon(
                                    Icons.delete_outline,
                                    color: Colors.white,
                                  ),
                                ),

                                onDismissed: (direction) {
                                  setModalState(() {
                                    notificacoes
                                        .removeAt(index);
                                  });

                                  setState(() {});
                                },

                                child: GestureDetector(
                                  onTap: () {
                                    setModalState(() {
                                      notificacao['lida'] =
                                          true;
                                    });

                                    setState(() {});
                                  },

                                  child: Container(
                                    margin:
                                        const EdgeInsets.only(
                                      bottom: 10,
                                    ),
                                    padding:
                                        const EdgeInsets.all(
                                      15,
                                    ),
                                    decoration: BoxDecoration(
                                      color: lida
                                          ? Colors.white
                                          : const Color(
                                              0xFFE8F5F0,
                                            ),
                                      borderRadius:
                                          BorderRadius.circular(
                                        16,
                                      ),
                                      border: Border.all(
                                        color: lida
                                            ? const Color(
                                                0xFFE5E5E5,
                                              )
                                            : verde.withOpacity(
                                                0.25,
                                              ),
                                      ),
                                    ),

                                    child: Row(
                                      crossAxisAlignment:
                                          CrossAxisAlignment
                                              .start,
                                      children: [
                                        Container(
                                          width: 42,
                                          height: 42,
                                          decoration:
                                              BoxDecoration(
                                            color: lida
                                                ? Colors.grey
                                                    .shade200
                                                : verde,
                                            shape:
                                                BoxShape.circle,
                                          ),
                                          child: Icon(
                                            Icons
                                                .notifications_none,
                                            color: lida
                                                ? Colors.grey
                                                : Colors.white,
                                          ),
                                        ),

                                        const SizedBox(
                                          width: 12,
                                        ),

                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment
                                                    .start,
                                            children: [
                                              Text(
                                                notificacao[
                                                    'titulo'],
                                                style:
                                                    TextStyle(
                                                  fontWeight:
                                                      lida
                                                          ? FontWeight
                                                              .w500
                                                          : FontWeight
                                                              .bold,
                                                  fontSize: 14,
                                                ),
                                              ),

                                              const SizedBox(
                                                height: 5,
                                              ),

                                              Text(
                                                notificacao[
                                                    'descricao'],
                                                style:
                                                    const TextStyle(
                                                  color:
                                                      Colors.grey,
                                                  fontSize: 12.5,
                                                ),
                                              ),

                                              const SizedBox(
                                                height: 6,
                                              ),

                                              Text(
                                                notificacao[
                                                    'tempo'],
                                                style:
                                                    const TextStyle(
                                                  color:
                                                      Colors.grey,
                                                  fontSize: 11,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),

                                        if (!lida)
                                          Container(
                                            width: 9,
                                            height: 9,
                                            decoration:
                                                const BoxDecoration(
                                              color: verde,
                                              shape:
                                                  BoxShape.circle,
                                            ),
                                          ),
                                      ],
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  // ============================================================
  // PERFIL
  // ============================================================

  void _abrirPerfil() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) {
        return SafeArea(
          top: false,
          child: Container(
            constraints: BoxConstraints(
              maxHeight:
                  MediaQuery.of(context).size.height * 0.85,
            ),
            padding: const EdgeInsets.fromLTRB(
              24,
              14,
              24,
              20,
            ),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(
                top: Radius.circular(28),
              ),
            ),
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 45,
                    height: 5,
                    decoration: BoxDecoration(
                      color: Colors.grey.shade300,
                      borderRadius:
                          BorderRadius.circular(20),
                    ),
                  ),

                  const SizedBox(height: 18),

                  const CircleAvatar(
                    radius: 34,
                    backgroundColor: verde,
                    child: Icon(
                      Icons.person_rounded,
                      color: Colors.white,
                      size: 38,
                    ),
                  ),

                  const SizedBox(height: 10),

                  const Text(
                    'Professor Marcos',
                    style: TextStyle(
                      fontSize: 19,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF12261F),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // ==================================================
                  // PERFIL
                  // ==================================================

                  _opcaoPerfil(
                    icone:
                        Icons.person_outline_rounded,
                    titulo: 'Perfil',
                    onTap: () {
                      Navigator.pop(context);

                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              const PerfilPage(),
                        ),
                      );
                    },
                  ),

                  // ==================================================
                  // CONFIGURAÇÕES
                  // ==================================================

                  _opcaoPerfil(
                    icone:
                        Icons.settings_outlined,
                    titulo: 'Configurações',
                    onTap: () {
                      Navigator.pop(context);
                      // Navegação para configurações.
                    },
                  ),

                  // ==================================================
                  // SOBRE
                  // ==================================================

                  _opcaoPerfil(
                    icone:
                        Icons.info_outline_rounded,
                    titulo: 'Sobre',
                    onTap: () {
                      Navigator.pop(context);
                      // Navegação para a página Sobre.
                    },
                  ),

                  const Divider(height: 12),

                  // ==================================================
                  // SAIR
                  // ==================================================

                  _opcaoPerfil(
                    icone: Icons.logout_rounded,
                    titulo: 'Sair',
                    cor: Colors.red,
                    onTap: () {
                      Navigator.pop(context);

                      Navigator.pushAndRemoveUntil(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              const LoginPage(),
                        ),
                        (route) => false,
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  // ============================================================
  // OPÇÕES DO PERFIL
  // ============================================================

  Widget _opcaoPerfil({
    required IconData icone,
    required String titulo,
    required VoidCallback onTap,
    Color cor = verde,
  }) {
    return ListTile(
      onTap: onTap,
      contentPadding: EdgeInsets.zero,

      leading: Container(
        width: 42,
        height: 42,
        decoration: BoxDecoration(
          color: cor.withOpacity(0.10),
          borderRadius:
              BorderRadius.circular(13),
        ),
        child: Icon(
          icone,
          color: cor,
        ),
      ),

      title: Text(
        titulo,
        style: TextStyle(
          fontSize: 15,
          fontWeight: FontWeight.w600,
          color: titulo == 'Sair'
              ? Colors.red
              : const Color(0xFF12261F),
        ),
      ),

      trailing: const Icon(
        Icons.chevron_right_rounded,
        color: Colors.grey,
      ),
    );
  }

  // ============================================================
  // CABEÇALHO
  // ============================================================

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,

      padding: const EdgeInsets.fromLTRB(
        20,
        6,
        20,
        10,
      ),

      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF007A5B),
            Color(0xFF006B4F),
            Color(0xFF005640),
          ],
        ),
      ),

      child: SafeArea(
        bottom: false,

        child: Row(
          children: [
            if (widget.mostrarLogo) ...[
              Image.asset(
                'assets/images/logo_img.png',
                width: 45,
                height: 30,
                fit: BoxFit.contain,
              ),

              const SizedBox(width: 12),
            ],

            Expanded(
              child: Column(
                crossAxisAlignment:
                    CrossAxisAlignment.start,
                children: [
                  if (widget.subtitulo != null) ...[
                    Text(
                      widget.subtitulo!,
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 12,
                      ),
                    ),

                    const SizedBox(height: 2),
                  ],

                  Text(
                    widget.titulo,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 17,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ),

            // ==================================================
            // NOTIFICAÇÕES
            // ==================================================

            Stack(
              children: [
                IconButton(
                  onPressed:
                      widget.onNotificacoes ??
                          _abrirNotificacoes,
                  icon: const Icon(
                    Icons.notifications_none_rounded,
                    color: Colors.white,
                    size: 25,
                  ),
                ),

                if (notificacoesNaoLidas > 0)
                  Positioned(
                    right: 7,
                    top: 5,
                    child: Container(
                      padding:
                          const EdgeInsets.all(3),

                      decoration:
                          const BoxDecoration(
                        color: Colors.red,
                        shape: BoxShape.circle,
                      ),

                      constraints:
                          const BoxConstraints(
                        minWidth: 16,
                        minHeight: 16,
                      ),

                      child: Text(
                        '$notificacoesNaoLidas',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 9,
                          fontWeight:
                              FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
              ],
            ),

            const SizedBox(width: 2),

            // ==================================================
            // PERFIL
            // ==================================================

            GestureDetector(
              onTap:
                  widget.onPerfil ?? _abrirPerfil,

              child: Container(
                width: 40,
                height: 40,

                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: Colors.white,
                    width: 2,
                  ),
                ),

                child: ClipOval(
                  child: Image.asset(
                    'assets/images/perfil_treinador.png',
                    fit: BoxFit.cover,

                    errorBuilder: (
                      context,
                      error,
                      stackTrace,
                    ) {
                      return Container(
                        color: Colors.white,
                        child: const Icon(
                          Icons.person_rounded,
                          color: verde,
                          size: 23,
                        ),
                      );
                    },
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}