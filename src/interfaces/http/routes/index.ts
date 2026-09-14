import { Router } from 'express';
import { Container } from '../../../container';
import { AuthController } from '../controllers/AuthController';
import { RoomController } from '../controllers/RoomController';
import { ReservationController } from '../controllers/ReservationController';
import { authMiddleware, requireAdmin } from '../middlewares/authMiddleware';

export function buildRouter(c: Container): Router {
  const router = Router();
  const auth = new AuthController(c);
  const rooms = new RoomController(c);
  const reservations = new ReservationController(c);

  router.post('/auth/register', auth.register);
  router.post('/auth/login', auth.login);

  router.get('/rooms', rooms.list);
  router.post('/rooms', authMiddleware(c.tokens), requireAdmin, rooms.create);
  router.delete('/rooms/:name', authMiddleware(c.tokens), requireAdmin, rooms.remove);

  router.post('/reservations', reservations.reserve);
  router.delete('/reservations', reservations.cancel);

  router.get('/health', (_req, res) => res.json({ status: 'ok' }));
  return router;
}