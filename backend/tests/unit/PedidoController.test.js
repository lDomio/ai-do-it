import { jest } from '@jest/globals';
import { PedidoController } from '../../src/controllers/PedidoController.js';
import { Pedido } from '../../src/domain/Pedido.js';
import { EstadoPedido } from '../../src/enums/EstadoPedido.js';
import { ValidationError, ForbiddenError, NotFoundError } from '../../src/errors/index.js';

describe('PedidoController.cancel', () => {
  const crearServiceMock = (pedido) => ({
    cancelOrder: jest.fn().mockReturnValue(pedido),
  });

  it('debería retornar 200 con el pedido cancelado', () => {
    const pedido = new Pedido({ cliente: 'cliente-1', gig: 'gig-1' });
    pedido.id = 'pedido-1';
    pedido.cancelar('cliente-1', 'cliente');

    const service = crearServiceMock(pedido);
    const controller = new PedidoController(service);
    const req = { user: { id: 'cliente-1', rol: 'cliente' }, params: { id: 'pedido-1' } };
    const res = { json: jest.fn() };
    const next = jest.fn();

    controller.cancel(req, res, next);

    expect(service.cancelOrder).toHaveBeenCalledWith('pedido-1', 'cliente-1', 'cliente');
    expect(res.json).toHaveBeenCalledWith(pedido);
    expect(next).not.toHaveBeenCalled();
  });

  it('debería delegar ValidationError al error handler', () => {
    const service = {
      cancelOrder: jest.fn().mockImplementation(() => {
        throw new ValidationError('El pedido ya está cancelado');
      }),
    };
    const controller = new PedidoController(service);
    const req = { user: { id: 'cliente-1', rol: 'cliente' }, params: { id: 'pedido-1' } };
    const res = { json: jest.fn() };
    const next = jest.fn();

    controller.cancel(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    expect(res.json).not.toHaveBeenCalled();
  });

  it('debería delegar ForbiddenError al error handler', () => {
    const service = {
      cancelOrder: jest.fn().mockImplementation(() => {
        throw new ForbiddenError('No tienes permiso para cancelar este pedido');
      }),
    };
    const controller = new PedidoController(service);
    const req = { user: { id: 'cliente-2', rol: 'cliente' }, params: { id: 'pedido-1' } };
    const res = { json: jest.fn() };
    const next = jest.fn();

    controller.cancel(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    expect(res.json).not.toHaveBeenCalled();
  });

  it('debería delegar NotFoundError al error handler', () => {
    const service = {
      cancelOrder: jest.fn().mockImplementation(() => {
        throw new NotFoundError('Pedido no encontrado');
      }),
    };
    const controller = new PedidoController(service);
    const req = { user: { id: 'cliente-1', rol: 'cliente' }, params: { id: 'inexistente' } };
    const res = { json: jest.fn() };
    const next = jest.fn();

    controller.cancel(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
    expect(res.json).not.toHaveBeenCalled();
  });
});
