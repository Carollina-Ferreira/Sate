import 'package:flutter/material.dart';

import '../login_page.dart';

class PerfilPage extends StatelessWidget {
  final String nomeUsuario;
  final String emailUsuario;

  const PerfilPage({
    super.key,
    required this.nomeUsuario,
    required this.emailUsuario,
  });

  static const Color verde = Color(0xFF00845F);
  static const Color verdeEscuro = Color(0xFF006B4F);
  static const Color fundo = Color(0xFFF7F7F7);
  static const Color cinza = Color(0xFF777777);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: fundo,

      // =========================================================
      // APP BAR - IGUAL AO FEED
      // =========================================================
      appBar: AppBar(
        backgroundColor: fundo,
        elevation: 0,
        centerTitle: false,

        leading: IconButton(
          onPressed: () {
            Navigator.pop(context);
          },
          icon: const Icon(Icons.arrow_back_rounded, color: Colors.black87),
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
              _abrirNotificacoes(context);
            },
            icon: const Icon(
              Icons.notifications_none_rounded,
              color: Colors.black87,
            ),
          ),
        ],
      ),

      // =========================================================
      // CONTEÚDO
      // =========================================================
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 30),
          children: [
            const Text(
              'Minha conta',
              style: TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),

            const SizedBox(height: 12),

            // ===================================================
            // DADOS PESSOAIS
            // ===================================================
            _opcao(
              icone: Icons.person_outline_rounded,
              titulo: 'Dados pessoais',
              subtitulo: 'Nome, email e informações',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => DadosPessoaisPage(
                      nomeUsuario: nomeUsuario,
                      emailUsuario: emailUsuario,
                    ),
                  ),
                );
              },
            ),

            // ===================================================
            // MINHA EQUIPE
            // ===================================================
            _opcao(
              icone: Icons.groups_outlined,
              titulo: 'Minha equipe',
              subtitulo: 'Gerencie sua equipe',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const MinhaEquipePage()),
                );
              },
            ),

            // ===================================================
            // NOTIFICAÇÕES
            // ===================================================
            _opcao(
              icone: Icons.notifications_none_rounded,
              titulo: 'Notificações',
              subtitulo: 'Configure suas notificações',
              onTap: () {
                _abrirNotificacoes(context);
              },
            ),

            // ===================================================
            // SEGURANÇA
            // ===================================================
            _opcao(
              icone: Icons.lock_outline_rounded,
              titulo: 'Segurança',
              subtitulo: 'Senha e segurança da conta',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const SegurancaPage()),
                );
              },
            ),

            // ===================================================
            // CONFIGURAÇÕES
            // ===================================================
            _opcao(
              icone: Icons.settings_outlined,
              titulo: 'Configurações',
              subtitulo: 'Preferências do aplicativo',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const ConfiguracoesPage()),
                );
              },
            ),

            const SizedBox(height: 12),

            const Text(
              'Ajuda',
              style: TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),

            const SizedBox(height: 12),

            // ===================================================
            // AJUDA
            // ===================================================
            _opcao(
              icone: Icons.help_outline_rounded,
              titulo: 'Ajuda e suporte',
              subtitulo: 'Tire suas dúvidas e entre em contato',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const AjudaSuportePage()),
                );
              },
            ),

            // ===================================================
            // SOBRE
            // ===================================================
            _opcao(
              icone: Icons.info_outline_rounded,
              titulo: 'Sobre o SATE',
              subtitulo: 'Informações sobre o aplicativo',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const SobreSatePage()),
                );
              },
            ),

            const SizedBox(height: 12),

            // ===================================================
            // SAIR
            // ===================================================
            _buildSair(context),
          ],
        ),
      ),
    );
  }

  // =============================================================
  // OPÇÃO
  // =============================================================

  Widget _opcao({
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
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.025),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),

        leading: Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            color: const Color(0xFFEAF5F1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icone, color: verde, size: 21),
        ),

        title: Text(
          titulo,
          style: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.bold,
            color: Colors.black87,
          ),
        ),

        subtitle: Padding(
          padding: const EdgeInsets.only(top: 2),
          child: Text(
            subtitulo,
            style: TextStyle(fontSize: 10, color: Colors.grey.shade600),
          ),
        ),

        trailing: Icon(
          Icons.arrow_forward_ios_rounded,
          size: 15,
          color: Colors.grey.shade600,
        ),

        onTap: onTap,
      ),
    );
  }

  // =============================================================
  // SAIR DA CONTA
  // =============================================================

  Widget _buildSair(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(17),
        border: Border.all(color: const Color(0xFFFFD6D6)),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),

        leading: Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            color: const Color(0xFFFFEEEE),
            borderRadius: BorderRadius.circular(12),
          ),
          child: const Icon(Icons.logout_rounded, color: Colors.red, size: 21),
        ),

        title: const Text(
          'Sair da conta',
          style: TextStyle(
            color: Colors.red,
            fontWeight: FontWeight.bold,
            fontSize: 13,
          ),
        ),

        subtitle: Text(
          'Encerrar sua sessão',
          style: TextStyle(fontSize: 10, color: Colors.grey.shade600),
        ),

        onTap: () {
          _confirmarSaida(context);
        },
      ),
    );
  }

  // =============================================================
  // NOTIFICAÇÕES
  // =============================================================

  void _abrirNotificacoes(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const NotificacoesPage()),
    );
  }

  // =============================================================
  // CONFIRMAR SAÍDA
  // =============================================================

  void _confirmarSaida(BuildContext context) {
    showDialog(
      context: context,
      builder: (dialogContext) {
        return AlertDialog(
          title: const Text(
            'Sair da conta?',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),

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
              child: const Text('SAIR', style: TextStyle(color: Colors.red)),
            ),
          ],
        );
      },
    );
  }
}

