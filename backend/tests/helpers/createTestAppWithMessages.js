import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { GigRepository } from '../../src/repositories/GigRepository.js';
import { CategoriaRepository } from '../../src/repositories/CategoriaRepository.js';
import { PedidoRepository } from '../../src/repositories/PedidoRepository.js';
import { MensajeRepository } from '../../src/repositories/MensajeRepository.js';
import { GigService } from '../../src/services/GigService.js';
import { CategoriaService } from '../../src/services/CategoriaService.js';
import { PedidoService } from '../../src/services/PedidoService.js';
import { MensajeService } from '../../src/services/MensajeService.js';
import { GigController } from '../../src/controllers/GigController.js';
import { CategoriaController } from '../../src/controllers/CategoriaController.js';
import { PedidoController } from '../../src/controllers/PedidoController.js';
import { MensajeController } from '../../src/controllers/MensajeController.js';
import { authenticate } from '../../src/middleware/auth.js';
import { errorHandler } from '../../src/middleware/errorHandler.js';

export function createTestAppWithMessages() {
  const gigRepository = new GigRepository();
  const categoriaRepository = new CategoriaRepository();
  const pedidoRepository = new PedidoRepository();
  const mensajeRepository = new MensajeRepository();

  const gigService = new GigService(gigRepository);
  const categoriaService = new CategoriaService(categoriaRepository);
  const pedidoService = new PedidoService(pedidoRepository, gigRepository);
  const mensajeService = new MensajeService(mensajeRepository, pedidoService);

  const gigController = new GigController(gigService);
  const categoriaController = new CategoriaController(categoriaService);
  const pedidoController = new PedidoController(pedidoService, gigService);
  const mensajeController = new MensajeController(mensajeService);

  const app = express();
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  app.get('/categorias', (req, res, next) => categoriaController.findAll(req, res, next));
  app.post('/categorias', (req, res, next) => categoriaController.create(req, res, next));

  app.get('/gigs', (req, res, next) => gigController.findAll(req, res, next));
  app.get('/gigs/:id', (req, res, next) => gigController.findById(req, res, next));
  app.post('/gigs', (req, res, next) => gigController.create(req, res, next));
  app.put('/gigs/:id', (req, res, next) => gigController.update(req, res, next));
  app.delete('/gigs/:id', (req, res, next) => gigController.delete(req, res, next));

  app.get('/pedidos/mis-pedidos', authenticate, (req, res, next) =>
    pedidoController.findByCliente(req, res, next)
  );
  app.get('/pedidos/gig/:gigId', authenticate, (req, res, next) =>
    pedidoController.findByGig(req, res, next)
  );
  app.get('/pedidos', (req, res, next) => pedidoController.findAll(req, res, next));
  app.get('/pedidos/:id', (req, res, next) => pedidoController.findById(req, res, next));
  app.post('/pedidos', (req, res, next) => pedidoController.create(req, res, next));
  app.put('/pedidos/:id', (req, res, next) => pedidoController.update(req, res, next));
  app.delete('/pedidos/:id', (req, res, next) => pedidoController.delete(req, res, next));

  app.get('/pedidos/:id/messages', authenticate, (req, res, next) =>
    mensajeController.findByPedido(req, res, next)
  );
  app.post('/pedidos/:id/messages', authenticate, (req, res, next) =>
    mensajeController.createForPedido(req, res, next)
  );

  app.use(errorHandler);

  return app;
}
