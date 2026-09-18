import 'package:flutter/material.dart';

import '../../assets/cabecalho_treinador.dart';
import 'perfil_atleta_page.dart';

class AtletasPage extends StatefulWidget {
  const AtletasPage({super.key});

  @override
  State<AtletasPage> createState() => _AtletasPageState();
}

class _AtletasPageState extends State<AtletasPage> {
  static const Color verde = Color(0xFF006B4F);
  static const Color verdeClaro = Color(0xFFE8F5F0);
  static const Color fundo = Color(0xFFFCFCFC);

  final TextEditingController pesquisaController =
      TextEditingController();

  final List<Map<String, String>> atletas = [
    {
      'nome': 'Ana Souza',
      'modalidade': 'Futebol',
      'inicial': 'A',
      'frequencia': '94%',
    },
    {
      'nome': 'Carlos Oliveira',
      'modalidade': 'Basquete',
      'inicial': 'C',
      'frequencia': '89%',
    },
    {
      'nome': 'Mariana Santos',
      'modalidade': 'Vôlei',
      'inicial': 'M',
      'frequencia': '92%',
    },
    {
      'nome': 'Pedro Henrique',
      'modalidade': 'Futebol',
      'inicial': 'P',
      'frequencia': '84%',
    },
    {
      'nome': 'Lucas Almeida',
      'modalidade': 'Futebol',
      'inicial': 'L',
      'frequencia': '87%',
    },
  ];

  String pesquisa = '';

  @override
  void dispose() {
    pesquisaController.dispose();
    super.dispose();
  }

  List<Map<String, String>> get atletasFiltrados {
    if (pesquisa.trim().isEmpty) {
      return atletas;
    }

    return atletas.where((atleta) {
      final nome = atleta['nome']!.toLowerCase();
      final modalidade = atleta['modalidade']!.toLowerCase();
      final busca = pesquisa.toLowerCase();

      return nome.contains(busca) ||
          modalidade.contains(busca);
    }).toList();
  }

