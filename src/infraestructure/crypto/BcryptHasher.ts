import bcrypt from 'bcryptjs';
import { Hasher } from '../../application/use-cases/RegisterUser';

export class BcryptHasher implements Hasher {
  constructor(private readonly rounds: number = 10) {}

  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.rounds);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}