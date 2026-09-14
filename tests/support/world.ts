import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { buildContainer, Container } from '../../src/container';

export class CustomWorld extends World {
  container: Container;
  lastUser: any = null;
  lastRoom: any = null;
  lastReservation: any = null;
  lastRooms: any[] = [];
  lastToken: string | null = null;
  lastError: Error | null = null;
  isAdmin = false;

  constructor(options: IWorldOptions) {
    super(options);
    this.container = buildContainer({
      jwtSecret: 'test-secret',
      jwtExpiresIn: '1h',
      bcryptRounds: 10
    });
    this.reset();
  }

  reset(): void {
    this.container = buildContainer({
      jwtSecret: 'test-secret',
      jwtExpiresIn: '1h',
      bcryptRounds: 10
    });
    this.lastUser = null;
    this.lastRoom = null;
    this.lastReservation = null;
    this.lastRooms = [];
    this.lastToken = null;
    this.lastError = null;
  }
}

export { CustomWorld as AppWorld };

setWorldConstructor(CustomWorld);
