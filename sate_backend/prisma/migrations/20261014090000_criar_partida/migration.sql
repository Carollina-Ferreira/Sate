CREATE TABLE `Partida` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `equipeId` INTEGER NOT NULL,
    `adversario` VARCHAR(191) NOT NULL,
    `data` DATETIME(3) NOT NULL,
    `local` VARCHAR(191) NULL,
    `campeonato` VARCHAR(191) NULL,
    `rodada` VARCHAR(191) NULL,
    `observacoes` VARCHAR(191) NULL,
    `status` ENUM('AGENDADA', 'EM_ANDAMENTO', 'FINALIZADA', 'CANCELADA') NOT NULL DEFAULT 'AGENDADA',
    `golsEquipe` INTEGER NULL,
    `golsAdversario` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Partida_equipeId_fkey` (`equipeId`),
    INDEX `Partida_data_idx` (`data`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `Partida`
ADD CONSTRAINT `Partida_equipeId_fkey`
FOREIGN KEY (`equipeId`) REFERENCES `Equipe`(`id`)
ON DELETE CASCADE ON UPDATE CASCADE;