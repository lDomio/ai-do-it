# Data Model: Role-Based Login with JWT Authentication

**Date**: 2026-07-08  
**Feature**: Role-Based Login (002-role-based-login)  
**Research**: Based on research.md findings

## Entities Overview

### 1. User (Existing)

**Purpose**: Represents a system user with authentication credentials and role

**Attributes**:
- `id`: Unique identifier (string/UUID)
- `nombre`: First name (string)
- `apellido`: Last name (string)
- `email`: Email address (string, unique)
- `passwordHash`: Hashed password (string, private)
- `rol`: User role (enum: admin, client, freelancer)
- `activo`: Account status (boolean)
- `favoritos`: List of favorite gigs (array)

**Relationships**:
- Has many RefreshTokens (one-to-many)
- Has role-based permissions (role determines accessible features)

**Validation Rules**:
- Email must be unique and valid format
- Password must be hashed with bcrypt (cost factor 10)
- Role must be one of predefined values (admin, client, freelancer)
- Account can be activated/deactivated

**State Transitions**:
- Active → Inactive (via `desactivar()`)
- Inactive → Active (via `activar()`)

### 2. RefreshToken (New)

**Purpose**: Represents a refresh token for JWT rotation pattern

**Attributes**:
- `id`: Unique identifier (string/UUID)
- `token`: Opaque random string (string, unique)
- `userId`: Reference to User (string)
- `familyId`: Token family identifier (string) - groups tokens from same login session
- `createdAt`: Creation timestamp (Date)
- `expiresAt`: Expiration timestamp (Date)
- `revokedAt`: Revocation timestamp (Date, nullable)
- `replacedBy`: Hash of token that replaced this one (string, nullable)

**Relationships**:
- Belongs to User (many-to-one)
- Part of a token family (grouping for revocation)

**Validation Rules**:
- Token must be unique (SHA-256 hashed before storage)
- Expiration must be in the future at creation
- RevokedAt must be null or after creation time
- ReplacedBy must reference valid token hash

**State Transitions**:
- Active → Used (via rotation)
- Active → Revoked (via logout or security violation)
- Used → Deleted (via cleanup)

### 3. Role (Existing Enum)

**Purpose**: Defines user roles and associated permissions

**Values**:
- `ADMIN`: Full system access
- `CLIENT`: Project management, freelancer hiring
- `FREELANCER`: Gig browsing, proposal submission

**Permissions Matrix** (Basic role restrictions):
| Feature                  | Admin | Client | Freelancer |
|--------------------------|-------|--------|------------|
| Manage Users             | ✓     | ✗      | ✗          |
| System Settings          | ✓     | ✗      | ✗          |
| Analytics                | ✓     | ✗      | ✗          |
| My Projects              | ✗     | ✓      | ✗          |
| Find Freelancers         | ✗     | ✓      | ✗          |
| Messages                 | ✓     | ✓      | ✓          |
| Available Gigs           | ✗     | ✗      | ✓          |
| My Proposals             | ✗     | ✗      | ✓          |
| Earnings                 | ✗     | ✗      | ✓          |

## Data Storage Strategy

### In-Memory Storage (Current Implementation)

**User Storage**: Array of User objects (existing)

**RefreshToken Storage**: Array of RefreshToken objects (new)
```javascript
// Example structure
const refreshTokens = [
  {
    id: 'uuid-1',
    token: 'opaque-random-string-1',
    userId: 'user-uuid-1',
    familyId: 'family-uuid-1',
    createdAt: new Date('2026-07-08T10:00:00Z'),
    expiresAt: new Date('2026-07-15T10:00:00Z'),
    revokedAt: null,
    replacedBy: null
  }
];
```

**Advantages**:
- Simple implementation
- No external dependencies
- Consistent with existing architecture
- Good for learning/development

**Disadvantages**:
- Data lost on server restart
- Not scalable
- No persistence

### Future Considerations (Production)

