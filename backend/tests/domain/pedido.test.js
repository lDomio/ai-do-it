import { Pedido } from '../../src/domain/Pedido.js';
import { EstadoPedido } from '../../src/enums/EstadoPedido.js';

describe('Pedido', () => {
  describe('constructor', () => {
    it('debería crear una instancia con estado PENDIENTE por defecto', () => {
      const pedido = new Pedido({ cliente: 'cliente1', gig: 'gig1' });

      expect(pedido.total).toBe(0);
      expect(pedido.puntuacion).toBe(0.0);
      expect(pedido.mensajes).toEqual([]);
    });
  });

  describe('actualizarEstado', () => {
    it('debería actualizar el estado con un valor válido sin lanzar error', () => {
      const pedido = new Pedido({ cliente: 'cliente1', gig: 'gig1' });

      expect(() => pedido.actualizarEstado(EstadoPedido.CONFIRMADO)).not.toThrow();
    });

    it('debería lanzar error con un estado inválido', () => {
      const pedido = new Pedido({ cliente: 'cliente1', gig: 'gig1' });

      expect(() => pedido.actualizarEstado('EstadoInvalido')).toThrow(
        'El estado pedido no es valido'
      );
    });
  });
});
