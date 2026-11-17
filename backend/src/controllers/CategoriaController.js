import { CategoriaService } from '../services/CategoriaService.js';
import { NotFoundError } from '../errors/index.js';

export class CategoriaController {
  #service;

  constructor(service = new CategoriaService()) {
    this.#service = service;
  }

  findAll(req, res, next) {
    try {
      const categorias = this.#service.findAll();
      res.json(categorias);
    } catch (e) {
      next(e);
    }
  }

  findById(req, res, next) {
    try {
      const categoria = this.#service.findById(req.params.id);
      if (!categoria) {
        throw new NotFoundError('Categoria no encontrada');
      }
      res.json(categoria);
    } catch (error) {
      next(error);
    }
  }

  create(req, res) {
    const categoria = this.#service.create(req.body);
    res.status(201).json(categoria);
  }

  update(req, res, next) {
    try {
      const categoria = this.#service.update(req.params.id, req.body);
      if (!categoria) {
        throw new NotFoundError('Categoria no encontrada');
      }
      res.json(categoria);
    } catch (error) {
      next(error);
    }
  }

  delete(req, res, next) {
    try {
      const eliminado = this.#service.delete(req.params.id);
      if (!eliminado) {
        throw new NotFoundError('Categoria no encontrada');
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
