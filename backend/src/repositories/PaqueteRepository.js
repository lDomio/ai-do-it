import { Paquete } from '../domain/Paquete.js';

export class PaqueteRepository {
  #paquetes;
  #idCounter;

  constructor() {
    this.#paquetes = new Map();
    this.#idCounter = 1;
  }

  findAll() {
    return Array.from(this.#paquetes.values());
  }

  findById(id) {
    return this.#paquetes.get(id) ?? null;
  }

  create(datos) {
    const id = String(this.#idCounter++);
    const paquete = new Paquete(datos);
    paquete.id = id;
    this.#paquetes.set(id, paquete);
    return paquete;
  }

  update(id, datos) {
    const paquete = this.#paquetes.get(id);
    if (!paquete) return null;
    Object.assign(paquete, datos);
    return paquete;
  }

  delete(id) {
    const paquete = this.#paquetes.get(id);
    if (!paquete) return false;
    this.#paquetes.delete(id);
    return true;
  }
}
