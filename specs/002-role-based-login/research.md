# Research: JWT Authentication with Token Rotation

**Date**: 2026-07-08  
**Feature**: Role-Based Login (002-role-based-login)  
**Research Focus**: JWT implementation with 1-hour access tokens and refresh token rotation

## Decision 1: Access Token Expiration

**Decision**: Set access token expiration to 1 hour (3600 seconds)

**Rationale**: 
- User requested 1-hour expiration for convenience
- Balances security and usability for this educational project
- Standard range is 5-15 minutes for production, but 1 hour is acceptable for development/learning
- Shorter expiration (15 min) would require more frequent refresh calls, which may be cumbersome for learning

**Alternatives Considered**:
1. **15 minutes (standard)**: More secure but less convenient for learning; would require refresh token implementation earlier
2. **24 hours (current)**: Too long; violates security best practices and user's requirement
3. **30 minutes**: Compromise but user explicitly requested 1 hour

## Decision 2: Refresh Token Storage Strategy

**Decision**: Store refresh tokens in-memory using array with Repository pattern

**Rationale**:
- Project uses in-memory persistence (per constitution and requirements)
- Repository pattern already established (UsuarioRepository)
- Consistent with existing architecture
- Simple implementation for educational purposes
- No external dependencies (Redis, database)

**Alternatives Considered**:
1. **Database storage**: More production-ready but adds complexity and external dependency
2. **Redis**: Excellent for token revocation but overkill for this project
3. **JWT-only (no refresh tokens)**: Simpler but doesn't meet user's rotation requirement

## Decision 3: Token Rotation Pattern

**Decision**: Implement refresh token rotation with family-based revocation

**Rationale**:
- User specifically requested "token rotativos" (token rotation)
- Industry best practice for JWT security
- Detects token theft through reuse detection
- Aligns with OAuth 2.0 recommendations (RFC 6749 Section 10.4)
- Provides learning opportunity for advanced authentication concepts

**Implementation Details**:
- Each login creates a "family" of refresh tokens
- On each refresh: invalidate old token, issue new token in same family
- If a revoked token is reused: revoke entire family (security measure)
- Store: `{ token, userId, familyId, createdAt, revokedAt, replacedBy }`

## Decision 4: Refresh Token Format

**Decision**: Use opaque random strings (not JWT) for refresh tokens

**Rationale**:
- Refresh tokens are stored server-side and looked up by value
- No need for JWT claims (user info) in refresh token
- Random strings are simpler and leak no information if intercepted
- Aligns with security best practices from research

**Alternatives Considered**:
1. **JWT refresh tokens**: Could embed user info but unnecessary since we lookup by token
2. **UUIDs**: Less random than crypto.randomBytes

## Decision 5: Token Storage Mechanism

**Decision**: Store access token in memory (variable), refresh token in httpOnly cookie

**Rationale**:
- Access token: Short-lived, stored in JavaScript memory (not localStorage)
- Refresh token: Long-lived, stored in httpOnly cookie for XSS protection
- Cookie attributes: `httpOnly`, `Secure` (in production), `SameSite=Strict`, `path: '/auth/refresh'`
- Aligns with security best practices from research

## Decision 6: Secret Management

**Decision**: Use separate secrets for access and refresh tokens

**Rationale**:
- If one secret is compromised, the other remains safe
- Follows principle of least privilege
- Simple implementation with environment variables

**Implementation**:
- `JWT_SECRET` for access tokens (existing)
- `REFRESH_TOKEN_SECRET` for refresh tokens (new)
- Both stored in environment variables with fallback defaults for development

## Decision 7: Logout Implementation

**Decision**: Revoke all refresh tokens for user on logout

**Rationale**:
- Simple implementation for learning
- Provides "log out everywhere" functionality
- User can later implement per-session logout if needed

**Implementation**:
- On logout: mark all non-revoked refresh tokens for user as revoked
- Clear refresh token cookie
- Access token expires naturally within 1 hour

## Decision 8: Rate Limiting

**Decision**: Implement basic rate limiting on auth endpoints

**Rationale**:
- Prevents brute force attacks
- Requirement mentions "max 5 attempts per minute"
- Simple middleware implementation

**Implementation**:
- Track login attempts per IP/email
- Limit: 5 attempts per minute per email
- Return 429 Too Many Requests with appropriate message

## Research Findings Summary

### Security Best Practices Identified:
1. **Short access tokens**: 5-15 minutes standard; we're using 1 hour (less secure but acceptable for learning)
2. **Refresh token rotation**: Essential for security; we'll implement with reuse detection
3. **httpOnly cookies**: For refresh tokens to prevent XSS attacks
4. **Separate secrets**: For access and refresh tokens
5. **Server-side storage**: Refresh tokens must be stored server-side for revocation
6. **Reuse detection**: Critical for detecting token theft
7. **Rate limiting**: Prevent brute force attacks
8. **HTTPS**: Required in production for secure cookie transmission

### Implementation Patterns:
1. **Token family grouping**: Track related refresh tokens for batch revocation
2. **Opaque refresh tokens**: Random strings, not JWTs
3. **Cookie scoping**: Refresh token cookie only sent to refresh endpoint
4. **Graceful degradation**: Access token expires, refresh token provides new pair
5. **Logout revocation**: Delete all refresh tokens for user

### Trade-offs Accepted:
1. **Convenience vs Security**: 1-hour access token is less secure than 15-minute but more convenient for learning
2. **In-memory vs Persistent**: In-memory storage loses tokens on server restart (acceptable for development)
3. **Complexity vs Learning**: Token rotation adds complexity but provides valuable learning opportunity

## Open Questions Resolved

1. **Q: How long should access tokens last?** → A: 1 hour (user specified)
2. **Q: Should refresh tokens be JWTs?** → A: No, use opaque random strings
3. **Q: Where to store refresh tokens?** → A: In-memory with Repository pattern
4. **Q: How to handle token theft?** → A: Family-based revocation with reuse detection
5. **Q: What cookie attributes for refresh tokens?** → A: httpOnly, Secure, SameSite=Strict, path='/auth/refresh'

## Next Steps

1. Implement RefreshTokenRepository with in-memory storage
2. Update AuthService with refresh token generation and rotation
3. Add refresh and logout endpoints
4. Implement rate limiting middleware
5. Update frontend to handle token refresh
6. Create comprehensive tests for token rotation