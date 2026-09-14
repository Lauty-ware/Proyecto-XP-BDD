import { Request, Response, NextFunction } from 'express';
import { Container } from '../../../container';

export class ReservationController {
  constructor(private readonly c: Container) {}

  reserve = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userEmail, roomName, date } = req.body;
      const reservation = await this.c.reserveRoom.execute({ userEmail, roomName, date });
      res.status(201).json(reservation);
    } catch (e) {
      next(e);
    }
  };

  cancel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userEmail, roomName, date } = req.body;
      await this.c.cancelReservation.execute({ userEmail, roomName, date });
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };
}