import { env } from './config/env';
import { trainerRepo, gymRepo } from './repositories';
import NodeCache from 'node-cache';
import { createAuthService } from './services/createAuthService';
import { createTrainerService } from './services/createTrainerService';
import { createGymService } from './services/createGymService';
import { createPokeApiService } from './services/createPokeApiService';


const cache = new NodeCache({ stdTTL: env.API_CACHE_TTL_SECONDS || 3600 });

const pokeApiService = createPokeApiService({ cache });

const authService = createAuthService({
    trainerRepo,
    env,
});

const trainerService = createTrainerService({
    trainerRepo,
    getSpeciesSummary: pokeApiService.getSpeciesSummary,
    getTeamDerivedSummary: pokeApiService.getTeamDerivedSummary,
});

const gymService = createGymService({
    gymRepo,
    getTeamDerivedSummary: pokeApiService.getTeamDerivedSummary,
});

export {
    authService,
    trainerService,
    gymService,
    pokeApiService,
};
