import 'package:flutter/material.dart';
import '../../assets/cabecalho_treinador.dart';

class AgendaPage extends StatefulWidget {
  const AgendaPage({super.key});

  @override
  State<AgendaPage> createState() => _AgendaPageState();
}

class _AgendaPageState extends State<AgendaPage> {
  static const Color verde = Color(0xFF006B4F);
  static const Color verdeClaro = Color(0xFFE8F5F0);
  static const Color fundo = Color(0xFFF7F9F8);

  DateTime mesAtual = DateTime(2026, 8);
  DateTime diaSelecionado = DateTime(2026, 8, 27);

  final List<Evento> eventos = [
    Evento(
      data: DateTime(2026, 8, 27),
      titulo: 'Treino de resistência aeróbica',
      horario: '08:00 - 09:30',
      local: 'Campo principal',
      tipo: TipoEvento.treino,
      icone: Icons.fitness_center,
    ),
    Evento(
      data: DateTime(2026, 8, 29),
      titulo: 'Treino técnico',
      horario: '16:00 - 17:30',
      local: 'Centro esportivo',
      tipo: TipoEvento.treino,
      icone: Icons.sports_soccer,
    ),
    Evento(
      data: DateTime(2026, 8, 31),
      titulo: 'Jogo amistoso',
      horario: '10:00 - 12:00',
      local: 'Estádio Municipal',
      tipo: TipoEvento.jogo,
      icone: Icons.emoji_events_outlined,
    ),
    Evento(
      data: DateTime(2026, 9, 3),
      titulo: 'Avaliação física',
      horario: '08:30 - 10:00',
      local: 'Sala de avaliação',
      tipo: TipoEvento.avaliacao,
      icone: Icons.monitor_heart_outlined,
    ),
    Evento(
      data: DateTime(2026, 9, 5),
      titulo: 'Reunião com atletas',
      horario: '14:00 - 15:00',
      local: 'Sala da comissão',
      tipo: TipoEvento.reuniao,
      icone: Icons.groups_outlined,
    ),
  ];

