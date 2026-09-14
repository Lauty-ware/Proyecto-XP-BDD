import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { CustomWorld } from '../support/world';
import { randomUUID } from 'crypto';

Given(
  'que no existe un usuario con email {string}',
  async function (this: CustomWorld, email: string) {
    const existing = await this.container.users.findByEmail(email);
    assert.strictEqual(existing, null);
  }
);

Given('que ya existe un usuario con email {string}', async function (this: CustomWorld, email: string) {
  await this.container.registerUser.execute({ email, password: 'Password123' });
});

Given(
  'que existe un usuario {string} con contraseña {string}',
  async function (this: CustomWorld, email: string, password: string) {
    await this.container.registerUser.execute({ email, password });
  }
);

Given(
  'que existe un usuario {string} con saldo {int}',
  async function (this: CustomWorld, email: string, balance: number) {
    const user = await this.container.registerUser.execute({ email, password: 'Password123' });
    user.balance = balance;
    await this.container.users.update(user);
  }
);

Given(
  'que existe la sala {string} con precio {int}',
  async function (this: CustomWorld, name: string, price: number) {
    await this.container.manageRoom.create({ name, capacity: 4, price });
  }
);

Given(
  'que existen las salas {string} y {string}',
  async function (this: CustomWorld, a: string, b: string) {
    await this.container.manageRoom.create({ name: a, capacity: 4, price: 50 });
    await this.container.manageRoom.create({ name: b, capacity: 4, price: 50 });
  }
);

Given(
  'que {string} ya reservó la sala {string} para el día {string}',
  async function (this: CustomWorld, email: string, roomName: string, date: string) {
    await this.container.reserveRoom.execute({ userEmail: email, roomName, date });
  }
);