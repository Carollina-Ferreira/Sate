import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class FeedPage extends StatefulWidget {
  const FeedPage({super.key});

  @override
  State<FeedPage> createState() => _FeedPageState();
}

class _FeedPageState extends State<FeedPage> {
  static const Color verde = Color(0xFF006B4F);
  static const Color verdeClaro = Color(0xFFE8F5F0);
  static const Color fundo = Color(0xFFF7F9F8);
  static const Color texto = Color(0xFF12261F);

  final ImagePicker _picker = ImagePicker();

  final List<Publicacao> publicacoes = [
    Publicacao(
      id: 1,
      nome: 'Professor Marcos',
      equipe: 'Falcões FC',
      horario: 'Há 2 horas',
      texto:
          'Parabéns a todos pelo excelente treino de hoje! Continuem evoluindo. 💪⚽',
      curtidas: 124,
      comentarios: 18,
      imagem: null,
      curtido: false,
      salvo: false,
      corAvatar: Color(0xFF006B4F),
    ),
    Publicacao(
      id: 2,
      nome: 'Falcões FC',
      equipe: 'Falcões FC',
      horario: 'Há 5 horas',
      texto:
          'Novo desafio concluído pela equipe! Parabéns a todos os atletas. 🏆',
      curtidas: 86,
      comentarios: 12,
      imagem: null,
      curtido: false,
      salvo: false,
      corAvatar: Color(0xFF4EA5D9),
    ),
    Publicacao(
      id: 3,
      nome: 'Professor Marcos',
      equipe: 'Falcões FC',
      horario: 'Ontem',
      texto:
          'Lembrete: não esqueçam do próximo treino. Contamos com a presença de todos!',
      curtidas: 42,
      comentarios: 5,
      imagem: null,
      curtido: false,
      salvo: false,
      corAvatar: Color(0xFFEF476F),
    ),
  ];

