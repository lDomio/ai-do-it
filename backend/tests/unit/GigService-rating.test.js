import { GigService } from '../../src/services/GigService.js';
import { GigRepository } from '../../src/repositories/GigRepository.js';
import { OpinionService } from '../../src/services/OpinionService.js';
import { OpinionRepository } from '../../src/repositories/OpinionRepository.js';
import { PedidoService } from '../../src/services/PedidoService.js';
import { PedidoRepository } from '../../src/repositories/PedidoRepository.js';
import { EstadoPedido } from '../../src/enums/EstadoPedido.js';

describe('GigService - rating derivado', () => {
  let gigRepository;
  let pedidoService;
  let gigService;
  let opinionService;

  beforeEach(() => {
    gigRepository = new GigRepository();
    const opinionRepository = new OpinionRepository();
    const pedidoRepository = new PedidoRepository();
    pedidoService = new PedidoService(pedidoRepository, gigRepository);
    opinionService = new OpinionService(opinionRepository, pedidoService);
    gigService = new GigService(gigRepository, opinionService);
  });

  const crearGig = (vendedor = 'vendedor-1') =>
    gigRepository.create({
      vendedor,
      nombre: 'Gig de prueba',
      descripcion: 'Descripcion de prueba',
      paquetes: [
        { nombre: 'BASICO', precio: 1000, diasEntrega: 1, descripcion: 'Paquete basico' },
      ],
    });

  const crearPedidoEntregado = (cliente, gigId) => {
    const pedido = pedidoService.create({ cliente, gig: gigId, total: 100 });
    pedido.actualizarEstado(EstadoPedido.ENTREGADO);
    return pedido;
  };

  describe('findById', () => {
    it('debería incluir rating y reviewCount derivados cuando tiene opiniones', () => {
      const gig = crearGig();
      const pedido1 = crearPedidoEntregado('cliente-1', gig.id);
      const pedido2 = crearPedidoEntregado('cliente-2', gig.id);

      opinionService.create({
        cliente: 'cliente-1',
        gig: gig.id,
        pedido: pedido1.id,
        puntuacion: 5,
        detalle: 'Muy bueno',
      });
      opinionService.create({
        cliente: 'cliente-2',
        gig: gig.id,
        pedido: pedido2.id,
        puntuacion: 3,
        detalle: 'Regular',
      });

      const resultado = gigService.findById(gig.id);
      expect(resultado.rating).toBe(4);
      expect(resultado.reviewCount).toBe(2);
    });

    it('debería incluir rating 0 y reviewCount 0 cuando no tiene opiniones', () => {
      const gig = crearGig();
      const resultado = gigService.findById(gig.id);
      expect(resultado.rating).toBe(0);
      expect(resultado.reviewCount).toBe(0);
    });

    it('debería retornar null si el gig no existe', () => {
      expect(gigService.findById('inexistente')).toBeNull();
    });
  });

  describe('searchGigs', () => {
    it('debería incluir rating y reviewCount en los resultados', () => {
      const gig = crearGig();
      const pedido = crearPedidoEntregado('cliente-1', gig.id);
      opinionService.create({
        cliente: 'cliente-1',
        gig: gig.id,
        pedido: pedido.id,
        puntuacion: 5,
        detalle: 'Perfecto',
      });

      const resultado = gigService.searchGigs({ page: 1, pageSize: 10 });
      const item = resultado.items.find((i) => i.id === gig.id);
      expect(item.rating).toBe(5);
      expect(item.reviewCount).toBe(1);
    });
  });
});
