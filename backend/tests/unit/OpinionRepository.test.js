import { OpinionRepository } from '../../src/repositories/OpinionRepository.js';

describe('OpinionRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new OpinionRepository();
  });

  const crearOpinion = (sobreescribir = {}) =>
    repository.create({
      cliente: 'cliente-1',
      gig: 'gig-1',
      pedido: 'pedido-1',
      puntuacion: 5,
      detalle: 'Excelente trabajo',
      ...sobreescribir,
    });

  describe('create', () => {
    it('debería asignar un id incremental', () => {
      const primera = crearOpinion();
      const segunda = crearOpinion({ pedido: 'pedido-2' });

      expect(primera.id).toBe('1');
      expect(segunda.id).toBe('2');
    });
  });

  describe('findById', () => {
    it('debería retornar la opinion existente', () => {
      const opinion = crearOpinion();
      expect(repository.findById(opinion.id)).toBe(opinion);
    });

    it('debería retornar null si no existe', () => {
      expect(repository.findById('inexistente')).toBeNull();
    });
  });

  describe('findByPedidoId', () => {
    it('debería retornar la opinion asociada al pedido', () => {
      const opinion = crearOpinion({ pedido: 'pedido-busqueda' });
      expect(repository.findByPedidoId('pedido-busqueda')).toBe(opinion);
    });

    it('debería retornar null si el pedido no tiene opinion', () => {
      expect(repository.findByPedidoId('pedido-sin-opinion')).toBeNull();
    });
  });

  describe('findByGigId', () => {
    it('debería retornar todas las opiniones del gig', () => {
      crearOpinion({ gig: 'gig-busqueda', pedido: 'p1' });
      crearOpinion({ gig: 'gig-busqueda', pedido: 'p2', puntuacion: 3 });
      crearOpinion({ gig: 'otro-gig', pedido: 'p3' });

      const resultado = repository.findByGigId('gig-busqueda');
      expect(resultado).toHaveLength(2);
      expect(resultado.every((o) => o.gig === 'gig-busqueda')).toBe(true);
    });

    it('debería retornar un array vacio si el gig no tiene opiniones', () => {
      expect(repository.findByGigId('gig-sin-opiniones')).toEqual([]);
    });
  });

  describe('findByClienteId', () => {
    it('debería retornar las opiniones de un cliente', () => {
      crearOpinion({ cliente: 'cliente-busqueda', pedido: 'p1' });
      crearOpinion({ cliente: 'cliente-busqueda', pedido: 'p2' });
      crearOpinion({ cliente: 'otro-cliente', pedido: 'p3' });

      const resultado = repository.findByClienteId('cliente-busqueda');
      expect(resultado).toHaveLength(2);
    });
  });
});
