import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { GigRepository } from '../../src/repositories/GigRepository.js';
import { CategoriaRepository } from '../../src/repositories/CategoriaRepository.js';
import { PedidoRepository } from '../../src/repositories/PedidoRepository.js';
import { GigService } from '../../src/services/GigService.js';
import { CategoriaService } from '../../src/services/CategoriaService.js';
import { PedidoService } from '../../src/services/PedidoService.js';
import { GigController } from '../../src/controllers/GigController.js';
import { CategoriaController } from '../../src/controllers/CategoriaController.js';
import { PedidoController } from '../../src/controllers/PedidoController.js';
import { OpinionController } from '../../src/controllers/OpinionController.js';
import { authenticate } from '../../src/middleware/auth.js';
import { errorHandler } from '../../src/middleware/errorHandler.js';
import { OpinionRepository } from '../../src/repositories/OpinionRepository.js';
import { OpinionService } from '../../src/services/OpinionService.js';

export function createTestApp() {
  const gigRepository = new GigRepository();
  const categoriaRepository = new CategoriaRepository();
  const pedidoRepository = new PedidoRepository();
  const opinionRepository = new OpinionRepository();

  const pedidoService = new PedidoService(pedidoRepository, gigRepository);
  const opinionService = new OpinionService(opinionRepository, pedidoService);
  const gigService = new GigService(gigRepository, opinionService);
  const categoriaService = new CategoriaService(categoriaRepository);

  const gigController = new GigController(gigService);
  const categoriaController = new CategoriaController(categoriaService);
  const pedidoController = new PedidoController(pedidoService, gigService);
  const opinionController = new OpinionController(opinionService);

  const app = express();
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  app.get('/gigs', (req, res, next) => gigController.findAll(req, res, next));
  app.get('/gigs/:id', (req, res, next) => gigController.findById(req, res, next));
  app.get('/gigs/:id/reviews', (req, res, next) => gigController.getReviews(req, res, next));
  app.post('/gigs', (req, res, next) => gigController.create(req, res, next));
  app.put('/gigs/:id', (req, res, next) => gigController.update(req, res, next));
  app.delete('/gigs/:id', (req, res, next) => gigController.delete(req, res, next));

  app.get('/categorias', (req, res, next) => categoriaController.findAll(req, res, next));
  app.post('/categorias', (req, res, next) => categoriaController.create(req, res, next));

  app.get('/pedidos/mis-pedidos', authenticate, (req, res, next) =>
    pedidoController.findByCliente(req, res, next)
  );
  app.get('/pedidos/gig/:gigId', authenticate, (req, res, next) => pedidoController.findByGig(req, res, next));
  app.get('/pedidos', (req, res, next) => pedidoController.findAll(req, res, next));
  app.get('/pedidos/:id', (req, res, next) => pedidoController.findById(req, res, next));
  app.post('/pedidos', (req, res, next) => pedidoController.create(req, res, next));
  app.put('/pedidos/:id', (req, res, next) => pedidoController.update(req, res, next));
  app.delete('/pedidos/:id', (req, res, next) => pedidoController.delete(req, res, next));
  app.post('/pedidos/:id/cancel', authenticate, (req, res, next) => pedidoController.cancel(req, res, next));
  app.post('/pedidos/reservar', authenticate, (req, res, next) => pedidoController.place(req, res, next));

  app.get('/opiniones', (req, res, next) => opinionController.findAll(req, res, next));
  app.get('/opiniones/:id', (req, res, next) => opinionController.findById(req, res, next));
  app.post('/opiniones', authenticate, (req, res, next) => opinionController.create(req, res, next));
  app.put('/opiniones/:id', (req, res, next) => opinionController.update(req, res, next));
  app.delete('/opiniones/:id', (req, res, next) => opinionController.delete(req, res, next));

  app.use(errorHandler);

  return app;
}
