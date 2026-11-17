import request from 'supertest';
import { createTestApp } from '../helpers/createTestApp.js';

describe('GET /gigs — búsqueda, filtros, ordenamiento y paginación', () => {
  let app;
  let catDisenoId;
  let catDesarrolloId;

  beforeAll(async () => {
    app = createTestApp();

    // Crear categorías
    const cat1 = await request(app)
      .post('/categorias')
      .send({ nombre: 'Diseño', descripcion: 'Servicios de diseño gráfico y UI/UX' });
    catDisenoId = cat1.body.id;

    const cat2 = await request(app)
      .post('/categorias')
      .send({ nombre: 'Desarrollo', descripcion: 'Desarrollo web y móvil' });
    catDesarrolloId = cat2.body.id;

    // Crear gigs de Diseño
    await request(app).post('/gigs').send({
      nombre: 'Diseño de logo minimalista',
      descripcion: 'Creo un logo moderno y minimalista para tu marca',
      categoria: catDisenoId,
      vendedor: 'freelancer-1',
      paquetes: [
        { nombre: 'Básico', precio: 25, diasEntrega: 3, descripcion: '1 propuesta' },
        { nombre: 'Premium', precio: 50, diasEntrega: 5, descripcion: '3 propuestas' },
      ],
    });

    await request(app).post('/gigs').send({
      nombre: 'Diseño de interfaz mobile',
      descripcion: 'Diseño UI/UX para tu app móvil. Mockups en Figma',
      categoria: catDisenoId,
      vendedor: 'freelancer-1',
      paquetes: [
        { nombre: 'Básico', precio: 80, diasEntrega: 5, descripcion: '5 pantallas' },
      ],
    });

    // Crear gigs de Desarrollo
    await request(app).post('/gigs').send({
      nombre: 'Desarrollo de app React Native',
      descripcion: 'Desarrollo tu aplicación móvil con React Native',
      categoria: catDesarrolloId,
      vendedor: 'freelancer-2',
      paquetes: [
        { nombre: 'Básico', precio: 200, diasEntrega: 14, descripcion: 'App básica' },
        { nombre: 'Premium', precio: 500, diasEntrega: 30, descripcion: 'App completa' },
      ],
    });

    await request(app).post('/gigs').send({
      nombre: 'Desarrollo de landing page',
      descripcion: 'Creo una landing page responsive y moderna',
      categoria: catDesarrolloId,
      vendedor: 'freelancer-2',
      paquetes: [
        { nombre: 'Básico', precio: 50, diasEntrega: 3, descripcion: 'Landing estática' },
      ],
    });
  });

  describe('búsqueda por texto', () => {
    it('debería retornar gigs que coinciden con el término de búsqueda', async () => {
      const res = await request(app).get('/gigs?search=logo');

      expect(res.status).toBe(200);
      expect(res.body.gigs).toHaveLength(1);
      expect(res.body.gigs[0].nombre).toBe('Diseño de logo minimalista');
    });

    it('debería retornar resultados para búsqueda en descripción', async () => {
      const res = await request(app).get('/gigs?search=Figma');

      expect(res.status).toBe(200);
      expect(res.body.gigs).toHaveLength(1);
      expect(res.body.gigs[0].nombre).toBe('Diseño de interfaz mobile');
    });

    it('debería ignorar búsqueda con menos de 3 caracteres', async () => {
      const res = await request(app).get('/gigs?search=lo');

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('El término de búsqueda debe tener al menos 3 caracteres');
    });

    it('debería retornar vacío si no hay coincidencias', async () => {
      const res = await request(app).get('/gigs?search=xyznonexistent');

      expect(res.status).toBe(200);
      expect(res.body.gigs).toHaveLength(0);
      expect(res.body.total).toBe(0);
    });

    it('debería buscar de forma case-insensitive', async () => {
      const res = await request(app).get('/gigs?search=REACT');

      expect(res.status).toBe(200);
      expect(res.body.gigs).toHaveLength(1);
    });
  });

  describe('filtrado por categoría', () => {
    it('debería retornar solo gigs de la categoría seleccionada', async () => {
      const res = await request(app).get(`/gigs?category=${catDisenoId}`);

      expect(res.status).toBe(200);
      expect(res.body.gigs).toHaveLength(2);
      res.body.gigs.forEach((gig) => {
        expect(gig.categoria).toBe(catDisenoId);
      });
    });

    it('debería retornar vacío para categoría inexistente', async () => {
      const res = await request(app).get('/gigs?category=999');

      expect(res.status).toBe(200);
      expect(res.body.gigs).toHaveLength(0);
    });
  });

  describe('búsqueda + categoría combinados', () => {
    it('debería aplicar ambos filtros simultáneamente', async () => {
      const res = await request(app).get(
        `/gigs?search=logo&category=${catDisenoId}`
      );

      expect(res.status).toBe(200);
      expect(res.body.gigs).toHaveLength(1);
      expect(res.body.gigs[0].nombre).toBe('Diseño de logo minimalista');
    });

    it('debería retornar vacío si search no matchea en la categoría', async () => {
      const res = await request(app).get(
        `/gigs?search=React&category=${catDisenoId}`
      );

      expect(res.status).toBe(200);
      expect(res.body.gigs).toHaveLength(0);
    });
  });

  describe('ordenamiento', () => {
    it('debería ordenar por precio ascendente (suma total de paquetes)', async () => {
      const res = await request(app).get('/gigs?sortBy=price');

      expect(res.status).toBe(200);
      const prices = res.body.gigs.map(
        (g) => g.paquetes.reduce((sum, p) => sum + (p.precio || 0), 0)
      );
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
      }
    });

    it('debería retornar error para sortBy inválido', async () => {
      const res = await request(app).get('/gigs?sortBy=invalid');

      expect(res.status).toBe(400);
    });
  });

  describe('paginación', () => {
    it('debería retornar primera página con el pageSize correcto', async () => {
      const res = await request(app).get('/gigs?page=1&pageSize=2');

      expect(res.status).toBe(200);
      expect(res.body.gigs).toHaveLength(2);
      expect(res.body.total).toBe(4);
      expect(res.body.page).toBe(1);
      expect(res.body.pageSize).toBe(2);
      expect(res.body.totalPages).toBe(2);
    });

    it('debería retornar segunda página', async () => {
      const res = await request(app).get('/gigs?page=2&pageSize=2');

      expect(res.status).toBe(200);
      expect(res.body.gigs).toHaveLength(2);
      expect(res.body.page).toBe(2);
    });

    it('debería retornar página vacía si page supera totalPages', async () => {
      const res = await request(app).get('/gigs?page=100&pageSize=2');

      expect(res.status).toBe(200);
      expect(res.body.gigs).toHaveLength(0);
      expect(res.body.totalPages).toBe(2);
    });

    it('debería usar valores por defecto (page=1, pageSize=10)', async () => {
      const res = await request(app).get('/gigs');

      expect(res.body.page).toBe(1);
      expect(res.body.pageSize).toBe(10);
    });

    it('debería limitar pageSize máximo a 100', async () => {
      const res = await request(app).get('/gigs?pageSize=999');

      expect(res.status).toBe(200);
      expect(res.body.pageSize).toBe(100);
    });

    it('debería respetar pageSize mínimo de 1', async () => {
      const res = await request(app).get('/gigs?pageSize=0');

      expect(res.status).toBe(200);
      expect(res.body.pageSize).toBe(1);
    });

    it('debería mantener filtros al paginar', async () => {
      const res = await request(app).get(
        `/gigs?category=${catDisenoId}&page=1&pageSize=1`
      );

      expect(res.status).toBe(200);
      expect(res.body.gigs).toHaveLength(1);
      expect(res.body.total).toBe(2);
      expect(res.body.gigs[0].categoria).toBe(catDisenoId);
    });
  });

  describe('detalle de gig', () => {
    it('debería retornar un gig por ID', async () => {
      // Obtener el ID de un gig existente
      const listRes = await request(app).get('/gigs?pageSize=1');
      const gigId = listRes.body.gigs[0].id;

      const res = await request(app).get(`/gigs/${gigId}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(gigId);
      expect(res.body.nombre).toBeDefined();
      expect(res.body.paquetes).toBeDefined();
    });

    it('debería retornar 404 para gig inexistente', async () => {
      const res = await request(app).get('/gigs/999999');

      expect(res.status).toBe(404);
    });
  });
});
