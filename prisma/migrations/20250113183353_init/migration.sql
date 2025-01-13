/*
  Warnings:

  - You are about to drop the column `lastName` on the `Payer` table. All the data in the column will be lost.
  - You are about to drop the column `fecha` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `mobile` to the `Payer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `Payer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorization` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `franchise` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `internalReference` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issuerName` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethodName` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receipt` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refunded` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Payer` DROP COLUMN `lastName`,
    ADD COLUMN `mobile` VARCHAR(191) NOT NULL,
    ADD COLUMN `surname` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Transaction` DROP COLUMN `fecha`,
    ADD COLUMN `authorization` VARCHAR(191) NOT NULL,
    ADD COLUMN `currency` VARCHAR(191) NOT NULL,
    ADD COLUMN `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `franchise` VARCHAR(191) NOT NULL,
    ADD COLUMN `internalReference` INTEGER NOT NULL,
    ADD COLUMN `issuerName` VARCHAR(191) NOT NULL,
    ADD COLUMN `paymentMethod` VARCHAR(191) NOT NULL,
    ADD COLUMN `paymentMethodName` VARCHAR(191) NOT NULL,
    ADD COLUMN `receipt` VARCHAR(191) NOT NULL,
    ADD COLUMN `refunded` BOOLEAN NOT NULL;
