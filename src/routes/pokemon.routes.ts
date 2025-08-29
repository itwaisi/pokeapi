import { Router } from 'express';
import { pokeApiService } from '../container';


/**
 * @openapi
 * /api/pokemon/{name}/summary:
 *   get:
 *     tags:
 *       - Pokemon
 *     summary: Get a Pokémon by name
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pokémon data
*/

const router = Router();

router.get('/:nameOrId/summary', async (req, res, next) => {
    try {
        res.json(await pokeApiService.getSpeciesSummary(req.params.nameOrId));
    } catch (e) {
        next(e);
    }
});

export default router;
