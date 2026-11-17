import { AppError, NotFoundError } from '../errors/index.js';

export function errorHandler(err, req, res, next) {
  const status = err instanceof AppError ? err.status : 500;
  const message = err.message ?? 'Internal Server Error';

  if (status >= 500) {
    console.error(`[${req.method} ${req.path}]`, err);
  }

  res.status(status).json({
    error: message,
    ...(err.details && { details: err.details }),
  });
}
