import { OpinionService } from '../services/OpinionService.js';
import { NotFoundError, ForbiddenError } from '../errors/index.js';

export class OpinionController {
  #service;

  constructor(service = new OpinionService()) {
    this.#service = service;
  }

  findAll(req, res, next) {
    try {
      const opiniones = this.#service.findAll();
      res.json(opiniones);
    } catch (e) {
      next(e);
    }
  }

  findById(req, res, next) {
    try {
      const opinion = this.#service.findById(req.params.id);
      if (!opinion) {
        throw new NotFoundError('Opinion no encontrada');
      }
      res.json(opinion);
    } catch (error) {
      next(error);
    }
  }

  create(req, res, next) {
    try {
      const datos = req.body;
      if (req.user && req.user.id !== datos.cliente) {
        throw new ForbiddenError('No puedes reseñar en nombre de otro cliente');
      }
      const opinion = this.#service.create(datos);
      res.status(201).json(opinion);
    } catch (error) {
      next(error);
    }
  }

  update(req, res, next) {
    try {
      const opinion = this.#service.update(req.params.id, req.body);
      if (!opinion) {
        throw new NotFoundError('Opinion no encontrada');
      }
      res.json(opinion);
    } catch (error) {
      next(error);
    }
  }

  delete(req, res, next) {
    try {
      const eliminado = this.#service.delete(req.params.id);
      if (!eliminado) {
        throw new NotFoundError('Opinion no encontrada');
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
