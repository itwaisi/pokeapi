import { prisma } from './prismaClient';
import type { Gym as ApiGym } from '../types';


export const gymRepo = {

    async list(): Promise<ApiGym[]> {

        const gyms = await prisma.gym.findMany({
            include: { teamMembers: true },
            orderBy: [
                { name: 'asc' },
                { id: 'asc' }
            ],
        });

        return gyms.map(mapGymToApi);

    },

    async getById(id: string): Promise<ApiGym | null> {

        const g = await prisma.gym.findUnique({
            where: { id },
            include: { teamMembers: true },
        });

        return g ? mapGymToApi(g) : null;

    },

};

function mapGymToApi(g: any): ApiGym {

    const city = combineStr(g.city, g.location, '');

    const leaderName = combineStr(g.leaderName, g.leader, '');

    return {
        id: g.id,
        name: g.name ?? '',
        city,
        leader: {
            id: g.id,
            name: leaderName,
            team: (g.teamMembers ?? []).map((t: any) => ({
                speciesId: t.speciesId,
                speciesName: t.speciesName ?? '',
                level: t.level ?? 1,
            })),
        },
    };

}

function combineStr(v1?: string | null, v2?: string | null, fallback = ''): string {

  return (v1 && v1.length ? v1 : v2 && v2.length ? v2 : fallback);

}
