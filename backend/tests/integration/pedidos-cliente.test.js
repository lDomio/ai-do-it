import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createTestApp } from '../helpers/createTestApp.js';

const JWT_SECRET = 'ai-do-it-secret-key';

function generateToken(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

describe('GET /pedidos/mis-pedidos', () => {
  let app;
  const cliente = { id: 'cliente-test-1', email: 'cliente@test.com', rol: 'cliente' };
  const otroCliente = { id: 'cliente-test-2', email: 'otro@test.com', rol: 'cliente' };
  const token = generateToken(cliente);
  const tokenOtro = generateToken(otroCliente);

  beforeAll(async () => {
    app = createTestApp();

    // Crear pedidos para el cliente
    for (let i = 1; i <= 15; i++) {
      await request(app)
        .post('/pedidos')
        .send({ cliente: cliente.id, gig: `gig-${i}`, total: i * 100 });
    }

    // Crear pedidos para otro cliente (no deben aparecer)
    for (let i = 1; i <= 5; i++) {
      await request(app)
        .post('/pedidos')
        .send({ cliente: otroCliente.id, gig: `gig-otro-${i}`, total: i * 200 });
    }
  });

  describe('autenticación', () => {
    it('debería retornar 401 sin token', async () => {
      const res = await request(app).get('/pedidos/mis-pedidos');
      expect(res.status).toBe(401);
    });

    it('debería retornar 401 con token inválido', async () => {
      const res = await request(app)
        .get('/pedidos/mis-pedidos')
        .set('Authorization', 'Bearer token-invalido');
      expect(res.status).toBe(401);
    });
  });

  describe('paginación', () => {
    it('debería retornar primera página con 10 pedidos', async () => {
      const res = await request(app)
        .get('/pedidos/mis-pedidos')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(10);
      expect(res.body.totalItems).toBe(15);
      expect(res.body.totalPages).toBe(2);
      expect(res.body.currentPage).toBe(1);
    });

    it('debería retornar segunda página con 5 pedidos', async () => {
      const res = await request(app)
        .get('/pedidos/mis-pedidos?page=2')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(5);
      expect(res.body.currentPage).toBe(2);
    });

    it('debería retornar página vacía si page supera totalPages', async () => {
      const res = await request(app)
        .get('/pedidos/mis-pedidos?page=100')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(0);
    });

    it('debería usar página 1 por defecto', async () => {
      const res = await request(app)
        .get('/pedidos/mis-pedidos')
        .set('Authorization', `Bearer ${token}`);

      expect(res.body.currentPage).toBe(1);
    });
  });

  describe('aislamiento de datos', () => {
    it('debería retornar solo pedidos del cliente autenticado', async () => {
      const res = await request(app)
        .get('/pedidos/mis-pedidos')
        .set('Authorization', `Bearer ${token}`);

      const todosDelCliente = res.body.items.every(
        (p) => p.cliente === cliente.id
      );
      expect(todosDelCliente).toBe(true);
    });

    it('no debería incluir pedidos de otro cliente', async () => {
      const res = await request(app)
        .get('/pedidos/mis-pedidos')
        .set('Authorization', `Bearer ${token}`);

      const contieneOtros = res.body.items.some(
        (p) => p.cliente === otroCliente.id
      );
      expect(contieneOtros).toBe(false);
    });

    it('otro cliente debería ver solo sus pedidos', async () => {
      const res = await request(app)
        .get('/pedidos/mis-pedidos')
        .set('Authorization', `Bearer ${tokenOtro}`);

      expect(res.body.totalItems).toBe(5);
      const todosDelOtro = res.body.items.every(
        (p) => p.cliente === otroCliente.id
      );
      expect(todosDelOtro).toBe(true);
    });
  });

  describe('estimación de entrega', () => {
    it('debería incluir diasEntregaRestantes para pedidos confirmados', async () => {
      // Crear un pedido y confirmarlo
      const createRes = await request(app)
        .post('/pedidos')
        .send({ cliente: cliente.id, gig: 'gig-confirmado', total: 500 });

      const pedidoId = createRes.body.id;

      await request(app)
        .put(`/pedidos/${pedidoId}`)
        .send({ estado: 'Confirmado' });

      // Usar un pageSize grande para traer todos los pedidos en una sola página
      const res = await request(app)
        .get('/pedidos/mis-pedidos?pageSize=100')
        .set('Authorization', `Bearer ${token}`);

      const pedidoConfirmado = res.body.items.find((p) => p.id === pedidoId);
      expect(pedidoConfirmado).toBeDefined();
      expect(pedidoConfirmado.diasEntregaRestantes).toBeDefined();
      expect(typeof pedidoConfirmado.diasEntregaRestantes).toBe('number');
    });
  });
});
