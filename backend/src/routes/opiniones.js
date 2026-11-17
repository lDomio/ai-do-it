import { Router } from 'express';
import { OpinionController } from '../controllers/OpinionController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
let controller = new OpinionController();

export function setOpinionController(newController) {
  controller = newController;
}

/**
 * @swagger
 * /opiniones:
 *   get:
 *     tags: [Opiniones]
 *     summary: Listar todas las opiniones
 *     responses:
 *       200:
 *         description: Lista de opiniones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Opinion'
 */
router.get('/', (req, res, next) => controller.findAll(req, res, next));

/**
 * @swagger
 * /opiniones/{id}:
 *   get:
 *     tags: [Opiniones]
 *     summary: Obtener una opinión por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Opinión encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Opinion'
 *       404:
 *         description: Opinión no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', (req, res, next) => controller.findById(req, res, next));

/**
 * @swagger
 * /opiniones:
 *   post:
 *     tags: [Opiniones]
 *     summary: Crear una nueva opinión
 *     description: Deja una reseña para un gig. El cliente debe tener un pedido completado con ese gig.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['cliente', 'gig', 'pedido', 'puntuacion', 'detalle']
 *             properties:
 *               cliente:
 *                 type: string
 *                 description: ID del cliente
 *               gig:
 *                 type: string
 *                 description: ID del gig
 *               pedido:
 *                 type: string
 *                 description: ID del pedido entregado
 *               puntuacion:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               detalle:
 *                 type: string
 *                 maxLength: 1000
 *                 example: Excelente trabajo, muy profesional
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Opinión creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Opinion'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permiso para reseñar este pedido
 *       409:
 *         description: El pedido ya tiene una reseña
 */
router.post('/', authenticate, (req, res, next) => controller.create(req, res, next));

/**
 * @swagger
 * /opiniones/{id}:
 *   put:
 *     tags: [Opiniones]
 *     summary: Actualizar una opinión
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               puntuacion:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               detalle:
 *                 type: string
 *     responses:
 *       200:
 *         description: Opinión actualizada
 *       404:
 *         description: Opinión no encontrada
 */
router.put('/:id', (req, res, next) => controller.update(req, res, next));

/**
 * @swagger
 * /opiniones/{id}:
 *   delete:
 *     tags: [Opiniones]
 *     summary: Eliminar una opinión
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Opinión eliminada
 *       404:
 *         description: Opinión no encontrada
 */
router.delete('/:id', (req, res, next) => controller.delete(req, res, next));

export default router;
