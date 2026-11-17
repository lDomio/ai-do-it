import { MensajeService } from '../services/MensajeService.js';
import { NotFoundError } from '../errors/index.js';

export class MensajeController {
  #service;

  constructor(service = new MensajeService()) {
    this.#service = service;
  }

  findAll(req, res, next) {
    try {
      const mensajes = this.#service.findAll();
      res.json(mensajes);
    } catch (e) {
      next(e);
    }
  }

  findById(req, res, next) {
    try {
      const mensaje = this.#service.findById(req.params.id);
      if (!mensaje) {
        throw new NotFoundError('Mensaje no encontrado');
      }
      res.json(mensaje);
    } catch (error) {
      next(error);
    }
  }

  findByPedido(req, res, next) {
    try {
      const resultado = this.#service.listMessagesForPedido(req.params.id, req.user);
      res.json(resultado);
    } catch (error) {
      next(error);
    }
  }

  create(req, res) {
    const mensaje = this.#service.create(req.body);
    res.status(201).json(mensaje);
  }

  createForPedido(req, res, next) {
    try {
      const mensaje = this.#service.sendMessage(req.params.id, req.user, req.body.content);
      res.status(201).json(mensaje);
    } catch (error) {
      next(error);
    }
  }

  update(req, res, next) {
    try {
      const mensaje = this.#service.update(req.params.id, req.body);
      if (!mensaje) {
        throw new NotFoundError('Mensaje no encontrado');
      }
      res.json(mensaje);
    } catch (error) {
      next(error);
    }
  }

  delete(req, res, next) {
    try {
      const eliminado = this.#service.delete(req.params.id);
      if (!eliminado) {
        throw new NotFoundError('Mensaje no encontrado');
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
