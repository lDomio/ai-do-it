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

describe('Flujo de reseñas: pedido entregado → gig con opinion visible', () => {
  let app;
  const cliente = { id: 'cliente-integracion', email: 'cliente@integracion.com', rol: 'Cliente' };

  beforeEach(() => {
    app = createTestApp();
  });

  it('debería reflejar una nueva opinion en el gig y en el listado de reseñas', async () => {
    // Crear un Gig
    const gigRes = await request(app).post('/gigs').send({
      vendedor: 'vendedor-1',
      nombre: 'Gig integral',
      descripcion: 'Descripcion integral',
      paquetes: [
        { nombre: 'BASICO', precio: 1000, diasEntrega: 1, descripcion: 'Basico' },
      ],
    });
    const gigId = gigRes.body.id;

    // Crear pedido y entregarlo
    const pedidoRes = await request(app).post('/pedidos').send({
      cliente: cliente.id,
      gig: gigId,
      total: 100,
    });
    const pedidoId = pedidoRes.body.id;
    await request(app).put(`/pedidos/${pedidoId}`).send({ estado: 'Entregado' });

    // Verificar que el gig no tiene rating aun
    const gigInicial = await request(app).get(`/gigs/${gigId}`);
    expect(gigInicial.body.rating).toBe(0);
    expect(gigInicial.body.reviewCount).toBe(0);

    // Crear opinion
    const token = generateToken(cliente);
    const opinionRes = await request(app)
      .post('/opiniones')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cliente: cliente.id,
        gig: gigId,
        pedido: pedidoId,
        puntuacion: 4,
        detalle: 'Muy buen servicio',
      });
    expect(opinionRes.status).toBe(201);

    // Verificar que el gig ahora muestra rating y reviewCount
    const gigActualizado = await request(app).get(`/gigs/${gigId}`);
    expect(gigActualizado.body.rating).toBe(4);
    expect(gigActualizado.body.reviewCount).toBe(1);

    // Verificar que el listado de reseñas contiene la opinion
    const reviewsRes = await request(app).get(`/gigs/${gigId}/reviews`);
    expect(reviewsRes.status).toBe(200);
    expect(reviewsRes.body.rating).toBe(4);
    expect(reviewsRes.body.reviewCount).toBe(1);
    expect(reviewsRes.body.reviews).toHaveLength(1);
    expect(reviewsRes.body.reviews[0].detalle).toBe('Muy buen servicio');
  });
});
