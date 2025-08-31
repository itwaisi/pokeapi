import { prisma } from './prismaClient';
import { Trainer, TrainerPokemon, Badge } from '../types';


export const trainerRepo = {

    async create(username: string, passwordHash: string): Promise<Trainer> {

        const t = await prisma.trainer.create({
            data: { username, passwordHash },
        });

        return {
            id: t.id,
            username: t.username,
            passwordHash: t.passwordHash,
            createdAt: t.createdAt.toISOString(),
        };

    },

    async getByUsername(username: string): Promise<Trainer | undefined> {

        const t = await prisma.trainer.findUnique({ where: { username } });
        
        return t
        ? {
            id: t.id,
            username: t.username,
            passwordHash: t.passwordHash,
            createdAt: t.createdAt.toISOString(),
        }
        : undefined;

    },

    async getById(id: string): Promise<Trainer | null> {

        const t = await prisma.trainer.findUnique({ where: { id } });
        
        return t
        ? {
            id: t.id,
            username: t.username,
            passwordHash: t.passwordHash,
            createdAt: t.createdAt.toISOString(),
        }
        : null;

    },

    async addPokemon(
        trainerId: string,
        speciesId: number,
        speciesName: string,
        level: number,
        nickname?: string
    ): Promise<TrainerPokemon> {

        const p = await prisma.trainerPokemon.create({
            data: {
                trainerId,
                speciesId,
                speciesName,
                level,
                nickname
            },
        });

        return {
            id: p.id,
            trainerId: p.trainerId,
            speciesId: p.speciesId,
            speciesName: p.speciesName,
            nickname: p.nickname ?? undefined,
            level: p.level,
            createdAt: p.createdAt.toISOString(),
        };

    },

    async listTeam(trainerId: string): Promise<TrainerPokemon[]> {

        const list = await prisma.trainerPokemon.findMany({
            where: { trainerId },
            orderBy: [
                { createdAt: 'asc' },
                { id: 'asc' }
            ],
        });

        return list.map((p) => ({
            id: p.id,
            trainerId: p.trainerId,
            speciesId: p.speciesId,
            speciesName: p.speciesName,
            nickname: p.nickname ?? undefined,
            level: p.level,
            createdAt: p.createdAt.toISOString(),
        }));

    },

    async removeTeamMember(trainerId: string, teamMemberId: string): Promise<boolean> {

        const tm = await prisma.trainerPokemon.findUnique({
            where: { id: teamMemberId }
        });

        if (!tm || tm.trainerId !== trainerId) return false;

        await prisma.trainerPokemon.delete({
            where: { id: teamMemberId }
        });

        return true;

    },
    
    async giveBadgeByGymId(trainerId: string, gymId: string): Promise<Badge> {
        
        const gym = await prisma.gym.findUnique({
            where: { id: gymId },
            select: {
                id: true,
                name: true,
                badge: true,
                hasBadge: true
            },
        });

        if (!gym) throw new Error('Gym not found');

        const awardsBadge = (gym.hasBadge ?? false) || !!gym.badge;

        if (!awardsBadge) throw new Error('Selected gym does not award a badge');
        
        const gymName = gym.badge ?? gym.name ?? null;
        
        const b = await prisma.badge.upsert({
            where: {
                trainerId_gymId: {trainerId, gymId }
            },
            create: {
                trainerId,
                gymId,
                gymName: gymName ?? undefined
            },
            update: {},
            select: {
                id: true,
                trainerId: true,
                gymName: true,
                acquiredAt: true,
                gymId: true,
            },
        });

        return {
            id: b.id,
            trainerId: b.trainerId,
            gymId: b.gymId,
            gymName: b.gymName ?? null,
            acquiredAt: b.acquiredAt.toISOString(),
        };

    },
    
    async listBadges(trainerId: string): Promise<Badge[]> {

        const list = await prisma.badge.findMany({
            where: { trainerId },
            orderBy: { acquiredAt: 'desc' },
            select: {
                id: true,
                trainerId: true,
                gymName: true,
                acquiredAt: true,
                gymId: true,
            },
        });

        return list.map((b) => ({
            id: b.id,
            trainerId: b.trainerId,
            gymId: b.gymId,
            gymName: b.gymName ?? null,
            acquiredAt: b.acquiredAt.toISOString(),
        }));

    },

};
