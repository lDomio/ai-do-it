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

describe('GET /gigs/:id/reviews', () => {
  let app;
  const cliente = { id: 'cliente-gig-reviews', email: 'cliente@gig.com', rol: 'Cliente' };

  beforeEach(() => {
    app = createTestApp();
  });

  async function crearGigConOpinion() {
    const gigRes = await request(app)
      .post('/gigs')
      .send({
        vendedor: 'vendedor-1',
        nombre: 'Gig con reseñas',
        descripcion: 'Descripcion',
        paquetes: [
          { nombre: 'BASICO', precio: 1000, diasEntrega: 1, descripcion: 'Basico' },
        ],
      });

    const gigId = gigRes.body.id;

    const pedidoRes = await request(app)
      .post('/pedidos')
      .send({ cliente: cliente.id, gig: gigId, total: 100 });

    const pedidoId = pedidoRes.body.id;
    await request(app).put(`/pedidos/${pedidoId}`).send({ estado: 'Entregado' });

    const token = generateToken(cliente);
    await request(app)
      .post('/opiniones')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cliente: cliente.id,
        gig: gigId,
        pedido: pedidoId,
        puntuacion: 5,
        detalle: 'Excelente',
      });

    return gigId;
  }

  it('debería retornar las reseñas y el resumen del gig', async () => {
    const gigId = await crearGigConOpinion();

    const res = await request(app).get(`/gigs/${gigId}/reviews`);

    expect(res.status).toBe(200);
    expect(res.body.gigId).toBe(gigId);
    expect(res.body.rating).toBe(5);
    expect(res.body.reviewCount).toBe(1);
    expect(res.body.reviews).toHaveLength(1);
    expect(res.body.reviews[0].puntuacion).toBe(5);
    expect(res.body.reviews[0].detalle).toBe('Excelente');
  });

  it('debería retornar rating 0 y lista vacia si el gig no tiene reseñas', async () => {
    const gigRes = await request(app)
      .post('/gigs')
      .send({
        vendedor: 'vendedor-1',
        nombre: 'Gig sin reseñas',
        descripcion: 'Descripcion',
        paquetes: [
          { nombre: 'BASICO', precio: 1000, diasEntrega: 1, descripcion: 'Basico' },
        ],
      });

    const gigId = gigRes.body.id;

    const res = await request(app).get(`/gigs/${gigId}/reviews`);

    expect(res.status).toBe(200);
    expect(res.body.rating).toBe(0);
    expect(res.body.reviewCount).toBe(0);
    expect(res.body.reviews).toEqual([]);
  });

  it('debería retornar 404 si el gig no existe', async () => {
    const res = await request(app).get('/gigs/gig-inexistente/reviews');
    expect(res.status).toBe(404);
  });
});
