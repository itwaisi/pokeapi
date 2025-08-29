import { Router } from 'express';
import { gymService } from '../container';


/**
 * @openapi
 * /api/gyms:
 *   get:
 *     tags:
 *       - Gyms
 *     summary: Get all gyms
 *     responses:
 *       200:
 *         description: List of gyms
 * 
 * /api/gyms/{id}:
 *   get:
 *     tags:
 *       - Gyms
 *     summary: Get gym by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Get single gym
*/

const router = Router();

router.get('/', async (_req, res, next) => {
    try {
        res.json(await gymService.list());
    } catch (e) {
        next(e);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        res.json(await gymService.getWithDerived(req.params.id));
    } catch (e) {
        next(e);
    }
});

export default router;