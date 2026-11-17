import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createTestAppWithMessages } from '../helpers/createTestAppWithMessages.js';

const JWT_SECRET = 'ai-do-it-secret-key';

function generateToken(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

describe('POST /pedidos/:id/messages - authorization', () => {
  let app;
  let pedido;
  const cliente = { id: 'cliente-msg-3', email: 'cliente@msg.com', rol: 'cliente' };
  const freelancer = { id: 'freelancer-msg-3', email: 'freelancer@msg.com', rol: 'freelancer' };
  const otherUser = { id: 'otro-msg-3', email: 'otro@msg.com', rol: 'cliente' };

  beforeEach(async () => {
    app = createTestAppWithMessages();

    const catRes = await request(app)
      .post('/categorias')
      .send({ nombre: 'Test', descripcion: 'Test' });

    const gigRes = await request(app).post('/gigs').send({
      nombre: 'Gig test',
      descripcion: 'Desc',
      categoria: catRes.body.id,
      vendedor: freelancer.id,
      paquetes: [{ nombre: 'Básico', precio: 10, diasEntrega: 1, descripcion: 'x' }],
    });

    const pedidoRes = await request(app).post('/pedidos').send({
      cliente: cliente.id,
      gig: gigRes.body.id,
      total: 10,
    });
    pedido = pedidoRes.body;
  });

  it('should return 401 without token', async () => {
    const res = await request(app)
      .post(`/pedidos/${pedido.id}/messages`)
      .send({ content: 'Hola' });

    expect(res.status).toBe(401);
  });

  it('should return 403 when user is not a party to the order', async () => {
    const res = await request(app)
      .post(`/pedidos/${pedido.id}/messages`)
      .set('Authorization', `Bearer ${generateToken(otherUser)}`)
      .send({ content: 'Hola' });

    expect(res.status).toBe(403);
  });

  it('should return 404 when order does not exist', async () => {
    const res = await request(app)
      .post('/pedidos/nonexistent/messages')
      .set('Authorization', `Bearer ${generateToken(cliente)}`)
      .send({ content: 'Hola' });

    expect(res.status).toBe(404);
  });
});
