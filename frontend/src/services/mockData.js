export const mockUsers = [
  {
    id: 'usr_001',
    name: 'Alex Rodríguez',
    email: 'alex@example.com',
    avatar: 'https://i.pravatar.cc/150?u=usr_001',
    role: 'CLIENTE',
    stats: {
      completed: 12,
      active: 3,
      spent: 45000,
      earned: 180000,
    },
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'usr_002',
    name: 'María González',
    email: 'maria@example.com',
    avatar: 'https://i.pravatar.cc/150?u=usr_002',
    role: 'FREELANCER',
    stats: {
      completed: 342,
      active: 8,
      spent: 0,
      earned: 520000,
    },
    createdAt: '2023-06-01T00:00:00Z',
  },
  {
    id: 'usr_003',
    name: 'Sebastián López',
    email: 'sebastian@example.com',
    avatar: 'https://i.pravatar.cc/150?u=usr_003',
    role: 'FREELANCER',
    stats: {
      completed: 189,
      active: 5,
      spent: 0,
      earned: 340000,
    },
    createdAt: '2023-08-15T00:00:00Z',
  },
  {
    id: 'usr_004',
    name: 'Admin Demo',
    email: 'admin@example.com',
    avatar: 'https://i.pravatar.cc/150?u=usr_004',
    role: 'ADMIN',
    stats: {
      completed: 0,
      active: 0,
      spent: 0,
      earned: 0,
    },
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const mockCategories = [
  { id: 'TODOS', name: 'Todos', icon: 'grid' },
  { id: 'DISENO', name: 'Diseño', icon: 'color-palette' },
  { id: 'DESARROLLO', name: 'Desarrollo', icon: 'code-slash' },
  { id: 'MARKETING', name: 'Marketing', icon: 'trending-up' },
  { id: 'REDACCION', name: 'Redacción', icon: 'pencil' },
  { id: 'VIDEO', name: 'Video', icon: 'videocam' },
  { id: 'DATOS', name: 'Datos', icon: 'bar-chart' },
  { id: 'MUSICA', name: 'Música', icon: 'musical-notes' },
  { id: 'IA', name: 'IA', icon: 'hardware-chip' },
];

export const mockGigs = [
  {
    id: 'gig_001',
    title: 'Diseño de logo profesional con identidad de marca completa',
    description:
      'Creo logos únicos y memorables que reflejan la esencia de tu marca. Incluyo proceso creativo completo, revisiones ilimitadas y todos los archivos en formatos editables.',
    category: 'DISENO',
    tags: ['logo', 'branding', 'identidad visual'],
    seller: mockUsers[1],
    packages: [
      {
        id: 'pkg_001',
        name: 'BASICO',
        price: 5000,
        deliveryDays: 3,
        features: ['2 conceptos iniciales', '2 revisiones', 'Archivos PNG/JPG'],
      },
      {
        id: 'pkg_002',
        name: 'ESTANDAR',
        price: 12000,
        deliveryDays: 5,
        features: ['4 conceptos iniciales', '5 revisiones', 'Archivos PNG/JPG/SVG', 'Mockups'],
      },
      {
        id: 'pkg_003',
        name: 'PREMIUM',
        price: 25000,
        deliveryDays: 7,
        features: [
          '6 conceptos iniciales',
          'Revisiones ilimitadas',
          'Todos los formatos',
          'Mockups',
          'Guía de marca',
        ],
      },
    ],
    rating: 4.9,
    reviewCount: 342,
    images: ['https://placehold.co/600x400/6D28D9/FFFFFF?text=Logo+1'],
    isFeatured: true,
    isTrending: false,
    createdAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'gig_002',
    title: 'Desarrollo de landing page moderna con React y animaciones',
    description:
      'Desarrollo landing pages responsivas y modernas usando React. Incluyo animaciones suves, optimización SEO y hosting por 1 año.',
    category: 'DESARROLLO',
    tags: ['react', 'landing page', 'web'],
    seller: mockUsers[2],
    packages: [
      {
        id: 'pkg_004',
        name: 'BASICO',
        price: 15000,
        deliveryDays: 5,
        features: ['Landing page simple', 'Diseño responsivo', 'Formulario de contacto'],
      },
      {
        id: 'pkg_005',
        name: 'ESTANDAR',
        price: 35000,
        deliveryDays: 7,
        features: ['Landing page completa', 'Animaciones', 'SEO básico', 'Hosting 1 año'],
      },
      {
        id: 'pkg_006',
        name: 'PREMIUM',
        price: 60000,
        deliveryDays: 10,
        features: [
          'Landing page premium',
          'Animaciones avanzadas',
          'SEO completo',
          'Hosting 1 año',
          'Analytics',
          'Soporte 3 meses',
        ],
      },
    ],
    rating: 4.8,
    reviewCount: 189,
    images: ['https://placehold.co/600x400/8B5CF6/FFFFFF?text=React+Landing'],
    isFeatured: true,
    isTrending: true,
    createdAt: '2024-03-15T00:00:00Z',
  },
  {
    id: 'gig_003',
    title: 'Estrategia de marketing en redes sociales + gestión mensual',
    description:
      'Creo y gestiono tu estrategia de marketing en Instagram, Facebook y TikTok. Incluyo calendario de contenido, community management y reportes mensuales.',
    category: 'MARKETING',
    tags: ['marketing', 'redes sociales', 'instagram'],
    seller: mockUsers[1],
    packages: [
      {
        id: 'pkg_007',
        name: 'BASICO',
        price: 8000,
        deliveryDays: 7,
        features: ['1 red social', '8 publicaciones/mes', 'Calendario de contenido'],
      },
      {
        id: 'pkg_008',
        name: 'ESTANDAR',
        price: 18000,
        deliveryDays: 7,
        features: [
          '2 redes sociales',
          '16 publicaciones/mes',
          'Community management',
          'Reporte mensual',
        ],
      },
      {
        id: 'pkg_009',
        name: 'PREMIUM',
        price: 35000,
        deliveryDays: 7,
        features: [
          '3 redes sociales',
          '30 publicaciones/mes',
          'Community management',
          'Reportes semanales',
          'Pauta publicitaria',
          'Reels/TikTok',
        ],
      },
    ],
    rating: 4.7,
    reviewCount: 94,
    images: ['https://placehold.co/600x400/F59E0B/FFFFFF?text=Marketing'],
    isFeatured: false,
    isTrending: true,
    createdAt: '2024-05-20T00:00:00Z',
  },
  {
    id: 'gig_004',
    title: 'Edición de video profesional para YouTube y redes sociales',
    description:
      'Edito tus videos con calidad profesional. Incluyo color grading, corrección de color, música de fondo y efectos visuales.',
    category: 'VIDEO',
    tags: ['video', 'edicion', 'youtube'],
    seller: mockUsers[2],
    packages: [
      {
        id: 'pkg_010',
        name: 'BASICO',
        price: 6000,
        deliveryDays: 3,
        features: ['Video hasta 5 min', 'Corte y edición básica', 'Música de fondo'],
      },
      {
        id: 'pkg_011',
        name: 'ESTANDAR',
        price: 12000,
        deliveryDays: 5,
        features: ['Video hasta 15 min', 'Edición completa', 'Color grading', 'Efectos visuales'],
      },
      {
        id: 'pkg_012',
        name: 'PREMIUM',
        price: 25000,
        deliveryDays: 7,
        features: [
          'Video hasta 30 min',
          'Edición profesional',
          'Color grading avanzado',
          'Efectos especiales',
          'Thumbnails',
          'Revisiones ilimitadas',
        ],
      },
    ],
    rating: 4.9,
    reviewCount: 276,
    images: ['https://placehold.co/600x400/EF4444/FFFFFF?text=Video+Edit'],
    isFeatured: true,
    isTrending: false,
    createdAt: '2024-02-10T00:00:00Z',
  },
  {
    id: 'gig_005',
    title: 'Desarrollo de App Móvil con React Native',
    description:
      'Desarrollo apps móviles completas con React Native. Incluyo diseño UI/UX, desarrollo, testing y publicación en stores.',
    category: 'DESARROLLO',
    tags: ['react native', 'app móvil', 'desarrollo'],
    seller: mockUsers[0],
    packages: [
      {
        id: 'pkg_013',
        name: 'BASICO',
        price: 50000,
        deliveryDays: 14,
        features: ['UI básica', '1 pantalla', 'Entregable en APK'],
      },
      {
        id: 'pkg_014',
        name: 'ESTANDAR',
        price: 120000,
        deliveryDays: 10,
        features: ['UI completa', '5 pantallas', 'API integration', 'APK + código fuente'],
      },
      {
        id: 'pkg_015',
        name: 'PREMIUM',
        price: 250000,
        deliveryDays: 7,
        features: [
          'UI premium',
          'Pantallas ilimitadas',
          'API + Backend',
          'Publicación en stores',
          'Soporte 30 días',
        ],
      },
    ],
    rating: 0,
    reviewCount: 0,
    images: ['https://placehold.co/600x400/22C55E/FFFFFF?text=React+Native+App'],
    isFeatured: false,
    isTrending: false,
    createdAt: '2026-07-10T12:00:00.000Z',
  },
];

export const mockOrders = [
  {
    id: 'ord_001',
    gig: mockGigs[0],
    buyer: mockUsers[0],
    seller: mockUsers[1],
    package: mockGigs[0].packages[1],
    status: 'CONFIRMADO',
    totalPrice: 12000,
    createdAt: '2026-07-01T10:00:00Z',
    deliveryDeadline: '2026-07-06T10:00:00Z',
    daysRemaining: 2,
  },
  {
    id: 'ord_002',
    gig: mockGigs[3],
    buyer: mockUsers[0],
    seller: mockUsers[2],
    package: mockGigs[3].packages[0],
    status: 'ENTREGADO',
    totalPrice: 6000,
    createdAt: '2026-06-25T14:00:00Z',
    deliveryDeadline: '2026-06-28T14:00:00Z',
    deliveredAt: '2026-06-28T12:00:00Z',
    daysRemaining: 0,
  },
  {
    id: 'ord_003',
    gig: mockGigs[2],
    buyer: mockUsers[0],
    seller: mockUsers[1],
    package: mockGigs[2].packages[2],
    status: 'PENDIENTE',
    totalPrice: 35000,
    createdAt: '2026-07-08T09:00:00Z',
    deliveryDeadline: '2026-07-15T09:00:00Z',
    daysRemaining: 6,
  },
  {
    id: 'ord_004',
    gig: mockGigs[1],
    buyer: mockUsers[0],
    seller: mockUsers[2],
    package: mockGigs[1].packages[1],
    status: 'COMPLETADO',
    totalPrice: 35000,
    createdAt: '2026-06-15T11:00:00Z',
    deliveryDeadline: '2026-06-22T11:00:00Z',
    deliveredAt: '2026-06-21T18:00:00Z',
    completedAt: '2026-06-22T10:00:00Z',
    daysRemaining: 0,
  },
];

export const mockReviews = [
  {
    id: 'rev_001',
    orderId: 'ord_004',
    gigId: 'gig_002',
    buyer: mockUsers[0],
    rating: 5,
    comment:
      'Excelente trabajo! La landing page quedó exactamente como la quería. Muy profesional y rápido.',
    createdAt: '2026-06-22T10:00:00Z',
  },
  {
    id: 'rev_002',
    orderId: 'ord_002',
    gigId: 'gig_004',
    buyer: mockUsers[0],
    rating: 5,
    comment: 'El video quedó increíble. Muy buen gusto para la edición y las transiciones.',
    createdAt: '2026-06-29T09:00:00Z',
  },
];

export const mockMessages = [
  {
    id: 'msg_001',
    orderId: 'ord_001',
    senderId: 'usr_001',
    senderType: 'BUYER',
    content: 'Hola! Me gustaría que el logo tenga tonos azules y violetas.',
    createdAt: '2026-07-01T10:30:00Z',
  },
  {
    id: 'msg_002',
    orderId: 'ord_001',
    senderId: 'usr_002',
    senderType: 'FREELANCER',
    content: 'Perfecto, lo tengo en cuenta. Voy a preparar unos bocetos con esa paleta de colores.',
    createdAt: '2026-07-01T11:00:00Z',
  },
  {
    id: 'msg_003',
    orderId: 'ord_001',
    senderId: 'usr_001',
    senderType: 'BUYER',
    content: 'Genial! También me gustaría ver una versión minimalista.',
    createdAt: '2026-07-01T11:30:00Z',
  },
];

export const mockRouteHandlers = {
  'GET /users/profile': () => mockUsers[0],
  'GET /gigs': () => ({ gigs: mockGigs, total: mockGigs.length }),
  'GET /gigs/featured': () => ({ gigs: mockGigs.filter((g) => g.isFeatured) }),
  'GET /gigs/trending': () => ({ gigs: mockGigs.filter((g) => g.isTrending) }),
  'GET /gigs/categories': () => ({ categories: mockCategories }),
  'GET /gigs/:id': (params) => {
    const gig = mockGigs.find((g) => g.id === params.id) || mockGigs[0];
    const reviewsForGig = mockReviews.filter((r) => r.gigId === gig.id);
    const rating =
      reviewsForGig.length > 0
        ? Math.round(
            (reviewsForGig.reduce((sum, r) => sum + r.rating, 0) / reviewsForGig.length) * 10
          ) / 10
        : gig.rating || 0;
    const reviewCount = reviewsForGig.length || gig.reviewCount || 0;
    return { ...gig, rating, reviewCount };
  },
  'GET /gigs/:id/reviews': (params, _body, _headers, query = {}) => {
    const gig = mockGigs.find((g) => g.id === params.id);
    if (!gig) {
      throw new Error('Gig no encontrado');
    }
    const reviewsForGig = mockReviews
      .filter((r) => r.gigId === params.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const total = reviewsForGig.length;
    const page = Math.max(1, Number(query.page || 1));
    const pageSize = Math.min(100, Math.max(1, Number(query.pageSize || 10)));
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const reviews = reviewsForGig.slice(start, start + pageSize);
    const rating =
      total > 0
        ? Math.round((reviewsForGig.reduce((sum, r) => sum + r.rating, 0) / total) * 10) / 10
        : 0;
    return {
      gigId: gig.id,
      rating,
      reviewCount: total,
      reviews,
      total,
      page,
      pageSize,
      totalPages,
    };
  },
  'GET /orders': () => ({
    orders: mockOrders,
    activeCount: mockOrders.filter((o) =>
      ['PENDIENTE', 'CONFIRMADO', 'EN_REVISION'].includes(o.status)
    ).length,
    completedCount: mockOrders.filter((o) => o.status === 'COMPLETADO').length,
  }),
  'GET /orders/:id': (params) => {
    const order = mockOrders.find((o) => o.id === params.id);
    return order || mockOrders[0];
  },
  'GET /orders/:orderId/messages': (params) => ({
    messages: mockMessages.filter((m) => m.orderId === params.orderId),
    unreadCount: 1,
  }),
  'POST /orders/:id/cancel': (params, body, headers) => {
    const order = mockOrders.find((o) => o.id === params.id);
    if (!order) {
      throw new Error('Pedido no encontrado');
    }

    const token = headers?.authorization?.replace('Bearer ', '') || '';
    let actor = mockUsers[0];
    try {
      const base64 = token.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(globalThis.atob(base64));
      actor = mockUsers.find((u) => u.id === payload.id) || actor;
    } catch {
      // fallback to default actor
    }

    const isAdmin = actor.role === 'ADMIN';
    const isOwner = actor.id === order.buyer?.id;
    if (!isOwner && !isAdmin) {
      throw new Error('No tienes permiso para cancelar este pedido');
    }

    const CANCELLABLE = ['PENDIENTE', 'CONFIRMADO', 'EN_REVISION'];
    if (!CANCELLABLE.includes(order.status) && order.status !== 'CANCELADO') {
      throw new Error(`El pedido no puede cancelarse en estado ${order.status}`);
    }
    if (order.status === 'CANCELADO') {
      return order;
    }

    order.status = 'CANCELADO';
    order.canceladoAt = new Date().toISOString();
    order.canceladoPor = actor.id;
    order.canceladoPorRol = isAdmin ? 'admin' : 'cliente';
    if (order.totalPrice > 0) {
      order.reembolso = {
        monto: order.totalPrice,
        estado: 'INICIADO',
        fechaInicio: new Date().toISOString(),
      };
    }
    return order;
  },
  'POST /orders/:orderId/messages': (params, body) => {
    const { content } = body || {};
    const trimmed = typeof content === 'string' ? content.trim() : '';
    if (trimmed.length === 0) {
      throw new Error('El mensaje no puede estar vacio');
    }
    if (trimmed.length > 2000) {
      throw new Error('El mensaje no puede exceder los 2000 caracteres');
    }
    const message = {
      id: `msg_${String(mockMessages.length + 1).padStart(3, '0')}`,
      orderId: params.orderId,
      senderId: 'usr_001',
      senderType: 'BUYER',
      content: trimmed,
      status: 'ENVIADO',
      createdAt: new Date().toISOString(),
    };
    mockMessages.push(message);
    return message;
  },
  'GET /search': (params) => {
    const query = params.q?.toLowerCase() || '';
    const results = mockGigs.filter(
      (g) =>
        g.title.toLowerCase().includes(query) || g.tags.some((t) => t.toLowerCase().includes(query))
    );
    return { results, total: results.length };
  },
  'POST /gigs': (body) => {
    const id = `gig_${String(mockGigs.length + 1).padStart(3, '0')}`;
    const seller = mockUsers[0];
    const paquetes = (body.paquetes || []).map((pkg, i) => ({
      id: `pkg_${id}_${i + 1}`,
      name: pkg.nombre || pkg.name || '',
      price: pkg.precio || pkg.price || 0,
      deliveryDays: pkg.diasEntrega || pkg.deliveryDays || 0,
      features: pkg.caracteristicas || pkg.features || [],
    }));
    const gig = {
      id,
      title: body.nombre || body.title || '',
      description: body.descripcion || body.description || '',
      category: body.categoria || body.category || '',
      tags: body.tags || [],
      seller,
      packages: paquetes,
      rating: 0,
      reviewCount: 0,
      images: body.multimedia || body.images || [],
      isFeatured: false,
      isTrending: false,
      createdAt: new Date().toISOString(),
    };
    mockGigs.push(gig);
    return gig;
  },
  'PUT /gigs/:id': (params, body) => {
    const gig = mockGigs.find((g) => g.id === params.id);
    if (!gig) return null;
    if (body.nombre !== undefined || body.title !== undefined) {
      gig.title = body.nombre || body.title;
    }
    if (body.descripcion !== undefined || body.description !== undefined) {
      gig.description = body.descripcion || body.description;
    }
    if (body.categoria !== undefined || body.category !== undefined) {
      gig.category = body.categoria || body.category;
    }
    if (body.tags !== undefined) {
      gig.tags = body.tags;
    }
    if (body.multimedia !== undefined || body.images !== undefined) {
      gig.images = body.multimedia || body.images;
    }
    if (body.paquetes !== undefined || body.packages !== undefined) {
      const incoming = body.paquetes || body.packages;
      gig.packages = incoming.map((pkg, i) => ({
        id: pkg.id || `pkg_${gig.id}_${i + 1}`,
        name: pkg.nombre || pkg.name || '',
        price: pkg.precio || pkg.price || 0,
        deliveryDays: pkg.diasEntrega || pkg.deliveryDays || 0,
        features: pkg.caracteristicas || pkg.features || [],
      }));
    }
    return gig;
  },
  'DELETE /gigs/:id/packages/:packageId': (params) => {
    const gig = mockGigs.find((g) => g.id === params.id);
    if (!gig) return null;
    if (gig.packages.length <= 1) {
      return { error: 'No se puede eliminar: al menos un paquete es requerido' };
    }
    gig.packages = gig.packages.filter((p) => p.id !== params.packageId);
    return { success: true, remainingPackages: gig.packages.length };
  },
  'POST /opiniones': (params, body, headers) => {
    const { cliente, gig, pedido, puntuacion, detalle } = body || {};

    const token = headers?.authorization?.replace('Bearer ', '') || '';
    let actor = mockUsers[0];
    try {
      const base64 = token.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(globalThis.atob(base64));
      actor = mockUsers.find((u) => u.id === payload.id) || actor;
    } catch {
      // fallback to default actor
    }

    if (actor.id !== cliente) {
      throw new Error('No puedes reseñar en nombre de otro cliente');
    }

    const order = mockOrders.find((o) => o.id === pedido);
    if (!order) {
      throw new Error('Pedido no encontrado');
    }
    if (order.status !== 'ENTREGADO' && order.status !== 'COMPLETADO') {
      throw new Error('El pedido debe estar entregado para dejar una reseña');
    }
    if (order.buyer?.id !== cliente && order.buyer !== cliente) {
      throw new Error('No tienes permiso para reseñar este pedido');
    }
    if (mockReviews.some((r) => r.orderId === pedido)) {
      throw new Error('El pedido ya tiene una reseña');
    }

    const numero = Number(puntuacion);
    if (!Number.isInteger(numero) || numero < 1 || numero > 5) {
      throw new Error('La puntuacion debe ser un entero entre 1 y 5');
    }
    const limpio = typeof detalle === 'string' ? detalle.trim() : '';
    if (limpio.length === 0) {
      throw new Error('El detalle no puede estar vacio');
    }
    if (limpio.length > 1000) {
      throw new Error('El detalle no puede exceder los 1000 caracteres');
    }

    const review = {
      id: `rev_${String(mockReviews.length + 1).padStart(3, '0')}`,
      orderId: pedido,
      gigId: gig,
      buyer: actor,
      cliente: actor.id,
      rating: numero,
      puntuacion: numero,
      comment: limpio,
      detalle: limpio,
      createdAt: new Date().toISOString(),
      fechaCreacion: new Date().toISOString(),
    };
    mockReviews.push(review);

    // Actualizar el gig asociado para reflejar la nueva reseña inmediatamente
    const gigObj = mockGigs.find((g) => g.id === gig);
    if (gigObj) {
      const reviewsForGig = mockReviews.filter((r) => r.gigId === gig);
      gigObj.rating =
        Math.round(
          (reviewsForGig.reduce((sum, r) => sum + r.rating, 0) / reviewsForGig.length) * 10
        ) / 10;
      gigObj.reviewCount = reviewsForGig.length;
    }

    return review;
  },
};
