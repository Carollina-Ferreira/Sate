import 'package:flutter/material.dart';
import '../../theme/sate_theme.dart';

class TreinosPage extends StatefulWidget {
  const TreinosPage({super.key});

  @override
  State<TreinosPage> createState() => _TreinosPageState();
}

class _TreinosPageState extends State<TreinosPage> {
  static const Color verde = Color(0xFF005942);
  static const Color verdeClaro = Color(0xFFDFF7EE);
  static const Color fundo = Color(0xFFFAF5EE);

  final List<Treino> treinos = [
    Treino(
      titulo: 'Resistência aeróbica',
      data: 'Hoje',
      horario: '08:00',
      duracao: '1h 30min',
      status: 'Agendado',
      destaque: true,
      categoria: 'Físico',
      local: 'Campo principal',
      objetivo:
          'Melhorar resistência aeróbica e capacidade cardiorrespiratória.',
      exercicios: [
        {
          'nome': 'Corrida contínua',
          'series': '20 min',
          'descricao': 'Ritmo moderado',
        },
        {
          'nome': 'Tiro 100m',
          'series': '8 × 100m',
          'descricao': 'Descanso 45s',
        },
      ],
    ),
    Treino(
      titulo: 'Treino técnico',
      data: 'Amanhã',
      horario: '16:00',
      duracao: '1h 30min',
      status: 'Agendado',
      categoria: 'Técnico',
      local: 'Centro esportivo',
      objetivo: 'Aprimorar fundamentos e controle de bola.',
      exercicios: [
        {
          'nome': 'Condução',
          'series': '3 × 10',
          'descricao': 'Zig-zag com cones',
        },
      ],
    ),
    Treino(
      titulo: 'Velocidade e explosão',
      data: 'Quinta-feira',
      horario: '08:00',
      duracao: '1h',
      status: 'Planejado',
      categoria: 'Físico',
      local: 'Pista',
      objetivo: 'Trabalhar explosão e velocidade de deslocamento.',
      exercicios: [],
    ),
    Treino(
      titulo: 'Treino coletivo',
      data: 'Sábado',
      horario: '10:00',
      duracao: '2h',
      status: 'Planejado',
      categoria: 'Tático',
      local: 'Campo principal',
      objetivo: 'Ajustar posicionamento em situação de jogo.',
      exercicios: [],
    ),
  ];

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
          TextSpan(children: [TextSpan(text: 'Treinos', style: SateEstilo.destaque)]),
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

              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Meus treinos',
                    style: TextStyle(
                      color: Color(0xFF10251F),
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  GestureDetector(
                    onTap: _abrirNovoTreino,
                    child: Container(
                      width: 42,
                      height: 42,
                      decoration: BoxDecoration(
                        color: verdeClaro,
                        borderRadius: BorderRadius.circular(13),
                      ),
                      child: const Icon(
                        Icons.add_rounded,
                        color: verde,
                        size: 25,
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              if (treinos.isEmpty)
                _semTreinos()
              else
                ...List.generate(treinos.length, (index) {
                  final treino = treinos[index];
                  return _treino(
                    index: index,
                    titulo: treino.titulo,
                    data: treino.data,
                    horario: treino.horario,
                    duracao: treino.duracao,
                    status: treino.status,
                    destaque: treino.destaque,
                  );
                }),
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
              Icons.fitness_center_rounded,
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
                  'Gestão de treinos',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                SizedBox(height: 5),

                Text(
                  'Organize e acompanhe os treinamentos da equipe.',
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

  Widget _treino({
    required int index,
    required String titulo,
    required String data,
    required String horario,
    required String duracao,
    required String status,
    bool destaque = false,
  }) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(17),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: destaque ? verde : Color(0xFFE8DFD3),
          width: destaque ? 1.2 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Color(0xFF10251F).withValues(alpha: 0.025),
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
                width: 46,
                height: 46,
                decoration: BoxDecoration(
                  color: verdeClaro,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Icon(
                  Icons.fitness_center_rounded,
                  color: verde,
                  size: 23,
                ),
              ),

              const SizedBox(width: 12),

              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      titulo,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: Color(0xFF10251F),
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 5),

                    const Text(
                      'Treino programado',
                      style: TextStyle(color: Color(0xFF8A938F), fontSize: 10),
                    ),
                  ],
                ),
              ),

              Container(
                padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 6),
                decoration: BoxDecoration(
                  color: verdeClaro,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  status,
                  style: const TextStyle(
                    color: verde,
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
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
                    _confirmarExclusao(index);
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
                          'Excluir treino',
                          style: TextStyle(color: Color(0xFF005942)),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),

          const SizedBox(height: 16),

          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 11),
            decoration: BoxDecoration(
              color: fundo,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                Expanded(
                  child: _informacao(Icons.calendar_today_outlined, data),
                ),

                Expanded(
                  child: _informacao(Icons.access_time_outlined, horario),
                ),

                Expanded(child: _informacao(Icons.timer_outlined, duracao)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _informacao(IconData icone, String valor) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icone, size: 15, color: Color(0xFF68736F)),

        const SizedBox(width: 5),

        Flexible(
          child: Text(
            valor,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              color: Color(0xFF4F5A56),
              fontSize: 10,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ],
    );
  }

  Widget _semTreinos() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Color(0xFFE8DFD3)),
      ),
      child: Column(
        children: [
          Container(
            width: 55,
            height: 55,
            decoration: BoxDecoration(
              color: verdeClaro,
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Icon(
              Icons.fitness_center_rounded,
              color: verde,
              size: 28,
            ),
          ),

          const SizedBox(height: 14),

          const Text(
            'Nenhum treino cadastrado',
            style: TextStyle(
              color: Color(0xFF10251F),
              fontSize: 15,
              fontWeight: FontWeight.bold,
            ),
          ),

          const SizedBox(height: 5),

          Text(
            'Clique no + para adicionar um novo treino.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Color(0xFF68736F), fontSize: 11),
          ),
        ],
      ),
    );
  }

  // ============================================================
  // CONFIRMAR EXCLUSÃO
  // ============================================================

  void _confirmarExclusao(int index) {
    final treino = treinos[index];

    showDialog(
      context: context,
      builder: (dialogContext) {
        return AlertDialog(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(22),
          ),
          title: const Text(
            'Excluir treino?',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: Color(0xFF10251F),
            ),
          ),
          content: Text(
            'O treino "${treino.titulo}" será removido permanentemente.',
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
                  treinos.removeAt(index);
                });

                Navigator.pop(dialogContext);

                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Treino excluído.'),
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

  // ============================================================
  // NOVO TREINO
  // ============================================================

  void _abrirNovoTreino() {
    final TextEditingController tituloController = TextEditingController();
    final TextEditingController duracaoController = TextEditingController();
    final TextEditingController localController = TextEditingController();
    final TextEditingController objetivoController = TextEditingController();

    DateTime dataSelecionada = DateTime.now();
    TimeOfDay? horarioSelecionado;
    String statusSelecionado = 'Agendado';
    String categoriaSelecionada = 'Físico';

    final List<Map<String, TextEditingController>> exercicios = [];

    void adicionarExercicio() {
      exercicios.add({
        'nome': TextEditingController(),
        'series': TextEditingController(),
        'descricao': TextEditingController(),
      });
    }

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
                        TextSpan(children: [TextSpan(text: 'Novo '), TextSpan(text: 'treino', style: SateEstilo.destaque)]),
                        style: TextStyle(
                          color: Color(0xFF10251F),
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),

                      const SizedBox(height: 6),

                      Text(
                        'Preencha os detalhes do treino.',
                        style: TextStyle(
                          color: Color(0xFF68736F),
                          fontSize: 13,
                        ),
                      ),

                      const SizedBox(height: 22),

                      _campo(
                        controller: tituloController,
                        label: 'Título',
                        hint: 'Ex: Treino de velocidade',
                        icone: Icons.fitness_center_rounded,
                      ),

                      const SizedBox(height: 16),

                      const Text(
                        'Categoria',
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
                          _chipCategoria('Físico', categoriaSelecionada, () {
                            setModalState(() {
                              categoriaSelecionada = 'Físico';
                            });
                          }),
                          _chipCategoria('Técnico', categoriaSelecionada, () {
                            setModalState(() {
                              categoriaSelecionada = 'Técnico';
                            });
                          }),
                          _chipCategoria('Tático', categoriaSelecionada, () {
                            setModalState(() {
                              categoriaSelecionada = 'Tático';
                            });
                          }),
                        ],
                      ),

                      const SizedBox(height: 18),

                      Row(
                        children: [
                          Expanded(
                            child: _campoData(
                              label: 'Data',
                              data: dataSelecionada,
                              onTap: () async {
                                final escolhida = await showDatePicker(
                                  context: modalContext,
                                  initialDate: dataSelecionada,
                                  firstDate: DateTime(2020),
                                  lastDate: DateTime(2100),
                                );
                                if (escolhida != null) {
                                  setModalState(() {
                                    dataSelecionada = escolhida;
                                  });
                                }
                              },
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _campoHorario(
                              label: 'Horário',
                              horario: horarioSelecionado,
                              onTap: () async {
                                final escolhido = await showTimePicker(
                                  context: modalContext,
                                  initialTime:
                                      horarioSelecionado ??
                                      const TimeOfDay(hour: 8, minute: 0),
                                );
                                if (escolhido != null) {
                                  setModalState(() {
                                    horarioSelecionado = escolhido;
                                  });
                                }
                              },
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 12),

                      Row(
                        children: [
                          Expanded(
                            child: _campo(
                              controller: duracaoController,
                              label: 'Duração',
                              hint: 'Ex: 1h 30min',
                              icone: Icons.timer_outlined,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _campo(
                              controller: localController,
                              label: 'Local',
                              hint: 'Ex: Campo principal',
                              icone: Icons.location_on_outlined,
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 16),

                      TextField(
                        controller: objetivoController,
                        maxLines: 3,
                        decoration: InputDecoration(
                          labelText: 'Objetivo do treino',
                          hintText: 'Ex: Melhorar potência e velocidade',
                          alignLabelWithHint: true,
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
                      ),

                      const SizedBox(height: 18),

                      const Text(
                        'Status',
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
                          _chipStatus('Agendado', statusSelecionado, () {
                            setModalState(() {
                              statusSelecionado = 'Agendado';
                            });
                          }),
                          _chipStatus('Planejado', statusSelecionado, () {
                            setModalState(() {
                              statusSelecionado = 'Planejado';
                            });
                          }),
                          _chipStatus('Concluído', statusSelecionado, () {
                            setModalState(() {
                              statusSelecionado = 'Concluído';
                            });
                          }),
                        ],
                      ),

                      const SizedBox(height: 22),

                      Row(
                        children: [
                          const Expanded(
                            child: Text(
                              'Exercícios',
                              style: TextStyle(
                                color: Color(0xFF10251F),
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          GestureDetector(
                            onTap: () {
                              setModalState(() {
                                adicionarExercicio();
                              });
                            },
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 7,
                              ),
                              decoration: BoxDecoration(
                                color: verdeClaro,
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: const Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(
                                    Icons.add_rounded,
                                    color: verde,
                                    size: 18,
                                  ),
                                  SizedBox(width: 4),
                                  Text(
                                    'Adicionar',
                                    style: TextStyle(
                                      color: verde,
                                      fontSize: 11,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 12),

                      if (exercicios.isEmpty)
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(
                            vertical: 20,
                            horizontal: 15,
                          ),
                          decoration: BoxDecoration(
                            color: fundo,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: Color(0xFFE8DFD3)),
                          ),
                          child: Column(
                            children: [
                              Icon(
                                Icons.fitness_center_rounded,
                                color: Color(0xFFA3ADA9),
                                size: 30,
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Nenhum exercício adicionado',
                                style: TextStyle(
                                  color: Color(0xFF68736F),
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        )
                      else
                        ...List.generate(exercicios.length, (index) {
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 12),
                            child: _cardExercicioEditable(
                              numero: index + 1,
                              exercicio: exercicios[index],
                              onRemover: () {
                                setModalState(() {
                                  final removido = exercicios.removeAt(index);
                                  removido['nome']?.dispose();
                                  removido['series']?.dispose();
                                  removido['descricao']?.dispose();
                                });
                              },
                            ),
                          );
                        }),

                      const SizedBox(height: 12),

                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton(
                          onPressed: () {
                            if (tituloController.text.trim().isEmpty) {
                              ScaffoldMessenger.of(modalContext).showSnackBar(
                                const SnackBar(
                                  content: Text('Digite o título do treino.'),
                                ),
                              );
                              return;
                            }

                            if (horarioSelecionado == null) {
                              ScaffoldMessenger.of(modalContext).showSnackBar(
                                const SnackBar(
                                  content: Text(
                                    'Selecione o horário do treino.',
                                  ),
                                ),
                              );
                              return;
                            }

                            final horarioFormatado =
                                '${horarioSelecionado!.hour.toString().padLeft(2, '0')}:${horarioSelecionado!.minute.toString().padLeft(2, '0')}';

                            setState(() {
                              treinos.add(
                                Treino(
                                  titulo: tituloController.text.trim(),
                                  data: _formatarData(dataSelecionada),
                                  horario: horarioFormatado,
                                  duracao: duracaoController.text.trim().isEmpty
                                      ? '--'
                                      : duracaoController.text.trim(),
                                  status: statusSelecionado,
                                  categoria: categoriaSelecionada,
                                  local: localController.text.trim(),
                                  objetivo: objetivoController.text.trim(),
                                  exercicios: exercicios.map((e) {
                                    return {
                                      'nome': e['nome']!.text.trim(),
                                      'series': e['series']!.text.trim(),
                                      'descricao': e['descricao']!.text.trim(),
                                    };
                                  }).toList(),
                                ),
                              );
                            });

                            for (final e in exercicios) {
                              e['nome']?.dispose();
                              e['series']?.dispose();
                              e['descricao']?.dispose();
                            }

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
                            'ADICIONAR TREINO',
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
      duracaoController.dispose();
      localController.dispose();
      objetivoController.dispose();
      for (final e in exercicios) {
        e['nome']?.dispose();
        e['series']?.dispose();
        e['descricao']?.dispose();
      }
    });
  }

  Widget _campoData({
    required String label,
    required DateTime data,
    required VoidCallback onTap,
  }) {
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
              _formatarData(data),
              style: const TextStyle(
                color: Color(0xFF10251F),
                fontSize: 15,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
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

  Widget _campoCompacto({
    required TextEditingController controller,
    required String hint,
  }) {
    return TextField(
      controller: controller,
      style: const TextStyle(fontSize: 13),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(color: Color(0xFFA3ADA9), fontSize: 12),
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 12,
          vertical: 10,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(color: Color(0xFFE8DFD3)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(color: Color(0xFFE8DFD3)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: verde),
        ),
      ),
    );
  }

  Widget _chipCategoria(String valor, String selecionado, VoidCallback onTap) {
    final bool ativo = valor == selecionado;

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
          valor,
          style: TextStyle(
            color: ativo ? Colors.white : Color(0xFF4F5A56),
            fontSize: 11,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }

  Widget _chipStatus(String valor, String selecionado, VoidCallback onTap) {
    final bool ativo = valor == selecionado;

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
          valor,
          style: TextStyle(
            color: ativo ? Colors.white : Color(0xFF4F5A56),
            fontSize: 11,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }

  Widget _cardExercicioEditable({
    required int numero,
    required Map<String, TextEditingController> exercicio,
    required VoidCallback onRemover,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFFEFE6DA),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Color(0xFFE8DFD3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 30,
                height: 30,
                decoration: BoxDecoration(
                  color: verdeClaro,
                  borderRadius: BorderRadius.circular(10),
                ),
                alignment: Alignment.center,
                child: Text(
                  '$numero',
                  style: const TextStyle(
                    color: verde,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(width: 10),
              const Expanded(
                child: Text(
                  'Exercício',
                  style: TextStyle(
                    color: Color(0xFF10251F),
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              GestureDetector(
                onTap: onRemover,
                child: Container(
                  width: 30,
                  height: 30,
                  decoration: BoxDecoration(
                    color: const Color(0xFFFDE6EC),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(
                    Icons.delete_outline_rounded,
                    color: Color(0xFFC0392B),
                    size: 18,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),

          _campoCompacto(
            controller: exercicio['nome']!,
            hint: 'Nome do exercício',
          ),

          const SizedBox(height: 8),

          _campoCompacto(
            controller: exercicio['series']!,
            hint: 'Séries (ex: 3 × 10)',
          ),

          const SizedBox(height: 8),

          _campoCompacto(
            controller: exercicio['descricao']!,
            hint: 'Descrição (ex: Descanso 1 min)',
          ),
        ],
      ),
    );
  }

  String _formatarData(DateTime data) {
    return '${data.day.toString().padLeft(2, '0')}/'
        '${data.month.toString().padLeft(2, '0')}/'
        '${data.year}';
  }
}

class Treino {
  final String titulo;
  final String data;
  final String horario;
  final String duracao;
  final String status;
  final bool destaque;
  final String categoria;
  final String local;
  final String objetivo;
  final List<Map<String, String>> exercicios;

  Treino({
    required this.titulo,
    required this.data,
    required this.horario,
    required this.duracao,
    required this.status,
    this.destaque = false,
    this.categoria = 'Físico',
    this.local = '',
    this.objetivo = '',
    this.exercicios = const [],
  });
}
