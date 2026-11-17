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

async function seedGigAndOrder(app, cliente, freelancer, total = 100) {
  const catRes = await request(app).post('/categorias').send({ nombre: 'Test', descripcion: 'Test' });
  const gigRes = await request(app).post('/gigs').send({
    nombre: 'Gig test',
    descripcion: 'Desc',
    categoria: catRes.body.id,
    vendedor: freelancer.id,
    paquetes: [{ nombre: 'Básico', precio: total, diasEntrega: 1, descripcion: 'x' }],
  });
  const pedidoRes = await request(app).post('/pedidos').send({
    cliente: cliente.id,
    gig: gigRes.body.id,
    total,
  });
  return pedidoRes.body;
}

describe('POST /pedidos/:id/cancel - state validation', () => {
  let app;
  const cliente = { id: 'cliente-cancel-states', email: 'cliente@states.com', rol: 'cliente' };
  const freelancer = { id: 'freelancer-cancel-states', email: 'freelancer@states.com', rol: 'freelancer' };

  beforeEach(async () => {
    app = createTestApp();
  });

  it('should reject cancellation for ENTREGADO orders with 400', async () => {
    const pedido = await seedGigAndOrder(app, cliente, freelancer);
    await request(app).put(`/pedidos/${pedido.id}`).send({ estado: 'Entregado' });

    const res = await request(app)
      .post(`/pedidos/${pedido.id}/cancel`)
      .set('Authorization', `Bearer ${generateToken(cliente)}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('no puede cancelarse');
  });

  it('should not modify order status when cancellation is rejected', async () => {
    const pedido = await seedGigAndOrder(app, cliente, freelancer);
    await request(app).put(`/pedidos/${pedido.id}`).send({ estado: 'Entregado' });

    await request(app)
      .post(`/pedidos/${pedido.id}/cancel`)
      .set('Authorization', `Bearer ${generateToken(cliente)}`);

    const getRes = await request(app).get(`/pedidos/${pedido.id}`);
    expect(getRes.body.estado).toBe('Entregado');
  });
});
