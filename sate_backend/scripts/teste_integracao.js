/*
 * Teste de integração da API do SATE (site + aplicativo mobile).
 *
 * Uso (com o servidor rodando e o banco migrado):
 *   BASE_URL=http://localhost:3000 node scripts/teste_integracao.js
 *
 * Cria dados de teste com e-mails únicos (teste.<timestamp>@sate.test).
 * Use um banco de DESENVOLVIMENTO — o script não apaga nada, mas cria registros.
 */
const BASE = process.env.BASE_URL || 'http://localhost:3000';
const sufixo = Date.now();
let ok = 0;
let falhas = 0;

function afirma(cond, nome, extra) {
    if (cond) {
        ok += 1;
        console.log(`  ✔ ${nome}`);
    } else {
        falhas += 1;
        console.log(`  ✘ ${nome}`, extra !== undefined ? JSON.stringify(extra) : '');
    }
}

async function api(metodo, caminho, { token, corpo } = {}) {
    const r = await fetch(`${BASE}${caminho}`, {
        method: metodo,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: corpo ? JSON.stringify(corpo) : undefined,
    });
    let json = null;
    try {
        json = await r.json();
    } catch {
        /* sem corpo */
    }
    return { status: r.status, json };
}

function dia(n) {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
    ).padStart(2, '0')}`;
}

(async () => {
    const emailT = `teste.treinador.${sufixo}@sate.test`;
    const emailA = `teste.atleta.${sufixo}@sate.test`;
    const emailB = `teste.atleta2.${sufixo}@sate.test`;
    const emailOutro = `teste.outro.${sufixo}@sate.test`;

    console.log('\n[1] Autenticação');
    let r = await api('POST', '/api/auth/cadastro', {
        corpo: { nome: 'Treinador Teste', email: emailT, senha: 'senha12345' },
    });
    afirma(r.status === 201, 'cadastro de treinador', r);
    r = await api('POST', '/api/auth/login', {
        corpo: { email: emailT, senha: 'senha12345', tipo: 'TREINADOR' },
    });
    afirma(r.status === 200 && r.json.token, 'login de treinador devolve token', r);
    const T = r.json.token;

    r = await api('POST', '/api/auth/login', {
        corpo: { email: emailT, senha: 'errada123', tipo: 'TREINADOR' },
    });
    afirma(r.status === 401, 'senha errada é recusada', r);
    r = await api('GET', '/api/mobile/me');
    afirma(r.status === 401, 'rota protegida sem token => 401', r);
    r = await api('GET', '/api/mobile/me', { token: T });
    afirma(r.status === 200 && r.json.usuario.tipo === 'TREINADOR', 'me (treinador)', r);

    console.log('\n[2] Treinador cadastra atletas pelo SITE (API existente)');
    r = await api('POST', '/api/atletas', {
        token: T,
        corpo: { nome: 'Ana Atleta', email: emailA, categoria: 'Sub-17', telefone: '11999990000' },
    });
    afirma(r.status === 201, 'POST /api/atletas', r);
    const atletaAId = r.json?.atleta?.id;
    const senhaA = r.json?.senhaTemporaria;
    r = await api('POST', '/api/atletas', {
        token: T,
        corpo: { nome: 'Bia Atleta', email: emailB, categoria: 'Sub-17' },
    });
    const atletaBId = r.json?.atleta?.id;
    const senhaB = r.json?.senhaTemporaria;
    afirma(!!senhaA && !!senhaB && senhaA !== senhaB, 'senhas provisórias são únicas por atleta');
    afirma(r.status === 201 && atletaBId, 'segundo atleta', r);

    r = await api('POST', '/api/equipes', {
        token: T,
        corpo: { nome: 'Vôlei Teste', modalidade: 'Vôlei', atletasIds: [atletaAId] },
    });
    afirma(r.status === 201 || r.status === 200, 'POST /api/equipes (com atleta A)', r);
    const equipeId = r.json?.equipe?.id ?? r.json?.id;
    afirma(!!equipeId, 'equipe criada tem id', r.json);

    console.log('\n[3] Atleta entra no app com a senha temporária e vê os mesmos dados');
    r = await api('POST', '/api/auth/login', {
        corpo: { email: emailA, senha: senhaA, tipo: 'ATLETA' },
    });
    afirma(r.status === 200 && r.json.token, 'login de atleta', r);
    const A = r.json.token;
    r = await api('POST', '/api/auth/login', {
        corpo: { email: emailA, senha: senhaA, tipo: 'TREINADOR' },
    });
    afirma(r.status === 403, 'atleta não entra como treinador', r);

    r = await api('GET', '/api/mobile/snapshot', { token: A });
    afirma(r.status === 200 && r.json.tipo === 'ATLETA', 'snapshot do atleta', r.json?.mensagem);
    afirma(r.json.equipes.length === 1 && r.json.equipes[0].id === equipeId, 'atleta vê a equipe criada no site');
    afirma(r.json.atletas.some((a) => a.id === atletaAId), 'atleta vê o próprio cadastro');
    afirma(!r.json.atletas.some((a) => a.id === atletaBId), 'atleta NÃO vê atleta de fora da equipe');

    r = await api('GET', '/api/mobile/snapshot', { token: T });
    afirma(r.json.atletas.length >= 2, 'treinador vê os atletas no snapshot');

    console.log('\n[4] Código de convite e entrada na equipe');
    r = await api('GET', `/api/equipes/${equipeId}/codigo`, { token: T });
    afirma(r.status === 200 && /^SATE-[A-Z2-9]{6}$/.test(r.json.codigo), 'treinador obtém código', r);
    const codigo = r.json.codigo;
    r = await api('GET', `/api/equipes/${equipeId}/codigo`, { token: A });
    afirma(r.status === 403, 'atleta não lê código da equipe', r);

    r = await api('POST', '/api/auth/login', {
        corpo: { email: emailB, senha: senhaB, tipo: 'ATLETA' },
    });
    const B = r.json.token;
    r = await api('POST', '/api/equipes/entrar', { token: B, corpo: { codigo: 'SATE-ZZZZZZ' } });
    afirma(r.status === 404, 'código inválido => 404', r);
    r = await api('POST', '/api/equipes/entrar', { token: B, corpo: { codigo } });
    afirma(r.status === 200, 'atleta B entra pelo código', r);
    r = await api('POST', '/api/equipes/entrar', { token: B, corpo: { codigo } });
    afirma(r.status === 200, 'entrar de novo é idempotente', r);
    r = await api('GET', '/api/equipes/minhas', { token: B });
    afirma(r.status === 200 && r.json[0]?.id === equipeId, 'GET /api/equipes/minhas');
    r = await api('GET', `/api/atletas/${atletaBId}`, { token: T });
    afirma(r.status === 200 && r.json.equipeId === equipeId, 'site enxerga o vínculo feito no app');

    console.log('\n[5] Notificações do treinador (geradas pelo app)');
    r = await api('GET', '/api/notificacoes', { token: T });
    afirma(
        r.status === 200 && r.json.notificacoes.some((n) => n.type === 'atleta_entrou_equipe'),
        'treinador recebe aviso de atleta que entrou',
        r.json
    );

    console.log('\n[6] Perfil do atleta (edição pelo app reflete no site)');
    r = await api('PUT', '/api/atletas/me', {
        token: A,
        corpo: { posicao: 'Levantadora', alturaCm: 175, pesoKg: 62.5, telefone: '11988887777' },
    });
    afirma(r.status === 200 && r.json.atleta.posicao === 'Levantadora', 'PUT /api/atletas/me', r);
    r = await api('GET', `/api/atletas/${atletaAId}`, { token: T });
    afirma(r.status === 200 && r.json.telefone === '11988887777', 'treinador vê telefone editado pelo atleta', r.json);
    r = await api('PUT', '/api/atletas/me', { token: A, corpo: { alturaCm: 5 } });
    afirma(r.status === 400, 'altura inválida é recusada', r);
    r = await api('PUT', '/api/atletas/me', { token: T, corpo: { posicao: 'x' } });
    afirma(r.status === 403, 'treinador não usa /atletas/me', r);

    console.log('\n[7] Agenda da equipe, treinos e exercícios');
    r = await api('PUT', `/api/equipes/${equipeId}/agenda`, {
        token: T,
        corpo: { local: 'Ginásio', diasTreino: [1, 3, 5], inicioMin: 1080, duracaoMin: 90 },
    });
    afirma(r.status === 200 && r.json.equipe.diasTreino.join() === '1,3,5', 'agenda recorrente da equipe', r);
    r = await api('PUT', `/api/equipes/${equipeId}/agenda`, { token: A, corpo: { local: 'x' } });
    afirma(r.status === 403, 'atleta não altera agenda da equipe', r);

    r = await api('POST', '/api/exercicios', {
        token: T,
        corpo: { nome: 'Agachamento', grupo: 'Força', series: 4, repeticoes: 12 },
    });
    afirma(r.status === 201, 'cria exercício', r);
    const exId = r.json.id;

    r = await api('POST', '/api/treinos', {
        token: T,
        corpo: {
            equipeId,
            titulo: 'Treino de saque',
            data: dia(2),
            inicioMin: 1100,
            duracaoMin: 75,
            exercicioIds: [exId, 'ex-demo'],
        },
    });
    afirma(r.status === 201, 'cria treino', r);
    const treinoId = r.json?.id;

    r = await api('POST', '/api/treinos', {
        token: T,
        corpo: { equipeId, titulo: 'Só a Ana', data: dia(3), atletaIds: [atletaAId] },
    });
    afirma(r.status === 201 && r.json.atletaIds.includes(atletaAId), 'treino para atleta específico', r);
    const treinoAnaId = r.json?.id;

    r = await api('GET', `/api/treinos?de=${dia(0)}&ate=${dia(10)}`, { token: A });
    afirma(r.status === 200 && r.json.some((t) => t.id === treinoId), 'atleta A vê treino da equipe');
    afirma(r.json.some((t) => t.id === treinoAnaId), 'atleta A vê treino dele');
    r = await api('GET', `/api/treinos?de=${dia(0)}&ate=${dia(10)}`, { token: B });
    afirma(r.json.some((t) => t.id === treinoId), 'atleta B vê treino da equipe');
    afirma(!r.json.some((t) => t.id === treinoAnaId), 'atleta B NÃO vê treino exclusivo da Ana');

    r = await api('PUT', `/api/treinos/${treinoId}`, { token: T, corpo: { inicioMin: 1200 } });
    afirma(r.status === 200 && r.json.inicioMin === 1200, 'treinador altera horário', r);
    r = await api('GET', `/api/treinos?de=${dia(0)}&ate=${dia(10)}`, { token: A });
    afirma(r.json.find((t) => t.id === treinoId)?.inicioMin === 1200, 'atleta vê o novo horário');
    r = await api('POST', '/api/treinos', {
        token: A,
        corpo: { equipeId, titulo: 'hack', data: dia(1) },
    });
    afirma(r.status === 403, 'atleta não cria treino', r);

    // Sessão recorrente: cancelar uma sessão padrão
    const chavePadrao = `p-${equipeId}-${dia(7)}`;
    r = await api('POST', '/api/treinos', {
        token: T,
        corpo: { equipeId, titulo: 'Sessão cancelada', data: dia(7), padraoChave: chavePadrao, cancelado: true },
    });
    afirma(r.status === 201 && r.json.cancelado === true, 'cancela sessão recorrente (padraoChave)', r);
    r = await api('POST', '/api/treinos', {
        token: T,
        corpo: { equipeId, titulo: 'Sessão reativada', data: dia(7), padraoChave: chavePadrao, cancelado: false },
    });
    afirma(r.status === 201 && r.json.cancelado === false, 'upsert por padraoChave não duplica', r);

    console.log('\n[8] Notificações do atleta (geradas pelo site/treinador)');
    r = await api('GET', '/api/notificacoes', { token: A });
    afirma(r.status === 200 && r.json.naoLidas >= 1, 'atleta tem notificações não lidas', r.json);
    const notif = r.json.notificacoes.find((n) => n.type === 'treino_agendado');
    afirma(!!notif, 'notificação de treino agendado existe');
    r = await api('PATCH', `/api/notificacoes/${notif.id}/lida`, { token: A });
    afirma(r.status === 200, 'marcar como lida', r);
    const antes = (await api('GET', '/api/notificacoes', { token: A })).json;
    afirma(antes.notificacoes.find((n) => n.id === notif.id).read === true, 'estado lida persistido');
    r = await api('PATCH', '/api/notificacoes/lidas', { token: A });
    afirma(r.status === 200, 'marcar todas como lidas', r);
    r = await api('GET', '/api/notificacoes', { token: A });
    afirma(r.json.naoLidas === 0, 'nenhuma não lida restante');
    r = await api('PATCH', `/api/notificacoes/${notif.id}/lida`, { token: B });
    afirma(r.status === 404, 'atleta B não mexe na notificação do A', r);

    console.log('\n[9] Frequência');
    r = await api('PUT', '/api/presencas', {
        token: T,
        corpo: { atletaId: atletaAId, data: dia(-1), presente: true },
    });
    afirma(r.status === 200 && r.json.presente === true, 'treinador marca presença', r);
    r = await api('PUT', '/api/presencas', {
        token: T,
        corpo: { atletaId: atletaAId, data: dia(-1), presente: false },
    });
    afirma(r.json.presente === false, 'altera para falta (upsert)');
    r = await api('GET', `/api/presencas?de=${dia(-5)}&ate=${dia(0)}`, { token: A });
    afirma(r.status === 200 && r.json.length === 1 && r.json[0].presente === false, 'atleta vê a própria frequência', r);
    r = await api('PUT', '/api/presencas', {
        token: A,
        corpo: { atletaId: atletaAId, data: dia(-1), presente: true },
    });
    afirma(r.status === 403, 'atleta não altera frequência', r);
    r = await api('PUT', '/api/presencas', {
        token: T,
        corpo: { atletaId: atletaAId, data: dia(-1), presente: null },
    });
    afirma(r.status === 200, 'limpa marcação');

    console.log('\n[10] Testes físicos');
    r = await api('POST', '/api/testes', {
        token: A,
        corpo: { teste: 'Salto vertical', unidade: 'cm', valor: 41.5 },
    });
    afirma(r.status === 201 && r.json.atletaId === atletaAId, 'atleta registra o próprio teste', r);
    const testeAtletaId = r.json?.id;
    r = await api('POST', '/api/testes', {
        token: A,
        corpo: { atletaId: atletaBId, teste: 'Salto vertical', unidade: 'cm', valor: 99 },
    });
    afirma(r.status === 404, 'atleta não registra teste de outro atleta', r);
    r = await api('POST', '/api/testes', {
        token: T,
        corpo: { atletaId: atletaAId, teste: 'Salto vertical', unidade: 'cm', valor: 43 },
    });
    afirma(r.status === 201, 'treinador registra teste do atleta', r);
    r = await api('GET', `/api/testes?atletaId=${atletaAId}`, { token: T });
    afirma(r.status === 200 && r.json.length === 2, 'histórico no treinador', r.json);
    r = await api('GET', '/api/testes', { token: A });
    afirma(r.json.length === 2, 'histórico no atleta (mesmos dados)');
    r = await api('GET', '/api/testes', { token: B });
    afirma(r.json.length === 0, 'atleta B não vê testes da A');
    r = await api('POST', '/api/testes', { token: A, corpo: { teste: 'x', unidade: 'cm', valor: 'abc' } });
    afirma(r.status === 400, 'valor inválido => 400', r);
    r = await api('DELETE', `/api/testes/${testeAtletaId}`, { token: B });
    afirma(r.status === 404, 'B não remove teste da A', r);
    r = await api('GET', '/api/notificacoes', { token: T });
    afirma(r.json.notificacoes.some((n) => n.type === 'teste_registrado_atleta'), 'treinador é avisado do teste do atleta');
    r = await api('GET', '/api/notificacoes', { token: A });
    afirma(r.json.notificacoes.some((n) => n.type === 'teste_registrado'), 'atleta é avisado do teste do treinador');

    console.log('\n[11] Eventos, metas, feedbacks, documentos');
    r = await api('POST', '/api/eventos', {
        token: T,
        corpo: { titulo: 'Jogo amistoso', tipo: 'JOGO', data: dia(5), inicioMin: 600, fimMin: 720, equipeId },
    });
    afirma(r.status === 201, 'cria evento', r);
    r = await api('GET', '/api/eventos', { token: A });
    afirma(r.status === 200 && r.json.some((e) => e.titulo === 'Jogo amistoso'), 'atleta vê evento');
    r = await api('POST', '/api/eventos', { token: T, corpo: { titulo: 'x', tipo: 'INVALIDO', data: dia(1) } });
    afirma(r.status === 400, 'tipo de evento inválido => 400', r);

    r = await api('POST', '/api/metas', {
        token: T,
        corpo: { atletaId: atletaAId, titulo: 'Saltar 45 cm', prazo: dia(60), progresso: 30 },
    });
    afirma(r.status === 201, 'treinador cria meta', r);
    const metaId = r.json?.id;
    r = await api('PUT', `/api/metas/${metaId}`, { token: T, corpo: { progresso: 100 } });
    afirma(r.status === 200 && r.json.progresso === 100, 'atualiza progresso', r);
    r = await api('PUT', `/api/metas/${metaId}`, { token: A, corpo: { progresso: 0 } });
    afirma(r.status === 403, 'atleta não altera meta', r);
    r = await api('GET', '/api/metas', { token: A });
    afirma(r.json.length === 1, 'atleta vê a meta');

    r = await api('POST', '/api/feedbacks', {
        token: T,
        corpo: { atletaId: atletaAId, texto: 'Ótima evolução no saque!' },
    });
    afirma(r.status === 201, 'treinador cria feedback', r);
    r = await api('GET', '/api/feedbacks', { token: A });
    afirma(r.json.length === 1, 'atleta lê feedback');
    r = await api('GET', '/api/feedbacks', { token: B });
    afirma(r.json.length === 0, 'atleta B não lê feedback da A');

    r = await api('POST', '/api/documentos', {
        token: A,
        corpo: { titulo: 'Atestado médico', categoria: 'Saúde', validade: dia(200) },
    });
    afirma(r.status === 201 && r.json.aprovado === false, 'atleta envia documento (pendente)', r);
    const docId = r.json?.id;
    r = await api('PUT', `/api/documentos/${docId}`, { token: A, corpo: { aprovado: true } });
    afirma(r.status === 403, 'atleta não se auto-aprova', r);
    r = await api('PUT', `/api/documentos/${docId}`, { token: T, corpo: { aprovado: true } });
    afirma(r.status === 200 && r.json.aprovado === true, 'treinador aprova documento', r);
    r = await api('DELETE', `/api/documentos/${docId}`, { token: A });
    afirma(r.status === 404, 'atleta não remove documento aprovado', r);

    console.log('\n[12] Isolamento entre treinadores');
    await api('POST', '/api/auth/cadastro', {
        corpo: { nome: 'Outro Treinador', email: emailOutro, senha: 'senha12345' },
    });
    r = await api('POST', '/api/auth/login', {
        corpo: { email: emailOutro, senha: 'senha12345', tipo: 'TREINADOR' },
    });
    const O = r.json.token;
    r = await api('GET', '/api/mobile/snapshot', { token: O });
    afirma(r.json.atletas.length === 0 && r.json.equipes.length === 0, 'outro treinador não vê nada do primeiro');
    r = await api('PUT', `/api/treinos/${treinoId}`, { token: O, corpo: { titulo: 'invasão' } });
    afirma(r.status === 404, 'outro treinador não altera treino', r);
    r = await api('PUT', '/api/presencas', {
        token: O,
        corpo: { atletaId: atletaAId, data: dia(-1), presente: true },
    });
    afirma(r.status === 404, 'outro treinador não marca presença', r);
    r = await api('POST', '/api/testes', {
        token: O,
        corpo: { atletaId: atletaAId, teste: 'x', unidade: 'cm', valor: 1 },
    });
    afirma(r.status === 404, 'outro treinador não registra teste', r);

    console.log('\n[13] Remoção de treino notifica o atleta');
    r = await api('DELETE', `/api/treinos/${treinoAnaId}`, { token: T });
    afirma(r.status === 200, 'treinador exclui treino', r);
    r = await api('GET', '/api/notificacoes', { token: A });
    afirma(
        r.json.notificacoes.some((n) => n.type === 'treino_cancelado'),
        'atleta recebe aviso de cancelamento'
    );

    console.log('\n[14] Informações profissionais do treinador');
    r = await api('PUT', '/api/mobile/perfil-profissional', {
        token: T,
        corpo: { formacao: 'Educação Física', registroProfissional: 'CREF 123456-G/SP', experiencia: '8 anos' },
    });
    afirma(r.status === 200 && r.json.treinador.formacao === 'Educação Física', 'treinador salva informações profissionais', r);
    r = await api('GET', '/api/mobile/snapshot', { token: T });
    afirma(r.json.treinador?.registroProfissional === 'CREF 123456-G/SP', 'snapshot devolve as informações salvas', r.json?.treinador);
    r = await api('PUT', '/api/mobile/perfil-profissional', { token: A, corpo: { formacao: 'x' } });
    afirma(r.status === 403, 'atleta não altera perfil profissional', r);
    r = await api('PUT', '/api/mobile/perfil-profissional', { token: T, corpo: { experiencia: 'x'.repeat(200) } });
    afirma(r.status === 400, 'texto longo demais => 400', r);
    r = await api('PUT', '/api/mobile/perfil-profissional', { token: T, corpo: { experiencia: '' } });
    afirma(r.status === 200 && r.json.treinador.experiencia === '', 'limpar um campo funciona', r);

    console.log(`\nResultado: ${ok} ok, ${falhas} falha(s)`);
    process.exit(falhas ? 1 : 0);
})().catch((e) => {
    console.error('Erro inesperado no teste:', e);
    process.exit(2);
});
