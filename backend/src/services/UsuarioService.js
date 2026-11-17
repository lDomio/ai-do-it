import { UsuarioRepository } from '../repositories/UsuarioRepository.js';
import { usuarioRepository } from '../store/index.js';

export class UsuarioService {
  #repository;

  constructor(repository = usuarioRepository) {
    this.#repository = repository;
  }

  findAll() {
    return this.#repository.findAll();
  }

  findById(id) {
    return this.#repository.findById(id);
  }

  create(datos) {
    return this.#repository.create(datos);
  }

  update(id, datos) {
    return this.#repository.update(id, datos);
  }

  delete(id) {
    return this.#repository.delete(id);
  }
}
