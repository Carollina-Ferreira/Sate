
import 'package:flutter/material.dart';

import '../../assets/menu_inferior_atleta.dart';
import 'atleta_home_page.dart';
import 'atleta_treino_page.dart';
import 'atleta_desempenho_page.dart';
import 'atleta_feed_page.dart';
import 'atleta_notificacao_page.dart';

const Color _verdeAtleta = Color(0xFF00845F);
const Color _verdeEscuroAtleta = Color(0xFF006B4F);
const Color _fundoAtleta = Color(0xFFF7F7F7);
const Color _verdeClaroAtleta = Color(0xFFEAF5F1);
const Color _cinzaAtleta = Color(0xFF777777);

class AtletaPerfilPage extends StatefulWidget {
  final String nomeUsuario;

  const AtletaPerfilPage({super.key, required this.nomeUsuario});

  @override
  State<AtletaPerfilPage> createState() => _AtletaPerfilPageState();
}

class _AtletaPerfilPageState extends State<AtletaPerfilPage> {
  bool _visualizandoPerfil = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _fundoAtleta,
      body: SafeArea(
        child: _visualizandoPerfil ? _buildPerfilEsportivo() : _buildConta(),
      ),
      bottomNavigationBar: MenuInferiorAtleta(
        indiceSelecionado: 4,
        onItemSelecionado: (index) {
          Widget? pagina;
          switch (index) {
            case 0:
              pagina = const AtletaHomePage();
              break;
            case 1:
              pagina = const AtletaTreinoPage();
              break;
            case 2:
              pagina = const AtletaDesempenhoPage();
              break;
            case 3:
              pagina = const AtletaFeedPage();
              break;
            case 4:
              return;
          }
          if (pagina != null) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (_) => pagina!),
            );
          }
        },
      ),
    );
  }

  Widget _buildCabecalho({required String titulo, required VoidCallback voltarAcao}) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(12, 6, 12, 10),
      decoration: const BoxDecoration(
        color: _verdeEscuroAtleta,
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(22),
          bottomRight: Radius.circular(22),
        ),
      ),
      child: Row(
        children: [
          IconButton(
            onPressed: voltarAcao,
            icon: const Icon(Icons.arrow_back_rounded, color: Colors.white),
          ),
          Expanded(
            child: Text(
              titulo,
              style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
            ),
          ),
          IconButton(
            tooltip: 'Notificações',
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const AtletaNotificacaoPage()),
            ),
            icon: const Icon(Icons.notifications_none_rounded, color: Colors.white, size: 25),
          ),
        ],
      ),
    );
  }

  Widget _buildConta() {
    return Column(
      children: [
        _buildCabecalho(titulo: 'Perfil', voltarAcao: () => Navigator.maybePop(context)),
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 28),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _cardUsuario(),
                const SizedBox(height: 22),
                _tituloSecao('Configurações da conta'),
                const SizedBox(height: 10),
                _opcaoConta(
                  icone: Icons.person_outline_rounded,
                  titulo: 'Conta',
                  subtitulo: 'Informações pessoais',
                  onTap: () => _abrirPagina(ContaPage(nomeUsuario: widget.nomeUsuario)),
                ),
                _opcaoConta(
                  icone: Icons.settings_outlined,
                  titulo: 'Preferências',
                  subtitulo: 'Personalize sua experiência',
                  onTap: () => _abrirPagina(const PreferenciasPage()),
                ),
                _opcaoConta(
                  icone: Icons.lock_outline_rounded,
                  titulo: 'Privacidade',
                  subtitulo: 'Controle seus dados',
                  onTap: () => _abrirPagina(const PrivacidadePage()),
                ),
                _opcaoConta(
                  icone: Icons.shield_outlined,
                  titulo: 'Segurança',
                  subtitulo: 'Proteja sua conta',
                  onTap: () => _abrirPagina(const SegurancaPage()),
                ),
                const SizedBox(height: 18),
                _tituloSecao('Ajuda'),
                const SizedBox(height: 10),
                _opcaoConta(
                  icone: Icons.help_outline_rounded,
                  titulo: 'Ajuda e suporte',
                  subtitulo: 'Tire suas dúvidas',
                  onTap: () => _abrirPagina(const AjudaSuportePage()),
                ),
                _opcaoConta(
                  icone: Icons.info_outline_rounded,
                  titulo: 'Sobre o SATE',
                  subtitulo: 'Informações sobre o aplicativo',
                  onTap: () => _abrirPagina(const SobreSatePage()),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: OutlinedButton.icon(
                    onPressed: _confirmarSaida,
                    icon: const Icon(Icons.logout_rounded, size: 18),
                    label: const Text('Sair da conta', style: TextStyle(fontWeight: FontWeight.w600)),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.red.shade600,
                      side: BorderSide(color: Colors.red.shade200),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _cardUsuario() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: _decoracaoCard(),
      child: Row(
        children: [
          const CircleAvatar(
            radius: 32,
            backgroundColor: Color(0xFFE5F1E9),
            child: Icon(Icons.person_rounded, color: _verdeAtleta, size: 35),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(widget.nomeUsuario, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: Colors.black87)),
                const SizedBox(height: 4),
                const Text('Atleta', style: TextStyle(fontSize: 11, color: _cinzaAtleta)),
                const SizedBox(height: 9),
                InkWell(
                  onTap: () => setState(() => _visualizandoPerfil = true),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text('Visualizar perfil esportivo', style: TextStyle(fontSize: 11, color: _verdeAtleta, fontWeight: FontWeight.w600)),
                      SizedBox(width: 4),
                      Icon(Icons.arrow_forward_rounded, color: _verdeAtleta, size: 14),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPerfilEsportivo() {
    return Column(
      children: [
        _buildCabecalho(
          titulo: 'Perfil esportivo',
          voltarAcao: () => setState(() => _visualizandoPerfil = false),
        ),
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 28),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: _decoracaoCard(),
                  child: Column(
                    children: [
                      const CircleAvatar(
                        radius: 41,
                        backgroundColor: Color(0xFFE5F1E9),
                        child: Icon(Icons.person_rounded, color: _verdeAtleta, size: 46),
                      ),
                      const SizedBox(height: 12),
                      Text(widget.nomeUsuario, style: const TextStyle(fontSize: 19, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      const Text('Falcões FC • Futebol', style: TextStyle(fontSize: 11, color: _cinzaAtleta)),
                      const SizedBox(height: 12),
                      Text(
                        'Meio-campista, apaixonado por futebol desde os 8 anos.\nFoco em evoluir a cada treino.',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 11, height: 1.4, color: Colors.grey.shade700),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  height: 46,
                  child: OutlinedButton.icon(
                    onPressed: () => _abrirPagina(EditarPerfilPage(nomeUsuario: widget.nomeUsuario)),
                    icon: const Icon(Icons.edit_outlined, size: 18),
                    label: const Text('Editar perfil', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: _verdeAtleta,
                      side: const BorderSide(color: _verdeAtleta),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ),
                const SizedBox(height: 18),
                Row(
                  children: [
                    Expanded(child: _estatistica('Posição', 'Meio-campo')),
                    const SizedBox(width: 8),
                    Expanded(child: _estatistica('Número', '#10', cor: _verdeAtleta)),
                    const SizedBox(width: 8),
                    Expanded(child: _estatistica('Publicações', '3', cor: const Color(0xFFE86BA5))),
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(child: _miniInformacao(Icons.trending_up_rounded, 'Frequência', '92%')),
                    const SizedBox(width: 8),
                    Expanded(child: _miniInformacao(Icons.check_circle_outline_rounded, 'Treinos concluídos', '18')),
                  ],
                ),
                const SizedBox(height: 18),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(15),
                  decoration: BoxDecoration(color: _verdeAtleta, borderRadius: BorderRadius.circular(16)),
                  child: const Row(
                    children: [
                      Icon(Icons.trending_up_rounded, color: Colors.white, size: 30),
                      SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Seu perfil esportivo', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
                            SizedBox(height: 4),
                            Text('Acompanhe seu desempenho, evolução, metas e feedbacks.', style: TextStyle(color: Colors.white, fontSize: 10, height: 1.3)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 22),
                _tituloSecao('Publicações'),
                const SizedBox(height: 10),
                Row(children: [Expanded(child: _publicacao()), const SizedBox(width: 8), Expanded(child: _publicacao()), const SizedBox(width: 8), Expanded(child: _publicacao())]),
                const SizedBox(height: 22),
                _tituloSecao('Meu perfil'),
                const SizedBox(height: 10),
                _opcaoPerfil(Icons.groups_outlined, 'Minha equipe', () => _abrirPagina(const MinhaEquipePage())),
                _opcaoPerfil(Icons.track_changes_outlined, 'Minhas metas', () => _abrirPagina(const MinhasMetasPage())),
                _opcaoPerfil(Icons.star_outline_rounded, 'Feedbacks', () => _abrirPagina(const FeedbacksPage())),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _tituloSecao(String texto) => Align(
        alignment: Alignment.centerLeft,
        child: Text(texto, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: Colors.black87)),
      );

  Widget _opcaoConta({required IconData icone, required String titulo, required String subtitulo, required VoidCallback onTap}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: _decoracaoCard(),
      child: ListTile(
        onTap: onTap,
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
        leading: Container(
          width: 46,
          height: 46,
          decoration: BoxDecoration(color: _verdeClaroAtleta, borderRadius: BorderRadius.circular(13)),
          child: Icon(icone, color: _verdeAtleta, size: 23),
        ),
        title: Text(titulo, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
        subtitle: Text(subtitulo, style: const TextStyle(fontSize: 11, color: _cinzaAtleta)),
        trailing: const Icon(Icons.chevron_right_rounded, color: _cinzaAtleta),
      ),
    );
  }

  Widget _opcaoPerfil(IconData icone, String texto, VoidCallback onTap) => Container(
        margin: const EdgeInsets.only(bottom: 10),
        decoration: _decoracaoCard(),
        child: ListTile(
          onTap: onTap,
          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 3),
          leading: Container(
            width: 46,
            height: 46,
            decoration: BoxDecoration(color: _verdeClaroAtleta, borderRadius: BorderRadius.circular(13)),
            child: Icon(icone, color: _verdeAtleta, size: 23),
          ),
          title: Text(texto, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
          trailing: const Icon(Icons.chevron_right_rounded, color: _cinzaAtleta),
        ),
      );

  Widget _estatistica(String titulo, String valor, {Color cor = Colors.black87}) => Container(
        height: 72,
        padding: const EdgeInsets.all(11),
        decoration: _decoracaoCard(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(titulo, style: const TextStyle(fontSize: 9, color: _cinzaAtleta)),
            const SizedBox(height: 5),
            Text(valor, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: cor)),
          ],
        ),
      );

  Widget _miniInformacao(IconData icone, String titulo, String valor) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: _decoracaoCard(),
        child: Row(
          children: [
            Icon(icone, size: 18, color: _verdeAtleta),
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(titulo, style: const TextStyle(fontSize: 9, color: _cinzaAtleta)),
                  const SizedBox(height: 2),
                  Text(valor, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
          ],
        ),
      );

  Widget _publicacao() => Container(
        height: 90,
        decoration: BoxDecoration(color: Colors.grey.shade200, borderRadius: BorderRadius.circular(12)),
        child: Icon(Icons.image_outlined, color: Colors.grey.shade400, size: 28),
      );

  BoxDecoration _decoracaoCard() => BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(17),
        border: Border.all(color: const Color(0xFFE0E7E4)),
      );

  void _abrirPagina(Widget pagina) {
    Navigator.push(context, MaterialPageRoute(builder: (_) => pagina));
  }

  void _confirmarSaida() {
    showDialog<void>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: const Text('Sair da conta?', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        content: const Text('Você precisará entrar novamente para acessar sua conta.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(dialogContext), child: const Text('CANCELAR')),
          TextButton(
            onPressed: () {
              Navigator.pop(dialogContext);
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Implemente aqui a saída da conta.')));
            },
            child: const Text('SAIR', style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}

class _TelaPerfilInterna extends StatelessWidget {
  final String titulo;
  final Widget child;

  const _TelaPerfilInterna({required this.titulo, required this.child});

  @override
  Widget build(BuildContext context) => Scaffold(
        backgroundColor: _fundoAtleta,
        appBar: AppBar(
          backgroundColor: _fundoAtleta,
          elevation: 0,
          centerTitle: false,
          iconTheme: const IconThemeData(color: Colors.black87),
          title: Text(titulo, style: const TextStyle(color: Colors.black87, fontSize: 19, fontWeight: FontWeight.bold)),
        ),
        body: SafeArea(
          child: SingleChildScrollView(padding: const EdgeInsets.fromLTRB(16, 8, 16, 30), child: child),
        ),
      );
}

class EditarPerfilPage extends StatefulWidget {
  final String nomeUsuario;
  const EditarPerfilPage({super.key, this.nomeUsuario = 'Atleta'});

  @override
  State<EditarPerfilPage> createState() => _EditarPerfilPageState();
}

class _EditarPerfilPageState extends State<EditarPerfilPage> {
  late final TextEditingController nomeController;
  final posicaoController = TextEditingController(text: 'Meio-campista');
  final numeroController = TextEditingController(text: '10');
  final equipeController = TextEditingController(text: 'Falcões FC');
  final descricaoController = TextEditingController(text: 'Meio-campista, apaixonado por futebol desde os 8 anos.');

  @override
  void initState() {
    super.initState();
    nomeController = TextEditingController(text: widget.nomeUsuario);
  }

  @override
  void dispose() {
    nomeController.dispose();
    posicaoController.dispose();
    numeroController.dispose();
    equipeController.dispose();
    descricaoController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => _TelaPerfilInterna(
        titulo: 'Editar perfil',
        child: Column(
          children: [
            const CircleAvatar(radius: 45, backgroundColor: _verdeClaroAtleta, child: Icon(Icons.person_rounded, color: _verdeAtleta, size: 48)),
            TextButton(onPressed: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('A alteração de foto será implementada.'))), child: const Text('Alterar foto', style: TextStyle(color: _verdeAtleta))),
            _campo('Nome', nomeController),
            _campo('Posição', posicaoController),
            Row(children: [Expanded(child: _campo('Número', numeroController)), const SizedBox(width: 10), Expanded(child: _campo('Equipe', equipeController))]),
            _campo('Descrição', descricaoController, maxLines: 4),
            const SizedBox(height: 8),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Perfil atualizado!')));
                  Navigator.pop(context);
                },
                style: ElevatedButton.styleFrom(backgroundColor: _verdeAtleta, foregroundColor: Colors.white, elevation: 0, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
                child: const Text('SALVAR ALTERAÇÕES', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      );
}

Widget _campo(String titulo, TextEditingController controller, {int maxLines = 1}) => Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: TextField(
        controller: controller,
        maxLines: maxLines,
        decoration: InputDecoration(
          labelText: titulo,
          filled: true,
          fillColor: Colors.white,
          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Color(0xFFE0E7E4))),
          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Color(0xFFE0E7E4))),
          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: _verdeAtleta, width: 1.5)),
        ),
      ),
    );

class MinhaEquipePage extends StatelessWidget {
  const MinhaEquipePage({super.key});
  @override
  Widget build(BuildContext context) => _TelaPerfilInterna(
        titulo: 'Minha equipe',
        child: Column(children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(color: _verdeAtleta, borderRadius: BorderRadius.circular(18)),
            child: const Row(children: [Icon(Icons.groups_rounded, color: Colors.white, size: 35), SizedBox(width: 14), Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('Falcões FC', style: TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.bold)), SizedBox(height: 4), Text('4 atletas na equipe', style: TextStyle(color: Colors.white, fontSize: 11))]))]),
          ),
          const SizedBox(height: 14),
          _membro('João Silva', 'Meio-campista', voce: true),
          _membro('Carlos Mendes', 'Atacante'),
          _membro('Ana Costa', 'Defensora'),
          _membro('Mariana Souza', 'Goleira'),
        ]),
      );
}

Widget _membro(String nome, String funcao, {bool voce = false}) => Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFFE0E7E4))),
      child: Row(children: [const CircleAvatar(backgroundColor: _verdeClaroAtleta, child: Icon(Icons.person_rounded, color: _verdeAtleta)), const SizedBox(width: 12), Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(nome, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)), const SizedBox(height: 3), Text(funcao, style: const TextStyle(fontSize: 10, color: _cinzaAtleta))])), if (voce) const Text('Você', style: TextStyle(color: _verdeAtleta, fontSize: 10, fontWeight: FontWeight.bold))]),
    );

