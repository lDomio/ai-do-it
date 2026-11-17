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

describe('GET /pedidos/gig/:gigId', () => {
  let app;
  const freelancer = { id: 'freelancer-test-1', email: 'freelancer@test.com', rol: 'freelancer' };
  const otroFreelancer = { id: 'freelancer-test-2', email: 'otro-freelancer@test.com', rol: 'freelancer' };
  const cliente = { id: 'cliente-test-1', email: 'cliente@test.com', rol: 'cliente' };
  const token = generateToken(freelancer);
  const tokenOtro = generateToken(otroFreelancer);
  const tokenCliente = generateToken(cliente);

  let gigPropio;
  let gigOtro;

  beforeAll(async () => {
    app = createTestApp();

    // Crear gigs para el freelancer
    const resGig1 = await request(app)
      .post('/gigs')
      .send({
        vendedor: freelancer.id,
        nombre: 'Gig propio 1',
        descripcion: 'Descripción del gig 1',
        paquetes: [{ nombre: 'Básico', precio: 100, diasEntrega: 3, descripcion: 'Paquete básico' }],
      });
    gigPropio = resGig1.body;

    const resGig2 = await request(app)
      .post('/gigs')
      .send({
        vendedor: freelancer.id,
        nombre: 'Gig propio 2',
        descripcion: 'Descripción del gig 2',
        paquetes: [{ nombre: 'Básico', precio: 150, diasEntrega: 5, descripcion: 'Paquete básico' }],
      });
    const gigPropio2 = resGig2.body;

    // Crear gig para otro freelancer
    const resGigOtro = await request(app)
      .post('/gigs')
      .send({
        vendedor: otroFreelancer.id,
        nombre: 'Gig de otro',
        descripcion: 'Descripción del gig de otro',
        paquetes: [{ nombre: 'Básico', precio: 200, diasEntrega: 7, descripcion: 'Paquete básico' }],
      });
    gigOtro = resGigOtro.body;

    // Crear pedidos para el gig propio
    for (let i = 1; i <= 12; i++) {
      await request(app)
        .post('/pedidos')
        .send({ cliente: cliente.id, gig: gigPropio.id, total: i * 100 });
    }

    // Crear pedidos para el gig propio 2
    for (let i = 1; i <= 3; i++) {
      await request(app)
        .post('/pedidos')
        .send({ cliente: cliente.id, gig: gigPropio2.id, total: i * 150 });
    }

    // Crear pedidos para el gig de otro freelancer
    for (let i = 1; i <= 5; i++) {
      await request(app)
        .post('/pedidos')
        .send({ cliente: cliente.id, gig: gigOtro.id, total: i * 200 });
    }
  });

  describe('autenticación', () => {
    it('debería retornar 401 sin token', async () => {
      const res = await request(app).get(`/pedidos/gig/${gigPropio.id}`);
      expect(res.status).toBe(401);
    });

    it('debería retornar 403 con token de cliente', async () => {
      const res = await request(app)
        .get(`/pedidos/gig/${gigPropio.id}`)
        .set('Authorization', `Bearer ${tokenCliente}`);
      expect(res.status).toBe(403);
    });
  });

  describe('validación de pertenencia del gig', () => {
    it('debería retornar 404 si el gig no existe', async () => {
      const res = await request(app)
        .get('/pedidos/gig/gig-inexistente')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Gig no encontrado');
    });

    it('debería retornar 403 si el gig pertenece a otro freelancer', async () => {
      const res = await request(app)
        .get(`/pedidos/gig/${gigOtro.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.error).toContain('No tienes permiso');
    });

    it('debería permitir acceso si el gig pertenece al freelancer autenticado', async () => {
      const res = await request(app)
        .get(`/pedidos/gig/${gigPropio.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });
  });

  describe('paginación', () => {
    it('debería retornar primera página con 10 pedidos', async () => {
      const res = await request(app)
        .get(`/pedidos/gig/${gigPropio.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(10);
      expect(res.body.totalItems).toBe(12);
      expect(res.body.totalPages).toBe(2);
      expect(res.body.currentPage).toBe(1);
    });

    it('debería retornar segunda página con 2 pedidos', async () => {
      const res = await request(app)
        .get(`/pedidos/gig/${gigPropio.id}?page=2`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(2);
      expect(res.body.currentPage).toBe(2);
    });

    it('debería retornar página vacía si page supera totalPages', async () => {
      const res = await request(app)
        .get(`/pedidos/gig/${gigPropio.id}?page=100`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(0);
    });
  });

  describe('aislamiento de datos', () => {
    it('debería retornar solo pedidos del gig solicitado', async () => {
      const res = await request(app)
        .get(`/pedidos/gig/${gigPropio.id}`)
        .set('Authorization', `Bearer ${token}`);

      const todosDelGig = res.body.items.every(
        (p) => p.gig === gigPropio.id
      );
      expect(todosDelGig).toBe(true);
    });

    it('no debería incluir pedidos de otros gigs', async () => {
      const res = await request(app)
        .get(`/pedidos/gig/${gigPropio.id}`)
        .set('Authorization', `Bearer ${token}`);

      const contieneOtros = res.body.items.some(
        (p) => p.gig !== gigPropio.id
      );
      expect(contieneOtros).toBe(false);
    });
  });

  describe('estimación de entrega', () => {
    it('debería incluir diasEntregaRestantes para pedidos confirmados', async () => {
      // Crear un pedido y confirmarlo
      const createRes = await request(app)
        .post('/pedidos')
        .send({ cliente: cliente.id, gig: gigPropio.id, total: 500 });

      const pedidoId = createRes.body.id;

      await request(app)
        .put(`/pedidos/${pedidoId}`)
        .send({ estado: 'Confirmado' });

      // Usar un pageSize grande para traer todos los pedidos en una sola página
      const res = await request(app)
        .get(`/pedidos/gig/${gigPropio.id}?pageSize=100`)
        .set('Authorization', `Bearer ${token}`);

      const pedidoConfirmado = res.body.items.find((p) => p.id === pedidoId);
      expect(pedidoConfirmado).toBeDefined();
      expect(pedidoConfirmado.diasEntregaRestantes).toBeDefined();
      expect(typeof pedidoConfirmado.diasEntregaRestantes).toBe('number');
    });
  });
});
