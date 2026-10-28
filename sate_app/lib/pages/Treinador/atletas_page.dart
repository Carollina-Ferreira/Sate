import 'package:flutter/material.dart';

import 'perfil_atleta_page.dart';
import '../../theme/sate_theme.dart';

class AtletasPage extends StatefulWidget {
  const AtletasPage({super.key});

  @override
  State<AtletasPage> createState() => _AtletasPageState();
}

class _AtletasPageState extends State<AtletasPage> {
  static const Color verde = Color(0xFF005942);
  static const Color verdeEscuro = Color(0xFF003D31);
  static const Color verdeClaro = Color(0xFFDFF7EE);
  static const Color fundo = Color(0xFFFAF5EE);

  final TextEditingController pesquisaController =
      TextEditingController();

  final List<Map<String, dynamic>> atletas = [
    {
      'nome': 'Mariana Souza',
      'modalidade': 'Futebol',
      'frequencia': '92%',
      'inicial': 'M',
      'status': 'Atleta ativo',
    },
    {
      'nome': 'João Silva',
      'modalidade': 'Futebol',
      'frequencia': '95%',
      'inicial': 'J',
      'status': 'Atleta ativo',
    },
    {
      'nome': 'Ana Costa',
      'modalidade': 'Futebol',
      'frequencia': '88%',
      'inicial': 'A',
      'status': 'Atleta ativo',
    },
    {
      'nome': 'Carlos Mendes',
      'modalidade': 'Futebol',
      'frequencia': '84%',
      'inicial': 'C',
      'status': 'Atleta ativo',
    },
    {
      'nome': 'Lucas Oliveira',
      'modalidade': 'Futebol',
      'frequencia': '76%',
      'inicial': 'L',
      'status': 'Atleta ativo',
    },
  ];

  @override
  void dispose() {
    pesquisaController.dispose();
    super.dispose();
  }

  List<Map<String, dynamic>> get atletasFiltrados {
    final pesquisa = pesquisaController.text.trim().toLowerCase();

    if (pesquisa.isEmpty) {
      return atletas;
    }

    return atletas.where((atleta) {
      final nome =
          (atleta['nome'] as String).toLowerCase();

      final modalidade =
          (atleta['modalidade'] as String).toLowerCase();

      return nome.contains(pesquisa) ||
          modalidade.contains(pesquisa);
    }).toList();
  }

