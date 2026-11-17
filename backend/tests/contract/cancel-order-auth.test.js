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

describe('POST /pedidos/:id/cancel - authorization', () => {
  let app;
  const cliente = { id: 'cliente-cancel-auth', email: 'cliente@auth.com', rol: 'cliente' };
  const freelancer = { id: 'freelancer-cancel-auth', email: 'freelancer@auth.com', rol: 'freelancer' };
  const otherUser = { id: 'otro-cancel-auth', email: 'otro@auth.com', rol: 'cliente' };

  beforeEach(async () => {
    app = createTestApp();
  });

  it('should return 401 without token', async () => {
    const pedido = await seedGigAndOrder(app, cliente, freelancer);
    const res = await request(app).post(`/pedidos/${pedido.id}/cancel`);
    expect(res.status).toBe(401);
  });

  it('should return 403 when user is not the order client', async () => {
    const pedido = await seedGigAndOrder(app, cliente, freelancer);
    const res = await request(app)
      .post(`/pedidos/${pedido.id}/cancel`)
      .set('Authorization', `Bearer ${generateToken(otherUser)}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toContain('permiso');
  });

  it('should return 403 when freelancer tries to cancel', async () => {
    const pedido = await seedGigAndOrder(app, cliente, freelancer);
    const res = await request(app)
      .post(`/pedidos/${pedido.id}/cancel`)
      .set('Authorization', `Bearer ${generateToken(freelancer)}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toContain('permiso');
  });

  it('should return 404 when order does not exist', async () => {
    const res = await request(app)
      .post('/pedidos/nonexistent/cancel')
      .set('Authorization', `Bearer ${generateToken(cliente)}`);

    expect(res.status).toBe(404);
  });
});
