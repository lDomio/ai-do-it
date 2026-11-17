# Quickstart Validation Guide

**Date**: 2026-07-08  
**Feature**: Role-Based Login (002-role-based-login)  
**Purpose**: End-to-end validation scenarios for JWT authentication with token rotation

## Prerequisites

### 1. Environment Setup
```bash
# Navigate to project root
cd /home/luca/Documentos/UTN/3°/DdS/tp-individual-lDomio

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies (if needed)
cd ../frontend && npm install

# Return to project root
cd ..
```

### 2. Start Backend Server
```bash
# From project root
cd backend
npm run dev
# Server should start on http://localhost:3000
```

### 3. Environment Variables (Optional)
```bash
# Create .env file in backend directory
cat > backend/.env << EOF
JWT_SECRET=your-development-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret-key
PORT=3000
EOF
```

## Validation Scenarios

### Scenario 1: Basic Login Flow

**Test**: User can login with valid credentials

**Steps**:
1. Register a new user
2. Login with the new user
3. Verify tokens are returned

**Commands**:
```bash
# Register a new user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    "apellido": "User",
    -d 'email": "test@example.com",
    "password": "password123",
    "rol": "client"
  }'

# Expected Response (201):
# {
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "usuario": {
#     "id": "uuid-123",
#     "nombre": "Test",
#     "apellido": "User",
#     "email": "test@example.com",
#     "rol": "client"
#   }
# }

# Login with the user
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Expected Response (200):
# {
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "usuario": { ... }
# }
# Plus Set-Cookie header with refreshToken
```

**Validation**:
- ✅ Response contains access token
- ✅ Response contains user data
- ✅ Response includes Set-Cookie header for refresh token

### Scenario 2: Token Rotation Flow

**Test**: Refresh token rotation works correctly

**Steps**:
1. Login to get initial tokens
2. Use refresh endpoint to get new tokens
3. Verify old refresh token is revoked
4. Verify new refresh token works

**Commands**:
```bash
# Login and save cookies (using a tool that supports cookies)
# For simplicity, we'll simulate with curl and manual cookie handling

# Step 1: Login and extract refresh token from response headers
curl -v -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' 2>&1 | grep -i "set-cookie"

# Step 2: Extract refresh token value from cookie
# (In real app, browser would automatically store this)

# Step 3: Use refresh token to get new access token
curl -X POST http://localhost:3000/auth/refresh \
  -H "Cookie: refreshToken=YOUR_REFRESH_TOKEN_HERE"

# Expected Response (200):
# {
#   "accessToken": "NEW_JWT_TOKEN..."
# }
# Plus Set-Cookie header with new refresh token
```

**Validation**:
- ✅ New access token is returned
- ✅ New refresh token cookie is set
- ✅ Old refresh token is marked as revoked (server-side)

### Scenario 3: Role-Based Access Control

**Test**: Different roles see different interface options

**Steps**:
1. Create users with different roles
2. Login with each role
3. Verify appropriate permissions

**Commands**:
```bash
# Create admin user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Admin",
    "apellido": "User",
    "email": "admin@example.com",
    "password": "admin123",
    "rol": "admin"
  }'

# Create freelancer user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Freelancer",
    "apellido": "User",
    "email": "freelancer@example.com",
    "password": "freelancer123",
    "rol": "freelancer"
  }'

# Login as admin
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'

# Expected: Admin token with rol: "admin"

# Login as freelancer
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "freelancer@example.com",
    "password": "freelancer123"
  }'

# Expected: Freelancer token with rol: "freelancer"
```

**Validation**:
- ✅ Admin users get admin role in token
- ✅ Freelancer users get freelancer role in token
- ✅ Role-based middleware can restrict access

### Scenario 4: Security Features

**Test**: Token revocation and security measures

**Steps**:
1. Login to get tokens
2. Logout to revoke tokens
3. Try to use revoked refresh token
4. Verify token reuse detection

