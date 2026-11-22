import 'package:flutter/material.dart';
import '../login_page.dart' show BackgroundPainter;

import './treinador_navigation.dart';
import './treinador_vinculo_page.dart';
import '../../services/api_client.dart';
import '../../services/sate_api.dart';
import '../../theme/sate_theme.dart';

class TreinadorEquipesPage extends StatefulWidget {
  final String nomeUsuario;
  final String emailUsuario;

  const TreinadorEquipesPage({
    super.key,
    required this.nomeUsuario,
    required this.emailUsuario,
  });

  @override
  State<TreinadorEquipesPage> createState() =>
      _TreinadorEquipesPageState();
}

class _TreinadorEquipesPageState
    extends State<TreinadorEquipesPage> {
  static const Color verde = Color(0xFF003D31);

  /// Equipes do treinador vindas do servidor (as mesmas cadastradas no site).
  List<Map<String, String>> equipes = [];
  bool _carregando = true;
  String? _erro;

  @override
  void initState() {
    super.initState();
    _carregar();
  }

  Future<void> _carregar() async {
    setState(() {
      _carregando = true;
      _erro = null;
    });
    try {
      final lista = await SateApi.equipesDoTreinador();
      if (!mounted) return;
      setState(() {
        equipes = [
          for (final e in lista)
            {
              'id': '${(e as Map)['id']}',
              'nome': '${e['nome'] ?? ''}',
              'modalidade': '${e['modalidade'] ?? ''}',
              'atletas': '${e['numeroAtletas'] ?? 0} '
                  '${(e['numeroAtletas'] ?? 0) == 1 ? 'atleta' : 'atletas'}',
            }
        ];
        _carregando = false;
      });
    } on ApiException catch (e) {
      if (!mounted) return;
      setState(() {
        _erro = e.mensagem;
        _carregando = false;
      });
    }
  }

  /// Abre o app já na equipe escolhida; o código de convite vem do servidor.
  Future<void> selecionarEquipe(Map<String, String> equipe) async {
    String codigo = '';
    try {
      codigo = await SateApi.codigoEquipe(equipe['id'] ?? '');
    } on ApiException catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.mensagem)));
      return;
    }
    if (!mounted) return;
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => TreinadorVinculoPage(
          nomeUsuario: widget.nomeUsuario,
          emailUsuario: widget.emailUsuario,
          nomeEquipe: equipe['nome'] ?? '',
          modalidade: equipe['modalidade'] ?? '',
          atletas: equipe['atletas'] ?? '',
          codigoEquipe: codigo,
        ),
      ),
    );
  }

  void _continuarSemEquipe() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (_) => TreinadorNavigation(
          nomeUsuario: widget.nomeUsuario,
          emailUsuario: widget.emailUsuario,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // Estas telas têm fundo claro fixo: mantêm sempre o tema claro (legibilidade no modo escuro).
    return Theme(data: SateTema.claro, child: _conteudo(context));
  }

  Widget _conteudo(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF5EE),
      body: Stack(
        children: [
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(
                24,
                24,
                24,
                30,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 68,
                      height: 68,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(22),
                        boxShadow: [
                          BoxShadow(
                            color: Color(0xFF10251F).withOpacity(0.06),
                            blurRadius: 15,
                            offset: const Offset(0, 6),
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.sports_rounded,
                        color: verde,
                        size: 36,
                      ),
                    ),
                  ),

                  const SizedBox(height: 22),

                  Center(
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 7,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(30),
                      ),
                      child: const Text(
                        'ÁREA DO TREINADOR',
                        style: TextStyle(
                          color: verde,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 26),

                  const Text.rich(
                    TextSpan(children: [TextSpan(text: 'Escolha sua '), TextSpan(text: 'equipe.', style: SateEstilo.destaque)]),
                    style: TextStyle(
                      color: Color(0xFF10251F),
                      fontSize: 29,
                      fontWeight: FontWeight.bold,
                      height: 1.15,
                    ),
                  ),

                  const SizedBox(height: 10),

                  const Text(
                    'Selecione a equipe que você deseja acessar para continuar.',
                    style: TextStyle(
                      color: Color(0xFF68736F),
                      fontSize: 15,
                      height: 1.5,
                    ),
                  ),

                  const SizedBox(height: 24),

                  if (_carregando)
                    const Center(
                      child: Padding(
                        padding: EdgeInsets.all(24),
                        child: CircularProgressIndicator(color: verde),
                      ),
                    )
                  else if (_erro != null) ...[
                    Text(
                      _erro!,
                      style: const TextStyle(color: Color(0xFFC0392B), fontSize: 14),
                    ),
                    const SizedBox(height: 12),
                    OutlinedButton(
                      onPressed: _carregar,
                      child: const Text('Tentar novamente'),
                    ),
                  ] else if (equipes.isEmpty) ...[
                    const Text(
                      'Você ainda não tem equipes. Crie uma equipe pelo site do SATE '
                      'e ela aparecerá aqui automaticamente.',
                      style: TextStyle(color: Color(0xFF68736F), fontSize: 14, height: 1.5),
                    ),
                    const SizedBox(height: 14),
                    OutlinedButton(onPressed: _carregar, child: const Text('Atualizar')),
                  ] else
                    ...equipes.map(
                      (equipe) {
                        return Padding(
                          padding: const EdgeInsets.only(
                            bottom: 16,
                          ),
                          child: _cardEquipe(equipe),
                        );
                      },
                    ),

                  // Só aparece quando não há equipes (ou houve erro), para não travar o acesso.
                  if (!_carregando && equipes.isEmpty) ...[
                    const SizedBox(height: 8),
                    Center(
                      child: TextButton(
                        onPressed: _continuarSemEquipe,
                        child: const Text('Entrar no aplicativo'),
                      ),
                    ),
                  ],

                  const SizedBox(height: 8),

                  const Center(
                    child: Text(
                      'Você poderá acessar outra equipe posteriormente.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Color(0xFF68736F),
                        fontSize: 13,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _cardEquipe(Map<String, String> equipe) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Color(0xFF10251F).withOpacity(0.06),
            blurRadius: 18,
            offset: const Offset(0, 7),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: const Color(0xFFDFF7EE),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Icon(
                  Icons.groups_rounded,
                  color: verde,
                  size: 28,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment:
                      CrossAxisAlignment.start,
                  children: [
                    Text(
                      equipe['nome'] ?? '',
                      style: const TextStyle(
                        color: Color(0xFF10251F),
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      equipe['modalidade'] ?? '',
                      style: const TextStyle(
                        color: Color(0xFF68736F),
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 18),

          Container(
            height: 1,
            color: const Color(0xFFE8DFD3),
          ),

          const SizedBox(height: 16),

          Row(
            children: [
              Expanded(
                child: _informacaoEquipe(
                  Icons.people_alt_rounded,
                  equipe['atletas'] ?? '',
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _informacaoEquipe(
                  Icons.sports_rounded,
                  equipe['modalidade'] ?? '',
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              onPressed: () {
                selecionarEquipe(equipe);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: verde,
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
              child: const Text(
                'Entrar nesta equipe',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _informacaoEquipe(
    IconData icone,
    String texto,
  ) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 12,
        vertical: 10,
      ),
      decoration: BoxDecoration(
        color: const Color(0xFFFAF5EE),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Icon(
            icone,
            color: verde,
            size: 18,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              texto,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                color: Color(0xFF68736F),
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
