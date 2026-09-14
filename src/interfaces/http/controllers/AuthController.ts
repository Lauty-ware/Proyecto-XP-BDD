import { Request, Response, NextFunction } from 'express';
import { Container } from '../../../container';

export class AuthController {
  constructor(private readonly c: Container) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.c.registerUser.execute(req.body);
      res.status(201).json({ id: user.id, email: user.email, balance: user.balance });
    } catch (e) {
      next(e);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.c.loginUser.execute(req.body.email, req.body.password);
      res.status(200).json({ token: result.token, user: { id: result.user.id, email: result.user.email } });
    } catch (e) {
      next(e);
    }
  };
}