class MinhasMetasPage extends StatelessWidget {
  const MinhasMetasPage({super.key});
  @override
  Widget build(BuildContext context) => _TelaPerfilInterna(
        titulo: 'Minhas metas',
        child: Column(children: [
          Container(width: double.infinity, padding: const EdgeInsets.all(18), decoration: BoxDecoration(color: _verdeAtleta, borderRadius: BorderRadius.circular(18)), child: const Row(children: [Icon(Icons.track_changes_rounded, color: Colors.white, size: 36), SizedBox(width: 14), Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('Suas metas', style: TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.bold)), SizedBox(height: 4), Text('Continue acompanhando sua evolução.', style: TextStyle(color: Colors.white, fontSize: 11))]))])),
          const SizedBox(height: 16),
          _meta('Aumentar frequência nos treinos', '92%', .92),
          _meta('Concluir 20 treinos', '18/20', .90),
          _meta('Melhorar desempenho', '75%', .75),
          _meta('Participar de competições', '2/3', .66),
        ]),
      );
}

Widget _meta(String titulo, String progresso, double percentual) => Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFFE0E7E4))),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Row(children: [const Icon(Icons.track_changes_outlined, color: _verdeAtleta, size: 20), const SizedBox(width: 9), Expanded(child: Text(titulo, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600))), Text(progresso, style: const TextStyle(color: _verdeAtleta, fontSize: 12, fontWeight: FontWeight.bold))]), const SizedBox(height: 12), ClipRRect(borderRadius: BorderRadius.circular(10), child: LinearProgressIndicator(value: percentual, minHeight: 7, backgroundColor: _verdeClaroAtleta, valueColor: const AlwaysStoppedAnimation<Color>(_verdeAtleta)))]),
    );

