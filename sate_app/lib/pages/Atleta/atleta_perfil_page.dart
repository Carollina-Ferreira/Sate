import 'package:flutter/material.dart';

import 'atleta_notificacao_page.dart';
import '../login_page.dart';

class AtletaPerfilPage extends StatefulWidget {
  final String nomeUsuario;
  final String emailUsuario;

  const AtletaPerfilPage({
    super.key,
    required this.nomeUsuario,
    required this.emailUsuario,
  });

  @override
  State<AtletaPerfilPage> createState() => _AtletaPerfilPageState();
}

class _AtletaPerfilPageState extends State<AtletaPerfilPage> {
  static const Color verde = Color(0xFF00845F);
  static const Color verdeEscuro = Color(0xFF006B4F);
  static const Color verdeClaro = Color(0xFFE8F5F0);
  static const Color fundo = Color(0xFFF7F7F7);
  static const Color cinza = Color(0xFF777777);

  bool _visualizandoPerfil = false;

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
            if (_visualizandoPerfil) {
              setState(() {
                _visualizandoPerfil = false;
              });
              return;
            }

            Navigator.pop(context);
          },
          icon: const Icon(
            Icons.arrow_back_rounded,
            color: Colors.black87,
            size: 28,
          ),
        ),

        title: const Text(
          'Perfil',
          style: TextStyle(
            color: Colors.black87,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),

        actions: [
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
              color: Colors.black87,
              size: 27,
            ),
          ),

          const SizedBox(width: 4),
        ],
      ),

      body: _visualizandoPerfil ? _buildPerfilEsportivo() : _buildConta(),
    );
  }

  Widget _buildConta() {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 30),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildResumoUsuario(),

          const SizedBox(height: 22),

          const Text(
            'Configurações da conta',
            style: TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),

          const SizedBox(height: 12),

          _buildOpcaoConta(
            icone: Icons.person_outline_rounded,
            titulo: 'Conta',
            subtitulo: 'Dados pessoais e informações da conta',
            onTap: () {
              _abrirPagina(
                ContaPage(
                  nomeUsuario: widget.nomeUsuario,
                  emailUsuario: widget.emailUsuario,
                ),
              );
            },
          ),

          _buildOpcaoConta(
            icone: Icons.settings_outlined,
            titulo: 'Preferências',
            subtitulo: 'Personalize sua experiência',
            onTap: () {
              _abrirPagina(const PreferenciasPage());
            },
          ),

          _buildOpcaoConta(
            icone: Icons.lock_outline_rounded,
            titulo: 'Privacidade',
            subtitulo: 'Controle sua privacidade',
            onTap: () {
              _abrirPagina(const PrivacidadePage());
            },
          ),

          _buildOpcaoConta(
            icone: Icons.shield_outlined,
            titulo: 'Segurança',
            subtitulo: 'Senha e segurança da conta',
            onTap: () {
              _abrirPagina(const SegurancaPage());
            },
          ),

          const SizedBox(height: 20),

          const Text(
            'Ajuda',
            style: TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),

          const SizedBox(height: 12),

          _buildOpcaoConta(
            icone: Icons.help_outline_rounded,
            titulo: 'Ajuda e suporte',
            subtitulo: 'Tire suas dúvidas',
            onTap: () {
              _abrirPagina(const AjudaSuportePage());
            },
          ),

          _buildOpcaoConta(
            icone: Icons.info_outline_rounded,
            titulo: 'Sobre o SATE',
            subtitulo: 'Informações sobre o aplicativo',
            onTap: () {
              _abrirPagina(const SobreSatePage());
            },
          ),

          const SizedBox(height: 22),

          _buildBotaoSair(),
        ],
      ),
    );
  }

  Widget _buildResumoUsuario() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE0E7E4)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.025),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: verdeClaro,
            ),
            child: const Icon(Icons.person_rounded, color: verde, size: 29),
          ),

          const SizedBox(width: 12),

          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.nomeUsuario,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: verdeEscuro,
                  ),
                ),

                SizedBox(height: 3),

                Text('Atleta', style: TextStyle(fontSize: 12, color: cinza)),
              ],
            ),
          ),

          GestureDetector(
            onTap: () {
              setState(() {
                _visualizandoPerfil = true;
              });
            },
            child: const Row(
              children: [
                Text(
                  'Ver perfil',
                  style: TextStyle(
                    fontSize: 12,
                    color: verde,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                SizedBox(width: 5),
                Icon(Icons.arrow_forward_ios_rounded, color: verde, size: 13),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPerfilEsportivo() {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 30),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildCardPerfil(),

          const SizedBox(height: 20),

          const Text(
            'Meu perfil',
            style: TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),

          const SizedBox(height: 12),

          _buildOpcaoPerfil(
            icone: Icons.groups_rounded,
            titulo: 'Minha equipe',
            subtitulo: 'Veja sua equipe e seus companheiros',
            onTap: () {
              _abrirPagina(const MinhaEquipePage());
            },
          ),

          _buildOpcaoPerfil(
            icone: Icons.track_changes_rounded,
            titulo: 'Minhas metas',
            subtitulo: 'Acompanhe seus objetivos',
            onTap: () {
              _abrirPagina(const MinhasMetasPage());
            },
          ),

          _buildOpcaoPerfil(
            icone: Icons.star_rounded,
            titulo: 'Feedbacks',
            subtitulo: 'Veja os comentários do treinador',
            onTap: () {
              _abrirPagina(const FeedbacksPage());
            },
          ),
        ],
      ),
    );
  }

  Widget _buildCardPerfil() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE0E7E4)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.025),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 62,
                height: 62,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: verdeClaro,
                  border: Border.all(color: verde, width: 2),
                ),
                child: const Icon(Icons.person_rounded, color: verde, size: 34),
              ),

              const SizedBox(width: 12),

              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.nomeUsuario,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    SizedBox(height: 4),
                    Text(
                      'Falcões FC • Futebol',
                      style: TextStyle(color: cinza, fontSize: 12),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 14),

          const Text(
            'Meio-campista, apaixonado por futebol desde os 8 anos.\n'
            'Foco em evoluir a cada treino.',
            style: TextStyle(fontSize: 12, height: 1.4, color: Colors.black87),
          ),

          const SizedBox(height: 16),

          SizedBox(
            width: double.infinity,
            height: 46,
            child: OutlinedButton(
              onPressed: () {
                _abrirPagina(
                  EditarPerfilPage(
                    nomeUsuario: widget.nomeUsuario,
                    emailUsuario: widget.emailUsuario,
                  ),
                );
              },
              style: OutlinedButton.styleFrom(
                foregroundColor: verde,
                side: const BorderSide(color: verde),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
              child: const Text(
                'Editar perfil',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
            ),
          ),

          const SizedBox(height: 16),

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
                  cor: Colors.blue,
                ),
              ),

              const SizedBox(width: 8),

              Expanded(
                child: _buildEstatistica(
                  titulo: 'Publicações',
                  valor: '3',
                  cor: Colors.pinkAccent,
                ),
              ),
            ],
          ),

          const SizedBox(height: 10),

          Row(
            children: [
              Expanded(
                child: _buildMiniInformacao(titulo: 'Frequência', valor: '92%'),
              ),

              const SizedBox(width: 10),

              Expanded(
                child: _buildMiniInformacao(
                  titulo: 'Treinos concluídos',
                  valor: '18',
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(15),
            decoration: BoxDecoration(
              color: verde,
              borderRadius: BorderRadius.circular(17),
            ),
            child: Row(
              children: [
                Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.18),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.trending_up_rounded,
                    color: Colors.white,
                  ),
                ),

                const SizedBox(width: 12),

                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Perfil esportivo',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 3),
                      Text(
                        'Desempenho, evolução, metas,\n'
                        'feedbacks e histórico.',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 11,
                          height: 1.3,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 18),

          Text(
            'Publicações',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.grey.shade800,
            ),
          ),

          const SizedBox(height: 12),

          Row(
            children: [
              Expanded(child: _buildPublicacao()),
              const SizedBox(width: 8),
              Expanded(child: _buildPublicacao()),
              const SizedBox(width: 8),
              Expanded(child: _buildPublicacao()),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildEstatistica({
    required String titulo,
    required String valor,
    Color cor = Colors.black87,
  }) {
    return Container(
      height: 65,
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: const Color(0xFFF3F5F4),
        borderRadius: BorderRadius.circular(13),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(titulo, style: const TextStyle(fontSize: 9, color: cinza)),

          const SizedBox(height: 5),

          Text(
            valor,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: cor,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMiniInformacao({required String titulo, required String valor}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 11),
      decoration: BoxDecoration(
        color: verdeClaro,
        borderRadius: BorderRadius.circular(13),
      ),
      child: Row(
        children: [
          Expanded(
            child: Text(
              titulo,
              style: const TextStyle(fontSize: 10, color: cinza),
            ),
          ),
          Text(
            valor,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: verdeEscuro,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPublicacao() {
    return Container(
      height: 82,
      decoration: BoxDecoration(
        color: const Color(0xFFF0F1F1),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Icon(Icons.image_outlined, color: Colors.grey.shade400, size: 26),
    );
  }

  Widget _buildOpcaoConta({
    required IconData icone,
    required String titulo,
    required String subtitulo,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(17),
        border: Border.all(color: const Color(0xFFE0E7E4)),
      ),
      child: ListTile(
        onTap: onTap,
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
        leading: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: verdeClaro,
            borderRadius: BorderRadius.circular(13),
          ),
          child: Icon(icone, color: verde, size: 22),
        ),
        title: Text(
          titulo,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
        ),
        subtitle: Text(
          subtitulo,
          style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
        ),
        trailing: Icon(
          Icons.arrow_forward_ios_rounded,
          size: 15,
          color: Colors.grey.shade500,
        ),
      ),
    );
  }

  Widget _buildOpcaoPerfil({
    required IconData icone,
    required String titulo,
    required String subtitulo,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(17),
        border: Border.all(color: const Color(0xFFE0E7E4)),
      ),
      child: ListTile(
        onTap: onTap,
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
        leading: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: verdeClaro,
            borderRadius: BorderRadius.circular(13),
          ),
          child: Icon(icone, color: verde, size: 22),
        ),
        title: Text(
          titulo,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
        ),
        subtitle: Text(
          subtitulo,
          style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
        ),
        trailing: Icon(
          Icons.arrow_forward_ios_rounded,
          size: 15,
          color: Colors.grey.shade500,
        ),
      ),
    );
  }

  Widget _buildBotaoSair() {
    return SizedBox(
      width: double.infinity,
      height: 50,
      child: OutlinedButton.icon(
        onPressed: () {
          _confirmarSaida(context);
        },
        icon: const Icon(Icons.logout_rounded, color: Colors.redAccent),
        label: const Text(
          'Sair da conta',
          style: TextStyle(
            color: Colors.redAccent,
            fontWeight: FontWeight.w600,
          ),
        ),
        style: OutlinedButton.styleFrom(
          side: const BorderSide(color: Color(0xFFFFD6DD)),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15),
          ),
        ),
      ),
    );
  }

  void _abrirPagina(Widget pagina) {
    Navigator.push(context, MaterialPageRoute(builder: (_) => pagina));
  }

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
                Navigator.of(context, rootNavigator: true).pushAndRemoveUntil(
                  MaterialPageRoute(builder: (_) => const LoginPage()),
                  (route) => false,
                );
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

class ContaPage extends StatelessWidget {
  final String nomeUsuario;
  final String emailUsuario;

  const ContaPage({
    super.key,
    required this.nomeUsuario,
    required this.emailUsuario,
  });

  @override
  Widget build(BuildContext context) {
    return _TelaInterna(
      titulo: 'Conta',
      child: Column(
        children: [
          _CampoInformacao(
            icone: Icons.person_outline_rounded,
            titulo: 'Nome',
            valor: nomeUsuario,
          ),
          _CampoInformacao(
            icone: Icons.email_outlined,
            titulo: 'Email',
            valor: emailUsuario,
          ),
          const _CampoInformacao(
            icone: Icons.phone_outlined,
            titulo: 'Telefone',
            valor: '(11) 99999-9999',
          ),
        ],
      ),
    );
  }
}

class PreferenciasPage extends StatefulWidget {
  const PreferenciasPage({super.key});

  @override
  State<PreferenciasPage> createState() => _PreferenciasPageState();
}

class _PreferenciasPageState extends State<PreferenciasPage> {
  bool notificacoes = true;
  bool lembretes = true;
  bool atualizacoes = true;

  @override
  Widget build(BuildContext context) {
    return _TelaInterna(
      titulo: 'Preferências',
      child: Column(
        children: [
          _SwitchItem(
            titulo: 'Notificações',
            subtitulo: 'Receber notificações do aplicativo',
            valor: notificacoes,
            onChanged: (valor) {
              setState(() {
                notificacoes = valor;
              });
            },
          ),
          _SwitchItem(
            titulo: 'Lembretes',
            subtitulo: 'Receber lembretes de treinos',
            valor: lembretes,
            onChanged: (valor) {
              setState(() {
                lembretes = valor;
              });
            },
          ),
          _SwitchItem(
            titulo: 'Atualizações',
            subtitulo: 'Receber novidades do SATE',
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
}

class PrivacidadePage extends StatefulWidget {
  const PrivacidadePage({super.key});

  @override
  State<PrivacidadePage> createState() => _PrivacidadePageState();
}

class _PrivacidadePageState extends State<PrivacidadePage> {
  bool perfilPublico = true;
  bool mostrarEstatisticas = true;
  bool permitirMensagens = true;

  @override
  Widget build(BuildContext context) {
    return _TelaInterna(
      titulo: 'Privacidade',
      child: Column(
        children: [
          _SwitchItem(
            titulo: 'Perfil público',
            subtitulo: 'Permitir que outros atletas vejam seu perfil',
            valor: perfilPublico,
            onChanged: (valor) {
              setState(() {
                perfilPublico = valor;
              });
            },
          ),
          _SwitchItem(
            titulo: 'Mostrar estatísticas',
            subtitulo: 'Exibir suas estatísticas esportivas',
            valor: mostrarEstatisticas,
            onChanged: (valor) {
              setState(() {
                mostrarEstatisticas = valor;
              });
            },
          ),
          _SwitchItem(
            titulo: 'Permitir mensagens',
            subtitulo: 'Permitir mensagens de outros usuários',
            valor: permitirMensagens,
            onChanged: (valor) {
              setState(() {
                permitirMensagens = valor;
              });
            },
          ),
        ],
      ),
    );
  }
}

class SegurancaPage extends StatelessWidget {
  const SegurancaPage({super.key});

  @override
  Widget build(BuildContext context) {
    return _TelaInterna(
      titulo: 'Segurança',
      child: Column(
        children: [
          _ItemInterno(
            icone: Icons.lock_outline_rounded,
            titulo: 'Alterar senha',
            subtitulo: 'Altere a senha da sua conta',
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Alteração de senha em breve.')),
              );
            },
          ),
          _ItemInterno(
            icone: Icons.security_rounded,
            titulo: 'Verificação de segurança',
            subtitulo: 'Verifique as configurações de segurança',
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Verificação em breve.')),
              );
            },
          ),
        ],
      ),
    );
  }
}

class MinhaEquipePage extends StatelessWidget {
  const MinhaEquipePage({super.key});

  @override
  Widget build(BuildContext context) {
    return _TelaInterna(
      titulo: 'Minha equipe',
      child: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: verdeAtleta,
              borderRadius: BorderRadius.circular(18),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Falcões FC',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 4),
                Text('Futebol', style: TextStyle(color: Colors.white70)),
              ],
            ),
          ),
          const SizedBox(height: 16),
          _MembroEquipe(nome: 'João Silva', funcao: 'Você'),
          _MembroEquipe(nome: 'Ana Costa', funcao: 'Atleta'),
          _MembroEquipe(nome: 'Carlos Mendes', funcao: 'Atleta'),
          _MembroEquipe(nome: 'Mariana Souza', funcao: 'Atleta'),
        ],
      ),
    );
  }
}

