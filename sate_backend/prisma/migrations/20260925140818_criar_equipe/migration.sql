-- AlterTable
ALTER TABLE `Atleta` ADD COLUMN `equipeId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Equipe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `modalidade` VARCHAR(191) NOT NULL,
    `categoria` VARCHAR(191) NULL,
    `proximaPartida` DATETIME(3) NULL,
    `imagem` VARCHAR(191) NULL,
    `corEquipe` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Atleta_equipeId_fkey` ON `Atleta`(`equipeId`);

-- AddForeignKey
ALTER TABLE `Atleta` ADD CONSTRAINT `Atleta_equipeId_fkey` FOREIGN KEY (`equipeId`) REFERENCES `Equipe`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