class FeedbacksPage extends StatelessWidget {
  const FeedbacksPage({super.key});
  @override
  Widget build(BuildContext context) => _TelaPerfilInterna(
        titulo: 'Feedbacks',
        child: Column(children: [
          Container(width: double.infinity, padding: const EdgeInsets.all(18), decoration: BoxDecoration(color: _verdeAtleta, borderRadius: BorderRadius.circular(18)), child: const Row(children: [Icon(Icons.star_rounded, color: Colors.white, size: 35), SizedBox(width: 14), Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('Seus feedbacks', style: TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.bold)), SizedBox(height: 4), Text('Acompanhe as avaliações da equipe.', style: TextStyle(color: Colors.white, fontSize: 11))]))])),
          const SizedBox(height: 16),
          _feedback('Treinador', 'Hoje', 'Ótimo desempenho nos últimos treinos. Continue mantendo o foco e a disciplina.'),
          _feedback('Preparador físico', 'Há 3 dias', 'Sua evolução física está sendo muito positiva. Continue seguindo o planejamento.'),
          _feedback('Treinador', 'Há 1 semana', 'Boa participação nos treinos coletivos e excelente evolução técnica.'),
        ]),
      );
}

Widget _feedback(String autor, String data, String texto) => Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFFE0E7E4))),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Row(children: [const CircleAvatar(radius: 19, backgroundColor: _verdeClaroAtleta, child: Icon(Icons.person_rounded, color: _verdeAtleta, size: 21)), const SizedBox(width: 10), Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(autor, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)), const SizedBox(height: 2), Text(data, style: const TextStyle(fontSize: 9, color: Color(0xFF888888)))])), const Icon(Icons.star_rounded, color: Color(0xFFE86BA5), size: 21)]), const SizedBox(height: 12), Text(texto, style: const TextStyle(fontSize: 11, color: Color(0xFF666666), height: 1.45))]),
    );

