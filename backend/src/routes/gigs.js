import { Router } from 'express';
import { GigController } from '../controllers/GigController.js';

const router = Router();
let controller = new GigController();

export function setGigController(newController) {
  controller = newController;
}

/**
 * @swagger
 * /gigs:
 *   get:
 *     tags: [Gigs]
 *     summary: Listar gigs con búsqueda, filtros y paginación
 *     description: Retorna una lista paginada de gigs. Soporta búsqueda por texto, filtrado por categoría y ordenamiento.
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           minLength: 3
 *         description: Término de búsqueda (mínimo 3 caracteres)
 *         example: logo
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por nombre de categoría
 *         example: DISENO
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [price, rating, date]
 *         description: Campo de ordenamiento
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Elementos por página
 *     responses:
 *       200:
 *         description: Lista paginada de gigs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedGigs'
 *       400:
 *         description: Parámetros de búsqueda inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', (req, res, next) => controller.findAll(req, res, next));

/**
 * @swagger
 * /gigs/{id}:
 *   get:
 *     tags: [Gigs]
 *     summary: Obtener un gig por ID
 *     description: Retorna un gig con todos sus paquetes, vendedor y detalles.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del gig
 *         example: gig-001
 *     responses:
 *       200:
 *         description: Gig encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gig'
 *       404:
 *         description: Gig no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', (req, res, next) => controller.findById(req, res, next));

/**
 * @swagger
 * /gigs/{id}/packages/{packageId}:
 *   delete:
 *     tags: [Gigs]
 *     summary: Eliminar un paquete de un gig
 *     description: Elimina un paquete especifico de un gig. El gig debe tener al menos un paquete restante.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del gig
 *       - in: path
 *         name: packageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del paquete a eliminar
 *     responses:
 *       200:
 *         description: Paquete eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 remainingPackages:
 *                   type: integer
 *                   example: 2
 *       400:
 *         description: No se puede eliminar (minimo 1 paquete requerido)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Gig o paquete no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id/packages/:packageId', (req, res, next) =>
  controller.deletePackage(req, res, next)
);

/**
 * @swagger
 * /gigs:
 *   post:
 *     tags: [Gigs]
 *     summary: Crear un nuevo gig
 *     description: Crea un gig con uno o más paquetes. Requiere al menos un paquete con al menos una característica.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GigCreate'
 *     responses:
 *       201:
 *         description: Gig creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gig'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', (req, res, next) => controller.create(req, res, next));

/**
 * @swagger
 * /gigs/{id}:
 *   put:
 *     tags: [Gigs]
 *     summary: Actualizar un gig existente
 *     description: Actualiza los campos de un gig incluyendo sus paquetes.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del gig
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GigCreate'
 *     responses:
 *       200:
 *         description: Gig actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gig'
 *       404:
 *         description: Gig no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', (req, res, next) => controller.update(req, res, next));

/**
 * @swagger
 * /gigs/{id}:
 *   delete:
 *     tags: [Gigs]
 *     summary: Eliminar un gig
 *     description: Elimina un gig y todos sus paquetes asociados.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del gig
 *     responses:
 *       204:
 *         description: Gig eliminado exitosamente
 *       404:
 *         description: Gig no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', (req, res, next) => controller.delete(req, res, next));

router.get('/:id/reviews', (req, res, next) => controller.getReviews(req, res, next));

/**
 * @swagger
 * /gigs/{id}/reviews:
 *   get:
 *     tags: [Gigs]
 *     summary: Listar reseñas de un gig
 *     description: Retorna las reseñas publicadas de un gig junto con su promedio de calificación.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del gig
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Reseñas del gig
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gigId:
 *                   type: string
 *                 rating:
 *                   type: number
 *                 reviewCount:
 *                   type: integer
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Opinion'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       404:
 *         description: Gig no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

export default router;
