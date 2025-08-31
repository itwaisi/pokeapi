export interface Trainer {
    id: string;
    username: string;
    passwordHash: string;
    createdAt: string;
}

export interface TrainerPokemon {
    id: string;
    trainerId: string;
    speciesId: number;
    speciesName: string;
    nickname?: string;
    level: number;
    createdAt: string;
}

export type TeamSummary = Pick<TrainerPokemon, 'speciesId' | 'speciesName' | 'level'>;

export interface Badge {
    id: string;
    trainerId: string;
    gymId: string;
    gymName: string | null;
    acquiredAt: string;
}

export interface GymNPC {
    id: string;
    name: string;
    team: {
        speciesId: number;
        speciesName: string;
        level: number
    }[];
}

export interface Gym {
    id: string;
    name: string;
    city: string;
    leader: GymNPC;
}
