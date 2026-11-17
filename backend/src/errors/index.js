export class AppError extends Error {
  constructor(message, status = 500, details) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    if (details !== undefined) {
      this.details = details;
    }
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', details) {
    super(message, 404, details);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details) {
    super(message, 400, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', details) {
    super(message, 403, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict', details) {
    super(message, 409, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', details) {
    super(message, 401, details);
  }
}

export class CamposInvalidos extends AppError {
  constructor(message = 'Campos Faltantes', details) {
    super(message, 500, details);
  }
}
