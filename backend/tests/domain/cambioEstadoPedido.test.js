import { CambioEstadoPedido } from '../../src/domain/CamioEstadoPedido.js';

describe('CambioEstadoPedido', () => {
  describe('constructor', () => {
    it('debería crear una instancia con pedido y estado', () => {
      const cambio = new CambioEstadoPedido({
        pedido: 'pedido1',
        estado: 'Confirmado',
      });

      expect(cambio.quien).toBeUndefined();
    });
  });
});
