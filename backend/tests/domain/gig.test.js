import { Gig } from '../../src/domain/Gig.js';

describe('Gig', () => {
  describe('constructor', () => {
    it('debería crear una instancia con vendedor', () => {
      const gig = new Gig({ vendedor: 'vendedor1' });

      expect(gig.paquetes).toEqual([]);
      expect(gig.multimedia).toEqual([]);
    });
  });

  describe('tuPrecionEstaEntre', () => {
    it('debería retornar true si el precio está dentro del rango', () => {
      const gig = new Gig({ vendedor: 'vendedor1' });
      gig.paquetes = [{ precio: 100 }, { precio: 200 }];

      const resultado = gig.tuPrecionEstaEntre(50, 400);

      expect(resultado).toBe(true);
    });

    it('debería retornar false si el precio es menor al mínimo', () => {
      const gig = new Gig({ vendedor: 'vendedor1' });
      gig.paquetes = [{ precio: 50 }];

      const resultado = gig.tuPrecionEstaEntre(100, 200);

      expect(resultado).toBe(false);
    });

    it('debería retornar false si el precio es mayor al máximo', () => {
      const gig = new Gig({ vendedor: 'vendedor1' });
      gig.paquetes = [{ precio: 500 }];

      const resultado = gig.tuPrecionEstaEntre(100, 200);

      expect(resultado).toBe(false);
    });
  });
});
