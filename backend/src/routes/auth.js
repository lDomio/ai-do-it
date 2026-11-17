import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { authenticate } from '../middleware/auth.js';
import {
  loginRateLimiter,
  refreshRateLimiter,
  registerRateLimiter,
} from '../middleware/rateLimiter.js';

const router = Router();
const controller = new AuthController();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesion
 *     description: Autentica al usuario y retorna un token JWT. Rate limit 5 req/min.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       429:
 *         description: Demasiadas solicitudes (rate limit)
 */
router.post('/login', loginRateLimiter, (req, res, next) => controller.login(req, res, next));

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar nuevo usuario
 *     description: Crea una nueva cuenta. Rate limit 5 req/min.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Registro exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Datos de registro inválidos
 *       409:
 *         description: Email ya registrado
 *       429:
 *         description: Demasiadas solicitudes (rate limit)
 */
router.post('/register', registerRateLimiter, (req, res, next) =>
  controller.register(req, res, next)
);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Renovar token de acceso
 *     description: Usa el refresh token para obtener un nuevo access token. Rate limit 5 req/min.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Token renovado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Refresh token inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       429:
 *         description: Demasiadas solicitudes (rate limit)
 */
router.post('/refresh', refreshRateLimiter, (req, res, next) => controller.refresh(req, res, next));

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Cerrar sesión
 *     description: Revoca todos los refresh tokens del usuario y limpia la cookie.
 *     responses:
 *       200:
 *         description: Sesión cerrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 */
router.post('/logout', (req, res, next) => controller.logout(req, res, next));

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Obtener usuario autenticado
 *     description: Retorna los datos del usuario cuyo access token JWT es válido.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 apellido:
 *                   type: string
 *                 email:
 *                   type: string
 *                 rol:
 *                   type: string
 *       401:
 *         description: No autenticado
 */
router.get('/me', authenticate, (req, res) => {
  res.json({
    id: req.user.id,
    nombre: req.user.nombre || '',
    apellido: req.user.apellido || '',
    email: req.user.email,
    rol: req.user.rol,
  });
});

export default router;
