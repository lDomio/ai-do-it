# Flujo de Autenticación JWT con Refresh Tokens

## Resumen

Este documento explica cómo funciona el sistema de autenticación con JWT y refresh tokens implementado en AI Do It.

## Conceptos Básicos

### ¿Qué es un JWT (JSON Web Token)?

Un JWT es un token firmado que contiene información del usuario. Se compone de tres partes:

```
eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsInJvbCI6ImNsaWVudCJ9.firma
```

- **Header**: Algoritmo de firma (HS256)
- **Payload**: Datos del usuario (id, email, rol)
- **Firma**: Verificación de integridad

### ¿Qué es un Refresh Token?

Un refresh token es una cadena aleatoria de 40 bytes que se almacena en el servidor. Se usa para obtener nuevos access tokens sin pedir contraseña.

### ¿Por qué dos tokens?

| Token | Propósito | Duración | ¿Dónde se guarda? |
|-------|-----------|----------|-------------------|
| **Access Token** | Autorizar peticiones API | 1 hora | Memoria JavaScript (nunca localStorage) |
| **Refresh Token** | Obtener nuevo access token | 7 días | Servidor + cookie httpOnly |

## Flujo Paso a Paso

### 1. Login Inicial

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│  Almacenar  │
│             │     │             │     │  en memoria  │
└─────────────┘     └─────────────┘     └─────────────┘
```

**Pasos:**

1. Usuario ingresa email y contraseña
2. Backend verifica credenciales
3. Backend genera:
   - **Access Token** (JWT): `{ id: "123", email: "user@example.com", rol: "client" }`
   - **Refresh Token**: `"a1b2c3d4e5f6..."` (cadena aleatoria)
4. Backend guarda refresh token en memoria (hashed con SHA-256)
5. Backend envía:
   - Access token en el cuerpo de la respuesta
   - Refresh token como cookie httpOnly

**Código relevante** (`AuthService.js`):
```javascript
const token = generateToken(usuario);  // JWT con id, email, rol
const refreshTokenData = this.#refreshTokenService.createRefreshToken(usuario.id);
```

### 2. Uso Normal (Peticiones API)

```
┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │
│             │     │             │
│  Access     │     │  Verifica   │
│  Token      │     │  JWT        │
└─────────────┘     └─────────────┘
```

**Pasos:**

1. Frontend almacena access token en una variable JavaScript
2. Cada petición API incluye: `Authorization: Bearer <access_token>`
3. Backend verifica el JWT y procesa la solicitud
4. Si el JWT es válido → responde con los datos
5. Si el JWT expiró → responde con error 401

**Código relevante** (`auth.js`):
```javascript
export function authenticate(req, res, next) {
  const token = authHeader.split(' ')[1];
  const payload = jwt.verify(token, JWT_SECRET);
  req.user = payload;
  next();
}
```

### 3. Cuando Expira el Access Token (1 hora)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│  Nuevo      │
│             │     │             │     │  Access     │
│  Error 401  │     │  Refresh    │     │  Token      │
└─────────────┘     └─────────────┘     └─────────────┘
```

**Pasos:**

1. Frontend detecta error 401 (token expirado)
2. Frontend envía petición a `/auth/refresh`
3. La cookie del refresh token se envía automáticamente
4. Backend:
   - Busca el refresh token en la base de datos
   - Verifica que no esté revocado
   - Verifica que no esté expirado
   - **Revoca el token actual** (marca como usado)
   - **Genera nuevo refresh token** en la misma "familia"
   - **Genera nuevo access token**
5. Backend envía:
   - Nuevo access token en el cuerpo de la respuesta
   - Nuevo refresh token como cookie httpOnly

**Código relevante** (`RefreshTokenService.js`):
```javascript
rotateRefreshToken(oldToken) {
  const storedToken = this.#repository.findByToken(oldToken);
  
  if (storedToken.revokedAt) {
    // Token reuse detected - revoke entire family
    this.#revokeFamily(storedToken.familyId);
    throw new Error('Token reuse detected. All sessions revoked.');
  }
  
  // Mark current token as used
  this.#repository.revokeToken(oldToken);
  
  // Generate new token in same family
  const newToken = generateRefreshToken();
  // ...
}
```

