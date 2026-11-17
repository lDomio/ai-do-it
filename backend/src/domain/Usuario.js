import { RolUsuario } from '../enums/RolUsuario.js';
import { CamposInvalidos } from '../errors/index.js';

export class Usuario {
  nombre;
  apellido;
  email;
  #passwordHash;
  #rol;
  #activo;
  #favoritos;

  constructor({ nombre, apellido, email, passwordHash, rol }) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.#passwordHash = passwordHash;
    this.#favoritos = [];
    this.#activo = true;

    if (rol) {
      this.setRole(rol);
    }
  }

  get rol() {
    return this.#rol;
  }

  setRole(rolUsuario) {
    if (!Object.values(RolUsuario).includes(rolUsuario)) {
      throw new CamposInvalidos('No es un rol válido para asignar al usuario');
    }
    this.#rol = rolUsuario;
  }

  get activo() {
    return this.#activo;
  }

  get passwordHash() {
    return this.#passwordHash;
  }

  agregarGigAFavoritos(gig) {
    if (gig === null) {
      throw new CamposInvalidos('Gig invalido');
    }

    this.#favoritos.push(gig);
  }

  desactivar() {
    this.#activo = false;
  }

  activar() {
    this.#activo = true;
  }
}
