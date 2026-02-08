-- CreateTable
CREATE TABLE `FactionAttack` (
    `id` INTEGER NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `startedAt` DATETIME(3) NOT NULL,
    `endedAt` DATETIME(3) NOT NULL,
    `result` VARCHAR(191) NOT NULL,
    `stealthed` BOOLEAN NOT NULL DEFAULT false,
    `respectGain` DOUBLE NOT NULL DEFAULT 0,
    `respectLoss` DOUBLE NOT NULL DEFAULT 0,
    `chain` INTEGER NOT NULL DEFAULT 0,
    `raid` BOOLEAN NOT NULL DEFAULT false,
    `rankedWar` BOOLEAN NOT NULL DEFAULT false,
    `fairFight` DOUBLE NOT NULL DEFAULT 1.0,
    `attackerId` INTEGER NULL,
    `attackerName` VARCHAR(191) NULL,
    `attackerFactionId` INTEGER NULL,
    `defenderId` INTEGER NULL,
    `defenderName` VARCHAR(191) NULL,
    `defenderFactionId` INTEGER NULL,
    `modifiers` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `FactionAttack_code_key`(`code`),
    INDEX `FactionAttack_startedAt_idx`(`startedAt`),
    INDEX `FactionAttack_attackerId_idx`(`attackerId`),
    INDEX `FactionAttack_defenderId_idx`(`defenderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
