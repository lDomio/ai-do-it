import { RefreshTokenRepository } from './RefreshTokenRepository.js';

// Singleton instance for in-memory storage
export const refreshTokenRepository = new RefreshTokenRepository();
