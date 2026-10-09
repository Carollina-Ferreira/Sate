/*
  Warnings:

  - Added the required column `treinadorId` to the `Equipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Equipe` ADD COLUMN `treinadorId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Equipe_treinadorId_fkey` ON `Equipe`(`treinadorId`);

-- AddForeignKey
ALTER TABLE `Equipe` ADD CONSTRAINT `Equipe_treinadorId_fkey` FOREIGN KEY (`treinadorId`) REFERENCES `Treinador`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
