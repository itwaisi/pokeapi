import axios from 'axios';
import NodeCache from 'node-cache';


interface PokeApiServiceDeps {
    cache: NodeCache;
    timeoutMs?: number;
}

export interface SpeciesSummary {

    id: number;
    name: string;
    types: string[];
    baseStatsTotal: number;
    stats: Record<string, number>;
    sprites: {
        front_default?: string | null;
    };
    weightClass: 'light' | 'medium' | 'heavy';
    speedTier: 'slow' | 'average' | 'fast';

}

export function createPokeApiService({ cache, timeoutMs = 12000 }: PokeApiServiceDeps) {

    async function fetchPokemonRaw(nameOrId: string | number) {

        console.log('[fetchPokemonRaw]', nameOrId);
        
        const cacheKey = `poke:${nameOrId}`;

        const cached = cache.get(cacheKey);

        if (cached) return cached;

        const url = `https://pokeapi.co/api/v2/pokemon/${nameOrId}`;

        const { data } = await axios.get(url, { timeout: timeoutMs });

        cache.set(cacheKey, data);

        return data;

    }

    async function getSpeciesSummary(nameOrId: string | number): Promise<SpeciesSummary> {

        console.log('[fetchPokemonRaw]', nameOrId);

        const raw = await fetchPokemonRaw(nameOrId);

        const statsMap: Record<string, number> = {};

        let baseStatsTotal = 0;

        for (const s of raw.stats) {
            statsMap[s.stat.name] = s.base_stat;
            baseStatsTotal += s.base_stat;
        }

        const speed = statsMap['speed'] || 0;

        const weight = raw.weight || 0;

        const weightClass = weight < 200 ? 'light' : weight < 800 ? 'medium' : 'heavy';

        const speedTier = speed < 50 ? 'slow' : speed < 100 ? 'average' : 'fast';

        return {
            id: raw.id,
            name: raw.name,
            types: raw.types.map((t: any) => t.type.name),
            baseStatsTotal,
            stats: statsMap,
            sprites: {
                front_default: raw.sprites?.front_default,
            },
            weightClass,
            speedTier,
        };
    }

    async function getTeamDerivedSummary(team: { speciesId: number; speciesName: string; level: number }[]) {

        const members = await Promise.all(
            team.map(async (m) => {
                const s = await getSpeciesSummary(m.speciesId);
                const levelMultiplier = 1 + (m.level - 50) * 0.01;
                const powerIndex = Math.round(s.baseStatsTotal * levelMultiplier);
                return { ...m, species: s, powerIndex };
            })
        );

        const totalPower = members.reduce((acc, m) => acc + m.powerIndex, 0);

        const typeCoverage = [...new Set(members.flatMap((m) => m.species.types))];

        return { members, totalPower, typeCoverage };
        
    }

    return {
        getSpeciesSummary,
        getTeamDerivedSummary,
    };

}
