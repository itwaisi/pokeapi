import { Request, Response, NextFunction } from 'express';
import { authService } from '../container';


export interface AuthRequest extends Request {

    user?: {
        sub: string;
        username: string
    };

}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {

    const header = req.headers.authorization;
    
    if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });

    const token = header.substring('Bearer '.length);

    try {
        const payload = authService.verify(token);
        req.user = payload;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
}
