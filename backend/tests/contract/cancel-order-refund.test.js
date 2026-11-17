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

async function seedGigAndOrder(app, cliente, freelancer, total) {
  const catRes = await request(app).post('/categorias').send({ nombre: 'Test', descripcion: 'Test' });
  const gigRes = await request(app).post('/gigs').send({
    nombre: 'Gig test',
    descripcion: 'Desc',
    categoria: catRes.body.id,
    vendedor: freelancer.id,
    paquetes: [{ nombre: 'Básico', precio: total || 0, diasEntrega: 1, descripcion: 'x' }],
  });
  const pedidoRes = await request(app).post('/pedidos').send({
    cliente: cliente.id,
    gig: gigRes.body.id,
    total,
  });
  return pedidoRes.body;
}

describe('POST /pedidos/:id/cancel - refund', () => {
  let app;
  const cliente = { id: 'cliente-cancel-refund', email: 'cliente@refund.com', rol: 'cliente' };
  const freelancer = { id: 'freelancer-cancel-refund', email: 'freelancer@refund.com', rol: 'freelancer' };

  beforeEach(async () => {
    app = createTestApp();
  });

  it('should initiate a full refund for a paid order', async () => {
    const pedido = await seedGigAndOrder(app, cliente, freelancer, 500);

    const res = await request(app)
      .post(`/pedidos/${pedido.id}/cancel`)
      .set('Authorization', `Bearer ${generateToken(cliente)}`);

    expect(res.status).toBe(200);
    expect(res.body.reembolso).toMatchObject({
      monto: 500,
      estado: 'INICIADO',
      fechaInicio: expect.any(String),
    });
  });

  it('should not create a refund record for a zero-price order', async () => {
    const pedido = await seedGigAndOrder(app, cliente, freelancer, 0);

    const res = await request(app)
      .post(`/pedidos/${pedido.id}/cancel`)
      .set('Authorization', `Bearer ${generateToken(cliente)}`);

    expect(res.status).toBe(200);
    expect(res.body.reembolso).toBeNull();
  });
});
