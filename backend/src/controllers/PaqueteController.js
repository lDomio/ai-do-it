import { PaqueteService } from '../services/PaqueteService.js';
import { NotFoundError } from '../errors/index.js';

export class PaqueteController {
  #service;

  constructor(service = new PaqueteService()) {
    this.#service = service;
  }

  findAll(req, res, next) {
    try {
      const paquetes = this.#service.findAll();
      res.json(paquetes);
    } catch (e) {
      next(e);
    }
  }

  findById(req, res, next) {
    try {
      const paquete = this.#service.findById(req.params.id);
      if (!paquete) {
        throw new NotFoundError('Paquete no encontrado');
      }
      res.json(paquete);
    } catch (error) {
      next(error);
    }
  }

  create(req, res) {
    const paquete = this.#service.create(req.body);
    res.status(201).json(paquete);
  }

  update(req, res, next) {
    try {
      const paquete = this.#service.update(req.params.id, req.body);
      if (!paquete) {
        throw new NotFoundError('Paquete no encontrado');
      }
      res.json(paquete);
    } catch (error) {
      next(error);
    }
  }

  delete(req, res, next) {
    try {
      const eliminado = this.#service.delete(req.params.id);
      if (!eliminado) {
        throw new NotFoundError('Paquete no encontrado');
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
