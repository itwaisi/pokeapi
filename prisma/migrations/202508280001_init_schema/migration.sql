-- CreateTable
CREATE TABLE `Trainer` (
    `id` VARCHAR(255) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Trainer_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrainerPokemon` (
    `id` VARCHAR(255) NOT NULL,
    `trainerId` VARCHAR(255) NOT NULL,
    `speciesId` INTEGER NOT NULL,
    `speciesName` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NULL,
    `level` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TrainerPokemon_trainerId_idx`(`trainerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Badge` (
    `id` VARCHAR(255) NOT NULL,
    `trainerId` VARCHAR(255) NOT NULL,
    `gymId` VARCHAR(255) NOT NULL,
    `gymName` VARCHAR(255) NULL,
    `acquiredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Badge_gymId_idx`(`gymId`),
    INDEX `Badge_trainerId_idx`(`trainerId`),
    UNIQUE INDEX `Badge_trainerId_gymId_key`(`trainerId`, `gymId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Gym` (
    `id` VARCHAR(255) NOT NULL,
    `pokeapiLocation` VARCHAR(255) NULL,
    `leader` VARCHAR(255) NULL,
    `location` VARCHAR(255) NULL,
    `name` VARCHAR(255) NULL,
    `region` VARCHAR(255) NULL,
    `badge` VARCHAR(255) NULL,
    `hasBadge` BOOLEAN NULL,
    `locationValid` BOOLEAN NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GymTeamMember` (
    `id` VARCHAR(255) NOT NULL,
    `gymId` VARCHAR(255) NULL,
    `generation` INTEGER NULL,
    `gameVersion` VARCHAR(255) NULL,
    `speciesName` VARCHAR(255) NULL,
    `level` INTEGER NULL,
    `speciesId` INTEGER NULL,
    `pokeapiVersion` VARCHAR(255) NULL,
    `pokeapiSpeciesName` VARCHAR(255) NULL,
    `speciesSingleValid` BOOLEAN NULL,

    INDEX `GymTeamMember_gymId_idx`(`gymId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GymTeamMemberMoves` (
    `id` VARCHAR(255) NOT NULL,
    `gymTeamMemberId` VARCHAR(255) NULL,
    `move` VARCHAR(255) NULL,

    INDEX `GymTeamMemberMoves_gymTeamMemberId_idx`(`gymTeamMemberId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TrainerPokemon` ADD CONSTRAINT `TrainerPokemon_trainerId_fkey` FOREIGN KEY (`trainerId`) REFERENCES `Trainer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Badge` ADD CONSTRAINT `Badge_trainerId_fkey` FOREIGN KEY (`trainerId`) REFERENCES `Trainer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Badge` ADD CONSTRAINT `Badge_gymId_fkey` FOREIGN KEY (`gymId`) REFERENCES `Gym`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GymTeamMember` ADD CONSTRAINT `GymTeamMember_gymId_fkey` FOREIGN KEY (`gymId`) REFERENCES `Gym`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GymTeamMemberMoves` ADD CONSTRAINT `GymTeamMemberMoves_gymTeamMemberId_fkey` FOREIGN KEY (`gymTeamMemberId`) REFERENCES `GymTeamMember`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
