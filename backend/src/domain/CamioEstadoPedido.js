export class CambioEstadoPedido {
  #pedido;
  #estado;
  quien;

  constructor({ pedido, estado }) {
    this.#pedido = pedido;
    this.#estado = estado;
  }
}
