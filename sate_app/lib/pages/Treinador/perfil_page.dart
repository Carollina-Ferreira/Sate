import 'package:flutter/material.dart';

import '../login_page.dart';
import '../../theme/sate_theme.dart';

class PerfilPage extends StatelessWidget {
  final String nomeUsuario;
  final String emailUsuario;

  const PerfilPage({
    super.key,
    required this.nomeUsuario,
    required this.emailUsuario,
  });

  static const Color verde = Color(0xFF005942);
  static const Color verdeEscuro = Color(0xFF003D31);
  static const Color verdeClaro = Color(0xFFDFF7EE);
  static const Color fundo = Color(0xFFFAF5EE);
  static const Color cinza = Color(0xFF68736F);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: fundo,

      appBar: AppBar(
        backgroundColor: fundo,
        elevation: 0,
        centerTitle: false,

        automaticallyImplyLeading: false,

        title: const Text.rich(
          TextSpan(children: [TextSpan(text: 'Perfil', style: SateEstilo.destaque)]),
          style: TextStyle(
            color: Color(0xFF10251F),
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
                  builder: (_) => const NotificacoesPage(),
                ),
              );
            },
            icon: const Icon(
              Icons.notifications_none_rounded,
              color: Color(0xFF10251F),
              size: 27,
            ),
          ),
          const SizedBox(width: 4),
        ],
      ),

      body: SingleChildScrollView(
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
                color: Color(0xFF10251F),
              ),
            ),

            const SizedBox(height: 12),

            _buildOpcaoConta(
              icone: Icons.person_outline_rounded,
              titulo: 'Conta',
              subtitulo: 'Dados pessoais e informações da conta',
              onTap: () {
                _abrirPagina(
                  context,
                  DadosPessoaisPage(
                    nomeUsuario: nomeUsuario,
                    emailUsuario: emailUsuario,
                  ),
                );
              },
            ),

            _buildOpcaoConta(
              icone: Icons.groups_outlined,
              titulo: 'Minha equipe',
              subtitulo: 'Gerencie sua equipe',
              onTap: () {
                _abrirPagina(context, const MinhaEquipePage());
              },
            ),

            _buildOpcaoConta(
              icone: Icons.settings_outlined,
              titulo: 'Preferências',
              subtitulo: 'Personalize sua experiência',
              onTap: () {
                _abrirPagina(context, const PreferenciasPage());
              },
            ),

            _buildOpcaoConta(
              icone: Icons.lock_outline_rounded,
              titulo: 'Privacidade',
              subtitulo: 'Controle sua privacidade',
              onTap: () {
                _abrirPagina(context, const PrivacidadePage());
              },
            ),

            _buildOpcaoConta(
              icone: Icons.shield_outlined,
              titulo: 'Segurança',
              subtitulo: 'Senha e segurança da conta',
              onTap: () {
                _abrirPagina(context, const SegurancaPage());
              },
            ),

            const SizedBox(height: 20),

            const Text(
              'Ajuda',
              style: TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.bold,
                color: Color(0xFF10251F),
              ),
            ),

            const SizedBox(height: 12),

            _buildOpcaoConta(
              icone: Icons.help_outline_rounded,
              titulo: 'Ajuda e suporte',
              subtitulo: 'Tire suas dúvidas',
              onTap: () {
                _abrirPagina(context, const AjudaSuportePage());
              },
            ),

            _buildOpcaoConta(
              icone: Icons.info_outline_rounded,
              titulo: 'Sobre o SATE',
              subtitulo: 'Informações sobre o aplicativo',
              onTap: () {
                _abrirPagina(context, const SobreSatePage());
              },
            ),

            const SizedBox(height: 22),

            _buildBotaoSair(context),
          ],
        ),
      ),
    );
  }

  // ============================================================
  // RESUMO DO USUÁRIO (sem "Ver perfil")
  // ============================================================
  Widget _buildResumoUsuario() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE8DFD3)),
        boxShadow: [
          BoxShadow(
            color: Color(0xFF10251F).withValues(alpha: 0.025),
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
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              color: verdeClaro,
            ),
            child: const Icon(
              Icons.person_rounded,
              color: verde,
              size: 29,
            ),
          ),

          const SizedBox(width: 12),

          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  nomeUsuario,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: verdeEscuro,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  'Treinador',
                  style: const TextStyle(fontSize: 12, color: cinza),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ============================================================
  // OPÇÃO DE CONTA
  // ============================================================
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
        border: Border.all(color: const Color(0xFFE8DFD3)),
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
          style: TextStyle(fontSize: 11, color: Color(0xFF68736F)),
        ),
        trailing: Icon(
          Icons.arrow_forward_ios_rounded,
          size: 15,
          color: Color(0xFF8A938F),
        ),
      ),
    );
  }

  // ============================================================
  // BOTÃO SAIR
  // ============================================================
  Widget _buildBotaoSair(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 50,
      child: OutlinedButton.icon(
        onPressed: () {
          _confirmarSaida(context);
        },
        icon: const Icon(Icons.logout_rounded, color: Color(0xFFC0392B)),
        label: const Text(
          'Sair da conta',
          style: TextStyle(
            color: Color(0xFFC0392B),
            fontWeight: FontWeight.w600,
          ),
        ),
        style: OutlinedButton.styleFrom(
          side: const BorderSide(color: Color(0xFFFDE6EC)),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15),
          ),
        ),
      ),
    );
  }

  // ============================================================
  // NAVEGAÇÃO
  // ============================================================
  void _abrirPagina(BuildContext context, Widget pagina) {
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
                style: TextStyle(color: Color(0xFF8A938F)),
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
                style: TextStyle(color: Color(0xFFC0392B)),
              ),
            ),
          ],
        );
      },
    );
  }
}

