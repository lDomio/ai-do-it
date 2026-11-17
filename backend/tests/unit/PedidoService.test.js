import { jest } from '@jest/globals';
import { EventEmitter } from 'events';
import { PedidoService } from '../../src/services/PedidoService.js';
import { PedidoRepository } from '../../src/repositories/PedidoRepository.js';
import { GigRepository } from '../../src/repositories/GigRepository.js';
import { EstadoPedido } from '../../src/enums/EstadoPedido.js';
import {
  ValidationError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from '../../src/errors/index.js';
import { ORDER_RULES } from '../../src/config/orderRules.js';

describe('PedidoService.cancelOrder', () => {
  let repository;
  let service;
  let events;

  beforeEach(() => {
    repository = new PedidoRepository();
    events = new EventEmitter();
    service = new PedidoService(repository, undefined, events);
  });

  it('debería cancelar un pedido pendiente por su propio cliente', () => {
    const pedido = repository.create({ cliente: 'cliente-1', gig: 'gig-1', total: 100 });

    const listener = jest.fn();
    events.on('OrderCancelled', listener);

    const result = service.cancelOrder(pedido.id, 'cliente-1', 'cliente');

    expect(result.estado).toBe(EstadoPedido.CANCELADO);
    expect(result.canceladoPor).toBe('cliente-1');
    expect(result.canceladoPorRol).toBe('cliente');
    expect(result.canceladoAt).toBeTruthy();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        pedidoId: pedido.id,
        clienteId: 'cliente-1',
        canceladoPor: 'cliente-1',
        canceladoPorRol: 'cliente',
      })
    );
  });

  it('debería cancelar un pedido confirmado por un administrador', () => {
    const pedido = repository.create({
      cliente: 'cliente-1',
      gig: 'gig-1',
      total: 100,
      estado: EstadoPedido.CONFIRMADO,
    });

    const listener = jest.fn();
    events.on('OrderCancelled', listener);

    const result = service.cancelOrder(pedido.id, 'admin-1', 'admin');

    expect(result.estado).toBe(EstadoPedido.CANCELADO);
    expect(result.canceladoPor).toBe('admin-1');
    expect(result.canceladoPorRol).toBe('admin');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('debería rechazar la cancelación de un pedido entregado', () => {
    const pedido = repository.create({
      cliente: 'cliente-1',
      gig: 'gig-1',
      total: 100,
      estado: EstadoPedido.ENTREGADO,
    });

    expect(() => service.cancelOrder(pedido.id, 'cliente-1', 'cliente')).toThrow(ValidationError);
  });

  it('debería retornar el pedido sin modificar si ya está cancelado', () => {
    const pedido = repository.create({
      cliente: 'cliente-1',
      gig: 'gig-1',
      total: 100,
      estado: EstadoPedido.CANCELADO,
    });

    const listener = jest.fn();
    events.on('OrderCancelled', listener);

    const result = service.cancelOrder(pedido.id, 'cliente-1', 'cliente');

    expect(result.estado).toBe(EstadoPedido.CANCELADO);
    expect(result.canceladoAt).toBe(pedido.canceladoAt);
    expect(listener).not.toHaveBeenCalled();
  });

  it('debería rechazar la cancelación por un usuario que no es el cliente ni admin', () => {
    const pedido = repository.create({ cliente: 'cliente-1', gig: 'gig-1', total: 100 });

    expect(() => service.cancelOrder(pedido.id, 'cliente-2', 'cliente')).toThrow(ForbiddenError);
  });

  it('debería retornar NotFoundError si el pedido no existe', () => {
    expect(() => service.cancelOrder('inexistente', 'cliente-1', 'cliente')).toThrow(NotFoundError);
  });

  it('debería rechazar la cancelación de un pedido entregado aunque sea admin', () => {
    const pedido = repository.create({
      cliente: 'cliente-1',
      gig: 'gig-1',
      total: 100,
      estado: EstadoPedido.ENTREGADO,
    });

    expect(() => service.cancelOrder(pedido.id, 'admin-1', 'admin')).toThrow(ValidationError);
  });
});

