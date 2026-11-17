import { PedidoService } from '../services/PedidoService.js';
import { GigService } from '../services/GigService.js';
import { Pedido } from '../domain/Pedido.js';
import { NotFoundError, ForbiddenError } from '../errors/index.js';

export class PedidoController {
  #pedidoService;
  #gigService;

  constructor(pedidoService = new PedidoService(), gigService = new GigService()) {
    this.#pedidoService = pedidoService;
    this.#gigService = gigService;
  }

  #agregarEstimacion(pedidos) {
    return pedidos.map((p) => {
      const data = JSON.parse(JSON.stringify(p));
      const pedido = new Pedido(data);
      const estimacion = pedido.calcularDiasEntregaRestantes();
      if (estimacion !== null) {
        return { ...data, diasEntregaRestantes: estimacion };
      }
      return data;
    });
  }

  findAll(req, res, next) {
    try {
      const pedidos = this.#pedidoService.findAll();
      res.json(pedidos);
    } catch (e) {
      next(e);
    }
  }

  findByCliente(req, res, next) {
    try {
      const clienteId = req.user.id;
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const pageSize = Math.max(1, parseInt(req.query.pageSize, 10) || 10);

      const resultado = this.#pedidoService.findByCliente(clienteId, page, pageSize);
      const items = this.#agregarEstimacion(resultado.items);

      res.json({ ...resultado, items });
    } catch (e) {
      next(e);
    }
  }

  findByGig(req, res, next) {
    try {
      const { gigId } = req.params;
      const freelancerId = req.user.id;
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const pageSize = Math.max(1, parseInt(req.query.pageSize, 10) || 10);

      const gig = this.#gigService.findById(gigId);
      if (!gig) {
        throw new NotFoundError('Gig no encontrado');
      }
      if (gig.vendedor !== freelancerId) {
        throw new ForbiddenError('No tienes permiso para acceder a los pedidos de este Gig');
      }

      const resultado = this.#pedidoService.findByGig(gigId, page, pageSize);
      const items = this.#agregarEstimacion(resultado.items);

      res.json({ ...resultado, items });
    } catch (error) {
      next(error);
    }
  }

  findById(req, res, next) {
    try {
      const pedido = this.#pedidoService.findById(req.params.id);
      if (!pedido) {
        throw new NotFoundError('Pedido no encontrado');
      }
      res.json(pedido);
    } catch (error) {
      next(error);
    }
  }

  create(req, res) {
    const pedido = this.#pedidoService.create(req.body);
    res.status(201).json(pedido);
  }

  place(req, res, next) {
    try {
      const clienteId = req.user.id;
      const idempotencyKey = req.headers['idempotency-key'] || null;
      const pedido = this.#pedidoService.placeOrder(clienteId, {
        ...req.body,
        idempotencyKey,
      });
      res.status(201).json(pedido);
    } catch (error) {
      next(error);
    }
  }

  update(req, res, next) {
    try {
      const pedido = this.#pedidoService.update(req.params.id, req.body);
      if (!pedido) {
        throw new NotFoundError('Pedido no encontrado');
      }
      res.json(pedido);
    } catch (error) {
      next(error);
    }
  }

  delete(req, res, next) {
    try {
      const eliminado = this.#pedidoService.delete(req.params.id);
      if (!eliminado) {
        throw new NotFoundError('Pedido no encontrado');
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  cancel(req, res, next) {
    try {
      const actorId = req.user.id;
      const actorRol = req.user.rol;
      const { id } = req.params;
      const pedido = this.#pedidoService.cancelOrder(id, actorId, actorRol);
      res.json(pedido);
    } catch (error) {
      next(error);
    }
  }
}