class ContaPage extends StatefulWidget {
  final String nomeUsuario;
  const ContaPage({super.key, this.nomeUsuario = 'João Silva'});
  @override
  State<ContaPage> createState() => _ContaPageState();
}

class _ContaPageState extends State<ContaPage> {
  late final TextEditingController nomeController;
  final emailController = TextEditingController(text: 'atleta@email.com');
  final telefoneController = TextEditingController(text: '(11) 99999-9999');
  @override
  void initState() { super.initState(); nomeController = TextEditingController(text: widget.nomeUsuario); }
  @override
  void dispose() { nomeController.dispose(); emailController.dispose(); telefoneController.dispose(); super.dispose(); }
  @override
  Widget build(BuildContext context) => _TelaPerfilInterna(titulo: 'Conta', child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [const Text('Informações pessoais', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)), const SizedBox(height: 12), _campo('Nome', nomeController), _campo('E-mail', emailController), _campo('Telefone', telefoneController), const SizedBox(height: 8), SizedBox(width: double.infinity, height: 48, child: ElevatedButton(onPressed: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Informações atualizadas!'))), style: ElevatedButton.styleFrom(backgroundColor: _verdeAtleta, foregroundColor: Colors.white, elevation: 0, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))), child: const Text('SALVAR ALTERAÇÕES', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold))))]));
}

class PreferenciasPage extends StatefulWidget {
  const PreferenciasPage({super.key});
  @override
  State<PreferenciasPage> createState() => _PreferenciasPageState();
}
class _PreferenciasPageState extends State<PreferenciasPage> {
  bool notificacoes = true, lembretes = true, atualizacoes = true;
  @override
  Widget build(BuildContext context) => _TelaPerfilInterna(titulo: 'Preferências', child: Column(children: [_switchItem('Notificações', 'Receber notificações do aplicativo', notificacoes, (v) => setState(() => notificacoes = v)), _switchItem('Lembretes de treino', 'Receber lembretes dos próximos treinos', lembretes, (v) => setState(() => lembretes = v)), _switchItem('Atualizações', 'Receber novidades sobre o SATE', atualizacoes, (v) => setState(() => atualizacoes = v))]));
}

Widget _switchItem(String titulo, String subtitulo, bool valor, ValueChanged<bool> onChanged) => Container(margin: const EdgeInsets.only(bottom: 10), padding: const EdgeInsets.all(14), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFFE0E7E4))), child: Row(children: [Container(width: 44, height: 44, decoration: BoxDecoration(color: _verdeClaroAtleta, borderRadius: BorderRadius.circular(12)), child: const Icon(Icons.settings_outlined, color: _verdeAtleta)), const SizedBox(width: 12), Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(titulo, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)), const SizedBox(height: 3), Text(subtitulo, style: const TextStyle(fontSize: 10, color: _cinzaAtleta))])), Switch(value: valor, onChanged: onChanged, activeThumbColor: _verdeAtleta)]));

