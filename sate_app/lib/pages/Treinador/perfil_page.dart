import 'package:flutter/material.dart';

class PerfilPage extends StatelessWidget {
  const PerfilPage({super.key});

  static const Color verde = Color(0xFF006B4F);
  static const Color fundo = Color(0xFFFCFCFC);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: fundo,

      appBar: AppBar(
        title: const Text(
          'Perfil',
          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: verde,
        foregroundColor: Colors.white,
        elevation: 0,
      ),

      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Center(
            child: Container(
              width: 100,
              height: 100,

              decoration: BoxDecoration(
                shape: BoxShape.circle,

                border: Border.all(
                  color: verde,
                  width: 3,
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
                    return const Icon(
                      Icons.person,
                      size: 55,
                      color: verde,
                    );
                  },
                ),
              ),
            ),
          ),

          const SizedBox(height: 16),

          const Center(
            child: Text(
              'Professor Marcos',
              style: TextStyle(
                fontSize: 21,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),

          const SizedBox(height: 5),

          Center(
            child: Text(
              'Treinador',
              style: TextStyle(
                color: Colors.grey.shade600,
                fontSize: 13,
              ),
            ),
          ),

          const SizedBox(height: 30),

          _opcao(
            icone: Icons.person_outline,
            titulo: 'Dados pessoais',
            subtitulo: 'Nome, email e informações',
            onTap: () {},
          ),

          _opcao(
            icone: Icons.groups_outlined,
            titulo: 'Minha equipe',
            subtitulo: 'Gerencie sua equipe',
            onTap: () {},
          ),

          _opcao(
            icone: Icons.notifications_none,
            titulo: 'Notificações',
            subtitulo: 'Configure suas notificações',
            onTap: () {},
          ),

          _opcao(
            icone: Icons.lock_outline,
            titulo: 'Segurança',
            subtitulo: 'Senha e segurança da conta',
            onTap: () {},
          ),

          _opcao(
            icone: Icons.settings_outlined,
            titulo: 'Configurações',
            subtitulo: 'Preferências do aplicativo',
            onTap: () {},
          ),

          const SizedBox(height: 15),

          Container(
            decoration: BoxDecoration(
              color: Colors.white,

              borderRadius: BorderRadius.circular(16),

              border: Border.all(
                color: const Color(0xFFE1E1E1),
              ),
            ),

            child: ListTile(
              leading: const Icon(
                Icons.logout,
                color: Colors.red,
              ),

              title: const Text(
                'Sair da conta',
                style: TextStyle(
                  color: Colors.red,
                  fontWeight: FontWeight.w600,
                ),
              ),

              onTap: () {
                Navigator.pop(context);
              },
            ),
          ),
        ],
      ),
    );
  }

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

        borderRadius: BorderRadius.circular(16),

        border: Border.all(
          color: const Color(0xFFE1E1E1),
        ),
      ),

      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 5,
        ),

        leading: Container(
          width: 42,
          height: 42,

          decoration: BoxDecoration(
            color: verde.withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(12),
          ),

          child: Icon(
            icone,
            color: verde,
            size: 21,
          ),
        ),

        title: Text(
          titulo,
          style: const TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 14,
          ),
        ),

        subtitle: Text(
          subtitulo,
          style: const TextStyle(
            fontSize: 11,
            color: Colors.grey,
          ),
        ),

        trailing: const Icon(
          Icons.arrow_forward_ios,
          size: 15,
          color: Colors.grey,
        ),

        onTap: onTap,
      ),
    );
  }
}