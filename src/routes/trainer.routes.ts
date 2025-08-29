import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { trainerService } from '../container';


/**
 * @openapi
 * /api/trainers/me:
 *   get:
 *     tags:
 *       - Trainers
 *     summary: Get current trainer profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Current trainer profile with badges and team
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trainer:
 *                   type: object
 *                   properties:
 *                     id: { type: string }
 *                     username: { type: string }
 *                     createdAt: { type: string, format: date-time }
 *                 badges:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Badge'
 *                 team:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TeamMember'
 *
 * /api/trainers/team:
 *   post:
 *     tags:
 *       - Trainers
 *     summary: Add a Pokémon to your team
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               species:
 *                 oneOf:
 *                   - { type: string, example: "pikachu" }
 *                   - { type: integer, example: 25 }
 *               level:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 100
 *                 default: 50
 *               nickname:
 *                 type: string
 *             required: [species]
 *     responses:
 *       '201':
 *         description: Team member created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamMember'
 *       '400':
 *         description: Invalid request (e.g., team full or bad level)
 *   get:
 *     tags:
 *       - Trainers
 *     summary: List your team
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Your team members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeamMember'
 *
 * /api/trainers/team/{id}:
 *   delete:
 *     tags: [Trainers]
 *     summary: Remove a Pokémon from your team by team member UUID
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '204': { description: Removed successfully }
 *       '400': { description: Invalid team member id (must be UUID) }
 *       '404': { description: Team member not found }
 *
 * /api/trainers/badges:
 *   post:
 *     tags:
 *       - Trainers
 *     summary: Grant a gym badge to the current trainer by gymId
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [gymId]
 *             properties:
 *               gymId:
 *                 type: string
 *                 example: "00044e2f-9c37-a1fb-2aff-7f7e2c303e52"
 *     responses:
 *       '201': { description: Badge granted }
 *       '400': { description: Selected gym does not award a badge }
 *       '404': { description: Gym not found }
 *   get:
 *     tags:
 *       - Trainers
 *     summary: List my badges
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200': { description: List of badges }
 *
 * components:
 *   schemas:
 *     TeamMember:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         species: { type: string }
 *         level: { type: integer, minimum: 1, maximum: 100 }
 *         nickname: { type: string }
 *     Badge:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         gymName: { type: string }
 *         awardedAt: { type: string, format: date-time }
 */

const router = Router();

router.use(requireAuth);

router.get('/me', async (req: AuthRequest, res, next) => {
    try {
        const data = await trainerService.myProfile(req.user!.sub);
        res.json(data);
    } catch (e) {
        next(e);
    }
});

const addTeamSchema = z.object({
    body: z.object({
        species: z.union([z.string(), z.number()]),
        level: z.number().int().min(1).max(100).optional(),
        nickname: z.string().max(20).optional(),
    }),
});

router.post('/team', validate(addTeamSchema), async (req: AuthRequest, res, next) => {
    try {
        const { species, level, nickname } = req.body as any;
        const added = await trainerService.addTeamMember(req.user!.sub, species, level, nickname);
        res.status(201).json(added);
    } catch (e) {
        next(e);
    }
});

router.get('/team', async (req: AuthRequest, res, next) => {
    try {
        const derived = await trainerService.listMyTeamWithDerived(req.user!.sub);
        res.json(derived);
    } catch (e) {
        next(e);
    }
});

router.delete('/team/:id', async (req: AuthRequest, res, next) => {
    try {
        const id = z.string().uuid().parse(req.params.id);
        await trainerService.removeFromTeam(req.user!.sub, id);
        res.status(204).send();
    } catch (e) {
        if (e instanceof z.ZodError) {
            res.status(400).json({ error: 'Invalid team member id (must be UUID)' });
            return;
        }
        next(e);
    }
});

const grantBadgeSchema = z.object({
    body: z.object({
        gymId: z.string().min(1),
    }),
});

router.post('/badges', validate(grantBadgeSchema), async (req: AuthRequest, res, next) => {
    try {
        const { gymId } = req.body as any;
        const badge = await trainerService.grantBadge(req.user!.sub, gymId);
        res.status(201).json(badge);
    } catch (e) {
        next(e);
    }
});

router.get('/badges', async (req: AuthRequest, res, next) => {
    try {
        const badges = await (await import('../repositories')).trainerRepo.listBadges(req.user!.sub);
        res.json({ badges });
    } catch (e) {
        next(e);
    }
});

export default router;
