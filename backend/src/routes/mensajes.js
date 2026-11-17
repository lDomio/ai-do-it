import { Router } from 'express';
import { MensajeController } from '../controllers/MensajeController.js';

const router = Router();
const controller = new MensajeController();

/**
 * @swagger
 * /mensajes:
 *   get:
 *     tags: [Mensajes]
 *     summary: Listar todos los mensajes
 *     responses:
 *       200:
 *         description: Lista de mensajes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mensaje'
 */
router.get('/', (req, res, next) => controller.findAll(req, res, next));

/**
 * @swagger
 * /mensajes/{id}:
 *   get:
 *     tags: [Mensajes]
 *     summary: Obtener un mensaje por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mensaje encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mensaje'
 *       404:
 *         description: Mensaje no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', (req, res, next) => controller.findById(req, res, next));

/**
 * @swagger
 * /mensajes:
 *   post:
 *     tags: [Mensajes]
 *     summary: Enviar un nuevo mensaje
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['usuario', 'mensaje']
 *             properties:
 *               usuario:
 *                 type: string
 *                 description: ID del usuario que envía
 *               mensaje:
 *                 type: string
 *                 example: Hola, ¿cuándo estará listo el diseño?
 *     responses:
 *       201:
 *         description: Mensaje enviado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mensaje'
 *       400:
 *         description: Datos inválidos
 */
router.post('/', (req, res, next) => controller.create(req, res, next));

/**
 * @swagger
 * /mensajes/{id}:
 *   put:
 *     tags: [Mensajes]
 *     summary: Actualizar un mensaje
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
 *               mensaje:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mensaje actualizado
 *       404:
 *         description: Mensaje no encontrado
 */
router.put('/:id', (req, res, next) => controller.update(req, res, next));

/**
 * @swagger
 * /mensajes/{id}:
 *   delete:
 *     tags: [Mensajes]
 *     summary: Eliminar un mensaje
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Mensaje eliminado
 *       404:
 *         description: Mensaje no encontrado
 */
router.delete('/:id', (req, res, next) => controller.delete(req, res, next));

export default router;
