import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


interface AuthServiceDeps {

    trainerRepo: {
        getByUsername(username: string): Promise<any>;
        create(username: string, hash: string): Promise<any>;
    };

    env: {
        API_JWT_SECRET: string;
    };

}

export function createAuthService({ trainerRepo, env }: AuthServiceDeps) {

    return {
        async register(username: string, password: string) {

            const existing = await trainerRepo.getByUsername(username);

            if (existing) throw new Error('Username already taken');

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            const trainer = await trainerRepo.create(username, hash);

            const token = jwt.sign(
                {
                    sub: trainer.id,
                    username: trainer.username,
                },
                env.API_JWT_SECRET,
                { expiresIn: '2h' }
            );

            return { trainer, token };

        },

        async login(username: string, password: string) {

            const trainer = await trainerRepo.getByUsername(username);

            if (!trainer) throw new Error('Invalid credentials');

            const ok = bcrypt.compareSync(password, trainer.passwordHash);

            if (!ok) throw new Error('Invalid credentials');

            const token = jwt.sign(
                {
                    sub: trainer.id,
                    username: trainer.username,
                },
                env.API_JWT_SECRET,
                { expiresIn: '2h' }
            );

            return { trainer, token };

        },

        verify(token: string) {

            const payload = jwt.verify(token, env.API_JWT_SECRET) as {
                sub: string;
                username: string;
            };
            
            return payload;

        },
    };
}
