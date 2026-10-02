const prisma = require('../lib/prisma');
const bcrypt = require('bcrypt');


// ============================================================
// BUSCAR TREINADOR LOGADO
// ============================================================

async function obterTreinadorLogado(req) {

    if (!req.usuario || !req.usuario.id) {
        return null;
    }

    const treinador =
        await prisma.treinador.findUnique({
            where: {
                usuarioId:
                    Number(req.usuario.id),
            },
        });

    return treinador;
}


// ============================================================
// NORMALIZAR SEXO
// ============================================================

function normalizarSexo(sexo) {

    if (!sexo) {
        return null;
    }

    const valor =
        String(sexo)
            .trim()
            .toUpperCase();

    const mapa = {

        MASCULINO:
            'MASCULINO',

        FEMININO:
            'FEMININO',

        OUTRO:
            'OUTRO',

        NAO_INFORMADO:
            'NAO_INFORMADO',

        'NÃO INFORMADO':
            'NAO_INFORMADO',

        'NAO INFORMADO':
            'NAO_INFORMADO',
    };

    return mapa[valor] || null;
}


// ============================================================
// LISTAR TODOS OS ATLETAS DO TREINADOR
// ============================================================

async function listarAtletas(req, res) {

    try {

        const treinador =
            await obterTreinadorLogado(req);

        if (!treinador) {

            return res.status(401).json({
                mensagem:
                    'Treinador não identificado.',
            });
        }


        const atletas =
            await prisma.atleta.findMany({

                where: {
                    treinadorId:
                        treinador.id,
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

                    equipe: {
                        select: {
                            id: true,
                            nome: true,
                            modalidade: true,
                            categoria: true,
                        },
                    },
                },

                orderBy: {
                    createdAt: 'desc',
                },
            });


        return res.status(200).json(
            atletas
        );

    } catch (error) {

        console.error(
            'Erro ao listar atletas:',
            error
        );

        return res.status(500).json({
            mensagem:
                'Erro ao listar atletas.',
            erro:
                error.message,
        });
    }
}


// ============================================================
// LISTAR ATLETAS DISPONÍVEIS PARA EQUIPE
// ============================================================

