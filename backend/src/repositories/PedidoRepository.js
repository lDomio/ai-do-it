import { Pedido } from '../domain/Pedido.js';

export class PedidoRepository {
  #pedidos;
  #idCounter;

  constructor() {
    this.#pedidos = new Map();
    this.#idCounter = 1;
  }

  findAll() {
    return Array.from(this.#pedidos.values());
  }

  findById(id) {
    return this.#pedidos.get(id) ?? null;
  }

  create(datos) {
    const id = String(this.#idCounter++);
    const pedido = new Pedido(datos);
    pedido.id = id;
    this.#pedidos.set(id, pedido);
    return pedido;
  }

  update(id, datos) {
    const pedido = this.#pedidos.get(id);
    if (!pedido) return null;
    if (datos.estado) {
      pedido.actualizarEstado(datos.estado);
    }
    if (datos.total !== undefined) {
      pedido.total = datos.total;
    }
    return pedido;
  }

  findByCliente(clientId, page, pageSize = 10) {
    const todos = Array.from(this.#pedidos.values());
    const filtrados = todos.filter((p) => p.cliente === clientId);
    const totalItems = filtrados.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const inicio = (page - 1) * pageSize;
    const items = filtrados.slice(inicio, inicio + pageSize);

    return { items, totalItems, currentPage: page, totalPages };
  }

  countByCliente(clientId) {
    return Array.from(this.#pedidos.values()).filter((p) => p.cliente === clientId).length;
  }

  findByGig(gigId, page, pageSize = 10) {
    const todos = Array.from(this.#pedidos.values());
    const filtrados = todos.filter((p) => p.gig === gigId);
    const totalItems = filtrados.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const inicio = (page - 1) * pageSize;
    const items = filtrados.slice(inicio, inicio + pageSize);

    return { items, totalItems, currentPage: page, totalPages };
  }

  countByGig(gigId) {
    return Array.from(this.#pedidos.values()).filter((p) => p.gig === gigId).length;
  }

  delete(id) {
    const pedido = this.#pedidos.get(id);
    if (!pedido) return false;
    this.#pedidos.delete(id);
    return true;
  }
}
