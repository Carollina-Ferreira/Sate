/// Regra ÚNICA de filtro por equipe ativa (Dart puro, sem Flutter: dá para testar sozinha).
///
/// Quando o treinador escolhe uma equipe, [equipeAtivaId] guarda o ID REAL dela
/// (o mesmo id do banco, nunca o nome) e tudo que aparece no app passa por aqui.
///
///  - [equipeAtivaId] nulo => sem filtro (comportamento do atleta e de quem ainda não escolheu).
///  - [equipeDe] devolve o id da equipe do item (nulo/vazio = item sem equipe).
///  - [aceitarSemEquipe]: true só para itens que valem para todas as equipes
///    (ex.: um evento da agenda cadastrado sem equipe). Para ATLETAS é false:
///    atleta sem vínculo com a equipe selecionada NÃO aparece.
List<T> noEscopoDaEquipe<T>(
  Iterable<T> itens,
  String? equipeAtivaId,
  String? Function(T item) equipeDe, {
  bool aceitarSemEquipe = false,
}) {
  if (equipeAtivaId == null) return itens.toList();
  return itens.where((i) {
    final e = equipeDe(i);
    if (e == null || e.isEmpty) return aceitarSemEquipe;
    return e == equipeAtivaId; // compara pelo ID, nunca pelo nome
  }).toList();
}
