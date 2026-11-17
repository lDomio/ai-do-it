import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { refreshTokenRepository } from '../repositories/refreshTokenSingleton.js';
import { generateRefreshToken } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET;

export class RefreshTokenService {
  #repository;

  constructor(repository = refreshTokenRepository) {
    this.#repository = repository;
  }

  createRefreshToken(userId) {
    const token = generateRefreshToken();
    const familyId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const refreshToken = this.#repository.create({
      token,
      userId,
      familyId,
      expiresAt,
    });

    return { token, familyId, expiresAt };
  }

  rotateRefreshToken(oldToken) {
    const storedToken = this.#repository.findByToken(oldToken);

    if (!storedToken) {
      throw new Error('Invalid refresh token');
    }

    if (storedToken.revokedAt) {
      // Token reuse detected - revoke entire family
      this.#revokeFamily(storedToken.familyId);
      throw new Error('Token reuse detected. All sessions revoked.');
    }

    if (storedToken.expiresAt < new Date()) {
      throw new Error('Refresh token expired');
    }

    // Mark current token as used
    this.#repository.revokeToken(oldToken);

    // Generate new token in same family
    const newToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const newStoredToken = this.#repository.create({
      token: newToken,
      userId: storedToken.userId,
      familyId: storedToken.familyId,
      expiresAt,
    });

    // Update replacedBy reference
    newStoredToken.replacedBy = storedToken.token;

    return {
      token: newToken,
      familyId: storedToken.familyId,
      expiresAt,
      userId: storedToken.userId,
    };
  }

  revokeAllUserTokens(userId) {
    return this.#repository.revokeAllByUserId(userId);
  }

  getUserIdFromToken(token) {
    const storedToken = this.#repository.findByToken(token);
    if (!storedToken) return null;
    return storedToken.userId;
  }

  generateAccessToken(userId, rol = 'client') {
    return jwt.sign({ id: userId, rol }, JWT_SECRET, { expiresIn: '1h' });
  }

  #revokeFamily(familyId) {
    const familyTokens = this.#repository.findFamilyTokens(familyId);
    for (const token of familyTokens) {
      if (!token.revokedAt) {
        token.revokedAt = new Date();
      }
    }
  }
}
