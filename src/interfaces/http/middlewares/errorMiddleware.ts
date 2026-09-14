import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../../domain/errors/DomainError';

const statusByCode: Record<string, number> = {
  EMAIL_TAKEN: 409,
  INVALID_EMAIL: 400,
  WEAK_PASSWORD: 400,
  INVALID_CREDENTIALS: 401,
  USER_NOT_FOUND: 404,
  ROOM_NOT_FOUND: 404,
  ROOM_UNAVAILABLE: 409,
  INSUFFICIENT_BALANCE: 402,
  RESERVATION_NOT_FOUND: 404,
  ROOM_HAS_RESERVATIONS: 409,
  ROOM_TAKEN: 409,
  INVALID_ROOM: 400
};

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof DomainError) {
    res.status(statusByCode[err.code] ?? 400).json({ error: err.message, code: err.code });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
}