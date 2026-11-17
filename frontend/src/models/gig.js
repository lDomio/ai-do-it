export class Package {
  constructor({ id, nombre, precio, diasEntrega, caracteristicas = [] }) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.diasEntrega = diasEntrega;
    this.caracteristicas = caracteristicas;
  }

  static fromJSON(json) {
    return new Package(json);
  }
}

export class Gig {
  constructor({ id, nombre, descripcion, categoria, vendedor, paquetes = [], multimedia = [] }) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.categoria = categoria;
    this.vendedor = vendedor;
    this.paquetes = paquetes;
    this.multimedia = multimedia;
  }

  get precioInicial() {
    if (!this.paquetes.length) return 0;
    return Math.min(...this.paquetes.map((p) => p.precio || 0));
  }

  static fromJSON(json) {
    return new Gig(json);
  }
}