class PrivacidadePage extends StatefulWidget {
  const PrivacidadePage({super.key});
  @override
  State<PrivacidadePage> createState() => _PrivacidadePageState();
}
class _PrivacidadePageState extends State<PrivacidadePage> {
  bool perfilPublico = true, mostrarEquipe = true, mostrarDesempenho = false;
  @override
  Widget build(BuildContext context) => _TelaPerfilInterna(titulo: 'Privacidade', child: Column(children: [_privacidadeItem('Perfil público', 'Permitir que outros atletas visualizem seu perfil', perfilPublico, (v) => setState(() => perfilPublico = v)), _privacidadeItem('Mostrar equipe', 'Exibir sua equipe no perfil', mostrarEquipe, (v) => setState(() => mostrarEquipe = v)), _privacidadeItem('Mostrar desempenho', 'Permitir que seu desempenho seja visualizado', mostrarDesempenho, (v) => setState(() => mostrarDesempenho = v))]));
}

Widget _privacidadeItem(String titulo, String subtitulo, bool valor, ValueChanged<bool> onChanged) => Container(margin: const EdgeInsets.only(bottom: 10), padding: const EdgeInsets.all(14), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFFE0E7E4))), child: Row(children: [const Icon(Icons.lock_outline_rounded, color: _verdeAtleta, size: 25), const SizedBox(width: 12), Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(titulo, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)), const SizedBox(height: 3), Text(subtitulo, style: const TextStyle(fontSize: 10, color: _cinzaAtleta))])), Switch(value: valor, onChanged: onChanged, activeThumbColor: _verdeAtleta)]));

