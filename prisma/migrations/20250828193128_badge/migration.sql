/*
  Warnings:

  - A unique constraint covering the columns `[trainerId,gymId]` on the table `Badge` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gymId` to the `Badge` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `GymTeamMemberMoves` DROP FOREIGN KEY `GymTeamMemberMoves_member_fkey`;

-- AlterTable
ALTER TABLE `Badge` ADD COLUMN `gymId` VARCHAR(191) NOT NULL,
    MODIFY `gymName` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Badge_gymId_idx` ON `Badge`(`gymId`);

-- CreateIndex
CREATE UNIQUE INDEX `Badge_trainerId_gymId_key` ON `Badge`(`trainerId`, `gymId`);

-- AddForeignKey
ALTER TABLE `Badge` ADD CONSTRAINT `Badge_gymId_fkey` FOREIGN KEY (`gymId`) REFERENCES `Gym`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GymTeamMemberMoves` ADD CONSTRAINT `GymTeamMemberMoves_gymTeamMemberId_fkey` FOREIGN KEY (`gymTeamMemberId`) REFERENCES `GymTeamMember`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `GymTeamMemberMoves` RENAME INDEX `GymTeamMemberMoves_member_idx` TO `GymTeamMemberMoves_gymTeamMemberId_idx`;
