import { PedidoRepository } from '../repositories/PedidoRepository.js';
import { GigRepository } from '../repositories/GigRepository.js';
import { EstadoPedido } from '../enums/EstadoPedido.js';
import { orderEvents } from '../events/index.js';
import { ORDER_RULES } from '../config/orderRules.js';
import { NotFoundError, ForbiddenError, ValidationError, ConflictError } from '../errors/index.js';

export class PedidoService {
  #repository;
  #gigRepository;
  #eventEmitter;
  #idempotencyKeys;

  constructor(
    repository = new PedidoRepository(),
    gigRepository = new GigRepository(),
    eventEmitter = orderEvents
  ) {
    this.#repository = repository;
    this.#gigRepository = gigRepository;
    this.#eventEmitter = eventEmitter;
    this.#idempotencyKeys = new Map();
  }

  #iniciarReembolso(pedido) {
    if (!pedido || pedido.total <= 0) {
      return null;
    }
    return {
      monto: pedido.total,
      estado: 'INICIADO',
      fechaInicio: new Date().toISOString(),
    };
  }

  #emitOrderCancelled(pedido) {
    this.#eventEmitter.emit('OrderCancelled', {
      pedidoId: pedido.id,
      clienteId: pedido.cliente,
      canceladoPor: pedido.canceladoPor,
      canceladoPorRol: pedido.canceladoPorRol,
      canceladoAt: pedido.canceladoAt,
    });
  }

  #limpiarClavesExpiradas() {
    const ahora = Date.now();
    for (const [key, { timestamp }] of this.#idempotencyKeys.entries()) {
      if (ahora - timestamp > ORDER_RULES.IDEMPOTENCY_TTL_MS) {
        this.#idempotencyKeys.delete(key);
      }
    }
  }

  #assertGigConPaquetes(gig) {
    if (!gig) {
      throw new NotFoundError('Gig no encontrado');
    }
    if (!gig.paquetes || gig.paquetes.length === 0) {
      throw new ValidationError('El gig no tiene paquetes disponibles');
    }
  }

  #validarRequerimientos(requerimientos) {
    const texto = (requerimientos || '').trim();
    if (texto.length < ORDER_RULES.REQUERIMIENTOS_MIN_LENGTH) {
      throw new ValidationError(
        `Los requerimientos deben tener al menos ${ORDER_RULES.REQUERIMIENTOS_MIN_LENGTH} caracteres`
      );
    }
    if (texto.length > ORDER_RULES.REQUERIMIENTOS_MAX_LENGTH) {
      throw new ValidationError(
        `Los requerimientos deben tener como maximo ${ORDER_RULES.REQUERIMIENTOS_MAX_LENGTH} caracteres`
      );
    }
    return texto;
  }

  #resolverPaquete(gig, paqueteId) {
    if (!paqueteId) {
      throw new ValidationError('Debe seleccionar un paquete');
    }
    const paquete = gig.paquetes.find((p) => p.id === paqueteId);
    if (!paquete) {
      throw new NotFoundError('Paquete no encontrado en el gig');
    }
    return paquete;
  }

  placeOrder(clienteId, { gigId, paqueteId, requerimientos, idempotencyKey } = {}) {
    if (!gigId) {
      throw new ValidationError('El gig es requerido');
    }

    if (idempotencyKey) {
      this.#limpiarClavesExpiradas();
      const existente = this.#idempotencyKeys.get(idempotencyKey);
      if (existente) {
        throw new ConflictError('Pedido ya registrado con esta clave de idempotencia');
      }
    }

    const gig = this.#gigRepository.findById(gigId);
    this.#assertGigConPaquetes(gig);
    const paquete = this.#resolverPaquete(gig, paqueteId);
    const requerimientosLimpios = this.#validarRequerimientos(requerimientos);

    const pedido = this.#repository.create({
      cliente: clienteId,
      gig: gigId,
      paqueteId,
      requerimientos: requerimientosLimpios,
      total: paquete.precio,
      estado: EstadoPedido.PENDIENTE,
    });

    if (idempotencyKey) {
      this.#idempotencyKeys.set(idempotencyKey, {
        pedidoId: pedido.id,
        timestamp: Date.now(),
      });
    }

    return pedido;
  }

  findAll() {
    return this.#repository.findAll();
  }

  findById(id) {
    return this.#repository.findById(id);
  }

  findByCliente(clientId, page, pageSize = 10) {
    return this.#repository.findByCliente(clientId, page, pageSize);
  }

  findByGig(gigId, page, pageSize = 10) {
    return this.#repository.findByGig(gigId, page, pageSize);
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

  resolveOrderWithGig(pedidoId) {
    const pedido = this.#repository.findById(pedidoId);
    if (!pedido) {
      throw new NotFoundError('Pedido no encontrado');
    }

    const gig = this.#gigRepository.findById(pedido.gig);
    if (!gig) {
      throw new NotFoundError('Gig asociado al pedido no encontrado');
    }

    return { pedido, gig };
  }

  assertParticipante(pedidoId, senderId) {
    const { pedido, gig } = this.resolveOrderWithGig(pedidoId);

    if (senderId !== pedido.cliente && senderId !== gig.vendedor) {
      throw new ForbiddenError('No tienes permiso para acceder a este chat');
    }

    return { pedido, gig };
  }

  assertCliente(pedidoId, clienteId) {
    const pedido = this.#repository.findById(pedidoId);
    if (!pedido) {
      throw new NotFoundError('Pedido no encontrado');
    }
    if (pedido.cliente !== clienteId) {
      throw new ForbiddenError('No tienes permiso para cancelar este pedido');
    }
    return pedido;
  }

  cancelOrder(orderId, actorId, actorRol) {
    const pedido = this.#repository.findById(orderId);
    if (!pedido) {
      throw new NotFoundError('Pedido no encontrado');
    }

    const esClientePropio = pedido.cliente === actorId;
    const esAdmin = actorRol?.toLowerCase() === 'admin';
    if (!esClientePropio && !esAdmin) {
      throw new ForbiddenError('No tienes permiso para cancelar este pedido');
    }

    if (pedido.estado === EstadoPedido.CANCELADO) {
      return pedido;
    }

    if (!pedido.puedeCancelar()) {
      throw new ValidationError(`El pedido no puede cancelarse en estado ${pedido.estado}`);
    }

    pedido.cancelar(actorId, actorRol);

    const reembolso = this.#iniciarReembolso(pedido);
    if (reembolso) {
      pedido.adjuntarReembolso(reembolso);
    }

    this.#emitOrderCancelled(pedido);

    return pedido;
  }
}
