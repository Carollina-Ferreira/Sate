import 'package:flutter_test/flutter_test.dart';

import '../../lib/services/sessao.dart';

void main() {
  group('Usuário de sessão da API', () {
    test('restaura perfil do treinador corretamente', () {
      final usuario = UsuarioSessao.fromJson({
        'id': 42,
        'nome': 'Treinadora',
        'email': 'treinadora@example.test',
        'tipo': 'TREINADOR',
      });

      expect(usuario.id, 42);
      expect(usuario.ehTreinador, isTrue);
      expect(usuario.toJson()['tipo'], 'TREINADOR');
    });

    test('mantém atleta separado de treinador', () {
      final atleta = UsuarioSessao.fromJson({
        'id': 17,
        'nome': 'Atleta',
        'email': 'atleta@example.test',
        'tipo': 'ATLETA',
      });

      expect(atleta.ehTreinador, isFalse);
      expect(atleta.toJson()['id'], 17);
      expect(atleta.toJson()['email'], 'atleta@example.test');
    });
  });
}
