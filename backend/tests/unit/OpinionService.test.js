import { OpinionService } from '../../src/services/OpinionService.js';
import { OpinionRepository } from '../../src/repositories/OpinionRepository.js';
import { PedidoService } from '../../src/services/PedidoService.js';
import { PedidoRepository } from '../../src/repositories/PedidoRepository.js';
import { GigRepository } from '../../src/repositories/GigRepository.js';
import { EstadoPedido } from '../../src/enums/EstadoPedido.js';

describe('OpinionService', () => {
  let opinionRepository;
  let pedidoRepository;
  let pedidoService;
  let opinionService;

  beforeEach(() => {
    opinionRepository = new OpinionRepository();
    pedidoRepository = new PedidoRepository();
    const gigRepository = new GigRepository();
    pedidoService = new PedidoService(pedidoRepository, gigRepository);
    opinionService = new OpinionService(opinionRepository, pedidoService);
  });

  const crearPedidoEntregado = (cliente = 'cliente-1', gig = 'gig-1') => {
    const pedido = pedidoRepository.create({ cliente, gig, total: 100 });
    pedido.actualizarEstado(EstadoPedido.ENTREGADO);
    return pedido;
  };

  describe('create', () => {
    it('debería crear una opinion para un pedido entregado', () => {
      const pedido = crearPedidoEntregado();

      const opinion = opinionService.create({
        cliente: 'cliente-1',
        gig: 'gig-1',
        pedido: pedido.id,
        puntuacion: 5,
        detalle: 'Excelente trabajo',
      });

      expect(opinion.puntuacion).toBe(5);
      expect(opinion.detalle).toBe('Excelente trabajo');
      expect(opinion.pedido).toBe(pedido.id);
    });

    it('debería rechazar crear opinion si el pedido no existe', () => {
      expect(() =>
        opinionService.create({
          cliente: 'cliente-1',
          gig: 'gig-1',
          pedido: 'pedido-inexistente',
          puntuacion: 5,
          detalle: 'Excelente trabajo',
        })
      ).toThrow('Pedido no encontrado');
    });

    it('debería rechazar crear opinion si el pedido no esta entregado', () => {
      const pedido = pedidoRepository.create({ cliente: 'cliente-1', gig: 'gig-1', total: 100 });

      expect(() =>
        opinionService.create({
          cliente: 'cliente-1',
          gig: 'gig-1',
          pedido: pedido.id,
          puntuacion: 5,
          detalle: 'Excelente trabajo',
        })
      ).toThrow(/entregado/i);
    });

    it('debería rechazar crear opinion si el cliente no es el comprador', () => {
      const pedido = crearPedidoEntregado('cliente-1');

      expect(() =>
        opinionService.create({
          cliente: 'otro-cliente',
          gig: 'gig-1',
          pedido: pedido.id,
          puntuacion: 5,
          detalle: 'Excelente trabajo',
        })
      ).toThrow(/permiso/i);
    });

    it('debería rechazar crear una segunda opinion para el mismo pedido', () => {
      const pedido = crearPedidoEntregado();

      opinionService.create({
        cliente: 'cliente-1',
        gig: 'gig-1',
        pedido: pedido.id,
        puntuacion: 5,
        detalle: 'Excelente trabajo',
      });

      expect(() =>
        opinionService.create({
          cliente: 'cliente-1',
          gig: 'gig-1',
          pedido: pedido.id,
          puntuacion: 4,
          detalle: 'Segunda opinion',
        })
      ).toThrow(/ya tiene una reseña/i);
    });

    it('debería rechazar puntuacion invalida', () => {
      const pedido = crearPedidoEntregado();

      expect(() =>
        opinionService.create({
          cliente: 'cliente-1',
          gig: 'gig-1',
          pedido: pedido.id,
          puntuacion: 6,
          detalle: 'Excelente trabajo',
        })
      ).toThrow();
    });

    it('debería rechazar detalle vacio', () => {
      const pedido = crearPedidoEntregado();

      expect(() =>
        opinionService.create({
          cliente: 'cliente-1',
          gig: 'gig-1',
          pedido: pedido.id,
          puntuacion: 5,
          detalle: '   ',
        })
      ).toThrow();
    });
  });

  describe('calcularRating', () => {
    it('debería calcular el promedio de puntuaciones de un gig', () => {
      const pedido1 = crearPedidoEntregado('cliente-1', 'gig-rating');
      const pedido2 = crearPedidoEntregado('cliente-2', 'gig-rating');

      opinionService.create({
        cliente: 'cliente-1',
        gig: 'gig-rating',
        pedido: pedido1.id,
        puntuacion: 5,
        detalle: 'Muy bueno',
      });
      opinionService.create({
        cliente: 'cliente-2',
        gig: 'gig-rating',
        pedido: pedido2.id,
        puntuacion: 3,
        detalle: 'Regular',
      });

      const resumen = opinionService.calcularRating('gig-rating');
      expect(resumen.rating).toBe(4);
      expect(resumen.reviewCount).toBe(2);
    });

    it('debería retornar rating 0 cuando el gig no tiene opiniones', () => {
      const resumen = opinionService.calcularRating('gig-sin-opiniones');
      expect(resumen.rating).toBe(0);
      expect(resumen.reviewCount).toBe(0);
    });
  });

  describe('findByGigId', () => {
    it('debería retornar las opiniones de un gig ordenadas por fecha descendente', () => {
      const pedido1 = crearPedidoEntregado('cliente-1', 'gig-listado');
      const pedido2 = crearPedidoEntregado('cliente-2', 'gig-listado');

      const opinion1 = opinionService.create({
        cliente: 'cliente-1',
        gig: 'gig-listado',
        pedido: pedido1.id,
        puntuacion: 5,
        detalle: 'Primera',
      });
      const opinion2 = opinionService.create({
        cliente: 'cliente-2',
        gig: 'gig-listado',
        pedido: pedido2.id,
        puntuacion: 4,
        detalle: 'Segunda',
      });

      const resultado = opinionService.findByGigId('gig-listado');
      expect(resultado).toHaveLength(2);
      expect(resultado[0].id).toBe(opinion2.id);
      expect(resultado[1].id).toBe(opinion1.id);
    });
  });
});
