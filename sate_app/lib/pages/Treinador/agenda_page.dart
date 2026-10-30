import 'package:flutter/material.dart';
import '../../theme/sate_theme.dart';

class AgendaPage extends StatefulWidget {
  const AgendaPage({super.key});

  @override
  State<AgendaPage> createState() => _AgendaPageState();
}

class _AgendaPageState extends State<AgendaPage> {
  static const Color verde = Color(0xFF005942);
  static const Color verdeEscuro = Color(0xFF003D31);
  static const Color verdeClaro = Color(0xFFDFF7EE);
  static const Color fundo = Color(0xFFFAF5EE);

  DateTime mesAtual = DateTime(2026, 8);
  DateTime diaSelecionado = DateTime(2026, 8, 27);

  final List<Evento> eventos = [
    Evento(
      data: DateTime(2026, 8, 27),
      titulo: 'Treino de resistência aeróbica',
      horarioInicio: '08:00',
      horarioFim: '09:30',
      local: 'Campo principal',
      tipo: TipoEvento.treino,
      icone: Icons.fitness_center_rounded,
    ),
    Evento(
      data: DateTime(2026, 8, 29),
      titulo: 'Treino técnico',
      horarioInicio: '16:00',
      horarioFim: '17:30',
      local: 'Centro esportivo',
      tipo: TipoEvento.treino,
      icone: Icons.sports_soccer_rounded,
    ),
    Evento(
      data: DateTime(2026, 8, 31),
      titulo: 'Jogo amistoso',
      horarioInicio: '10:00',
      horarioFim: '12:00',
      local: 'Estádio Municipal',
      tipo: TipoEvento.jogo,
      icone: Icons.emoji_events_rounded,
    ),
    Evento(
      data: DateTime(2026, 9, 3),
      titulo: 'Avaliação física',
      horarioInicio: '08:30',
      horarioFim: '10:00',
      local: 'Sala de avaliação',
      tipo: TipoEvento.avaliacao,
      icone: Icons.monitor_heart_outlined,
    ),
    Evento(
      data: DateTime(2026, 9, 5),
      titulo: 'Reunião com atletas',
      horarioInicio: '14:00',
      horarioFim: '15:00',
      local: 'Sala da comissão',
      tipo: TipoEvento.reuniao,
      icone: Icons.groups_rounded,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final List<Evento> eventosDoDia = eventos.where((evento) {
      return _mesmoDia(evento.data, diaSelecionado);
    }).toList();

    return Scaffold(
      backgroundColor: fundo,
      appBar: AppBar(
        backgroundColor: fundo,
        elevation: 0,
        centerTitle: false,

        automaticallyImplyLeading: false,

        title: const Text.rich(
          TextSpan(children: [TextSpan(text: 'Agenda', style: SateEstilo.destaque)]),
          style: TextStyle(
            color: Color(0xFF10251F),
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 30),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildCabecalho(),
              const SizedBox(height: 18),
              _calendario(),
              const SizedBox(height: 20),
              _tituloDia(),
              const SizedBox(height: 12),
              if (eventosDoDia.isEmpty)
                _semEventos()
              else
                ...eventosDoDia.map((evento) {
                  return _cardEvento(evento);
                }),
              const SizedBox(height: 8),
              _botaoNovoEvento(),
              const SizedBox(height: 20),
              _legenda(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCabecalho() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: verde,
        borderRadius: BorderRadius.circular(22),
      ),
      child: Row(
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Icon(
              Icons.calendar_month_rounded,
              color: Colors.white,
              size: 27,
            ),
          ),
          const SizedBox(width: 14),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Agenda da equipe',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 5),
                Text(
                  'Acompanhe os eventos e compromissos da equipe.',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 12,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _calendario() {
    final DateTime primeiroDia = DateTime(mesAtual.year, mesAtual.month, 1);
    final DateTime ultimoDia = DateTime(mesAtual.year, mesAtual.month + 1, 0);
    final int primeiroDiaSemana = primeiroDia.weekday;

    final List<Widget> dias = [];

    for (int i = 1; i < primeiroDiaSemana; i++) {
      dias.add(const SizedBox());
    }

    for (int dia = 1; dia <= ultimoDia.day; dia++) {
      final DateTime data = DateTime(mesAtual.year, mesAtual.month, dia);
      final bool selecionado = _mesmoDia(data, diaSelecionado);
      final bool hoje = _mesmoDia(data, DateTime.now());
      final bool possuiEvento = eventos.any((evento) {
        return _mesmoDia(evento.data, data);
      });

      dias.add(
        GestureDetector(
          onTap: () {
            setState(() {
              diaSelecionado = data;
            });
          },
          child: Container(
            height: 42,
            decoration: BoxDecoration(
              color: selecionado
                  ? verde
                  : hoje
                  ? verdeClaro
                  : Colors.transparent,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  '$dia',
                  style: TextStyle(
                    color: selecionado ? Colors.white : Color(0xFF10251F),
                    fontSize: 13,
                    fontWeight: selecionado || hoje
                        ? FontWeight.bold
                        : FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 3),
                if (possuiEvento)
                  Container(
                    width: 4,
                    height: 4,
                    decoration: BoxDecoration(
                      color: selecionado ? Colors.white : verde,
                      shape: BoxShape.circle,
                    ),
                  )
                else
                  const SizedBox(height: 4),
              ],
            ),
          ),
        ),
      );
    }

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: Color(0xFFE8DFD3)),
        boxShadow: [
          BoxShadow(
            color: Color(0xFF10251F).withValues(alpha: 0.025),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              _botaoMes(
                icone: Icons.chevron_left_rounded,
                onTap: () {
                  setState(() {
                    mesAtual = DateTime(mesAtual.year, mesAtual.month - 1);
                  });
                },
              ),
              Expanded(
                child: Center(
                  child: Text(
                    _nomeMes(mesAtual),
                    style: const TextStyle(
                      color: Color(0xFF10251F),
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              _botaoMes(
                icone: Icons.chevron_right_rounded,
                onTap: () {
                  setState(() {
                    mesAtual = DateTime(mesAtual.year, mesAtual.month + 1);
                  });
                },
              ),
            ],
          ),
          const SizedBox(height: 18),
          Row(
            children: [
              _diaSemana('SEG'),
              _diaSemana('TER'),
              _diaSemana('QUA'),
              _diaSemana('QUI'),
              _diaSemana('SEX'),
              _diaSemana('SÁB'),
              _diaSemana('DOM'),
            ],
          ),
          const SizedBox(height: 8),
          GridView.count(
            crossAxisCount: 7,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 4,
            crossAxisSpacing: 4,
            childAspectRatio: 1,
            children: dias,
          ),
        ],
      ),
    );
  }

  Widget _botaoMes({required IconData icone, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 38,
        height: 38,
        decoration: BoxDecoration(
          color: verdeClaro,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Icon(icone, color: verde, size: 22),
      ),
    );
  }

  Widget _diaSemana(String texto) {
    return Expanded(
      child: Center(
        child: Text(
          texto,
          style: TextStyle(
            color: Color(0xFF68736F),
            fontSize: 9,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  Widget _tituloDia() {
    return Row(
      children: [
        Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: verde,
            borderRadius: BorderRadius.circular(14),
          ),
          alignment: Alignment.center,
          child: Text(
            '${diaSelecionado.day}',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Eventos do dia',
              style: TextStyle(
                color: Color(0xFF10251F),
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 3),
            Text(
              _diaSemanaCompleto(diaSelecionado),
              style: TextStyle(color: Color(0xFF68736F), fontSize: 11),
            ),
          ],
        ),
      ],
    );
  }

  Widget _cardEvento(Evento evento) {
    final Color cor = _corEvento(evento.tipo);

    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: cor.withValues(alpha: 0.30)),
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
            width: 46,
            height: 46,
            decoration: BoxDecoration(
              color: cor.withValues(alpha: 0.10),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(evento.icone, color: cor, size: 23),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        evento.titulo,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: Color(0xFF10251F),
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    PopupMenuButton<String>(
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(minWidth: 40),
                      icon: const Icon(
                        Icons.more_horiz,
                        color: Color(0xFF68736F),
                        size: 21,
                      ),
                      onSelected: (opcao) {
                        if (opcao == 'excluir') {
                          _confirmarExclusaoEvento(evento);
                        }
                      },
                      itemBuilder: (context) => [
                        const PopupMenuItem<String>(
                          value: 'excluir',
                          child: Row(
                            children: [
                              Icon(
                                Icons.delete_outline,
                                color: Color(0xFF005942),
                                size: 20,
                              ),
                              SizedBox(width: 10),
                              Text(
                                'Excluir evento',
                                style: TextStyle(color: Color(0xFF005942)),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 9,
                    vertical: 5,
                  ),
                  decoration: BoxDecoration(
                    color: cor.withValues(alpha: 0.10),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    _nomeTipo(evento.tipo),
                    style: TextStyle(
                      color: cor,
                      fontSize: 9,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Icon(
                      Icons.access_time_outlined,
                      size: 15,
                      color: Color(0xFF68736F),
                    ),
                    const SizedBox(width: 5),
                    Text(
                      '${evento.horarioInicio} - ${evento.horarioFim}',
                      style: TextStyle(
                        color: Color(0xFF4F5A56),
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 7),
                Row(
                  children: [
                    Icon(
                      Icons.location_on_outlined,
                      size: 15,
                      color: Color(0xFF68736F),
                    ),
                    const SizedBox(width: 5),
                    Expanded(
                      child: Text(
                        evento.local,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          color: Color(0xFF4F5A56),
                          fontSize: 11,
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

  Widget _semEventos() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Color(0xFFE8DFD3)),
      ),
      child: Column(
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: verdeClaro,
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Icon(
              Icons.event_available_rounded,
              color: verde,
              size: 27,
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'Nenhum evento',
            style: TextStyle(
              color: Color(0xFF10251F),
              fontSize: 15,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 5),
          Text(
            'Não há eventos programados para este dia.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Color(0xFF68736F), fontSize: 11),
          ),
        ],
      ),
    );
  }

  Widget _botaoNovoEvento() {
    return SizedBox(
      width: double.infinity,
      height: 50,
      child: ElevatedButton.icon(
        onPressed: _abrirNovoEvento,
        style: ElevatedButton.styleFrom(
          backgroundColor: verde,
          foregroundColor: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15),
          ),
        ),
        icon: const Icon(Icons.add_rounded, size: 22),
        label: const Text(
          'NOVO EVENTO',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            letterSpacing: 0.4,
          ),
        ),
      ),
    );
  }

  Widget _legenda() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Color(0xFFE8DFD3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Legenda',
            style: TextStyle(
              color: Color(0xFF10251F),
              fontSize: 13,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 16,
            runSpacing: 10,
            children: [
              _itemLegenda('Treino', _corEvento(TipoEvento.treino)),
              _itemLegenda('Jogo', _corEvento(TipoEvento.jogo)),
              _itemLegenda('Avaliação', _corEvento(TipoEvento.avaliacao)),
              _itemLegenda('Reunião', _corEvento(TipoEvento.reuniao)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _itemLegenda(String textoLegenda, Color cor) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(color: cor, shape: BoxShape.circle),
        ),
        const SizedBox(width: 6),
        Text(
          textoLegenda,
          style: TextStyle(color: Color(0xFF4F5A56), fontSize: 10),
        ),
      ],
    );
  }

  // ============================================================
  // NOVO EVENTO
  // ============================================================

  void _abrirNovoEvento() {
    final TextEditingController tituloController = TextEditingController();
    final TextEditingController localController = TextEditingController();

    TimeOfDay? horarioInicio;
    TimeOfDay? horarioFim;
    TipoEvento tipoSelecionado = TipoEvento.treino;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (modalContext) {
        return StatefulBuilder(
          builder: (modalContext, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(modalContext).viewInsets.bottom,
              ),
              child: Container(
                padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(26)),
                ),
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Center(
                        child: Container(
                          width: 42,
                          height: 4,
                          decoration: BoxDecoration(
                            color: Color(0xFFD5C9BA),
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                      const Text.rich(
                        TextSpan(children: [TextSpan(text: 'Novo '), TextSpan(text: 'evento', style: SateEstilo.destaque)]),
                        style: TextStyle(
                          color: Color(0xFF10251F),
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 20),
                      _campo(
                        controller: tituloController,
                        label: 'Título',
                        hint: 'Nome do evento',
                        icone: Icons.edit_outlined,
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: _campoHorario(
                              label: 'Início',
                              horario: horarioInicio,
                              onTap: () async {
                                final escolhido = await showTimePicker(
                                  context: modalContext,
                                  initialTime:
                                      horarioInicio ??
                                      const TimeOfDay(hour: 8, minute: 0),
                                );
                                if (escolhido != null) {
                                  setModalState(() {
                                    horarioInicio = escolhido;
                                  });
                                }
                              },
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _campoHorario(
                              label: 'Fim',
                              horario: horarioFim,
                              onTap: () async {
                                final escolhido = await showTimePicker(
                                  context: modalContext,
                                  initialTime:
                                      horarioInicio ??
                                      const TimeOfDay(hour: 8, minute: 0),
                                );
                                if (escolhido != null) {
                                  setModalState(() {
                                    horarioInicio = escolhido;
                                  });
                                }
                              },
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      _campo(
                        controller: localController,
                        label: 'Local',
                        hint: 'Local do evento',
                        icone: Icons.location_on_outlined,
                      ),
                      const SizedBox(height: 18),
                      const Text(
                        'Tipo de evento',
                        style: TextStyle(
                          color: Color(0xFF10251F),
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          _chipTipo(
                            'Treino',
                            TipoEvento.treino,
                            tipoSelecionado,
                            () {
                              setModalState(() {
                                tipoSelecionado = TipoEvento.treino;
                              });
                            },
                          ),
                          _chipTipo(
                            'Jogo',
                            TipoEvento.jogo,
                            tipoSelecionado,
                            () {
                              setModalState(() {
                                tipoSelecionado = TipoEvento.jogo;
                              });
                            },
                          ),
                          _chipTipo(
                            'Avaliação',
                            TipoEvento.avaliacao,
                            tipoSelecionado,
                            () {
                              setModalState(() {
                                tipoSelecionado = TipoEvento.avaliacao;
                              });
                            },
                          ),
                          _chipTipo(
                            'Reunião',
                            TipoEvento.reuniao,
                            tipoSelecionado,
                            () {
                              setModalState(() {
                                tipoSelecionado = TipoEvento.reuniao;
                              });
                            },
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton(
                          onPressed: () {
                            if (tituloController.text.trim().isEmpty) {
                              ScaffoldMessenger.of(modalContext).showSnackBar(
                                const SnackBar(
                                  content: Text('Digite o título do evento.'),
                                ),
                              );
                              return;
                            }

                            if (horarioInicio == null) {
                              ScaffoldMessenger.of(modalContext).showSnackBar(
                                const SnackBar(
                                  content: Text(
                                    'Selecione o horário de início.',
                                  ),
                                ),
                              );
                              return;
                            }

                            if (horarioFim == null) {
                              ScaffoldMessenger.of(modalContext).showSnackBar(
                                const SnackBar(
                                  content: Text(
                                    'Selecione o horário de término.',
                                  ),
                                ),
                              );
                              return;
                            }

                            final inicioMinutos =
                                horarioInicio!.hour * 60 +
                                horarioInicio!.minute;
                            final fimMinutos =
                                horarioFim!.hour * 60 + horarioFim!.minute;

                            if (fimMinutos <= inicioMinutos) {
                              ScaffoldMessenger.of(modalContext).showSnackBar(
                                const SnackBar(
                                  content: Text(
                                    'O horário de término deve ser '
                                    'depois do início.',
                                  ),
                                ),
                              );
                              return;
                            }

                            final inicioFormatado =
                                '${horarioInicio!.hour.toString().padLeft(2, '0')}:${horarioInicio!.minute.toString().padLeft(2, '0')}';
                            final fimFormatado =
                                '${horarioFim!.hour.toString().padLeft(2, '0')}:${horarioFim!.minute.toString().padLeft(2, '0')}';

                            setState(() {
                              eventos.add(
                                Evento(
                                  data: diaSelecionado,
                                  titulo: tituloController.text.trim(),
                                  horarioInicio: inicioFormatado,
                                  horarioFim: fimFormatado,
                                  local: localController.text.trim(),
                                  tipo: tipoSelecionado,
                                  icone: _iconeEvento(tipoSelecionado),
                                ),
                              );
                            });

                            Navigator.pop(modalContext);
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: verde,
                            foregroundColor: Colors.white,
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(15),
                            ),
                          ),
                          child: const Text(
                            'ADICIONAR EVENTO',
                            style: TextStyle(
                              fontSize: 12,
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
          },
        );
      },
    ).whenComplete(() {
      tituloController.dispose();
      localController.dispose();
    });
  }

  Widget _campoHorario({
    required String label,
    required TimeOfDay? horario,
    required VoidCallback onTap,
  }) {
    final texto = horario == null
        ? '--:--'
        : '${horario.hour.toString().padLeft(2, '0')}:${horario.minute.toString().padLeft(2, '0')}';

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 16),
        decoration: BoxDecoration(
          color: fundo,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Color(0xFFE8DFD3)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: TextStyle(color: Color(0xFF68736F), fontSize: 11),
            ),
            const SizedBox(height: 6),
            Text(
              texto,
              style: TextStyle(
                color: horario == null ? Color(0xFF8A938F) : Color(0xFF10251F),
                fontSize: 15,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
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
        prefixIcon: Icon(icone, size: 20, color: Color(0xFF68736F)),
        filled: true,
        fillColor: fundo,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: Color(0xFFE8DFD3)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: Color(0xFFE8DFD3)),
        ),
        focusedBorder: const OutlineInputBorder(
          borderRadius: BorderRadius.all(Radius.circular(14)),
          borderSide: BorderSide(color: verde),
        ),
      ),
    );
  }

  Widget _chipTipo(
    String textoChip,
    TipoEvento tipo,
    TipoEvento selecionado,
    VoidCallback onTap,
  ) {
    final bool ativo = tipo == selecionado;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 9),
        decoration: BoxDecoration(
          color: ativo ? verde : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: ativo ? verde : Color(0xFFE8DFD3)),
        ),
        child: Text(
          textoChip,
          style: TextStyle(
            color: ativo ? Colors.white : Color(0xFF4F5A56),
            fontSize: 11,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }

  void _confirmarExclusaoEvento(Evento evento) {
    showDialog(
      context: context,
      builder: (dialogContext) {
        return AlertDialog(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(22),
          ),
          title: const Text(
            'Excluir evento?',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: Color(0xFF10251F),
            ),
          ),
          content: Text(
            'O evento "${evento.titulo}" será removido permanentemente.',
            style: const TextStyle(color: Color(0xFF68736F), height: 1.4),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(dialogContext);
              },
              child: const Text(
                'Cancelar',
                style: TextStyle(color: Color(0xFF68736F)),
              ),
            ),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  eventos.remove(evento);
                });

                Navigator.pop(dialogContext);

                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Evento excluído.'),
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFF005942),
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: const Text(
                'Excluir',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
            ),
          ],
        );
      },
    );
  }

  bool _mesmoDia(DateTime primeira, DateTime segunda) {
    return primeira.year == segunda.year &&
        primeira.month == segunda.month &&
        primeira.day == segunda.day;
  }

  String _nomeMes(DateTime data) {
    const meses = [
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
    return '${meses[data.month - 1]} ${data.year}';
  }

  String _diaSemanaCompleto(DateTime data) {
    const dias = [
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
      'Domingo',
    ];
    final nomeDia = dias[data.weekday - 1];
    return '$nomeDia, ${data.day} de ${_nomeMesCurto(data.month)}';
  }

  String _nomeMesCurto(int mes) {
    const meses = [
      'jan',
      'fev',
      'mar',
      'abr',
      'mai',
      'jun',
      'jul',
      'ago',
      'set',
      'out',
      'nov',
      'dez',
    ];
    return meses[mes - 1];
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
        return verde;
      case TipoEvento.jogo:
        return const Color(0xFFE39B18);
      case TipoEvento.avaliacao:
        return const Color(0xFFEF476F);
      case TipoEvento.reuniao:
        return const Color(0xFF003D31);
      case TipoEvento.lembrete:
        return Color(0xFF8A938F);
    }
  }

  IconData _iconeEvento(TipoEvento tipo) {
    switch (tipo) {
      case TipoEvento.treino:
        return Icons.fitness_center_rounded;
      case TipoEvento.jogo:
        return Icons.emoji_events_rounded;
      case TipoEvento.avaliacao:
        return Icons.monitor_heart_outlined;
      case TipoEvento.reuniao:
        return Icons.groups_rounded;
      case TipoEvento.lembrete:
        return Icons.notifications_none_rounded;
    }
  }
}

enum TipoEvento { treino, jogo, avaliacao, reuniao, lembrete }

class Evento {
  final DateTime data;
  final String titulo;
  final String horarioInicio;
  final String horarioFim;
  final String local;
  final TipoEvento tipo;
  final IconData icone;

  Evento({
    required this.data,
    required this.titulo,
    required this.horarioInicio,
    required this.horarioFim,
    required this.local,
    required this.tipo,
    required this.icone,
  });
}
