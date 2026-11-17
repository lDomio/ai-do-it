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

describe('POST /pedidos/:id/cancel - idempotency', () => {
  let app;
  const cliente = { id: 'cliente-cancel-idem', email: 'cliente@idem.com', rol: 'cliente' };
  const freelancer = { id: 'freelancer-cancel-idem', email: 'freelancer@idem.com', rol: 'freelancer' };

  beforeEach(async () => {
    app = createTestApp();
  });

  it('should return the same cancelled order on duplicate requests', async () => {
    const pedido = await seedGigAndOrder(app, cliente, freelancer, 250);

    const firstRes = await request(app)
      .post(`/pedidos/${pedido.id}/cancel`)
      .set('Authorization', `Bearer ${generateToken(cliente)}`);

    const secondRes = await request(app)
      .post(`/pedidos/${pedido.id}/cancel`)
      .set('Authorization', `Bearer ${generateToken(cliente)}`);

    expect(firstRes.status).toBe(200);
    expect(secondRes.status).toBe(200);
    expect(secondRes.body.canceladoAt).toBe(firstRes.body.canceladoAt);
    expect(secondRes.body.reembolso).toEqual(firstRes.body.reembolso);
  });

  it('should not create a new refund record on duplicate cancellation', async () => {
    const pedido = await seedGigAndOrder(app, cliente, freelancer, 250);

    await request(app)
      .post(`/pedidos/${pedido.id}/cancel`)
      .set('Authorization', `Bearer ${generateToken(cliente)}`);

    const secondRes = await request(app)
      .post(`/pedidos/${pedido.id}/cancel`)
      .set('Authorization', `Bearer ${generateToken(cliente)}`);

    expect(secondRes.body.reembolso).toMatchObject({
      monto: 250,
      estado: 'INICIADO',
    });
  });
});
