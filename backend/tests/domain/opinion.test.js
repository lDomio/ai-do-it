import { Opinion } from '../../src/domain/Opinion.js';

describe('Opinion', () => {
  const datosValidos = {
    cliente: 'cliente1',
    gig: 'gig1',
    pedido: 'pedido1',
    puntuacion: 5,
    detalle: 'Excelente trabajo',
  };

  describe('constructor', () => {
    it('debería crear una instancia con cliente, gig, pedido, puntuacion y detalle', () => {
      const opinion = new Opinion(datosValidos);

      expect(opinion.cliente).toBe('cliente1');
      expect(opinion.gig).toBe('gig1');
      expect(opinion.pedido).toBe('pedido1');
      expect(opinion.puntuacion).toBe(5);
      expect(opinion.detalle).toBe('Excelente trabajo');
      expect(opinion.fechaCreacion).toBeTruthy();
    });

    it('debería aceptar puntuacion como string numerico', () => {
      const opinion = new Opinion({ ...datosValidos, puntuacion: '4' });
      expect(opinion.puntuacion).toBe(4);
    });

    it('debería rechazar puntuacion menor a 1', () => {
      expect(() => new Opinion({ ...datosValidos, puntuacion: 0 })).toThrow();
    });

    it('debería rechazar puntuacion mayor a 5', () => {
      expect(() => new Opinion({ ...datosValidos, puntuacion: 6 })).toThrow();
    });

    it('debería rechazar puntuacion no entera', () => {
      expect(() => new Opinion({ ...datosValidos, puntuacion: 4.5 })).toThrow();
    });

    it('debería rechazar puntuacion ausente', () => {
      expect(() => new Opinion({ ...datosValidos, puntuacion: undefined })).toThrow();
    });

    it('debería rechazar detalle vacio', () => {
      expect(() => new Opinion({ ...datosValidos, detalle: '' })).toThrow();
    });

    it('debería rechazar detalle con solo espacios', () => {
      expect(() => new Opinion({ ...datosValidos, detalle: '   ' })).toThrow();
    });

    it('debería rechazar detalle que exceda los 1000 caracteres', () => {
      const detalleLargo = 'a'.repeat(1001);
      expect(() => new Opinion({ ...datosValidos, detalle: detalleLargo })).toThrow();
    });

    it('debería recortar espacios al inicio y final del detalle', () => {
      const opinion = new Opinion({ ...datosValidos, detalle: '  muy bueno  ' });
      expect(opinion.detalle).toBe('muy bueno');
    });

    it('debería rechazar cliente vacio', () => {
      expect(() => new Opinion({ ...datosValidos, cliente: '' })).toThrow();
    });

    it('debería rechazar gig vacio', () => {
      expect(() => new Opinion({ ...datosValidos, gig: '' })).toThrow();
    });

    it('debería rechazar pedido vacio', () => {
      expect(() => new Opinion({ ...datosValidos, pedido: '' })).toThrow();
    });
  });

  describe('toJSON', () => {
    it('debería exponer todos los campos publicos', () => {
      const opinion = new Opinion(datosValidos);
      opinion.id = 'rev-1';
      const json = opinion.toJSON();

      expect(json).toEqual({
        id: 'rev-1',
        cliente: 'cliente1',
        gig: 'gig1',
        pedido: 'pedido1',
        puntuacion: 5,
        detalle: 'Excelente trabajo',
        fechaCreacion: opinion.fechaCreacion,
      });
    });
  });
});
