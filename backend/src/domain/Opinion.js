import { ValidationError } from '../errors/index.js';

const MAX_DETALLE_LENGTH = 1000;

export class Opinion {
  #cliente;
  #gig;
  #pedido;
  detalle;
  puntuacion;
  fechaCreacion;

  constructor({ cliente, gig, pedido, puntuacion, detalle }) {
    this.#cliente = this.#validarTexto(cliente, 'cliente');
    this.#gig = this.#validarTexto(gig, 'gig');
    this.#pedido = this.#validarTexto(pedido, 'pedido');
    this.puntuacion = this.#validarPuntuacion(puntuacion);
    this.detalle = this.#validarDetalle(detalle);
    this.fechaCreacion = new Date().toISOString();
  }

  get cliente() {
    return this.#cliente;
  }

  get gig() {
    return this.#gig;
  }

  get pedido() {
    return this.#pedido;
  }

  #validarTexto(valor, campo) {
    if (!valor || typeof valor !== 'string' || valor.trim().length === 0) {
      throw new ValidationError(`El campo ${campo} es requerido`);
    }
    return valor;
  }

  #validarPuntuacion(puntuacion) {
    if (puntuacion === undefined || puntuacion === null) {
      throw new ValidationError('La puntuacion es requerida');
    }
    const numero = Number(puntuacion);
    if (!Number.isInteger(numero) || numero < 1 || numero > 5) {
      throw new ValidationError('La puntuacion debe ser un entero entre 1 y 5');
    }
    return numero;
  }

  #validarDetalle(detalle) {
    if (detalle === undefined || detalle === null) {
      throw new ValidationError('El detalle es requerido');
    }
    const limpio = String(detalle).trim();
    if (limpio.length === 0) {
      throw new ValidationError('El detalle no puede estar vacio');
    }
    if (limpio.length > MAX_DETALLE_LENGTH) {
      throw new ValidationError(`El detalle no puede exceder los ${MAX_DETALLE_LENGTH} caracteres`);
    }
    return limpio;
  }

  toJSON() {
    return {
      id: this.id,
      cliente: this.#cliente,
      gig: this.#gig,
      pedido: this.#pedido,
      puntuacion: this.puntuacion,
      detalle: this.detalle,
      fechaCreacion: this.fechaCreacion,
    };
  }
}