### 4. Detección de Robo de Token

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Atacante  │────▶│   Backend   │────▶│  Revoca     │
│             │     │             │     │  Familia    │
│  Token      │     │  Detecta    │     │             │
│  robado     │     │  reuso      │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
┌─────────────┐     ┌─────────────┐
│   Usuario   │────▶│  Token      │
│   legítimo  │     │  ya         │
│             │     │  revocado   │
└─────────────┘     └─────────────┘
```

**Pasos:**

1. Atacante roba el refresh token
2. Atacante usa el token robado → Backend lo acepta y genera nuevo token
3. Usuario legítimo intenta usar el mismo token
4. Backend detecta que el token ya está revocado
5. Backend revoca **TODA la familia** de tokens
6. Ambos (atacante y víctima) deben volver a iniciar sesión

**¿Por qué funciona?**
- Cada refresh token solo se puede usar una vez
- Los tokens de la misma "familia" comparten un `familyId`
- Si se detecta reuso, se revocan todos los tokens de esa familia

### 5. Logout

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│  Revoca     │
│             │     │             │     │  todos los  │
│  POST       │     │  Revoca     │     │  tokens     │
│  /logout    │     │  tokens     │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

**Pasos:**

1. Frontend envía petición a `/auth/logout`
2. Backend revoca **todos** los refresh tokens del usuario
3. Backend limpia la cookie del refresh token
4. Access token expira naturalmente (en 1 hora)

**Código relevante** (`AuthController.js`):
```javascript
async logout(req, res, next) {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    const userId = this.#refreshTokenService.getUserIdFromToken(refreshToken);
    if (userId) {
      this.#refreshTokenService.revokeAllUserTokens(userId);
    }
  }
  
  res.clearCookie('refreshToken', { path: '/auth/refresh' });
  res.json({ success: true });
}
```

## Estructura de Datos

### Access Token (JWT)

```javascript
{
  "id": "123",           // ID del usuario
  "email": "user@example.com",
  "rol": "client",
  "iat": 1688870400,     // Fecha de emisión
  "exp": 1688874000      // Expira en 1 hora
}
```

### Refresh Token (almacenado en servidor)

```javascript
{
  "id": "1",
  "token": "a1b2c3d4e5... (hashed con SHA-256)",
  "userId": "123",           // ← RELACIÓN CON EL USUARIO
  "familyId": "uuid-...",    // Familia de tokens
  "createdAt": "2026-07-09T...",
  "expiresAt": "2026-07-16T...",  // Expira en 7 días
  "revokedAt": null,
  "replacedBy": null
}
```

## Seguridad

### Cookie httpOnly

El refresh token se almacena en una cookie con estos atributos:

```javascript
{
  httpOnly: true,      // JavaScript no puede leerla (protección XSS)
  secure: true,        // Solo se envía por HTTPS (en producción)
  sameSite: 'strict',  // Protección CSRF
  path: '/auth/refresh', // Solo se envía a este endpoint
  maxAge: 604800       // 7 días en segundos
}
```

### Rate Limiting

- **Login**: 5 intentos por minuto por email
- **Refresh**: 10 intentos por minuto por IP
- **Register**: 3 intentos por minuto por IP

### Almacenamiento de Tokens

- **Access Token**: Nunca se guarda en localStorage (vulnerable a XSS)
- **Refresh Token**: Se guarda en cookie httpOnly (no accesible por JavaScript)
- **En servidor**: Los refresh tokens se hashean con SHA-256 antes de almacenarse

## Diagrama de Flujo Completo

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO DE AUTENTICACIÓN                   │
└─────────────────────────────────────────────────────────────┘

1. LOGIN
   ┌─────────┐    ┌─────────┐    ┌─────────┐
   │ Usuario │───▶│ Backend │───▶│ Guardar │
   │         │    │         │    │ Token   │
   └─────────┘    └─────────┘    └─────────┘
        │              │              │
        ▼              ▼              ▼
   email/pass    Verificar      Refresh Token
                 Credenciales   (hashed en DB)

2. API CALL
   ┌─────────┐    ┌─────────┐
   │ Frontend│───▶│ Backend │
   │         │    │         │
   │ Access  │    │ Verificar│
   │ Token   │    │ JWT     │
   └─────────┘    └─────────┘
        │              │
        ▼              ▼
   Authorization   Decodificar
   Header          Payload

3. REFRESH (cuando expira access token)
   ┌─────────┐    ┌─────────┐    ┌─────────┐
   │ Frontend│───▶│ Backend │───▶│ Nuevo   │
   │         │    │         │    │ Token   │
   │ Error   │    │ Buscar  │    │         │
   │ 401     │    │ Refresh │    │         │
   └─────────┘    └─────────┘    └─────────┘
        │              │              │
        ▼              ▼              ▼
   Enviar cookie   Verificar      Generar nuevos
   a /refresh      No revocado    Access + Refresh

4. LOGOUT
   ┌─────────┐    ┌─────────┐    ┌─────────┐
   │ Frontend│───▶│ Backend │───▶│ Limpiar │
   │         │    │         │    │         │
   │ POST    │    │ Revocar│    │ Cookie  │
   │ /logout │    │ Tokens │    │         │
   └─────────┘    └─────────┘    └─────────┘
```

