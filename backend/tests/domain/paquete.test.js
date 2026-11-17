import { Paquete } from '../../src/domain/Paquete.js';

describe('Paquete', () => {
  describe('constructor', () => {
    it('debería crear una instancia con nombre y días de entrega', () => {
      const paquete = new Paquete({ nombre: 'Básico', diasEntrega: 7 });

      expect(paquete.precio).toBe(0.0);
      expect(paquete.descripcion).toBe('');
    });
  });
});