 @override
Widget build(BuildContext context) {
  final eventosDoDia = eventos.where((evento) {
    return _mesmoDia(evento.data, diaSelecionado);
  }).toList();

  return Scaffold(
    backgroundColor: fundo,

    body: Column(
      children: [
        CabecalhoTreinador(
          titulo: 'Agenda',
        ),

        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(
              16,
              18,
              16,
              30,
            ),

            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,

              children: [
                // CABEÇALHO DO CALENDÁRIO
                Container(
                  padding: const EdgeInsets.fromLTRB(
                    18,
                    18,
                    18,
                    20,
                  ),

                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),

                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(
                          alpha: 0.05,
                        ),
                        blurRadius: 15,
                        offset: const Offset(0, 5),
                      ),
                    ],
                  ),

                  child: Column(
                    children: [
                      Row(
                        children: [
                          IconButton(
                            onPressed: _mesAnterior,
                            icon: const Icon(
                              Icons.chevron_left,
                              color: verde,
                              size: 28,
                            ),
                          ),

                          Expanded(
                            child: Center(
                              child: Text(
                                _nomeMes(mesAtual.month),
                                style: const TextStyle(
                                  fontSize: 21,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF12261F),
                                ),
                              ),
                            ),
                          ),

                          IconButton(
                            onPressed: _proximoMes,
                            icon: const Icon(
                              Icons.chevron_right,
                              color: verde,
                              size: 28,
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 12),

                      Row(
                        children: const [
                          _DiaSemana('DOM'),
                          _DiaSemana('SEG'),
                          _DiaSemana('TER'),
                          _DiaSemana('QUA'),
                          _DiaSemana('QUI'),
                          _DiaSemana('SEX'),
                          _DiaSemana('SÁB'),
                        ],
                      ),

                      const SizedBox(height: 8),

                      _calendario(),
                    ],
                  ),
                ),

                const SizedBox(height: 22),

                // DIA SELECIONADO
                Row(
                  children: [
                    Container(
                      width: 48,
                      height: 48,

                      decoration: BoxDecoration(
                        color: verde,
                        borderRadius: BorderRadius.circular(14),
                      ),

                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            '${diaSelecionado.day}',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 19,
                              fontWeight: FontWeight.bold,
                            ),
                          ),

                          Text(
                            _nomeMesCurto(diaSelecionado.month),
                            style: const TextStyle(
                              color: Colors.white70,
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(width: 12),

                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Eventos do dia',
                            style: TextStyle(
                              fontSize: 19,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF12261F),
                            ),
                          ),

                          const SizedBox(height: 3),

                          Text(
                            '${_diaSemanaCompleto(diaSelecionado.weekday)}, '
                            '${diaSelecionado.day} de '
                            '${_nomeMes(diaSelecionado.month).toLowerCase()}',
                            style: const TextStyle(
                              fontSize: 12,
                              color: Colors.grey,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 15),

                // EVENTOS
                if (eventosDoDia.isEmpty)
                  _semEventos()
                else
                  ...eventosDoDia.map(
                    (evento) => _cardEvento(evento),
                  ),

                const SizedBox(height: 22),

                // BOTÃO NOVO EVENTO
                SizedBox(
                  width: double.infinity,
                  height: 54,

                  child: ElevatedButton.icon(
                    onPressed: _abrirNovoEvento,

                    style: ElevatedButton.styleFrom(
                      backgroundColor: verde,
                      foregroundColor: Colors.white,
                      elevation: 0,

                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),

                    icon: const Icon(Icons.add),

                    label: const Text(
                      'Novo evento',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 25),

                // LEGENDA
                const Text(
                  'Tipos de evento',
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 12),

                Wrap(
                  spacing: 15,
                  runSpacing: 10,

                  children: [
                    _legenda('Treino', TipoEvento.treino),
                    _legenda('Jogo', TipoEvento.jogo),
                    _legenda('Avaliação', TipoEvento.avaliacao),
                    _legenda('Reunião', TipoEvento.reuniao),
                    _legenda('Lembrete', TipoEvento.lembrete),
                  ],
                ),
              ],
            ),
          ),
        ),
      ],
    ),
  );
}

  // ============================================================
  // CALENDÁRIO
  // ============================================================

  Widget _calendario() {
    final primeiroDia =
        DateTime(mesAtual.year, mesAtual.month, 1);

    final ultimoDia =
        DateTime(mesAtual.year, mesAtual.month + 1, 0);

    // Dart: segunda = 1 ... domingo = 7
    // Precisamos começar no domingo.
    final inicio =
        primeiroDia.weekday % 7;

    final quantidadeDias = ultimoDia.day;

    final totalCelulas =
        ((inicio + quantidadeDias) / 7).ceil() * 7;

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),

      itemCount: totalCelulas,

      gridDelegate:
          const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 7,
        mainAxisSpacing: 7,
        crossAxisSpacing: 3,
        childAspectRatio: 0.82,
      ),

      itemBuilder: (context, index) {
        final numeroDia = index - inicio + 1;

        if (numeroDia < 1 || numeroDia > quantidadeDias) {
          return const SizedBox();
        }

        final data = DateTime(
          mesAtual.year,
          mesAtual.month,
          numeroDia,
        );

        final eventosDoDia = eventos.where(
          (evento) => _mesmoDia(evento.data, data),
        ).toList();

        final selecionado =
            _mesmoDia(data, diaSelecionado);

        final hoje = _mesmoDia(
          data,
          DateTime.now(),
        );

        return GestureDetector(
          onTap: () {
            setState(() {
              diaSelecionado = data;
            });
          },

          child: Container(
            decoration: BoxDecoration(
              color: selecionado
                  ? verde
                  : hoje
                      ? verdeClaro
                      : Colors.transparent,

              borderRadius: BorderRadius.circular(13),
            ),

            child: Column(
              mainAxisAlignment:
                  MainAxisAlignment.center,

              children: [
                Text(
                  '$numeroDia',
                  style: TextStyle(
                    fontSize: 15,

                    fontWeight: selecionado ||
                            hoje
                        ? FontWeight.bold
                        : FontWeight.w500,

                    color: selecionado
                        ? Colors.white
                        : hoje
                            ? verde
                            : const Color(
                                0xFF333333,
                              ),
                  ),
                ),

                const SizedBox(height: 5),

                // BOLINHAS DOS EVENTOS
                if (eventosDoDia.isNotEmpty)
                  Row(
                    mainAxisAlignment:
                        MainAxisAlignment.center,

                    children: eventosDoDia
                        .take(3)
                        .map(
                          (evento) => Container(
                            margin:
                                const EdgeInsets.symmetric(
                              horizontal: 2,
                            ),

                            width: 5,
                            height: 5,

                            decoration: BoxDecoration(
                              color: selecionado
                                  ? Colors.white
                                  : _corEvento(
                                      evento.tipo,
                                    ),
                              shape: BoxShape.circle,
                            ),
                          ),
                        )
                        .toList(),
                  ),
              ],
            ),
          ),
        );
      },
    );
  }

  // ============================================================
  // CARD DO EVENTO
  // ============================================================

  Widget _cardEvento(Evento evento) {
    final cor = _corEvento(evento.tipo);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),

      padding: const EdgeInsets.all(15),

      decoration: BoxDecoration(
        color: Colors.white,

        borderRadius: BorderRadius.circular(18),

        border: Border(
          left: BorderSide(
            color: cor,
            width: 5,
          ),
        ),

        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.035),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),

      child: Row(
        children: [

          Container(
            width: 45,
            height: 45,

            decoration: BoxDecoration(
              color: cor.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(13),
            ),

            child: Icon(
              evento.icone,
              color: cor,
              size: 22,
            ),
          ),

          const SizedBox(width: 12),

          Expanded(
            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment.start,

              children: [

                Text(
                  evento.titulo,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 7),

                Row(
                  children: [
                    const Icon(
                      Icons.access_time_outlined,
                      size: 14,
                      color: Colors.grey,
                    ),

                    const SizedBox(width: 5),

                    Text(
                      evento.horario,
                      style: const TextStyle(
                        fontSize: 12,
                        color: Colors.grey,
                      ),
                    ),
                  ],
                ),

                if (evento.local.isNotEmpty) ...[
                  const SizedBox(height: 4),

                  Row(
                    children: [
                      const Icon(
                        Icons.location_on_outlined,
                        size: 14,
                        color: Colors.grey,
                      ),

                      const SizedBox(width: 5),

                      Expanded(
                        child: Text(
                          evento.local,
                          style: const TextStyle(
                            fontSize: 12,
                            color: Colors.grey,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          ),

          IconButton(
            onPressed: () {
              _removerEvento(evento);
            },
            icon: const Icon(
              Icons.more_vert,
              color: Colors.grey,
            ),
          ),
        ],
      ),
    );
  }

  // ============================================================
  // SEM EVENTOS
  // ============================================================

  Widget _semEventos() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(
        vertical: 25,
        horizontal: 20,
      ),

      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: const Color(0xFFE5EAE7),
        ),
      ),

      child: Column(
        children: [
          Icon(
            Icons.event_available_outlined,
            size: 38,
            color: verde.withValues(alpha: 0.5),
          ),

          const SizedBox(height: 10),

          const Text(
            'Nenhum evento neste dia',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),

          const SizedBox(height: 5),

          const Text(
            'Você pode adicionar um novo evento.',
            style: TextStyle(
              color: Colors.grey,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  // ============================================================
  // LEGENDA
  // ============================================================

  Widget _legenda(
    String texto,
    TipoEvento tipo,
  ) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 9,
          height: 9,

          decoration: BoxDecoration(
            color: _corEvento(tipo),
            shape: BoxShape.circle,
          ),
        ),

        const SizedBox(width: 6),

        Text(
          texto,
          style: const TextStyle(
            fontSize: 12,
            color: Color(0xFF555555),
          ),
        ),
      ],
    );
  }

  // ============================================================
  // NOVO EVENTO
  // ============================================================

  void _abrirNovoEvento() {
    final tituloController = TextEditingController();
    final horarioController =
        TextEditingController();
    final localController =
        TextEditingController();
    final descricaoController =
        TextEditingController();

    TipoEvento tipoSelecionado =
        TipoEvento.treino;

    showModalBottomSheet(
      context: context,

      isScrollControlled: true,

      backgroundColor: Colors.transparent,

      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Container(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 20,
                bottom:
                    MediaQuery.of(context)
                            .viewInsets
                            .bottom +
                        20,
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
                              BorderRadius.circular(10),
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),

                    const Text(
                      'Novo evento',
                      style: TextStyle(
                        fontSize: 23,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 5),

                    const Text(
                      'Adicione um compromisso à sua agenda.',
                      style: TextStyle(
                        color: Colors.grey,
                        fontSize: 13,
                      ),
                    ),

                    const SizedBox(height: 22),

                    _campo(
                      controller: tituloController,
                      label: 'Título',
                      hint: 'Ex: Treino técnico',
                      icone: Icons.title,
                    ),

                    const SizedBox(height: 12),

                    _campo(
                      controller: horarioController,
                      label: 'Horário',
                      hint: 'Ex: 08:00 - 09:30',
                      icone: Icons.access_time,
                    ),

                    const SizedBox(height: 12),

                    _campo(
                      controller: localController,
                      label: 'Local',
                      hint: 'Ex: Campo principal',
                      icone: Icons.location_on_outlined,
                    ),

                    const SizedBox(height: 18),

                    const Text(
                      'Tipo de evento',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),

                    const SizedBox(height: 10),

                    Wrap(
                      spacing: 8,
                      runSpacing: 8,

                      children: TipoEvento.values
                          .map(
                            (tipo) => ChoiceChip(
                              label: Text(
                                _nomeTipo(tipo),
                              ),

                              selected:
                                  tipoSelecionado ==
                                      tipo,

                              selectedColor:
                                  _corEvento(tipo)
                                      .withValues(
                                alpha: 0.18,
                              ),

                              onSelected: (_) {
                                setModalState(() {
                                  tipoSelecionado =
                                      tipo;
                                });
                              },

                              avatar: CircleAvatar(
                                radius: 5,
                                backgroundColor:
                                    _corEvento(tipo),
                              ),
                            ),
                          )
                          .toList(),
                    ),

                    const SizedBox(height: 18),

                    _campo(
                      controller:
                          descricaoController,
                      label: 'Descrição',
                      hint: 'Adicione uma observação...',
                      icone:
                          Icons.notes_outlined,
                      maxLines: 3,
                    ),

                    const SizedBox(height: 22),

                    SizedBox(
                      width: double.infinity,
                      height: 52,

                      child: ElevatedButton(
                        onPressed: () {
                          if (tituloController
                              .text
                              .trim()
                              .isEmpty) {
                            return;
                          }

                          setState(() {
                            eventos.add(
                              Evento(
                                data: diaSelecionado,
                                titulo:
                                    tituloController
                                        .text
                                        .trim(),
                                horario:
                                    horarioController
                                            .text
                                            .trim()
                                            .isEmpty
                                        ? 'Sem horário'
                                        : horarioController
                                            .text
                                            .trim(),
                                local:
                                    localController
                                        .text
                                        .trim(),
                                tipo:
                                    tipoSelecionado,
                                icone:
                                    _iconeEvento(
                                  tipoSelecionado,
                                ),
                              ),
                            );
                          });

                          Navigator.pop(context);
                        },

                        style:
                            ElevatedButton.styleFrom(
                          backgroundColor: verde,
                          foregroundColor:
                              Colors.white,

                          shape:
                              RoundedRectangleBorder(
                            borderRadius:
                                BorderRadius.circular(
                              15,
                            ),
                          ),
                        ),

                        child: const Text(
                          'Adicionar evento',
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
            );
          },
        );
      },
    );
  }

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

        prefixIcon: Icon(
          icone,
          color: verde,
          size: 20,
        ),

        filled: true,
        fillColor: fundo,

        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide.none,
        ),

        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(
            color: verde,
            width: 1.5,
          ),
        ),
      ),
    );
  }

  // ============================================================
  // NAVEGAÇÃO DOS MESES
  // ============================================================

  void _mesAnterior() {
    setState(() {
      mesAtual = DateTime(
        mesAtual.year,
        mesAtual.month - 1,
      );
    });
  }

  void _proximoMes() {
    setState(() {
      mesAtual = DateTime(
        mesAtual.year,
        mesAtual.month + 1,
      );
    });
  }

  // ============================================================
  // REMOVER EVENTO
  // ============================================================

  void _removerEvento(Evento evento) {
    showDialog(
      context: context,

      builder: (context) {
        return AlertDialog(
          title: const Text(
            'Remover evento?',
          ),

          content: Text(
            'Deseja remover "${evento.titulo}"?',
          ),

          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: const Text('Cancelar'),
            ),

            TextButton(
              onPressed: () {
                setState(() {
                  eventos.remove(evento);
                });

                Navigator.pop(context);
              },
              child: const Text(
                'Remover',
                style: TextStyle(
                  color: Colors.red,
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  // ============================================================
  // FUNÇÕES AUXILIARES
  // ============================================================

  bool _mesmoDia(
    DateTime a,
    DateTime b,
  ) {
    return a.year == b.year &&
        a.month == b.month &&
        a.day == b.day;
  }

  String _nomeMes(int mes) {
    const meses = [
      '',
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];

    return meses[mes];
  }

  String _nomeMesCurto(int mes) {
    const meses = [
      '',
      'JAN',
      'FEV',
      'MAR',
      'ABR',
      'MAI',
      'JUN',
      'JUL',
      'AGO',
      'SET',
      'OUT',
      'NOV',
      'DEZ',
    ];

    return meses[mes];
  }

  String _diaSemanaCompleto(int dia) {
    const dias = [
      '',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
      'Domingo',
    ];

    return dias[dia];
  }

  String _nomeTipo(TipoEvento tipo) {
    switch (tipo) {
      case TipoEvento.treino:
        return 'Treino';

      case TipoEvento.jogo:
        return 'Jogo';

      case TipoEvento.avaliacao:
        return 'Avaliação';

      case TipoEvento.reuniao:
        return 'Reunião';

      case TipoEvento.lembrete:
        return 'Lembrete';
    }
  }

  Color _corEvento(TipoEvento tipo) {
    switch (tipo) {
      case TipoEvento.treino:
        return const Color(0xFF006B4F);

      case TipoEvento.jogo:
        return const Color(0xFFEF476F);

      case TipoEvento.avaliacao:
        return const Color(0xFF4EA5D9);

      case TipoEvento.reuniao:
        return const Color(0xFFFFA62B);

      case TipoEvento.lembrete:
        return const Color(0xFF8E7DBE);
    }
  }

  IconData _iconeEvento(TipoEvento tipo) {
    switch (tipo) {
      case TipoEvento.treino:
        return Icons.fitness_center;

      case TipoEvento.jogo:
        return Icons.emoji_events_outlined;

      case TipoEvento.avaliacao:
        return Icons.monitor_heart_outlined;

      case TipoEvento.reuniao:
        return Icons.groups_outlined;

      case TipoEvento.lembrete:
        return Icons.notifications_none;
    }
  }
}

// ================================================================
// MODELO DO EVENTO
// ================================================================

enum TipoEvento {
  treino,
  jogo,
  avaliacao,
  reuniao,
  lembrete,
}

class Evento {
  final DateTime data;
  final String titulo;
  final String horario;
  final String local;
  final TipoEvento tipo;
  final IconData icone;

  Evento({
    required this.data,
    required this.titulo,
    required this.horario,
    required this.local,
    required this.tipo,
    required this.icone,
  });
}

// ================================================================
// DIA DA SEMANA
// ================================================================

class _DiaSemana extends StatelessWidget {
  final String texto;

  const _DiaSemana(this.texto);

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Center(
        child: Text(
          texto,
          style: const TextStyle(
            fontSize: 9,
            fontWeight: FontWeight.bold,
            color: Color(0xFF8A938F),
          ),
        ),
      ),
    );
  }
}
