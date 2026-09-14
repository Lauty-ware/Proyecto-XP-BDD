import jwt from 'jsonwebtoken';
import { TokenService } from '../../application/use-cases/LoginUser';

export class JwtService implements TokenService {
  constructor(private readonly secret: string, private readonly expiresIn: string = '1h') {}

  sign(payload: { sub: string; role: string }): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn } as jwt.SignOptions);
  }

  verify(token: string): { sub: string; role: string } {
    return jwt.verify(token, this.secret) as { sub: string; role: string };
  }
}