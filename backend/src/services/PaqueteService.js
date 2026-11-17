import { PaqueteRepository } from '../repositories/PaqueteRepository.js';

export class PaqueteService {
  #repository;

  constructor(repository = new PaqueteRepository()) {
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
