import bcrypt from 'bcryptjs';
import { usuarioRepository } from '../store/index.js';
import { UnauthorizedError, ConflictError, ValidationError } from '../errors/index.js';
import { RolUsuario } from '../enums/RolUsuario.js';
import { generateToken } from '../middleware/auth.js';
import { RefreshTokenService } from './RefreshTokenService.js';

export class AuthService {
  #repository;
  #refreshTokenService;

  constructor(repository = usuarioRepository, refreshTokenService = new RefreshTokenService()) {
    this.#repository = repository;
    this.#refreshTokenService = refreshTokenService;
  }

  async login(email, password) {
    if (!email || !password) {
      throw new ValidationError('Email y password son requeridos');
    }

    const usuario = this.#repository.findByEmail(email);

    if (!usuario) {
      throw new UnauthorizedError('Email o password inválidos');
    }

    if (!usuario.activo) {
      throw new UnauthorizedError('Cuenta desactivada. Contacte al administrador');
    }

    if (!usuario.rol) {
      throw new UnauthorizedError('Cuenta no configurada. Contacte al administrador');
    }

    const passwordValido = await bcrypt.compare(password, usuario.passwordHash);

    if (!passwordValido) {
      throw new UnauthorizedError('Email o password inválidos');
    }

    const token = generateToken(usuario);
    const refreshTokenData = this.#refreshTokenService.createRefreshToken(usuario.id);

    return {
      token,
      refreshToken: refreshTokenData.token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }

  async register({ nombre, apellido, email, password, rol }) {
    if (!nombre || !apellido || !email || !password) {
      throw new ValidationError('Nombre, apellido, email y password son requeridos');
    }

    const existente = this.#repository.findByEmail(email);
    if (existente) {
      throw new ConflictError('Ya existe una cuenta con ese email');
    }

    const normalizedRol = rol ? rol.trim() : null;
    const lowerRol = normalizedRol ? normalizedRol.toLowerCase() : null;
    const effectiveRol =
      Object.values(RolUsuario).find((r) => r.toLowerCase() === lowerRol) ||
      RolUsuario.CLIENTE;
    if (!Object.values(RolUsuario).includes(effectiveRol)) {
      throw new ValidationError('Rol inválido');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = this.#repository.create({
      nombre,
      apellido,
      email,
      passwordHash,
      rol: effectiveRol,
    });

    const token = generateToken(usuario);
    const refreshTokenData = this.#refreshTokenService.createRefreshToken(usuario.id);

    return {
      token,
      refreshToken: refreshTokenData.token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }
}
