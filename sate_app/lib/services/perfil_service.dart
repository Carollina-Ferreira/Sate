/// Fronteira entre a interface e o servidor para a CONTA do usuário.
///
/// Hoje o servidor do SATE só expõe: `POST /api/auth/login`, `POST /api/auth/cadastro`
/// e `POST /api/password/esqueci-senha`. O login devolve apenas os dados do usuário
/// (id, nome, e-mail, tipo), sem token de sessão. Por isso o aplicativo ainda NÃO consegue
/// gravar alterações de conta no servidor, e esta classe não finge que consegue.
///
/// O que falta no servidor para ativar cada operação:
///  - Sessão autenticada: o login precisa devolver um token (ex.: JWT) para as chamadas abaixo.
///  - [atualizarDados]: rota para alterar nome/e-mail (ex.: `PUT /api/usuarios/:id`).
///  - [alterarSenha]: rota que valide a senha atual e grave a nova
///    (ex.: `PUT /api/usuarios/:id/senha`).
///  - Foto de perfil no servidor: rota de envio de imagem (ex.: `POST /api/usuarios/:id/foto`).
///    Enquanto isso, a foto é guardada apenas neste aparelho.
///
/// Quando as rotas existirem, implemente as chamadas aqui e mude [disponivel] para `true`;
/// as telas já tratam todos os resultados.
enum ResultadoPerfil { sucesso, indisponivel, falha }

class PerfilService {
  PerfilService._();

  /// Indica se o servidor já oferece a atualização de dados da conta.
  static const bool disponivel = false;

  static Future<ResultadoPerfil> atualizarDados({
    required String nome,
    required String email,
  }) async {
    if (!disponivel) return ResultadoPerfil.indisponivel;
    // Integração pendente: ver a documentação desta classe.
    return ResultadoPerfil.indisponivel;
  }

  static Future<ResultadoPerfil> alterarSenha({
    required String senhaAtual,
    required String novaSenha,
  }) async {
    if (!disponivel) return ResultadoPerfil.indisponivel;
    // Integração pendente: ver a documentação desta classe.
    return ResultadoPerfil.indisponivel;
  }
}