describe('PedidoService.placeOrder', () => {
  let pedidoRepository;
  let gigRepository;
  let service;

  function crearGigConPaquete() {
    return gigRepository.create({
      nombre: 'Gig test',
      descripcion: 'Descripción',
      categoria: 'cat-1',
      vendedor: 'freelancer-1',
      paquetes: [{ nombre: 'Básico', precio: 100, diasEntrega: 3, descripcion: 'Incluye x' }],
    });
  }

  beforeEach(() => {
    pedidoRepository = new PedidoRepository();
    gigRepository = new GigRepository();
    service = new PedidoService(pedidoRepository, gigRepository);
  });

  it('debería crear un pedido con paquete seleccionado y requerimientos válidos', () => {
    const gig = crearGigConPaquete();
    const paquete = gig.paquetes[0];
    const requerimientos = 'Necesito un logo minimalista en blanco y negro para CleanTech.';

    const pedido = service.placeOrder('cliente-1', {
      gigId: gig.id,
      paqueteId: paquete.id,
      requerimientos,
    });

    expect(pedido.cliente).toBe('cliente-1');
    expect(pedido.gig).toBe(gig.id);
    expect(pedido.paqueteId).toBe(paquete.id);
    expect(pedido.requerimientos).toBe(requerimientos.trim());
    expect(pedido.total).toBe(100);
    expect(pedido.estado).toBe(EstadoPedido.PENDIENTE);
  });

  it('debería rechazar un pedido sin paquete seleccionado', () => {
    const gig = crearGigConPaquete();

    expect(() =>
      service.placeOrder('cliente-1', {
        gigId: gig.id,
        paqueteId: null,
        requerimientos: 'Necesito un logo minimalista en blanco y negro para CleanTech.',
      })
    ).toThrow(ValidationError);
  });

  it('debería rechazar un pedido con requerimientos demasiado cortos', () => {
    const gig = crearGigConPaquete();
    const paquete = gig.paquetes[0];

    expect(() =>
      service.placeOrder('cliente-1', {
        gigId: gig.id,
        paqueteId: paquete.id,
        requerimientos: 'corto',
      })
    ).toThrow(ValidationError);
  });

  it('debería rechazar un pedido con requerimientos que exceden el máximo', () => {
    const gig = crearGigConPaquete();
    const paquete = gig.paquetes[0];

    expect(() =>
      service.placeOrder('cliente-1', {
        gigId: gig.id,
        paqueteId: paquete.id,
        requerimientos: 'a'.repeat(ORDER_RULES.REQUERIMIENTOS_MAX_LENGTH + 1),
      })
    ).toThrow(ValidationError);
  });

  it('debería rechazar un pedido si el paquete no pertenece al gig', () => {
    const gig = crearGigConPaquete();

    expect(() =>
      service.placeOrder('cliente-1', {
        gigId: gig.id,
        paqueteId: 'paquete-inexistente',
        requerimientos: 'Necesito un logo minimalista en blanco y negro para CleanTech.',
      })
    ).toThrow(NotFoundError);
  });

  it('debería rechazar un pedido si el gig no existe', () => {
    expect(() =>
      service.placeOrder('cliente-1', {
        gigId: 'gig-inexistente',
        paqueteId: 'paquete-1',
        requerimientos: 'Necesito un logo minimalista en blanco y negro para CleanTech.',
      })
    ).toThrow(NotFoundError);
  });

  it('debería rechazar un pedido si el gig no tiene paquetes', () => {
    const gig = gigRepository.create({
      nombre: 'Gig vacío',
      descripcion: 'Sin paquetes',
      categoria: 'cat-1',
      vendedor: 'freelancer-1',
      paquetes: [],
    });

    expect(() =>
      service.placeOrder('cliente-1', {
        gigId: gig.id,
        paqueteId: 'paquete-1',
        requerimientos: 'Necesito un logo minimalista en blanco y negro para CleanTech.',
      })
    ).toThrow(ValidationError);
  });

  it('debería rechazar un pedido duplicado con la misma clave de idempotencia', () => {
    const gig = crearGigConPaquete();
    const paquete = gig.paquetes[0];
    const requerimientos = 'Necesito un logo minimalista en blanco y negro para CleanTech.';
    const idempotencyKey = 'key-unica';

    service.placeOrder('cliente-1', {
      gigId: gig.id,
      paqueteId: paquete.id,
      requerimientos,
      idempotencyKey,
    });

    expect(() =>
      service.placeOrder('cliente-1', {
        gigId: gig.id,
        paqueteId: paquete.id,
        requerimientos,
        idempotencyKey,
      })
    ).toThrow(ConflictError);
  });

  it('debería permitir dos pedidos distintos sin clave de idempotencia', () => {
    const gig = crearGigConPaquete();
    const paquete = gig.paquetes[0];
    const requerimientos = 'Necesito un logo minimalista en blanco y negro para CleanTech.';

    const primero = service.placeOrder('cliente-1', {
      gigId: gig.id,
      paqueteId: paquete.id,
      requerimientos,
    });
    const segundo = service.placeOrder('cliente-1', {
      gigId: gig.id,
      paqueteId: paquete.id,
      requerimientos,
    });

    expect(primero.id).not.toBe(segundo.id);
  });
});