class MinhasMetasPage extends StatelessWidget {
  const MinhasMetasPage({super.key});

  @override
  Widget build(BuildContext context) {
    return _TelaInterna(
      titulo: 'Minhas metas',
      child: Column(
        children: [
          _Meta(
            titulo: 'Melhorar frequência',
            progresso: 0.92,
            porcentagem: '92%',
          ),
          _Meta(
            titulo: 'Concluir treinos',
            progresso: 0.80,
            porcentagem: '80%',
          ),
          _Meta(
            titulo: 'Melhorar desempenho',
            progresso: 0.68,
            porcentagem: '68%',
          ),
          _Meta(
            titulo: 'Evoluir resistência',
            progresso: 0.55,
            porcentagem: '55%',
          ),
        ],
      ),
    );
  }
}

class FeedbacksPage extends StatelessWidget {
  const FeedbacksPage({super.key});

  @override
  Widget build(BuildContext context) {
    return _TelaInterna(
      titulo: 'Feedbacks',
      child: Column(
        children: [
          _Feedback(
            nome: 'Professor Marcos',
            texto: 'Ótima evolução nos últimos treinos.',
          ),
          _Feedback(
            nome: 'Professor Marcos',
            texto: 'Continue trabalhando sua resistência.',
          ),
          _Feedback(
            nome: 'Professor Marcos',
            texto: 'Boa participação nos treinos coletivos.',
          ),
        ],
      ),
    );
  }
}

