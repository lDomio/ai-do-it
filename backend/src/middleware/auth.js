import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UnauthorizedError, ForbiddenError } from '../errors/index.js';

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Token de autenticación requerido'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    next(new UnauthorizedError('Token inválido o expirado'));
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('No autenticado'));
    }

    if (!roles.includes(req.user.rol)) {
      return next(new ForbiddenError('No tienes permiso para acceder a este recurso'));
    }

    next();
  };
}

export function generateToken(usuario) {
  return jwt.sign(
    {
      id: usuario.id,
      nombre: usuario.nombre || '',
      apellido: usuario.apellido || '',
      email: usuario.email,
      rol: usuario.rol,
    },
    JWT_SECRET,
    {
      expiresIn: '1h',
    }
  );
}

export function generateRefreshToken() {
  return crypto.randomBytes(40).toString('hex');
}

export function verifyRefreshToken(token) {
  // Refresh tokens are opaque strings, not JWTs, so we just return the token
  // In a real implementation, we would look up the token in the database
  return token;
}
