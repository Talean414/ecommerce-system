/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `newslettersubscriber` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `newslettersubscriber_email_key` ON `newslettersubscriber`(`email`);