class AjudaSuportePage extends StatelessWidget {
  const AjudaSuportePage({super.key});

  @override
  Widget build(BuildContext context) {
    return _TelaInterna(
      titulo: 'Ajuda e suporte',
      child: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: verdeAtleta,
              borderRadius: BorderRadius.circular(18),
            ),
            child: const Row(
              children: [
                Icon(Icons.help_outline_rounded, color: Colors.white, size: 32),
                SizedBox(width: 14),
                Expanded(
                  child: Text(
                    'Como podemos ajudar?',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
          _Pergunta(titulo: 'Como visualizar meus treinos?'),
          _Pergunta(titulo: 'Como acompanhar minha evolução?'),
          _Pergunta(titulo: 'Como alterar meus dados?'),
          _Pergunta(titulo: 'Como entrar em contato com o treinador?'),
        ],
      ),
    );
  }
}

class SobreSatePage extends StatelessWidget {
  const SobreSatePage({super.key});

  @override
  Widget build(BuildContext context) {
    return _TelaInterna(
      titulo: 'Sobre o SATE',
      child: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE0E7E4)),
            ),
            child: const Column(
              children: [
                Icon(Icons.sports_soccer_rounded, color: verdeAtleta, size: 60),
                SizedBox(height: 12),
                Text(
                  'SATE',
                  style: TextStyle(
                    fontSize: 25,
                    fontWeight: FontWeight.bold,
                    color: verdeAtleta,
                  ),
                ),
                SizedBox(height: 6),
                Text(
                  'Sistema de Acompanhamento e Treinamento Esportivo',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.grey),
                ),
                SizedBox(height: 15),
                Text(
                  'Versão 1.0.0',
                  style: TextStyle(fontWeight: FontWeight.w600),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class EditarPerfilPage extends StatelessWidget {
  final String nomeUsuario;
  final String emailUsuario;

  const EditarPerfilPage({
    super.key,
    required this.nomeUsuario,
    required this.emailUsuario,
  });

  @override
  Widget build(BuildContext context) {
    return _TelaInterna(
      titulo: 'Editar perfil',
      child: Column(
        children: [
          _CampoEditar(titulo: 'Nome', valor: nomeUsuario),
          _CampoEditar(titulo: 'Email', valor: emailUsuario),
          const _CampoEditar(titulo: 'Posição', valor: 'Meio-campo'),
          const _CampoEditar(titulo: 'Número', valor: '10'),
          const _CampoEditar(titulo: 'Equipe', valor: 'Falcões FC'),
          const _CampoEditar(
            titulo: 'Descrição',
            valor: 'Meio-campista, apaixonado por futebol.',
            linhas: 3,
          ),
          const SizedBox(height: 15),
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Perfil atualizado com sucesso!'),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: verdeAtleta,
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
              child: const Text(
                'Salvar alterações',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

const Color verdeAtleta = Color(0xFF00845F);

class _TelaInterna extends StatelessWidget {
  final String titulo;
  final Widget child;

  const _TelaInterna({required this.titulo, required this.child});

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
            size: 28,
          ),
        ),
        title: Text(
          titulo,
          style: const TextStyle(
            color: Colors.black87,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 30),
        child: child,
      ),
    );
  }
}

class _CampoInformacao extends StatelessWidget {
  final IconData icone;
  final String titulo;
  final String valor;

  const _CampoInformacao({
    required this.icone,
    required this.titulo,
    required this.valor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(17),
        border: Border.all(color: const Color(0xFFE0E7E4)),
      ),
      child: Row(
        children: [
          Icon(icone, color: verdeAtleta),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  titulo,
                  style: const TextStyle(fontSize: 11, color: Colors.grey),
                ),
                const SizedBox(height: 3),
                Text(
                  valor,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
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

class _SwitchItem extends StatelessWidget {
  final String titulo;
  final String subtitulo;
  final bool valor;
  final ValueChanged<bool> onChanged;

  const _SwitchItem({
    required this.titulo,
    required this.subtitulo,
    required this.valor,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.fromLTRB(15, 10, 8, 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(17),
        border: Border.all(color: const Color(0xFFE0E7E4)),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  titulo,
                  style: const TextStyle(fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 3),
                Text(
                  subtitulo,
                  style: const TextStyle(fontSize: 11, color: Colors.grey),
                ),
              ],
            ),
          ),
          Switch(value: valor, onChanged: onChanged, activeColor: verdeAtleta),
        ],
      ),
    );
  }
}

class _ItemInterno extends StatelessWidget {
  final IconData icone;
  final String titulo;
  final String subtitulo;
  final VoidCallback onTap;

  const _ItemInterno({
    required this.icone,
    required this.titulo,
    required this.subtitulo,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(17),
        border: Border.all(color: const Color(0xFFE0E7E4)),
      ),
      child: ListTile(
        onTap: onTap,
        leading: Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            color: const Color(0xFFE8F5F0),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icone, color: verdeAtleta),
        ),
        title: Text(
          titulo,
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        subtitle: Text(subtitulo, style: const TextStyle(fontSize: 11)),
        trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 15),
      ),
    );
  }
}

class _MembroEquipe extends StatelessWidget {
  final String nome;
  final String funcao;

  const _MembroEquipe({required this.nome, required this.funcao});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(17),
        border: Border.all(color: const Color(0xFFE0E7E4)),
      ),
      child: Row(
        children: [
          const CircleAvatar(
            backgroundColor: Color(0xFFE8F5F0),
            child: Icon(Icons.person_rounded, color: verdeAtleta),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              nome,
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
          ),
          Text(
            funcao,
            style: const TextStyle(fontSize: 11, color: Colors.grey),
          ),
        ],
      ),
    );
  }
}

