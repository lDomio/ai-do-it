import { UsuarioService } from '../services/UsuarioService.js';
import { NotFoundError } from '../errors/index.js';

export class UsuarioController {
  #service;

  constructor(service = new UsuarioService()) {
    this.#service = service;
  }

  findAll(req, res, next) {
    try {
      const usuarios = this.#service.findAll();
      res.json(usuarios);
    } catch (e) {
      next(e);
    }
  }

  findById(req, res, next) {
    try {
      const usuario = this.#service.findById(req.params.id);
      if (!usuario) {
        throw new NotFoundError('Usuario no encontrado');
      }
      res.json(usuario);
    } catch (error) {
      next(error);
    }
  }

  create(req, res) {
    const usuario = this.#service.create(req.body);
    res.status(201).json(usuario);
  }

  update(req, res, next) {
    try {
      const usuario = this.#service.update(req.params.id, req.body);
      if (!usuario) {
        throw new NotFoundError('Usuario no encontrado');
      }
      res.json(usuario);
    } catch (error) {
      next(error);
    }
  }

  delete(req, res, next) {
    try {
      const eliminado = this.#service.delete(req.params.id);
      if (!eliminado) {
        throw new NotFoundError('Usuario no encontrado');
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
