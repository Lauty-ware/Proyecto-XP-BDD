import { When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { CustomWorld } from '../support/world';

When(
  '{string} cancela su reserva en {string} para el día {string}',
  async function (this: CustomWorld, email: string, roomName: string, date: string) {
    try {
      await this.container.cancelReservation.execute({ userEmail: email, roomName, date });
      this.lastError = null;
    } catch (e) {
      this.lastError = e as Error;
    }
  }
);

Then('la cancelación debe ser exitosa', function (this: CustomWorld) {
  assert.strictEqual(this.lastError, null, this.lastError?.message);
});

Then('la cancelación debe fallar con mensaje {string}', function (this: CustomWorld, msg: string) {
  assert.ok(this.lastError);
  assert.strictEqual(this.lastError?.message, msg);
});