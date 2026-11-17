import { Router } from 'express';
import { PedidoController } from '../controllers/PedidoController.js';
import { MensajeController } from '../controllers/MensajeController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
let controller = new PedidoController();
let mensajeController = new MensajeController();

export function setPedidoController(newController) {
  controller = newController;
}

export function setMensajeController(newController) {
  mensajeController = newController;
}

/**
 * @swagger
 * /pedidos/mis-pedidos:
 *   get:
 *     tags: [Pedidos]
 *     summary: Obtener pedidos del cliente autenticado
 *     description: Retorna los pedidos del cliente actual con paginación. Requiere autenticación JWT.
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Lista de pedidos del cliente
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/mis-pedidos', authenticate, (req, res, next) =>
  controller.findByCliente(req, res, next)
);

/**
 * @swagger
 * /pedidos/gig/{gigId}:
 *   get:
 *     tags: [Pedidos]
 *     summary: Obtener pedidos de un gig específico
 *     description: Retorna los pedidos asociados a un gig. Solo el propietario del gig puede acceder. Requiere autenticación JWT.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gigId
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
 *         description: Lista de pedidos del gig
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No es el propietario del gig
 */
router.get('/gig/:gigId', authenticate, (req, res, next) => controller.findByGig(req, res, next));

/**
 * @swagger
 * /pedidos:
 *   get:
 *     tags: [Pedidos]
 *     summary: Listar todos los pedidos
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 */
router.get('/', (req, res, next) => controller.findAll(req, res, next));

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     tags: [Pedidos]
 *     summary: Obtener un pedido por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: Pedido no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', (req, res, next) => controller.findById(req, res, next));

/**
 * @swagger
 * /pedidos:
 *   post:
 *     tags: [Pedidos]
 *     summary: Crear un nuevo pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['gig', 'cliente']
 *             properties:
 *               gig:
 *                 type: string
 *                 description: ID del gig
 *               cliente:
 *                 type: string
 *                 description: ID del cliente
 *               total:
 *                 type: number
 *                 description: Total a pagar
 *     responses:
 *       201:
 *         description: Pedido creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Datos inválidos
 */
router.post('/', (req, res, next) => controller.create(req, res, next));

/**
 * @swagger
 * /pedidos/reservar:
 *   post:
 *     tags: [Pedidos]
 *     summary: Realizar un pedido sobre un Gig seleccionando un paquete
 *     description: Crea un pedido para un paquete específico de un Gig, incluyendo los requerimientos del cliente. Requiere autenticación JWT.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoPlace'
 *     parameters:
 *       - in: header
 *         name: Idempotency-Key
 *         required: false
 *         schema:
 *           type: string
 *         description: Clave opcional para evitar pedidos duplicados
 *     responses:
 *       201:
 *         description: Pedido creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Gig o paquete no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Pedido ya registrado con la misma clave de idempotencia
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/reservar', authenticate, (req, res, next) => controller.place(req, res, next));

/**
 * @swagger
 * /pedidos/{id}:
 *   put:
 *     tags: [Pedidos]
 *     summary: Actualizar un pedido
 *     description: Permite cambiar el estado del pedido (CONFIRMADO, EN_REVISION, ENTREGADO, CANCELADO).
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
 *               estado:
 *                 $ref: '#/components/schemas/EstadoPedido'
 *               puntuacion:
 *                 type: number
 *                 description: Calificación del 1 al 5 (solo al completar)
 *     responses:
 *       200:
 *         description: Pedido actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Transición de estado inválida
 *       404:
 *         description: Pedido no encontrado
 */
router.put('/:id', (req, res, next) => controller.update(req, res, next));

/**
 * @swagger
 * /pedidos/{id}:
 *   delete:
 *     tags: [Pedidos]
 *     summary: Eliminar un pedido
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Pedido eliminado
 *       404:
 *         description: Pedido no encontrado
 */
router.delete('/:id', (req, res, next) => controller.delete(req, res, next));

/**
 * @swagger
 * /pedidos/{id}/cancel:
 *   post:
 *     tags: [Pedidos]
 *     summary: Cancelar un pedido
 *     description: Permite al cliente propietario o a un administrador cancelar un pedido que no haya sido entregado. Requiere autenticación JWT.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido cancelado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: El pedido no puede cancelarse en su estado actual o ya está cancelado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permiso para cancelar este pedido
 *       404:
 *         description: Pedido no encontrado
 */
router.post('/:id/cancel', authenticate, (req, res, next) => controller.cancel(req, res, next));

/**
 * @swagger
 * /pedidos/{id}/messages:
 *   get:
 *     tags: [Pedidos]
 *     summary: Listar mensajes de un pedido
 *     description: Retorna todos los mensajes del chat de un pedido en orden cronológico. Requiere autenticación JWT y que el usuario sea cliente o vendedor del pedido.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de mensajes
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permiso para acceder a este chat
 *       404:
 *         description: Pedido no encontrado
 */
router.get('/:id/messages', authenticate, (req, res, next) =>
  mensajeController.findByPedido(req, res, next)
);

/**
 * @swagger
 * /pedidos/{id}/messages:
 *   post:
 *     tags: [Pedidos]
 *     summary: Enviar un mensaje en un pedido
 *     description: Envía un mensaje de texto en el chat del pedido. Requiere autenticación JWT y que el usuario sea cliente o vendedor del pedido. No se permiten mensajes en pedidos completados o cancelados.
 *     security:
 *       - bearerAuth: []
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
 *             required: ['content']
 *             properties:
 *               content:
 *                 type: string
 *                 description: Contenido del mensaje
 *                 example: Hola, ¿cuándo estará listo el diseño?
 *     responses:
 *       201:
 *         description: Mensaje enviado
 *       400:
 *         description: Contenido inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permiso o el pedido está cerrado
 *       404:
 *         description: Pedido no encontrado
 */
router.post('/:id/messages', authenticate, (req, res, next) =>
  mensajeController.createForPedido(req, res, next)
);

export default router;
