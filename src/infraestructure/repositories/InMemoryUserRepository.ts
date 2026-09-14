import { User } from '../../domain/entities/User';
import { UserRepository } from '../../application/ports/UserRepository';

export class InMemoryUserRepository implements UserRepository {
  private users = new Map<string, User>();

  async findByEmail(email: string): Promise<User | null> {
    for (const u of this.users.values()) if (u.email === email) return u;
    return null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, { ...user });
  }

  async update(user: User): Promise<void> {
    this.users.set(user.id, { ...user });
  }

  clear(): void {
    this.users.clear();
  }
}