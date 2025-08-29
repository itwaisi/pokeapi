import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';


export function validate(schema: AnyZodObject) {
    
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query
        });
        
        if (!result.success) {
            const details = result.error.errors.map((e) => ({
                path: e.path.join('.'),
                message: e.message
            }));
            
            return res.status(422).json({ error: 'Validation failed', details });
        } next();
    };

}
