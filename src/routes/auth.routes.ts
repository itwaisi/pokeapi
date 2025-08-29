import { Router } from 'express';
import { z } from 'zod';
import { authService } from '../container';
import { validate } from '../middleware/validate';


/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new trainer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Trainer registered
 * 
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login a trainer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
*/

const router = Router();

const credsSchema = z.object({
    body: z.object({
        username: z.string().min(3).max(20),
        password: z.string().min(6).max(64)
    })
});

router.post('/register', validate(credsSchema), async (req, res, next) => {

    const { username, password } = req.body as any;

    try {
        const result = await authService.register(username, password);
        res.status(201).json({
            trainer: {
                id: result.trainer.id,
                username: result.trainer.username
            },
            token: result.token
        });
    } catch (e) {
        next(e);
    }

});

router.post('/login', validate(credsSchema), async (req, res, next) => {

    const { username, password } = req.body as any;
    try {
        const result = await authService.login(username, password);
        res.json({
            trainer: {
                id: result.trainer.id,
                username: result.trainer.username
            },
            token: result.token
        });
    } catch (e) {
        next(e);
    }
    
});

export default router;
