
const prisma = require('../lib/prisma');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fs = require('fs');

const {
    sincronizarNotificacaoCadastroAtleta,
} = require('../services/notificacaoService');

// Retorna o treinador associado ao usuário autenticado.
async function obterTreinadorLogado(req) {
    if (!req.usuario || !req.usuario.id) return null;

    return prisma.treinador.findUnique({
        where: { usuarioId: Number(req.usuario.id) },
    });
}

function normalizarSexo(sexo) {
    if (!sexo) return null;

    const valor = String(sexo).trim().toUpperCase();

    const mapa = {
        MASCULINO: 'MASCULINO',
        FEMININO: 'FEMININO',
        OUTRO: 'OUTRO',
        NAO_INFORMADO: 'NAO_INFORMADO',
        'NÃO INFORMADO': 'NAO_INFORMADO',
        'NAO INFORMADO': 'NAO_INFORMADO',
    };

    return mapa[valor] || null;
}

const includeAtleta = {
    usuario: {
        select: {
            id: true,
            nome: true,
            email: true,
            tipo: true,
            avatarUrl: true,
        },
    },
    responsavel: true,
    endereco: true,
    equipe: {
        select: {
            id: true,
            nome: true,
            modalidade: true,
            categoria: true,
        },
    },
    documentos: true,
};

// ============================================================
// LISTAR TODOS OS ATLETAS DO TREINADOR
// ============================================================

async function listarAtletas(req, res) {
    try {
        const treinador = await obterTreinadorLogado(req);

        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.',
            });
        }

        const atletas = await prisma.atleta.findMany({
            where: { treinadorId: treinador.id },
            include: includeAtleta,
            orderBy: { createdAt: 'desc' },
        });

        return res.status(200).json(atletas);
    } catch (error) {
        console.error('Erro ao listar atletas:', error);

        return res.status(500).json({
            mensagem: 'Erro ao listar atletas.',
            erro: error.message,
        });
    }
}

// ============================================================
// LISTAR ATLETAS DISPONÍVEIS PARA EQUIPE
// ============================================================

async function listarAtletasDisponiveis(req, res) {
    try {
        const treinador = await obterTreinadorLogado(req);

        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.',
            });
        }

        const atletas = await prisma.atleta.findMany({
            where: {
                treinadorId: treinador.id,
                equipeId: null,
            },
            select: {
                id: true,
                nome: true,
                categoria: true,
                telefone: true,
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: { nome: 'asc' },
        });

        return res.status(200).json(atletas);
    } catch (error) {
        console.error(
            'Erro ao listar atletas disponíveis:',
            error
        );

        return res.status(500).json({
            mensagem: 'Erro ao listar atletas disponíveis.',
            erro: error.message,
        });
    }
}

// ============================================================
// BUSCAR ATLETA POR ID
// ============================================================

async function buscarAtleta(req, res) {
    try {
        const treinador = await obterTreinadorLogado(req);

        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.',
            });
        }

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: 'ID do atleta inválido.',
            });
        }

        const atleta = await prisma.atleta.findFirst({
            where: {
                id,
                treinadorId: treinador.id,
            },
            include: includeAtleta,
        });

        if (!atleta) {
            return res.status(404).json({
                mensagem: 'Atleta não encontrado.',
            });
        }

        return res.status(200).json(atleta);
    } catch (error) {
        console.error('Erro ao buscar atleta:', error);

        return res.status(500).json({
            mensagem: 'Erro ao buscar atleta.',
            erro: error.message,
        });
    }
}

// ============================================================
// CRIAR ATLETA
// ============================================================