class SegurancaPage extends StatelessWidget {
  const SegurancaPage({super.key});
  @override
  Widget build(BuildContext context) => _TelaPerfilInterna(titulo: 'Segurança', child: Column(children: [_itemSeguranca(context, Icons.lock_reset_rounded, 'Alterar senha', 'Atualize sua senha de acesso'), _itemSeguranca(context, Icons.devices_rounded, 'Dispositivos conectados', 'Veja onde sua conta está conectada'), _itemSeguranca(context, Icons.verified_user_outlined, 'Verificação de segurança', 'Confira a segurança da sua conta')]));
}
Widget _itemSeguranca(BuildContext context, IconData icone, String titulo, String subtitulo) => Container(margin: const EdgeInsets.only(bottom: 10), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFFE0E7E4))), child: ListTile(onTap: () => ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$titulo selecionado.'))), leading: Container(width: 46, height: 46, decoration: BoxDecoration(color: _verdeClaroAtleta, borderRadius: BorderRadius.circular(12)), child: Icon(icone, color: _verdeAtleta)), title: Text(titulo, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)), subtitle: Text(subtitulo, style: const TextStyle(fontSize: 10, color: _cinzaAtleta)), trailing: const Icon(Icons.chevron_right_rounded, color: _cinzaAtleta)));

class AjudaSuportePage extends StatelessWidget {
  const AjudaSuportePage({super.key});
  @override
  Widget build(BuildContext context) => _TelaPerfilInterna(titulo: 'Ajuda e suporte', child: Column(children: [Container(width: double.infinity, padding: const EdgeInsets.all(18), decoration: BoxDecoration(color: _verdeAtleta, borderRadius: BorderRadius.circular(18)), child: const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Icon(Icons.help_outline_rounded, color: Colors.white, size: 34), SizedBox(height: 10), Text('Como podemos ajudar?', style: TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.bold)), SizedBox(height: 4), Text('Encontre respostas para suas dúvidas sobre o SATE.', style: TextStyle(color: Colors.white, fontSize: 11))])), const SizedBox(height: 16), _pergunta('Como visualizar meus treinos?'), _pergunta('Como acompanhar meu desempenho?'), _pergunta('Como editar meu perfil?'), _pergunta('Como alterar minhas preferências?'), _pergunta('Como entrar em contato com o suporte?')]));
}
Widget _pergunta(String texto) => Container(margin: const EdgeInsets.only(bottom: 10), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFFE0E7E4))), child: ExpansionTile(leading: const Icon(Icons.help_outline_rounded, color: _verdeAtleta), title: Text(texto, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)), children: const [Padding(padding: EdgeInsets.fromLTRB(14, 0, 14, 14), child: Text('Aqui você encontrará informações e orientações sobre essa funcionalidade do aplicativo.', style: TextStyle(fontSize: 11, color: _cinzaAtleta, height: 1.4)))]));

