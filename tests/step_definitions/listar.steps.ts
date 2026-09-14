import { When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { CustomWorld } from '../support/world';

When(
  'consulto salas disponibles para el día {string}',
  async function (this: CustomWorld, date: string) {
    this.lastRooms = await this.container.listAvailableRooms.execute(date);
  }
);

Then('debo ver {int} salas disponibles', function (this: CustomWorld, count: number) {
  assert.strictEqual(this.lastRooms.length, count);
});

Then('debo ver {int} sala disponible', function (this: CustomWorld, count: number) {
  assert.strictEqual(this.lastRooms.length, count);
});