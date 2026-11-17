import { EstadoPedido } from '../enums/EstadoPedido.js';
import { CamposInvalidos, ValidationError } from '../errors/index.js';

const SLA_DIAS_ENTREGA = 5;

const ESTADOS_CANCELABLES = [
  EstadoPedido.PENDIENTE,
  EstadoPedido.CONFIRMADO,
  EstadoPedido.EN_REVISION,
  EstadoPedido.CANCELADO,
];

export class Pedido {
  #estado;
  #fechaConfirmacion;
  cliente;
  gig;
  paqueteId;
  requerimientos;
  total;
  puntuacion;
  mensajes;
  fechaCreacion;
  canceladoAt;
  canceladoPor;
  canceladoPorRol;
  reembolso;

  constructor({
    cliente,
    gig,
    paqueteId,
    requerimientos,
    fechaCreacion,
    fechaConfirmacion,
    estado,
    total,
    puntuacion,
    mensajes,
    canceladoAt,
    canceladoPor,
    canceladoPorRol,
    reembolso,
  }) {
    this.cliente = cliente;
    this.gig = gig;
    this.paqueteId = paqueteId || null;
    this.requerimientos = requerimientos || '';
    this.fechaCreacion = fechaCreacion || new Date().toISOString();
    this.total = total || 0;
    this.#estado = estado || EstadoPedido.PENDIENTE;
    this.#fechaConfirmacion = fechaConfirmacion || null;
    this.puntuacion = puntuacion || 0.0;
    this.mensajes = mensajes || [];
    this.canceladoAt = canceladoAt || null;
    this.canceladoPor = canceladoPor || null;
    this.canceladoPorRol = canceladoPorRol || null;
    this.reembolso = reembolso || null;
  }

  get estado() {
    return this.#estado;
  }

  get fechaConfirmacion() {
    return this.#fechaConfirmacion;
  }

  get tieneEstimacionEntrega() {
    return this.#estado === EstadoPedido.CONFIRMADO && this.#fechaConfirmacion;
  }

  puedeCancelar() {
    return ESTADOS_CANCELABLES.includes(this.#estado);
  }

  cancelar(actorId, actorRol) {
    if (!this.puedeCancelar()) {
      throw new ValidationError(`El pedido no puede cancelarse en estado ${this.#estado}`);
    }
    if (this.#estado === EstadoPedido.CANCELADO) {
      return this;
    }

    this.#estado = EstadoPedido.CANCELADO;
    this.canceladoAt = new Date().toISOString();
    this.canceladoPor = actorId;
    this.canceladoPorRol = actorRol;
    return this;
  }

  adjuntarReembolso(reembolso) {
    this.reembolso = reembolso;
    return this;
  }

  actualizarEstado(estadoPedido) {
    if (!Object.values(EstadoPedido).includes(estadoPedido)) {
      throw new CamposInvalidos('El estado pedido no es valido');
    }
    this.#estado = estadoPedido;
    if (estadoPedido === EstadoPedido.CONFIRMADO && !this.#fechaConfirmacion) {
      this.#fechaConfirmacion = new Date().toISOString();
    }
  }

  calcularDiasEntregaRestantes() {
    if (!this.tieneEstimacionEntrega) return null;
    const ahora = new Date();
    const confirmacion = new Date(this.#fechaConfirmacion);
    const diffMs = Number(ahora) - Number(confirmacion);
    const diasTranscurridos = Math.floor(diffMs / 86400000);
    return Math.max(0, SLA_DIAS_ENTREGA - diasTranscurridos);
  }

  toJSON() {
    return {
      id: this.id,
      cliente: this.cliente,
      gig: this.gig,
      paqueteId: this.paqueteId,
      requerimientos: this.requerimientos,
      fechaCreacion: this.fechaCreacion,
      fechaConfirmacion: this.#fechaConfirmacion,
      estado: this.#estado,
      total: this.total,
      puntuacion: this.puntuacion,
      mensajes: this.mensajes,
      canceladoAt: this.canceladoAt,
      canceladoPor: this.canceladoPor,
      canceladoPorRol: this.canceladoPorRol,
      reembolso: this.reembolso,
    };
  }
}
