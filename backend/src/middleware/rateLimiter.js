export class RateLimiter {
  #requests; // Map<string, { count: number, resetTime: number }>
  #windowMs;

  constructor(windowMs = 60000) {
    this.#requests = new Map();
    this.#windowMs = windowMs;
  }

  #getKey(req, identifier) {
    return `${identifier}`;
  }

  #cleanup() {
    const now = Date.now();
    for (const [key, data] of this.#requests.entries()) {
      if (data.resetTime < now) {
        this.#requests.delete(key);
      }
    }
  }

  middleware(identifierFn) {
    return (req, res, next) => {
      this.#cleanup();
      const identifier = identifierFn(req);
      const key = this.#getKey(req, identifier);
      const now = Date.now();

      let requestData = this.#requests.get(key);
      if (!requestData || requestData.resetTime < now) {
        requestData = { count: 0, resetTime: now + this.#windowMs };
        this.#requests.set(key, requestData);
      }

      requestData.count++;

      if (requestData.count > 5) {
        // 5 attempts per minute
        return res.status(429).json({
          error: 'Demasiados intentos. Intente de nuevo en 1 minuto',
        });
      }

      next();
    };
  }
}

export const loginRateLimiter = new RateLimiter(60000).middleware(
  (req) => `login:${req.body.email || 'unknown'}`
);

export const refreshRateLimiter = new RateLimiter(60000).middleware((req) => `refresh:${req.ip}`);

export const registerRateLimiter = new RateLimiter(60000).middleware((req) => `register:${req.ip}`);