// ===================================================================
// DADOS PESSOAIS
// ===================================================================

class DadosPessoaisPage extends StatelessWidget {
  final String nomeUsuario;
  final String emailUsuario;

  const DadosPessoaisPage({
    super.key,
    required this.nomeUsuario,
    required this.emailUsuario,
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
          icon: const Icon(Icons.arrow_back_rounded, color: Colors.black87),
        ),
        title: const Text(
          'Dados pessoais',
          style: TextStyle(
            color: Colors.black87,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _campo('Nome', nomeUsuario),
          _campo('Email', emailUsuario),
          _campo('Tipo de usuário', 'Treinador'),
        ],
      ),
    );
  }

  Widget _campo(String titulo, String valor) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            titulo,
            style: const TextStyle(fontSize: 10, color: Colors.grey),
          ),
          const SizedBox(height: 5),
          Text(
            valor,
            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }
}

// ===================================================================
// MINHA EQUIPE
// ===================================================================

class MinhaEquipePage extends StatelessWidget {
  const MinhaEquipePage({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, String>> atletas = [
      {'nome': 'João Silva', 'posicao': 'Meio-campo'},
      {'nome': 'Ana Costa', 'posicao': 'Atacante'},
      {'nome': 'Carlos Mendes', 'posicao': 'Defensor'},
    ];

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
          icon: const Icon(Icons.arrow_back_rounded, color: Colors.black87),
        ),

        title: const Text(
          'Minha equipe',
          style: TextStyle(
            color: Colors.black87,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: atletas.length,
        itemBuilder: (context, index) {
          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(17),
              border: Border.all(color: Colors.grey.shade200),
            ),
            child: Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: const Color(0xFFEAF5F1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.person_rounded,
                    color: Color(0xFF00845F),
                  ),
                ),

                const SizedBox(width: 12),

                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        atletas[index]['nome']!,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                        ),
                      ),

                      const SizedBox(height: 3),

                      Text(
                        atletas[index]['posicao']!,
                        style: const TextStyle(
                          fontSize: 10,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),

                const Icon(
                  Icons.arrow_forward_ios_rounded,
                  size: 14,
                  color: Colors.grey,
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

// ===================================================================
// SEGURANÇA
// ===================================================================

class SegurancaPage extends StatelessWidget {
  const SegurancaPage({super.key});

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
          icon: const Icon(Icons.arrow_back_rounded, color: Colors.black87),
        ),

        title: const Text(
          'Segurança',
          style: TextStyle(
            color: Colors.black87,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _item(Icons.lock_outline_rounded, 'Alterar senha'),

          _item(Icons.shield_outlined, 'Segurança da conta'),

          _item(Icons.verified_user_outlined, 'Verificação de segurança'),
        ],
      ),
    );
  }

  Widget _item(IconData icone, String titulo) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(17),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: ListTile(
        leading: Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            color: const Color(0xFFEAF5F1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icone, color: const Color(0xFF00845F)),
        ),

        title: Text(
          titulo,
          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
        ),

        trailing: const Icon(
          Icons.arrow_forward_ios_rounded,
          size: 14,
          color: Colors.grey,
        ),
      ),
    );
  }
}

// ===================================================================
// CONFIGURAÇÕES
// ===================================================================

class ConfiguracoesPage extends StatefulWidget {
  const ConfiguracoesPage({super.key});

  @override
  State<ConfiguracoesPage> createState() => _ConfiguracoesPageState();
}

