import { AuthService } from '../services/AuthService.js';
import { RefreshTokenService } from '../services/RefreshTokenService.js';

export class AuthController {
  #service;
  #refreshTokenService;

  constructor(service = new AuthService(), refreshTokenService = new RefreshTokenService()) {
    this.#service = service;
    this.#refreshTokenService = refreshTokenService;
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const resultado = await this.#service.login(email, password);

      // Set refresh token as httpOnly cookie
      this.#setRefreshTokenCookie(res, resultado.refreshToken);

      // Remove refreshToken from response body
      const { refreshToken, ...response } = resultado;
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const resultado = await this.#service.register(req.body);

      // Set refresh token as httpOnly cookie
      this.#setRefreshTokenCookie(res, resultado.refreshToken);

      // Remove refreshToken from response body
      const { refreshToken, ...response } = resultado;
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ error: 'No refresh token' });
      }

      const newTokens = this.#refreshTokenService.rotateRefreshToken(refreshToken);

      // Set new refresh token cookie
      this.#setRefreshTokenCookie(res, newTokens.token);

      // Generate new access token with user ID (and we need role, but we don't have it)
      // For now, we'll generate a token with just ID and default role
      const accessToken = this.#refreshTokenService.generateAccessToken(newTokens.userId);

      // Return new access token
      res.json({ accessToken });
    } catch (error) {
      if (error.message === 'Token reuse detected. All sessions revoked.') {
        // Clear cookie on security violation
        res.clearCookie('refreshToken', { path: '/auth/refresh' });
        return res.status(401).json({ error: error.message });
      }
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (refreshToken) {
        const userId = this.#refreshTokenService.getUserIdFromToken(refreshToken);
        if (userId) {
          this.#refreshTokenService.revokeAllUserTokens(userId);
        }
      }

      // Clear cookie
      res.clearCookie('refreshToken', { path: '/auth/refresh' });
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  #setRefreshTokenCookie(res, token) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    res.cookie('refreshToken', token, cookieOptions);
  }
}