class SobreSatePage extends StatelessWidget {
  const SobreSatePage({super.key});
  @override
  Widget build(BuildContext context) => _TelaPerfilInterna(titulo: 'Sobre o SATE', child: Column(children: [Container(width: double.infinity, padding: const EdgeInsets.all(24), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18), border: Border.all(color: const Color(0xFFE0E7E4))), child: Column(children: [Container(width: 80, height: 80, decoration: BoxDecoration(color: _verdeClaroAtleta, borderRadius: BorderRadius.circular(20)), child: const Icon(Icons.sports_soccer_rounded, color: _verdeAtleta, size: 45)), const SizedBox(height: 16), const Text('SATE', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: _verdeEscuroAtleta)), const SizedBox(height: 5), const Text('Sistema de Acompanhamento e Treinamento Esportivo', textAlign: TextAlign.center, style: TextStyle(fontSize: 11, color: _cinzaAtleta, height: 1.4)), const SizedBox(height: 18), const Text('O SATE foi desenvolvido para auxiliar atletas e equipes no acompanhamento de treinos, desempenho, evolução e interação entre os membros.', textAlign: TextAlign.center, style: TextStyle(fontSize: 11, color: _cinzaAtleta, height: 1.5))])), const SizedBox(height: 16), _informacao('Versão', '1.0.0'), _informacao('Desenvolvido para', 'Atletas e equipes esportivas'), _informacao('Aplicativo', 'SATE')]));
}
Widget _informacao(String titulo, String valor) => Container(width: double.infinity, margin: const EdgeInsets.only(bottom: 10), padding: const EdgeInsets.all(15), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), border: Border.all(color: const Color(0xFFE0E7E4))), child: Row(children: [Expanded(child: Text(titulo, style: const TextStyle(fontSize: 12, color: _cinzaAtleta))), Text(valor, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.black87))]));
