import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../../infraestructure/jwt/JwtService';

export function authMiddleware(tokens: JwtService) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Token requerido' });
      return;
    }
    try {
      const payload = tokens.verify(header.slice(7));
      (req as Request & { user?: unknown }).user = payload;
      next();
    } catch {
      res.status(401).json({ error: 'Token inválido' });
    }
  };
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const user = (req as Request & { user?: { role?: string } }).user;
  if (user?.role !== 'admin') {
    res.status(403).json({ error: 'Acceso denegado' });
    return;
  }
  next();
}