import { Categoria } from '../domain/Categoria.js';

export class CategoriaRepository {
  #categorias;
  #idCounter;

  constructor() {
    this.#categorias = new Map();
    this.#idCounter = 1;
  }

  findAll() {
    return Array.from(this.#categorias.values());
  }

  findById(id) {
    return this.#categorias.get(id) ?? null;
  }

  create(datos) {
    const id = String(this.#idCounter++);
    const categoria = new Categoria();
    categoria.id = id;
    Object.assign(categoria, datos);
    this.#categorias.set(id, categoria);
    return categoria;
  }

  update(id, datos) {
    const categoria = this.#categorias.get(id);
    if (!categoria) return null;
    Object.assign(categoria, datos);
    return categoria;
  }

  delete(id) {
    const categoria = this.#categorias.get(id);
    if (!categoria) return false;
    this.#categorias.delete(id);
    return true;
  }
}
