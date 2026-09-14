import { randomUUID } from 'node:crypto';
import { User } from '../../domain/entities/User';
import { DomainError } from '../../domain/errors/DomainError';
import { UserRepository } from '../ports/UserRepository';

export interface Hasher {
  hash(plain: string): Promise<string>;
}

export interface RegisterUserInput {
  email: string;
  password: string;
}

export class RegisterUser {
  constructor(private readonly users: UserRepository, private readonly hasher: Hasher) {}

  async execute(input: RegisterUserInput): Promise<User> {
    const email = input.email.trim().toLowerCase();

    if (!this.isValidEmail(email)) {
      throw new DomainError('El email no es válido', 'INVALID_EMAIL');
    }
    if (input.password.length < 8) {
      throw new DomainError('La contraseña debe tener al menos 8 caracteres', 'WEAK_PASSWORD');
    }

    const existing = await this.users.findByEmail(email);
    if (existing) {
      throw new DomainError('El email ya está registrado', 'EMAIL_TAKEN');
    }

    const passwordHash = await this.hasher.hash(input.password);
    const user: User = {
      id: randomUUID(),
      email,
      passwordHash,
      balance: 100, // saldo de bienvenida
      role: 'user',
      createdAt: new Date()
    };

    await this.users.save(user);
    return user;
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}