  void _abrirAdicionarAtleta() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) {
        return Container(
          padding: const EdgeInsets.fromLTRB(
            24,
            12,
            24,
            30,
          ),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(
              top: Radius.circular(28),
            ),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 45,
                  height: 5,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(20),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              const Text(
                'Adicionar atleta',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF12261F),
                ),
              ),
              const SizedBox(height: 6),
              const Text(
                'Escolha como deseja cadastrar o atleta.',
                style: TextStyle(
                  color: Colors.grey,
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 22),
              _opcaoAdicionar(
                icone: Icons.table_chart_rounded,
                titulo: 'Importar planilha',
                descricao:
                    'Adicione vários atletas através de um arquivo Excel.',
                onTap: () {
                  Navigator.pop(context);
                  _importarPlanilha();
                },
              ),
              const SizedBox(height: 12),
              _opcaoAdicionar(
                icone: Icons.person_add_alt_1_rounded,
                titulo: 'Cadastro manual',
                descricao:
                    'Preencha os dados do atleta manualmente.',
                onTap: () {
                  Navigator.pop(context);
                  _cadastroManual();
                },
              ),
              const SizedBox(height: 18),
              SizedBox(
                width: double.infinity,
                child: TextButton(
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  child: const Text(
                    'Cancelar',
                    style: TextStyle(
                      color: Colors.grey,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _opcaoAdicionar({
    required IconData icone,
    required String titulo,
    required String descricao,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: verdeClaro,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: verde.withOpacity(0.15),
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: verde,
                borderRadius: BorderRadius.circular(15),
              ),
              child: Icon(
                icone,
                color: Colors.white,
                size: 25,
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    titulo,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    descricao,
                    style: const TextStyle(
                      fontSize: 12.5,
                      color: Colors.grey,
                      height: 1.3,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(
              Icons.arrow_forward_ios,
              size: 16,
              color: verde,
            ),
          ],
        ),
      ),
    );
  }

  void _importarPlanilha() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text(
          'Selecione uma planilha Excel para importar os atletas.',
        ),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _cadastroManual() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) {
        return _FormularioAtleta(
          onSalvar: (novoAtleta) {
            setState(() {
              atletas.add(novoAtleta);
            });

            Navigator.pop(context);

            ScaffoldMessenger.of(this.context).showSnackBar(
              const SnackBar(
                content: Text(
                  'Atleta cadastrado com sucesso!',
                ),
                behavior: SnackBarBehavior.floating,
              ),
            );
          },
        );
      },
    );
  }

  void _abrirPerfil(Map<String, String> atleta) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => PerfilAtletaPage(
          nome: atleta['nome']!,
          modalidade: atleta['modalidade']!,
          frequencia: atleta['frequencia']!,
          inicial: atleta['inicial']!,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final lista = atletasFiltrados;

    return Scaffold(
      backgroundColor: fundo,
      body: Column(
        children: [
          CabecalhoTreinador(
            titulo: 'Atletas',
          ),

          Expanded(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(
                20,
                24,
                20,
                30,
              ),
              children: [
                Row(
                  mainAxisAlignment:
                      MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Meus atletas',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      '${atletas.length} atletas',
                      style: const TextStyle(
                        color: Colors.grey,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                // CAMPO DE PESQUISA
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(15),
                    border: Border.all(
                      color: const Color(0xFFE1E1E1),
                    ),
                  ),
                  child: TextField(
                    controller: pesquisaController,
                    onChanged: (valor) {
                      setState(() {
                        pesquisa = valor;
                      });
                    },
                    decoration: InputDecoration(
                      hintText: 'Pesquisar atleta...',
                      hintStyle: const TextStyle(
                        color: Colors.grey,
                      ),
                      prefixIcon: const Icon(
                        Icons.search,
                        color: verde,
                      ),
                      suffixIcon: pesquisa.isNotEmpty
                          ? IconButton(
                              onPressed: () {
                                pesquisaController.clear();

                                setState(() {
                                  pesquisa = '';
                                });
                              },
                              icon: const Icon(
                                Icons.close,
                                color: Colors.grey,
                              ),
                            )
                          : null,
                      border: InputBorder.none,
                      contentPadding:
                          const EdgeInsets.symmetric(
                        vertical: 16,
                        horizontal: 10,
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 18),

                // BOTÃO ADICIONAR
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton.icon(
                    onPressed: _abrirAdicionarAtleta,
                    icon: const Icon(
                      Icons.person_add_alt_1_rounded,
                    ),
                    label: const Text(
                      'Adicionar atleta',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: verde,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(15),
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                if (lista.isEmpty)
                  _nenhumAtletaEncontrado()
                else
                  ...lista.map(
                    (atleta) => _atleta(
                      atleta: atleta,
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _nenhumAtletaEncontrado() {
    return Container(
      padding: const EdgeInsets.symmetric(
        vertical: 60,
        horizontal: 20,
      ),
      child: Column(
        children: [
          Icon(
            Icons.person_search_outlined,
            size: 60,
            color: Colors.grey.shade400,
          ),
          const SizedBox(height: 16),
          const Text(
            'Nenhum atleta encontrado',
            style: TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            'Tente pesquisar por outro nome ou modalidade.',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: Colors.grey,
            ),
          ),
        ],
      ),
    );
  }

  Widget _atleta({
    required Map<String, String> atleta,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFFE1E1E1),
        ),
      ),
      child: ListTile(
        onTap: () {
          _abrirPerfil(atleta);
        },
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 8,
        ),
        leading: CircleAvatar(
          radius: 23,
          backgroundColor: verde,
          child: Text(
            atleta['inicial']!,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        title: Text(
          atleta['nome']!,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 5),
          child: Text(
            '${atleta['modalidade']} • Frequência ${atleta['frequencia']}',
          ),
        ),
        trailing: const Icon(
          Icons.arrow_forward_ios,
          size: 16,
          color: Colors.grey,
        ),
      ),
    );
  }
}

// ============================================================
// FORMULÁRIO DE CADASTRO MANUAL
// ============================================================

class _FormularioAtleta extends StatefulWidget {
  final Function(Map<String, String>) onSalvar;

  const _FormularioAtleta({
    required this.onSalvar,
  });

  @override
  State<_FormularioAtleta> createState() =>
      _FormularioAtletaState();
}

class _FormularioAtletaState
    extends State<_FormularioAtleta> {
  final nomeController = TextEditingController();
  final emailController = TextEditingController();

  String modalidade = 'Futebol';

  @override
  void dispose() {
    nomeController.dispose();
    emailController.dispose();
    super.dispose();
  }

  void _salvar() {
    final nome = nomeController.text.trim();

    if (nome.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Digite o nome do atleta.',
          ),
        ),
      );
      return;
    }

    widget.onSalvar({
      'nome': nome,
      'modalidade': modalidade,
      'inicial': nome[0].toUpperCase(),
      'frequencia': '100%',
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: Container(
        padding: const EdgeInsets.fromLTRB(
          24,
          12,
          24,
          30,
        ),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(
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
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius:
                        BorderRadius.circular(20),
                  ),
                ),
              ),

              const SizedBox(height: 22),

              const Text(
                'Novo atleta',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),

              const SizedBox(height: 20),

              TextField(
                controller: nomeController,
                decoration: InputDecoration(
                  labelText: 'Nome completo',
                  prefixIcon: const Icon(
                    Icons.person_outline,
                  ),
                  border: OutlineInputBorder(
                    borderRadius:
                        BorderRadius.circular(14),
                  ),
                ),
              ),

              const SizedBox(height: 14),

              TextField(
                controller: emailController,
                keyboardType:
                    TextInputType.emailAddress,
                decoration: InputDecoration(
                  labelText: 'E-mail',
                  prefixIcon: const Icon(
                    Icons.email_outlined,
                  ),
                  border: OutlineInputBorder(
                    borderRadius:
                        BorderRadius.circular(14),
                  ),
                ),
              ),

              const SizedBox(height: 14),

              DropdownButtonFormField<String>(
                initialValue: modalidade,
                decoration: InputDecoration(
                  labelText: 'Modalidade',
                  prefixIcon: const Icon(
                    Icons.sports_soccer,
                  ),
                  border: OutlineInputBorder(
                    borderRadius:
                        BorderRadius.circular(14),
                  ),
                ),
                items: const [
                  DropdownMenuItem(
                    value: 'Futebol',
                    child: Text('Futebol'),
                  ),
                  DropdownMenuItem(
                    value: 'Basquete',
                    child: Text('Basquete'),
                  ),
                  DropdownMenuItem(
                    value: 'Vôlei',
                    child: Text('Vôlei'),
                  ),
                  DropdownMenuItem(
                    value: 'Rugby',
                    child: Text('Rugby'),
                  ),
                  DropdownMenuItem(
                    value: 'Tênis',
                    child: Text('Tênis'),
                  ),
                ],
                onChanged: (valor) {
                  if (valor != null) {
                    setState(() {
                      modalidade = valor;
                    });
                  }
                },
              ),

              const SizedBox(height: 22),

              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _salvar,
                  style: ElevatedButton.styleFrom(
                    backgroundColor:
                        const Color(0xFF006B4F),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius:
                          BorderRadius.circular(14),
                    ),
                  ),
                  child: const Text(
                    'Cadastrar atleta',
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
      ),
    );
  }
}