
-- Create tables per prisma schema for MySQL

-- Trainer tables
CREATE TABLE IF NOT EXISTS `Trainer` (
  `id` VARCHAR(191) NOT NULL,
  `username` VARCHAR(191) NOT NULL,
  `passwordHash` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE INDEX `Trainer_username_key` (`username`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `TrainerPokemon` (
  `id` VARCHAR(191) NOT NULL,
  `trainerId` VARCHAR(191) NOT NULL,
  `speciesId` INTEGER NOT NULL,
  `speciesName` VARCHAR(191) NOT NULL,
  `nickname` VARCHAR(191) NULL,
  `level` INTEGER NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `TrainerPokemon_trainerId_idx` (`trainerId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Badge` (
  `id` VARCHAR(191) NOT NULL,
  `trainerId` VARCHAR(191) NOT NULL,
  `gymName` VARCHAR(191) NOT NULL,
  `acquiredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `Badge_trainerId_idx` (`trainerId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Gym tables aligned with provided SQL
CREATE TABLE IF NOT EXISTS `Gym` (
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

CREATE TABLE IF NOT EXISTS `GymTeamMember` (
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
  INDEX `GymTeamMember_gymId_idx` (`gymId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `GymTeamMemberMoves` (
  `id` VARCHAR(255) NOT NULL,
  `gymTeamMemberId` VARCHAR(255) NULL,
  `move` VARCHAR(255) NULL,
  INDEX `GymTeamMemberMoves_member_idx` (`gymTeamMemberId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Foreign keys with ON DELETE CASCADE
ALTER TABLE `TrainerPokemon` 
  ADD CONSTRAINT `TrainerPokemon_trainerId_fkey` 
  FOREIGN KEY (`trainerId`) REFERENCES `Trainer`(`id`) 
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Badge` 
  ADD CONSTRAINT `Badge_trainerId_fkey` 
  FOREIGN KEY (`trainerId`) REFERENCES `Trainer`(`id`) 
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `GymTeamMember` 
  ADD CONSTRAINT `GymTeamMember_gymId_fkey`
  FOREIGN KEY (`gymId`) REFERENCES `Gym`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `GymTeamMemberMoves`
  ADD CONSTRAINT `GymTeamMemberMoves_member_fkey`
  FOREIGN KEY (`gymTeamMemberId`) REFERENCES `GymTeamMember`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
