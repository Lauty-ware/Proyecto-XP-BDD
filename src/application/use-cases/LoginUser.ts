import { User } from '../../domain/entities/User';
import { DomainError } from '../../domain/errors/DomainError';
import { UserRepository } from '../ports/UserRepository';

export interface Hasher {
  hash(plain: string): Promise<string>;
  compare(plain: string, hash: string): Promise<boolean>;
}

export interface TokenService {
  sign(payload: { sub: string; role: string }): string;
}

export class LoginUser {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: Hasher,
    private readonly tokens: TokenService
  ) {}

  async execute(email: string, password: string): Promise<{ token: string; user: User }> {
    const user = await this.users.findByEmail(email.trim().toLowerCase());
    if (!user) {
      throw new DomainError('Credenciales inválidas', 'INVALID_CREDENTIALS');
    }

    const ok = await this.hasher.compare(password, user.passwordHash);
    if (!ok) {
      throw new DomainError('Credenciales inválidas', 'INVALID_CREDENTIALS');
    }

    const token = this.tokens.sign({ sub: user.id, role: user.role });
    return { token, user };
  }
}