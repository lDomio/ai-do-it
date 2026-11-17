# API Contract: Authentication Endpoints

**Date**: 2026-07-08  
**Feature**: Role-Based Login (002-role-based-login)  
**Base URL**: `/auth`

## Endpoints Overview

### 1. POST /auth/login

**Purpose**: Authenticate user and receive tokens

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securePass123"
}
```

**Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "uuid-123",
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "user@example.com",
    "rol": "client"
  }
}
```

**Response (401 Unauthorized)**:
```json
{
  "error": "Email o password inválidos"
}
```

**Response (429 Too Many Requests)**:
```json
{
  "error": "Demasiados intentos. Intente de nuevo en 1 minuto"
}
```

**Headers**:
- `Set-Cookie`: `refreshToken=opaque-string; HttpOnly; Secure; SameSite=Strict; Path=/auth/refresh; Max-Age=604800`

**Notes**:
- Access token returned in response body
- Refresh token set as httpOnly cookie
- Rate limited: 5 attempts per minute per email

### 2. POST /auth/register

**Purpose**: Create new user account

**Request**:
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "user@example.com",
  "password": "securePass123",
  "rol": "client"
}
```

**Response (201 Created)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "uuid-123",
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "user@example.com",
    "rol": "client"
  }
}
```

**Response (409 Conflict)**:
```json
{
  "error": "Ya existe una cuenta con ese email"
}
```

**Response (400 Bad Request)**:
```json
{
  "error": "Nombre, apellido, email y password son requeridos"
}
```

**Notes**:
- Password is hashed server-side (bcrypt, cost factor 10)
- Role defaults to "client" if not provided
- Returns both access token and refresh token (as cookie)

### 3. POST /auth/refresh

**Purpose**: Rotate refresh token and get new access token

**Request**:
- No body required
- Refresh token sent as httpOnly cookie

**Response (200 OK)**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (401 Unauthorized)**:
```json
{
  "error": "No refresh token"
}
```

**Response (401 Unauthorized - Token Reuse)**:
```json
{
  "error": "Token reuse detected. All sessions revoked."
}
```

**Headers**:
- `Set-Cookie`: `refreshToken=new-opaque-string; HttpOnly; Secure; SameSite=Strict; Path=/auth/refresh; Max-Age=604800`

**Notes**:
- Implements token rotation: old token revoked, new token issued
- Reuse detection: if revoked token is reused, entire family revoked
- New refresh token set as httpOnly cookie
- Access token returned in response body

### 4. POST /auth/logout

**Purpose**: Terminate user session

**Request**:
- No body required
- Refresh token sent as httpOnly cookie

**Response (200 OK)**:
```json
{
  "success": true
}
```

**Headers**:
- `Set-Cookie`: `refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/auth/refresh; Max-Age=0`

**Notes**:
- Revokes all refresh tokens for user
- Clears refresh token cookie
- Access token expires naturally (1 hour)

## Data Models

### User
```typescript
interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'admin' | 'client' | 'freelancer';
  activo: boolean;
}
```

### RefreshToken
```typescript
interface RefreshToken {
  id: string;
  token: string;          // SHA-256 hashed
  userId: string;
  familyId: string;
  createdAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
  replacedBy: string | null;  // hash of replacement token
}
```

### AuthTokens
```typescript
interface AuthTokens {
  accessToken: string;    // JWT, 1h expiry
  refreshToken: string;   // Opaque, 7d expiry
  familyId: string;       // Token family identifier
}
```

## Security Specifications

### Token Expiration
- **Access Token**: 1 hour (3600 seconds)
- **Refresh Token**: 7 days (604800 seconds)

### Cookie Attributes
- **httpOnly**: true (JavaScript cannot read)
- **Secure**: true (HTTPS only in production)
- **SameSite**: Strict (CSRF protection)
- **Path**: `/auth/refresh` (only sent to refresh endpoint)
- **Max-Age**: 604800 seconds (7 days)

### Rate Limiting
- **Login**: 5 attempts per minute per email
- **Refresh**: 10 attempts per minute per IP
- **Register**: 3 attempts per minute per IP

### Token Rotation Rules
1. Each refresh token can only be used once
2. On use: old token revoked, new token issued in same family
3. If revoked token is reused: entire family revoked
4. Logout revokes all tokens for user

## Error Handling

### Standard Error Response
```json
{
  "error": "Error message in Spanish"
}
```

### HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (resource already exists)
- **429**: Too Many Requests (rate limit exceeded)
- **500**: Internal Server Error

## Implementation Notes

### Existing Code Integration
- **AuthController**: Already handles login/register; needs refresh/logout methods
- **AuthService**: Already handles authentication; needs token rotation logic
- **Auth Middleware**: Already verifies JWT; no changes needed

### New Endpoints Required
1. **POST /auth/refresh**: Token rotation endpoint
2. **POST /auth/logout**: Session termination endpoint

### Frontend Integration
- Store access token in JavaScript memory (variable)
- Handle 401 responses by calling /auth/refresh
- Implement token refresh before expiration
- Handle logout by clearing access token and calling /auth/logout

## Testing Scenarios

### Happy Path
1. Login → receive tokens
2. Use access token for API calls
3. When access token expires, use refresh token
4. Receive new tokens
5. Continue using new access token
6. Logout → revoke all tokens

### Security Scenarios
1. **Token Theft**: If refresh token stolen, legitimate user's refresh will trigger reuse detection
2. **Concurrent Sessions**: Multiple devices can have valid tokens
3. **Token Expiration**: Access token expires after 1 hour, refresh token after 7 days
4. **Logout**: All tokens revoked immediately

### Edge Cases
1. **Missing Refresh Token**: Return 401
2. **Expired Refresh Token**: Return 401
3. **Revoked Refresh Token**: Revoke entire family
4. **Invalid Token Format**: Return 401
5. **Rate Limit Exceeded**: Return 429