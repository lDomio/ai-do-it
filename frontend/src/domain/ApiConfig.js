export class ApiConfig {
  constructor(baseUrl = 'http://localhost:3000', timeoutMs = 5000) {
    if (typeof baseUrl !== 'string' || baseUrl.trim() === '') {
      throw new Error('ApiConfig: baseUrl MUST be a non-empty string');
    }
    if (typeof timeoutMs !== 'number' || timeoutMs <= 0) {
      throw new Error('ApiConfig: timeoutMs MUST be a positive number');
    }
    this.baseUrl = baseUrl.trim();
    this.timeoutMs = timeoutMs;
  }

  healthUrl() {
    return `${this.baseUrl}/health`;
  }
}
