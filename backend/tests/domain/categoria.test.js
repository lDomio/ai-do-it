import { Categoria } from '../../src/domain/Categoria.js';

describe('Categoria', () => {
  describe('constructor', () => {
    it('debería crear una instancia con nombre y descripción', () => {
      const categoria = new Categoria();
      categoria.nombre = 'Diseño';
      categoria.descripcion = 'Servicios de diseño';

      expect(categoria.nombre).toBe('Diseño');
      expect(categoria.descripcion).toBe('Servicios de diseño');
    });
  });
});