async function criarAtleta(req, res) {
    try {
        const treinador = await obterTreinadorLogado(req);

        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.',
            });
        }

        const {
            nome,
            email,
            cpf,
            rg,
            dataNascimento,
            sexo,
            categoria,
            telefone,
            responsavel,
            endereco,
        } = req.body;

        const nomeNormalizado = nome
            ? String(nome).trim()
            : '';

        const emailNormalizado = email
            ? String(email).trim().toLowerCase()
            : null;

        const cpfNormalizado = cpf
            ? String(cpf).trim()
            : null;

        const rgNormalizado = rg
            ? String(rg).trim()
            : null;

        const categoriaNormalizada = categoria
            ? String(categoria).trim()
            : null;

        const telefoneNormalizado = telefone
            ? String(telefone).trim()
            : null;

        const sexoNormalizado = normalizarSexo(sexo);

        if (!nomeNormalizado) {
            return res.status(400).json({
                mensagem: 'Nome do atleta é obrigatório.',
            });
        }

        if (!emailNormalizado) {
            return res.status(400).json({
                mensagem: 'E-mail do atleta é obrigatório.',
            });
        }

        let dataNascimentoNormalizada = null;

        if (dataNascimento) {
            const data = new Date(dataNascimento);

            if (Number.isNaN(data.getTime())) {
                return res.status(400).json({
                    mensagem: 'Data de nascimento inválida.',
                });
            }

            dataNascimentoNormalizada = data;
        }

        const usuarioExistente = await prisma.usuario.findUnique({
            where: {
                email: emailNormalizado,
            },
        });

        if (usuarioExistente) {
            return res.status(409).json({
                mensagem: 'Já existe um usuário cadastrado com este e-mail.',
            });
        }

        if (cpfNormalizado) {
            const atletaCpfExistente = await prisma.atleta.findUnique({
                where: {
                    cpf: cpfNormalizado,
                },
            });

            if (atletaCpfExistente) {
                return res.status(409).json({
                    mensagem: 'Já existe um atleta cadastrado com este CPF.',
                });
            }
        }

        // Senha provisória única: a senha fixa permitia acessar qualquer novo atleta.
        // Entregue-a ao usuário pelo fluxo de cadastro já existente.
        const senhaTemporaria = 'SATE-' + crypto.randomBytes(12).toString('base64url');

        const senhaHash = await bcrypt.hash(
            senhaTemporaria,
            10
        );

        const resultado = await prisma.$transaction(async (tx) => {
            const usuario = await tx.usuario.create({
                data: {
                    email: emailNormalizado,
                    senha: senhaHash,
                    tipo: 'ATLETA',
                    nome: nomeNormalizado,
                    primeiroAcesso: true,
                },
            });

            let responsavelCriado = null;

            if (responsavel && responsavel.nome) {
                responsavelCriado = await tx.responsavel.create({
                    data: {
                        nome: String(responsavel.nome).trim(),

                        grauParentesco: responsavel.grauParentesco
                            ? String(responsavel.grauParentesco).trim()
                            : '',

                        telefone: responsavel.telefone
                            ? String(responsavel.telefone).trim()
                            : '',
                    },
                });
            }

            let enderecoCriado = null;

            if (
                endereco &&
                endereco.cep &&
                endereco.logradouro &&
                endereco.numero &&
                endereco.bairro
            ) {
                enderecoCriado = await tx.endereco.create({
                    data: {
                        cep: String(endereco.cep).trim(),
                        logradouro: String(endereco.logradouro).trim(),
                        numero: String(endereco.numero).trim(),
                        bairro: String(endereco.bairro).trim(),

                        complemento: endereco.complemento
                            ? String(endereco.complemento).trim()
                            : null,

                        cidade: endereco.cidade
                            ? String(endereco.cidade).trim()
                            : null,

                        estado: endereco.estado
                            ? String(endereco.estado).trim()
                            : null,
                    },
                });
            }

            const atleta = await tx.atleta.create({
                data: {
                    nome: nomeNormalizado,
                    cpf: cpfNormalizado,
                    rg: rgNormalizado,
                    dataNascimento: dataNascimentoNormalizada,
                    sexo: sexoNormalizado,
                    categoria: categoriaNormalizada,
                    telefone: telefoneNormalizado,

                    usuario: {
                        connect: {
                            id: usuario.id,
                        },
                    },

                    treinador: {
                        connect: {
                            id: treinador.id,
                        },
                    },

                    ...(responsavelCriado && {
                        responsavel: {
                            connect: {
                                id: responsavelCriado.id,
                            },
                        },
                    }),

                    ...(enderecoCriado && {
                        endereco: {
                            connect: {
                                id: enderecoCriado.id,
                            },
                        },
                    }),
                },

                include: {
                    usuario: {
                        select: {
                            id: true,
                            nome: true,
                            email: true,
                            tipo: true,
                            avatarUrl: true,
                        },
                    },
                    responsavel: true,
                    endereco: true,
                    documentos: true,
                },
            });

            // Verifica os dados do atleta e cria
            // uma notificação caso existam pendências.
            await sincronizarNotificacaoCadastroAtleta(
                tx,
                treinador.id,
                atleta
            );

            return {
                atleta,
                senhaTemporaria,
            };
        });

        return res.status(201).json({
            mensagem: 'Atleta cadastrado com sucesso.',
            atleta: resultado.atleta,
            senhaTemporaria: resultado.senhaTemporaria,
        });
    } catch (error) {
        console.error('Erro ao criar atleta:', error);

        return res.status(500).json({
            mensagem: 'Erro ao cadastrar atleta.',
            erro: error.message,
        });
    }
}

// ============================================================
// ATUALIZAR ATLETA
// ============================================================

