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

describe('POST /pedidos/:id/cancel', () => {
  let app;
  const cliente = { id: 'cliente-cancel', email: 'cliente@cancel.com', rol: 'Cliente' };
  const otroCliente = { id: 'otro-cliente', email: 'otro@cancel.com', rol: 'Cliente' };
  const admin = { id: 'admin-cancel', email: 'admin@cancel.com', rol: 'Admin' };

  beforeEach(async () => {
    app = createTestApp();
  });

  it('debería permitir al cliente cancelar su pedido pendiente', async () => {
    const createRes = await request(app)
      .post('/pedidos')
      .send({ cliente: cliente.id, gig: 'gig-1', total: 100 });

    const pedidoId = createRes.body.id;
    const token = generateToken(cliente);

    const res = await request(app)
      .post(`/pedidos/${pedidoId}/cancel`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.estado).toBe('Cancelado');
    expect(res.body.canceladoPor).toBe(cliente.id);
    expect(res.body.canceladoPorRol).toBe('Cliente');
    expect(res.body.canceladoAt).toBeTruthy();
  });

  it('debería rechazar la cancelación de un pedido entregado', async () => {
    const createRes = await request(app)
      .post('/pedidos')
      .send({ cliente: cliente.id, gig: 'gig-1', total: 100 });

    const pedidoId = createRes.body.id;
    await request(app).put(`/pedidos/${pedidoId}`).send({ estado: 'Entregado' });

    const token = generateToken(cliente);
    const res = await request(app)
      .post(`/pedidos/${pedidoId}/cancel`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/no puede cancelarse|cancelado/i);
  });

  it('debería rechazar la cancelación por otro cliente', async () => {
    const createRes = await request(app)
      .post('/pedidos')
      .send({ cliente: cliente.id, gig: 'gig-1', total: 100 });

    const pedidoId = createRes.body.id;
    const token = generateToken(otroCliente);

    const res = await request(app)
      .post(`/pedidos/${pedidoId}/cancel`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it('debería permitir a un admin cancelar el pedido de otro cliente', async () => {
    const createRes = await request(app)
      .post('/pedidos')
      .send({ cliente: cliente.id, gig: 'gig-1', total: 100 });

    const pedidoId = createRes.body.id;
    const token = generateToken(admin);

    const res = await request(app)
      .post(`/pedidos/${pedidoId}/cancel`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.estado).toBe('Cancelado');
    expect(res.body.canceladoPor).toBe(admin.id);
    expect(res.body.canceladoPorRol).toBe('Admin');
  });

  it('debería retornar 404 para un pedido inexistente', async () => {
    const token = generateToken(cliente);
    const res = await request(app)
      .post('/pedidos/pedido-inexistente/cancel')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('debería retornar el mismo pedido cancelado si ya estaba cancelado', async () => {
    const createRes = await request(app)
      .post('/pedidos')
      .send({ cliente: cliente.id, gig: 'gig-1', total: 100 });

    const pedidoId = createRes.body.id;
    const token = generateToken(cliente);

    const firstRes = await request(app)
      .post(`/pedidos/${pedidoId}/cancel`)
      .set('Authorization', `Bearer ${token}`);

    const secondRes = await request(app)
      .post(`/pedidos/${pedidoId}/cancel`)
      .set('Authorization', `Bearer ${token}`);

    expect(secondRes.status).toBe(200);
    expect(secondRes.body.estado).toBe('Cancelado');
    expect(secondRes.body.canceladoAt).toBe(firstRes.body.canceladoAt);
  });
});
