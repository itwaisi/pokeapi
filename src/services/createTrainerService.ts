import { TrainerPokemon, TeamSummary } from '../types';

interface TrainerServiceDeps {
    trainerRepo: any;
    getSpeciesSummary: (species: string | number) => Promise<any>;
    getTeamDerivedSummary: (team: TeamSummary[]) => Promise<any>;
}

export function createTrainerService({
    trainerRepo,
    getSpeciesSummary,
    getTeamDerivedSummary,
}: TrainerServiceDeps) {

    return {

        async addTeamMember(trainerId: string, species: string | number, level = 50, nickname?: string) {

            if (level < 1 || level > 100) throw new Error('Level must be between 1 and 100');

            const team: TrainerPokemon[] = await trainerRepo.listTeam(trainerId);

            if (team.length >= 6) throw new Error('Team is full (max 6)');

            const summary = await getSpeciesSummary(species);

            return trainerRepo.addPokemon(trainerId, summary.id, summary.name, level, nickname);

        },

        async listMyTeamWithDerived(trainerId: string) {

            const team: TrainerPokemon[] = await trainerRepo.listTeam(trainerId);

            const base: TeamSummary[] = team.map((t) => ({
                speciesId: t.speciesId,
                speciesName: t.speciesName,
                level: t.level,
            }));

            const derived: any = await getTeamDerivedSummary(base);

            if (derived && Array.isArray(derived.members)) {
                derived.members = derived.members.map((m: any, i: number) => ({
                    id: team[i]?.id,
                    ...m,
                }));
                return derived;
            }

            if (Array.isArray(derived)) {
                return derived.map((m: any, i: number) => ({
                    id: team[i]?.id,
                    ...m,
                }));
            }

            return team;

        },

        async removeFromTeam(trainerId: string, teamMemberId: string) {

            const ok = await trainerRepo.removeTeamMember(trainerId, teamMemberId);

            if (!ok) throw new Error('Not found');

            return true;

        },

        async grantBadge(trainerId: string, gymId: string) {
            return trainerRepo.giveBadgeByGymId(trainerId, gymId);
        },

        async myProfile(trainerId: string) {

            const trainer = await trainerRepo.getById(trainerId);

            if (!trainer) throw new Error('Trainer not found');

            const badges = await trainerRepo.listBadges(trainerId);

            const team = await trainerRepo.listTeam(trainerId);

            return {
                trainer: {
                    id: trainer.id,
                    username: trainer.username,
                    createdAt: trainer.createdAt,
                },
                badges,
                team,
            };

        },
    };

}
