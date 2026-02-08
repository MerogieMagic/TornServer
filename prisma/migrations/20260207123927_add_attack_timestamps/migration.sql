/*
  Warnings:

  - Added the required column `endedTimestamp` to the `FactionAttack` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startedTimestamp` to the `FactionAttack` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `factionattack` ADD COLUMN `endedTimestamp` INTEGER NOT NULL,
    ADD COLUMN `startedTimestamp` INTEGER NOT NULL;
