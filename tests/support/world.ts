import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { buildContainer, Container } from '../../src/container';

export class AppWorld extends World {
  container: Container;
  lastUser: any;
  lastRoom: any;
  lastReservation: any;
  lastRooms: any[];
  lastToken: string | null;
  lastError: Error | null;

  constructor(options: IWorldOptions) {
    super(options);
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

setWorldConstructor(AppWorld);
