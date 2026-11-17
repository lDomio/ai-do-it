import { Router } from 'express';
import { CategoriaController } from '../controllers/CategoriaController.js';

const router = Router();
const controller = new CategoriaController();

/**
 * @swagger
 * /categorias:
 *   get:
 *     tags: [Categorías]
 *     summary: Listar todas las categorías
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categoria'
 */
router.get('/', (req, res, next) => controller.findAll(req, res, next));

/**
 * @swagger
 * /categorias/{id}:
 *   get:
 *     tags: [Categorías]
 *     summary: Obtener una categoría por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       404:
 *         description: Categoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', (req, res, next) => controller.findById(req, res, next));

/**
 * @swagger
 * /categorias:
 *   post:
 *     tags: [Categorías]
 *     summary: Crear una nueva categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['nombre', 'descripcion']
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: DISENO
 *               descripcion:
 *                 type: string
 *                 example: Servicios de diseño gráfico
 *     responses:
 *       201:
 *         description: Categoría creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       400:
 *         description: Datos inválidos
 */
router.post('/', (req, res, next) => controller.create(req, res, next));

/**
 * @swagger
 * /categorias/{id}:
 *   put:
 *     tags: [Categorías]
 *     summary: Actualizar una categoría
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
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *       404:
 *         description: Categoría no encontrada
 */
router.put('/:id', (req, res, next) => controller.update(req, res, next));

/**
 * @swagger
 * /categorias/{id}:
 *   delete:
 *     tags: [Categorías]
 *     summary: Eliminar una categoría
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Categoría eliminada
 *       404:
 *         description: Categoría no encontrada
 */
router.delete('/:id', (req, res, next) => controller.delete(req, res, next));

export default router;
