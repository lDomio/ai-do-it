import { refreshTokenRepository } from '../repositories/refreshTokenSingleton.js';

export class TokenCleanupService {
  #repository;
  #intervalId;
  #intervalMs;

  constructor(repository = refreshTokenRepository, intervalMs = 3600000) {
    // 1 hour
    this.#repository = repository;
    this.#intervalMs = intervalMs;
  }

  start() {
    if (this.#intervalId) return;
    this.#intervalId = setInterval(() => {
      const deleted = this.#repository.deleteExpired();
      if (deleted > 0) {
        console.log(`Cleaned up ${deleted} expired refresh tokens`);
      }
    }, this.#intervalMs);
    console.log('Token cleanup service started');
  }

  stop() {
    if (this.#intervalId) {
      clearInterval(this.#intervalId);
      this.#intervalId = null;
      console.log('Token cleanup service stopped');
    }
  }
}
