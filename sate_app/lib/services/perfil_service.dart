import '../sate/data/sate_store.dart';
import 'api_client.dart';
import 'sate_api.dart';
import 'sessao.dart';

enum ResultadoPerfil { sucesso, indisponivel, falha }

/// Conta do usuário: alterações salvas no servidor (as mesmas do site).
///
///  - Nome/e-mail: `PUT /api/usuarios/perfil` (+ `PUT /api/atletas/me` para atletas,
///    para o nome também mudar no cadastro do atleta).
///  - Senha: `PUT /api/usuarios/senha` (valida a senha atual).
///  - Foto: `PUT /api/usuarios/perfil` com o arquivo (ver SateStore.definirFoto).
class PerfilService {
  PerfilService._();

  /// O servidor já oferece estas operações.
  static const bool disponivel = true;

  /// Mensagem de erro devolvida pela API na última chamada que falhou.
  static String? ultimaMensagem;

  static Future<ResultadoPerfil> atualizarDados({
    required String nome,
    required String email,
  }) async {
    ultimaMensagem = null;
    try {
      await SateApi.atualizarUsuario(nome: nome, email: email);
      final u = Sessao.usuario;
      if (u != null && !u.ehTreinador) {
        await SateApi.atualizarMeuPerfilAtleta({'nome': nome});
      }
      if (u != null) {
        await Sessao.atualizarUsuario(
            UsuarioSessao(id: u.id, nome: nome, email: email, tipo: u.tipo));
      }
      SateStore.i.nomeUsuario = nome;
      SateStore.i.emailUsuario = email;
      await SateStore.i.sincronizar(silencioso: true);
      return ResultadoPerfil.sucesso;
    } on ApiException catch (e) {
      ultimaMensagem = e.mensagem;
      return ResultadoPerfil.falha;
    } catch (_) {
      return ResultadoPerfil.falha;
    }
  }

  /// Altura (cm) e peso (kg) do atleta. Salvos no servidor (aparecem também no site).
  static Future<ResultadoPerfil> atualizarMedidas({int? alturaCm, double? pesoKg}) async {
    ultimaMensagem = null;
    try {
      await SateApi.atualizarMeuPerfilAtleta({
        if (alturaCm != null) 'alturaCm': alturaCm,
        if (pesoKg != null) 'pesoKg': pesoKg,
      });
      await SateStore.i.sincronizar(silencioso: true);
      return ResultadoPerfil.sucesso;
    } on ApiException catch (e) {
      ultimaMensagem = e.mensagem;
      return ResultadoPerfil.falha;
    } catch (_) {
      return ResultadoPerfil.falha;
    }
  }

  static Future<ResultadoPerfil> alterarSenha({
    required String senhaAtual,
    required String novaSenha,
  }) async {
    ultimaMensagem = null;
    try {
      await SateApi.alterarSenha(senhaAtual, novaSenha);
      return ResultadoPerfil.sucesso;
    } on ApiException catch (e) {
      ultimaMensagem = e.mensagem;
      return ResultadoPerfil.falha;
    } catch (_) {
      return ResultadoPerfil.falha;
    }
  }
}
