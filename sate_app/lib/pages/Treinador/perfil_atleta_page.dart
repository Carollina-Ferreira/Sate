import 'package:flutter/material.dart';

class PerfilAtletaPage extends StatefulWidget {
  final String nome;
  final String modalidade;
  final String frequencia;
  final String inicial;

  const PerfilAtletaPage({
    super.key,
    required this.nome,
    required this.modalidade,
    required this.frequencia,
    required this.inicial,
  });

  @override
  State<PerfilAtletaPage> createState() => _PerfilAtletaPageState();
}

class _PerfilAtletaPageState extends State<PerfilAtletaPage> {
  static const Color verde = Color(0xFF006B4F);
  static const Color verdeClaro = Color(0xFFE8F5F0);
  static const Color fundo = Color(0xFFF4F8F6);
  static const Color texto = Color(0xFF12261F);
  static const Color textoSecundario = Color(0xFF68736F);
  static const Color linha = Color(0xFFDCE7E2);

  final List<Map<String, String>> metas = [
    {
      'titulo': 'Melhorar resistência',
      'descricao': 'Aumentar o desempenho nos treinos aeróbicos.',
      'progresso': '65',
      'prazo': '30/09/2026',
    },
    {
      'titulo': 'Aumentar frequência',
      'descricao': 'Manter frequência acima de 90%.',
      'progresso': '80',
      'prazo': '15/10/2026',
    },
  ];

  final List<Map<String, String>> feedbacks = [
    {
      'texto':
          'A atleta apresentou uma ótima evolução nos últimos treinos. Demonstrou bastante dedicação e participação.',
      'data': 'Hoje • 09:30',
    },
    {
      'texto':
          'Melhorou bastante a execução dos exercícios. Continue mantendo esse ritmo.',
      'data': '25/08/2026',
    },
  ];

  // ============================================================
  // DATA E HORA
  // ============================================================

  String _formatarDataHora(DateTime data) {
    final String dia = data.day.toString().padLeft(2, '0');
    final String mes = data.month.toString().padLeft(2, '0');
    final String ano = data.year.toString();

    final String hora = data.hour.toString().padLeft(2, '0');
    final String minuto = data.minute.toString().padLeft(2, '0');

    return '$dia/$mes/$ano • $hora:$minuto';
  }

  // ============================================================
  // ADICIONAR META
  // ============================================================

