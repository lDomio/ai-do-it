import request from 'supertest';
import { createTestApp } from '../helpers/createTestApp.js';

describe('POST /gigs — publicación con distintos paquetes', () => {
  let app;
  let catDisenoId;
  let catDesarrolloId;

  beforeAll(async () => {
    app = createTestApp();

    const cat1 = await request(app)
      .post('/categorias')
      .send({ nombre: 'Diseño', descripcion: 'Servicios de diseño gráfico' });
    catDisenoId = cat1.body.id;

    const cat2 = await request(app)
      .post('/categorias')
      .send({ nombre: 'Desarrollo', descripcion: 'Desarrollo web y móvil' });
    catDesarrolloId = cat2.body.id;
  });

  describe('creación de gig con un solo paquete', () => {
    it('debería crear un gig con un único paquete básico', async () => {
      const res = await request(app).post('/gigs').send({
        nombre: 'Diseño de logo',
        descripcion: 'Creo logos profesionales para tu marca',
        categoria: catDisenoId,
        vendedor: 'freelancer-1',
        paquetes: [
          { nombre: 'Básico', precio: 30, diasEntrega: 3, descripcion: '1 propuesta de logo' },
        ],
      });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.paquetes).toHaveLength(1);
      expect(res.body.paquetes[0].nombre).toBe('Básico');
      expect(res.body.paquetes[0].precio).toBe(30);
      expect(res.body.paquetes[0].diasEntrega).toBe(3);
    });
  });

  describe('creación de gig con múltiples paquetes (básico, estándar, premium)', () => {
    it('debería crear un gig con 3 paquetes de distintos niveles', async () => {
      const res = await request(app).post('/gigs').send({
        nombre: 'Desarrollo de landing page',
        descripcion: 'Landing pages responsive y modernas',
        categoria: catDesarrolloId,
        vendedor: 'freelancer-2',
        paquetes: [
          { nombre: 'Básico', precio: 50, diasEntrega: 3, descripcion: 'Landing estática de 1 sección' },
          { nombre: 'Estándar', precio: 100, diasEntrega: 5, descripcion: 'Landing de 3 secciones con formulario' },
          { nombre: 'Premium', precio: 200, diasEntrega: 7, descripcion: 'Landing completa con animaciones y SEO' },
        ],
      });

      expect(res.status).toBe(201);
      expect(res.body.paquetes).toHaveLength(3);

      const precios = res.body.paquetes.map((p) => p.precio);
      expect(precios).toEqual([50, 100, 200]);

      const nombres = res.body.paquetes.map((p) => p.nombre);
      expect(nombres).toEqual(['Básico', 'Estándar', 'Premium']);
    });

    it('debería guardar la descripción de cada paquete correctamente', async () => {
      const res = await request(app).post('/gigs').send({
        nombre: 'Ilustración digital',
        descripcion: 'Ilustraciones personalizadas en estilo cartoon',
        categoria: catDisenoId,
        vendedor: 'freelancer-3',
        paquetes: [
          { nombre: 'Básico', precio: 20, diasEntrega: 2, descripcion: 'Personaje simple' },
          { nombre: 'Premium', precio: 80, diasEntrega: 5, descripcion: 'Escena completa con fondo' },
        ],
      });

      expect(res.status).toBe(201);
      res.body.paquetes.forEach((p) => {
        expect(p.descripcion).toBeTruthy();
        expect(p.descripcion.length).toBeGreaterThan(0);
      });
    });
  });

  describe('paquetes con precios adaptados a distintos presupuestos', () => {
    it('debería permitir un paquete con precio mínimo (0 = gratis)', async () => {
      const res = await request(app).post('/gigs').send({
        nombre: 'Consulta gratuita de diseño',
        descripcion: 'Primera consulta sin costo para evaluar tu proyecto',
        categoria: catDisenoId,
        vendedor: 'freelancer-4',
        paquetes: [
          { nombre: 'Consulta', precio: 0, diasEntrega: 1, descripcion: 'Reunión de 15 minutos' },
        ],
      });

      expect(res.status).toBe(201);
      expect(res.body.paquetes[0].precio).toBe(0);
    });

    it('debería permitir paquetes con precios muy altos', async () => {
      const res = await request(app).post('/gigs').send({
        nombre: 'Desarrollo de plataforma e-commerce',
        descripcion: 'Plataforma completa de comercio electrónico',
        categoria: catDesarrolloId,
        vendedor: 'freelancer-5',
        paquetes: [
          { nombre: 'Básico', precio: 500, diasEntrega: 15, descripcion: 'Tienda básica con 10 productos' },
          { nombre: 'Premium', precio: 2000, diasEntrega: 30, descripcion: 'Tienda completa con pasarela de pago' },
        ],
      });

      expect(res.status).toBe(201);
      expect(res.body.paquetes[1].precio).toBe(2000);
    });
  });

  describe('validación de paquetes', () => {
    it('debería rechazar gig sin paquetes', async () => {
      const res = await request(app).post('/gigs').send({
        nombre: 'Sin paquetes',
        descripcion: 'Gig sin paquetes definidos',
        categoria: catDisenoId,
        vendedor: 'freelancer-6',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it('debería rechazar gig con paquete sin nombre', async () => {
      const res = await request(app).post('/gigs').send({
        nombre: 'Gig con paquete inválido',
        descripcion: 'Paquete sin nombre',
        categoria: catDisenoId,
        vendedor: 'freelancer-7',
        paquetes: [
          { precio: 25, diasEntrega: 3, descripcion: 'Sin nombre' },
        ],
      });

      expect(res.status).toBe(400);
    });

    it('debería rechazar gig con paquete sin descripción', async () => {
      const res = await request(app).post('/gigs').send({
        nombre: 'Gig con paquete incompleto',
        descripcion: 'Paquete sin descripción',
        categoria: catDisenoId,
        vendedor: 'freelancer-8',
        paquetes: [
          { nombre: 'Básico', precio: 25, diasEntrega: 3 },
        ],
      });

      expect(res.status).toBe(400);
    });

    it('debería rechazar paquete con precio negativo', async () => {
      const res = await request(app).post('/gigs').send({
        nombre: 'Gig con precio inválido',
        descripcion: 'Precio negativo no permitido',
        categoria: catDisenoId,
        vendedor: 'freelancer-9',
        paquetes: [
          { nombre: 'Básico', precio: -10, diasEntrega: 3, descripcion: 'Precio inválido' },
        ],
      });

      expect(res.status).toBe(400);
    });

    it('debería rechazar paquete con días de entrega negativos', async () => {
      const res = await request(app).post('/gigs').send({
        nombre: 'Gig con días inválidos',
        descripcion: 'Días negativos no permitidos',
        categoria: catDisenoId,
        vendedor: 'freelancer-10',
        paquetes: [
          { nombre: 'Básico', precio: 25, diasEntrega: -1, descripcion: 'Días inválidos' },
        ],
      });

      expect(res.status).toBe(400);
    });

    it('debería rechazar gig con más de 3 paquetes', async () => {
      const res = await request(app).post('/gigs').send({
        nombre: 'Gig con demasiados paquetes',
        descripcion: 'Exceso de paquetes',
        categoria: catDisenoId,
        vendedor: 'freelancer-11',
        paquetes: [
          { nombre: 'P1', precio: 10, diasEntrega: 1, descripcion: 'Paquete 1' },
          { nombre: 'P2', precio: 20, diasEntrega: 2, descripcion: 'Paquete 2' },
          { nombre: 'P3', precio: 30, diasEntrega: 3, descripcion: 'Paquete 3' },
          { nombre: 'P4', precio: 40, diasEntrega: 4, descripcion: 'Paquete 4' },
        ],
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('3 paquetes');
    });
  });

  describe('consulta de gigs con paquetes', () => {
    it('debería retornar los paquetes al consultar un gig por ID', async () => {
      const createRes = await request(app).post('/gigs').send({
        nombre: 'Servicio con paquetes visibles',
        descripcion: 'Verificar que los paquetes se retornan correctamente',
        categoria: catDisenoId,
        vendedor: 'freelancer-12',
        paquetes: [
          { nombre: 'Básico', precio: 40, diasEntrega: 2, descripcion: 'Entrega rápida' },
          { nombre: 'Premium', precio: 100, diasEntrega: 5, descripcion: 'Entrega detallada' },
        ],
      });

      const gigId = createRes.body.id;
      const res = await request(app).get(`/gigs/${gigId}`);

      expect(res.status).toBe(200);
      expect(res.body.paquetes).toHaveLength(2);
      expect(res.body.paquetes[0].nombre).toBe('Básico');
      expect(res.body.paquetes[0].precio).toBe(40);
      expect(res.body.paquetes[1].nombre).toBe('Premium');
      expect(res.body.paquetes[1].precio).toBe(100);
    });

    it('debería incluir el precio de cada paquete en el listado', async () => {
      const res = await request(app).get('/gigs?pageSize=50');

      expect(res.status).toBe(200);
      res.body.gigs.forEach((gig) => {
        expect(Array.isArray(gig.paquetes)).toBe(true);
        gig.paquetes.forEach((p) => {
          expect(typeof p.precio).toBe('number');
          expect(typeof p.diasEntrega).toBe('number');
        });
      });
    });
  });

  describe('flujo completo: crear gig → pedidos con distintos paquetes', () => {
    let gigId;

    beforeAll(async () => {
      const createRes = await request(app).post('/gigs').send({
        nombre: 'Diseño de identidad visual',
        descripcion: 'Branding completo para tu empresa',
        categoria: catDisenoId,
        vendedor: 'freelancer-13',
        paquetes: [
          { nombre: 'Básico', precio: 60, diasEntrega: 3, descripcion: 'Logo + paleta de colores' },
          { nombre: 'Estándar', precio: 120, diasEntrega: 5, descripcion: 'Logo + manual de marca' },
          { nombre: 'Premium', precio: 250, diasEntrega: 7, descripcion: 'Branding completo con papelería' },
        ],
      });

      gigId = createRes.body.id;
    });

    it('debería permitir crear un pedido con el paquete básico', async () => {
      const res = await request(app).post('/pedidos').send({
        gig: gigId,
        cliente: 'cliente-1',
        total: 60,
      });

      expect(res.status).toBe(201);
      expect(res.body.gig).toBe(gigId);
      expect(res.body.total).toBe(60);
    });

    it('debería permitir crear un pedido con el paquete premium', async () => {
      const res = await request(app).post('/pedidos').send({
        gig: gigId,
        cliente: 'cliente-2',
        total: 250,
      });

      expect(res.status).toBe(201);
      expect(res.body.gig).toBe(gigId);
      expect(res.body.total).toBe(250);
    });

    it('debería permitir crear pedidos simultáneos con distintos paquetes', async () => {
      const resBasico = await request(app).post('/pedidos').send({
        gig: gigId,
        cliente: 'cliente-3',
        total: 60,
      });

      const resPremium = await request(app).post('/pedidos').send({
        gig: gigId,
        cliente: 'cliente-4',
        total: 250,
      });

      expect(resBasico.status).toBe(201);
      expect(resPremium.status).toBe(201);
      expect(resBasico.body.total).toBe(60);
      expect(resPremium.body.total).toBe(250);
    });
  });

  describe('diversidad de categorías con paquetes', () => {
    it('debería crear gigs en distintas categorías con paquetes diferenciados', async () => {
      const gigDiseno = await request(app).post('/gigs').send({
        nombre: 'Animación 2D',
        descripcion: 'Animaciones para redes sociales',
        categoria: catDisenoId,
        vendedor: 'freelancer-14',
        paquetes: [
          { nombre: 'Corto', precio: 30, diasEntrega: 2, descripcion: 'Animación de 5 segundos' },
          { nombre: 'Largo', precio: 80, diasEntrega: 5, descripcion: 'Animación de 30 segundos' },
        ],
      });

      const gigDesarrollo = await request(app).post('/gigs').send({
        nombre: 'Desarrollo de chatbot',
        descripcion: 'Chatbots inteligentes para atención al cliente',
        categoria: catDesarrolloId,
        vendedor: 'freelancer-15',
        paquetes: [
          { nombre: 'Básico', precio: 100, diasEntrega: 5, descripcion: 'Chatbot con 10 respuestas' },
          { nombre: 'Avanzado', precio: 300, diasEntrega: 10, descripcion: 'Chatbot con IA y aprendizaje' },
        ],
      });

      expect(gigDiseno.status).toBe(201);
      expect(gigDesarrollo.status).toBe(201);
      expect(gigDiseno.body.categoria).toBe(catDisenoId);
      expect(gigDesarrollo.body.categoria).toBe(catDesarrolloId);
    });
  });
});
