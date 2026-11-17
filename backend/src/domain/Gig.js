export class Gig {
  #vendedor;
  id;
  nombre;
  descripcion;
  categoria;
  paquetes;
  multimedia;
  fechaCreacion;

  constructor({ vendedor }) {
    this.#vendedor = vendedor;
    this.paquetes = [];
    this.multimedia = [];
    this.fechaCreacion = new Date().toISOString();
  }

  get vendedor() {
    return this.#vendedor;
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      categoria: this.categoria,
      vendedor: this.#vendedor,
      paquetes: this.paquetes,
      multimedia: this.multimedia,
      fechaCreacion: this.fechaCreacion,
    };
  }

  tuPrecionEstaEntre(precioDesde, precioHasta) {
    const precioTotal = this.paquetes.reduce((sum, p) => sum + p.precio, 0);
    return precioDesde < precioTotal && precioTotal < precioHasta;
  }
}