// ===================================================================
// TELA INTERNA PADRÃO (usada por todas as subtelas)
// ===================================================================

const Color verdeAtleta = Color(0xFF005942);

class _TelaInterna extends StatelessWidget {
  final String titulo;
  final Widget child;

  const _TelaInterna({required this.titulo, required this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF5EE),
      appBar: AppBar(
        backgroundColor: const Color(0xFFFAF5EE),
        elevation: 0,
        centerTitle: false,
        leading: IconButton(
          onPressed: () {
            Navigator.pop(context);
          },
          icon: const Icon(
            Icons.arrow_back_rounded,
            color: Color(0xFF10251F),
            size: 28,
          ),
        ),
        title: Text(
          titulo,
          style: const TextStyle(
            color: Color(0xFF10251F),
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
    return _TelaInterna(
      titulo: 'Dados pessoais',
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
            icone: Icons.badge_outlined,
            titulo: 'Tipo de usuário',
            valor: 'Treinador',
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
          const _MembroEquipe(nome: 'João Silva', funcao: 'Atleta'),
          const _MembroEquipe(nome: 'Ana Costa', funcao: 'Atleta'),
          const _MembroEquipe(nome: 'Carlos Mendes', funcao: 'Atleta'),
          const _MembroEquipe(nome: 'Mariana Souza', funcao: 'Atleta'),
        ],
      ),
    );
  }
}

// ===================================================================
// PREFERÊNCIAS
// ===================================================================

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

// ===================================================================
// PRIVACIDADE
// ===================================================================

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
            subtitulo: 'Permitir que outros vejam seu perfil',
            valor: perfilPublico,
            onChanged: (valor) {
              setState(() {
                perfilPublico = valor;
              });
            },
          ),
          _SwitchItem(
            titulo: 'Mostrar estatísticas',
            subtitulo: 'Exibir suas estatísticas',
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

// ===================================================================
// SEGURANÇA
// ===================================================================

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

// ===================================================================
// AJUDA E SUPORTE
// ===================================================================

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
          _Pergunta(titulo: 'Como gerenciar minha equipe?'),
          _Pergunta(titulo: 'Como vincular atletas?'),
          _Pergunta(titulo: 'Como alterar meus dados?'),
          _Pergunta(titulo: 'Como entrar em contato com o suporte?'),
        ],
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
              border: Border.all(color: const Color(0xFFE8DFD3)),
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
                  style: TextStyle(color: Color(0xFF8A938F)),
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

// ===================================================================
// NOTIFICAÇÕES
// ===================================================================

class NotificacoesPage extends StatelessWidget {
  const NotificacoesPage({super.key});

  @override
  Widget build(BuildContext context) {
    return _TelaInterna(
      titulo: 'Notificações',
      child: Column(
        children: [
          _Notificacao(
            icone: Icons.calendar_month_outlined,
            titulo: 'Novo treino agendado',
            descricao: 'Treino de resistência hoje às 08:00.',
            tempo: 'Agora',
          ),
          _Notificacao(
            icone: Icons.groups_outlined,
            titulo: 'Novo atleta na equipe',
            descricao: 'Um novo atleta foi adicionado à equipe.',
            tempo: '20 min',
          ),
          _Notificacao(
            icone: Icons.notifications_none_rounded,
            titulo: 'Lembrete de treino',
            descricao: 'Você possui um treino próximo.',
            tempo: '1h',
          ),
          _Notificacao(
            icone: Icons.check_circle_outline_rounded,
            titulo: 'Treino concluído',
            descricao: 'O treino de hoje foi registrado.',
            tempo: '3h',
          ),
        ],
      ),
    );
  }
}

// ===================================================================
// WIDGETS AUXILIARES
// ===================================================================

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
        border: Border.all(color: const Color(0xFFE8DFD3)),
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
                  style: const TextStyle(fontSize: 11, color: Color(0xFF8A938F)),
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
        border: Border.all(color: const Color(0xFFE8DFD3)),
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
                  style: const TextStyle(fontSize: 11, color: Color(0xFF8A938F)),
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
        border: Border.all(color: const Color(0xFFE8DFD3)),
      ),
      child: ListTile(
        onTap: onTap,
        leading: Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            color: const Color(0xFFDFF7EE),
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
        border: Border.all(color: const Color(0xFFE8DFD3)),
      ),
      child: Row(
        children: [
          const CircleAvatar(
            backgroundColor: Color(0xFFDFF7EE),
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
            style: const TextStyle(fontSize: 11, color: Color(0xFF8A938F)),
          ),
        ],
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
        border: Border.all(color: const Color(0xFFE8DFD3)),
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
              style: TextStyle(fontSize: 12, color: Color(0xFF8A938F)),
            ),
          ),
        ],
      ),
    );
  }
}

class _Notificacao extends StatelessWidget {
  final IconData icone;
  final String titulo;
  final String descricao;
  final String tempo;

  const _Notificacao({
    required this.icone,
    required this.titulo,
    required this.descricao,
    required this.tempo,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(13),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(17),
        border: Border.all(color: const Color(0xFFE8DFD3)),
        boxShadow: [
          BoxShadow(
            color: Color(0xFF10251F).withValues(alpha: 0.025),
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
              color: const Color(0xFFDFF7EE),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icone, color: verdeAtleta, size: 21),
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
                    color: Color(0xFF68736F),
                    height: 1.3,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Text(
            tempo,
            style: TextStyle(fontSize: 9, color: Color(0xFF8A938F)),
          ),
        ],
      ),
    );
  }
}