**Database Storage**: PostgreSQL with Prisma schema (as per research)
**Redis Cache**: For token revocation lists if needed
**TTL Indexes**: Automatic cleanup of expired tokens

## Token Rotation Flow

### 1. Login Flow
```
User → POST /auth/login → AuthService
  ↓
  Validate credentials
  ↓
  Generate access token (JWT, 1h expiry)
  ↓
  Generate refresh token (opaque, 7d expiry)
  ↓
  Store refresh token in-memory
  ↓
  Set httpOnly cookie with refresh token
  ↓
  Return access token in response body
```

### 2. Refresh Flow
```
Client → POST /auth/refresh (sends refresh token cookie)
  ↓
  Validate refresh token exists and not expired
  ↓
  Check if token revoked (reuse detection)
  ↓
  If revoked: Revoke entire family (security violation)
  ↓
  Mark current token as used/revoked
  ↓
  Generate new access token (1h)
  ↓
  Generate new refresh token (7d) in same family
  ↓
  Store new refresh token
  ↓
  Set new httpOnly cookie
  ↓
  Return new access token
```

### 3. Logout Flow
```
Client → POST /auth/logout (sends refresh token cookie)
  ↓
  Find refresh token
  ↓
  Revoke all refresh tokens for user
  ↓
  Clear refresh token cookie
  ↓
  Return success
```

## Security Considerations

### Token Storage
- **Access Token**: JavaScript memory only (never localStorage)
- **Refresh Token**: httpOnly cookie (XSS protection)
- **Cookie Attributes**: `httpOnly`, `Secure` (prod), `SameSite=Strict`, `path: '/auth/refresh'`

### Token Expiration
- **Access Token**: 1 hour (3600 seconds)
- **Refresh Token**: 7 days (604800 seconds)
- **Absolute Expiration**: Refresh tokens expire regardless of rotation

### Revocation Strategy
- **Logout**: Revoke all refresh tokens for user
- **Password Change**: Revoke all refresh tokens for user
- **Security Violation**: Revoke entire token family
- **Account Deactivation**: Revoke all refresh tokens for user

### Rate Limiting
- **Login Endpoint**: 5 attempts per minute per email
- **Refresh Endpoint**: 10 attempts per minute per IP
- **Response**: 429 Too Many Requests

## Implementation Notes

### Existing Code Integration
- **AuthService**: Already handles login/register; needs refresh/logout methods
- **Auth Middleware**: Already verifies JWT; needs to handle token rotation
- **UsuarioRepository**: Already manages users; pattern to follow for RefreshTokenRepository

### New Components Needed
1. **RefreshTokenRepository**: CRUD operations for refresh tokens
2. **RefreshTokenService**: Business logic for token rotation
3. **Rate Limiting Middleware**: Prevent brute force attacks
4. **Token Cleanup Service**: Periodic removal of expired tokens

### Testing Strategy
- **Unit Tests**: RefreshTokenRepository, RefreshTokenService
- **Integration Tests**: Auth endpoints with token rotation
- **Security Tests**: Reuse detection, rate limiting, cookie security
- **Edge Cases**: Expired tokens, revoked tokens, concurrent refreshes

## Compliance with Constitution

### SOLID Principles
- **SRP**: RefreshTokenRepository handles only token storage
- **OCP**: Token rotation can be extended without modifying existing code
- **LSP**: Not applicable (no inheritance)
- **ISP**: Focused interfaces for token operations
- **DIP**: Depends on abstractions, not concrete implementations

### Design Patterns
- **Repository Pattern**: RefreshTokenRepository follows existing pattern
- **Strategy Pattern**: Token generation strategies can be swapped
- **Observer Pattern**: Can be used for token expiration events

### Quality Attributes
- **Flexibility**: Token expiration times easily adjustable
- **Robustness**: Proper error handling for token validation failures
- **Low Coupling**: Auth module decoupled from business logic
- **Simplicity**: Standard JWT implementation without over-engineering
- **High Cohesion**: Token-related functions grouped together