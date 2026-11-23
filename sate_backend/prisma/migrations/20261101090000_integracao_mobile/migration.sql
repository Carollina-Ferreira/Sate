-- Integração do aplicativo mobile (Flutter) com o backend.
-- MIGRATION SOMENTE ADITIVA: não remove, não renomeia e não altera dados existentes.
-- Cria colunas NULAS (ou com padrão) e tabelas novas.

-- AlterTable
ALTER TABLE `Atleta`
    ADD COLUMN `posicao` VARCHAR(191) NULL,
    ADD COLUMN `alturaCm` INTEGER NULL,
    ADD COLUMN `pesoKg` DOUBLE NULL;

-- AlterTable
ALTER TABLE `Equipe`
    ADD COLUMN `codigoConvite` VARCHAR(191) NULL,
    ADD COLUMN `local` VARCHAR(191) NULL,
    ADD COLUMN `diasTreino` VARCHAR(191) NULL,
    ADD COLUMN `inicioMin` INTEGER NULL,
    ADD COLUMN `duracaoMin` INTEGER NULL;

-- AlterTable (documentos já existentes continuam "aprovados")
ALTER TABLE `Documento`
    ADD COLUMN `categoria` VARCHAR(191) NULL,
    ADD COLUMN `validade` DATETIME(3) NULL,
    ADD COLUMN `aprovado` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `obs` TEXT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Equipe_codigoConvite_key` ON `Equipe`(`codigoConvite`);

-- CreateTable
CREATE TABLE `Exercicio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `treinadorId` INTEGER NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `grupo` VARCHAR(191) NOT NULL DEFAULT 'Geral',
    `series` INTEGER NOT NULL DEFAULT 3,
    `repeticoes` INTEGER NOT NULL DEFAULT 10,
    `duracaoSeg` INTEGER NOT NULL DEFAULT 0,
    `instrucoes` TEXT NULL,
    `video` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Exercicio_treinadorId_idx`(`treinadorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Treino` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `equipeId` INTEGER NOT NULL,
    `treinadorId` INTEGER NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `objetivo` VARCHAR(191) NULL,
    `foco` VARCHAR(191) NULL,
    `observacoes` TEXT NULL,
    `data` DATE NOT NULL,
    `inicioMin` INTEGER NOT NULL DEFAULT 1080,
    `duracaoMin` INTEGER NOT NULL DEFAULT 60,
    `exercicios` TEXT NULL,
    `padraoChave` VARCHAR(191) NULL,
    `cancelado` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Treino_equipeId_data_idx`(`equipeId`, `data`),
    INDEX `Treino_treinadorId_idx`(`treinadorId`),
    UNIQUE INDEX `Treino_equipeId_padraoChave_key`(`equipeId`, `padraoChave`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TreinoAtleta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `treinoId` INTEGER NOT NULL,
    `atletaId` INTEGER NOT NULL,

    INDEX `TreinoAtleta_atletaId_idx`(`atletaId`),
    UNIQUE INDEX `TreinoAtleta_treinoId_atletaId_key`(`treinoId`, `atletaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Presenca` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `atletaId` INTEGER NOT NULL,
    `data` DATE NOT NULL,
    `presente` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Presenca_data_idx`(`data`),
    UNIQUE INDEX `Presenca_atletaId_data_key`(`atletaId`, `data`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TesteFisico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `atletaId` INTEGER NOT NULL,
    `teste` VARCHAR(191) NOT NULL,
    `unidade` VARCHAR(191) NOT NULL,
    `valor` DOUBLE NOT NULL,
    `data` DATETIME(3) NOT NULL,
    `obs` TEXT NULL,
    `registradoPor` VARCHAR(191) NOT NULL DEFAULT 'TREINADOR',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `TesteFisico_atletaId_teste_data_idx`(`atletaId`, `teste`, `data`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventoAgenda` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `treinadorId` INTEGER NOT NULL,
    `equipeId` INTEGER NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL DEFAULT 'LEMBRETE',
    `local` VARCHAR(191) NULL,
    `observacoes` TEXT NULL,
    `data` DATE NOT NULL,
    `inicioMin` INTEGER NOT NULL DEFAULT 480,
    `fimMin` INTEGER NOT NULL DEFAULT 540,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `EventoAgenda_treinadorId_data_idx`(`treinadorId`, `data`),
    INDEX `EventoAgenda_equipeId_idx`(`equipeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MetaAtleta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `atletaId` INTEGER NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `descricao` TEXT NULL,
    `progresso` INTEGER NOT NULL DEFAULT 0,
    `prazo` DATE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `MetaAtleta_atletaId_idx`(`atletaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeedbackAtleta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `atletaId` INTEGER NOT NULL,
    `texto` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `FeedbackAtleta_atletaId_createdAt_idx`(`atletaId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotificacaoAtleta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `atletaId` INTEGER NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `descricao` TEXT NOT NULL,
    `link` VARCHAR(191) NULL,
    `chave` VARCHAR(191) NOT NULL,
    `lida` BOOLEAN NOT NULL DEFAULT false,
    `entidadeTipo` VARCHAR(191) NULL,
    `entidadeId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `NotificacaoAtleta_atletaId_lida_createdAt_idx`(`atletaId`, `lida`, `createdAt`),
    UNIQUE INDEX `NotificacaoAtleta_atletaId_chave_key`(`atletaId`, `chave`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Exercicio` ADD CONSTRAINT `Exercicio_treinadorId_fkey` FOREIGN KEY (`treinadorId`) REFERENCES `Treinador`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Treino` ADD CONSTRAINT `Treino_equipeId_fkey` FOREIGN KEY (`equipeId`) REFERENCES `Equipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Treino` ADD CONSTRAINT `Treino_treinadorId_fkey` FOREIGN KEY (`treinadorId`) REFERENCES `Treinador`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `TreinoAtleta` ADD CONSTRAINT `TreinoAtleta_treinoId_fkey` FOREIGN KEY (`treinoId`) REFERENCES `Treino`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `TreinoAtleta` ADD CONSTRAINT `TreinoAtleta_atletaId_fkey` FOREIGN KEY (`atletaId`) REFERENCES `Atleta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Presenca` ADD CONSTRAINT `Presenca_atletaId_fkey` FOREIGN KEY (`atletaId`) REFERENCES `Atleta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `TesteFisico` ADD CONSTRAINT `TesteFisico_atletaId_fkey` FOREIGN KEY (`atletaId`) REFERENCES `Atleta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `EventoAgenda` ADD CONSTRAINT `EventoAgenda_treinadorId_fkey` FOREIGN KEY (`treinadorId`) REFERENCES `Treinador`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `EventoAgenda` ADD CONSTRAINT `EventoAgenda_equipeId_fkey` FOREIGN KEY (`equipeId`) REFERENCES `Equipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MetaAtleta` ADD CONSTRAINT `MetaAtleta_atletaId_fkey` FOREIGN KEY (`atletaId`) REFERENCES `Atleta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `FeedbackAtleta` ADD CONSTRAINT `FeedbackAtleta_atletaId_fkey` FOREIGN KEY (`atletaId`) REFERENCES `Atleta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `NotificacaoAtleta` ADD CONSTRAINT `NotificacaoAtleta_atletaId_fkey` FOREIGN KEY (`atletaId`) REFERENCES `Atleta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
