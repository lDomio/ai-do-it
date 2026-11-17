import { Mensaje } from '../domain/Mensaje.js';

export class MensajeRepository {
  #mensajes;
  #idCounter;

  constructor() {
    this.#mensajes = new Map();
    this.#idCounter = 1;
  }

  findAll() {
    return Array.from(this.#mensajes.values());
  }

  findById(id) {
    return this.#mensajes.get(id) ?? null;
  }

  findByPedidoId(pedidoId) {
    return Array.from(this.#mensajes.values())
      .filter((mensaje) => mensaje.pedidoId === pedidoId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  create(datos) {
    const id = String(this.#idCounter++);
    const mensaje = new Mensaje(datos);
    mensaje.id = id;
    this.#mensajes.set(id, mensaje);
    return mensaje;
  }

  update(id, datos) {
    const mensaje = this.#mensajes.get(id);
    if (!mensaje) return null;

    if (datos.status !== undefined) {
      mensaje.setStatus(datos.status);
    }

    return mensaje;
  }

  delete(id) {
    const mensaje = this.#mensajes.get(id);
    if (!mensaje) return false;
    this.#mensajes.delete(id);
    return true;
  }
}
