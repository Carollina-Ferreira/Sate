import 'package:flutter/material.dart';

class FeedPage extends StatefulWidget {
  const FeedPage({super.key});

  @override
  State<FeedPage> createState() => _FeedPageState();
}

class _FeedPageState extends State<FeedPage> {
  static const Color verde = Color(0xFF00845F);
  static const Color verdeEscuro = Color(0xFF006B4F);
  static const Color rosa = Color(0xFFE86BA5);
  static const Color fundo = Color(0xFFF7F7F7);

  int filtroSelecionado = 0;

  final List<String> filtros = [
    'Todos',
    'Equipe',
    'Seguindo',
  ];

  final List<Map<String, dynamic>> publicacoes = [
    {
      'nome': 'João Silva',
      'tempo': 'há 2 horas',
      'texto':
          'Treino concluído com sucesso!\nFoco e disciplina sempre!!',
      'curtidas': 45,
      'comentarios': [
        {
          'nome': 'Ana Costa',
          'texto': 'Muito bom! Parabéns pelo treino!',
        },
        {
          'nome': 'Carlos Mendes',
          'texto': 'É isso aí! Foco sempre.',
        },
      ],
      'curtido': true,
      'treino': null,
    },
    {
      'nome': 'Ana Costa',
      'tempo': 'há 4 horas',
      'texto':
          'Treino coletivo foi demais hoje!!\nSeguimos evoluindo.',
      'curtidas': 65,
      'comentarios': [
        {
          'nome': 'João Silva',
          'texto': 'Treino muito bom hoje!',
        },
      ],
      'curtido': false,
      'treino': null,
    },
    {
      'nome': 'Carlos Mendes',
      'tempo': 'ontem',
      'texto':
          'Mais um treino finalizado. Evolução é construída todos os dias!',
      'curtidas': 38,
      'comentarios': [],
      'curtido': false,
      'treino': null,
    },
    {
      'nome': 'Mariana Souza',
      'tempo': 'ontem',
      'texto':
          'Muito bom poder acompanhar a evolução da equipe.',
      'curtidas': 51,
      'comentarios': [],
      'curtido': false,
      'treino': null,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: fundo,

      appBar: AppBar(
        backgroundColor: fundo,
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

        title: const Text(
          'Feed',
          style: TextStyle(
            color: Colors.black87,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      body: SafeArea(
        child: Column(
          children: [
            _buildFiltros(),

            const SizedBox(height: 8),

            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.fromLTRB(
                  16,
                  8,
                  16,
                  90,
                ),
                itemCount: publicacoes.length,
                itemBuilder: (context, index) {
                  return Padding(
                    padding: const EdgeInsets.only(
                      bottom: 16,
                    ),
                    child: _buildPublicacao(
                      publicacoes[index],
                      index,
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),

      floatingActionButton: FloatingActionButton(
        onPressed: _abrirNovaPublicacao,
        backgroundColor: rosa,
        elevation: 3,
        child: const Icon(
          Icons.add_rounded,
          color: Colors.white,
          size: 29,
        ),
      ),
    );
  }

  Widget _buildFiltros() {
    return Container(
      margin: const EdgeInsets.symmetric(
        horizontal: 16,
      ),
      height: 42,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
      ),
      child: Row(
        children: List.generate(
          filtros.length,
          (index) {
            final bool selecionado =
                filtroSelecionado == index;

            return Expanded(
              child: GestureDetector(
                onTap: () {
                  setState(() {
                    filtroSelecionado = index;
                  });
                },
                child: Container(
                  margin: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: selecionado
                        ? verde
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(19),
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    filtros[index],
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: selecionado
                          ? FontWeight.w600
                          : FontWeight.w400,
                      color: selecionado
                          ? Colors.white
                          : Colors.grey.shade700,
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildPublicacao(
    Map<String, dynamic> publicacao,
    int index,
  ) {
    final bool curtido =
        publicacao['curtido'] as bool;

    final List comentarios =
        publicacao['comentarios'] as List;

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(17),
        border: Border.all(
          color: Colors.grey.shade200,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(
              alpha: 0.025,
            ),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(
          14,
          14,
          14,
          10,
        ),
        child: Column(
          crossAxisAlignment:
              CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                _buildAvatar(
                  index,
                ),

                const SizedBox(width: 10),

                Expanded(
                  child: Column(
                    crossAxisAlignment:
                        CrossAxisAlignment.start,
                    children: [
                      Text(
                        publicacao['nome'],
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                      ),

                      const SizedBox(height: 2),

                      Text(
                        publicacao['tempo'],
                        style: TextStyle(
                          fontSize: 10,
                          color: Colors.grey.shade600,
                        ),
                      ),
                    ],
                  ),
                ),

                IconButton(
                  onPressed: () {
                    _mostrarOpcoesPublicacao(
                      index,
                    );
                  },
                  constraints:
                      const BoxConstraints(),
                  padding:
                      const EdgeInsets.all(5),
                  icon: Icon(
                    Icons.more_horiz_rounded,
                    color: Colors.grey.shade600,
                    size: 21,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 10),

            Text(
              publicacao['texto'],
              style: const TextStyle(
                fontSize: 12,
                color: Colors.black87,
                height: 1.35,
              ),
            ),

            if (publicacao['treino'] != null) ...[
              const SizedBox(height: 10),

              Container(
                padding:
                    const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 7,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFFEAF5F1),
                  borderRadius:
                      BorderRadius.circular(10),
                ),
                child: Row(
                  mainAxisSize:
                      MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.fitness_center_rounded,
                      size: 16,
                      color: verdeEscuro,
                    ),

                    const SizedBox(width: 6),

                    Text(
                      publicacao['treino'],
                      style: const TextStyle(
                        fontSize: 10,
                        fontWeight:
                            FontWeight.w600,
                        color: verdeEscuro,
                      ),
                    ),
                  ],
                ),
              ),
            ],

            const SizedBox(height: 12),

            _buildImagemPublicacao(),

            const SizedBox(height: 9),

            Row(
              children: [
                GestureDetector(
                  onTap: () {
                    setState(() {
                      publicacao['curtido'] =
                          !curtido;

                      if (publicacao['curtido']) {
                        publicacao['curtidas']++;
                      } else {
                        publicacao['curtidas']--;
                      }
                    });
                  },
                  child: Row(
                    children: [
                      Icon(
                        publicacao['curtido']
                            ? Icons.favorite_rounded
                            : Icons.favorite_border_rounded,
                        size: 18,
                        color: publicacao['curtido']
                            ? Colors.red.shade600
                            : Colors.grey.shade600,
                      ),

                      const SizedBox(width: 5),

                      Text(
                        '${publicacao['curtidas']}',
                        style: TextStyle(
                          fontSize: 10,
                          color:
                              Colors.grey.shade700,
                        ),
                      ),
                    ],
                  ),
                ),

                const Spacer(),

                GestureDetector(
                  onTap: () {
                    _abrirComentarios(
                      publicacao,
                    );
                  },
                  child: Row(
                    children: [
                      Icon(
                        Icons
                            .chat_bubble_outline_rounded,
                        size: 17,
                        color:
                            Colors.grey.shade600,
                      ),

                      const SizedBox(width: 5),

                      Text(
                        '${comentarios.length} comentários',
                        style: TextStyle(
                          fontSize: 10,
                          color:
                              Colors.grey.shade700,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAvatar(int index) {
    final List<Color> fundos = [
      const Color(0xFFE5EEF7),
      const Color(0xFFF4E7DD),
      const Color(0xFFE5F1E9),
      const Color(0xFFF2E5F0),
    ];

    return Container(
      width: 39,
      height: 39,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: fundos[index % fundos.length],
      ),
      child: const Icon(
        Icons.person_rounded,
        color: verde,
        size: 22,
      ),
    );
  }

  Widget _buildImagemPublicacao() {
    return Container(
      width: double.infinity,
      height: 175,
      decoration: BoxDecoration(
        color: Colors.grey.shade200,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.image_outlined,
              size: 35,
              color: Colors.grey.shade400,
            ),

            const SizedBox(height: 5),

            Text(
              'Imagem da publicação',
              style: TextStyle(
                fontSize: 10,
                color: Colors.grey.shade500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _abrirNovaPublicacao() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) =>
            const NovaPublicacaoPage(),
      ),
    );
  }

  void _abrirComentarios(
    Map<String, dynamic> publicacao,
  ) {
    final TextEditingController
        comentarioController =
        TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape:
          const RoundedRectangleBorder(
        borderRadius:
            BorderRadius.vertical(
          top: Radius.circular(22),
        ),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder:
              (context, setModalState) {
            final List comentarios =
                publicacao['comentarios']
                    as List;

            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context)
                    .viewInsets
                    .bottom,
              ),
              child: SizedBox(
                height:
                    MediaQuery.of(context)
                            .size
                            .height *
                        0.65,
                child: Column(
                  children: [
                    const SizedBox(height: 10),

                    Container(
                      width: 40,
                      height: 4,
                      decoration:
                          BoxDecoration(
                        color:
                            Colors.grey.shade300,
                        borderRadius:
                            BorderRadius
                                .circular(4),
                      ),
                    ),

                    const SizedBox(height: 14),

                    const Text(
                      'Comentários',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight:
                            FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 12),

                    const Divider(height: 1),

                    Expanded(
                      child: comentarios.isEmpty
                          ? Center(
                              child: Text(
                                'Nenhum comentário ainda.',
                                style:
                                    TextStyle(
                                  fontSize: 12,
                                  color: Colors
                                      .grey
                                      .shade600,
                                ),
                              ),
                            )
                          : ListView.builder(
                              padding:
                                  const EdgeInsets
                                      .all(16),
                              itemCount:
                                  comentarios
                                      .length,
                              itemBuilder:
                                  (context,
                                      index) {
                                final comentario =
                                    comentarios[
                                        index];

                                return Padding(
                                  padding:
                                      const EdgeInsets
                                          .only(
                                    bottom: 12,
                                  ),
                                  child: Row(
                                    crossAxisAlignment:
                                        CrossAxisAlignment
                                            .start,
                                    children: [
                                      Container(
                                        width: 36,
                                        height: 36,
                                        decoration:
                                            const BoxDecoration(
                                          color: Color(
                                            0xFFE5F1E9,
                                          ),
                                          shape: BoxShape
                                              .circle,
                                        ),
                                        child:
                                            const Icon(
                                          Icons
                                              .person_rounded,
                                          color:
                                              verdeEscuro,
                                          size: 20,
                                        ),
                                      ),

                                      const SizedBox(
                                          width: 9),

                                      Expanded(
                                        child:
                                            Container(
                                          padding:
                                              const EdgeInsets
                                                  .all(
                                            11,
                                          ),
                                          decoration:
                                              BoxDecoration(
                                            color: Colors
                                                .grey
                                                .shade100,
                                            borderRadius:
                                                BorderRadius
                                                    .circular(
                                              12,
                                            ),
                                          ),
                                          child:
                                              Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment
                                                    .start,
                                            children: [
                                              Text(
                                                comentario[
                                                    'nome'],
                                                style:
                                                    const TextStyle(
                                                  fontSize:
                                                      12,
                                                  fontWeight:
                                                      FontWeight.bold,
                                                ),
                                              ),

                                              const SizedBox(
                                                  height:
                                                      4),

                                              Text(
                                                comentario[
                                                    'texto'],
                                                style:
                                                    const TextStyle(
                                                  fontSize:
                                                      12,
                                                  color:
                                                      Colors.black87,
                                                  height:
                                                      1.3,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                );
                              },
                            ),
                    ),

                    Container(
                      padding:
                          const EdgeInsets.fromLTRB(
                        14,
                        10,
                        14,
                        12,
                      ),
                      decoration:
                          BoxDecoration(
                        color: Colors.white,
                        border: Border(
                          top: BorderSide(
                            color: Colors
                                .grey
                                .shade200,
                          ),
                        ),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller:
                                  comentarioController,
                              textInputAction:
                                  TextInputAction
                                      .send,
                              onSubmitted: (_) {
                                _adicionarComentario(
                                  publicacao,
                                  comentarioController,
                                  setModalState,
                                );
                              },
                              decoration:
                                  InputDecoration(
                                hintText:
                                    'Escreva um comentário...',
                                hintStyle:
                                    TextStyle(
                                  fontSize: 12,
                                  color: Colors
                                      .grey
                                      .shade500,
                                ),
                                filled: true,
                                fillColor: Colors
                                    .grey
                                    .shade100,
                                contentPadding:
                                    const EdgeInsets
                                        .symmetric(
                                  horizontal: 14,
                                  vertical: 10,
                                ),
                                border:
                                    OutlineInputBorder(
                                  borderRadius:
                                      BorderRadius
                                          .circular(
                                    22,
                                  ),
                                  borderSide:
                                      BorderSide.none,
                                ),
                              ),
                            ),
                          ),

                          const SizedBox(width: 8),

                          GestureDetector(
                            onTap: () {
                              _adicionarComentario(
                                publicacao,
                                comentarioController,
                                setModalState,
                              );
                            },
                            child: Container(
                              width: 42,
                              height: 42,
                              decoration:
                                  const BoxDecoration(
                                color: verde,
                                shape: BoxShape
                                    .circle,
                              ),
                              child: const Icon(
                                Icons.send_rounded,
                                color: Colors.white,
                                size: 18,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    ).whenComplete(() {
      comentarioController.dispose();
      setState(() {});
    });
  }

  void _adicionarComentario(
    Map<String, dynamic> publicacao,
    TextEditingController controller,
    StateSetter setModalState,
  ) {
    final String texto =
        controller.text.trim();

    if (texto.isEmpty) {
      return;
    }

    final List comentarios =
        publicacao['comentarios'] as List;

    comentarios.add({
      'nome': 'Você',
      'texto': texto,
    });

    controller.clear();

    setModalState(() {});

    setState(() {});
  }

  void _mostrarOpcoesPublicacao(
    int index,
  ) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape:
          const RoundedRectangleBorder(
        borderRadius:
            BorderRadius.vertical(
          top: Radius.circular(22),
        ),
      ),
      builder: (context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: const Icon(
                  Icons.share_outlined,
                ),
                title: const Text(
                  'Compartilhar',
                ),
                onTap: () {
                  Navigator.pop(context);
                },
              ),

              ListTile(
                leading: const Icon(
                  Icons.flag_outlined,
                ),
                title: const Text(
                  'Denunciar publicação',
                ),
                onTap: () {
                  Navigator.pop(context);
                },
              ),

              const SizedBox(height: 8),
            ],
          ),
        );
      },
    );
  }
}

class NovaPublicacaoPage
    extends StatefulWidget {
  const NovaPublicacaoPage({super.key});

  @override
  State<NovaPublicacaoPage> createState() =>
      _NovaPublicacaoPageState();
}

class _NovaPublicacaoPageState
    extends State<NovaPublicacaoPage> {
  static const Color verde =
      Color(0xFF00845F);

  final TextEditingController
      legendaController =
      TextEditingController();

  String? treinoSelecionado;

  final List<String> treinos = [
    'Treino de velocidade',
    'Técnica de finalização',
    'Treino tático',
    'Resistência aeróbica',
    'Fortalecimento',
  ];

  @override
  void dispose() {
    legendaController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor:
          const Color(0xFFF4F4F4),

      appBar: AppBar(
        backgroundColor:
            const Color(0xFFF4F4F4),
        elevation: 0,

        leading: IconButton(
          onPressed: () {
            Navigator.pop(context);
          },
          icon: const Icon(
            Icons.arrow_back_rounded,
            color: Colors.black87,
          ),
        ),

        title: const Text(
          'Nova publicação',
          style: TextStyle(
            color: Colors.black87,
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),

      body: SingleChildScrollView(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment:
              CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              height: 210,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius:
                    BorderRadius.circular(14),
                border: Border.all(
                  color: Colors.grey.shade200,
                ),
              ),
              child: Column(
                mainAxisAlignment:
                    MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.image_outlined,
                    color: verde,
                    size: 38,
                  ),

                  const SizedBox(height: 8),

                  const Text(
                    'Adicionar imagem',
                    style: TextStyle(
                      color: Colors.black87,
                      fontSize: 13,
                      fontWeight:
                          FontWeight.w500,
                    ),
                  ),

                  const SizedBox(height: 5),

                  Text(
                    'Adicione uma imagem à publicação',
                    style: TextStyle(
                      color:
                          Colors.grey.shade500,
                      fontSize: 10,
                    ),
                  ),

                  const SizedBox(height: 10),

                  OutlinedButton(
                    onPressed: () {},
                    style:
                        OutlinedButton.styleFrom(
                      foregroundColor: verde,
                      side:
                          const BorderSide(
                        color: verde,
                      ),
                      shape:
                          RoundedRectangleBorder(
                        borderRadius:
                            BorderRadius.circular(
                          10,
                        ),
                      ),
                    ),
                    child: const Text(
                      'Adicionar imagem',
                      style: TextStyle(
                        fontSize: 11,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            const Text(
              'Legenda',
              style: TextStyle(
                fontSize: 12,
                fontStyle: FontStyle.italic,
                color: Colors.black87,
              ),
            ),

            const SizedBox(height: 7),

            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius:
                    BorderRadius.circular(12),
              ),
              child: TextField(
                controller:
                    legendaController,
                maxLines: 5,
                decoration:
                    const InputDecoration(
                  hintText:
                      'Compartilhe uma atualização com sua equipe...',
                  contentPadding:
                      EdgeInsets.all(14),
                  border: InputBorder.none,
                ),
              ),
            ),

            const SizedBox(height: 22),

            const Text(
              'Treino relacionado',
              style: TextStyle(
                fontSize: 12,
                fontStyle: FontStyle.italic,
                color: Colors.black87,
              ),
            ),

            const SizedBox(height: 10),

            Wrap(
              spacing: 8,
              runSpacing: 8,
              children:
                  treinos.map((treino) {
                return _buildTag(treino);
              }).toList(),
            ),

            const SizedBox(height: 30),

            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: () {
                  if (legendaController
                      .text
                      .trim()
                      .isEmpty) {
                    ScaffoldMessenger.of(
                      context,
                    ).showSnackBar(
                      const SnackBar(
                        content: Text(
                          'Digite uma legenda para publicar.',
                        ),
                      ),
                    );
                    return;
                  }

                  ScaffoldMessenger.of(
                    context,
                  ).showSnackBar(
                    const SnackBar(
                      content: Text(
                        'Publicação criada!',
                      ),
                    ),
                  );

                  Navigator.pop(context);
                },
                style:
                    ElevatedButton.styleFrom(
                  backgroundColor: verde,
                  foregroundColor:
                      Colors.white,
                  elevation: 0,
                  shape:
                      RoundedRectangleBorder(
                    borderRadius:
                        BorderRadius.circular(
                      14,
                    ),
                  ),
                ),
                child: const Text(
                  'PUBLICAR',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight:
                        FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTag(String texto) {
    final bool selecionado =
        treinoSelecionado == texto;

    return GestureDetector(
      onTap: () {
        setState(() {
          if (treinoSelecionado == texto) {
            treinoSelecionado = null;
          } else {
            treinoSelecionado = texto;
          }
        });
      },
      child: Container(
        padding:
            const EdgeInsets.symmetric(
          horizontal: 12,
          vertical: 7,
        ),
        decoration: BoxDecoration(
          color: selecionado
              ? verde
              : Colors.white,
          borderRadius:
              BorderRadius.circular(18),
          border: Border.all(
            color: selecionado
                ? verde
                : Colors.grey.shade200,
          ),
        ),
        child: Text(
          texto,
          style: TextStyle(
            fontSize: 10,
            color: selecionado
                ? Colors.white
                : Colors.grey.shade700,
            fontWeight: selecionado
                ? FontWeight.w600
                : FontWeight.w400,
          ),
        ),
      ),
    );
  }
}