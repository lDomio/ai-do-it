import { OpinionRepository } from '../repositories/OpinionRepository.js';
import { PedidoService } from '../services/PedidoService.js';
import { NotFoundError, ValidationError, ForbiddenError, ConflictError } from '../errors/index.js';

export class OpinionService {
  #repository;
  #pedidoService;

  constructor(repository = new OpinionRepository(), pedidoService = new PedidoService()) {
    this.#repository = repository;
    this.#pedidoService = pedidoService;
  }

  findAll() {
    return this.#repository.findAll();
  }

  findById(id) {
    return this.#repository.findById(id);
  }

  findByGigId(gigId) {
    return this.#repository.findByGigId(gigId).sort((a, b) => {
      const diffFecha = Number(new Date(b.fechaCreacion)) - Number(new Date(a.fechaCreacion));
      if (diffFecha !== 0) return diffFecha;
      return Number(b.id) - Number(a.id);
    });
  }

  calcularRating(gigId) {
    const opiniones = this.#repository.findByGigId(gigId);
    if (opiniones.length === 0) {
      return { rating: 0, reviewCount: 0 };
    }

    const total = opiniones.reduce((suma, opinion) => suma + opinion.puntuacion, 0);
    const promedio = total / opiniones.length;
    return { rating: Math.round(promedio * 10) / 10, reviewCount: opiniones.length };
  }

  create(datos) {
    const pedido = this.#pedidoService.findById(datos.pedido);
    if (!pedido) {
      throw new NotFoundError('Pedido no encontrado');
    }

    if (pedido.estado !== 'Entregado') {
      throw new ValidationError('El pedido debe estar entregado para dejar una reseña');
    }

    if (pedido.cliente !== datos.cliente) {
      throw new ForbiddenError('No tienes permiso para reseñar este pedido');
    }

    const existente = this.#repository.findByPedidoId(datos.pedido);
    if (existente) {
      throw new ConflictError('El pedido ya tiene una reseña');
    }

    return this.#repository.create(datos);
  }

  update(id, datos) {
    return this.#repository.update(id, datos);
  }

  delete(id) {
    return this.#repository.delete(id);
  }
}
