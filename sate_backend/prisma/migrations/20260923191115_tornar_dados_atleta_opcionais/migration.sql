-- DropForeignKey
ALTER TABLE `Atleta` DROP FOREIGN KEY `Atleta_enderecoId_fkey`;

-- DropForeignKey
ALTER TABLE `Atleta` DROP FOREIGN KEY `Atleta_responsavelId_fkey`;

-- AlterTable
ALTER TABLE `Atleta` MODIFY `nome` VARCHAR(191) NULL,
    MODIFY `cpf` VARCHAR(191) NULL,
    MODIFY `dataNascimento` DATETIME(3) NULL,
    MODIFY `sexo` ENUM('MASCULINO', 'FEMININO', 'OUTRO', 'NAO_INFORMADO') NULL,
    MODIFY `categoria` VARCHAR(191) NULL,
    MODIFY `responsavelId` INTEGER NULL,
    MODIFY `enderecoId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Atleta` ADD CONSTRAINT `Atleta_responsavelId_fkey` FOREIGN KEY (`responsavelId`) REFERENCES `Responsavel`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Atleta` ADD CONSTRAINT `Atleta_enderecoId_fkey` FOREIGN KEY (`enderecoId`) REFERENCES `Endereco`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