  void _abrirPerfil(Map<String, dynamic> atleta) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => PerfilAtletaPage(
          nome: atleta['nome'],
          modalidade: atleta['modalidade'],
          frequencia: atleta['frequencia'],
          inicial: atleta['inicial'],
        ),
      ),
    );
  }

  Widget _campo({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icone,
  }) {
    return TextField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        prefixIcon: Icon(
          icone,
          color: verde,
        ),
        filled: true,
        fillColor: fundo,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final lista = atletasFiltrados;

    return Scaffold(
      backgroundColor: fundo,

      appBar: AppBar(
        backgroundColor: fundo,
        elevation: 0,
        centerTitle: false,

        automaticallyImplyLeading: false,
        
        title: const Text.rich(
          TextSpan(children: [TextSpan(text: 'Atletas', style: SateEstilo.destaque)]),
          style: TextStyle(
            color: Color(0xFF10251F),
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      body: SafeArea(
        top: false,
        child: Column(
          children: [
            Expanded(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(
                  16,
                  10,
                  16,
                  100,
                ),
                children: [

                  _campoPesquisa(),

                  const SizedBox(height: 20),

                  Row(
                    children: [
                      const Expanded(
                        child: Text(
                          'Meus atletas',
                          style: TextStyle(
                            color: Color(0xFF10251F),
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),

                      Text(
                        '${lista.length} atletas',
                        style: TextStyle(
                          color: Color(0xFF68736F),
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 12),

                  if (lista.isEmpty)
                    _estadoVazio()
                  else
                    ...List.generate(
                      lista.length,
                      (index) {
                        return Padding(
                          padding:
                              const EdgeInsets.only(
                            bottom: 12,
                          ),
                          child: _atletaCard(
                            lista[index],
                          ),
                        );
                      },
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _campoPesquisa() {
    return Container(
      height: 48,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: Color(0xFFE8DFD3),
        ),
      ),
      child: TextField(
        controller: pesquisaController,
        onChanged: (_) {
          setState(() {});
        },
        decoration: InputDecoration(
          hintText: 'Pesquisar atleta...',
          hintStyle: TextStyle(
            color: Color(0xFF8A938F),
            fontSize: 12,
          ),
          prefixIcon: Icon(
            Icons.search_rounded,
            color: Color(0xFF68736F),
            size: 21,
          ),
          suffixIcon:
              pesquisaController.text.isNotEmpty
                  ? IconButton(
                      onPressed: () {
                        pesquisaController.clear();
                        setState(() {});
                      },
                      icon: Icon(
                        Icons.close_rounded,
                        color: Color(0xFF68736F),
                        size: 19,
                      ),
                    )
                  : null,
          border: InputBorder.none,
          contentPadding:
              const EdgeInsets.symmetric(
            vertical: 14,
          ),
        ),
      ),
    );
  }

  Widget _atletaCard(
    Map<String, dynamic> atleta,
  ) {
    return GestureDetector(
      onTap: () {
        _abrirPerfil(atleta);
      },
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: Color(0xFFE8DFD3),
          ),
          boxShadow: [
            BoxShadow(
              color: Color(0xFF10251F).withValues(
                alpha: 0.025,
              ),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 58,
              height: 58,
              decoration: BoxDecoration(
                color: verdeEscuro,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: verde.withValues(
                      alpha: 0.12,
                    ),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Center(
                child: Text(
                  atleta['inicial'],
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),

            const SizedBox(width: 13),

            Expanded(
              child: Column(
                crossAxisAlignment:
                    CrossAxisAlignment.start,
                children: [
                  Text(
                    atleta['nome'],
                    maxLines: 1,
                    overflow:
                        TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: Color(0xFF10251F),
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 4),

                  Text(
                    atleta['modalidade'],
                    style: TextStyle(
                      color: Color(0xFF68736F),
                      fontSize: 12,
                    ),
                  ),

                  const SizedBox(height: 7),

                  Row(
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration:
                            const BoxDecoration(
                          color: verde,
                          shape: BoxShape.circle,
                        ),
                      ),

                      const SizedBox(width: 6),

                      const Text(
                        'Atleta ativo',
                        style: TextStyle(
                          color: verde,
                          fontSize: 11,
                          fontWeight:
                              FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(width: 8),

            Column(
              crossAxisAlignment:
                  CrossAxisAlignment.end,
              children: [
                Text(
                  atleta['frequencia'],
                  style: const TextStyle(
                    color: verde,
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 3),

                Text(
                  'frequência',
                  style: TextStyle(
                    color: Color(0xFF8A938F),
                    fontSize: 9,
                  ),
                ),

                const SizedBox(height: 6),

                const Icon(
                  Icons.chevron_right_rounded,
                  color: Color(0xFF8A938F),
                  size: 21,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _estadoVazio() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(
        vertical: 40,
        horizontal: 20,
      ),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: Color(0xFFE8DFD3),
        ),
      ),
      child: Column(
        children: [
          Container(
            width: 55,
            height: 55,
            decoration: BoxDecoration(
              color: verdeClaro,
              borderRadius:
                  BorderRadius.circular(16),
            ),
            child: const Icon(
              Icons.search_off_rounded,
              color: verde,
              size: 28,
            ),
          ),

          const SizedBox(height: 14),

          const Text(
            'Nenhum atleta encontrado',
            style: TextStyle(
              color: Color(0xFF10251F),
              fontSize: 15,
              fontWeight: FontWeight.bold,
            ),
          ),

          const SizedBox(height: 5),

          Text(
            'Tente pesquisar por outro nome.',
            style: TextStyle(
              color: Color(0xFF68736F),
              fontSize: 11,
            ),
          ),
        ],
      ),
    );
  }
} 