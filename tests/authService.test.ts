import { authService } from '../src/services/authService';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { trainerRepo } from '../src/repositories';
import { env } from '../src/config/env';


jest.mock('../src/repositories', () => {
    return {
        trainerRepo: {
            getByUsername: jest.fn(),
            create: jest.fn(),
        }
    };
});

jest.mock('../src/config/env', () => ({
    env: {
        API_JWT_SECRET: 'test_secret',
    },
}));

describe('authService', () => {

    const sampleTrainer = {
        id: '123',
        username: 'ash',
        passwordHash: bcrypt.hashSync('pikachu123', 10),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {

        it('should register a new user and return token', async () => {
            (trainerRepo.getByUsername as jest.Mock).mockResolvedValue(null);
            (trainerRepo.create as jest.Mock).mockResolvedValue({ id: '123', username: 'ash' });

            const result = await authService.register('ash', 'pikachu123');

            expect(result).toHaveProperty('trainer');
            expect(result).toHaveProperty('token');
        });

        it('should throw error if username is already taken', async () => {
            (trainerRepo.getByUsername as jest.Mock).mockResolvedValue(sampleTrainer);

            await expect(authService.register('ash', 'pikachu123')).rejects.toThrow('Username already taken');
        });
    });

    describe('login', () => {
        it('should log in with correct credentials and return token', async () => {
            (trainerRepo.getByUsername as jest.Mock).mockResolvedValue(sampleTrainer);

            const result = await authService.login('ash', 'pikachu123');

            expect(result).toHaveProperty('trainer');
            expect(result).toHaveProperty('token');
        });

        it('should throw error if trainer not found', async () => {
            (trainerRepo.getByUsername as jest.Mock).mockResolvedValue(null);

            await expect(authService.login('unknown', 'password')).rejects.toThrow('Invalid credentials');
        });

        it('should throw error if password is incorrect', async () => {
            const badHash = bcrypt.hashSync('wrongpassword', 10);
            (trainerRepo.getByUsername as jest.Mock).mockResolvedValue({
                ...sampleTrainer,
                passwordHash: badHash,
            });

            await expect(authService.login('ash', 'pikachu123')).rejects.toThrow('Invalid credentials');
        });
    });

    describe('verify', () => {
        it('should verify a valid JWT', () => {
            const token = jwt.sign({ sub: '123', username: 'ash' }, env.API_JWT_SECRET);
            const payload = authService.verify(token);

            expect(payload).toMatchObject({ sub: '123', username: 'ash' });
        });
    });

});