  void _abrirAdicionarMeta() {
    final tituloController = TextEditingController();
    final descricaoController = TextEditingController();
    final prazoController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (modalContext) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(modalContext).viewInsets.bottom,
          ),
          child: Container(
            padding: const EdgeInsets.fromLTRB(24, 12, 24, 30),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(
                top: Radius.circular(28),
              ),
            ),
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _barraModal(),
                  const SizedBox(height: 22),
                  const Text(
                    'Adicionar meta',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: texto,
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Defina uma nova meta para acompanhar a evolução do atleta.',
                    style: TextStyle(
                      color: textoSecundario,
                      fontSize: 13,
                    ),
                  ),
                  const SizedBox(height: 22),
                  _campo(
                    controller: tituloController,
                    label: 'Nome da meta',
                    hint: 'Ex: Melhorar velocidade',
                    icone: Icons.flag_outlined,
                  ),
                  const SizedBox(height: 14),
                  _campo(
                    controller: descricaoController,
                    label: 'Descrição',
                    hint: 'Descreva o objetivo da meta',
                    icone: Icons.description_outlined,
                    maxLines: 3,
                  ),
                  const SizedBox(height: 14),
                  _campo(
                    controller: prazoController,
                    label: 'Prazo',
                    hint: 'Ex: 30/09/2026',
                    icone: Icons.calendar_today_outlined,
                  ),
                  const SizedBox(height: 22),
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      onPressed: () {
                        if (tituloController.text.trim().isEmpty) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Digite o nome da meta.'),
                            ),
                          );
                          return;
                        }

                        setState(() {
                          metas.insert(
                            0,
                            {
                              'titulo': tituloController.text.trim(),
                              'descricao':
                                  descricaoController.text.trim().isEmpty
                                      ? 'Meta definida pelo treinador.'
                                      : descricaoController.text.trim(),
                              'progresso': '0',
                              'prazo': prazoController.text.trim().isEmpty
                                  ? 'Sem prazo definido'
                                  : prazoController.text.trim(),
                            },
                          );
                        });

                        Navigator.pop(modalContext);

                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text(
                              'Meta adicionada com sucesso!',
                            ),
                            behavior: SnackBarBehavior.floating,
                          ),
                        );
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
                        'Adicionar meta',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
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
  }

  // ============================================================
  // ENVIAR FEEDBACK
  // ============================================================

  void _abrirEnviarFeedback() {
    final feedbackController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (modalContext) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(modalContext).viewInsets.bottom,
          ),
          child: Container(
            padding: const EdgeInsets.fromLTRB(24, 12, 24, 30),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(
                top: Radius.circular(28),
              ),
            ),
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _barraModal(),
                  const SizedBox(height: 22),
                  const Text(
                    'Enviar feedback',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: texto,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Envie uma mensagem para ${widget.nome}.',
                    style: const TextStyle(
                      color: textoSecundario,
                      fontSize: 13,
                    ),
                  ),
                  const SizedBox(height: 22),
                  TextField(
                    controller: feedbackController,
                    maxLines: 6,
                    textCapitalization: TextCapitalization.sentences,
                    decoration: InputDecoration(
                      hintText: 'Escreva seu feedback para o atleta...',
                      hintStyle: const TextStyle(
                        color: Colors.grey,
                      ),
                      alignLabelWithHint: true,
                      prefixIcon: const Padding(
                        padding: EdgeInsets.only(bottom: 85),
                        child: Icon(
                          Icons.chat_bubble_outline,
                          color: verde,
                        ),
                      ),
                      filled: true,
                      fillColor: fundo,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: BorderSide.none,
                      ),
                    ),
                  ),
                  const SizedBox(height: 22),
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      onPressed: () {
                        final textoFeedback =
                            feedbackController.text.trim();

                        if (textoFeedback.isEmpty) {
                          ScaffoldMessenger.of(modalContext).showSnackBar(
                            const SnackBar(
                              content: Text('Escreva um feedback.'),
                            ),
                          );
                          return;
                        }

                        final agora = DateTime.now();

                        setState(() {
                          feedbacks.insert(
                            0,
                            {
                              'texto': textoFeedback,
                              'data': _formatarDataHora(agora),
                            },
                          );
                        });

                        Navigator.pop(modalContext);

                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text(
                              'Feedback enviado com sucesso!',
                            ),
                            behavior: SnackBarBehavior.floating,
                          ),
                        );
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
                        'Enviar feedback',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
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
  }

  // ============================================================
  // EDITAR FEEDBACK
  // ============================================================

  void _abrirEditarFeedback(
    Map<String, String> feedback,
  ) {
    final feedbackController = TextEditingController(
      text: feedback['texto'] ?? '',
    );

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (modalContext) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(modalContext).viewInsets.bottom,
          ),
          child: Container(
            padding: const EdgeInsets.fromLTRB(24, 12, 24, 30),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(
                top: Radius.circular(28),
              ),
            ),
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _barraModal(),

                  const SizedBox(height: 22),

                  const Text(
                    'Editar feedback',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: texto,
                    ),
                  ),

                  const SizedBox(height: 6),

                  const Text(
                    'Altere o texto do feedback do atleta.',
                    style: TextStyle(
                      color: textoSecundario,
                      fontSize: 13,
                    ),
                  ),

                  const SizedBox(height: 22),

                  TextField(
                    controller: feedbackController,
                    maxLines: 6,
                    autofocus: true,
                    textCapitalization: TextCapitalization.sentences,
                    decoration: InputDecoration(
                      hintText: 'Escreva seu feedback...',
                      hintStyle: const TextStyle(
                        color: Colors.grey,
                      ),
                      alignLabelWithHint: true,
                      prefixIcon: const Padding(
                        padding: EdgeInsets.only(bottom: 85),
                        child: Icon(
                          Icons.edit_outlined,
                          color: verde,
                        ),
                      ),
                      filled: true,
                      fillColor: fundo,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: BorderSide.none,
                      ),
                    ),
                  ),

                  const SizedBox(height: 22),

                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      onPressed: () {
                        final novoTexto =
                            feedbackController.text.trim();

                        if (novoTexto.isEmpty) {
                          ScaffoldMessenger.of(modalContext).showSnackBar(
                            const SnackBar(
                              content: Text(
                                'Escreva um feedback.',
                              ),
                            ),
                          );
                          return;
                        }

                        final agora = DateTime.now();

                        setState(() {
                          feedback['texto'] = novoTexto;
                          feedback['data'] =
                              _formatarDataHora(agora);
                        });

                        Navigator.pop(modalContext);

                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text(
                              'Feedback atualizado com sucesso!',
                            ),
                            behavior: SnackBarBehavior.floating,
                          ),
                        );
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
                        'Salvar alterações',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
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
  }

  // ============================================================
  // EXCLUIR FEEDBACK
  // ============================================================

  void _confirmarExclusaoFeedback(
    Map<String, String> feedback,
  ) {
    showDialog(
      context: context,
      builder: (dialogContext) {
        return AlertDialog(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(22),
          ),
          title: const Text(
            'Excluir feedback?',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: texto,
            ),
          ),
          content: const Text(
            'Esse feedback será removido do perfil do atleta.',
            style: TextStyle(
              color: textoSecundario,
              height: 1.4,
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(dialogContext);
              },
              child: const Text(
                'Cancelar',
                style: TextStyle(
                  color: textoSecundario,
                ),
              ),
            ),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  feedbacks.remove(feedback);
                });

                Navigator.pop(dialogContext);

                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Feedback excluído.'),
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: verde,
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: const Text(
                'Excluir',
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  // ============================================================
  // BARRA DO MODAL
  // ============================================================

  Widget _barraModal() {
    return Center(
      child: Container(
        width: 45,
        height: 5,
        decoration: BoxDecoration(
          color: Colors.grey.shade300,
          borderRadius: BorderRadius.circular(20),
        ),
      ),
    );
  }

  // ============================================================
  // CAMPO
  // ============================================================

  Widget _campo({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icone,
    int maxLines = 1,
  }) {
    return TextField(
      controller: controller,
      maxLines: maxLines,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        prefixIcon: Padding(
          padding: EdgeInsets.only(
            bottom: maxLines > 1 ? 35 : 0,
          ),
          child: Icon(
            icone,
            color: verde,
          ),
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

  // ============================================================
  // BUILD
  // ============================================================

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: fundo,
      appBar: AppBar(
        backgroundColor: verde,
        foregroundColor: Colors.white,
        elevation: 0,
        title: const Text(
          'Perfil do atleta',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 20,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20, 22, 20, 40),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _cabecalho(),

            const SizedBox(height: 20),

            _tituloSecao('Resumo'),
            const SizedBox(height: 0),

            _resumo(),

            const SizedBox(height: 30),

            _tituloSecao('Desempenho'),
            const SizedBox(height: 14),

            _desempenho(),

            const SizedBox(height: 32),

            _cabecalhoSecao(
              titulo: 'Metas',
              botao: 'Adicionar',
              icone: Icons.add,
              onPressed: _abrirAdicionarMeta,
            ),

            const SizedBox(height: 12),

            if (metas.isEmpty)
              _estadoVazio(
                icone: Icons.flag_outlined,
                texto: 'Nenhuma meta cadastrada.',
              )
            else
              ...metas.map(_meta),

            const SizedBox(height: 32),

            _cabecalhoSecao(
              titulo: 'Feedbacks',
              botao: 'Enviar',
              icone: Icons.send_outlined,
              onPressed: _abrirEnviarFeedback,
            ),

            const SizedBox(height: 10),

            if (feedbacks.isEmpty)
              _estadoVazio(
                icone: Icons.chat_bubble_outline,
                texto: 'Nenhum feedback enviado.',
              )
            else
              ...feedbacks.map(_feedback),

            const SizedBox(height: 32),

            _tituloSecao('Atividade recente'),
            const SizedBox(height: 14),

            _atividades(),

            const SizedBox(height: 10),
          ],
        ),
      ),
    );
  }

  // ============================================================
  // CABEÇALHO
  // ============================================================

  Widget _cabecalho() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Container(
          width: 72,
          height: 72,
          decoration: BoxDecoration(
            color: verde,
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: verde.withOpacity(0.18),
                blurRadius: 14,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: Center(
            child: Text(
              widget.inicial,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 27,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),

        const SizedBox(width: 16),

        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                widget.nome,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  color: texto,
                  fontSize: 23,
                  fontWeight: FontWeight.bold,
                  height: 1.1,
                ),
              ),

              const SizedBox(height: 6),

              Text(
                widget.modalidade,
                style: const TextStyle(
                  color: textoSecundario,
                  fontSize: 14,
                ),
              ),

              const SizedBox(height: 9),

              Row(
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: const BoxDecoration(
                      color: verde,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 6),
                  const Text(
                    'Atleta ativo',
                    style: TextStyle(
                      color: verde,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  // ============================================================
  // RESUMO
  // ============================================================

  Widget _resumo() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10),
      decoration: const BoxDecoration(
        border: Border(
          bottom: BorderSide(
            color: linha,
          ),
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: _informacaoResumo(
              icone: Icons.calendar_month_outlined,
              titulo: 'Frequência',
              valor: widget.frequencia,
            ),
          ),

          Container(
            width: 1,
            height: 48,
            color: linha,
          ),

          Expanded(
            child: _informacaoResumo(
              icone: Icons.sports_soccer_outlined,
              titulo: 'Modalidade',
              valor: widget.modalidade,
            ),
          ),
        ],
      ),
    );
  }

  Widget _informacaoResumo({
    required IconData icone,
    required String titulo,
    required String valor,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      child: Row(
        children: [
          Icon(
            icone,
            color: verde,
            size: 23,
          ),

          const SizedBox(width: 11),

          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  titulo,
                  style: const TextStyle(
                    color: textoSecundario,
                    fontSize: 11,
                  ),
                ),

                const SizedBox(height: 3),

                Text(
                  valor,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: texto,
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ============================================================
  // DESEMPENHO — CARD
  // ============================================================

  Widget _desempenho() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: linha,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 45,
                height: 45,
                decoration: BoxDecoration(
                  color: verdeClaro,
                  borderRadius: BorderRadius.circular(13),
                ),
                child: const Icon(
                  Icons.trending_up,
                  color: verde,
                  size: 23,
                ),
              ),

              const SizedBox(width: 12),

              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Evolução geral',
                      style: TextStyle(
                        color: texto,
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 3),
                    Text(
                      'Desempenho nos últimos treinos',
                      style: TextStyle(
                        color: textoSecundario,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),

              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 11,
                  vertical: 7,
                ),
                decoration: BoxDecoration(
                  color: verdeClaro,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text(
                  '+9%',
                  style: TextStyle(
                    color: verde,
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 18),

          ClipRRect(
            borderRadius: BorderRadius.circular(20),
            child: const LinearProgressIndicator(
              value: 0.78,
              minHeight: 9,
              backgroundColor: verdeClaro,
              valueColor: AlwaysStoppedAnimation<Color>(
                verde,
              ),
            ),
          ),

          const SizedBox(height: 8),

          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Desempenho atual',
                style: TextStyle(
                  color: textoSecundario,
                  fontSize: 11,
                ),
              ),
              Text(
                '78%',
                style: TextStyle(
                  color: verde,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ============================================================
  // CABEÇALHO DAS SEÇÕES
  // ============================================================

  Widget _cabecalhoSecao({
    required String titulo,
    required String botao,
    required IconData icone,
    required VoidCallback onPressed,
  }) {
    return Row(
      children: [
        Expanded(
          child: _tituloSecao(titulo),
        ),

        TextButton.icon(
          onPressed: onPressed,
          icon: Icon(
            icone,
            size: 17,
          ),
          label: Text(botao),
          style: TextButton.styleFrom(
            foregroundColor: verde,
            padding: const EdgeInsets.symmetric(
              horizontal: 8,
            ),
          ),
        ),
      ],
    );
  }

  // ============================================================
  // META — CARD
  // ============================================================

  Widget _meta(Map<String, String> meta) {
    final progresso =
        int.tryParse(meta['progresso'] ?? '0') ?? 0;

    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(17),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: linha,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: verdeClaro,
                  borderRadius: BorderRadius.circular(11),
                ),
                child: const Icon(
                  Icons.flag_outlined,
                  color: verde,
                  size: 20,
                ),
              ),

              const SizedBox(width: 12),

              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      meta['titulo'] ?? '',
                      style: const TextStyle(
                        color: texto,
                        fontWeight: FontWeight.bold,
                        fontSize: 15,
                      ),
                    ),

                    const SizedBox(height: 4),

                    Text(
                      meta['descricao'] ?? '',
                      style: const TextStyle(
                        color: textoSecundario,
                        fontSize: 12,
                        height: 1.35,
                      ),
                    ),
                  ],
                ),
              ),

              Text(
                '$progresso%',
                style: const TextStyle(
                  color: verde,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
            ],
          ),

          const SizedBox(height: 14),

          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: LinearProgressIndicator(
              value: progresso / 100,
              minHeight: 7,
              backgroundColor: verdeClaro,
              valueColor:
                  const AlwaysStoppedAnimation<Color>(
                verde,
              ),
            ),
          ),

          const SizedBox(height: 8),

          Align(
            alignment: Alignment.centerRight,
            child: Text(
              'Prazo: ${meta['prazo'] ?? ''}',
              style: const TextStyle(
                color: textoSecundario,
                fontSize: 10.5,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ============================================================
  // FEEDBACK — CARD
  // ============================================================

  Widget _feedback(Map<String, String> feedback) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: linha,
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: verdeClaro,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.chat_bubble_outline,
              color: verde,
              size: 19,
            ),
          ),

          const SizedBox(width: 12),

          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Expanded(
                      child: Text(
                        'Feedback do treinador',
                        style: TextStyle(
                          color: texto,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                    ),

                    PopupMenuButton<String>(
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(
                        minWidth: 40,
                      ),
                      icon: const Icon(
                        Icons.more_horiz,
                        color: textoSecundario,
                        size: 21,
                      ),
                      onSelected: (opcao) {
                        if (opcao == 'editar') {
                          _abrirEditarFeedback(feedback);
                        }

                        if (opcao == 'excluir') {
                          _confirmarExclusaoFeedback(feedback);
                        }
                      },
                      itemBuilder: (context) => [
                        const PopupMenuItem<String>(
                          value: 'editar',
                          child: Row(
                            children: [
                              Icon(
                                Icons.edit_outlined,
                                color: verde,
                                size: 20,
                              ),
                              SizedBox(width: 10),
                              Text(
                                'Editar feedback',
                                style: TextStyle(
                                  color: verde,
                                ),
                              ),
                            ],
                          ),
                        ),

                        const PopupMenuItem<String>(
                          value: 'excluir',
                          child: Row(
                            children: [
                              Icon(
                                Icons.delete_outline,
                                color: verde,
                                size: 20,
                              ),
                              SizedBox(width: 10),
                              Text(
                                'Excluir feedback',
                                style: TextStyle(
                                  color: verde,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),

                const SizedBox(height: 5),

                Text(
                  feedback['texto'] ?? '',
                  style: const TextStyle(
                    color: textoSecundario,
                    fontSize: 13,
                    height: 1.45,
                  ),
                ),

                const SizedBox(height: 8),

                Row(
                  children: [
                    const Icon(
                      Icons.schedule_outlined,
                      color: Colors.grey,
                      size: 14,
                    ),
                    const SizedBox(width: 5),
                    Expanded(
                      child: Text(
                        feedback['data'] ?? '',
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 10.5,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ============================================================
  // ATIVIDADES
  // ============================================================

  Widget _atividades() {
    final atividades = [
      {
        'icone': Icons.fitness_center,
        'titulo': 'Treino de resistência',
        'descricao': 'Participou do treino',
        'data': 'Hoje • 08:00',
      },
      {
        'icone': Icons.assessment_outlined,
        'titulo': 'Avaliação física',
        'descricao': 'Avaliação registrada',
        'data': 'Ontem • 16:30',
      },
      {
        'icone': Icons.sports,
        'titulo': 'Treino técnico',
        'descricao': 'Participou do treino',
        'data': '25/08 • 08:00',
      },
    ];

    return Column(
      children: List.generate(
        atividades.length,
        (index) {
          final atividade = atividades[index];

          return Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Column(
                children: [
                  Container(
                    width: 38,
                    height: 38,
                    decoration: const BoxDecoration(
                      color: verdeClaro,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      atividade['icone'] as IconData,
                      color: verde,
                      size: 19,
                    ),
                  ),

                  if (index != atividades.length - 1)
                    Container(
                      width: 1.5,
                      height: 38,
                      color: linha,
                    ),
                ],
              ),

              const SizedBox(width: 13),

              Expanded(
                child: Padding(
                  padding: const EdgeInsets.only(
                    top: 2,
                    bottom: 18,
                  ),
                  child: Column(
                    crossAxisAlignment:
                        CrossAxisAlignment.start,
                    children: [
                      Text(
                        atividade['titulo'] as String,
                        style: const TextStyle(
                          color: texto,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),

                      const SizedBox(height: 3),

                      Text(
                        atividade['descricao'] as String,
                        style: const TextStyle(
                          color: textoSecundario,
                          fontSize: 12,
                        ),
                      ),

                      const SizedBox(height: 3),

                      Text(
                        atividade['data'] as String,
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 10.5,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  // ============================================================
  // ESTADO VAZIO
  // ============================================================

  Widget _estadoVazio({
    required IconData icone,
    required String texto,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 20),
      child: Row(
        children: [
          Icon(
            icone,
            color: Colors.grey.shade400,
            size: 25,
          ),

          const SizedBox(width: 10),

          Text(
            texto,
            style: const TextStyle(
              color: textoSecundario,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }

  // ============================================================
  // TÍTULO
  // ============================================================

  Widget _tituloSecao(String titulo) {
    return Text(
      titulo,
      style: const TextStyle(
        color: texto,
        fontSize: 19,
        fontWeight: FontWeight.bold,
      ),
    );
  }
}