import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import trainerRoutes from './routes/trainer.routes';
import gymRoutes from './routes/gym.routes';
import pokemonRoutes from './routes/pokemon.routes';
import { errorHandler } from './middleware/error';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';
import { gymRepo } from './repositories';
import path from 'path';
import favicon from 'serve-favicon';


export function createApp() {

    const app = express();
    app.use(express.static(path.resolve(process.cwd(), 'public')));

    const faviconPath = path.resolve(process.cwd(), 'public', 'favicon.ico');

    try {
        app.use(favicon(faviconPath));
    } catch {}
    
    app.use(helmet());
    app.use(express.json());
    app.use(morgan('dev'));

    if (typeof (gymRepo as any).seed === 'function') {}

    app.get('/health', (_req, res) => res.json({ ok: true }));

    app.use('/api/auth', authRoutes);
    app.use('/api/trainers', trainerRoutes);
    app.use('/api/gyms', gymRoutes);
    app.use('/api/pokemon', pokemonRoutes);
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        customfavIcon: '/favicon.ico',
        swaggerOptions: { persistAuthorization: true }
    }));
    app.use(errorHandler);
    
    return app;

}
