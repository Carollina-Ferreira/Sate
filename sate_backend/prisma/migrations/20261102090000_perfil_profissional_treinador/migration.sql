-- Informações profissionais do treinador (Formação, Registro profissional, Experiência).
-- MIGRATION SOMENTE ADITIVA: 3 colunas nulas. Não altera nem remove dados.

-- AlterTable
ALTER TABLE `Treinador`
    ADD COLUMN `formacao` VARCHAR(191) NULL,
    ADD COLUMN `registroProfissional` VARCHAR(191) NULL,
    ADD COLUMN `experiencia` VARCHAR(191) NULL;
