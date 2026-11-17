import bcrypt from 'bcryptjs';
import {
  gigRepository,
  categoriaRepository,
  usuarioRepository,
  pedidoRepository,
  opinionRepository,
  mensajeRepository,
} from './index.js';
import { RolUsuario } from '../enums/RolUsuario.js';
import { EstadoPedido } from '../enums/EstadoPedido.js';

export function seedData() {
  const passwordHash = bcrypt.hashSync('password123', 10);

  const categorias = [
    categoriaRepository.create({
      nombre: 'Diseño Gráfico',
      descripcion: 'Logos, branding, ilustraciones y diseño UI/UX',
    }),
    categoriaRepository.create({
      nombre: 'Desarrollo Web',
      descripcion: 'Sitios web, aplicaciones web y APIs',
    }),
    categoriaRepository.create({
      nombre: 'Desarrollo Móvil',
      descripcion: 'Apps para iOS y Android',
    }),
    categoriaRepository.create({
      nombre: 'Marketing',
      descripcion: 'SEO, redes sociales, email marketing y publicidad',
    }),
    categoriaRepository.create({
      nombre: 'Redacción',
      descripcion: 'Contenido SEO, copywriting, traducciones y edición',
    }),
    categoriaRepository.create({
      nombre: 'Video y Animación',
      descripcion: 'Edición de video, motion graphics y animaciones',
    }),
  ];

  const freelancers = [
    usuarioRepository.create({
      nombre: 'Lucía',
      apellido: 'Martínez',
      email: 'lucia@demo.com',
      passwordHash,
      rol: RolUsuario.FREELANCE,
    }),
    usuarioRepository.create({
      nombre: 'Carlos',
      apellido: 'Gómez',
      email: 'carlos@demo.com',
      passwordHash,
      rol: RolUsuario.FREELANCE,
    }),
    usuarioRepository.create({
      nombre: 'Ana',
      apellido: 'Rodríguez',
      email: 'ana@demo.com',
      passwordHash,
      rol: RolUsuario.FREELANCE,
    }),
    usuarioRepository.create({
      nombre: 'Martín',
      apellido: 'Sosa',
      email: 'martin@demo.com',
      passwordHash,
      rol: RolUsuario.FREELANCE,
    }),
  ];

  const clientes = [
    usuarioRepository.create({
      nombre: 'Julieta',
      apellido: 'López',
      email: 'julieta@demo.com',
      passwordHash,
      rol: RolUsuario.CLIENTE,
    }),
    usuarioRepository.create({
      nombre: 'Diego',
      apellido: 'Fernández',
      email: 'diego@demo.com',
      passwordHash,
      rol: RolUsuario.CLIENTE,
    }),
  ];

  const admin = usuarioRepository.create({
    nombre: 'Admin',
    apellido: 'Demo',
    email: 'admin@demo.com',
    passwordHash,
    rol: RolUsuario.ADMIN,
  });

  const gigDefinitions = [
    {
      nombre: 'Diseño de logo profesional',
      descripcion:
        'Creo un logo moderno y minimalista para tu marca. Incluye 3 propuestas iniciales, 2 rondas de revisiones y entrega de archivos en AI, PDF y PNG.',
      categoria: categorias[0].id,
      vendedor: {
        id: freelancers[0].id,
        nombre: freelancers[0].nombre,
        apellido: freelancers[0].apellido,
        rating: 4.8,
        reviewCount: 12,
        trabajosCompletados: 47,
      },
      paquetes: [
        { nombre: 'Básico', precio: 25, diasEntrega: 3, descripcion: '1 propuesta de logo editable' },
        { nombre: 'Estándar', precio: 55, diasEntrega: 5, descripcion: '3 propuestas + manual básico' },
        { nombre: 'Premium', precio: 95, diasEntrega: 7, descripcion: '3 propuestas + manual completo + mockups' },
      ],
    },
    {
      nombre: 'Diseño UI/UX para apps móviles',
      descripcion:
        'Diseño interfaces modernas para tu app en Figma. Entrego sistema de diseño, prototipo navegable y handoff para desarrolladores.',
      categoria: categorias[0].id,
      vendedor: {
        id: freelancers[0].id,
        nombre: freelancers[0].nombre,
        apellido: freelancers[0].apellido,
        rating: 4.9,
        reviewCount: 8,
        trabajosCompletados: 31,
      },
      paquetes: [
        { nombre: 'Básico', precio: 80, diasEntrega: 5, descripcion: '5 pantallas + prototipo' },
        { nombre: 'Estándar', precio: 150, diasEntrega: 10, descripcion: '15 pantallas + sistema de diseño' },
        { nombre: 'Premium', precio: 280, diasEntrega: 15, descripcion: '30 pantallas + sistema + handoff dev' },
      ],
    },
    {
      nombre: 'Desarrollo de app React Native',
      descripcion:
        'Desarrollo tu aplicación móvil con React Native y Expo. Incluye autenticación, navegación, integración con APIs y publicación en stores.',
      categoria: categorias[2].id,
      vendedor: {
        id: freelancers[1].id,
        nombre: freelancers[1].nombre,
        apellido: freelancers[1].apellido,
        rating: 5.0,
        reviewCount: 21,
        trabajosCompletados: 63,
      },
      paquetes: [
        { nombre: 'Básico', precio: 200, diasEntrega: 14, descripcion: 'App básica con 3 pantallas' },
        { nombre: 'Estándar', precio: 450, diasEntrega: 30, descripcion: 'App con autenticación y backend' },
        { nombre: 'Premium', precio: 850, diasEntrega: 45, descripcion: 'App completa + backend + publicación' },
      ],
    },
    {
      nombre: 'Landing page moderna y responsive',
      descripcion:
        'Diseño y desarrollo una landing page profesional con HTML, CSS, JavaScript o React. Optimizada para SEO, velocidad y conversiones.',
      categoria: categorias[1].id,
      vendedor: {
        id: freelancers[1].id,
        nombre: freelancers[1].nombre,
        apellido: freelancers[1].apellido,
        rating: 4.7,
        reviewCount: 15,
        trabajosCompletados: 52,
      },
      paquetes: [
        { nombre: 'Básico', precio: 50, diasEntrega: 3, descripcion: 'Landing estática de 1 sección' },
        { nombre: 'Estándar', precio: 120, diasEntrega: 7, descripcion: 'Landing multipágina + formulario' },
        { nombre: 'Premium', precio: 220, diasEntrega: 14, descripcion: 'Landing con CMS + animaciones' },
      ],
    },
    {
      nombre: 'Desarrollo web full stack MERN',
      descripcion:
        'Desarrollo aplicaciones web completas con MongoDB, Express, React y Node.js. Incluye autenticación JWT, APIs REST, dashboard admin y deploy en la nube.',
      categoria: categorias[1].id,
      vendedor: {
        id: freelancers[1].id,
        nombre: freelancers[1].nombre,
        apellido: freelancers[1].apellido,
        rating: 4.9,
        reviewCount: 19,
        trabajosCompletados: 41,
      },
      paquetes: [
        { nombre: 'Básico', precio: 180, diasEntrega: 7, descripcion: 'API REST + panel CRUD básico' },
        { nombre: 'Estándar', precio: 450, diasEntrega: 21, descripcion: 'App completa con auth, roles y dashboard' },
        { nombre: 'Premium', precio: 900, diasEntrega: 45, descripcion: 'App + testing + CI/CD + deploy productivo' },
      ],
    },
    {
      nombre: 'Redacción de artículos SEO',
      descripcion:
        'Escribo artículos optimizados para SEO con investigación de keywords, estructura H2/H3 y meta descripciones. Ideal para blogs y sitios corporativos.',
      categoria: categorias[4].id,
      vendedor: {
        id: freelancers[2].id,
        nombre: freelancers[2].nombre,
        apellido: freelancers[2].apellido,
        rating: 4.9,
        reviewCount: 34,
        trabajosCompletados: 128,
      },
      paquetes: [
        { nombre: 'Básico', precio: 15, diasEntrega: 2, descripcion: '1 artículo de 1000 palabras' },
        { nombre: 'Estándar', precio: 40, diasEntrega: 5, descripcion: '3 artículos de 1000 palabras' },
        { nombre: 'Premium', precio: 90, diasEntrega: 10, descripcion: '7 artículos + calendario editorial' },
      ],
    },
    {
      nombre: 'Edición de video para redes sociales',
      descripcion:
        'Edito videos para TikTok, Instagram Reels y YouTube Shorts. Incluye color grading, subtítulos, transiciones y música sin copyright.',
      categoria: categorias[5].id,
      vendedor: {
        id: freelancers[2].id,
        nombre: freelancers[2].nombre,
        apellido: freelancers[2].apellido,
        rating: 4.6,
        reviewCount: 11,
        trabajosCompletados: 39,
      },
      paquetes: [
        { nombre: 'Básico', precio: 30, diasEntrega: 2, descripcion: '1 video de hasta 30 segundos' },
        { nombre: 'Estándar', precio: 75, diasEntrega: 4, descripcion: '3 videos con subtítulos' },
        { nombre: 'Premium', precio: 150, diasEntrega: 7, descripcion: '8 videos + miniatura + copy' },
      ],
    },
    {
      nombre: 'Gestión de campañas en Meta Ads',
      descripcion:
        'Creo y gestiono campañas publicitarias en Facebook e Instagram Ads. Segmentación, creatividades, A/B testing y reportes semanales.',
      categoria: categorias[3].id,
      vendedor: {
        id: freelancers[3].id,
        nombre: freelancers[3].nombre,
        apellido: freelancers[3].apellido,
        rating: 4.8,
        reviewCount: 18,
        trabajosCompletados: 74,
      },
      paquetes: [
        { nombre: 'Básico', precio: 90, diasEntrega: 3, descripcion: 'Setup de 1 campaña' },
        { nombre: 'Estándar', precio: 190, diasEntrega: 7, descripcion: '3 campañas + 2 creatividades cada una' },
        { nombre: 'Premium', precio: 350, diasEntrega: 15, descripcion: '5 campañas + A/B testing + reportes' },
      ],
    },
    {
      nombre: 'Optimización SEO completa',
      descripcion:
        'Audito y optimizo tu sitio web para motores de búsqueda. Incluye auditoría técnica, keywords, on-page SEO y backlinks.',
      categoria: categorias[3].id,
      vendedor: {
        id: freelancers[3].id,
        nombre: freelancers[3].nombre,
        apellido: freelancers[3].apellido,
        rating: 4.9,
        reviewCount: 27,
        trabajosCompletados: 91,
      },
      paquetes: [
        { nombre: 'Básico', precio: 60, diasEntrega: 3, descripcion: 'Auditoría SEO técnica' },
        { nombre: 'Estándar', precio: 140, diasEntrega: 7, descripcion: 'Auditoría + optimización on-page' },
        { nombre: 'Premium', precio: 300, diasEntrega: 14, descripcion: 'SEO completo + estrategia de contenidos' },
      ],
    },
    {
      nombre: 'Ilustraciones personalizadas',
      descripcion:
        'Creo ilustraciones únicas para tu marca, libro, app o campaña. Estilos: flat, isométrico, cartoon o acuarela digital.',
      categoria: categorias[0].id,
      vendedor: {
        id: freelancers[0].id,
        nombre: freelancers[0].nombre,
        apellido: freelancers[0].apellido,
        rating: 4.7,
        reviewCount: 9,
        trabajosCompletados: 28,
      },
      paquetes: [
        { nombre: 'Básico', precio: 35, diasEntrega: 3, descripcion: '1 ilustración simple' },
        { nombre: 'Estándar', precio: 80, diasEntrega: 7, descripcion: '3 ilustraciones detalladas' },
        { nombre: 'Premium', precio: 160, diasEntrega: 12, descripcion: '6 ilustraciones + escena compleja' },
      ],
    },
    {
      nombre: 'Motion graphics para presentaciones',
      descripcion:
        'Animo tu logo, texto o infografía para presentaciones, videos corporativos o redes sociales. Entrego archivos en MP4, GIF y MOV.',
      categoria: categorias[5].id,
      vendedor: {
        id: freelancers[2].id,
        nombre: freelancers[2].nombre,
        apellido: freelancers[2].apellido,
        rating: 4.8,
        reviewCount: 14,
        trabajosCompletados: 56,
      },
      paquetes: [
        { nombre: 'Básico', precio: 45, diasEntrega: 2, descripcion: 'Animación de logo de hasta 5 segundos' },
        { nombre: 'Estándar', precio: 100, diasEntrega: 5, descripcion: 'Animación de hasta 15 segundos' },
        { nombre: 'Premium', precio: 200, diasEntrega: 10, descripcion: 'Animación compleja de hasta 30 segundos' },
      ],
    },
  ];

  const gigImages = [
    [
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&auto=format&fit=crop',
    ],
    [
      'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop',
    ],
    [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&auto=format&fit=crop',
    ],
    [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop',
    ],
    [
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&auto=format&fit=crop',
    ],
    [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop',
    ],
    [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop',
    ],
    [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop',
    ],
    [
      'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&auto=format&fit=crop',
    ],
    [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop',
    ],
    [
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop',
    ],
  ];

  const gigs = gigDefinitions.map((def, index) =>
    gigRepository.create({
      nombre: def.nombre,
      descripcion: def.descripcion,
      categoria: def.categoria,
      vendedor: def.vendedor,
      paquetes: def.paquetes,
      multimedia: gigImages[index] || [
        'https://images.unsplash.com/photo-1558655146-d09347e0b7a9?w=800&auto=format&fit=crop',
      ],
    })
  );

  const pedidos = [
    pedidoRepository.create({
      cliente: clientes[0].id,
      gig: gigs[0].id,
      paqueteId: gigs[0].paquetes[1].id,
      requerimientos: 'Necesito un logo para una marca de café artesanal. Colores: marrón y crema.',
      total: 55,
      estado: EstadoPedido.ENTREGADO,
      puntuacion: 5,
    }),
    pedidoRepository.create({
      cliente: clientes[0].id,
      gig: gigs[2].id,
      paqueteId: gigs[2].paquetes[0].id,
      requerimientos: 'App sencilla para lista de tareas personales.',
      total: 200,
      estado: EstadoPedido.CONFIRMADO,
    }),
    pedidoRepository.create({
      cliente: clientes[1].id,
      gig: gigs[4].id,
      paqueteId: gigs[4].paquetes[2].id,
      requerimientos: 'Artículos sobre tecnología y productividad para blog corporativo.',
      total: 90,
      estado: EstadoPedido.PENDIENTE,
    }),
    pedidoRepository.create({
      cliente: clientes[1].id,
      gig: gigs[6].id,
      paqueteId: gigs[6].paquetes[1].id,
      requerimientos: 'Campaña para promocionar un curso online de diseño.',
      total: 190,
      estado: EstadoPedido.EN_REVISION,
    }),
  ];

  opinionRepository.create({
    cliente: clientes[0].id,
    gig: gigs[0].id,
    pedido: pedidos[0].id,
    puntuacion: 5,
    detalle: 'Excelente trabajo, superó mis expectativas. El logo quedó perfecto para mi marca.',
  });

  opinionRepository.create({
    cliente: clientes[1].id,
    gig: gigs[4].id,
    pedido: pedidos[2].id,
    puntuacion: 4,
    detalle: 'Muy buenos artículos, bien investigados y optimizados. Recomiendo.',
  });

  mensajeRepository.create({
    pedidoId: pedidos[0].id,
    remitenteId: freelancers[0].id,
    contenido: '¡Hola! Gracias por tu pedido. Te envío las primeras propuestas en 24 horas.',
  });

  mensajeRepository.create({
    pedidoId: pedidos[0].id,
    remitenteId: clientes[0].id,
    contenido: 'Genial, quedo atenta.',
  });

  return {
    admin,
    freelancers,
    clientes,
    categorias,
    gigs,
    pedidos,
  };
}