  final List<Story> stories = [
    Story(
      nome: 'Seu story',
      avatar: null,
      proprio: true,
    ),
    Story(
      nome: 'Falcões',
      avatar: null,
    ),
    Story(
      nome: 'João',
      avatar: null,
    ),
    Story(
      nome: 'Maria',
      avatar: null,
    ),
    Story(
      nome: 'Lucas',
      avatar: null,
    ),
    Story(
      nome: 'Ana',
      avatar: null,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: fundo,

      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            _cabecalho(),

            SliverToBoxAdapter(
              child: _stories(),
            ),

            SliverToBoxAdapter(
              child: Container(
                height: 8,
                color: fundo,
              ),
            ),

            SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final publicacao = publicacoes[index];

                  return _post(publicacao);
                },
                childCount: publicacoes.length,
              ),
            ),
          ],
        ),
      ),

      floatingActionButton: FloatingActionButton(
        onPressed: _abrirCriarPublicacao,

        backgroundColor: verde,

        elevation: 4,

        child: const Icon(
          Icons.add,
          color: Colors.white,
        ),
      ),
    );
  }

  // ============================================================
  // CABEÇALHO
  // ============================================================

  Widget _cabecalho() {
    return SliverAppBar(
      backgroundColor: Colors.white,
      surfaceTintColor: Colors.white,

      pinned: true,

      elevation: 0,

      toolbarHeight: 64,

      titleSpacing: 18,

      title: Row(
        children: [
          const Text(
            'SATE',
            style: TextStyle(
              color: verde,
              fontSize: 25,
              fontWeight: FontWeight.w900,
              letterSpacing: -1,
            ),
          ),

          const SizedBox(width: 5),

          const Text(
            'Feed',
            style: TextStyle(
              color: texto,
              fontSize: 18,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),

      actions: [
        IconButton(
          onPressed: () {},
          icon: const Icon(
            Icons.favorite_border,
            color: texto,
            size: 25,
          ),
        ),

        IconButton(
          onPressed: () {},
          icon: const Icon(
            Icons.chat_bubble_outline,
            color: texto,
            size: 23,
          ),
        ),

        const SizedBox(width: 8),
      ],

      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(1),

        child: Container(
          height: 1,
          color: const Color(0xFFE8ECEA),
        ),
      ),
    );
  }

  // ============================================================
  // STORIES
  // ============================================================

  Widget _stories() {
    return Container(
      color: Colors.white,

      padding: const EdgeInsets.symmetric(
        vertical: 15,
      ),

      child: SizedBox(
        height: 100,

        child: ListView.builder(
          scrollDirection: Axis.horizontal,

          padding: const EdgeInsets.symmetric(
            horizontal: 14,
          ),

          itemCount: stories.length,

          itemBuilder: (context, index) {
            final story = stories[index];

            return GestureDetector(
              onTap: () {
                if (story.proprio) {
                  _adicionarStory();
                } else {
                  _abrirStory(story);
                }
              },

              child: Container(
                width: 72,

                margin: const EdgeInsets.only(
                  right: 13,
                ),

                child: Column(
                  children: [
                    Stack(
                      clipBehavior: Clip.none,

                      children: [
                        Container(
                          padding: const EdgeInsets.all(3),

                          decoration: BoxDecoration(
                            shape: BoxShape.circle,

                            gradient: LinearGradient(
                              colors: [
                                verde,
                                const Color(0xFF4EA5D9),
                              ],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                          ),

                          child: Container(
                            padding: const EdgeInsets.all(2),

                            decoration: const BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                            ),

                            child: _avatar(
                              nome: story.nome,
                              tamanho: 56,
                              cor: verde,
                            ),
                          ),
                        ),

                        if (story.proprio)
                          Positioned(
                            right: -1,
                            bottom: 0,

                            child: Container(
                              width: 21,
                              height: 21,

                              decoration: BoxDecoration(
                                color: verde,
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: Colors.white,
                                  width: 2,
                                ),
                              ),

                              child: const Icon(
                                Icons.add,
                                color: Colors.white,
                                size: 14,
                              ),
                            ),
                          ),
                      ],
                    ),

                    const SizedBox(height: 6),

                    Text(
                      story.nome,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,

                      style: const TextStyle(
                        fontSize: 11,
                        color: texto,
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  // ============================================================
  // POST
  // ============================================================

  Widget _post(Publicacao publicacao) {
    return Container(
      color: Colors.white,

      margin: const EdgeInsets.only(
        bottom: 8,
      ),

      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,

        children: [
          // CABEÇALHO DO POST
          Padding(
            padding: const EdgeInsets.fromLTRB(
              14,
              14,
              10,
              12,
            ),

            child: Row(
              children: [
                _avatar(
                  nome: publicacao.nome,
                  tamanho: 43,
                  cor: publicacao.corAvatar,
                ),

                const SizedBox(width: 10),

                Expanded(
                  child: Column(
                    crossAxisAlignment:
                        CrossAxisAlignment.start,

                    children: [
                      Text(
                        publicacao.nome,

                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: texto,
                        ),
                      ),

                      const SizedBox(height: 2),

                      Row(
                        children: [
                          Text(
                            publicacao.equipe,

                            style: const TextStyle(
                              fontSize: 11,
                              color: Colors.grey,
                            ),
                          ),

                          const Text(
                            ' • ',
                            style: TextStyle(
                              color: Colors.grey,
                            ),
                          ),

                          Text(
                            publicacao.horario,

                            style: const TextStyle(
                              fontSize: 11,
                              color: Colors.grey,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                IconButton(
                  onPressed: () {
                    _menuPublicacao(publicacao);
                  },

                  icon: const Icon(
                    Icons.more_horiz,
                    color: Colors.grey,
                  ),
                ),
              ],
            ),
          ),

          // TEXTO
          if (publicacao.texto.isNotEmpty)
            Padding(
              padding: const EdgeInsets.fromLTRB(
                14,
                0,
                14,
                13,
              ),

              child: Text(
                publicacao.texto,

                style: const TextStyle(
                  fontSize: 14,
                  height: 1.4,
                  color: Color(0xFF252525),
                ),
              ),
            ),

          // IMAGEM
          if (publicacao.imagem != null)
            GestureDetector(
              onDoubleTap: () {
                _curtir(publicacao);
              },

              child: Image.file(
                File(publicacao.imagem!),

                width: double.infinity,

                height: 330,

                fit: BoxFit.cover,
              ),
            ),

          // AÇÕES
          Padding(
            padding: const EdgeInsets.fromLTRB(
              10,
              8,
              10,
              0,
            ),

            child: Row(
              children: [
                _botaoAcao(
                  icone: publicacao.curtido
                      ? Icons.favorite
                      : Icons.favorite_border,

                  cor: publicacao.curtido
                      ? Colors.red
                      : texto,

                  texto: '${publicacao.curtidas}',

                  onTap: () {
                    _curtir(publicacao);
                  },
                ),

                const SizedBox(width: 5),

                _botaoAcao(
                  icone: Icons.chat_bubble_outline,

                  cor: texto,

                  texto: '${publicacao.comentarios}',

                  onTap: () {
                    _abrirComentarios(publicacao);
                  },
                ),

                const Spacer(),

                IconButton(
                  onPressed: () {
                    setState(() {
                      publicacao.salvo =
                          !publicacao.salvo;
                    });

                    ScaffoldMessenger.of(context)
                        .showSnackBar(
                      SnackBar(
                        duration:
                            const Duration(
                          milliseconds: 900,
                        ),

                        content: Text(
                          publicacao.salvo
                              ? 'Publicação salva'
                              : 'Publicação removida dos salvos',
                        ),
                      ),
                    );
                  },

                  icon: Icon(
                    publicacao.salvo
                        ? Icons.bookmark
                        : Icons.bookmark_border,

                    color: publicacao.salvo
                        ? verde
                        : texto,

                    size: 25,
                  ),
                ),
              ],
            ),
          ),

          // CURTIDAS
          if (publicacao.curtidas > 0)
            Padding(
              padding: const EdgeInsets.fromLTRB(
                14,
                2,
                14,
                0,
              ),

              child: Text(
                '${publicacao.curtidas} curtidas',

                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: texto,
                ),
              ),
            ),

          // COMENTÁRIO RESUMIDO
          if (publicacao.comentarioPrincipal != null)
            Padding(
              padding: const EdgeInsets.fromLTRB(
                14,
                6,
                14,
                0,
              ),

              child: RichText(
                text: TextSpan(
                  style: const TextStyle(
                    fontSize: 12,
                    color: texto,
                  ),

                  children: [
                    TextSpan(
                      text:
                          '${publicacao.comentarioNome} ',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    TextSpan(
                      text:
                          publicacao.comentarioPrincipal!,
                    ),
                  ],
                ),
              ),
            ),

          // VER COMENTÁRIOS
          if (publicacao.comentarios > 0)
            GestureDetector(
              onTap: () {
                _abrirComentarios(publicacao);
              },

              child: const Padding(
                padding: EdgeInsets.fromLTRB(
                  14,
                  6,
                  14,
                  15,
                ),

                child: Text(
                  'Ver todos os comentários',
                  style: TextStyle(
                    color: Colors.grey,
                    fontSize: 12,
                  ),
                ),
              ),
            )
          else
            const SizedBox(height: 15),
        ],
      ),
    );
  }

  // ============================================================
  // BOTÃO DE AÇÃO
  // ============================================================

  Widget _botaoAcao({
    required IconData icone,
    required Color cor,
    required String texto,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,

      borderRadius: BorderRadius.circular(20),

      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: 5,
          vertical: 5,
        ),

        child: Row(
          children: [
            Icon(
              icone,
              color: cor,
              size: 24,
            ),

            const SizedBox(width: 5),

            Text(
              texto,

              style: TextStyle(
                fontSize: 12,
                color: cor,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ============================================================
  // AVATAR
  // ============================================================

  Widget _avatar({
    required String nome,
    required double tamanho,
    required Color cor,
  }) {
    return Container(
      width: tamanho,
      height: tamanho,

      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: cor.withValues(alpha: 0.12),
      ),

      child: Center(
        child: Text(
          _iniciais(nome),

          style: TextStyle(
            color: cor,
            fontSize: tamanho * 0.34,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  String _iniciais(String nome) {
    final partes = nome.trim().split(' ');

    if (partes.isEmpty) {
      return '?';
    }

    if (partes.length == 1) {
      return partes.first.substring(0, 1).toUpperCase();
    }

    return '${partes.first.substring(0, 1)}'
        '${partes.last.substring(0, 1)}'
        .toUpperCase();
  }

  // ============================================================
  // CURTIR
  // ============================================================

  void _curtir(Publicacao publicacao) {
    setState(() {
      publicacao.curtido =
          !publicacao.curtido;

      if (publicacao.curtido) {
        publicacao.curtidas++;
      } else {
        publicacao.curtidas--;
      }
    });
  }

  // ============================================================
  // COMENTÁRIOS
  // ============================================================

  void _abrirComentarios(
    Publicacao publicacao,
  ) {
    final controller = TextEditingController();

    showModalBottomSheet(
      context: context,

      isScrollControlled: true,

      backgroundColor: Colors.transparent,

      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context)
                .viewInsets
                .bottom,
          ),

          child: Container(
            height: MediaQuery.of(context)
                    .size
                    .height *
                0.72,

            decoration: const BoxDecoration(
              color: Colors.white,

              borderRadius: BorderRadius.vertical(
                top: Radius.circular(28),
              ),
            ),

            child: Column(
              children: [
                const SizedBox(height: 10),

                Container(
                  width: 45,
                  height: 5,

                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius:
                        BorderRadius.circular(10),
                  ),
                ),

                const SizedBox(height: 18),

                const Text(
                  'Comentários',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const Divider(
                  height: 25,
                ),

                Expanded(
                  child: publicacao.listaComentarios
                          .isEmpty
                      ? const Center(
                          child: Text(
                            'Seja o primeiro a comentar!',
                            style: TextStyle(
                              color: Colors.grey,
                            ),
                          ),
                        )
                      : ListView.builder(
                          padding:
                              const EdgeInsets
                                  .symmetric(
                            horizontal: 18,
                          ),

                          itemCount: publicacao
                              .listaComentarios
                              .length,

                          itemBuilder:
                              (context, index) {
                            final comentario =
                                publicacao
                                    .listaComentarios[
                                        index];

                            return Padding(
                              padding:
                                  const EdgeInsets
                                      .only(
                                bottom: 18,
                              ),

                              child: Row(
                                crossAxisAlignment:
                                    CrossAxisAlignment
                                        .start,

                                children: [
                                  _avatar(
                                    nome: comentario
                                        .nome,
                                    tamanho: 38,
                                    cor: verde,
                                  ),

                                  const SizedBox(
                                    width: 10,
                                  ),

                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment
                                              .start,

                                      children: [
                                        Text(
                                          comentario
                                              .nome,

                                          style:
                                              const TextStyle(
                                            fontWeight:
                                                FontWeight
                                                    .bold,
                                            fontSize:
                                                13,
                                          ),
                                        ),

                                        const SizedBox(
                                          height: 3,
                                        ),

                                        Text(
                                          comentario
                                              .texto,

                                          style:
                                              const TextStyle(
                                            fontSize:
                                                13,
                                          ),
                                        ),
                                      ],
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
                      const EdgeInsets.all(12),

                  decoration:
                      const BoxDecoration(
                    border: Border(
                      top: BorderSide(
                        color:
                            Color(0xFFE8E8E8),
                      ),
                    ),
                  ),

                  child: Row(
                    children: [
                      _avatar(
                        nome: 'Professor Marcos',
                        tamanho: 38,
                        cor: verde,
                      ),

                      const SizedBox(width: 10),

                      Expanded(
                        child: TextField(
                          controller: controller,

                          decoration:
                              InputDecoration(
                            hintText:
                                'Adicione um comentário...',

                            filled: true,

                            fillColor:
                                fundo,

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

                            contentPadding:
                                const EdgeInsets
                                    .symmetric(
                              horizontal: 16,
                            ),
                          ),
                        ),
                      ),

                      IconButton(
                        onPressed: () {
                          final texto =
                              controller.text
                                  .trim();

                          if (texto.isEmpty) {
                            return;
                          }

                          setState(() {
                            publicacao
                                .listaComentarios
                                .add(
                              Comentario(
                                nome:
                                    'Professor Marcos',
                                texto: texto,
                              ),
                            );

                            publicacao
                                .comentarios++;
                          });

                          controller.clear();
                        },

                        icon: const Icon(
                          Icons.send,
                          color: verde,
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
  }

  // ============================================================
  // CRIAR PUBLICAÇÃO
  // ============================================================

  void _abrirCriarPublicacao() {
    final textoController =
        TextEditingController();

    File? imagemSelecionada;

    showModalBottomSheet(
      context: context,

      isScrollControlled: true,

      backgroundColor: Colors.transparent,

      builder: (context) {
        return StatefulBuilder(
          builder: (
            context,
            setModalState,
          ) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context)
                    .viewInsets
                    .bottom,
              ),

              child: Container(
                constraints:
                    BoxConstraints(
                  maxHeight:
                      MediaQuery.of(context)
                              .size
                              .height *
                          0.88,
                ),

                padding:
                    const EdgeInsets.fromLTRB(
                  20,
                  15,
                  20,
                  20,
                ),

                decoration:
                    const BoxDecoration(
                  color: Colors.white,

                  borderRadius:
                      BorderRadius.vertical(
                    top: Radius.circular(28),
                  ),
                ),

                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment:
                        CrossAxisAlignment.start,

                    children: [
                      Center(
                        child: Container(
                          width: 45,
                          height: 5,

                          decoration:
                              BoxDecoration(
                            color: Colors
                                .grey.shade300,

                            borderRadius:
                                BorderRadius
                                    .circular(
                              10,
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(
                        height: 18,
                      ),

                      Row(
                        children: [
                          _avatar(
                            nome:
                                'Professor Marcos',
                            tamanho: 45,
                            cor: verde,
                          ),

                          const SizedBox(
                            width: 10,
                          ),

                          const Column(
                            crossAxisAlignment:
                                CrossAxisAlignment
                                    .start,

                            children: [
                              Text(
                                'Professor Marcos',
                                style: TextStyle(
                                  fontWeight:
                                      FontWeight
                                          .bold,
                                  fontSize: 14,
                                ),
                              ),

                              SizedBox(height: 2),

                              Text(
                                'Falcões FC',
                                style: TextStyle(
                                  color:
                                      Colors.grey,
                                  fontSize: 11,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),

                      const SizedBox(
                        height: 18,
                      ),

                      TextField(
                        controller:
                            textoController,

                        maxLines: 5,

                        decoration:
                            InputDecoration(
                          hintText:
                              'O que você quer compartilhar?',

                          border:
                              OutlineInputBorder(
                            borderRadius:
                                BorderRadius
                                    .circular(
                              16,
                            ),

                            borderSide:
                                const BorderSide(
                              color: Color(
                                0xFFE1E7E4,
                              ),
                            ),
                          ),

                          focusedBorder:
                              OutlineInputBorder(
                            borderRadius:
                                BorderRadius
                                    .circular(
                              16,
                            ),

                            borderSide:
                                const BorderSide(
                              color: verde,
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(
                        height: 14,
                      ),

                      // IMAGEM SELECIONADA
                      if (imagemSelecionada !=
                          null)
                        Stack(
                          children: [
                            ClipRRect(
                              borderRadius:
                                  BorderRadius
                                      .circular(
                                16,
                              ),

                              child: Image.file(
                                imagemSelecionada!,

                                width:
                                    double.infinity,

                                height: 230,

                                fit: BoxFit.cover,
                              ),
                            ),

                            Positioned(
                              right: 8,
                              top: 8,

                              child:
                                  GestureDetector(
                                onTap: () {
                                  setModalState(
                                    () {
                                      imagemSelecionada =
                                          null;
                                    },
                                  );
                                },

                                child:
                                    Container(
                                  width: 34,
                                  height: 34,

                                  decoration:
                                      const BoxDecoration(
                                    color:
                                        Colors.black54,
                                    shape:
                                        BoxShape.circle,
                                  ),

                                  child:
                                      const Icon(
                                    Icons.close,
                                    color:
                                        Colors.white,
                                    size: 19,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),

                      const SizedBox(
                        height: 12,
                      ),

                      // GALERIA
                      InkWell(
                        onTap: () async {
                          final XFile? imagem =
                              await _picker
                                  .pickImage(
                            source:
                                ImageSource.gallery,

                            imageQuality: 85,
                          );

                          if (imagem != null) {
                            setModalState(() {
                              imagemSelecionada =
                                  File(
                                imagem.path,
                              );
                            });
                          }
                        },

                        borderRadius:
                            BorderRadius.circular(
                          14,
                        ),

                        child: Container(
                          padding:
                              const EdgeInsets
                                  .symmetric(
                            vertical: 14,
                            horizontal: 15,
                          ),

                          decoration:
                              BoxDecoration(
                            color: verdeClaro,

                            borderRadius:
                                BorderRadius
                                    .circular(
                              14,
                            ),
                          ),

                          child: const Row(
                            children: [
                              Icon(
                                Icons
                                    .photo_library_outlined,
                                color: verde,
                              ),

                              SizedBox(
                                width: 10,
                              ),

                              Text(
                                'Adicionar foto da galeria',
                                style: TextStyle(
                                  color: verde,
                                  fontWeight:
                                      FontWeight
                                          .bold,
                                  fontSize: 13,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(
                        height: 20,
                      ),

                      SizedBox(
                        width: double.infinity,
                        height: 52,

                        child:
                            ElevatedButton(
                          onPressed: () {
                            final texto =
                                textoController
                                    .text
                                    .trim();

                            if (texto.isEmpty &&
                                imagemSelecionada ==
                                    null) {
                              ScaffoldMessenger
                                  .of(context)
                                  .showSnackBar(
                                const SnackBar(
                                  content: Text(
                                    'Adicione um texto ou uma imagem.',
                                  ),
                                ),
                              );

                              return;
                            }

                            setState(() {
                              publicacoes.insert(
                                0,

                                Publicacao(
                                  id: DateTime
                                      .now()
                                      .millisecondsSinceEpoch,

                                  nome:
                                      'Professor Marcos',

                                  equipe:
                                      'Falcões FC',

                                  horario:
                                      'Agora',

                                  texto: texto,

                                  curtidas: 0,

                                  comentarios: 0,

                                  imagem:
                                      imagemSelecionada
                                          ?.path,

                                  curtido: false,

                                  salvo: false,

                                  corAvatar:
                                      verde,
                                ),
                              );
                            });

                            Navigator.pop(
                              context,
                            );
                          },

                          style:
                              ElevatedButton
                                  .styleFrom(
                            backgroundColor:
                                verde,

                            foregroundColor:
                                Colors.white,

                            elevation: 0,

                            shape:
                                RoundedRectangleBorder(
                              borderRadius:
                                  BorderRadius
                                      .circular(
                                15,
                              ),
                            ),
                          ),

                          child:
                              const Text(
                            'Publicar',
                            style: TextStyle(
                              fontWeight:
                                  FontWeight.bold,
                              fontSize: 15,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  // ============================================================
  // STORY
  // ============================================================

  void _adicionarStory() {
    ScaffoldMessenger.of(context)
        .showSnackBar(
      const SnackBar(
        content: Text(
          'A criação de stories será conectada à câmera em breve.',
        ),
      ),
    );
  }

  void _abrirStory(Story story) {
    showDialog(
      context: context,

      builder: (context) {
        return Dialog(
          backgroundColor: Colors.black,

          insetPadding:
              const EdgeInsets.all(10),

          child: SizedBox(
            height:
                MediaQuery.of(context)
                    .size
                    .height *
                0.75,

            child: Column(
              mainAxisAlignment:
                  MainAxisAlignment.center,

              children: [
                _avatar(
                  nome: story.nome,
                  tamanho: 70,
                  cor: Colors.white,
                ),

                const SizedBox(
                  height: 15,
                ),

                Text(
                  story.nome,

                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(
                  height: 20,
                ),

                const Icon(
                  Icons.image_outlined,
                  color: Colors.white54,
                  size: 70,
                ),

                const SizedBox(
                  height: 15,
                ),

                const Text(
                  'Story do atleta',
                  style: TextStyle(
                    color: Colors.white70,
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
  // MENU DA PUBLICAÇÃO
  // ============================================================

  void _menuPublicacao(
    Publicacao publicacao,
  ) {
    showModalBottomSheet(
      context: context,

      backgroundColor: Colors.white,

      builder: (context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,

            children: [
              ListTile(
                leading: Icon(
                  publicacao.salvo
                      ? Icons.bookmark
                      : Icons.bookmark_border,

                  color: verde,
                ),

                title: Text(
                  publicacao.salvo
                      ? 'Remover dos salvos'
                      : 'Salvar publicação',
                ),

                onTap: () {
                  setState(() {
                    publicacao.salvo =
                        !publicacao.salvo;
                  });

                  Navigator.pop(context);
                },
              ),

              ListTile(
                leading: const Icon(
                  Icons.share_outlined,
                ),

                title: const Text(
                  'Compartilhar',
                ),

                onTap: () {
                  Navigator.pop(context);

                  ScaffoldMessenger.of(context)
                      .showSnackBar(
                    const SnackBar(
                      content: Text(
                        'Compartilhamento em breve.',
                      ),
                    ),
                  );
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

// ================================================================
// MODELOS
// ================================================================

class Publicacao {
  final int id;
  final String nome;
  final String equipe;
  final String horario;
  final String texto;
  final Color corAvatar;

  int curtidas;
  int comentarios;

  String? imagem;

  bool curtido;
  bool salvo;

  String? comentarioPrincipal;
  String? comentarioNome;

  final List<Comentario> listaComentarios;

  Publicacao({
    required this.id,
    required this.nome,
    required this.equipe,
    required this.horario,
    required this.texto,
    required this.curtidas,
    required this.comentarios,
    required this.imagem,
    required this.curtido,
    required this.salvo,
    required this.corAvatar,
    this.comentarioPrincipal,
    this.comentarioNome,
    List<Comentario>? listaComentarios,
  }) : listaComentarios =
            listaComentarios ?? [];
}

class Comentario {
  final String nome;
  final String texto;

  Comentario({
    required this.nome,
    required this.texto,
  });
}

class Story {
  final String nome;
  final String? avatar;
  final bool proprio;

  Story({
    required this.nome,
    this.avatar,
    this.proprio = false,
  });
}
