import { Router } from 'express';
import { PaqueteController } from '../controllers/PaqueteController.js';

const router = Router();
const controller = new PaqueteController();

/**
 * @swagger
 * /paquetes:
 *   get:
 *     tags: [Paquetes]
 *     summary: Listar todos los paquetes
 *     description: Retorna la lista de todos los paquetes registrados en el sistema.
 *     responses:
 *       200:
 *         description: Lista de paquetes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Paquete'
 */
router.get('/', (req, res, next) => controller.findAll(req, res, next));

/**
 * @swagger
 * /paquetes/{id}:
 *   get:
 *     tags: [Paquetes]
 *     summary: Obtener un paquete por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del paquete
 *     responses:
 *       200:
 *         description: Paquete encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paquete'
 *       404:
 *         description: Paquete no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', (req, res, next) => controller.findById(req, res, next));

/**
 * @swagger
 * /paquetes:
 *   post:
 *     tags: [Paquetes]
 *     summary: Crear un nuevo paquete
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaqueteCreate'
 *     responses:
 *       201:
 *         description: Paquete creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paquete'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', (req, res, next) => controller.create(req, res, next));

/**
 * @swagger
 * /paquetes/{id}:
 *   put:
 *     tags: [Paquetes]
 *     summary: Actualizar un paquete
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
 *             $ref: '#/components/schemas/PaqueteCreate'
 *     responses:
 *       200:
 *         description: Paquete actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paquete'
 *       404:
 *         description: Paquete no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', (req, res, next) => controller.update(req, res, next));

/**
 * @swagger
 * /paquetes/{id}:
 *   delete:
 *     tags: [Paquetes]
 *     summary: Eliminar un paquete
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Paquete eliminado
 *       404:
 *         description: Paquete no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', (req, res, next) => controller.delete(req, res, next));

export default router;
