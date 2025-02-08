/*
  Warnings:

  - The primary key for the `otp` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `otp` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `otp` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `otp` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `otp` DROP PRIMARY KEY,
    DROP COLUMN `createdAt`,
    DROP COLUMN `name`,
    DROP COLUMN `password`,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);
