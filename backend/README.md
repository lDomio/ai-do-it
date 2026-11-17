# AI Do It — Backend

API REST en Node.js + Express. Persistencia en memoria.

## Requisitos

- Node.js 18+

## Instalación

```bash
cd backend
npm install
```

## Levantar el servidor

```bash
# Producción / una sola ejecución
npm start

# Desarrollo con recarga automática
npm run dev
```

Por defecto escucha en `http://0.0.0.0:3000`.

Variables de entorno opcionales:

| Variable | Default | Descripción |
|----------|---------|-------------|
| `PORT`   | `3000`  | Puerto del servidor |
| `HOST`   | `0.0.0.0` | Interfaz de red (usar `0.0.0.0` para que el dispositivo mobile alcance la API) |

## Verificar que funciona

```bash
curl http://localhost:3000/health
# → {"status":"ok"}
```

## Estructura

```
src/
├── app.js              # Configuración de Express (middleware, rutas)
├── server.js           # Punto de entrada — levanta el servidor
├── middleware/         # Cross-cutting concerns (errores, etc.)
├── routes/             # Definición de endpoints
├── controllers/        # Lógica HTTP (req/res)
├── store/              # Persistencia en memoria
└── models/             # Entidades y reglas de dominio
```
