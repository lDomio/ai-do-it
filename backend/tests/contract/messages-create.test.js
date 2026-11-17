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

describe('POST /pedidos/:id/messages - send message', () => {
  let app;
  let gig;
  let pedido;
  const cliente = { id: 'cliente-msg-1', email: 'cliente@msg.com', rol: 'cliente' };
  const freelancer = { id: 'freelancer-msg-1', email: 'freelancer@msg.com', rol: 'freelancer' };

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
    gig = gigRes.body;

    const pedidoRes = await request(app).post('/pedidos').send({
      cliente: cliente.id,
      gig: gig.id,
      total: 10,
    });
    pedido = pedidoRes.body;
  });

  it('should create a message as client and return 201 with correct contract shape', async () => {
    const res = await request(app)
      .post(`/pedidos/${pedido.id}/messages`)
      .set('Authorization', `Bearer ${generateToken(cliente)}`)
      .send({ content: 'Hola freelancer' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: expect.any(String),
      pedidoId: pedido.id,
      senderId: cliente.id,
      senderType: 'CLIENTE',
      content: 'Hola freelancer',
      status: 'ENVIADO',
      createdAt: expect.any(String),
    });
  });

  it('should create a message as freelancer and return 201 with senderType FREELANCER', async () => {
    const res = await request(app)
      .post(`/pedidos/${pedido.id}/messages`)
      .set('Authorization', `Bearer ${generateToken(freelancer)}`)
      .send({ content: 'Hola cliente' });

    expect(res.status).toBe(201);
    expect(res.body.senderType).toBe('FREELANCER');
  });
});
