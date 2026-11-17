import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Do It API',
      version: '1.0.0',
      description:
        'API REST para la plataforma de servicios freelance "AI Do It". Catálogo de Gigs, pedidos, chat y reseñas.',
      contact: {
        name: 'AI Do It Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token de acceso JWT. Se obtiene en POST /auth/login',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'refreshToken',
          description:
            'Refresh token almacenado como cookie httpOnly. Se establece automáticamente en login/register',
        },
      },
      schemas: {
        Gig: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'gig-001' },
            nombre: { type: 'string', example: 'Diseño de Logo Profesional' },
            descripcion: { type: 'string', example: 'Creo logos únicos y modernos para tu marca' },
            categoria: { type: 'string', example: 'DISENO' },
            vendedor: { $ref: '#/components/schemas/Usuario' },
            paquetes: { type: 'array', items: { $ref: '#/components/schemas/Paquete' } },
            multimedia: {
              type: 'array',
              items: { type: 'string' },
              example: ['https://placeholder.com/logo1.jpg'],
            },
            fechaCreacion: { type: 'string', format: 'date-time' },
            rating: { type: 'number', example: 4.5 },
            reviewCount: { type: 'integer', example: 12 },
          },
        },
        GigCreate: {
          type: 'object',
          required: ['nombre', 'descripcion', 'categoria', 'paquetes'],
          properties: {
            nombre: { type: 'string', example: 'Diseño de Logo Profesional' },
            descripcion: { type: 'string', example: 'Creo logos únicos y modernos para tu marca' },
            categoria: { type: 'string', example: 'DISENO' },
            paquetes: {
              type: 'array',
              items: { $ref: '#/components/schemas/PaqueteCreate' },
              minItems: 1,
              maxItems: 3,
            },
            multimedia: { type: 'array', items: { type: 'string' } },
          },
        },
        Paquete: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'pkg-001' },
            nombre: { type: 'string', example: 'Básico' },
            precio: { type: 'number', example: 5000 },
            diasEntrega: { type: 'integer', example: 5 },
            descripcion: { type: 'string', example: 'Incluye 1 concepto y 3 revisiones' },
          },
        },
        PaqueteCreate: {
          type: 'object',
          required: ['nombre', 'precio', 'diasEntrega', 'descripcion'],
          properties: {
            nombre: { type: 'string', example: 'Básico' },
            precio: { type: 'number', minimum: 0, example: 5000 },
            diasEntrega: { type: 'integer', minimum: 0, example: 5 },
            descripcion: { type: 'string', example: 'Incluye 1 concepto y 3 revisiones' },
          },
        },
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'user-001' },
            nombre: { type: 'string', example: 'Alex' },
            apellido: { type: 'string', example: 'García' },
            email: { type: 'string', format: 'email', example: 'alex@demo.com' },
            avatar: { type: 'string', example: 'https://i.pravatar.cc/150?u=alex' },
            rol: { type: 'string', enum: ['FREELANCE', 'CLIENTE', 'ADMIN'], example: 'FREELANCE' },
          },
        },
        Pedido: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'pedido-001' },
            cliente: { $ref: '#/components/schemas/Usuario' },
            gig: { $ref: '#/components/schemas/Gig' },
            paqueteId: { type: 'string', example: 'pkg-001' },
            requerimientos: { type: 'string', example: 'Necesito un logo minimalista...' },
            total: { type: 'number', example: 12000 },
            estado: { $ref: '#/components/schemas/EstadoPedido' },
            puntuacion: { type: 'number', nullable: true, example: 5 },
            fechaCreacion: { type: 'string', format: 'date-time' },
            fechaConfirmacion: { type: 'string', format: 'date-time', nullable: true },
            canceladoAt: { type: 'string', format: 'date-time', nullable: true },
            canceladoPor: { type: 'string', nullable: true },
            canceladoPorRol: { type: 'string', nullable: true, example: 'cliente' },
          },
        },
        PedidoPlace: {
          type: 'object',
          required: ['gigId', 'paqueteId', 'requerimientos'],
          properties: {
            gigId: { type: 'string', example: 'gig-001' },
            paqueteId: { type: 'string', example: 'pkg-001' },
            requerimientos: {
              type: 'string',
              minLength: 20,
              maxLength: 2000,
              example: 'Necesito un logo minimalista en blanco y negro para CleanTech.',
            },
          },
        },
        EstadoPedido: {
          type: 'string',
          enum: ['PENDIENTE', 'CONFIRMADO', 'EN_REVISION', 'ENTREGADO', 'CANCELADO'],
        },
        Categoria: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'cat-001' },
            nombre: { type: 'string', example: 'DISENO' },
            descripcion: { type: 'string', example: 'Servicios de diseño gráfico' },
          },
        },
        Opinion: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'op-001' },
            cliente: { type: 'string', example: 'cliente-001' },
            gig: { type: 'string', example: 'gig-001' },
            pedido: { type: 'string', example: 'pedido-001' },
            puntuacion: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
            detalle: { type: 'string', example: 'Excelente trabajo, muy profesional' },
            fechaCreacion: { type: 'string', format: 'date-time' },
          },
        },
        Mensaje: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'msg-001' },
            usuario: { $ref: '#/components/schemas/Usuario' },
            mensaje: { type: 'string', example: 'Hola, ¿cuándo estará listo el diseño?' },
            enviado: { type: 'string', format: 'date-time' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'alex@demo.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            usuario: { $ref: '#/components/schemas/Usuario' },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['nombre', 'apellido', 'email', 'password'],
          properties: {
            nombre: { type: 'string', example: 'Alex' },
            apellido: { type: 'string', example: 'García' },
            email: { type: 'string', format: 'email', example: 'alex@demo.com' },
            password: { type: 'string', example: 'password123' },
            rol: { type: 'string', enum: ['FREELANCE', 'CLIENTE'], example: 'FREELANCE' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Recurso no encontrado' },
          },
        },
        PaginatedGigs: {
          type: 'object',
          properties: {
            gigs: { type: 'array', items: { $ref: '#/components/schemas/Gig' } },
            total: { type: 'integer', example: 50 },
            page: { type: 'integer', example: 1 },
            pageSize: { type: 'integer', example: 10 },
            totalPages: { type: 'integer', example: 5 },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
