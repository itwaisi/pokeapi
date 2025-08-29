import { trainerService } from '../src/services/trainerService';
import { trainerRepo } from '../src/repositories';
import { getSpeciesSummary, getTeamDerivedSummary } from '../src/services/pokeApiService';


jest.mock('../src/repositories', () => ({
    trainerRepo: {
        listTeam: jest.fn(),
        addPokemon: jest.fn(),
        removeTeamMember: jest.fn(),
        giveBadgeByGymId: jest.fn(),
        getById: jest.fn(),
        listBadges: jest.fn(),
    },
}));

jest.mock('../src/services/pokeApiService', () => ({
    getSpeciesSummary: jest.fn(),
    getTeamDerivedSummary: jest.fn(),
}));

describe('trainerService', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('addTeamMember', () => {
        it('should add a Pokémon to the trainer team', async () => {
            (trainerRepo.listTeam as jest.Mock).mockResolvedValue([]);
            (getSpeciesSummary as jest.Mock).mockResolvedValue({ id: 1, name: 'bulbasaur' });
            (trainerRepo.addPokemon as jest.Mock).mockResolvedValue({});

            await trainerService.addTeamMember('trainer123', 'bulbasaur', 10, 'Leafy');
            expect(trainerRepo.addPokemon).toHaveBeenCalledWith('trainer123', 1, 'bulbasaur', 10, 'Leafy');
        });

        it('should throw if level is out of bounds', async () => {
            await expect(trainerService.addTeamMember('trainer123', 'bulbasaur', 200)).rejects.toThrow('Level must be between 1 and 100');
        });

        it('should throw if team is already full', async () => {
            (trainerRepo.listTeam as jest.Mock).mockResolvedValue(new Array(6));
            await expect(trainerService.addTeamMember('trainer123', 'bulbasaur')).rejects.toThrow('Team is full (max 6)');
        });
    });

    describe('listMyTeamWithDerived', () => {
        it('should return derived team with IDs', async () => {
            const team = [
                { id: 'p1', speciesId: 1, speciesName: 'bulbasaur', level: 10 },
                { id: 'p2', speciesId: 2, speciesName: 'ivysaur', level: 20 },
            ];
            (trainerRepo.listTeam as jest.Mock).mockResolvedValue(team);
            (getTeamDerivedSummary as jest.Mock).mockResolvedValue({
                members: [
                { name: 'bulbasaur', power: 50 },
                { name: 'ivysaur', power: 70 },
                ],
            });

            const result = await trainerService.listMyTeamWithDerived('trainer123');
            expect(result.members[0]).toMatchObject({ id: 'p1', name: 'bulbasaur', power: 50 });
            expect(result.members[1]).toMatchObject({ id: 'p2', name: 'ivysaur', power: 70 });
        });
    });

    describe('removeFromTeam', () => {
        it('should remove a team member', async () => {
            (trainerRepo.removeTeamMember as jest.Mock).mockResolvedValue(true);
            const result = await trainerService.removeFromTeam('trainer123', 'team456');
            expect(result).toBe(true);
        });

        it('should throw if member not found', async () => {
            (trainerRepo.removeTeamMember as jest.Mock).mockResolvedValue(false);
            await expect(trainerService.removeFromTeam('trainer123', 'team999')).rejects.toThrow('Not found');
        });
    });

    describe('grantBadge', () => {
        it('should call giveBadgeByGymId', async () => {
            await trainerService.grantBadge('trainer123', 'gymABC');
            expect(trainerRepo.giveBadgeByGymId).toHaveBeenCalledWith('trainer123', 'gymABC');
        });
    });

    describe('myProfile', () => {
        it('should return trainer profile', async () => {
            (trainerRepo.getById as jest.Mock).mockResolvedValue({ id: 't1', username: 'ash', createdAt: 'now' });
            (trainerRepo.listBadges as jest.Mock).mockResolvedValue(['badge1']);
            (trainerRepo.listTeam as jest.Mock).mockResolvedValue(['poke1', 'poke2']);

            const profile = await trainerService.myProfile('t1');
            expect(profile.trainer.username).toBe('ash');
            expect(profile.badges).toContain('badge1');
            expect(profile.team.length).toBe(2);
        });

        it('should throw if trainer not found', async () => {
            (trainerRepo.getById as jest.Mock).mockResolvedValue(null);
            await expect(trainerService.myProfile('notfound')).rejects.toThrow('Trainer not found');
        });
    });

});
