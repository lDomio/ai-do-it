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

describe('GET /pedidos/:id/messages - list history', () => {
  let app;
  let pedido;
  const cliente = { id: 'cliente-msg-list-1', email: 'cliente@msg.com', rol: 'cliente' };
  const freelancer = { id: 'freelancer-msg-list-1', email: 'freelancer@msg.com', rol: 'freelancer' };

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

    await request(app)
      .post(`/pedidos/${pedido.id}/messages`)
      .set('Authorization', `Bearer ${generateToken(cliente)}`)
      .send({ content: 'Mensaje del cliente' });

    await request(app)
      .post(`/pedidos/${pedido.id}/messages`)
      .set('Authorization', `Bearer ${generateToken(freelancer)}`)
      .send({ content: 'Respuesta del freelancer' });
  });

  it('should return messages in chronological order with correct attribution', async () => {
    const res = await request(app)
      .get(`/pedidos/${pedido.id}/messages`)
      .set('Authorization', `Bearer ${generateToken(cliente)}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('messages');
    expect(res.body.messages).toHaveLength(2);

    const [first, second] = res.body.messages;
    expect(first.senderType).toBe('CLIENTE');
    expect(first.content).toBe('Mensaje del cliente');
    expect(second.senderType).toBe('FREELANCER');
    expect(second.content).toBe('Respuesta del freelancer');
    expect(new Date(second.createdAt).getTime()).toBeGreaterThanOrEqual(
      new Date(first.createdAt).getTime()
    );
  });

  it('should return empty messages array for an order without messages', async () => {
    const emptyPedidoRes = await request(app).post('/pedidos').send({
      cliente: cliente.id,
      gig: pedido.gig,
      total: 10,
    });
    const emptyPedido = emptyPedidoRes.body;

    const res = await request(app)
      .get(`/pedidos/${emptyPedido.id}/messages`)
      .set('Authorization', `Bearer ${generateToken(cliente)}`);

    expect(res.status).toBe(200);
    expect(res.body.messages).toEqual([]);
    expect(res.body.unreadCount).toBe(0);
  });
});
