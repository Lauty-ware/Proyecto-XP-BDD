import { Request, Response, NextFunction } from 'express';
import { Container } from '../../../container';

export class RoomController {
  constructor(private readonly c: Container) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const date = String(req.query.date);
      const minCapacity = req.query.minCapacity ? Number(req.query.minCapacity) : undefined;
      const rooms = await this.c.listAvailableRooms.execute(date, minCapacity);
      res.json(rooms);
    } catch (e) {
      next(e);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const room = await this.c.manageRoom.create(req.body);
      res.status(201).json(room);
    } catch (e) {
      next(e);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.c.manageRoom.delete(req.params.name);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };
}