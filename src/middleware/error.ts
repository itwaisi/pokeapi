import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';


export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {

    const status = err.status || 400;

    const message = err.message || 'Something went wrong';
    
    if (env.NODE_ENV !== 'test') {
        console.error('[ERROR] ::', _req.method, _req.path, status, message);
    }
    
    res.status(status).json({ error: message });
    
}
