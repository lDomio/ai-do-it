import { Usuario } from '../domain/Usuario.js';

export class UsuarioRepository {
  #usuarios;
  #idCounter;

  constructor() {
    this.#usuarios = new Map();
    this.#idCounter = 1;
  }

  findAll() {
    return Array.from(this.#usuarios.values());
  }

  findById(id) {
    return this.#usuarios.get(id) ?? null;
  }

  create(datos) {
    const id = String(this.#idCounter++);
    const usuario = new Usuario(datos);
    usuario.id = id;
    this.#usuarios.set(id, usuario);
    return usuario;
  }

  update(id, datos) {
    const usuario = this.#usuarios.get(id);
    if (!usuario) return null;
    Object.assign(usuario, datos);
    return usuario;
  }

  findByEmail(email) {
    for (const usuario of this.#usuarios.values()) {
      if (usuario.email === email) {
        return usuario;
      }
    }
    return null;
  }

  delete(id) {
    const usuario = this.#usuarios.get(id);
    if (!usuario) return false;
    this.#usuarios.delete(id);
    return true;
  }
}