async function atualizarAtleta(req, res) {
    try {
        const treinador = await obterTreinadorLogado(req);

        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.',
            });
        }

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: 'ID do atleta inválido.',
            });
        }

        const atletaExistente = await prisma.atleta.findFirst({
            where: {
                id,
                treinadorId: treinador.id,
            },
            include: {
                usuario: true,
            },
        });

        if (!atletaExistente) {
            return res.status(404).json({
                mensagem: 'Atleta não encontrado.',
            });
        }

        const {
            nome,
            email,
            cpf,
            rg,
            dataNascimento,
            sexo,
            categoria,
            telefone,
            avatarUrl,
        } = req.body;

        const dadosAtleta = {};

        if (nome !== undefined) {
            dadosAtleta.nome = nome && String(nome).trim()
                ? String(nome).trim()
                : null;
        }

        if (cpf !== undefined) {
            dadosAtleta.cpf = cpf && String(cpf).trim()
                ? String(cpf).trim()
                : null;
        }

        if (rg !== undefined) {
            dadosAtleta.rg = rg && String(rg).trim()
                ? String(rg).trim()
                : null;
        }

        if (categoria !== undefined) {
            dadosAtleta.categoria = categoria && String(categoria).trim()
                ? String(categoria).trim()
                : null;
        }

        if (telefone !== undefined) {
            dadosAtleta.telefone = telefone && String(telefone).trim()
                ? String(telefone).trim()
                : null;
        }

        if (sexo !== undefined) {
            dadosAtleta.sexo = normalizarSexo(sexo);
        }

        if (dataNascimento !== undefined) {
            if (!dataNascimento) {
                dadosAtleta.dataNascimento = null;
            } else {
                const data = new Date(dataNascimento);

                if (Number.isNaN(data.getTime())) {
                    return res.status(400).json({
                        mensagem: 'Data de nascimento inválida.',
                    });
                }

                dadosAtleta.dataNascimento = data;
            }
        }

        let emailNormalizado = null;

        if (email !== undefined) {
            emailNormalizado = email && String(email).trim()
                ? String(email).trim().toLowerCase()
                : null;

            if (!emailNormalizado) {
                return res.status(400).json({
                    mensagem: 'O e-mail do atleta é obrigatório.',
                });
            }
        }

        let avatarUrlNormalizado;

        if (avatarUrl !== undefined) {
            avatarUrlNormalizado = avatarUrl && String(avatarUrl).trim()
                ? String(avatarUrl).trim()
                : null;
        }

        if (
            cpf !== undefined &&
            cpf &&
            String(cpf).trim()
        ) {
            const cpfExistente = await prisma.atleta.findFirst({
                where: {
                    cpf: String(cpf).trim(),
                    id: {
                        not: id,
                    },
                },
            });

            if (cpfExistente) {
                return res.status(409).json({
                    mensagem: 'Este CPF já está cadastrado.',
                });
            }
        }

        if (emailNormalizado) {
            const usuarioComEmail = await prisma.usuario.findFirst({
                where: {
                    email: emailNormalizado,
                    id: {
                        not: atletaExistente.usuarioId,
                    },
                },
            });

            if (usuarioComEmail) {
                return res.status(409).json({
                    mensagem: 'Este e-mail já está cadastrado.',
                });
            }
        }

        const resultado = await prisma.$transaction(async (tx) => {
            await tx.atleta.update({
                where: { id },
                data: dadosAtleta,
            });

            if (emailNormalizado || avatarUrl !== undefined) {
                const dadosUsuario = {};

                if (emailNormalizado) {
                    dadosUsuario.email = emailNormalizado;
                }

                if (avatarUrl !== undefined) {
                    dadosUsuario.avatarUrl = avatarUrlNormalizado;
                }

                await tx.usuario.update({
                    where: {
                        id: atletaExistente.usuarioId,
                    },
                    data: dadosUsuario,
                });
            }

            const atletaAtualizado = await tx.atleta.findUnique({
                where: { id },
                include: includeAtleta,
            });

            // Atualiza ou resolve a notificação
            // conforme os dados atuais do atleta.
            await sincronizarNotificacaoCadastroAtleta(
                tx,
                treinador.id,
                atletaAtualizado
            );

            return atletaAtualizado;
        });

        return res.status(200).json({
            mensagem: 'Atleta atualizado com sucesso.',
            atleta: resultado,
        });
    } catch (error) {
        console.error('Erro ao atualizar atleta:', error);

        return res.status(500).json({
            mensagem: 'Erro ao atualizar atleta.',
            erro: error.message,
        });
    }
}

