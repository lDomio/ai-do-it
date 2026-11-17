import { Opinion } from '../domain/Opinion.js';

export class OpinionRepository {
  #opiniones;
  #idCounter;

  constructor() {
    this.#opiniones = new Map();
    this.#idCounter = 1;
  }

  findAll() {
    return Array.from(this.#opiniones.values());
  }

  findById(id) {
    return this.#opiniones.get(id) ?? null;
  }

  findByPedidoId(pedidoId) {
    return (
      Array.from(this.#opiniones.values()).find((opinion) => opinion.pedido === pedidoId) ?? null
    );
  }

  findByGigId(gigId) {
    return Array.from(this.#opiniones.values()).filter((opinion) => opinion.gig === gigId);
  }

  create(datos) {
    const id = String(this.#idCounter++);
    const opinion = new Opinion(datos);
    opinion.id = id;
    this.#opiniones.set(id, opinion);
    return opinion;
  }

  findByClienteId(clienteId) {
    return Array.from(this.#opiniones.values()).filter((opinion) => opinion.cliente === clienteId);
  }

  update(id, datos) {
    const opinion = this.#opiniones.get(id);
    if (!opinion) return null;
    Object.assign(opinion, datos);
    return opinion;
  }

  delete(id) {
    const opinion = this.#opiniones.get(id);
    if (!opinion) return false;
    this.#opiniones.delete(id);
    return true;
  }
}