class _ConfiguracoesPageState extends State<ConfiguracoesPage> {
  bool notificacoesAtivas = true;
  bool modoEscuro = false;

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
          icon: const Icon(Icons.arrow_back_rounded, color: Colors.black87),
        ),

        title: const Text(
          'Configurações',
          style: TextStyle(
            color: Colors.black87,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(17),
              border: Border.all(color: Colors.grey.shade200),
            ),
            child: Column(
              children: [
                SwitchListTile(
                  title: const Text(
                    'Notificações',
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                  ),
                  subtitle: const Text(
                    'Receber notificações do aplicativo',
                    style: TextStyle(fontSize: 10, color: Colors.grey),
                  ),
                  value: notificacoesAtivas,
                  activeThumbColor: const Color(0xFF00845F),
                  onChanged: (valor) {
                    setState(() {
                      notificacoesAtivas = valor;
                    });
                  },
                ),

                const Divider(height: 1),

                SwitchListTile(
                  title: const Text(
                    'Modo escuro',
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                  ),
                  subtitle: const Text(
                    'Alterar aparência do aplicativo',
                    style: TextStyle(fontSize: 10, color: Colors.grey),
                  ),
                  value: modoEscuro,
                  activeThumbColor: const Color(0xFF00845F),
                  onChanged: (valor) {
                    setState(() {
                      modoEscuro = valor;
                    });
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ===================================================================
// AJUDA E SUPORTE
// ===================================================================

class AjudaSuportePage extends StatelessWidget {
  const AjudaSuportePage({super.key});

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
          icon: const Icon(Icons.arrow_back_rounded, color: Colors.black87),
        ),

        title: const Text(
          'Ajuda e suporte',
          style: TextStyle(
            color: Colors.black87,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _item(Icons.help_outline_rounded, 'Perguntas frequentes'),

          _item(Icons.chat_outlined, 'Falar com suporte'),

          _item(Icons.report_problem_outlined, 'Relatar um problema'),
        ],
      ),
    );
  }

  Widget _item(IconData icone, String titulo) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(17),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: ListTile(
        leading: Icon(icone, color: const Color(0xFF00845F)),

        title: Text(
          titulo,
          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
        ),

        trailing: const Icon(
          Icons.arrow_forward_ios_rounded,
          size: 14,
          color: Colors.grey,
        ),
      ),
    );
  }
}

// ===================================================================
// SOBRE O SATE
// ===================================================================

class SobreSatePage extends StatelessWidget {
  const SobreSatePage({super.key});

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
          icon: const Icon(Icons.arrow_back_rounded, color: Colors.black87),
        ),

        title: const Text(
          'Sobre o SATE',
          style: TextStyle(
            color: Colors.black87,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: const Color(0xFFEAF5F1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Icon(
                Icons.sports_soccer_rounded,
                color: Color(0xFF00845F),
                size: 42,
              ),
            ),

            const SizedBox(height: 18),

            const Text(
              'SATE',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Color(0xFF006B4F),
              ),
            ),

            const SizedBox(height: 8),

            const Text(
              'Sistema de acompanhamento e treinamento esportivo.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 13, color: Colors.grey, height: 1.4),
            ),

            const SizedBox(height: 16),

            const Text(
              'Versão 1.0.0',
              style: TextStyle(fontSize: 10, color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}

// ===================================================================
// NOTIFICAÇÕES
// ===================================================================

class NotificacoesPage extends StatelessWidget {
  const NotificacoesPage({super.key});

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
          icon: const Icon(Icons.arrow_back_rounded, color: Colors.black87),
        ),

        title: const Text(
          'Notificações',
          style: TextStyle(
            color: Colors.black87,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 30),
        children: [
          _notificacao(
            icone: Icons.calendar_month_outlined,
            titulo: 'Novo treino agendado',
            descricao: 'Treino de resistência hoje às 08:00.',
            tempo: 'Agora',
          ),

          _notificacao(
            icone: Icons.groups_outlined,
            titulo: 'Novo atleta na equipe',
            descricao: 'Um novo atleta foi adicionado à equipe.',
            tempo: '20 min',
          ),

          _notificacao(
            icone: Icons.notifications_none_rounded,
            titulo: 'Lembrete de treino',
            descricao: 'Você possui um treino próximo.',
            tempo: '1h',
          ),

          _notificacao(
            icone: Icons.check_circle_outline_rounded,
            titulo: 'Treino concluído',
            descricao: 'O treino de hoje foi registrado.',
            tempo: '3h',
          ),
        ],
      ),
    );
  }

  Widget _notificacao({
    required IconData icone,
    required String titulo,
    required String descricao,
    required String tempo,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(13),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(17),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.025),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color: const Color(0xFFEAF5F1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icone, color: const Color(0xFF00845F), size: 21),
          ),

          const SizedBox(width: 11),

          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  titulo,
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 4),

                Text(
                  descricao,
                  style: TextStyle(
                    fontSize: 10,
                    color: Colors.grey.shade600,
                    height: 1.3,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(width: 8),

          Text(
            tempo,
            style: TextStyle(fontSize: 9, color: Colors.grey.shade500),
          ),
        ],
      ),
    );
  }
}