async function listarAtletasDisponiveis(
    req,
    res
) {

    try {

        const treinador =
            await obterTreinadorLogado(req);

        if (!treinador) {

            return res.status(401).json({
                mensagem:
                    'Treinador não identificado.',
            });
        }


        const atletas =
            await prisma.atleta.findMany({

                where: {

                    treinadorId:
                        treinador.id,

                    equipeId:
                        null,
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

                orderBy: {
                    nome: 'asc',
                },
            });


        return res.status(200).json(
            atletas
        );

    } catch (error) {

        console.error(
            'Erro ao listar atletas disponíveis:',
            error
        );

        return res.status(500).json({
            mensagem:
                'Erro ao listar atletas disponíveis.',
            erro:
                error.message,
        });
    }
}


// ============================================================
// BUSCAR ATLETA POR ID
// ============================================================

async function buscarAtleta(req, res) {

    try {

        const treinador =
            await obterTreinadorLogado(req);

        if (!treinador) {

            return res.status(401).json({
                mensagem:
                    'Treinador não identificado.',
            });
        }


        const id =
            Number(req.params.id);


        if (!Number.isInteger(id)) {

            return res.status(400).json({
                mensagem:
                    'ID do atleta inválido.',
            });
        }


        const atleta =
            await prisma.atleta.findFirst({

                where: {

                    id,

                    treinadorId:
                        treinador.id,
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

                    equipe: {
                        select: {
                            id: true,
                            nome: true,
                            modalidade: true,
                            categoria: true,
                        },
                    },

                    documentos: true,
                },
            });


        if (!atleta) {

            return res.status(404).json({
                mensagem:
                    'Atleta não encontrado.',
            });
        }


        return res.status(200).json(
            atleta
        );

    } catch (error) {

        console.error(
            'Erro ao buscar atleta:',
            error
        );

        return res.status(500).json({
            mensagem:
                'Erro ao buscar atleta.',
            erro:
                error.message,
        });
    }
}


// ============================================================
// CRIAR ATLETA
// ============================================================

async function criarAtleta(req, res) {

    try {

        const treinador =
            await obterTreinadorLogado(req);

        if (!treinador) {

            return res.status(401).json({
                mensagem:
                    'Treinador não identificado.',
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


        // ====================================================
        // NORMALIZAÇÃO
        // ====================================================

        const emailNormalizado =
            email
                ? String(email)
                    .trim()
                    .toLowerCase()
                : null;


        const cpfNormalizado =
            cpf
                ? String(cpf).trim()
                : null;


        const rgNormalizado =
            rg
                ? String(rg).trim()
                : null;


        const categoriaNormalizada =
            categoria
                ? String(categoria).trim()
                : null;


        const telefoneNormalizado =
            telefone
                ? String(telefone).trim()
                : null;


        const sexoNormalizado =
            normalizarSexo(sexo);


        // ====================================================
        // VALIDAÇÕES
        // ====================================================

        if (
            !nome ||
            !String(nome).trim()
        ) {

            return res.status(400).json({
                mensagem:
                    'Nome do atleta é obrigatório.',
            });
        }


        if (!emailNormalizado) {

            return res.status(400).json({
                mensagem:
                    'E-mail do atleta é obrigatório.',
            });
        }


        // ====================================================
        // VALIDAR DATA
        // ====================================================

        let dataNascimentoNormalizada =
            null;


        if (dataNascimento) {

            const data =
                new Date(dataNascimento);


            if (isNaN(data.getTime())) {

                return res.status(400).json({
                    mensagem:
                        'Data de nascimento inválida.',
                });
            }


            dataNascimentoNormalizada =
                data;
        }


        // ====================================================
        // VERIFICAR E-MAIL DUPLICADO
        // ====================================================

        const usuarioExistente =
            await prisma.usuario.findUnique({

                where: {
                    email:
                        emailNormalizado,
                },
            });


        if (usuarioExistente) {

            return res.status(409).json({
                mensagem:
                    'Já existe um usuário cadastrado com este e-mail.',
            });
        }


        // ====================================================
        // VERIFICAR CPF DUPLICADO
        // ====================================================

        if (cpfNormalizado) {

            const atletaCpfExistente =
                await prisma.atleta.findUnique({

                    where: {
                        cpf:
                            cpfNormalizado,
                    },
                });


            if (atletaCpfExistente) {

                return res.status(409).json({
                    mensagem:
                        'Já existe um atleta cadastrado com este CPF.',
                });
            }
        }


        // ====================================================
        // SENHA TEMPORÁRIA
        // ====================================================

        const senhaTemporaria =
            'SATE@123';


        const senhaHash =
            await bcrypt.hash(
                senhaTemporaria,
                10
            );


        // ====================================================
        // TRANSACTION
        // ====================================================

        const resultado =
            await prisma.$transaction(
                async (tx) => {

                    // ----------------------------------------
                    // USUÁRIO
                    // ----------------------------------------

                    const usuario =
                        await tx.usuario.create({

                            data: {

                                email:
                                    emailNormalizado,

                                senha:
                                    senhaHash,

                                tipo:
                                    'ATLETA',

                                nome:
                                    String(
                                        nome
                                    ).trim(),

                                primeiroAcesso:
                                    true,
                            },
                        });


                    // ----------------------------------------
                    // RESPONSÁVEL
                    // ----------------------------------------

                    let responsavelCriado =
                        null;


                    if (
                        responsavel &&
                        responsavel.nome
                    ) {

                        responsavelCriado =
                            await tx.responsavel.create({

                                data: {

                                    nome:
                                        String(
                                            responsavel.nome
                                        ).trim(),

                                    grauParentesco:
                                        responsavel
                                            .grauParentesco
                                            ? String(
                                                responsavel
                                                    .grauParentesco
                                            ).trim()
                                            : '',

                                    telefone:
                                        responsavel
                                            .telefone
                                            ? String(
                                                responsavel
                                                    .telefone
                                            ).trim()
                                            : '',
                                },
                            });
                    }


                    // ----------------------------------------
                    // ENDEREÇO
                    // ----------------------------------------

                    let enderecoCriado =
                        null;


                    if (
                        endereco &&
                        endereco.cep &&
                        endereco.logradouro &&
                        endereco.numero &&
                        endereco.bairro
                    ) {

                        enderecoCriado =
                            await tx.endereco.create({

                                data: {

                                    cep:
                                        String(
                                            endereco.cep
                                        ).trim(),

                                    logradouro:
                                        String(
                                            endereco.logradouro
                                        ).trim(),

                                    numero:
                                        String(
                                            endereco.numero
                                        ).trim(),

                                    bairro:
                                        String(
                                            endereco.bairro
                                        ).trim(),

                                    complemento:
                                        endereco.complemento
                                            ? String(
                                                endereco.complemento
                                            ).trim()
                                            : null,

                                    cidade:
                                        endereco.cidade
                                            ? String(
                                                endereco.cidade
                                            ).trim()
                                            : null,

                                    estado:
                                        endereco.estado
                                            ? String(
                                                endereco.estado
                                            ).trim()
                                            : null,
                                },
                            });
                    }


                    // ----------------------------------------
                    // ATLETA
                    // ----------------------------------------

                    const atleta =
                        await tx.atleta.create({

                            data: {

                                nome:
                                    String(
                                        nome
                                    ).trim(),

                                cpf:
                                    cpfNormalizado,

                                rg:
                                    rgNormalizado,

                                dataNascimento:
                                    dataNascimentoNormalizada,

                                sexo:
                                    sexoNormalizado,

                                categoria:
                                    categoriaNormalizada,

                                telefone:
                                    telefoneNormalizado,

                                usuario: {
                                    connect: {
                                        id:
                                            usuario.id,
                                    },
                                },

                                treinador: {
                                    connect: {
                                        id:
                                            treinador.id,
                                    },
                                },

                                ...(responsavelCriado && {
                                    responsavel: {
                                        connect: {
                                            id:
                                                responsavelCriado.id,
                                        },
                                    },
                                }),

                                ...(enderecoCriado && {
                                    endereco: {
                                        connect: {
                                            id:
                                                enderecoCriado.id,
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
                            },
                        });


                    return {
                        atleta,
                        senhaTemporaria,
                    };
                }
            );


        // ====================================================
        // RESPOSTA
        // ====================================================

        return res.status(201).json({

            mensagem:
                'Atleta cadastrado com sucesso.',

            atleta:
                resultado.atleta,

            senhaTemporaria:
                resultado.senhaTemporaria,
        });

    } catch (error) {

        console.error(
            'Erro ao criar atleta:',
            error
        );

        return res.status(500).json({
            mensagem:
                'Erro ao cadastrar atleta.',
            erro:
                error.message,
        });
    }
}


// ============================================================
// ATUALIZAR ATLETA
// ============================================================

async function atualizarAtleta(req, res) {

    try {

        const treinador =
            await obterTreinadorLogado(req);


        if (!treinador) {

            return res.status(401).json({
                mensagem:
                    'Treinador não identificado.',
            });
        }


        const id =
            Number(req.params.id);


        if (!Number.isInteger(id)) {

            return res.status(400).json({
                mensagem:
                    'ID do atleta inválido.',
            });
        }


        // ====================================================
        // VERIFICAR SE O ATLETA PERTENCE AO TREINADOR
        // ====================================================

        const atletaExistente =
            await prisma.atleta.findFirst({

                where: {

                    id,

                    treinadorId:
                        treinador.id,
                },

                include: {
                    usuario: true,
                },
            });


        if (!atletaExistente) {

            return res.status(404).json({
                mensagem:
                    'Atleta não encontrado.',
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


        // ====================================================
        // NORMALIZAÇÃO
        // ====================================================

        const dadosAtleta = {};


        if (nome !== undefined) {

            dadosAtleta.nome =
                nome &&
                String(nome).trim()
                    ? String(nome).trim()
                    : null;
        }


        if (cpf !== undefined) {

            dadosAtleta.cpf =
                cpf &&
                String(cpf).trim()
                    ? String(cpf).trim()
                    : null;
        }


        if (rg !== undefined) {

            dadosAtleta.rg =
                rg &&
                String(rg).trim()
                    ? String(rg).trim()
                    : null;
        }


        if (categoria !== undefined) {

            dadosAtleta.categoria =
                categoria &&
                String(categoria).trim()
                    ? String(categoria).trim()
                    : null;
        }


        if (telefone !== undefined) {

            dadosAtleta.telefone =
                telefone &&
                String(telefone).trim()
                    ? String(telefone).trim()
                    : null;
        }


        if (sexo !== undefined) {

            dadosAtleta.sexo =
                normalizarSexo(sexo);
        }


        if (dataNascimento !== undefined) {

            if (!dataNascimento) {

                dadosAtleta.dataNascimento =
                    null;

            } else {

                const data =
                    new Date(
                        dataNascimento
                    );


                if (
                    isNaN(
                        data.getTime()
                    )
                ) {

                    return res.status(400).json({
                        mensagem:
                            'Data de nascimento inválida.',
                    });
                }


                dadosAtleta.dataNascimento =
                    data;
            }
        }


        // ====================================================
        // NORMALIZAR E-MAIL
        // ====================================================

        let emailNormalizado =
            null;


        if (email !== undefined) {

            emailNormalizado =
                email &&
                String(email).trim()
                    ? String(email)
                        .trim()
                        .toLowerCase()
                    : null;


            if (!emailNormalizado) {

                return res.status(400).json({
                    mensagem:
                        'O e-mail do atleta é obrigatório.',
                });
            }
        }


        // ====================================================
        // NORMALIZAR FOTO
        // ====================================================

        let avatarUrlNormalizado;


        if (avatarUrl !== undefined) {

            avatarUrlNormalizado =
                avatarUrl &&
                String(avatarUrl).trim()
                    ? String(avatarUrl).trim()
                    : null;
        }


        // ====================================================
        // VERIFICAR CPF DUPLICADO
        // ====================================================

        if (
            cpf !== undefined &&
            cpf &&
            String(cpf).trim()
        ) {

            const cpfExistente =
                await prisma.atleta.findFirst({

                    where: {

                        cpf:
                            String(cpf).trim(),

                        id: {
                            not: id,
                        },
                    },
                });


            if (cpfExistente) {

                return res.status(409).json({
                    mensagem:
                        'Este CPF já está cadastrado.',
                });
            }
        }


        // ====================================================
        // VERIFICAR E-MAIL DUPLICADO
        // ====================================================

        if (emailNormalizado) {

            const usuarioComEmail =
                await prisma.usuario.findFirst({

                    where: {

                        email:
                            emailNormalizado,

                        id: {
                            not:
                                atletaExistente.usuarioId,
                        },
                    },
                });


            if (usuarioComEmail) {

                return res.status(409).json({
                    mensagem:
                        'Este e-mail já está cadastrado.',
                });
            }
        }


        // ====================================================
        // ATUALIZAR ATLETA + USUÁRIO
        // ====================================================

        const resultado =
            await prisma.$transaction(
                async (tx) => {

                    // ----------------------------------------
                    // ATUALIZAR ATLETA
                    // ----------------------------------------

                    const atleta =
                        await tx.atleta.update({

                            where: {
                                id,
                            },

                            data:
                                dadosAtleta,

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

                                equipe: {
                                    select: {
                                        id: true,
                                        nome: true,
                                        modalidade: true,
                                        categoria: true,
                                    },
                                },

                                documentos: true,
                            },
                        });


                    // ----------------------------------------
                    // ATUALIZAR USUÁRIO / E-MAIL / FOTO
                    // ----------------------------------------

                    if (
                        emailNormalizado ||
                        avatarUrl !== undefined
                    ) {

                        const dadosUsuario = {};


                        if (emailNormalizado) {

                            dadosUsuario.email =
                                emailNormalizado;
                        }


                        if (avatarUrl !== undefined) {

                            dadosUsuario.avatarUrl =
                                avatarUrlNormalizado;
                        }


                        await tx.usuario.update({

                            where: {
                                id:
                                    atletaExistente
                                        .usuarioId,
                            },

                            data:
                                dadosUsuario,
                        });
                    }


                    // ----------------------------------------
                    // BUSCAR RESULTADO FINAL
                    // ----------------------------------------

                    const atletaFinal =
                        await tx.atleta.findUnique({

                            where: {
                                id,
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

                                equipe: {
                                    select: {
                                        id: true,
                                        nome: true,
                                        modalidade: true,
                                        categoria: true,
                                    },
                                },

                                documentos: true,
                            },
                        });


                    return atletaFinal;
                }
            );


        return res.status(200).json({

            mensagem:
                'Atleta atualizado com sucesso.',

            atleta:
                resultado,
        });

    } catch (error) {

        console.error(
            'Erro ao atualizar atleta:',
            error
        );

        return res.status(500).json({
            mensagem:
                'Erro ao atualizar atleta.',
            erro:
                error.message,
        });
    }
}


// ============================================================
// EXCLUIR ATLETA
// ============================================================

async function excluirAtleta(req, res) {

    try {

        const treinador =
            await obterTreinadorLogado(req);


        if (!treinador) {

            return res.status(401).json({
                mensagem:
                    'Treinador não identificado.',
            });
        }


        const id =
            Number(req.params.id);


        if (!Number.isInteger(id)) {

            return res.status(400).json({
                mensagem:
                    'ID do atleta inválido.',
            });
        }


        // ====================================================
        // VERIFICAR SE PERTENCE AO TREINADOR
        // ====================================================

        const atleta =
            await prisma.atleta.findFirst({

                where: {

                    id,

                    treinadorId:
                        treinador.id,
                },
            });


        if (!atleta) {

            return res.status(404).json({
                mensagem:
                    'Atleta não encontrado.',
            });
        }


        // ====================================================
        // EXCLUIR
        // ====================================================

        await prisma.atleta.delete({

            where: {
                id,
            },
        });


        return res.status(200).json({

            mensagem:
                'Atleta excluído com sucesso.',
        });

    } catch (error) {

        console.error(
            'Erro ao excluir atleta:',
            error
        );

        return res.status(500).json({
            mensagem:
                'Erro ao excluir atleta.',
            erro:
                error.message,
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
    excluirAtleta,
};