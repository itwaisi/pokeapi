interface GymServiceDeps {
  gymRepo: {
    list(): Promise<any[]>;
    getById(id: string): Promise<any | null>;
  };
  getTeamDerivedSummary: (team: any[]) => Promise<any>;
}

export function createGymService({ gymRepo, getTeamDerivedSummary }: GymServiceDeps) {

    return {
        list() {
            return gymRepo.list();
        },

        async getWithDerived(id: string) {

            const gym = await gymRepo.getById(id);

            if (!gym) throw new Error('Gym not found');

            const derived = await getTeamDerivedSummary(gym.leader.team);

            return { gym, derived };

        },
    };

}
