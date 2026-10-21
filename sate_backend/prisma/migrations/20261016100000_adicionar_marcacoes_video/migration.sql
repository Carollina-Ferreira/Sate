
CREATE TABLE `MarcacaoVideo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `videoId` INTEGER NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `categoria` VARCHAR(191) NOT NULL,
    `tempoInicio` DOUBLE NOT NULL,
    `tempoFim` DOUBLE NOT NULL,
    `observacao` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `MarcacaoVideo_videoId_idx`(`videoId`),
    INDEX `MarcacaoVideo_videoId_tempoInicio_idx`(`videoId`, `tempoInicio`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX `Treinador_usuarioId_idx` ON `Treinador`(`usuarioId`);

ALTER TABLE `MarcacaoVideo`
ADD CONSTRAINT `MarcacaoVideo_videoId_fkey`
FOREIGN KEY (`videoId`) REFERENCES `VideoPartida`(`id`)
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `PasswordResetToken`
RENAME INDEX `PasswordResetToken_usuarioId_fkey`
TO `PasswordResetToken_usuarioId_idx`;
