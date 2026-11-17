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

describe('POST /opiniones', () => {
  let app;
  const cliente = { id: 'cliente-opinion', email: 'cliente@opinion.com', rol: 'Cliente' };
  const otroCliente = { id: 'otro-cliente', email: 'otro@opinion.com', rol: 'Cliente' };

  beforeEach(() => {
    app = createTestApp();
  });

  async function crearPedidoEntregado(clienteId = cliente.id) {
    const createRes = await request(app)
      .post('/pedidos')
      .send({ cliente: clienteId, gig: 'gig-opinion', total: 100 });

    const pedidoId = createRes.body.id;
    await request(app).put(`/pedidos/${pedidoId}`).send({ estado: 'Entregado' });
    return pedidoId;
  }

  it('debería crear una opinion para un pedido entregado', async () => {
    const pedidoId = await crearPedidoEntregado();
    const token = generateToken(cliente);

    const res = await request(app)
      .post('/opiniones')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cliente: cliente.id,
        gig: 'gig-opinion',
        pedido: pedidoId,
        puntuacion: 5,
        detalle: 'Excelente trabajo',
      });

    expect(res.status).toBe(201);
    expect(res.body.puntuacion).toBe(5);
    expect(res.body.detalle).toBe('Excelente trabajo');
    expect(res.body.pedido).toBe(pedidoId);
    expect(res.body.fechaCreacion).toBeTruthy();
  });

  it('debería rechazar crear opinion sin autenticacion', async () => {
    const pedidoId = await crearPedidoEntregado();

    const res = await request(app).post('/opiniones').send({
      cliente: cliente.id,
      gig: 'gig-opinion',
      pedido: pedidoId,
      puntuacion: 5,
      detalle: 'Excelente trabajo',
    });

    expect(res.status).toBe(401);
  });

  it('debería rechazar crear opinion si el pedido no esta entregado', async () => {
    const createRes = await request(app)
      .post('/pedidos')
      .send({ cliente: cliente.id, gig: 'gig-opinion', total: 100 });

    const pedidoId = createRes.body.id;
    const token = generateToken(cliente);

    const res = await request(app)
      .post('/opiniones')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cliente: cliente.id,
        gig: 'gig-opinion',
        pedido: pedidoId,
        puntuacion: 5,
        detalle: 'Excelente trabajo',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/entregado/i);
  });

  it('debería rechazar crear opinion por otro cliente', async () => {
    const pedidoId = await crearPedidoEntregado();
    const token = generateToken(otroCliente);

    const res = await request(app)
      .post('/opiniones')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cliente: otroCliente.id,
        gig: 'gig-opinion',
        pedido: pedidoId,
        puntuacion: 5,
        detalle: 'Intento de opinion ajena',
      });

    expect(res.status).toBe(403);
  });

  it('debería rechazar crear una segunda opinion para el mismo pedido', async () => {
    const pedidoId = await crearPedidoEntregado();
    const token = generateToken(cliente);

    await request(app)
      .post('/opiniones')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cliente: cliente.id,
        gig: 'gig-opinion',
        pedido: pedidoId,
        puntuacion: 5,
        detalle: 'Primera opinion',
      });

    const res = await request(app)
      .post('/opiniones')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cliente: cliente.id,
        gig: 'gig-opinion',
        pedido: pedidoId,
        puntuacion: 4,
        detalle: 'Segunda opinion',
      });

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/ya tiene una reseña/i);
  });

  it('debería rechazar puntuacion fuera de rango', async () => {
    const pedidoId = await crearPedidoEntregado();
    const token = generateToken(cliente);

    const res = await request(app)
      .post('/opiniones')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cliente: cliente.id,
        gig: 'gig-opinion',
        pedido: pedidoId,
        puntuacion: 6,
        detalle: 'Puntuacion invalida',
      });

    expect(res.status).toBe(400);
  });

  it('debería rechazar detalle vacio', async () => {
    const pedidoId = await crearPedidoEntregado();
    const token = generateToken(cliente);

    const res = await request(app)
      .post('/opiniones')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cliente: cliente.id,
        gig: 'gig-opinion',
        pedido: pedidoId,
        puntuacion: 5,
        detalle: '   ',
      });

    expect(res.status).toBe(400);
  });

  it('debería retornar 404 si el pedido no existe', async () => {
    const token = generateToken(cliente);

    const res = await request(app)
      .post('/opiniones')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cliente: cliente.id,
        gig: 'gig-opinion',
        pedido: 'pedido-inexistente',
        puntuacion: 5,
        detalle: 'Pedido inexistente',
      });

    expect(res.status).toBe(404);
  });
});