## Preguntas Frecuentes

### ¿Por qué no usar solo un JWT?

Si solo usaras JWTs:
- No podrías revocar un token robado (tendrías que esperar a que expire)
- No podrías cerrar sesión inmediatamente
- Un token robado daría acceso por 1 hora (o más si es largo)

### ¿Por qué el refresh token es una cookie httpOnly?

Para protegerlo de ataques XSS:
- JavaScript no puede leer cookies httpOnly
- Si un atacante inyecta script malicioso, no puede robar el refresh token
- Solo se envía al endpoint `/auth/refresh`

### ¿Qué pasa si roban mi refresh token?

El sistema detecta el robo:
1. Atacante usa el token robado
2. Token se marca como "usado"
3. Cuando el usuario legítimo intenta usarlo, el servidor detecta reuso
4. Se revocan TODOS los tokens de esa familia
5. Ambos deben volver a iniciar sesión

### ¿Por qué hay "familias" de tokens?

Las familias agrupan tokens relacionados:
- Cuando haces refresh, el nuevo token tiene el mismo `familyId`
- Si se detecta reuso, se revocan todos los tokens de la familia
- Esto limita el daño de un token robado

## Resumen de Endpoints

| Endpoint | Método | Descripción | Rate Limit |
|----------|--------|-------------|------------|
| `/auth/login` | POST | Iniciar sesión | 5/min por email |
| `/auth/register` | POST | Crear cuenta | 3/min por IP |
| `/auth/refresh` | POST | Rotar refresh token | 10/min por IP |
| `/auth/logout` | POST | Cerrar sesión | Sin límite |

## Ejemplo de Implementación Frontend

```javascript
// Interceptor de axios para manejar refresh automático
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response.status === 401) {
      try {
        // Intentar refresh
        const { data } = await axios.post('/auth/refresh');
        
        // Actualizar access token
        localStorage.setItem('accessToken', data.accessToken);
        
        // Reintentar petición original
        error.config.headers.Authorization = `Bearer ${data.accessToken}`;
        return axios(error.config);
      } catch (refreshError) {
        // Refresh falló, redirigir a login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

## Conclusión

El sistema de refresh tokens proporciona:
- **Seguridad**: Tokens de corta duración + detección de robo
- **Usabilidad**: No tener que iniciar sesión cada hora
- **Control**: Capacidad de cerrar sesión inmediatamente
- **Escalabilidad**: Soporte para múltiples sesiones

La clave es la separación entre el access token (para autorización) y el refresh token (para obtención de nuevos tokens), con el refresh token almacenado de forma segura en el servidor.