class _Meta extends StatelessWidget {
  final String titulo;
  final double progresso;
  final String porcentagem;

  const _Meta({
    required this.titulo,
    required this.progresso,
    required this.porcentagem,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(17),
        border: Border.all(color: const Color(0xFFE0E7E4)),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  titulo,
                  style: const TextStyle(fontWeight: FontWeight.w600),
                ),
              ),
              Text(
                porcentagem,
                style: const TextStyle(
                  color: verdeAtleta,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          LinearProgressIndicator(
            value: progresso,
            minHeight: 7,
            borderRadius: BorderRadius.circular(10),
            backgroundColor: const Color(0xFFE8F5F0),
            valueColor: const AlwaysStoppedAnimation<Color>(verdeAtleta),
          ),
        ],
      ),
    );
  }
}

class _Feedback extends StatelessWidget {
  final String nome;
  final String texto;

  const _Feedback({required this.nome, required this.texto});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(17),
        border: Border.all(color: const Color(0xFFE0E7E4)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            nome,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: verdeAtleta,
            ),
          ),
          const SizedBox(height: 7),
          Text(texto, style: const TextStyle(height: 1.4)),
        ],
      ),
    );
  }
}

class _CampoEditar extends StatelessWidget {
  final String titulo;
  final String valor;
  final int linhas;

  const _CampoEditar({
    required this.titulo,
    required this.valor,
    this.linhas = 1,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: TextFormField(
        initialValue: valor,
        maxLines: linhas,
        decoration: InputDecoration(
          labelText: titulo,
          filled: true,
          fillColor: Colors.white,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: const BorderSide(color: Color(0xFFE0E7E4)),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: const BorderSide(color: Color(0xFFE0E7E4)),
          ),
        ),
      ),
    );
  }
}

class _Pergunta extends StatelessWidget {
  final String titulo;

  const _Pergunta({required this.titulo});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE0E7E4)),
      ),
      child: ExpansionTile(
        title: Text(
          titulo,
          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
        ),
        children: const [
          Padding(
            padding: EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: Text(
              'Essa informação estará disponível em uma próxima atualização do aplicativo.',
              style: TextStyle(fontSize: 12, color: Colors.grey),
            ),
          ),
        ],
      ),
    );
  }
}