**Commands**:
```bash
# Login
curl -v -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' 2>&1 | grep -i "set-cookie"

# Extract refresh token

# Logout
curl -X POST http://localhost:3000/auth/logout \
  -H "Cookie: refreshToken=YOUR_REFRESH_TOKEN_HERE"

# Expected Response (200):
# { "success": true }

# Try to use the same refresh token again
curl -X POST http://localhost:3000/auth/refresh \
  -H "Cookie: refreshToken=YOUR_REFRESH_TOKEN_HERE"

# Expected Response (401):
# { "error": "Token reuse detected. All sessions revoked." }
```

**Validation**:
- ✅ Logout revokes all refresh tokens
- ✅ Revoked token cannot be reused
- ✅ Token reuse detection works

### Scenario 5: Rate Limiting

**Test**: Rate limiting prevents brute force attacks

**Steps**:
1. Attempt multiple rapid logins
2. Verify rate limiting kicks in

**Commands**:
```bash
# Attempt 6 rapid logins (should hit rate limit at 5)
for i in {1..6}; do
  echo "Attempt $i:"
  curl -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com",
      "password": "wrongpassword"
    }'
  echo ""
done

# Expected: First 5 attempts return 401
# 6th attempt returns 429: { "error": "Demasiados intentos..." }
```

**Validation**:
- ✅ Rate limiting activates after 5 attempts
- ✅ Returns 429 status code
- ✅ Prevents brute force attacks

## Frontend Integration Test

### Manual Test with Browser Developer Tools

**Steps**:
1. Open browser developer tools (F12)
2. Go to Network tab
3. Login via frontend
4. Observe token storage
5. Test token refresh

**Validation Points**:
- ✅ Access token stored in JavaScript memory (not localStorage)
- ✅ Refresh token stored in httpOnly cookie
- ✅ Automatic token refresh when access token expires
- ✅ Proper logout clears both tokens

## Automated Test Suite

### Run Existing Tests
```bash
# From backend directory
cd backend
npm test

# Run specific auth tests
npm test -- --testPathPattern=auth
```

### Expected Test Coverage
- ✅ Login/Register endpoints
- ✅ Token generation and validation
- ✅ Refresh token rotation
- ✅ Logout and token revocation
- ✅ Role-based access control
- ✅ Rate limiting

## Troubleshooting

### Common Issues

1. **Server not starting**
   - Check if port 3000 is in use
   - Verify Node.js version (20+)
   - Check for missing dependencies

2. **Token not being set**
   - Verify Set-Cookie header in response
   - Check cookie attributes (httpOnly, secure)
   - Ensure HTTPS in production

3. **Refresh token rotation not working**
   - Check RefreshTokenRepository implementation
   - Verify token family tracking
   - Check reuse detection logic

4. **Rate limiting not working**
   - Verify rate limiting middleware
   - Check IP/email tracking
   - Ensure proper 429 response

### Debug Mode
```bash
# Start server with debug logging
DEBUG=auth:* npm run dev

# Or set environment variable
NODE_ENV=development npm run dev
```

## Success Criteria Validation

Based on spec.md success criteria:

- **SC-001**: Users can complete login in under 30 seconds → ✅ Test Scenario 1
- **SC-002**: 99% of valid logins succeed → ✅ Test Scenario 1 (happy path)
- **SC-003**: Invalid logins show error within 2 seconds → ✅ Test Scenario 1 (error cases)
- **SC-004**: Role-based interface loads within 1 second → ✅ Test Scenario 3
- **SC-005**: Session persistence works for 95% → ✅ Test Scenario 2
- **SC-006**: 100% unauthorized access blocked → ✅ Test Scenario 4

## Next Steps After Validation

1. **Implement token rotation in AuthService**
2. **Add refresh and logout endpoints**
3. **Implement rate limiting middleware**
4. **Update frontend for token refresh**
5. **Add comprehensive tests**
6. **Update documentation**