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

async function seedGig(app, freelancer) {
  const catRes = await request(app).post('/categorias').send({ nombre: 'Test', descripcion: 'Test' });
  const gigRes = await request(app).post('/gigs').send({
    nombre: 'Gig test',
    descripcion: 'Desc',
    categoria: catRes.body.id,
    vendedor: freelancer.id,
    paquetes: [{ nombre: 'Básico', precio: 100, diasEntrega: 1, descripcion: 'x' }],
  });
  return gigRes.body;
}

describe('POST /pedidos/reservar - place order', () => {
  let app;
  const cliente = { id: 'cliente-place-1', email: 'cliente@place.com', rol: 'cliente' };
  const freelancer = { id: 'freelancer-place-1', email: 'freelancer@place.com', rol: 'freelancer' };

  beforeEach(async () => {
    app = createTestApp();
  });

  it('should create an order with selected package and requirements', async () => {
    const gig = await seedGig(app, freelancer);
    const paquete = gig.paquetes[0];

    const res = await request(app)
      .post('/pedidos/reservar')
      .set('Authorization', `Bearer ${generateToken(cliente)}`)
      .send({
        gigId: gig.id,
        paqueteId: paquete.id,
        requerimientos: 'Necesito un logo minimalista en blanco y negro para CleanTech.',
      });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      cliente: cliente.id,
      gig: gig.id,
      paqueteId: paquete.id,
      requerimientos: 'Necesito un logo minimalista en blanco y negro para CleanTech.',
      total: 100,
      estado: 'Pendiente',
    });
  });

  it('should reject missing package selection', async () => {
    const gig = await seedGig(app, freelancer);

    const res = await request(app)
      .post('/pedidos/reservar')
      .set('Authorization', `Bearer ${generateToken(cliente)}`)
      .send({
        gigId: gig.id,
        paqueteId: null,
        requerimientos: 'Necesito un logo minimalista en blanco y negro para CleanTech.',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('should reject requirements shorter than minimum length', async () => {
    const gig = await seedGig(app, freelancer);
    const paquete = gig.paquetes[0];

    const res = await request(app)
      .post('/pedidos/reservar')
      .set('Authorization', `Bearer ${generateToken(cliente)}`)
      .send({
        gigId: gig.id,
        paqueteId: paquete.id,
        requerimientos: 'corto',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('should reject requests without authentication', async () => {
    const gig = await seedGig(app, freelancer);
    const paquete = gig.paquetes[0];

    const res = await request(app).post('/pedidos/reservar').send({
      gigId: gig.id,
      paqueteId: paquete.id,
      requerimientos: 'Necesito un logo minimalista en blanco y negro para CleanTech.',
    });

    expect(res.status).toBe(401);
  });

  it('should return 404 when package does not belong to the gig', async () => {
    const gig = await seedGig(app, freelancer);

    const res = await request(app)
      .post('/pedidos/reservar')
      .set('Authorization', `Bearer ${generateToken(cliente)}`)
      .send({
        gigId: gig.id,
        paqueteId: 'paquete-inexistente',
        requerimientos: 'Necesito un logo minimalista en blanco y negro para CleanTech.',
      });

    expect(res.status).toBe(404);
  });

  it('should reject duplicate submissions with the same idempotency key', async () => {
    const gig = await seedGig(app, freelancer);
    const paquete = gig.paquetes[0];
    const requerimientos = 'Necesito un logo minimalista en blanco y negro para CleanTech.';
    const idempotencyKey = 'idempotency-place-1';

    const first = await request(app)
      .post('/pedidos/reservar')
      .set('Authorization', `Bearer ${generateToken(cliente)}`)
      .set('Idempotency-Key', idempotencyKey)
      .send({ gigId: gig.id, paqueteId: paquete.id, requerimientos });

    expect(first.status).toBe(201);

    const second = await request(app)
      .post('/pedidos/reservar')
      .set('Authorization', `Bearer ${generateToken(cliente)}`)
      .set('Idempotency-Key', idempotencyKey)
      .send({ gigId: gig.id, paqueteId: paquete.id, requerimientos });

    expect(second.status).toBe(409);
  });
});
