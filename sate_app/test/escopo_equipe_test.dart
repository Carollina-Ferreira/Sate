// Teste da regra de filtro por equipe (Dart puro).
// Rode com:  dart run test/escopo_equipe_test.dart
import '../lib/sate/data/escopo_equipe.dart';

class _Atl {
  final String nome;
  final String equipeId;
  const _Atl(this.nome, this.equipeId);
}

class _Ev {
  final String titulo;
  final String? equipeId;
  const _Ev(this.titulo, this.equipeId);
}

int _falhas = 0;

void verifica(bool cond, String nome) {
  if (cond) {
    print('  ok   $nome');
  } else {
    _falhas++;
    print('  FALHA $nome');
  }
}

void main() {
  const atletas = [
    _Atl('Ana', '1'),
    _Atl('Bia', '1'),
    _Atl('Caio', '2'),
    _Atl('Duda', '3'),
    _Atl('Eva', ''), // sem equipe
    _Atl('Fabi', '10'), // id 10 não pode "casar" com id 1
  ];

  List<String> nomes(String? ativa) =>
      noEscopoDaEquipe<_Atl>(atletas, ativa, (a) => a.equipeId).map((a) => a.nome).toList();

  print('Atletas por equipe');
  verifica(nomes('1').join(',') == 'Ana,Bia', 'Equipe 1 mostra só Ana e Bia');
  verifica(nomes('2').join(',') == 'Caio', 'Equipe 2 mostra só Caio');
  verifica(nomes('3').join(',') == 'Duda', 'Equipe 3 mostra só Duda');
  verifica(nomes('10').join(',') == 'Fabi', 'Equipe 10 não mistura com a 1 (compara id inteiro)');
  verifica(nomes('4').isEmpty, 'Equipe sem atletas devolve lista vazia');
  verifica(!nomes('1').contains('Eva'), 'Atleta sem equipe não aparece em nenhuma equipe');
  verifica(nomes(null).length == atletas.length, 'Sem equipe ativa não filtra (atleta/sem seleção)');
  verifica(nomes('1').join(',') == 'Ana,Bia', 'Trocar de volta para a equipe 1 não guarda dados da 2');

  print('Eventos (valem para uma equipe ou para todas)');
  const eventos = [_Ev('Jogo A', '1'), _Ev('Reunião geral', null), _Ev('Jogo B', '2'), _Ev('Aval. vazio', '')];
  List<String> evs(String? ativa) => noEscopoDaEquipe<_Ev>(
        eventos,
        ativa,
        (e) => e.equipeId,
        aceitarSemEquipe: true,
      ).map((e) => e.titulo).toList();
  verifica(evs('1').join(',') == 'Jogo A,Reunião geral,Aval. vazio', 'Equipe 1: seus eventos + os de todas as equipes');
  verifica(!evs('1').contains('Jogo B'), 'Evento da equipe 2 não aparece na equipe 1');
  verifica(evs('2').contains('Jogo B') && !evs('2').contains('Jogo A'), 'Equipe 2 só vê o próprio evento');

  print(_falhas == 0 ? '\nTODOS OS TESTES PASSARAM' : '\n$_falhas FALHA(S)');
  if (_falhas != 0) throw Exception('Testes falharam');
}
