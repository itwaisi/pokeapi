import { Request, Response, NextFunction } from 'express';


export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {

    const status = err.status || 400;

    const message = err.message || 'Something went wrong';
    
    if (process.env.NODE_ENV !== 'test') {
        console.error('[ERROR]', status, message);
    }
    
    res.status(status).json({ error: message });
    
}
