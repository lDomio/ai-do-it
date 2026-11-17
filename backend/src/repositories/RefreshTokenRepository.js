import crypto from 'crypto';

export class RefreshTokenRepository {
  #tokens; // Map<hashedToken, RefreshToken>
  #idCounter;

  constructor() {
    this.#tokens = new Map();
    this.#idCounter = 1;
  }

  create({ token, userId, familyId, expiresAt }) {
    const id = String(this.#idCounter++);
    const hashedToken = this.#hashToken(token);
    const refreshToken = {
      id,
      token: hashedToken,
      userId,
      familyId,
      createdAt: new Date(),
      expiresAt,
      revokedAt: null,
      replacedBy: null,
    };
    this.#tokens.set(hashedToken, refreshToken);
    return refreshToken;
  }

  findByToken(token) {
    const hashedToken = this.#hashToken(token);
    return this.#tokens.get(hashedToken) ?? null;
  }

  findByUserId(userId) {
    const tokens = [];
    for (const refreshToken of this.#tokens.values()) {
      if (refreshToken.userId === userId) {
        tokens.push(refreshToken);
      }
    }
    return tokens;
  }

  revokeToken(token) {
    const hashedToken = this.#hashToken(token);
    const refreshToken = this.#tokens.get(hashedToken);
    if (!refreshToken) return false;
    refreshToken.revokedAt = new Date();
    return true;
  }

  revokeAllByUserId(userId) {
    let count = 0;
    for (const refreshToken of this.#tokens.values()) {
      if (refreshToken.userId === userId && !refreshToken.revokedAt) {
        refreshToken.revokedAt = new Date();
        count++;
      }
    }
    return count;
  }

  findFamilyTokens(familyId) {
    const tokens = [];
    for (const refreshToken of this.#tokens.values()) {
      if (refreshToken.familyId === familyId) {
        tokens.push(refreshToken);
      }
    }
    return tokens;
  }

  deleteExpired() {
    const now = new Date();
    let count = 0;
    for (const [hashedToken, refreshToken] of this.#tokens.entries()) {
      if (refreshToken.expiresAt < now) {
        this.#tokens.delete(hashedToken);
        count++;
      }
    }
    return count;
  }

  #hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
