export class Paquete {
  #nombre;
  #diasEntrega;
  id;
  precio;
  descripcion;

  constructor({ nombre, diasEntrega, precio = 0.0 }) {
    this.#nombre = nombre;
    this.#diasEntrega = diasEntrega;
    this.precio = precio;
    this.descripcion = '';
  }

  get nombre() {
    return this.#nombre;
  }

  get diasEntrega() {
    return this.#diasEntrega;
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.#nombre,
      precio: this.precio,
      diasEntrega: this.#diasEntrega,
      descripcion: this.descripcion,
    };
  }
}
