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

async function seedGigAndOrder(app, cliente, freelancer) {
  const catRes = await request(app).post('/categorias').send({ nombre: 'Test', descripcion: 'Test' });
  const gigRes = await request(app).post('/gigs').send({
    nombre: 'Gig test',
    descripcion: 'Desc',
    categoria: catRes.body.id,
    vendedor: freelancer.id,
    paquetes: [{ nombre: 'Básico', precio: 100, diasEntrega: 1, descripcion: 'x' }],
  });
  const pedidoRes = await request(app).post('/pedidos').send({
    cliente: cliente.id,
    gig: gigRes.body.id,
    total: 100,
  });
  return pedidoRes.body;
}

describe('POST /pedidos/:id/cancel - cancel order', () => {
  let app;
  const cliente = { id: 'cliente-cancel-1', email: 'cliente@cancel.com', rol: 'cliente' };
  const freelancer = { id: 'freelancer-cancel-1', email: 'freelancer@cancel.com', rol: 'freelancer' };

  beforeEach(async () => {
    app = createTestApp();
  });

  it('should cancel a PENDIENTE order as client and return 200 with correct contract shape', async () => {
    const pedido = await seedGigAndOrder(app, cliente, freelancer);

    const res = await request(app)
      .post(`/pedidos/${pedido.id}/cancel`)
      .set('Authorization', `Bearer ${generateToken(cliente)}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: pedido.id,
      cliente: cliente.id,
      estado: 'Cancelado',
      total: 100,
      canceladoAt: expect.any(String),
      canceladoPor: cliente.id,
      reembolso: {
        monto: 100,
        estado: 'INICIADO',
        fechaInicio: expect.any(String),
      },
    });
  });

  it('should cancel a CONFIRMADO order as client and return 200', async () => {
    const pedido = await seedGigAndOrder(app, cliente, freelancer);
    await request(app).put(`/pedidos/${pedido.id}`).send({ estado: 'Confirmado' });

    const res = await request(app)
      .post(`/pedidos/${pedido.id}/cancel`)
      .set('Authorization', `Bearer ${generateToken(cliente)}`);

    expect(res.status).toBe(200);
    expect(res.body.estado).toBe('Cancelado');
  });

  it('should cancel an EN_REVISION order as client and return 200', async () => {
    const pedido = await seedGigAndOrder(app, cliente, freelancer);
    await request(app).put(`/pedidos/${pedido.id}`).send({ estado: 'En revisión' });

    const res = await request(app)
      .post(`/pedidos/${pedido.id}/cancel`)
      .set('Authorization', `Bearer ${generateToken(cliente)}`);

    expect(res.status).toBe(200);
    expect(res.body.estado).toBe('Cancelado');
  });

  it('should return the same order without re-processing when already cancelled', async () => {
    const pedido = await seedGigAndOrder(app, cliente, freelancer);
    const firstRes = await request(app)
      .post(`/pedidos/${pedido.id}/cancel`)
      .set('Authorization', `Bearer ${generateToken(cliente)}`);

    const secondRes = await request(app)
      .post(`/pedidos/${pedido.id}/cancel`)
      .set('Authorization', `Bearer ${generateToken(cliente)}`);

    expect(secondRes.status).toBe(200);
    expect(secondRes.body.canceladoAt).toBe(firstRes.body.canceladoAt);
    expect(secondRes.body.reembolso).toEqual(firstRes.body.reembolso);
  });
});
