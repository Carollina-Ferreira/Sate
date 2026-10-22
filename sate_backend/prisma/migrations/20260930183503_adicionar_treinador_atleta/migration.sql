/*
  Warnings:

  - Added the required column `treinadorId` to the `Atleta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Atleta` ADD COLUMN `treinadorId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Atleta` ADD CONSTRAINT `Atleta_treinadorId_fkey` FOREIGN KEY (`treinadorId`) REFERENCES `Treinador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