// ============================================================
// ADICIONAR DOCUMENTO AO ATLETA
// Rota esperada: POST /api/atletas/:id/documentos
// Multer deve usar single('arquivo') e diskStorage.
// ============================================================

async function adicionarDocumento(req, res) {
    async function removerArquivoEnviado() {
        if (!req.file || !req.file.path) return;

        try {
            await fs.promises.unlink(req.file.path);
        } catch (erroArquivo) {
            if (erroArquivo.code !== 'ENOENT') {
                console.error(
                    'Não foi possível remover o arquivo enviado:',
                    erroArquivo
                );
            }
        }
    }

    try {
        if (!req.file) {
            return res.status(400).json({
                mensagem: 'Selecione um arquivo PDF para enviar.',
            });
        }

        const treinador = await obterTreinadorLogado(req);

        if (!treinador) {
            await removerArquivoEnviado();

            return res.status(401).json({
                mensagem: 'Treinador não identificado.',
            });
        }

        const atletaId = Number(req.params.id);

        if (!Number.isInteger(atletaId) || atletaId <= 0) {
            await removerArquivoEnviado();

            return res.status(400).json({
                mensagem: 'ID do atleta inválido.',
            });
        }

        const nomeOriginal = String(
            req.file.originalname || 'Documento.pdf'
        );

        const extensao = nomeOriginal.split('.').pop().toLowerCase();

        const mimeType = String(
            req.file.mimetype || ''
        ).toLowerCase();

        if (
            extensao !== 'pdf' ||
            (mimeType && mimeType !== 'application/pdf')
        ) {
            await removerArquivoEnviado();

            return res.status(400).json({
                mensagem: 'Formato inválido. Envie apenas arquivos PDF.',
            });
        }

        if (!req.file.filename) {
            await removerArquivoEnviado();

            return res.status(500).json({
                mensagem: 'O arquivo não foi salvo corretamente pelo servidor.',
            });
        }

        const atleta = await prisma.atleta.findFirst({
            where: {
                id: atletaId,
                treinadorId: treinador.id,
            },
            select: {
                id: true,
            },
        });

        if (!atleta) {
            await removerArquivoEnviado();

            return res.status(404).json({
                mensagem: 'Atleta não encontrado.',
            });
        }

        const nomeInformado = req.body && req.body.nome
            ? String(req.body.nome).trim()
            : '';

        const nomeSemExtensao = nomeOriginal.replace(/\.pdf$/i, '');

        const nomeDocumento = nomeInformado ||
            nomeSemExtensao ||
            'Documento';

        const urlDocumento = `/uploads/documentos/${req.file.filename}`;

        const documento = await prisma.documento.create({
            data: {
                nome: nomeDocumento,
                tipo: 'PDF',
                url: urlDocumento,
                atletaId: atleta.id,
            },
        });

        return res.status(201).json({
            mensagem: 'Documento adicionado com sucesso.',
            documento,
        });
    } catch (error) {
        await removerArquivoEnviado();

        console.error(
            'Erro ao adicionar documento do atleta:',
            error
        );

        return res.status(500).json({
            mensagem: 'Erro ao adicionar documento.',
            erro: error.message,
        });
    }
}

// ============================================================
// EXCLUIR ATLETA
// ============================================================

async function excluirAtleta(req, res) {
    try {
        const treinador = await obterTreinadorLogado(req);

        if (!treinador) {
            return res.status(401).json({
                mensagem: 'Treinador não identificado.',
            });
        }

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: 'ID do atleta inválido.',
            });
        }

        const atleta = await prisma.atleta.findFirst({
            where: {
                id,
                treinadorId: treinador.id,
            },
        });

        if (!atleta) {
            return res.status(404).json({
                mensagem: 'Atleta não encontrado.',
            });
        }

        await prisma.$transaction(async (tx) => {
            // Resolve a notificação antes de excluir o atleta.
            await tx.notificacao.updateMany({
                where: {
                    treinadorId: treinador.id,
                    chave: `cadastro-atleta-${id}`,
                    resolvidaEm: null,
                },
                data: {
                    resolvidaEm: new Date(),
                },
            });

            await tx.atleta.delete({
                where: { id },
            });
        });

        return res.status(200).json({
            mensagem: 'Atleta excluído com sucesso.',
        });
    } catch (error) {
        console.error('Erro ao excluir atleta:', error);

        return res.status(500).json({
            mensagem: 'Erro ao excluir atleta.',
            erro: error.message,
        });
    }
}

// ============================================================
// EXPORTAÇÕES
// ============================================================

module.exports = {
    listarAtletas,
    listarAtletasDisponiveis,
    buscarAtleta,
    criarAtleta,
    atualizarAtleta,
    adicionarDocumento,
    excluirAtleta,
};
