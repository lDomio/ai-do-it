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

describe('POST /pedidos/:id/messages - validation', () => {
  let app;
  let pedido;
  const cliente = { id: 'cliente-msg-2', email: 'cliente@msg.com', rol: 'cliente' };
  const freelancer = { id: 'freelancer-msg-2', email: 'freelancer@msg.com', rol: 'freelancer' };

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

  it('should return 400 when content is empty', async () => {
    const res = await request(app)
      .post(`/pedidos/${pedido.id}/messages`)
      .set('Authorization', `Bearer ${generateToken(cliente)}`)
      .send({ content: '' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/vac[ií]o/i);
  });

  it('should return 400 when content is only whitespace', async () => {
    const res = await request(app)
      .post(`/pedidos/${pedido.id}/messages`)
      .set('Authorization', `Bearer ${generateToken(cliente)}`)
      .send({ content: '   \n\t  ' });

    expect(res.status).toBe(400);
  });

  it('should return 400 when content exceeds 2000 characters', async () => {
    const res = await request(app)
      .post(`/pedidos/${pedido.id}/messages`)
      .set('Authorization', `Bearer ${generateToken(cliente)}`)
      .send({ content: 'a'.repeat(2001) });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/2000/i);
  });
});
